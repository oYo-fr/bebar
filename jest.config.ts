export default {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  coverageProvider: 'v8',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
};
