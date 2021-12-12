import { AxiosRequestConfig, Method } from 'axios';

export type ResponseHandler<T, U> = (data: T, bail: (e: Error) => void) => U;

export type SkipRetryPredicate<T = any> = (statusCode: number, data: T) => boolean;

export type AsyncHeaders = () => Promise<Record<string, unknown>>;

export type OnUpdateLogContext = (context: RequestContext) => RequestContext;

export interface RequestConfig<T>
    extends Pick<AxiosRequestConfig, 'url' | 'data' | 'params' | 'timeout' | 'headers'> {
    method: Method;
    skipRetryPredicate?: SkipRetryPredicate;
    responseValidator?: (data: unknown) => data is T;
    retryCount?: number; // Seting this to 1 means do it once, then retry it once.
    onUpdateLogContext?: OnUpdateLogContext;
}

export interface RequestConfigWithSuccessHandler<T, U> extends RequestConfig<T> {
    onSuccessResponse: ResponseHandler<T, U>;
}

export interface RequestContext {
    url?: string;
    baseUrl?: string;
    method?: string;
    statusText?: string;
    status?: number;
    timeTakenInMs?: number;
    data?: any;
}

export type Bail = (e: Error) => void;
