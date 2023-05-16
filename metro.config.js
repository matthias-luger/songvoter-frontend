// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

let config = getDefaultConfig(__dirname);
// ignore cycle warnings from the generated swagger files
config.resolver.requireCycleIgnorePatterns.push(/(^|\/|\\)generated($|\/|\\)/)

module.exports = config
