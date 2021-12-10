import * as functions from 'firebase-functions';

import { config } from '@root/config';
import { makeRunTimeOption } from '@root/utils/makeRuntimeOptions';
import { wrapInHttpsError } from '@root/errors';
import { initFirebaseAdmin } from '@root/initFirebaseAdmin';
import { ApiKeyName, assertApiKey } from '@root/utils/assertApiKey';
import { cleanLogGlobalContext } from '@root/logger';
import { Schema, validatePayload } from '@root/utils/validatePayload';
import { CallableContext } from 'firebase-functions/v1/https';

initFirebaseAdmin();

export function https<T>(
    handler: (data: T, uid: string) => PromiseLike<any> | any,
    schema: Schema,
    runtimeOpt: functions.RuntimeOptions = makeRunTimeOption()
) {
    const authenticatedFunction = wrapInHttpsError(
        async (data: any, context: functions.https.CallableContext) => {
            cleanLogGlobalContext();

            // Use AJV to validate
            const typedPayload = validatePayload<T>(data, schema);

            // TODO Rate-limit and check UID.
            // const uid = await ttAuthenticate(typedPayload, context, cloudFunctionName);
            const uid = '';

            return handler(typedPayload, uid);
        }
    );
    return functions.runWith(runtimeOpt).region(config.region).https.onCall(authenticatedFunction);
}

export function storage(
    bucket: string,
    handler: (object: functions.storage.ObjectMetadata) => PromiseLike<any> | any,
    runtimeOpt: functions.RuntimeOptions = makeRunTimeOption()
): functions.CloudFunction<functions.storage.ObjectMetadata> {
    return functions
        .runWith(runtimeOpt)
        .region(config.region)
        .storage.bucket(bucket)
        .object()
        .onFinalize(handler);
}

export function pubsub(
    schedule: string,
    handler: (...args: any) => any,
    runtimeOpt: functions.RuntimeOptions = makeRunTimeOption()
) {
    return functions
        .runWith(runtimeOpt)
        .region(config.region)
        .pubsub.schedule(schedule)
        .timeZone('Asia/Singapore')
        .onRun((context: functions.EventContext) => wrapInHttpsError(handler)());
}

export function apiKeyOnCall<T, D>(
    handler: (data: T, apiKeyName: ApiKeyName) => D | Promise<D>,
    validKeys: ApiKeyName[],
    schema: Schema = 'todo',
    runtimeOpt: functions.RuntimeOptions = makeRunTimeOption()
) {
    const typedHandler = async (data: unknown, context: CallableContext) => {
        const apiKeyName = await assertApiKey(context, validKeys);
        const typedPayload = validatePayload<T>(data, schema);
        return handler(typedPayload, apiKeyName);
    };

    return functions
        .runWith(runtimeOpt)
        .region(config.region)
        .https.onCall(wrapInHttpsError(typedHandler));
}
