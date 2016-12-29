/**
 * Gulp file for colour tools site
 */

/**
 * Config
 */
var sass_conf = {
  outputStyle: 'nested',
  includePaths: [
    'web/lib/font-awesome/scss'
  ],
  precision: 10,
  errLogToConsole: true
};
var prefix_conf = {
  browsers: ['last 2 versions', 'ie > 8']
};

/**
 * Load plugins
 */

// Gulp / Node utilities
var gulp = require('gulp-help')(require('gulp'));
var u = require('gulp-util');
var log = u.log;
var c = u.colors;
var del = require('del');
var plumber = require('gulp-plumber');
var argv = require('yargs').default('production', false).argv;
var watch = require('gulp-watch');

// SASS
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');
var clean = require('gulp-clean-css');
var globbing = require('gulp-css-globbing');

// JavaScript
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

// Nunjucks templating
var nunjucks = require('gulp-nunjucks-render');

// Browser Sync
var bs = require('browser-sync').create();


// Check environment
var env = 'dev';
if (argv.production) {
  env = 'prod';
}

/**
 * Error handler
 */
var onError = function (err) {

  log(c.red(err.message));
  if (err.message != 'undefined') {
    log(c.red("Error: " + err.message));
  }
  else if (err.messageFormatted) {
    // Send the error to the console.
    log(c.red("Error in file: " + err.messageFormatted));
  }
  this.emit('end')
};

/**
 * Compile SASS for development environment
 */
gulp.task('sass-dev', 'Compile SASS for development environment', function () {

  return gulp.src([
      'sass/**/*.scss'
    ],
    { base: 'sass' })
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(globbing({
      extensions: ['.scss']
    }))
    .pipe(sourcemaps.init())
    .pipe(sass(sass_conf))
    .pipe(prefix(prefix_conf))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./web/css'))
    .pipe(bs.stream({match: '**/*.css'}));
});

/**
 * Compile SASS for production environment
 */
gulp.task('sass-prod', 'Compile SASS for production environment', function () {

  sass_conf.outputStyle  = 'compressed';
  return gulp.src([
      'sass/**/*.scss'
    ],
    { base: 'sass' })
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(globbing({
      extensions: ['.scss']
    }))
    .pipe(sass(sass_conf))
    .pipe(prefix(prefix_conf))
    .pipe(clean({compatibility: 'ie8'}))
    .pipe(gulp.dest('./web/css'))
    .pipe(bs.stream({match: '**/*.css'}));
});

/**
 * Delete compiled CSS
 */
gulp.task('clean-css', 'Delete all the CSS files in the ./web/css directory', function() {

  return del(['web/css/*.css'], function (err) {
    if (err) {
      log(c.red('clean-css'), err);
    }
    else {
      log(c.green('clean-css'),'deleted old stylesheets');
    }
  });
});

/**
 * Minify and concatenate Javascript files
 */
gulp.task('scripts', function() {

  return gulp.src('scripts/**/*.js')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./web/js'))
    .pipe(rename('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./web/js'));
});

/**
 * Compile Nunjucks templates
 */
gulp.task('nunjucks', 'Compile Nunjucks templates in the ./pages directory', function() {

  return gulp.src('pages/*.+(html|nunjucks)')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(nunjucks({
      path: ['pages/templates']
    }))
    .pipe(gulp.dest('web'))
    .pipe(bs.stream({match: '**/*.html'}));
});

/**
 * Set up Browser Sync
 */
gulp.task('bs', 'Set Browser Sync to serve the ./web directory', function() {
  bs.init({
    server: {
      baseDir: "./web/"
    }
  });
});

/**
 * Watch SASS directory for changes.
 */
gulp.task('watch-sass', function() {

  watch('sass/**/*.scss', {verbose: true, usePolling: true, useFsEvents: true}, function() {
    gulp.start('sass-' + env);
  });
});

/**
 * Watch JavaScript directory for changes.
 */
gulp.task('watch-scripts', function() {

  watch('scripts/**/*.js', {verbose: true, usePolling: true, useFsEvents: true}, function() {
    gulp.start('scripts');
  });
});

/**
 * Watch Nunjucks pages directory for changes.
 */
gulp.task('watch-pages', function() {

  watch('pages/**/*.+(html|nunjucks)', {verbose: true, usePolling: true, useFsEvents: true}, function() {
    gulp.start('nunjucks');
  });
});

/**
 * Default task - compile and watch SASS, JavaScript and Nunjucks templates
 */
gulp.task('default', false, ['bs', 'sass-' + env, 'scripts', 'nunjucks', 'watch-sass', 'watch-scripts', 'watch-pages']);
