/**
 * Import test suite
 */
require('should');
const request = require('request');

/**
 * Define local request options
 */
const getRequestOptions = {
  url: 'http://localhost:5678/api',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
  }
};
const postRequestOptions = {
  url: 'http://localhost:5678/api',
  method: 'POST',
  json: {
    query: `{_no_fields_defined}`
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
  }
};

/**
 * Describe GraphQL tests
 */
describe("GraphQL", () => {
  it('Should be able to GET /api (GraphQL Playground)', (done) => {
    request(getRequestOptions, (error, response, body) => {
      response.statusCode.should.be.Number();
      response.statusCode.should.equal(200);
      body.should.containEql('<title>GraphQL Playground</title>');

      done();
    });
  });

  it('Should be able to POST /api (GraphQL Query)', (done) => {
    request(postRequestOptions, (error, response, body) => {
      response.statusCode.should.be.Number();
      response.statusCode.should.equal(200);
      body.should.be.Object();
      body.data.should.be.Object();
      body.data._no_fields_defined.should.be.Boolean();
      body.data._no_fields_defined.should.equal(true);

      done();
    });
  });
});
