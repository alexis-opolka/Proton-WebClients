import { useGetCalendarKeys } from '@proton/components/hooks/useGetDecryptedPassphraseAndCalendarKeys';
import { withPmAttendees } from '@proton/shared/lib/calendar/attendees';
import { getBase64SharedSessionKey } from '@proton/shared/lib/calendar/crypto/keys/helpers';
import { getSelfAttendeeToken } from '@proton/shared/lib/calendar/mailIntegration/invite';
import { getMemberAndAddress } from '@proton/shared/lib/calendar/members';
import { getIsRruleEqual } from '@proton/shared/lib/calendar/recurrence/rruleEqual';
import withVeventRruleWkst from '@proton/shared/lib/calendar/recurrence/rruleWkst';
import { buildVcalOrganizer, dayToNumericDay } from '@proton/shared/lib/calendar/vcalConverter';
import { getHasAttendees } from '@proton/shared/lib/calendar/vcalHelper';
import { WeekStartsOn } from '@proton/shared/lib/date-fns-utc/interface';
import { omit } from '@proton/shared/lib/helpers/object';
import { Address, Api } from '@proton/shared/lib/interfaces';
import { CalendarBootstrap, SyncMultipleApiResponse } from '@proton/shared/lib/interfaces/calendar';
import { VcalVeventComponent } from '@proton/shared/lib/interfaces/calendar/VcalModel';
import { GetAddressKeys } from '@proton/shared/lib/interfaces/hooks/GetAddressKeys';
import { GetCanonicalEmailsMap } from '@proton/shared/lib/interfaces/hooks/GetCanonicalEmailsMap';
import noop from '@proton/utils/noop';

import { getRecurringEventUpdatedText, getSingleEventText } from '../../../components/eventModal/eventForm/i18n';
import { modelToVeventComponent } from '../../../components/eventModal/eventForm/modelToProperties';
import { getCanEditSharedEventData } from '../../../helpers/event';
import { EventNewData, EventOldData } from '../../../interfaces/EventData';
import {
    INVITE_ACTION_TYPES,
    InviteActions,
    OnSendPrefsErrors,
    ReencryptInviteActionData,
    SendIcs,
    SendIcsActionData,
    UpdatePartstatOperation,
    UpdatePersonalPartOperation,
} from '../../../interfaces/Invite';
import getEditEventData from '../event/getEditEventData';
import getSingleEditRecurringData from '../event/getSingleEditRecurringData';
import { getIsCalendarEvent } from '../eventStore/cache/helper';
import { GetDecryptedEventCb } from '../eventStore/interface';
import getAllEventsByUID from '../getAllEventsByUID';
import { SyncEventActionOperations } from '../getSyncMultipleEventsPayload';
import { CalendarViewEventTemporaryEvent, OnSaveConfirmationCb } from '../interface';
import getRecurringSaveType from './getRecurringSaveType';
import getRecurringUpdateAllPossibilities from './getRecurringUpdateAllPossibilities';
import getSaveRecurringEventActions from './getSaveRecurringEventActions';
import getSaveSingleEventActions from './getSaveSingleEventActions';
import { getEquivalentAttendeesSend, getUpdatedSaveInviteActions } from './inviteActions';
import { getOriginalEvent, getRecurrenceEvents } from './recurringHelper';
import { withVeventSequence } from './sequence';

const getSaveSingleEventActionsHelper = async ({
    newEditEventData,
    oldEditEventData,
    getAddressKeys,
    getCalendarKeys,
    onSaveConfirmation,
    sendIcs,
    reencryptSharedEvent,
    onSendPrefsErrors,
    inviteActions,
    hasDefaultNotifications,
    canEditOnlyPersonalPart,
    isAttendee,
    onEquivalentAttendees,
    handleSyncActions,
}: {
    newEditEventData: EventNewData;
    oldEditEventData: EventOldData;
    getAddressKeys: GetAddressKeys;
    getCalendarKeys: ReturnType<typeof useGetCalendarKeys>;
    sendIcs: SendIcs;
    reencryptSharedEvent: (data: ReencryptInviteActionData) => Promise<void>;
    onSendPrefsErrors: OnSendPrefsErrors;
    onSaveConfirmation: OnSaveConfirmationCb;
    onEquivalentAttendees: (veventComponent: VcalVeventComponent, inviteActions: InviteActions) => Promise<void>;
    inviteActions: InviteActions;
    hasDefaultNotifications: boolean;
    canEditOnlyPersonalPart: boolean;
    isAttendee: boolean;
    handleSyncActions: (actions: SyncEventActionOperations[]) => Promise<SyncMultipleApiResponse[]>;
}) => {
    if (!oldEditEventData.veventComponent) {
        throw new Error('Cannot update event without old data');
    }
    const newVeventWithSequence = withVeventSequence(
        newEditEventData.veventComponent,
        oldEditEventData.veventComponent
    );
    const updatedInviteActions = getUpdatedSaveInviteActions({
        inviteActions,
        newVevent: newVeventWithSequence,
        oldVevent: oldEditEventData.veventComponent,
    });
    const sharedSessionKey = await getBase64SharedSessionKey({
        calendarEvent: oldEditEventData.eventData,
        getCalendarKeys,
        getAddressKeys,
    });
    if (sharedSessionKey) {
        updatedInviteActions.sharedEventID = oldEditEventData.eventData.SharedEventID;
        updatedInviteActions.sharedSessionKey = sharedSessionKey;
    }
    const {
        multiSyncActions,
        updatePartstatActions,
        updatePersonalPartActions,
        inviteActions: saveInviteActions,
        sendActions,
        hasStartChanged,
    } = await getSaveSingleEventActions({
        newEditEventData: { ...newEditEventData, veventComponent: newVeventWithSequence },
        oldEditEventData,
        getCalendarKeys,
        onSaveConfirmation,
        inviteActions: updatedInviteActions,
        hasDefaultNotifications,
        canEditOnlyPersonalPart,
        isAttendee,
        sendIcs,
        reencryptSharedEvent,
        onSendPrefsErrors,
        onEquivalentAttendees,
        handleSyncActions,
    });
    const successText = getSingleEventText(oldEditEventData, newEditEventData, saveInviteActions);
    return {
        syncActions: multiSyncActions,
        updatePartstatActions,
        updatePersonalPartActions,
        texts: {
            success: successText,
        },
        sendActions,
        hasStartChanged,
    };
};

interface Arguments {
    temporaryEvent: CalendarViewEventTemporaryEvent;
    weekStartsOn: WeekStartsOn;
    addresses: Address[];
    inviteActions: InviteActions;
    isDuplicatingEvent: boolean;
    onSaveConfirmation: OnSaveConfirmationCb;
    onEquivalentAttendees: (attendees: string[][]) => Promise<void>;
    api: Api;
    getEventDecrypted: GetDecryptedEventCb;
    getCalendarBootstrap: (CalendarID: string) => CalendarBootstrap;
    getCalendarKeys: ReturnType<typeof useGetCalendarKeys>;
    getAddressKeys: GetAddressKeys;
    getCanonicalEmailsMap: GetCanonicalEmailsMap;
    sendIcs: SendIcs;
    reencryptSharedEvent: (data: ReencryptInviteActionData) => Promise<void>;
    onSendPrefsErrors: OnSendPrefsErrors;
    handleSyncActions: (actions: SyncEventActionOperations[]) => Promise<SyncMultipleApiResponse[]>;
}

const getSaveEventActions = async ({
    temporaryEvent,
    weekStartsOn,
    addresses,
    inviteActions,
    isDuplicatingEvent,
    onSaveConfirmation,
    onEquivalentAttendees,
    api,
    getEventDecrypted,
    getCalendarBootstrap,
    getCalendarKeys,
    getAddressKeys,
    getCanonicalEmailsMap,
    sendIcs,
    reencryptSharedEvent,
    onSendPrefsErrors,
    handleSyncActions,
}: Arguments): Promise<{
    syncActions: SyncEventActionOperations[];
    updatePartstatActions?: UpdatePartstatOperation[];
    updatePersonalPartActions?: UpdatePersonalPartOperation[];
    sendActions?: SendIcsActionData[];
    texts?: { success: string };
    hasStartChanged?: boolean;
}> => {
    const {
        tmpOriginalTarget: { data: { eventData: oldEventData, eventRecurrence, eventReadResult } } = { data: {} },
        tmpData,
        tmpData: {
            calendar: { id: newCalendarID, isOwned: isOwnedCalendar, isWritable: isCalendarWritable },
            member: { memberID: newMemberID, addressID: newAddressID },
            frequencyModel,
            hasDefaultNotifications,
        },
    } = temporaryEvent;
    const { isAttendee, isOrganizer, organizer, selfAddress: existingSelfAddress } = tmpData;
    const isInvitation = !!organizer;
    const canEditOnlyPersonalPart = !getCanEditSharedEventData({
        isOwnedCalendar,
        isCalendarWritable,
        isOrganizer,
        isAttendee,
        isInvitation,
        selfAddress: existingSelfAddress,
    });
    const selfAddress = addresses.find(({ ID }) => ID === newAddressID);
    if (!selfAddress) {
        throw new Error('Wrong member data');
    }

    // All updates will remove any existing exdates since they would be more complicated to normalize
    const modelVeventComponent = modelToVeventComponent(tmpData) as VcalVeventComponent;
    // In case the event has attendees but no organizer, add it here
    if (!modelVeventComponent.organizer && modelVeventComponent.attendee?.length) {
        const organizerEmail = selfAddress?.Email;
        if (!organizerEmail) {
            throw new Error('Missing organizer');
        }
        modelVeventComponent.organizer = buildVcalOrganizer(organizerEmail, organizerEmail);
    }
    // Also add selfAddress to inviteActions if it doesn't have one
    const inviteActionsWithSelfAddress = { ...inviteActions };
    if (!inviteActions.selfAddress) {
        inviteActionsWithSelfAddress.selfAddress = selfAddress;
    }
    // Handle duplicate attendees if any
    const newVeventComponent = await withPmAttendees(modelVeventComponent, getCanonicalEmailsMap);
    const handleEquivalentAttendees = async (vevent: VcalVeventComponent, inviteActions: InviteActions) => {
        const equivalentAttendees = getEquivalentAttendeesSend(vevent, inviteActions);
        if (equivalentAttendees) {
            await onEquivalentAttendees(equivalentAttendees);
        }
    };

    const newEditEventData = {
        veventComponent: newVeventComponent,
        calendarID: newCalendarID,
        memberID: newMemberID,
        addressID: newAddressID,
    };

    /**
     * CREATION
     */
    if (!oldEventData) {
        // add sequence and WKST (if needed)
        const wkst = isDuplicatingEvent ? dayToNumericDay(frequencyModel.vcalRruleValue?.wkst || 'MO') : weekStartsOn;
        const newVeventWithSequence = {
            ...withVeventRruleWkst(omit(newVeventComponent, ['exdate']), wkst),
            sequence: { value: 0 },
        };
        const updatedInviteActions = getUpdatedSaveInviteActions({
            inviteActions: inviteActionsWithSelfAddress,
            newVevent: newVeventWithSequence,
        });

        const {
            multiSyncActions = [],
            inviteActions: saveInviteActions,
            sendActions,
        } = await getSaveSingleEventActions({
            newEditEventData: {
                ...newEditEventData,
                veventComponent: newVeventWithSequence,
            },
            hasDefaultNotifications,
            canEditOnlyPersonalPart,
            isAttendee,
            inviteActions: updatedInviteActions,
            getCalendarKeys,
            onSaveConfirmation,
            sendIcs,
            reencryptSharedEvent,
            onEquivalentAttendees: handleEquivalentAttendees,
            onSendPrefsErrors,
            handleSyncActions,
        });

        const successText = getSingleEventText(undefined, newEditEventData, saveInviteActions);
        return {
            syncActions: multiSyncActions,
            texts: { success: successText },
            sendActions,
        };
    }

    /**
     * EDITION
     */
    const calendarBootstrap = getCalendarBootstrap(oldEventData.CalendarID);
    if (!calendarBootstrap) {
        throw new Error('Trying to edit event without a calendar');
    }
    if (!getIsCalendarEvent(oldEventData) || !eventReadResult?.result) {
        throw new Error('Trying to edit event without event information');
    }

    const oldEditEventData = getEditEventData({
        eventData: oldEventData,
        eventResult: eventReadResult.result,
        memberResult: getMemberAndAddress(addresses, calendarBootstrap.Members, oldEventData.Author),
    });

    // WKST should be preserved unless the user edited the RRULE explicitly. Otherwise, add it here (if needed)
    const oldWkst = dayToNumericDay(oldEditEventData.veventComponent?.rrule?.value.wkst || 'MO');
    const newWkst = getIsRruleEqual(oldEditEventData.veventComponent?.rrule, newVeventComponent.rrule, true)
        ? oldWkst
        : weekStartsOn;
    newEditEventData.veventComponent = withVeventRruleWkst(omit(newVeventComponent, ['exdate']), newWkst);

    const isSingleEdit = !!oldEditEventData.recurrenceID;
    /**
     * If it's not an occurrence of a recurring event, or a single edit of a recurring event
     */
    if (!eventRecurrence && !isSingleEdit) {
        return getSaveSingleEventActionsHelper({
            newEditEventData,
            oldEditEventData,
            inviteActions: inviteActionsWithSelfAddress,
            hasDefaultNotifications,
            canEditOnlyPersonalPart,
            isAttendee,
            getAddressKeys,
            getCalendarKeys,
            onSaveConfirmation,
            sendIcs,
            reencryptSharedEvent,
            onEquivalentAttendees: handleEquivalentAttendees,
            onSendPrefsErrors,
            handleSyncActions,
        });
    }

    const recurrences = await getAllEventsByUID(api, oldEditEventData.calendarID, oldEditEventData.uid);
    const originalEventData = getOriginalEvent(recurrences);
    const isOrphanSingleEdit = isSingleEdit && !originalEventData;

    /**
     * If it's an orphan single edit, treat as a single event
     */
    if (isOrphanSingleEdit) {
        return getSaveSingleEventActionsHelper({
            newEditEventData,
            oldEditEventData,
            inviteActions: inviteActionsWithSelfAddress,
            hasDefaultNotifications,
            canEditOnlyPersonalPart,
            isAttendee,
            getAddressKeys,
            getCalendarKeys,
            onSaveConfirmation,
            sendIcs,
            reencryptSharedEvent,
            onEquivalentAttendees: handleEquivalentAttendees,
            onSendPrefsErrors,
            handleSyncActions,
        });
    }

    /**
     * We're editing an occurrence of a recurring event
     */
    const originalEventResult = originalEventData ? await getEventDecrypted(originalEventData).catch(noop) : undefined;
    if (!originalEventData || !originalEventResult?.[0]) {
        throw new Error('Original event not found');
    }

    const originalEditEventData = getEditEventData({
        eventData: originalEventData,
        eventResult: originalEventResult,
        memberResult: getMemberAndAddress(addresses, calendarBootstrap.Members, originalEventData.Author),
    });

    const actualEventRecurrence =
        eventRecurrence ||
        getSingleEditRecurringData(originalEditEventData.mainVeventComponent, oldEditEventData.mainVeventComponent);
    const singleEdits = getRecurrenceEvents(recurrences, originalEditEventData.eventData)
        // Since this is inclusive, ignore this single edit instance event since that would always become the new start
        .filter((event) => {
            return event.ID !== oldEditEventData.eventData.ID;
        });
    const exdates = originalEditEventData.mainVeventComponent.exdate || [];

    const { updateAllPossibilities, hasModifiedDateTimes, isRruleEqual } = getRecurringUpdateAllPossibilities({
        originalVeventComponent: originalEditEventData.mainVeventComponent,
        oldVeventComponent: oldEditEventData.mainVeventComponent,
        newVeventComponent: newEditEventData.veventComponent,
        recurrence: actualEventRecurrence,
        isOrganizer,
        hasSingleEdits: singleEdits.length >= 1,
    });
    const isBreakingChange = hasModifiedDateTimes || !isRruleEqual;

    const selfAttendeeToken = getSelfAttendeeToken(newEditEventData.veventComponent, addresses);
    const hasModifiedCalendar = originalEditEventData.calendarID !== newEditEventData.calendarID;
    // check if the rrule has been explicitly modified. Modifications due to WKST change are ignored here
    const hasModifiedRrule = tmpData.hasTouchedRrule && !isRruleEqual;
    const updatedSaveInviteActions = getUpdatedSaveInviteActions({
        inviteActions: inviteActionsWithSelfAddress,
        newVevent: newEditEventData.veventComponent,
        oldVevent: originalEditEventData.veventComponent,
        hasModifiedDateTimes,
    });
    const isSendInviteType = [INVITE_ACTION_TYPES.SEND_INVITATION, INVITE_ACTION_TYPES.SEND_UPDATE].includes(
        updatedSaveInviteActions.type
    );
    await handleEquivalentAttendees(newEditEventData.veventComponent, updatedSaveInviteActions);
    const hasAttendees = getHasAttendees(newEditEventData.veventComponent);

    const { type: saveType, inviteActions: updatedInviteActions } = await getRecurringSaveType({
        originalEditEventData,
        canOnlySaveAll:
            actualEventRecurrence.isSingleOccurrence ||
            hasModifiedCalendar ||
            (canEditOnlyPersonalPart && !isSingleEdit),
        canOnlySaveThis: canEditOnlyPersonalPart && isSingleEdit,
        // if we have to notify participants or the event has participants and we did no modification of event details
        cannotDeleteThisAndFuture: isSendInviteType || hasAttendees,
        hasModifiedRrule,
        hasModifiedCalendar,
        isBreakingChange,
        inviteActions: updatedSaveInviteActions,
        onSaveConfirmation,
        recurrence: actualEventRecurrence,
        singleEdits,
        exdates,
        isOrganizer,
        isAttendee,
        canEditOnlyPersonalPart,
        selfAttendeeToken,
    });
    const {
        multiSyncActions,
        updatePartstatActions,
        updatePersonalPartActions,
        inviteActions: saveInviteActions,
        sendActions,
        hasStartChanged,
    } = await getSaveRecurringEventActions({
        type: saveType,
        recurrences,
        recurrence: actualEventRecurrence,
        updateAllPossibilities,
        newEditEventData,
        oldEditEventData,
        originalEditEventData,
        addresses,
        getAddressKeys,
        getCalendarKeys,
        inviteActions: updatedInviteActions,
        hasDefaultNotifications,
        canEditOnlyPersonalPart,
        isOrganizer,
        isAttendee,
        isBreakingChange,
        sendIcs,
        handleSyncActions,
        reencryptSharedEvent,
        onEquivalentAttendees: handleEquivalentAttendees,
        onSendPrefsErrors,
        selfAttendeeToken,
    });
    const successText = getRecurringEventUpdatedText(saveType, saveInviteActions);

    return {
        syncActions: multiSyncActions,
        updatePartstatActions,
        updatePersonalPartActions,
        texts: { success: successText },
        sendActions,
        hasStartChanged,
    };
};

export default getSaveEventActions;
