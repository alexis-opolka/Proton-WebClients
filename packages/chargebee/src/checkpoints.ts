export const chargebeeWrapperVersion = '1.1.0';

export type Checkpoint = {
    name: string;
    data: any;
};

const checkpoints: Checkpoint[] = [];

export function addCheckpoint(name: string, data?: any) {
    checkpoints.push({ name, data });
}

export function getCheckpoints() {
    return checkpoints;
}
