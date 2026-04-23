import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: './FixJSDOMEnvironment.ts',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/.+/index\\.ts$',
  ],
};

export default createJestConfig(customJestConfig);
