const { parsed: localEnv } = require("dotenv").config();
const withSass = require('@zeit/next-sass');
const path = require('path');
//const { withSentryConfig } = require('@sentry/nextjs');

const webpack = require("webpack");
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);

const moduleExports = withSass({
  webpack: config => {
    const env = { API_KEY: apiKey };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'scss')],
  },
  loaders: [
    { test: /\.js$/, loader: 'babel', query: {compact: true} }
	]
});

const SentryWebpackPluginOptions = {}
module.exports = moduleExports
