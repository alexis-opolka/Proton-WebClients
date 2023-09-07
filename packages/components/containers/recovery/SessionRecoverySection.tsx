import { c } from 'ttag';

import { Button, Href } from '@proton/atoms';
import useLoading from '@proton/hooks/useLoading';
import { updateSessionAccountRecovery } from '@proton/shared/lib/api/sessionRecovery';
import { getKnowledgeBaseUrl } from '@proton/shared/lib/helpers/url';

import { Toggle, useModalState } from '../../components';
import {
    useApi,
    useEventManager,
    useHasRecoveryMethod,
    useIsSessionRecoveryEnabled,
    useIsSessionRecoveryInitiationAvailable,
    useNotifications,
} from '../../hooks';
import SettingsLayout from '../account/SettingsLayout';
import SettingsLayoutLeft from '../account/SettingsLayoutLeft';
import SettingsLayoutRight from '../account/SettingsLayoutRight';
import SettingsParagraph from '../account/SettingsParagraph';
import SettingsSection from '../account/SettingsSection';
import InitiateSessionRecoveryModal from '../account/sessionRecovery/InitiateSessionRecoveryModal';

const SessionRecoverySection = () => {
    const api = useApi();
    const { call } = useEventManager();

    const [loadingSessionRecovery, withLoadingSessionRecovery] = useLoading();

    const [sessionRecoveryModal, setSessionRecoveryModalOpen, renderSessionRecoveryModal] = useModalState();

    const [hasRecoveryMethod, loadingUseHasRecoveryMethod] = useHasRecoveryMethod();
    const isSessionRecoveryEnabled = useIsSessionRecoveryEnabled();
    const isSessionRecoveryInitiationAvailable = useIsSessionRecoveryInitiationAvailable();

    const { createNotification } = useNotifications();

    const handleSessionRecoveryToggle = async (checked: boolean) => {
        await api(updateSessionAccountRecovery({ SessionAccountRecovery: checked ? 1 : 0 }));
        await call();
    };

    return (
        <>
            {renderSessionRecoveryModal && <InitiateSessionRecoveryModal confirmedStep {...sessionRecoveryModal} />}
            <SettingsSection>
                <SettingsParagraph>
                    {c('Info').t`Request a password reset from your Account settings. No recovery method needed.`}
                    <br />
                    <Href
                        href={
                            // TODO: add knowledge base url
                            getKnowledgeBaseUrl('/session-recovery')
                        }
                    >
                        {c('Link').t`Learn more`}
                    </Href>
                </SettingsParagraph>

                <SettingsLayout>
                    <SettingsLayoutLeft>
                        <label className="pt-0 mb-2 md:mb-0 text-semibold" htmlFor="signedInReset">
                            <span className="mr-2">{c('label').t`Allow password reset from settings`}</span>
                        </label>
                    </SettingsLayoutLeft>
                    <SettingsLayoutRight className="flex-item-fluid pt-2">
                        <div className="flex flex-align-items-center">
                            <Toggle
                                loading={loadingSessionRecovery}
                                checked={isSessionRecoveryEnabled}
                                disabled={loadingUseHasRecoveryMethod}
                                id="signedInReset"
                                onChange={({ target: { checked } }) => {
                                    if (!hasRecoveryMethod && !checked) {
                                        createNotification({
                                            text: c('Title')
                                                .t`To disallow password reset, you must have a recovery method set up.`,
                                        });
                                        return;
                                    }

                                    void withLoadingSessionRecovery(handleSessionRecoveryToggle(checked));
                                }}
                            />
                        </div>

                        {isSessionRecoveryInitiationAvailable && (
                            <Button className="mt-4" color="norm" onClick={() => setSessionRecoveryModalOpen(true)}>
                                {c('Action').t`Request password reset`}
                            </Button>
                        )}
                    </SettingsLayoutRight>
                </SettingsLayout>
            </SettingsSection>
        </>
    );
};

export default SessionRecoverySection;
