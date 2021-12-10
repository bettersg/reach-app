import { Logger } from '@root/logger/logger.types';
import { OnUpdateLogContext, RequestContext } from './request.types';

export const buildRequestContextMessage = (context: RequestContext) => {
    const { baseUrl, method, status, statusText, timeTakenInMs: timeElapseInMs } = context;
    const url = [baseUrl, context.url].join('');
    const stringBuilder = [method, url];

    if (status && statusText) stringBuilder.push([status, statusText].join(':'));
    if (timeElapseInMs) stringBuilder.push(`${timeElapseInMs}ms`);

    return stringBuilder.join(' ');
};

export const createLoggerWithRequestContext = (
    logger: Logger,
    initialContext: RequestContext,
    onUpdateLogContext?: OnUpdateLogContext
) => {
    let startTimestamp = Date.now();
    let context: RequestContext = {};

    const updateContext = (contextToUpdate: RequestContext) => {
        const updates = onUpdateLogContext ? onUpdateLogContext(contextToUpdate) : contextToUpdate;

        context = {
            ...context,
            ...updates,
        };

        // Force data to be a json string instead, this can help log json payload to have a consistent schema
        if (context.data) {
            context.data = JSON.stringify(context.data);
        }
    };

    const resetContext = () => {
        startTimestamp = Date.now();
        context = {};
        updateContext(initialContext);
    };

    const updateTimeElapse = () => {
        const timeTakenInMs = Date.now() - startTimestamp;
        updateContext({ timeTakenInMs });
    };

    updateContext(initialContext);

    const loggerWithContext: Record<keyof typeof logger, (message?: string) => void> = {
        ...logger,
    };
    let key: keyof typeof logger;

    // Iterate and replace logger with a wrapped version
    for (key in logger) {
        const log = logger[key];
        loggerWithContext[key] = (message) => {
            log([buildRequestContextMessage(context), message], {
                namespace: 'requestContext',
                properties: context,
            });
        };
    }

    return {
        updateContext,
        resetContext,
        updateTimeElapse,
        loggerWithContext,
    };
};
