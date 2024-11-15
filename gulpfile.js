// const gulp = require('gulp');
// const sass = require('gulp-sass')(require('sass'));

// gulp.task('sass', function () {
//   return gulp.src('styles/*.scss').pipe(sass()).pipe(gulp.dest('assets'));
// });

// gulp.task('watch', function () {
//   gulp.watch('styles/**/*.scss', gulp.series('sass'));
// });

const gulp = require('gulp');
const sass = require('gulp-dart-sass');

gulp.task('sass', function () {
  return gulp.src('styles/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('assets'));
});

gulp.task('watch', function () {
  gulp.watch('styles/**/*.scss', gulp.series('sass'));
});
