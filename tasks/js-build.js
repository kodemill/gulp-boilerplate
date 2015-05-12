var browserify = require('browserify');
var watchify = require('watchify');
var collapse = require('bundle-collapser/plugin');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var _ = require('lodash');
var reload = require('browser-sync').reload;

module.exports = function (gulp, plugins, options) {
  var bundler = browserify(_.defaults({}, options.browserify, watchify.args))
  var u = plugins.util;
  
  var watching;
  return function jsBuild () {
    if (options.watch && global._WATCH && !watching) {
      bundler = watchify(bundler);
      bundler.on('update', jsBuild);
      bundler.on('time', function (t) {
        u.log(u.colors.yellow('(re)bundling finished after'), u.colors.magenta(t / 1000 +' s'));
      });
      watching = true;
      u.log(u.colors.black.bgGreen('Watching js to rebundle:'), u.colors.magenta(options.browserify.entries));
    }
    if (global._PRODUCTION) {
      bundler = bundler.plugin(collapse);
    }
    return bundler.bundle()
      .on('error', options.errorHandler)
      .pipe(source(options.bundleName))
      .pipe(buffer())
      .pipe(plugins.if(!global._PRODUCTION, plugins.sourcemaps.init({
        loadMaps: true
      })))
      .pipe(plugins.if(global._PRODUCTION, plugins.uglify()))
      .pipe(reload({stream: true}))
      .pipe(plugins.size({
        showFiles: true,
        title: options.name
      }))
      .pipe(plugins.if(!global._PRODUCTION, plugins.sourcemaps.write('./')))
      .pipe(gulp.dest(options.dest))
      .on('end', reload);
  };
};