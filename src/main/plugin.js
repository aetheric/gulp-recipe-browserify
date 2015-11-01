/* global require */
'use strict';

var transform = require('vinyl-transform');
var browserify = require('browserify');

/**
 * Creates a browserify gulp build step.
 * @param {Object} [options] passed to browserify.
 */
module.exports = function browserificator(options) {

	return transform(function(filename) {
		return browserify(filename, options).bundle();
	});

};
