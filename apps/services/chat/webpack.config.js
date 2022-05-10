const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { WebpackPnpExternals } = require('webpack-pnp-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = (option) =>
  merge(
    {
      entry: { main: ['webpack/hot/poll.js?100'] },
      externals: [
        WebpackPnpExternals({
          exclude: ['webpack/hot/poll.js'],
        }),
      ],
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new RunScriptWebpackPlugin({ name: option.output.filename }),
      ],
    },
    option
  );
