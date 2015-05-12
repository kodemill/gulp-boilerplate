var reload = require('browser-sync').reload;

module.exports = function (gulp, plugins, options) {
  var watching;
  return function sass ( ) {
    if (global._WATCH && options.watch && !watching) {
      plugins.watch(options.src, function () {
        gulp.start(options.name);
      });
      watching = true;
      plugins.util.log(
        plugins.util.colors.black.bgGreen('Watching sass:'),
        plugins.util.colors.magenta(options.src.toString()));
    }
    return gulp.src(options.src)
      .pipe(plugins.if(!global._PRODUCTION, plugins.sourcemaps.init()))
      .pipe(plugins.sass(options.sass))
      .pipe(plugins.autoprefixer())
      .pipe(plugins.if(global._PRODUCTION, plugins.minifyCss()))
      .pipe(reload({stream: true}))
      .pipe(plugins.size({
        showFiles: true,
        title: options.name
      }))
      .pipe(plugins.if(!global._PRODUCTION, plugins.sourcemaps.write('./')))
      .pipe(gulp.dest(options.dest))
      .on('end', reload);
  }
}
