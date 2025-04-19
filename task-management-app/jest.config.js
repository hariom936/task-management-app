const config = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    forceExit: true,
    detectOpenHandles: true,
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'json'], // Add 'mjs'
    transform: {}, // Prevent default transformations
    // extensionsToTreatAsEsm: ['.js'], // Treat .js files in __tests__ as ESM
  };
  
  module.exports = config;