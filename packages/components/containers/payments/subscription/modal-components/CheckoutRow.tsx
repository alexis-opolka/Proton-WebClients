import { ReactNode } from 'react';

import { c } from 'ttag';

import { Currency } from '@proton/shared/lib/interfaces';

import { Price } from '../../../../components';
import { classnames } from '../../../../helpers';

interface Props {
    title: ReactNode;
    amount: number;
    currency?: Currency;
    className?: string;
    suffix?: string;
    'data-testid'?: string;
}

const CheckoutRow = ({ title, amount = 0, currency, className = '', suffix, 'data-testid': dataTestId }: Props) => {
    if (amount === 0 && !currency) {
        return (
            <div className={classnames(['flex flex-nowrap flex-justify-space-between mb-4', className])}>
                <div className="pr0-5">{title}</div>
                <span>{c('Price').t`Free`}</span>
            </div>
        );
    }
    return (
        <div className={classnames(['flex flex-nowrap flex-justify-space-between mb-4', className])}>
            <div className="pr0-5">{title}</div>
            <Price currency={currency} suffix={suffix} data-testid={dataTestId}>
                {amount}
            </Price>
        </div>
    );
};

export default CheckoutRow;
