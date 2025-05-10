/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.spec.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/src/**/__tests__/**',
  ],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports',
        outputName: 'jest-junit.xml',
      },
    ],
    [
      'jest-html-reporter',
      {
        pageTitle: 'Daily Diet API - Testes Jest',
        outputPath: 'reports/jest-html/test-report.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
        includeConsoleLog: true,
        sort: 'status',
        dateFormat: 'dd/mm/yyyy HH:MM:ss',
        theme: 'lightTheme',
      },
    ],
    [
      'jest-stare',
      {
        resultDir: 'reports/jest-stare',
        reportTitle: 'Daily Diet API - Relatório Detalhado',
        reportHeadline: 'Relatório de Testes Jest',
        coverageLink: '../coverage/lcov-report/index.html',
      },
    ],
  ],
};