/**
 * Groups elements in an array by a provided comparison function.
 * E.g. `[1, 1, 2, 3, 3] => [[1, 1], [2], [3, 3]]`
 */
export const groupWith = <T>(compare: (a: T, b: T) => boolean, arr: T[] = []) => {
    const { groups } = arr.reduce<{ groups: T[][]; remaining: T[] }>(
        (acc, a) => {
            const { groups, remaining } = acc;
            const group = remaining.filter((b) => compare(a, b));

            if (group.length) {
                acc.groups = [...groups, group];
                acc.remaining = remaining.filter((b) => !compare(a, b));
                return acc;
            }

            return acc;
        },
        { groups: [], remaining: arr }
    );
    return groups;
};

/**
 * Determine if two arrays are shallowy equal (i.e. they have the same length and the same elements)
 */
export const shallowEqual = <T>(a: T[], b: T[]) => {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
};

/**
 * Basic comparator function that transforms order via >,< into the numeric order that sorting functions typically require
 */
export const compare = (a: any, b: any) => {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
};

export const mergeUint8Arrays = (arrays: Uint8Array[]) => {
    const length = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const chunksAll = new Uint8Array(length);
    arrays.reduce((position, arr) => {
        chunksAll.set(arr, position);
        return position + arr.length;
    }, 0);
    return chunksAll;
};

export function areUint8Arrays(arr: any[]): arr is Uint8Array[] {
    return arr.every((el) => el instanceof Uint8Array);
}

export const addItem = <T>(array: T[], item: T) => array.concat(item);

export const updateItem = <T>(array: T[], index: number, newItem: T) => {
    return array.map((item, i) => {
        if (i !== index) {
            return item;
        }
        return newItem;
    });
};

export const partition = <T, K = T>(arr: (T | K)[], predicate: (item: T | K) => item is T): [T[], K[]] =>
    arr.reduce<[T[], K[]]>(
        (accumulator, current) => {
            if (predicate(current)) {
                accumulator[0].push(current);
            } else {
                accumulator[1].push(current);
            }

            return accumulator;
        },
        [[], []]
    );

/**
 * Fisher–Yates shuffle implementation - https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 */
export const shuffle = <T>(array: T[]): T[] => {
    const arrayCopy = [...array];
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }

    return arrayCopy;
};

export const last = <T>(array: T[]): T | undefined => {
    return array[array.length - 1];
};
