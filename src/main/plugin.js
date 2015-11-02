/* global require, module */
'use strict';

var gutil = require('gulp-util');
var through2 = require('through2');
var browserify = require('browserify');
var paths = require('path');

var PluginError = gutil.PluginError;

/**
 * Creates a browserify gulp build step.
 * @param {Object} [options] passed to browserify.
 */
module.exports = function browserificator(options) {

	var config = {

		debug: options
			&& options.debug,

		basedir: options
			&& options.basedir,

		paths: options
			&& options.paths,

		preBundle: options
			&& options.preBundle,

		push: options
			&& options.push

	};

	return through2.obj(function(file, enc, done) {
		var self = this;

		if (file.isNull()) {
			return done(null, file);
		}

		if (!config.basedir) {
			//config.basedir = file.base;
		}

		if (!config.paths) {
			config.paths = [
				file.base,
				file.cwd
			]
		}

		var bundle = browserify(file, config);

		if (typeof(config.preBundle) === 'function') {
			bundle = config.preBundle(bundle);
			if (!bundle) {
				return done(new PluginError('gulp-recipe-browserify',
					'You forgot to return the bundle'));
			}
		}

		return bundle.bundle(function(error, result) {

			if (error) {

				if (config.debug) {
					gutil.log('gulp-recipe-browserify', 'Failed to browserify ' + file.path);
				}

				return done(error);

			}

			file.contents = result;

			if (config.push) {
				self.push(file);
			}

			if (config.debug) {
				gutil.log('gulp-recipe-browserify', 'Successfully browserified ' + file.path);
			}

			return done(null, file);

		});

	});

};
