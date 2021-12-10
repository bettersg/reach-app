import { LogEntry } from 'firebase-functions/logger';

// Define additonal properties schema here
interface LogRateLimiterMetrics {
    namespace: 'rateLimiterMetrics';
    properties: {
        identifier: string;
        cloudFunctionName: string;
        period: number;
        calls: number;
        shardIndex: number;
    };
}

interface LogRequestContext {
    namespace: 'requestContext';
    properties: RequestContext;
}
interface LogConsentPrivacyStatement {
    namespace: 'consentPrivacyStatement';
    properties: { uid: string; ttId: string };
}
interface LogProcessUploadedData {
    namespace: 'processUploadedData';
    properties: { errorMessage: string; filePath: string; stackTrace: any };
}

type AdditionalProperties =
    | LogRequestContext
    | LogProcessUploadedData
    | LogConsentPrivacyStatement
    | LogRateLimiterMetrics;

export type Log = (message?: any, additionalProperties?: AdditionalProperties) => void;

export interface Scope {
    fileName?: string;
    functionName?: string;
    methodName?: string;
    lineNumber?: number;
}

export type Write = (entry: LogEntry) => void;

export interface Logger {
    [key: string]: Log;
}
