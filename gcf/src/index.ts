// For sourcemap to work
import sourceMapSupport from 'source-map-support';
import { apiKeyOnCall } from './firebaseFunctions';
import { makeRunTimeOption, Memory } from './utils/makeRuntimeOptions';
sourceMapSupport.install();

export const firstFunction = apiKeyOnCall(
    () => {
        return { status: 'woo' };
    },
    ['auth-key-default'],
    'todo',
    makeRunTimeOption(Memory.GB, 9)
);

export { attendanceExport } from './attendanceExport';
export { formSubmission } from './formSubmission';
