/**
 * Import test suite
 */
require('should');
const request = require('request');

/**
 * Define local request options
 */
const requestOptions = {
  url: 'http://localhost:5678/sitemap.xml',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
  }
};

/**
 * Describe Sitemap tests
 */
describe("Sitemap", () => {
  it('Should be able to GET /sitemap.xml', (done) => {
    request(requestOptions, (error, response, body) => {
      response.statusCode.should.be.Number();
      response.statusCode.should.equal(200);
      body.should.equal('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"><url><loc>http://localhost:5678/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>');

      done();
    });
  });
});
