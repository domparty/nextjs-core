/**
 * Import vendor modules
 */
const {createSitemap} = require('sitemap');

/**
 * Setup a sitemap
 *
 * @param options
 * @return {Function}
 */
module.exports = sitemap = options => {
  let urls = [
    {
      url: '/',
      changefreq: 'weekly',
      priority: 1.0,
    }
  ];

  urls = urls.concat(options.urls);

  /**
   * Return the express middleware
   */
  return (req, res, next) => {
    if (req.originalUrl === "/sitemap.xml") {
      const sitemap = createSitemap({
        hostname: `${req.protocol}://${req.headers.host}`,
        urls,
      });

      try {
        const xml = sitemap.toXML();
        res.header('Content-Type', 'application/xml');
        res.send(xml);
      } catch (e) {
        res.status(500).end();
      }
    } else {
      next();
    }
  }
};
