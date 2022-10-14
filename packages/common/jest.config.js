module.exports = {
  coveragePathIgnorePatterns: ["/node_modules/", "/test/", "/mock/"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
};
