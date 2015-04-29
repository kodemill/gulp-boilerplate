var browserify = require('browserify');
var collapse = require('bundle-collapser/plugin');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

module.exports = function (gulp, plugins, options) {
  return function jsBuild () {
    return browserify(root, {
      debug: options.debug,
      standalone: options.standalone
    })
    .plugin(collapse)
    .bundle()
    .pipe(source(options.bundleName))
    .pipe(buffer())
    .pipe(plugins.if(options.sourcemaps, plugins.sourcemaps.init({
      loadMaps: true
    }))
    .pipe(plugins.if(options.uglify, plugins.uglify()))
    .pipe(gulp.dest(options.dest))
    .pipe(plugins.if(options.sourcemaps, plugins.sourcemaps.write('./')));
  };
};
