const { merge } = require('webpack-merge');
const withModuleFederation = require('@nrwl/react/module-federation');
const moduleFederationConfig = require('./module-federation.config');

module.exports = withModuleFederation({
  ...moduleFederationConfig,
}).then(
  (federation) => (config) =>
    federation(
      merge(config, {
        module: {
          rules: [
            {
              test: /\.worker\.ts$/,
              use: [{ loader: 'worker-loader' }, { loader: 'swc-loader' }],
            },
          ],
        },
      })
    )
);
