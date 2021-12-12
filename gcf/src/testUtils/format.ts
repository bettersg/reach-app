export type TestTypes = 'Unit' | 'Integration' | 'PostDeployment';

export const testGroupTitle = (testType: TestTypes, groupName: string) =>
    `[${testType.toUpperCase()} Tests] ${groupName}`;

export const formatTestTitle = (title: string | Function) =>
    typeof title === 'function' ? `#${title.name}` : title;
