require('@babel/register')({
  presets: ['@babel/preset-env'],
  ignore: ['node_modules'],
  plugins: ['babel-plugin-root-import']
});

// Import the rest of our application.
module.exports = require('./server.js');
