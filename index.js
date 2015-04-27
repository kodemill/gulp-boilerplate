var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

function errorHandler (err) {
  plugins.notify({
    title: 'Gulp Error',
    message: 'Error: ' + err.toString(),
    sound: 'Bottle'
  });
//plugins.util.beep();
//plugins.util.log(err.toString());
  this.emit('end');
}

//hack: gulp.src + plumber + notify
function plumbedSource () {
  return gulp.src.apply(gulp, arguments)
    .pipe(plugins.plumber({
      errorHandler: errorHandler
    }));
}
gulp.src = plumbedSource;

function getTask(name, options) {
  return require('./tasks/' + name)(gulp, plugins, options);
}

module.exports = {
  getTask: getTask
}
