var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var shell = require('gulp-shell');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

/**
 * This task generates CSS from all SCSS files and compresses them down.
 */
gulp.task('sass', function () {
  return gulp.src('./assets/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      noCache: true,
      outputStyle: "compressed",
      lineNumbers: false,
      loadPath: './css/*',
      sourceMap: true
    })).on('error', function(error) {
      gutil.log(error);
      this.emit('end');
    })
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./'))
    .pipe(notify({
      title: "SASS Compiled",
      message: "All SASS files have been recompiled to CSS.",
      onLast: true
    }))
    .pipe(browserSync.stream());
});

/**
 * This task minifies javascript in the js/js-src folder and places them in the js directory.
 */
gulp.task('compress', function() {
  return gulp.src('./js/js-src/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./js'))
    .pipe(notify({
      title: "JS Minified",
      message: "All JS files in the theme have been minified.",
      onLast: true
    }));
});

/**
 * Define a task to spawn Browser Sync.
 * Options are defaulted, but can be overridden within your config.js file.
 */
gulp.task('browser-sync', function() {
  browserSync.init({
    port: 8080,
    proxy: "https://insight4dimaging.local",
    openAutomatically: false,
    reloadDelay: 50,
    injectChanges: true
  });
});

/**
 * Defines the watcher task.
 */
gulp.task('watch', function() {
  // watch scss for changes and clear drupal theme cache on change
  gulp.watch(['scss/**/*.scss'], ['sass']);

  // watch js for changes and clear drupal theme cache on change
  gulp.watch(['js-src/**/*.js'], ['compress']);

});

gulp.task('default', ['watch','browser-sync']);