var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var _ =  require('lodash');
var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

global._LOGLEVEL = argv.log || argv.debug || argv.info;
global._WATCH = argv.watch;
global._PRODUCTION = argv.prod;

function errorHandler (err) {
  plugins.notify({
    title: 'Gulp Error',
    message: 'Error: ' + err.toString(),
    sound: 'Bottle'
  });
  plugins.util.log(plugins.util.colors.red.bold(err.toString()))
  this.emit('end');
}

var _gulpsrc = gulp.src;
function plumbedSource () {
  return _gulpsrc.apply(gulp, arguments)
    .pipe(plugins.plumber({
      errorHandler: errorHandler
    }));
}
gulp.src = plumbedSource;

function task (name, req, options) {
  return gulp.task(name, require('./tasks/' + req)(gulp, plugins, _.defaults({}, options, {
    name: name,
    src: './src/',
    dest: './build/',
    watch: true,
    errorHandler: errorHandler
  })));
}

task('clean', 'clean');

task('copy-html', 'copy', {
  src:  ['./examples/**/*.html', './src/html/**/*.html']
});

task('copy-img', 'copy', {
  src: ['./examples/**/*.{gif,jpg,jpeg,png,svg}', './src/img/**/*.{gif,jpg,jpeg,png,svg}'],
  dest: './build/img/',
  flatten: true
});

task('copy-font', 'copy', {
  src:  './src/font/**/*.{eot,svg,ttf,woff}',
  dest: './build/font/'
});

task('build-js', 'js-build', {
  dest: './build/js/',
  bundleName: 'api.js',
  browserify: {
    entries: './src/js/api/index.js',
    standalone: '$',
    debug: true
  }
});

task('build-ejs', 'ejs-build', {
  src: './src/ejs/**/*.ejs',
  dest: './build/js/',
  bundleName: 'templates.js',
  standalone: 'Component'
});

task('build-sass', 'sass-build', {
  src: './src/scss/**/*.scss',
  dest: './build/css/',
  sass: {
    outputStyle: 'expanded',
    precision: 4
  }
});

task('lint-js', 'js-quality', {
  src: './src/js/**/*.js'
});

gulp.task('bs-server', function () {
  browserSync({
    logLevel: 'info',
    logPrefix: 'bs-server',
    server: {
      baseDir: './build',
      routes: {
          '/': 'index.html'
      }
    }
  });
});

gulp.task('copy-assets', function (callback) {
  runSequence(['copy-html', 'copy-font', 'copy-img'], callback);
});

gulp.task('build', function (callback) {
  runSequence('clean',
    ['copy-assets', 'build-js', 'build-ejs', 'build-sass'],
    callback);
});

gulp.task('dev', function () {
  global._PRODUCTION = false;
  global._WATCH = true;

  runSequence('build', 'bs-server');
});
