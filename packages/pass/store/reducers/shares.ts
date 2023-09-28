import type { AnyAction } from 'redux';

import type { Share } from '@proton/pass/types';
import { ShareRole, ShareType } from '@proton/pass/types';
import type { PendingInvite, ShareMember } from '@proton/pass/types/data/invites';
import { or } from '@proton/pass/utils/fp';
import { fullMerge, objectDelete, objectMap, partialMerge } from '@proton/pass/utils/object';

import {
    bootSuccess,
    shareDeleteSync,
    shareEditSync,
    shareEvent,
    sharesSync,
    syncShareInvites,
    syncShareMembers,
    syncSuccess,
    vaultCreationFailure,
    vaultCreationIntent,
    vaultCreationSuccess,
    vaultDeleteFailure,
    vaultDeleteIntent,
    vaultDeleteSuccess,
    vaultEditFailure,
    vaultEditIntent,
    vaultEditSuccess,
    vaultInviteCreationSuccess,
    vaultInviteResendSuccess,
    vaultRemoveAccessSuccess,
    vaultSetPrimaryFailure,
    vaultSetPrimaryIntent,
    vaultSetPrimarySuccess,
    vaultSetPrimarySync,
} from '../actions';
import { sanitizeWithCallbackAction } from '../actions/with-callback';
import withOptimistic from '../optimistic/with-optimistic';

export type ShareItem<T extends ShareType = ShareType> = Share<T> & {
    invites?: PendingInvite[];
    members?: ShareMember[];
};

export type SharesState = { [shareId: string]: ShareItem };

/**
 * Share actions are optimistic but do not allow retries
 * as of now (no fail optimistic matcher defined)
 */
export const withOptimisticShares = withOptimistic<SharesState>(
    [
        {
            initiate: vaultCreationIntent.optimisticMatch,
            revert: [vaultCreationFailure.optimisticMatch, vaultCreationSuccess.optimisticMatch],
        },
        {
            initiate: vaultEditIntent.optimisticMatch,
            revert: vaultEditFailure.optimisticMatch,
            commit: vaultEditSuccess.optimisticMatch,
        },
        {
            initiate: vaultDeleteIntent.optimisticMatch,
            revert: vaultDeleteFailure.optimisticMatch,
            commit: vaultDeleteSuccess.optimisticMatch,
        },
        {
            initiate: vaultSetPrimaryIntent.optimisticMatch,
            revert: vaultSetPrimaryFailure.optimisticMatch,
            commit: vaultSetPrimarySuccess.optimisticMatch,
        },
    ],
    (state = {}, action: AnyAction) => {
        if (bootSuccess.match(action) && action.payload.sync?.shares !== undefined) {
            return action.payload.sync.shares;
        }

        if (syncSuccess.match(action)) {
            return action.payload.shares;
        }

        if (sharesSync.match(action)) {
            return fullMerge(state, action.payload.shares);
        }

        if (shareEvent.match(action) && state !== null) {
            return partialMerge(state, {
                [action.payload.shareId]: { eventId: action.payload.Events.LatestEventID },
            });
        }

        if (vaultCreationIntent.match(action)) {
            const { id, content } = action.payload;

            return fullMerge(state, {
                [id]: {
                    shareId: id,
                    vaultId: id,
                    targetId: id,
                    content: content,
                    targetType: ShareType.Vault,
                    primary: false,
                    eventId: '',
                    targetMembers: 1,
                    owner: true,
                    shareRoleId: ShareRole.ADMIN,
                    shared: false,
                },
            });
        }

        if (vaultCreationSuccess.match(action)) {
            const { share } = action.payload;
            return fullMerge(state, { [share.shareId]: share });
        }

        if (vaultEditIntent.match(action)) {
            const { id, content } = action.payload;
            return partialMerge(state, { [id]: { content } });
        }

        if (shareEditSync.match(action)) {
            const { id, share } = action.payload;
            return fullMerge(state, { [id]: share });
        }

        if (vaultDeleteIntent.match(action)) {
            return objectDelete(state, action.payload.id);
        }

        if (shareDeleteSync.match(action)) {
            return objectDelete(state, action.payload.shareId);
        }

        if (or(vaultSetPrimaryIntent.match, vaultSetPrimarySync.match)(action)) {
            return objectMap(state!)((shareId, share) => ({ ...share, primary: shareId === action.payload.id }));
        }

        if (vaultInviteCreationSuccess.match(action)) {
            const { shareId, invites } = action.payload;
            return partialMerge(state, { [shareId]: { invites, shared: true } });
        }

        if (vaultInviteResendSuccess.match(action)) {
            const { shareId, inviteId } = action.payload;
            return partialMerge(state, { [shareId]: { inviteId, shared: true } });
        }

        if (syncShareInvites.match(action)) {
            const { shareId, invites } = action.payload;
            return partialMerge(state, { [shareId]: { invites, shared: true } });
        }

        if (syncShareMembers.match(action)) {
            const { shareId, members } = action.payload;
            return partialMerge(state, { [shareId]: { members, shared: true } });
        }

        if (vaultRemoveAccessSuccess.match(action)) {
            const { shareId, userShareId } = action.payload;
            return partialMerge(state, {
                [shareId]: {
                    // FIXME: state not properly updating
                    members: (state[shareId]?.members ?? []).filter(({ shareId }) => shareId !== userShareId),
                },
            });
        }

        return state;
    },
    { sanitizeAction: sanitizeWithCallbackAction }
);

export default withOptimisticShares.reducer;
