import { c } from 'ttag';

import { Button } from '@proton/atoms/Button';
import useLoading from '@proton/hooks/useLoading';
import { APP_NAMES, BRAND_NAME, PLANS } from '@proton/shared/lib/constants';
import noop from '@proton/utils/noop';

import { SettingsParagraph, SettingsSection } from '../../account';
import { useCancelSubscriptionFlow } from './cancelSubscription';
import { useCancellationFlow } from './cancellationFlow';

const DowngradeSubscriptionSection = ({ app }: { app: APP_NAMES }) => {
    const [submitting, withSubmitting] = useLoading();

    const { redirectToCancellationFlow, b2cAccess, b2bAccess } = useCancellationFlow();
    const { cancelSubscription, cancelSubscriptionModals, loadingCancelSubscription } = useCancelSubscriptionFlow({
        app,
    });

    const handleCancelClick = () => {
        if (b2bAccess || b2cAccess) {
            redirectToCancellationFlow();
        } else {
            void withSubmitting(cancelSubscription().catch(noop));
        }
    };

    return (
        <SettingsSection>
            {cancelSubscriptionModals}
            <SettingsParagraph>
                {c('Info')
                    .t`When you cancel your current paid subscription, the balance of your subscription will be returned as account credits and you will be downgraded to the ${BRAND_NAME} ${PLANS.FREE} plan.`}
            </SettingsParagraph>
            <Button
                shape="outline"
                disabled={loadingCancelSubscription}
                loading={submitting}
                onClick={handleCancelClick}
                data-testid="UnsubscribeButton"
            >
                {c('Action').t`Continue`}
            </Button>
        </SettingsSection>
    );
};

export default DowngradeSubscriptionSection;
