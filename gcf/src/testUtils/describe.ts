import { formatTestTitle, testGroupTitle } from '@root/testUtils/format';

export const describeUnitTestsFor = (
    nameOfComponentToTest: string | Function,
    fn: (this: Mocha.Suite) => void
) => {
    describe(testGroupTitle('Unit', formatTestTitle(nameOfComponentToTest)), fn);
};

export const describeIntegrationTestsFor = (
    nameOfComponentToTest: string,
    fn: (this: Mocha.Suite) => void
) => {
    describe(testGroupTitle('Integration', formatTestTitle(nameOfComponentToTest)), fn);
};

export const describePostDeploymentTestsFor = (
    nameOfComponentToTest: string,
    fn: (this: Mocha.Suite) => void
) => {
    describe(testGroupTitle('PostDeployment', formatTestTitle(nameOfComponentToTest)), fn);
};
