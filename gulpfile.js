var gulp = require('gulp')
var ts = require('gulp-typescript')
var replace = require('gulp-replace')
var version = require('./package.json').version

var tsProject = ts.createProject('tsconfig.json')

gulp.task('build', gulp.series(
  function build_ts() {
    return gulp
      .src(['src/**/*.js', 'src/**/*.ts'])
      .pipe(replace('__FORMALITY_VERSION__', version))
      .pipe(tsProject())
      .pipe(gulp.dest('dist/'))
  }, function copy_d_ts() {
    return gulp.src('src/**/*.d.ts').pipe(gulp.dest('dist/'));
  })
);
