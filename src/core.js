/**
 * Import vendor packages
 */
const fs = require('fs');
const next = require('next');
const instantListen = require('instant-listen');

/**
 * Import Express base class
 */
const Express = require('./classes/Express');

/**
 * Import middlewares
 */
const fallback = require('./middleware/fallback');
const check = require('./middleware/check');
const headers = require('./middleware/headers');
const pwa = require('./middleware/pwa');
const robots = require('./middleware/robots');
const sitemap = require('./middleware/sitemap');
const graphql = require('./middleware/graphql');

/**
 * DOMParty Next.JS Core
 */
class Core extends Express {
  /**
   * Constructor
   *
   * @param dirname
   * @param cwd
   * @param nextConfig
   */
  constructor(dirname = '', cwd = '', nextConfig = {}) {
    /**
     * Initialize Express class
     */
    super();

    /**
     * Check if a core is already constructed
     */
    if(global.domparty_core_constructed) {
      console.error('[CORE] Is already constructed!');
      process.exit(1);
      return;
    } else {
      global.domparty_core_constructed = true;
    }

    /**
     * Define private variables
     */
    this._initialized = false;
    this._nextReady = false;
    this._graphQLFields = [];
    this._dev = process.env.NODE_ENV !== 'production';
    this._test = process.env.NODE_TEST === 'true';

    /**
     * Define public variables
     */
    this.config = require('./config')(dirname, cwd);
    this.nextBaseConfig = nextConfig;
    this.dirname = dirname;
    this.cwd = cwd;
    this.graphql = require('./modules/graphql')(this);

    /**
     * Check if the log directory exists
     */
    if (!fs.existsSync(`${this._dev ? this.dirname : this.cwd}/${this.config.logger.location}`)) {
      fs.mkdirSync(`${this._dev ? this.dirname : this.cwd}/${this.config.logger.location}`);
    }

    /**
     * Init logger and set log level
     */
    global.log = require('simple-node-logger').createSimpleLogger({
      logFilePath: `${this._dev ? this.dirname : this.cwd}/${this.config.logger.location}/${this.config.logger.filename}`,
      timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
    });
    global.log.setLevel(!this._test ? this.config.logger.level : 'fatal');

    /**
     * Show info
     */
    if(global.disable_core_docs_log !== true) {
      const packageInformation = require(__dirname + '/../package.json');

      console.log('## DOMParty Next.JS Core');
      console.log('## Documentation: https://github.com/domparty/nextjs-core');
      console.log(`## Core Version: \u001b[32m${packageInformation.version}\u001b[0m`);
      console.log('');
    }
  }

  /**
   * Add a GraphQL field to graphql-compose
   *
   * @param field
   */
  addGraphQLField(field) {
    this._graphQLFields.push(field);
  }

  /**
   * Initialize the Next.JS Core
   *
   * @param completed
   */
  async init(completed = () => {}) {
    /**
     * Check if we are initialized already
     */
    if(this._initialized) {
      console.error(`[CORE] Is already initialized!`);
      process.exit(1);
      return;
    } else {
      this._initialized = true;
    }

    /**
     * Check if we are running in CLI mode
     */
    if (process.argv[2] && process.env.NODE_ENV !== "test") {
      require(`./cli.js`)(this, process.argv.slice(2, process.argv.length));
      return;
    }

    /**
     * Create Next.JS app
     */
    const handler = instantListen(async () => {
      const nextDir = process.env.NODE_ENV === "test" ? this.dirname : this.dirname + '/../frontend';
      const nextDev = process.env.NODE_ENV === "test" ? false : this._dev;
      const app = next({dev: nextDev, dir: nextDir, conf: this.nextBaseConfig});

      global.log.info(`[NEXT.JS] Is warming up...`);

      const handle = app.getRequestHandler();
      await app.prepare();

      global.log.info(`[NEXT.JS] Ready!`);
      this._nextReady = true;

      completed();
      return handle;
    });

    /**
     * Include GraphQL middlewares
     */
    graphql(this);

    /**
     * Expose core headers
     */
    this.server.use(headers(this));

    /**
     * Add core Next.JS checks
     */
    this.server.use(check(this));

    /**
     * Include own middleware's
     */
    this.server.use(pwa(this.config));
    this.server.use(robots(this.config.robots));
    this.server.use(sitemap(this.config.sitemap));

    /**
     * Add custom middlewares/routes
     */
    this._injectMiddlewares();
    this._injectRoutes();

    /**
     * Next.JS fallback
     */
    this.server.use(fallback(this));

    /**
     * Let Next.JS serve everything!
     */
    this.server.use(handler);

    /**
     * Start server on specific port
     */
    this.http = this.server.listen(this.config.application.port, this.config.application.host, err => {
      if (err) throw err;
      handler.init();
      global.log.info(`[NODE] App running at: ${this.config.application.host}:${this.config.application.port}`);
    });

    /**
     * Listen for Next.JS errors
     */
    handler.ready.catch(err => {
      console.error(err);
      process.exit(1);
    });
  }

  /**
   * Stops the Next.JS Application
   */
  exit() {
    this.http.close();
  }
}

/**
 * Export the Core class
 */
module.exports = Core;
