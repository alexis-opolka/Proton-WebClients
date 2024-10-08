import type { SimpleObject } from '@proton/components/containers/filters/interfaces';

import { V1 } from '../constants';
import type { SIEVE_VERSION } from '../interface';
import {
    buildBasicTree,
    buildCondition,
    buildFileInto,
    buildMark,
    buildRedirects,
    buildVacation,
    validateSimpleRepresentation,
} from './toSieveTree.helpers';

/**
 * Transforms a simple representation to a filter tree.
 */
export const toSieveTree = (simple: SimpleObject, version: SIEVE_VERSION = V1) => {
    try {
        validateSimpleRepresentation(simple);

        const condition = buildCondition(simple.Conditions);
        const fileInto = buildFileInto(simple.Actions.FileInto);
        const mark = buildMark(simple.Actions.Mark);
        const vacation = buildVacation(simple.Actions.Vacation, version);
        const redirects = buildRedirects(simple.Actions.Redirects);

        return buildBasicTree(
            {
                type: simple.Operator.value,
                requires: vacation.blocks.length ? ['vacation'] : [],
                tests: condition.tests,
                comparators: condition.comparators,
                dollarNeeded: condition.dollarNeeded || fileInto.dollarNeeded || vacation.dollarNeeded,
                thens: [...fileInto.blocks, ...mark.blocks, ...vacation.blocks, ...redirects.blocks],
            },
            version
        );
    } catch (exception) {
        throw exception;
    }
};
