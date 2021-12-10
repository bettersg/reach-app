import { LogEntry, LogSeverity, write } from 'firebase-functions/lib/logger';
import { Log, Scope } from './logger.types';
import { isObject } from 'lodash';
import { inspect } from 'util';
import { get } from 'stack-trace';

export let logGlobalContext: { [key: string]: any } = {};

export function addLogGlobalContext(key: string, entry: any) {
    logGlobalContext[key] = entry;
}

/** Removes all context that were included in the logs. */
export function cleanLogGlobalContext() {
    logGlobalContext = {};
}

function checkIfObjectAndConvertToString(data: any) {
    if (isObject(data)) {
        return inspect(data);
    }

    return data;
}

function getFilePath() {
    // (code is all bundled into index, hence its the current default)
    const DEFAULT_FILEPATH = 'gcf/src/logger/index.ts';
    try {
        const testError = { stack: undefined };
        Error.captureStackTrace(testError);
        const stack: string = testError.stack ?? '';
        const file = stack.split('\n')[4];
        return file.substring(file.lastIndexOf('gcf/') + 'gcf/'.length, file.indexOf('.ts:'));
    } catch (e) {
        return DEFAULT_FILEPATH;
    }
}

function getScope(): Scope {
    const trace = get();

    const scope: Scope = {};

    // trace[0] => getScope, trace[1] -> wrapper function below
    // so we take trace[2] to get the correct scope of the caller
    const SUB_TRACE_START_INDEX = 2;
    scope.fileName = getFilePath();

    // To get the rest of the scope, we traveres down the stack and find the first named
    // function. This will allow us to handle scoping of anonymous functions/callbacks.
    for (let i = SUB_TRACE_START_INDEX; i < trace.length; i += 1) {
        const subTrace = trace[i];
        scope.functionName = subTrace?.getFunctionName();
        scope.methodName = subTrace?.getMethodName();

        if (scope.functionName) {
            break;
        }
    }

    return scope;
}

export function makeLogger(severity: LogSeverity): Log {
    return (message, additionalProperties) => {
        let messageString;

        // We want to accept all falsy values except undefined
        if (message !== undefined) {
            let messageArray = [message];
            if (Array.isArray(message)) {
                messageArray = message;
            }
            messageString = messageArray.map(checkIfObjectAndConvertToString).join(' ');
        }

        const logEntry: LogEntry = {
            message: messageString,
            severity,
            ...logGlobalContext,
            scope: {
                ...getScope(),
            },
        };

        if (additionalProperties) {
            const { namespace, properties } = additionalProperties;
            // Handle instances where user throws in a random object as type "any"
            if (!namespace || !properties) {
                logEntry.message = [
                    logEntry.message,
                    checkIfObjectAndConvertToString(additionalProperties),
                ].join(' ');
            } else {
                logEntry[namespace] = properties;
            }
        }

        write(logEntry);
    };
}

/**
 * Logger providing granular serverity levels as documented: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
 *
 * LEVEL debug: Temporary logs for debugging, to be removed when feature is stable (should be used with a TODO {AUTHOR NAME} above it)
 * LEVEL info: Routine information, such as ongoing status or performance.
 * LEVEL metrics: Use to log metrics
 * LEVEL warn: Non-critical errors that should be filtered out in alarms (for example rateLimiter)
 * LEVEL error: Error events are likely to cause problems.
 * LEVEL critical: Critical events cause more severe problems or outages.
 *
 */
export const logger = {
    debug: makeLogger('DEBUG'),
    info: makeLogger('INFO'),
    metrics: makeLogger('NOTICE'),
    warn: makeLogger('WARNING'),
    error: makeLogger('ERROR'),
    critical: makeLogger('CRITICAL'),
};
