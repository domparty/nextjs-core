/**
 * Export the GraphQL Middleware
 *
 * @param core
 */
module.exports = (core) => {
  /**
   * Check if we need GraphQL
   */
  if (core.config.graphql.enabled) {
    /**
     * Add the GraphQL API
     */
    core.server.post('/api', require('express-graphql')({
      schema: core.graphql
    }));

    /**
     * Add the GraphQL Playground
     */
    if (core._dev) {
      core.server.get('/api', require('graphql-playground-middleware-express').default({
        endpoint: '/api',
        settings: {
          'schema.polling.enable': false
        }
      }));
    }
  }
};
