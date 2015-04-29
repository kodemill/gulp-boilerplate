module.exports = function (gulp, plugins, options) {
  return function sass ( ) {
    return gulp.src(options.src)
      .pipe(plugins.if(options.sourcemaps, plugins.sourcemaps.init()))
      .pipe(plugins.sass(options.sass || {}))
      .pipe(plugins.autoprefixer())
      .pipe(plugins.if(options.minify, plugins.minifyCss()))
      .pipe(gulp.dest(options.dest));
      .pipe(plugins.if(options.sourcemaps, plugins.sourcemaps.write('./')))
  }
}
