module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@pages': './pages',
            '@components': './components',
            '@types': './types',
            '@constants': './constants',
            '@hooks/*': './hooks/*',
          },
        },
      ],
    ],
  };
};
