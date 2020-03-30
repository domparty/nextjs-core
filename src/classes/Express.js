/**
 * Import vendor packages
 */
const express = require('express');
const bodyParser = require('body-parser');

/**
 * Import middlewares
 */
const request = require('../middleware/request');

/**
 * Express class
 */
class Express {
  /**
   * Constructor
   */
  constructor() {
    /**
     * Define public variables
     */
    this.server = null;
    this.http = null;

    /**
     * Define private variables
     */
    this._expressMiddlewares = [];
    this._expressRoutes = [];

    /**
     * Setup Express server
     */
    this.server = express();

    /**
     * Trust proxy
     */
    this.server.enable('trust proxy');

    /**
     * Disable powered by header for security reasons
     */
    this.server.disable('x-powered-by');

    /**
     * Log all requests
     */
    this.server.use(request);

    /**
     * Configure app to use bodyParser()
     */
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(bodyParser.json());
  }

  /**
   * Add the middlewares to the Express server
   */
  _injectMiddlewares() {
    for (let item = 0; item < this._expressMiddlewares.length; item++) {
      this.server.use(this._expressMiddlewares[item]);
    }
  }

  /**
   * Add the routes to the Express server
   */
  _injectRoutes() {
    for (let item = 0; item < this._expressRoutes.length; item++) {
      this.server[this._expressRoutes[item].type](this._expressRoutes[item].route, this._expressRoutes[item].callback);
    }
  }

  /**
   * Add a middleware to the express server
   *
   * @param middleware
   */
  use(middleware) {
    this._expressMiddlewares.push(middleware);
  }

  /**
   * Add an express HTTP GET route
   *
   * @param route
   * @param callback
   */
  get(route, callback) {
    this._expressRoutes.push({
      type: 'get',
      route,
      callback
    });
  }

  /**
   * Add an express HTTP POST route
   *
   * @param route
   * @param callback
   */
  post(route, callback) {
    this._expressRoutes.push({
      type: 'post',
      route,
      callback
    });
  }

  /**
   * Add an express HTTP PUT route
   *
   * @param route
   * @param callback
   */
  put(route, callback) {
    this._expressRoutes.push({
      type: 'put',
      route,
      callback
    });
  }

  /**
   * Add an express HTTP PATCH route
   *
   * @param route
   * @param callback
   */
  patch(route, callback) {
    this._expressRoutes.push({
      type: 'patch',
      route,
      callback
    });
  }

  /**
   * Add an express HTTP DELETE route
   *
   * @param route
   * @param callback
   */
  delete(route, callback) {
    this._expressRoutes.push({
      type: 'delete',
      route,
      callback
    });
  }
}

/**
 * Export the Express class
 * @type {Express}
 */
module.exports = Express;
