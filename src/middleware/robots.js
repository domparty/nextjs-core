/**
 * Setup a robots.txt
 *
 * @param options
 * @return {Function}
 */
module.exports = options => {
  /**
   * Return the express middleware
   */
  return (req, res, next) => {
    if (req.originalUrl.indexOf("robots.txt") !== -1) {
      const userAgent = "User-agent: *";
      const sitemap = `Sitemap: ${req.protocol}://${req.headers.host}/sitemap.xml`;

      const defaultDisallowRules = [
        "Disallow: /api/",
        "Disallow: /fonts/"
      ];

      const disallowRules = options.disallowAll ? ["Disallow: /"] : defaultDisallowRules.concat(options.disallowRules);

      res.type("text/plain");
      res.send(`${userAgent}\n${disallowRules.join('\n')}\n${sitemap}`);
    }

    next();
  }
};
