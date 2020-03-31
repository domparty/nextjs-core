/**
 * Import test suite
 */
require('should');
const request = require('request');

/**
 * Import our package
 */
const NextCore = require('../src/core');

/**
 * Define local request options
 */
const requestOptions = {
  url: 'http://localhost:5678/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
  }
};

/**
 * Define globals
 */
global.core = null;
global.disable_core_docs_log = true;

after((done) => {
  global.core.exit();
  done();
});

/**
 * Describe Core tests
 */
describe("Core", () => {
  it('Should be able to construct a new Next.JS core without error', (done) => {
    global.core = new NextCore(`${__dirname}/../debug`, `${process.cwd()}/../debug`);
    done();
  });

  it('Should be able to init the Next.JS core without error', (done) => {
    global.core.init(() => {
      done();
    });
  });

  it('Should be able to GET /', (done) => {
    request(requestOptions, (error, response, body) => {
      response.statusCode.should.be.Number();
      response.statusCode.should.equal(200);
      body.should.containEql('<div>Hello World!</div>');

      done();
    });
  });
});
