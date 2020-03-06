/**
 * Log all incoming requests from express
 *
 * @param req
 * @param res
 * @param next
 */
module.exports = request = (req, res, next) => {
  global.log.trace(`[EXPRESS][REQUEST](${req.method}): ${req.originalUrl}`);
  next();
};
