import { logger } from '@root/logger';
import { initFirebaseAdmin } from '@root/initFirebaseAdmin';
import { cacheWithExpiry } from '@root/utils/cacheWithExpiry';

const { fs } = initFirebaseAdmin();

async function getParameterRemotely(paramGroup: string, paramName: string): Promise<string> {
    logger.info(`Getting parameter ${paramName} from group ${paramGroup}`);
    const document = await fs.collection('parameters').doc(paramGroup).get();
    logger.info(`Retrieved parameter ${paramName} from group ${paramGroup}`);
    return document.get(paramName);
}

export const { cachedFunction: getParameter, clearCache: clearParameterCache } =
    cacheWithExpiry(getParameterRemotely);
