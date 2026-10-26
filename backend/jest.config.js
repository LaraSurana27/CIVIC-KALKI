/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  // Run all tests in a single process to share in-memory session state
  maxWorkers: 1,
  // Clear mock state between tests
  clearMocks: true,
  // Verbose output
  verbose: true,
};
