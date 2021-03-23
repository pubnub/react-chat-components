module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/test/"],
  preset: "ts-jest",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  testEnvironment: "jsdom",
  moduleNameMapper: { "\\.(css|svg)$": "<rootDir>/test/helpers/style-mock.ts" },
  transform: { "^.+\\.(scss)$": "jest-scss-transform" },
};
