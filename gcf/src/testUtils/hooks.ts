import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import * as retry from '@root/utils/retry';
import { mockRetry } from '@root/testUtils/mockRetry';
import { Done } from 'mocha';
import { createSandbox, SinonSandbox } from 'sinon';

let sandbox: SinonSandbox;
exports.mochaHooks = {
    beforeEach(done: Done) {
        sandbox = createSandbox();
        chai.use(chaiExclude);
        chai.use(sinonChai);
        // CAUTION: Its important to load chai as promised after other chai extensions as loading it first
        // caused to deep.equal to always return true even when objects are not equal.
        // I didn't find any references regarding this particular issue but there are similar issues
        // reported. Following are couple of examples
        // https://github.com/domenic/chai-as-promised/issues/215
        // https://www.bountysource.com/teams/chai-as-promised/issues?tracker_ids=295399
        chai.use(chaiAsPromised);
        sandbox.replace(retry, 'retry', mockRetry);
        done();
    },
    afterEach() {
        sandbox.restore();
    },
};
