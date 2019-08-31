const paths = require('./paths');

const webpackProd = require('./webpack.config.base');

const rules = webpackProd.module.rules;

rules.push(
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: ['babel-loader']
  },

  {
    test: /\.(less)$/,
    use: [
      // we do not need styles in SSR
      { loader: 'ignore-loader' },
    ]
  }
);

module.exports = {
  //mode: 'production',
  entry: paths.ssrRegistry,
  module: {
    rules: rules,
  },
  resolve: {
    extensions: [
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
    ],
  },
  output: {
    path: __dirname + '/../../ui.apps/src/main/content/jcr_root/apps/react-apps/components/',
    publicPath: '/',
    filename: '[name]React/ssrbundle.js',
  }
};
