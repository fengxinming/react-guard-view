const path = require('path');
const pkg = require('./package.json');

module.exports = {
  entry: 'src/index.jsx',
  filename: `[name].js?v=${pkg.version}`,
  plugins: [
    ['ice-plugin-moment-locales', {
      locales: ['zh-cn']
    }]
  ],
  alias: {
    '@': path.join(__dirname, './src'),
    'react-guard-view/es': path.join(__dirname, '../../packages/react-guard-view/src'),
    'react-guard-view': path.join(__dirname, '../../packages/react-guard-view/src')
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    publicPath: '/',
    port: 3456,
    disableHostCheck: true
  },
  chainWebpack(chainedConfig, { command }) {
    chainedConfig.module
      .rule('jsx')
      .use('babel-loader')
      .tap((options) => {
        options.plugins.push(
          ['@babel/plugin-proposal-private-methods', { 'loose': true }],
          'babel-plugin-jsx-advanced'
        );
        return options;
      });

    chainedConfig.module
      .rule('swf')
      .test(/\.swf$/)
      .use('swf')
      .loader(require.resolve('file-loader'))
      .options({
        name: 'assets/[hash].[ext]'
      });

    // chainedConfig
    //   .plugin('HtmlWebpackPlugin')
    //   .tap((options) => {
    //     Object.assign(options[0].templateParameters, {

    //     });
    //     return options;
    //   });

    if (command === 'build') {
      chainedConfig.optimization
        .minimizer('UglifyJsPlugin')
        .tap((args) => {
          args[0].uglifyOptions.compress.pure_funcs = ['console.log'];
          return args;
        });
    }
  }
};
