import { describeUnitTestsFor } from '@root/testUtils/describe';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { limitPromiseRuntime } from '../limitPromiseRuntime';

function sleep(timeInMs: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve('done sleeping'), timeInMs);
    });
}

describeUnitTestsFor(limitPromiseRuntime, () => {
    const sinonSandbox = createSandbox();
    afterEach(() => {
        sinonSandbox.restore();
    });
    it('Should timeout function if it takes too long', async () => {
        const clock = sinonSandbox.useFakeTimers(0);

        const promise = limitPromiseRuntime(sleep(150), 100);

        clock.tick(101);

        await expect(promise).to.eventually.be.rejectedWith();
    });

    it('Should resolve promise if it is within max runtime', async () => {
        const clock = sinonSandbox.useFakeTimers(0);

        const promise = limitPromiseRuntime(sleep(150), 152);

        clock.tick(151);

        await expect(promise).to.eventually.be.eq('done sleeping');
    });

    it('When underlying promise rejects, it should stop timer and allow error to pass through', async () => {
        const clock = sinonSandbox.useFakeTimers(0);

        const promise = limitPromiseRuntime(
            (async () => {
                await sleep(50);
                throw new Error('something went wrong');
            })(),
            80
        );

        clock.tick(60);

        await expect(promise).to.eventually.be.rejectedWith('something went wrong');

        // tick to make sure timeout is cleared
        clock.tick(200);
        // if timeout is not cleared, timeout will be thrown here
    });
});
