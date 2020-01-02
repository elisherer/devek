module.exports = {
  moduleDirectories: [
    "node_modules", 
    "src"
  ],
  roots: [
    "src"
  ],
  testEnvironment: "./test/jest-environment-jsdom-custom.js",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  globals: {
  }
};