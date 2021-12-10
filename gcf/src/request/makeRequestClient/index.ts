import http from 'http';
import https from 'https';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { logger } from '@root/logger';
import { retry } from '@root/utils/retry';
import {
    AsyncHeaders,
    Bail,
    RequestConfig,
    RequestConfigWithSuccessHandler,
    SkipRetryPredicate,
} from './request.types';
import { createLoggerWithRequestContext } from './request.helper';
import {
    ApiRequestNoResponseError,
    ApiRequestResponseError,
    ApiRequestResponseValidationError,
    ApiRequestSetupError,
} from './request.errors';

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const DEFAULT_TIMEOUT = 6000;
const DEFAULT_RETRY = 3;

/**
 * Creates a base request client
 * @param baseUrl Base url where all other request's url will be based off from.
 * @param asyncHeaders A callback that asynchronously configures the headers.
 * @returns {request} All request will have the above configurations as default.
 */
export const makeRequestClient = (baseUrl?: string, asyncHeaders?: AsyncHeaders) => {
    // Create axios instance and assign httpAgent to persist connections
    const axiosClient = axios.create({
        baseURL: baseUrl,
        httpAgent,
        httpsAgent,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    /**
     * Makes a http request that logs request states, timeouts request, and retries (default to 3 retries,
     * client errors are also retried) on failure. Response can be optionally validated or transformed.
     * @param config see https://axios-http.com/docs/req_config for more info
     * @returns T|U where T is response and U is the transformed response if onSuccessResponse is configured.
     * @throws {ApiRequestResponseError} Response was received with status that falls out of the 200-299 range.
     * @throws {ApiRequestNoResponseError} Request was sent out but no response was received.
     * @throws {ApiRequestSetupError} Request did not even make it out, failed during the setup.
     * @throws {ApiRequestResponseValidationError} Response was received but failed validation
     */
    function requestWithRetry<T>(config: RequestConfig<T>): Promise<T>; //eslint-disable-line @typescript-eslint/no-explicit-any
    function requestWithRetry<T, U>(config: RequestConfigWithSuccessHandler<T, U>): Promise<U>; //eslint-disable-line @typescript-eslint/no-explicit-any
    function requestWithRetry<T, U>( //eslint-disable-line @typescript-eslint/no-explicit-any
        config: RequestConfig<T> | RequestConfigWithSuccessHandler<T, U>
    ) {
        const loggerWithRequestContext = createLoggerWithRequestContext(
            logger,
            { baseUrl, url: config.url, method: config.method },
            config.onUpdateLogContext
        );

        const { updateContext, resetContext, updateTimeElapse, loggerWithContext } =
            loggerWithRequestContext;

        async function request(bail: Bail) {
            resetContext();
            loggerWithContext.info();

            let response: AxiosResponse | undefined;
            try {
                // Asynchronously assign headers on every request
                response = await axiosClient.request({
                    ...config,
                    timeout: config.timeout ?? DEFAULT_TIMEOUT,
                    headers: {
                        ...axiosClient.defaults.headers,
                        ...(asyncHeaders ? await asyncHeaders() : undefined),
                        ...config.headers,
                    },
                });
            } catch (error: any) {
                updateTimeElapse();
                handleError(loggerWithRequestContext, config.skipRetryPredicate, error, bail);
                return;
            }

            if (response) {
                const { status, statusText, data } = response;

                updateTimeElapse();
                updateContext({
                    status,
                    statusText,
                    data,
                });
                loggerWithContext.info();

                // Validate and warn if a validator is configured
                if (config.responseValidator && !config.responseValidator(data)) {
                    const responseValidationError = new ApiRequestResponseValidationError(response);
                    loggerWithContext.error(responseValidationError.message);
                    bail(responseValidationError);
                    return;
                }

                // Pass response data and execution to onSuccessResponse callback, the new return value will be dictated by it.
                if ('onSuccessResponse' in config) return config.onSuccessResponse(data, bail);

                return data;
            }
        }

        return retry(request, {
            retries: config.retryCount ?? DEFAULT_RETRY,
            onRetry: async (error, attempt) => {
                loggerWithContext.warn(`attempt ${attempt}. Failed due to error: ${error.message}`);
            },
        });
    }

    return {
        request: requestWithRetry,
    };
};

const skipClientErrorStatusCodes: SkipRetryPredicate = (statusCode) => {
    return statusCode >= 400 && statusCode <= 499;
};

function handleError(
    { loggerWithContext, updateContext }: ReturnType<typeof createLoggerWithRequestContext>,
    skipRetry = skipClientErrorStatusCodes,
    error: AxiosError,
    bail: (e: Error) => void
) {
    if (error.response) {
        const { status, statusText, data } = error.response;
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        updateContext({ statusText, status });

        const apiRequestResponseError = new ApiRequestResponseError(error.response);
        loggerWithContext.warn(apiRequestResponseError.message);

        if (skipRetry(status, data)) {
            loggerWithContext.warn(`Http status code: ${status} received, skipping retry`);
            bail(apiRequestResponseError);
            return;
        }

        throw apiRequestResponseError;
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of http.ClientRequest in node.js
        const noResponseError = new ApiRequestNoResponseError(error.config);
        loggerWithContext.warn(noResponseError.message);
        bail(noResponseError);
    } else {
        loggerWithContext.warn(error.message);
        // Something happened in setting up the request that triggered an Error
        bail(new ApiRequestSetupError(error.message));
    }
}
