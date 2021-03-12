module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  transform: {
    "^.+\\.scss$": "jest-scss-transform",
  },
};
