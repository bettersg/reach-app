import { expect } from 'chai';
import { useFakeTimers } from 'sinon';

import { describeUnitTestsFor } from '@root/testUtils/describe';
import { cacheWithExpiry } from '../cacheWithExpiry';

const ttlMs = 10;

describeUnitTestsFor(cacheWithExpiry.name, function () {
    let counter = 0;
    async function expensiveCall(arg1: number) {
        counter = counter + 1;
        return counter + arg1;
    }
    let cachedFunction: (arg1: void) => Promise<number>;
    let clearCache: () => void;

    beforeEach(() => {
        counter = 0;
        const cacheObj = cacheWithExpiry(async () => await expensiveCall(10), ttlMs / 1000);
        cachedFunction = cacheObj.cachedFunction;
        clearCache = cacheObj.clearCache;
    });

    afterEach(() => {
        clearCache();
    });

    it('should call the underlying provider function on first call', async () => {
        expect(await cachedFunction()).to.equal(11);
    });

    it('should use cached value within TTL', async () => {
        expect(await cachedFunction()).to.equal(11);
        expect(await cachedFunction()).to.equal(11);
    });

    it('Clearing cache before TTL should make call again.', async () => {
        expect(await cachedFunction()).to.equal(11);
        clearCache();
        expect(await cachedFunction()).to.equal(12);
    });

    it('should call the underlying provider after TTL', async () => {
        const timer = useFakeTimers(1000);
        expect(await cachedFunction()).to.equal(11);
        timer.tick(ttlMs);
        expect(await cachedFunction()).to.equal(12);
        timer.restore();
    });

    it('should call underlying provider for different args', async () => {
        let variableCounter = 0;
        async function variableExpensiveCall(arg1: string, arg2: string) {
            variableCounter += 1;
            return Promise.resolve(`processed ${arg1} and ${arg2} with ${variableCounter}`);
        }

        const cachedCall = cacheWithExpiry(variableExpensiveCall).cachedFunction;

        expect(await cachedCall('sheep', 'goat')).to.equal('processed sheep and goat with 1');
        expect(await cachedCall('cow', 'cow')).to.equal('processed cow and cow with 2');
        expect(await cachedCall('sheep', 'cow')).to.equal('processed sheep and cow with 3');
        expect(await cachedCall('sheep', 'goat')).to.equal('processed sheep and goat with 1');
    });

    it('should call underlying provider once even for 2 parallel calls', async () => {
        let variableCounter = 0;
        async function expensiveCounterCall() {
            await new Promise((f) => {
                setTimeout(f, ttlMs);
            });
            variableCounter += 1;
            return variableCounter;
        }

        const { cachedFunction } = cacheWithExpiry(expensiveCounterCall);
        const parallelCalls = await Promise.all([cachedFunction(), cachedFunction()]);

        expect(parallelCalls[0]).to.equal(1);
        expect(parallelCalls[1]).to.equal(1);

        // Serial call should also receive the cached version
        await expect(cachedFunction()).to.eventually.equal(1);
    });

    it('should not cache errors of underlying function', async () => {
        let variableCounter = 0;
        const failThenSucceed = () =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    variableCounter += 1;
                    if (variableCounter === 1) {
                        reject(new Error('1st call fails'));
                    } else {
                        resolve(variableCounter);
                    }
                }, ttlMs);
            });

        const { cachedFunction } = cacheWithExpiry(failThenSucceed);
        const parallelCalls = Promise.all([cachedFunction(), cachedFunction()]);

        await expect(parallelCalls).to.be.eventually.rejectedWith('1st call fails');

        // Serial call should avoid the cached error and make a second call.
        expect(await cachedFunction()).to.equal(2);
        expect(await cachedFunction()).to.equal(2);
    });
});
