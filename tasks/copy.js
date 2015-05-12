var reload = require('browser-sync').reload;

module.exports = function (gulp, plugins, options) {
  var watching;
  return function copy () {
    if (global._WATCH && options.watch && !watching) {
      plugins.watch(options.src, function () {
        gulp.start(options.name);
      });
      watching = true;
      plugins.util.log(
        plugins.util.colors.black.bgGreen('Watching files to copy:'),
        plugins.util.colors.magenta(options.src.toString()),
        plugins.util.colors.yellow(' -> '),
        plugins.util.colors.magenta(options.dest));
    }
    return gulp.src(options.src)
      .pipe(plugins.changed(options.dest, {
        hasChanged: plugins.changed.compareSha1Digest
      }))
      .pipe(plugins.if(options.flatten, plugins.flatten()))
      .pipe(plugins.size({
        title: options.name
      }))
      .pipe(gulp.dest(options.dest))
      .on('end', reload);
    };
};
