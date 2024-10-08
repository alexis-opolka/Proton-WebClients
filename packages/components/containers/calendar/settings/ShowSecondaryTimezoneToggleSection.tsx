import { c } from 'ttag';

import type { CalendarUserSettings } from '@proton/shared/lib/interfaces/calendar';

import SettingsLayout from '../../account/SettingsLayout';
import SettingsLayoutLeft from '../../account/SettingsLayoutLeft';
import SettingsLayoutRight from '../../account/SettingsLayoutRight';
import ShowSecondaryTimezoneToggle from './ShowSecondaryTimezoneToggle';

interface Props {
    calendarUserSettings: CalendarUserSettings;
}

const ShowSecondaryTimezoneToggleSection = ({ calendarUserSettings }: Props) => {
    return (
        <SettingsLayout>
            <SettingsLayoutLeft>
                <label className="text-semibold" htmlFor="show-secondary-timezone" id="label-show-secondary-timezone">
                    <span className="mr-2">{c('Label').t`Show secondary time zone`}</span>
                </label>
            </SettingsLayoutLeft>
            <SettingsLayoutRight isToggleContainer>
                <ShowSecondaryTimezoneToggle calendarUserSettings={calendarUserSettings} />
            </SettingsLayoutRight>
        </SettingsLayout>
    );
};

export default ShowSecondaryTimezoneToggleSection;
