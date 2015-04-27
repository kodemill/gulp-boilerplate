module.exports = function (gulp, plugins, options) {
  return function copy () {
    return gulp.src(options.src)
      .pipe(plugins.changed(options.dest, {
        hasChanged: plugins.changed.compareSha1Digest
      }))
      .pipe(plugins.if(options.flatten, plugins.flatten()))
      .pipe(gulp.dest(options.dest));
  };
};
