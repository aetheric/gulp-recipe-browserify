/* global require, module */
'use strict';

var through2 = require('through2');
var browserify = require('browserify');

/**
 * Creates a browserify gulp build step.
 * @param {Object} [options] passed to browserify.
 */
module.exports = function browserificator(options) {

	return through2.obj(function(file, enc, done) {
		
		if (file.isNull()) {
			return done(null, file);
		}
		
		browserify(file, options)

			.bundle(function(error, result) {

				if (error) {
					return done(error);
				}
				
				file.contents = result;
				return done(null, file);

			});

	});

};
