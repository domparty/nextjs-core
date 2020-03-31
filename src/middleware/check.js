/**
 * Check if the Next.JS compiler is ready
 *
 * @param core
 */
module.exports = (core) => {
  /**
   * Return the middleware
   */
  return (req, res, next) => {
    if(req.originalUrl === "/core-ready-check-url") {
      res.set('Content-Type', 'text/plain');
      return res.status(200).send(`${core._nextReady}`);
    }

    next();
  };
};
