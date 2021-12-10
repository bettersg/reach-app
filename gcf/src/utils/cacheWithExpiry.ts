import moment from 'moment-timezone';
import { AsyncReturnType } from '@root/utils/utils.types';
import { logger } from '@root/logger';

interface CacheEntry<T> {
    val: Promise<T>;
    lastRetrieved: number;
}

interface FunctionCache<T extends (...args: any) => Promise<any>> {
    cachedFunction: (...args: Parameters<T>) => Promise<AsyncReturnType<T>>;
    clearCache: () => void;
}

/**
 * Provides time-based caching logic around an arbitrary call, returning the wrapped call.
 * @param providerFunction: the expensive 'cached' call - should have all arguments pre-loaded.
 * @param ttl unit: seconds
 */
export function cacheWithExpiry<T extends (...args: any[]) => Promise<any>>(
    providerFunction: T,
    ttl = 86400
): FunctionCache<T> {
    const cachedValues = new Map<string, CacheEntry<AsyncReturnType<T>>>();

    const cachedFunction = async (...args: Parameters<T>): Promise<AsyncReturnType<T>> => {
        const unixMsNow = moment().valueOf();
        const serializedArgs = JSON.stringify(args);

        const lastRetrieved = cachedValues.get(serializedArgs)?.lastRetrieved ?? 0;
        if (lastRetrieved + ttl * 1000 <= unixMsNow) {
            // First guy making the request - allow others to rely on the same invocation
            logger.debug('Cache miss - retrieving underlying value.');
            const requestPromise = providerFunction(...args);
            cachedValues.set(serializedArgs, { val: requestPromise, lastRetrieved: unixMsNow });
        }

        // Erase cache if the cached value is an error.
        const promisedValue = cachedValues.get(serializedArgs)?.val as ReturnType<T>;
        try {
            return await promisedValue;
        } catch (error: any) {
            logger.warn('Underlying promise was rejected');
            cachedValues.delete(serializedArgs);
            return promisedValue;
        }
    };

    function clearCache() {
        cachedValues.clear();
    }

    return { cachedFunction, clearCache };
}
