/**
 * Import base packages
 */
const { schemaComposer } = require('graphql-compose');

/**
 * Exports the GraphQL Schema function
 *
 * @param core
 * @return {*}
 */
module.exports = core => {
  /**
   * Setup GraphQL Fields
   */
  const fields = {};

  /**
   * Map additional GraphQL fields to graphql-compose
   */
  for (let item = 0; item < core._graphQLFields.length; item++) {
    const keys = Object.keys(core._graphQLFields[item]);
    for(let i = 0; i < keys.length; i++) {
      fields[keys[i]] = schemaComposer.createResolver(core._graphQLFields[item][keys[i]]);
    }
  }

  /**
   * Inject fallback when no fields are defined
   */
  if(core._graphQLFields.length === 0) {
    fields['_no_fields_defined'] = {
      type: 'Boolean',
      resolve: () => {
        return true;
      }
    }
  }

  /**
   * Add CRUD operations via GraphQL Compose
   */
  schemaComposer.Query.addFields(fields);

  /**
   * Build the GraphQL schema
   */
  return schemaComposer.buildSchema();
};
