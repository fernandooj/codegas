/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const YAML = require('yaml-js');

/**
 * This is used to load all the functions dynamically from each
 * .yml configuration file into the general serverless.yml file
 */
module.exports = () => {
  const files = fs.readdirSync('./functions');

  return files
    .map(folder => fs.readFileSync(`./functions/${folder}/config.yml`, 'utf8'))
    .map(raw => YAML.load(raw))
    .reduce((result, serverless) => Object.assign(result, serverless), {});
};
