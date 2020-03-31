/**
 * Import base packages
 */
const deepmerge = require('deepmerge');
const validate = require('jsonschema').validate;

/**
 * Import config schema
 */
const schema = require(`${__dirname}/schemas/config.schema.json`);

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Define base config
 */
const baseConfig = {
  application: {
    name: '',
    host: '0.0.0.0',
    port: 5678,
    dompartyHeaders: true
  },
  next: {
    pagesDir: ""
  },
  logger: {
    location: './log',
    filename: 'app.log',
    level: 'trace'
  },
  pwa: {
    shortName: 'Project',
    name: 'DOMParty Project',
    version: 'v0.0.0',
    backgroundColor: '#000000',
    themeColor: '#000000'
  },
  cli: {
    maxExecutionTimeout: 30,
  },
  graphql: {
    enabled: true
  },
  robots: {
    disallowAll: true,
    disallowRules: []
  },
  sitemap: {
    urls: []
  }
};

/**
 * Builds the config and then returns it when correct
 *
 * @param dirname
 * @param cwd
 */
module.exports = (dirname, cwd) => {
  let config = false;

  try {
    config = deepmerge(baseConfig, eval('require')(dev ? dirname + '/config/config.json' : cwd + '/config.json'));
  } catch (e) {
    if(global.disable_core_docs_log !== true) {
      console.log(`[CONFIG] Does not exist. Want a custom config? Place one here: ${dev ? dirname + '/config/config.json' : cwd + '/config.json'}`);
    }
  }

  if(config) {
    const valid = validate(config, schema);
    if (valid.errors.length > 0) {
      throw new Error(`[CONFIG] Validation error: ${valid.errors[0].stack}`);
    }
  } else {
    config = baseConfig;
  }

  return config;
};
