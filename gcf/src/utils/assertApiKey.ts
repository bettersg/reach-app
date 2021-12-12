import { getSecret } from '@root/utils/getSecret';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { logger } from '@root/logger';
import { createError } from '../errors';

export type ApiKeyName =
    | 'auth-key-default' // For developers
    | 'auth-key-other';

/**
 * @returns Name of API key used.
 * @throws createError('DENIED') if key is not good.
 */
export async function assertApiKey(
    context: CallableContext,
    validKeys: ApiKeyName[]
): Promise<ApiKeyName> {
    const offeredKey = context.rawRequest.header('x-api-key') ?? '';
    const keyParts = offeredKey.split('_');

    const keyName = keyParts.slice(0, -1).join('_') as ApiKeyName;
    const keyContent = keyParts.slice(-1)[0];

    if (!validKeys.includes(keyName)) {
        logger.warn('Unknown API key name provided.');
        throw createError('DENIED');
    } else if (keyContent !== (await getSecret(keyName))) {
        logger.warn('API key value incorrect.');
        throw createError('DENIED');
    }
    return keyName;
}
