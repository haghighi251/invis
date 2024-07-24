/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import nextJest from 'next/jest.js'
import type { Config } from 'jest';

const createJestConfig = nextJest({
  dir: './',
})
const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '@infrastructure/(.*)$': ['<rootDir>/src/infrastructure/$1'],
    "@modules/(.*)$": ["<rootDir>/src/modules/$1"],
    "@contexts/(.*)$": ["<rootDir>/src/contexts/$1"],
    "@shared/(.*)$": ["<rootDir>/src/shared/$1"],
  },
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  verbose: true,
};

export default createJestConfig(config)