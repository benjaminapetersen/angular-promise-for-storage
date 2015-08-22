var gulp = require('gulp'),
  gutil = require('gulp-util'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  //rimraf = require('gulp-rimraf'),
  del = require('del');

gulp.task('clean', function() {
  return del(['./dist/**.*.js'], function(err, paths) {
    console.log('cleaned files/folders:\n', paths.join('\n'));
  })
});

gulp.task('jshint', function() {
  gulp.src('./src/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});

gulp.task('build', ['clean', 'jshint'], function () {
  return gulp.src([
      './src/config.js',
      './src/services/local.js',
      './src/services/session.js',
      './src/services/cookie.js',
      './src/services/memory.js',
      './src/services/db.js',
      './src/services/crud.js',
    ])
    .pipe(concat('promise-for-storage.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('min', ['build'], function() {
    return gulp.src('./dist/promise-for-storage.js')
            .pipe(rename('promise-for-storage.min.js'))
            .pipe(uglify().on('error', gutil.log))
            .pipe(gulp.dest('dist'));
})

gulp.task('default', ['min']);
