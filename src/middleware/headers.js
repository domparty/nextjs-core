/**
 * Add app specific headers to the express server
 *
 * @param core
 */
module.exports = (core) => {
  /**
   * Return the middleware
   */
  return (req, res, next) => {
    if(core.config.application.dompartyHeaders) {
      const packageInformation = require(__dirname + '/../../package.json');
      res.set('X-DOMParty-Core', packageInformation.version);
    }

    next();
  };
};
