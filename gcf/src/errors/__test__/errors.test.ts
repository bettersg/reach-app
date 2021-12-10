import { createSandbox, SinonSpy } from 'sinon';
import { expect } from 'chai';
import { logger } from '@root/logger';
import { describeUnitTestsFor } from '@root/testUtils/describe';
import { createTtError, GENERAL_ERRORS, wrapInHttpsError } from '..';

describeUnitTestsFor(wrapInHttpsError.name, () => {
    const sandbox = createSandbox();
    let logErrorSpy: SinonSpy | undefined;

    beforeEach(() => {
        logErrorSpy = sandbox.spy(logger, 'error');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should log as ERROR and throw tt internal error on unexpected error in an async function', async () => {
        await expect(
            wrapInHttpsError(async () =>
                Promise.reject(new Error('Hello i am an unexpected error'))
            )()
        ).to.eventually.be.rejectedWith(GENERAL_ERRORS.INTERNAL.message);

        const callArgs = logErrorSpy?.getCalls()[0].args[0];
        expect(callArgs[1]?.message).to.equal('Hello i am an unexpected error');
    });

    it('Should allow http errors thrown in an async function to pass', async () => {
        await expect(
            wrapInHttpsError(async () => Promise.reject(createTtError('RATE_LIMIT')))()
        ).to.eventually.be.rejectedWith(GENERAL_ERRORS.RATE_LIMIT.message);
    });
});
