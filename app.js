/*
 * Module dependencies.
 */
global.__base = __dirname + '/';

if (process.argv[2] === undefined) {
  process.argv[2] = 'development';
}
 

var codeprez = require('./lib'),

/**
 * Expose `codeprez()`.
 */

exports = module.exports = new codeprez();