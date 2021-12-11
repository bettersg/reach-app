const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const packageJson = require('./package.json');

const BUILD_ENV = process.env.BUILD_ENV;
const GITHUB_SHA = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.trim() : undefined;

if (!BUILD_ENV) {
    throw new Error('BUILD_ENV not given bro');
}

console.log(`Building for ${BUILD_ENV}`);

if (GITHUB_SHA) {
    console.log(`Received COMMIT SHA: ${GITHUB_SHA}`);
}

module.exports = {
    target: 'node',
    mode: 'production',
    entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        deploy: path.resolve(__dirname, 'src/deploy.ts'),
    },
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true,
                },
            }),
        ],
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/config\/index.ts/, `./config.${BUILD_ENV}.ts`),
        new GeneratePackageJsonPlugin(
            {
                name: packageJson.name,
                main: './index.js',
                scripts: {
                    start: 'yarn run shell',
                },
                engines: packageJson.engines,
            },
            {
                // debug: true,
                useInstalledVersions: false,
                sourcePackageFilenames: ['./package.json'],
            }
        ),
        new webpack.DefinePlugin({
            'process.env.GITHUB_SHA': JSON.stringify(GITHUB_SHA),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                options: {
                    configFile: 'tsconfig.build.json',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
            '@root': path.resolve(__dirname, 'src'),
        },
    },
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
        libraryTarget: 'commonjs',
    }
};
