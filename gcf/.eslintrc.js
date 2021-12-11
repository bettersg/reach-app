module.exports = {
    env: {
        es6: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: './tsconfig.eslint.json',
    },
    plugins: ['eslint-plugin-import', '@typescript-eslint', 'no-floating-promise', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    ignorePatterns: ['webpack.config.js'],
    rules: {
        // Start: Added rules on top of the extended ones
        'no-restricted-imports': [
            'error',
            {
                paths: [
                    {
                        name: '@google-cloud/secret-manager',
                        importNames: ['SecretManagerServiceClient'],
                        message:
                            'Please use: import { getSecret } from "@tt/gcp/utils/secretManager/getSecret"',
                    }
                ],
            },
        ],
        'no-restricted-syntax': [
            'error',
            {
                selector: 'ImportDeclaration[source.value="sinon"] ImportDefaultSpecifier',
                message: 'Prefer destructuring: ie. import { expect } from "sinon"',
            },
            {
                selector: 'ImportDeclaration[source.value=/\\getSecretManagerClients$/i]',
                message:
                    'Direct usage of clients is restricted. Please use "@tt/gcp/utils/secretManager/getSecret" to get secrets.',
            },
        ],
        eqeqeq: 'error',
        'no-promise-executor-return': 'error',
        'no-console': 'error',
        'no-else-return': 'error',
        'no-floating-decimal': 'error',
        'no-implicit-coercion': 'error',
        'no-multi-spaces': 'error',
        'no-plusplus': 'error',
        'no-underscore-dangle': 'error',
        'prefer-object-spread': 'error',
        camelcase: 'warn',
        'no-constant-condition': ['error', { checkLoops: false }],
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/consistent-type-assertions': 'error',
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    Function: false,
                },
            },
        ],
        // End
        // Start: Rules from extended ones that are switched off and should be switched on
        'no-prototype-builtins': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-floating-promises': 'error',
        // End
        // Start: Prettier specific rules (HAS TO BE THE LAST ONES):
        'prettier/prettier': 'error',
        // These two rules below causes issue with prettier and has to be switched off:
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off',
        // End
    },
};
