module.exports = {
  env: {
    mocha: true,
  },
  globals: {
    expect: true,
  },
  rules: {
    'no-unused-expressions': 'off', // Disabling rule for unit tests to not warn on Chai's expect syntax
  },
};
