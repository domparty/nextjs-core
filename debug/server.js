/**
 * Import base packages
 */
const App = require('../src/core');

/**
 * Create new Next.JS Core
 */
const core = new App(__dirname, process.cwd());

/**
 * Init the core
 */
core.init();
