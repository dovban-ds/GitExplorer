module.exports = {
  preset: '@react-native/jest-preset',

  setupFiles: ['./jest.setup.ts'],

  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-mmkv|react-native-reanimated|react-native-worklets|zustand)/)',
  ],
};
