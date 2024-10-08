import { c } from 'ttag';

import {
    CALENDAR_APP_NAME,
    DRIVE_APP_NAME,
    MAIL_APP_NAME,
    PASS_APP_NAME,
    PLANS,
    PLAN_NAMES,
    PROTON_SENTINEL_NAME,
    VPN_APP_NAME,
} from '@proton/shared/lib/constants';
import humanSize from '@proton/shared/lib/helpers/humanSize';
import { hasCancellablePlan } from '@proton/shared/lib/helpers/subscription';
import type { SubscriptionModel, SubscriptionPlan, UserModel } from '@proton/shared/lib/interfaces';

import type {
    ConfirmationModal,
    PlanConfig,
    PlanConfigFeatures,
    PlanConfigStorage,
    PlanConfigTestimonial,
} from '../interface';
import {
    getDefaultConfirmationModal,
    getDefaultReminder,
    getDefaultTBStorageWarning,
    getDefaultTestimonial,
} from './b2cCommonConfig';

export const getDuoConfig = (
    subscription: SubscriptionModel,
    user: UserModel,
    plan: SubscriptionPlan & { Name: PLANS },
    vpnCountries: number
): PlanConfig => {
    const currentPlan = PLANS.DUO;
    const planName = PLAN_NAMES[currentPlan];
    const planMaxSpace = humanSize({ bytes: plan.MaxSpace, unit: 'TB', fraction: 0 });

    const reminder = getDefaultReminder(planName);
    const testimonials: PlanConfigTestimonial = getDefaultTestimonial();

    const features: PlanConfigFeatures = {
        title: c('Subscription reminder').t`Unlimited privacy for two`,
        description: c('Subscription reminder')
            .t`${planName} gives you unlimited privacy and more storage for up to 2 people.`,
        features: [
            {
                icon: 'storage',
                text: c('Subscription reminder').t`${planMaxSpace} total storage`,
            },
            {
                icon: 'users',
                text: c('Subscription reminder').t`2 users`,
            },
            {
                icon: 'shield-half-filled',
                text: c('Subscription reminder').t`${PROTON_SENTINEL_NAME} program`,
            },
            {
                icon: 'life-ring',
                text: c('Subscription reminder').t`Priority support`,
            },
            {
                icon: 'brand-proton-mail',
                text: c('Subscription reminder').t`${MAIL_APP_NAME} and all premium productivity features`,
            },
            {
                icon: 'brand-proton-calendar',
                text: c('Subscription reminder').t`${CALENDAR_APP_NAME} including calendar sharing`,
            },
            {
                icon: 'brand-proton-drive',
                text: c('Subscription reminder').t`${DRIVE_APP_NAME} including version history`,
            },
            {
                icon: 'brand-proton-pass',
                text: c('Subscription reminder').t`${PASS_APP_NAME} including unlimited hide-my-email aliases`,
            },
            {
                icon: 'brand-proton-vpn',
                text: c('Subscription reminder')
                    .t`${VPN_APP_NAME} with access to all high-speed servers in ${vpnCountries} countries`,
            },
        ],
    };

    const cancellablePlan = hasCancellablePlan(subscription, user);
    const storage: PlanConfigStorage = getDefaultTBStorageWarning(planName, planMaxSpace, cancellablePlan);
    const confirmationModal: ConfirmationModal = getDefaultConfirmationModal(subscription, planName, cancellablePlan);

    return {
        planName,
        reminder,
        testimonials,
        features,
        storage,
        confirmationModal,
        plan: currentPlan,
    };
};
