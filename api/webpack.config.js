const path = require('path');
const slsw = require('serverless-webpack');

/**
 * Resolves build mode for different environments
 * @param {boolean} isLocal - Indicates if a lambda is invoked locally
 * @return {string}
 */
const setMode = (isLocal) => {
  const developmentMainStage = 'dev';

  if (isLocal || process.env.AWS_MAIN_STAGE === developmentMainStage) return 'development';

  return 'production';
};

/**
 * Webpack Config Object
 * @typedef {Object} WebpackConfig
 * @property {Object<string,string>|string} entry - Indicates which module webpack should use
 * to begin building out its internal dependency graph.
 * See {@link https://webpack.js.org/concepts/entry-points/}
 * @property {string} target -  Webpack offers multiple deployment targets. I.e: 'node' | 'web'.
 * See {@link https://webpack.js.org/concepts/targets/}
 * @property {Array<Object<string,string>>} externals - Provides a way of excluding dependencies
 * from the output bundles. Instead, the created bundle relies on that dependency to be
 * present in the consumer's (any end-user application) environment.
 * See {@link https://webpack.js.org/configuration/externals/}
 * @property {string} mode - Providing the mode configuration option tells webpack to
 * use its built-in optimizations accordingly.
 * I.e: 'production': 'none' | 'development' | 'production'.
 * See {@link https://webpack.js.org/configuration/mode/}
 * @property {Object<string,string>} output - Where to emit the bundles it creates
 * and how to name these files.
 * See {@link https://webpack.js.org/concepts/#output}
 */

/**
 * @type {WebpackConfig}
 */
module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: [
    {
      'aws-sdk': 'aws-sdk',
      'pg-native': 'pg-native',
    },
  ],
  mode: setMode(slsw.lib.webpack.isLocal),
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
  },
  devtool: (slsw.lib.webpack.isLocal) ? 'cheap-module-source-map' : undefined,
};
