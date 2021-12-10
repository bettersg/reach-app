import { RuntimeOptions } from 'firebase-functions';

export enum Memory {
    LOW = '128MB',
    DEFAULT = '256MB',
    HIGH = '512MB',
    GB = '1GB',
    MAX = '2GB',
    MAXX = '4GB', // I hope you know what you're doing. This is bigger than default allocation on CF.
}

type MakeRuntimeOptions = (memory?: Memory, timeoutSeconds?: number) => RuntimeOptions;

export const makeRunTimeOption: MakeRuntimeOptions = (
    memory = Memory.DEFAULT,
    timeoutSeconds = 9
): RuntimeOptions => ({
    memory,
    timeoutSeconds,
});
