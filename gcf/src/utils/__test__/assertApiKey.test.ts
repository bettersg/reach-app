import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { describeUnitTestsFor } from '@root/testUtils/describe';
import { ApiKeyName, assertApiKey } from '../assertApiKey';
import * as getSecret from '../getSecret';
import { CallableContext } from 'firebase-functions/v1/https';

const getSecretHardCoded = async (secretName: string) => {
    if (secretName === 'auth-key-default') return 'secret1';
    if (secretName === 'auth-key-other') return 'secret2';
    return 'nosecret';
};

function createFakeCallableContext(apiKey: string | undefined): CallableContext {
    return {
        rawRequest: {
            header: (name: string) => (name === 'x-api-key' ? apiKey : undefined),
        },
    } as unknown as CallableContext;
}

describeUnitTestsFor(assertApiKey.name, function () {
    const sandbox = createSandbox();

    before(() => {
        sandbox.stub(getSecret, 'getSecret').callsFake(getSecretHardCoded);
    });

    after(() => {
        sandbox.restore();
    });

    it('should do no-op if key is good', async () => {
        await assertApiKey(createFakeCallableContext('auth-key-default_secret1'), [
            'auth-key-other',
            'auth-key-default',
        ]);
        await assertApiKey(createFakeCallableContext('auth-key-other_secret2'), ['auth-key-other']);
    });

    it('should handle key names with under_scores', async () => {
        await assertApiKey(createFakeCallableContext('underscore_name_nosecret'), [
            'underscore_name' as ApiKeyName,
        ]);
    });

    it('should throw error if keyname is unrecognized', async () => {
        await expect(
            assertApiKey(createFakeCallableContext('auth-key-wrong-name_secret2'), [
                'auth-key-default',
            ])
        ).to.be.rejected;
    });

    it('should throw error if key is correct but not valid', async () => {
        await expect(
            assertApiKey(createFakeCallableContext('auth-key-other_secret2'), ['auth-key-default'])
        ).to.be.rejected;
    });

    it('should throw error if key does not match', async () => {
        await expect(
            assertApiKey(createFakeCallableContext('auth-key-default_wrong-value'), [
                'auth-key-default',
            ])
        ).to.be.rejected;
    });

    it('should throw error if key is not provided', async () => {
        await expect(assertApiKey(createFakeCallableContext(undefined), ['auth-key-default'])).to.be
            .rejected;
    });
});
