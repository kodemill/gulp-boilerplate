var gulp = require('gulp');
var loadTask = require('./');

gulp.task('js-quality', loadTask('js-quality', {

}));

gulp.task('default', loadTask('', {

}));
