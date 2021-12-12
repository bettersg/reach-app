import { ApiFunctionNames } from './index.types';

// https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
export const cloudFunctionName = process.env.K_SERVICE as ApiFunctionNames;
export const cloudFunctionVersion = process.env.K_REVISION;
