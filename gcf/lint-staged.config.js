module.exports = {
    '*.{js,ts}': ['eslint --cache --fix', () => 'tsc -p tsconfig.json --noEmit'],
};
