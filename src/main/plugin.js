/* global require, module */
'use strict';

var gutil = require('gulp-util');
var through2 = require('through2');
var browserify = require('browserify');

var PluginError = gutil.PluginError;

/**
 * Creates a browserify gulp build step.
 * @param {Object} [options] passed to browserify.
 */
module.exports = function browserificator(options) {

	return through2.obj(function(file, enc, done) {
		
		if (file.isNull()) {
			return done(null, file);
		}
		
		var bundle = browserify(file, options)

		if (typeof(options.preBundle) === 'function') {
			bundle = options.preBundle(bundle);
			if (!bundle) {
				return done(new PluginError('gulp-recipe-browserify',
					'You forgot to return the bundle'));
			}
		}

		return bundle.bundle(function(error, result) {

			if (error) {
				return done(error);
			}
			
			file.contents = result;
			return done(null, file);

		});

	});

};
