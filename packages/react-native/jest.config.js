module.exports = {
  preset: "jest-expo",
  coveragePathIgnorePatterns: ["/node_modules/", "/test/", "/mock/"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  testEnvironment: "node",
  transform: {
    // https://github.com/swc-project/jest/issues/85
    // https://github.com/facebook/react-native/issues/33426
    "^.+/((@)?react-native)/.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(js|ts|jsx|tsx)$": "@swc/jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
};
