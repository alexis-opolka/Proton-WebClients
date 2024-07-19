import { c } from 'ttag';

import { ChargebeePaypalWrapper } from '@proton/components/payments/chargebee/ChargebeeWrapper';
import { usePaymentFacade } from '@proton/components/payments/client-extensions';
import { useChargebeeContext } from '@proton/components/payments/client-extensions/useChargebeeContext';
import { PAYMENT_METHOD_TYPES } from '@proton/components/payments/core';
import type { PaymentProcessorHook } from '@proton/components/payments/react-extensions/interface';
import { useLoading } from '@proton/hooks';
import { checkInvoice, getPaymentsVersion } from '@proton/shared/lib/api/payments';
import { captureMessage } from '@proton/shared/lib/helpers/sentry';
import { toPrice } from '@proton/shared/lib/helpers/string';
import { getHasSomeVpnPlan } from '@proton/shared/lib/helpers/subscription';
import type { Currency } from '@proton/shared/lib/interfaces';
import { ChargebeeEnabled } from '@proton/shared/lib/interfaces';
import { getSentryError } from '@proton/shared/lib/keys';

import { EllipsisLoader, Field, FormModal, Input, Label, Price, PrimaryButton, Row } from '../../components';
import { useApiResult, useEventManager, useNotifications, useSubscription, useUser } from '../../hooks';
import PaymentWrapper from '../payments/PaymentWrapper';
import StyledPayPalButton from '../payments/StyledPayPalButton';
import { getInvoicePaymentsVersion } from './helpers';
import type { Invoice } from './interface';

interface CheckInvoiceResponse {
    Code: number;
    Currency: Currency;
    Amount: number;
    Gift: number;
    Credit: number;
    AmountDue: number;
}

export interface Props {
    invoice: Invoice;
    fetchInvoices: () => void;
    onClose?: () => void;
}

const PayInvoiceModal = ({ invoice, fetchInvoices, ...rest }: Props) => {
    const { createNotification } = useNotifications();
    const [loading, withLoading] = useLoading();
    const { call } = useEventManager();

    const invoicePaymentsVersion = getInvoicePaymentsVersion(invoice);
    const { result, loading: amountLoading } = useApiResult<CheckInvoiceResponse, typeof checkInvoice>(
        () => checkInvoice(invoice.ID, invoicePaymentsVersion),
        []
    );
    const [subscription] = useSubscription();
    const [user] = useUser();
    const hasSomeVpnPlan = getHasSomeVpnPlan(subscription);

    const { AmountDue, Amount, Currency, Credit } = result ?? {};

    const amount = AmountDue ?? 0;
    const currency = Currency as Currency;

    const chargebeeContext = useChargebeeContext();

    const forceInhouseSavedMethodProcessors = !invoice.IsExternal;
    const disableNewPaymentMethods =
        forceInhouseSavedMethodProcessors && user.ChargebeeUser === ChargebeeEnabled.CHARGEBEE_FORCED;

    const paymentFacade = usePaymentFacade({
        amount,
        currency,
        billingPlatform: subscription?.BillingPlatform,
        chargebeeUserExists: user.ChargebeeUserExists,
        forceInhouseSavedMethodProcessors,
        disableNewPaymentMethods,
        onChargeable: (operations) => {
            return withLoading(async () => {
                await operations.payInvoice(invoice.ID, invoicePaymentsVersion);
                await Promise.all([
                    call(), // Update user.Delinquent to hide TopBanner
                    fetchInvoices(),
                ]);
                rest.onClose?.();
                createNotification({ text: c('Success').t`Invoice paid` });
            });
        },
        flow: 'invoice',
        user,
    });

    const process = async (processor?: PaymentProcessorHook) =>
        withLoading(async () => {
            if (!processor) {
                return;
            }

            try {
                await processor.processPaymentToken();
            } catch (e) {
                const error = getSentryError(e);
                if (error) {
                    const context = {
                        invoiceId: invoice.ID,
                        currency,
                        amount,
                        processorType: paymentFacade.selectedProcessor?.meta.type,
                        paymentMethod: paymentFacade.selectedMethodType,
                        paymentMethodValue: paymentFacade.selectedMethodValue,
                        paymentsVersion: getPaymentsVersion(),
                        chargebeeEnabled: chargebeeContext.enableChargebeeRef.current,
                    };

                    captureMessage('Payments: failed to pay invoice', {
                        level: 'error',
                        extra: { error, context },
                    });
                }
            }
        });

    const submit = (() => {
        if (paymentFacade.selectedMethodValue === PAYMENT_METHOD_TYPES.PAYPAL) {
            return (
                <StyledPayPalButton
                    type="submit"
                    paypal={paymentFacade.paypal}
                    amount={amount}
                    currency={paymentFacade.currency}
                    loading={loading}
                    data-testid="paypal-button"
                />
            );
        }

        if (
            paymentFacade.selectedMethodType === PAYMENT_METHOD_TYPES.CHARGEBEE_PAYPAL &&
            // if the invoice is internal, then we don't render the CB paypal button and fallback to the regular pay
            // button
            !forceInhouseSavedMethodProcessors
        ) {
            return (
                <div className="flex justify-end">
                    <div className="w-1/2 mr-1">
                        <ChargebeePaypalWrapper
                            chargebeePaypal={paymentFacade.chargebeePaypal}
                            iframeHandles={paymentFacade.iframeHandles}
                        />
                    </div>
                </div>
            );
        }

        return (
            <PrimaryButton
                loading={loading}
                disabled={paymentFacade.methods.loading || !paymentFacade.userCanTriggerSelected}
                type="submit"
                data-testid="pay-invoice-button"
            >
                {c('Action').t`Pay`}
            </PrimaryButton>
        );
    })();

    return (
        <FormModal
            onSubmit={() => process(paymentFacade.selectedProcessor)}
            loading={loading}
            close={c('Action').t`Close`}
            submit={submit}
            title={c('Title').t`Pay invoice`}
            data-testid="pay-invoice-modal"
            {...rest}
        >
            {amountLoading ? (
                <EllipsisLoader />
            ) : (
                <>
                    {!!Credit && (
                        <>
                            <Row>
                                <Label>{c('Label').t`Amount`}</Label>
                                <Field className="text-right">
                                    <Price className="label" currency={currency}>
                                        {Amount ?? 0}
                                    </Price>
                                </Field>
                            </Row>
                            <Row>
                                <Label>{c('Label').t`Credits used`}</Label>
                                <Field className="text-right">
                                    <Price className="label" currency={currency}>
                                        {Credit}
                                    </Price>
                                </Field>
                            </Row>
                        </>
                    )}
                    <Row>
                        <Label>{c('Label').t`Amount due`}</Label>
                        <Field>
                            <Input
                                className="field--highlight pointer-events-none text-strong text-right"
                                readOnly
                                value={toPrice(amount, currency)}
                            />
                        </Field>
                    </Row>
                    {amount > 0 ? (
                        <PaymentWrapper
                            {...paymentFacade}
                            onPaypalCreditClick={() => process(paymentFacade.paypalCredit)}
                            noMaxWidth
                            hasSomeVpnPlan={hasSomeVpnPlan}
                            disableNewPaymentMethods={disableNewPaymentMethods}
                        />
                    ) : null}
                </>
            )}
        </FormModal>
    );
};

export default PayInvoiceModal;
