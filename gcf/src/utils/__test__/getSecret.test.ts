import { createSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';
import { describeUnitTestsFor } from '@root/testUtils/describe';

import { SecretManagerServiceClient } from '@google-cloud/secret-manager'; // eslint-disable-line no-restricted-imports
import { getSecret, clearSecretCache } from '@root/utils/getSecret';

describeUnitTestsFor('getSecret', () => {
    const sandbox = createSandbox();
    let accessSecretVersionStub: SinonStub;

    beforeEach(() => {
        clearSecretCache();
        accessSecretVersionStub = sandbox
            .stub(SecretManagerServiceClient.prototype, 'accessSecretVersion')
            .resolves(
                Promise.resolve([
                    {
                        payload: {
                            data: {
                                toString: function () {
                                    return 'secret';
                                },
                            },
                        },
                    },
                ])
            );
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('given 0 previous access, it should get secret remotely', async () => {
        const secret = await getSecret('test');
        expect(secret).to.be.eq('secret');
        expect(accessSecretVersionStub.callCount).to.be.eq(1);
    });

    it('given >0 previous access, it should get secret from cache', async () => {
        let secret = await getSecret('test');
        expect(secret).to.be.eq('secret');
        expect(accessSecretVersionStub.callCount).to.be.eq(1);
        secret = await getSecret('test');
        expect(secret).to.be.eq('secret');
        expect(accessSecretVersionStub.callCount).to.be.eq(1);
    });

    it('given >0 previous access and a subsequent clear cache opertion, it should get secret remotely', async () => {
        let secret = await getSecret('test');
        expect(accessSecretVersionStub.callCount).to.be.eq(1);
        clearSecretCache();
        secret = await getSecret('test');
        expect(accessSecretVersionStub.callCount).to.be.eq(2);
        expect(secret).to.be.eq('secret');
    });
});
