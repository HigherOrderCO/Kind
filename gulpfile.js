var gulp = require('gulp')
var ts = require('gulp-typescript')
var replace = require('gulp-replace')
var version = require('./package.json').version

var tsProject = ts.createProject('tsconfig.json')

gulp.task('build', function () {
  return gulp
    .src('src/**/*.ts')
    .pipe(replace('__FORMALITY_VERSION__', version))
    .pipe(tsProject())
    .pipe(gulp.dest('dist/'))
});
