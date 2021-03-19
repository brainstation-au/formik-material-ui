module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  collectCoverage: true,
  roots: ['src'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
};
