/**
 * Import test suite
 */
require('should');
const request = require('request');

/**
 * Define local request options
 */
const requestOptions = {
  url: 'http://localhost:5678/robots.txt',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
  }
};

/**
 * Describe Robots tests
 */
describe("Robots", () => {
  it('Should be able to GET /robots.txt', (done) => {
    request(requestOptions, (error, response, body) => {
      response.statusCode.should.be.Number();
      response.statusCode.should.equal(200);
      body.should.equal('User-agent: *\nDisallow: /\nSitemap: http://localhost:5678/sitemap.xml');

      done();
    });
  });
});
