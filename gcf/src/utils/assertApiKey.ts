import { getSecret } from '@root/utils/getSecret';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { logger } from '@root/logger';
import { createTtError } from '../errors';

export type ApiKeyName = 
    | 'auth-key-default' // For developers
    | 'auth-key-other';

/**
 * New API key format: plaintext-keyname_base64secretblahblah/+asdkfja=
 * Old API key format: base64secretblahblah/+asdkfja=
 * TODO(oliver) after we switch AWS secrets to the new version (i.e. named), remove the old logic.
 * @returns Name of API key used.
 * @throws createTtError('DENIED') if key is not good.
 */
export async function assertApiKey(
    context: CallableContext,
    validKeys: ApiKeyName[]
): Promise<ApiKeyName> {
    const offeredKey = context.rawRequest.header('x-api-key') ?? '';
    const keyParts = offeredKey.split('_');

    if (keyParts.length === 1) {
        // This is an old API key, without the prefix name. To support transition, allow this.
        // This design is bad because you are retrieving all API key secrets to check 1.
        const keyContent = offeredKey;

        for (const validKeyName of validKeys) {
            if ((await getSecret(validKeyName)) === keyContent) {
                logger.warn('API key (deprecated format) successful match.');
                return validKeyName as ApiKeyName;
            }
        }
        logger.warn('API key (deprecated format) incorrect.');
        throw createTtError('DENIED');
    } else {
        // This is the new API key, with the prefix name. Only lookup 1 secret.
        const keyName = keyParts.slice(0, -1).join('_') as ApiKeyName;
        const keyContent = keyParts.slice(-1)[0];

        if (!validKeys.includes(keyName)) {
            logger.warn('Unknown API key name provided.');
            throw createTtError('DENIED');
        } else if (keyContent !== (await getSecret(keyName))) {
            logger.warn('API key value incorrect.');
            throw createTtError('DENIED');
        }
        return keyName;
    }
}
