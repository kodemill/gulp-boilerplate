var stylish = require('jshint-stylish');

module.exports = function (gulp, plugins, options) {
  var watching;
  return function jsQuality() {
     if (global._WATCH && options.watch && !watching) {
      plugins.watch(options.src, function () {
        gulp.start(options.name);
      });
      watching = true;
      plugins.util.log(
        plugins.util.colors.black.bgGreen('Watching files to lint:'),
        plugins.util.colors.magenta(options.src.toString()));
    }
    return gulp.src(options.src)
      //.pipe(plugins.jshint())
      .pipe(plugins.jscs({
        configPath: './src/js/.jscsrc'
      }))
      //.pipe(plugins.jscsStylish())
      //.pipe(plugins.jscsStylish.combineWithHintResults())
      //.pipe(jshint.reporter('jshint-stylish'));
  };
};
