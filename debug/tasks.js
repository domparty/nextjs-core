/**
 * Export all tasks for CLI use
 */
module.exports = {
  /**
   * Outputs the hello world message
   */
  exampleCommand: (core, args, completed) => {
    console.log('Hello World from a task!');
    completed();
  }
};
