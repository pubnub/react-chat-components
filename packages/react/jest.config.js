module.exports = {
  globalSetup: "./mock/global-setup.ts",
  coveragePathIgnorePatterns: ["/node_modules/", "/test/", "/mock/"],
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",
    "<rootDir>/setup-tests-after-env.js",
  ],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/mock/style-mock.ts",
    "\\.(svg)$": "<rootDir>/mock/svg-mock.tsx",
  },
  transform: {
    "^.+\\.(scss)$": "jest-scss-transform",
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
};
