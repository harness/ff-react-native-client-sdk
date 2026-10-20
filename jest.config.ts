process.env.TZ = 'GMT'

import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: false
    }
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}'],
  coverageReporters: ['lcov', 'json-summary', 'json'],
  reporters: ['default', 'jest-junit'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/test/mocks/react-native.ts',
    '^@react-native-async-storage/async-storage$': '<rootDir>/test/mocks/async-storage.ts',
    '^@harnessio/ff-react-client-sdk$': '<rootDir>/test/mocks/ff-react-client-sdk.tsx'
  },
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}

export default config
