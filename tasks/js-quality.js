var stylish = require('jshint-stylish');

module.exports = function (gulp, plugins, options) {
  return function jsQuality() {
    return gulp.src(options.src)
      .pipe(plugins.jscs())
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter(stylish));
  };
};
