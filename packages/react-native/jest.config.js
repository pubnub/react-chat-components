module.exports = {
  preset: "react-native",
  coveragePathIgnorePatterns: ["/node_modules/", "/test/", "/mock/"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  testEnvironment: "node",
  transform: {
    // https://github.com/swc-project/jest/issues/85
    // https://github.com/facebook/react-native/issues/33426
    "^.+/((@)?react-native)/.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(js|ts|jsx|tsx)$": "@swc/jest",
  },
};
