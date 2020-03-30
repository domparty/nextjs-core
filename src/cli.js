/**
 * Function to check if a task exists
 *
 * @param core
 * @param argv
 */
module.exports = (core, argv) => {
  let tasks = {};
  try {
    tasks = require(`${core.dirname}/tasks`);
  } catch(e) {
    global.log.error(`[TASK] Incorrect/missing tasks file: ${core.dirname}/tasks`);
    global.log.error(`[TASK] Using empty file for this session!`);
    global.log.error(e)
  }
  const task = tasks[argv[0]];

  // Make sure process isn't stuck and can eat RAM
  const maxExecutionTimeout = setTimeout(() => {
    global.log.fatal(`[TASK] Error: Max Execution Time Reached! Process terminated!`);
    setTimeout(() => {
      process.exit(1);
    }, 0);
  }, core.config.cli.maxExecutionTimeout * 1000);

  const completed = () => {
    // End tasks here
    clearTimeout(maxExecutionTimeout);

    // Make sure when completed is called process is killed
    setTimeout(() => {
      process.exit(0);
    }, 0)
  };

  if (typeof task === 'undefined') {
    global.log.fatal(`[TASK](${argv[0]}) Not found!`);
    global.log.fatal(`[TASK] Tasks available: ${Object.keys(tasks).join(', ')}`);

    completed();
    return;
  }

  task(core, argv.slice(1, argv.length), completed);
};
