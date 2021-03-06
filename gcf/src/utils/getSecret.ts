import { config } from '@root/config';
import { logger } from '@root/logger';
import { cacheWithExpiry } from '@root/utils/cacheWithExpiry';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'; // eslint-disable-line no-restricted-imports
export type GcpSecretManagerClient = InstanceType<typeof SecretManagerServiceClient>;

type GetSecret = (key: string) => Promise<string>;
let gcpSecretClient: undefined | GcpSecretManagerClient;

export const getGcpSecretManagerClient = () => {
    gcpSecretClient = gcpSecretClient || new SecretManagerServiceClient();
    return gcpSecretClient;
};

const getSecretRemotely: GetSecret = async (key) => {
    const project = config.projectId;
    logger.info(`Getting secret ${key} from project ${project}`);

    const gcpSecretClient = getGcpSecretManagerClient();
    const secretVersionPath = gcpSecretClient.secretVersionPath(project, key, 'latest');

    const [secret] = await gcpSecretClient.accessSecretVersion({
        name: secretVersionPath,
    });
    return secret.payload?.data?.toString() ?? '';
};

const { cachedFunction: getSecret, clearCache: clearSecretCache } =
    cacheWithExpiry(getSecretRemotely);

export { getSecret, clearSecretCache };
