import { memo, useState } from 'react';

import { c } from 'ttag';

import type { Label } from '@proton/shared/lib/interfaces/Label';

import type { UnreadCounts } from './MailSidebarList';
import SidebarItem from './SidebarItem';
import SidebarLabelActions from './SidebarLabelActions';

interface LabelProps {
    currentLabelID: string;
    counterMap: UnreadCounts;
    label: Label;
    updateFocusItem: (item: string) => void;
}

const SidebarLabel = ({ currentLabelID, counterMap, label, updateFocusItem }: LabelProps) => {
    const [isOptionDropdownOpened, setIsOptionDropdownOpened] = useState(false);

    return (
        <SidebarItem
            currentLabelID={currentLabelID}
            labelID={label.ID}
            isOptionDropdownOpened={isOptionDropdownOpened}
            icon="circle-filled"
            iconSize={4}
            text={label.Name}
            color={label.Color}
            isFolder={false}
            isLabel={true}
            unreadCount={counterMap[label.ID]}
            id={label.ID}
            onFocus={updateFocusItem}
            itemOptions={
                <SidebarLabelActions type={'label'} element={label} onToggleDropdown={setIsOptionDropdownOpened} />
            }
        />
    );
};

interface LabelsProps {
    currentLabelID: string;
    counterMap: UnreadCounts;
    labels: Label[];
    updateFocusItem: (item: string) => void;
}

const SidebarLabels = ({ currentLabelID, counterMap, labels, updateFocusItem }: LabelsProps) => {
    return labels.length === 0 ? (
        <div className="py-2 ml-7 text-sm color-weak">{c('Description').t`No labels`}</div>
    ) : (
        <>
            {labels.map((label) => (
                <SidebarLabel
                    key={label.ID}
                    label={label}
                    updateFocusItem={updateFocusItem}
                    currentLabelID={currentLabelID}
                    counterMap={counterMap}
                />
            ))}
        </>
    );
};

export default memo(SidebarLabels);
