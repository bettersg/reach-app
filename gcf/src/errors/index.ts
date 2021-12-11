import * as functions from 'firebase-functions';
import { logger } from '@root/logger';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { AsyncReturnType } from '@root/utils/utils.types';

export interface ErrorDetails {
    code: functions.https.FunctionsErrorCode;
    message: string;
}

export function createErrorFromEnumeration<T extends Readonly<{ [errorCode: string]: ErrorDetails }>>(
    errorMap: T
) {
    return function (error: keyof T) {
        const details = error;
        const { code, message } = errorMap[error] as ErrorDetails;
        logger.warn(`Error. Code: ${code}. TT-custom code: ${details}. message: ${message}`);
        return new functions.https.HttpsError(code, message, details);
    };
}

export const GENERAL_ERRORS = {
    INTERNAL: {
        code: 'internal',
        message: 'Backend has an unexpected problem.',
    },
    INVALID_FIELD: {
        code: 'invalid-argument',
        message: 'Request data did not meet backend validation',
    },
    RATE_LIMIT: {
        code: 'resource-exhausted',
        message: 'Per-user quota exceeded',
    },
    DENIED: {
        code: 'permission-denied',
        message: 'Backend denies your access to this resource.',
    },
} as const;

/**
 * Light wrapper around firebase's HttpsError class - to enforce standardization of details and default logging.
 * @param error string, used as key for our enumerated errors.
 */
export const createError = createErrorFromEnumeration(GENERAL_ERRORS);

/** Used to wrap around Cloud Functions, to ensure we only return HttpsError to clients. */
export function wrapInHttpsError<T extends (...args: any[]) => Promise<any>>(
    handler: T
): (...args: Parameters<T>) => Promise<AsyncReturnType<T>> {
    return async (...args) => {
        try {
            return await handler(...args);
        } catch (error: any) {
            let errorToThrow: Error;
            if (error instanceof HttpsError) {
                errorToThrow = error;
            } else {
                logger.error([`${handler.name} execution failed with unhandleable error: `, error]);
                errorToThrow = createError('INTERNAL');
            }

            throw errorToThrow;
        }
    };
}
