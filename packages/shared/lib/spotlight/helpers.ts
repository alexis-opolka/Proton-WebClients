import type { EnvironmentExtended } from '@proton/shared/lib/interfaces';
import type { SpotlightDate } from '@proton/shared/lib/spotlight/interface';

export const getEnvironmentDate = (
    currentEnvironment: EnvironmentExtended | undefined,
    spotlightDates: SpotlightDate
) => {
    if (currentEnvironment) {
        const environmentDate = spotlightDates[currentEnvironment];
        if (environmentDate !== undefined) {
            return environmentDate;
        }
    }
    return spotlightDates.default;
};
