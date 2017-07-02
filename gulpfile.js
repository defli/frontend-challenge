'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var spritesmith = require('gulp.spritesmith');

var config = {
  src: 'src',
  dist: 'dist'
};

var paths = {
  scripts: [config.src + '/scripts/**/*.js'],
  styles: [config.src + '/styles/**/*.scss'],
  sprites: [config.src + '/images/sprites/*.png'],
  views: {
    main: config.src + '/index.html'
  },
  tmp: {
    sprite: '.tmp/styles/sprite.css'
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

var styles = lazypipe()
  .pipe($.sass, {
    outputStyle: 'expanded',
    precision: 10,
    noCache: true,
    style: "compact"
  })
  .pipe($.autoprefixer, 'last 3 version')
  .pipe(gulp.dest, '.tmp/styles');

///////////
// Tasks //
///////////

gulp.task('sprite', function () {
  return gulp.src(paths.sprites)
    .pipe(spritesmith({
      imgName: '../images/sprite.png',
      cssName: 'sprite.css'
     }))
    .pipe(gulp.dest('.tmp/styles/'));
});

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(styles());
});

gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('clean:tmp', function (cb) {
  rimraf('./.tmp', cb);
});

gulp.task('start:client', ['start:server', 'styles'], function () {
  openURL('http://localhost:9000');
});

gulp.task('start:server', function() {
  // @TODO "./" for bower_components
  $.connect.server({
    root: ['./', config.src, '.tmp'],
    livereload: true,
    // Change this to '0.0.0.0' to access the server from outside.
    port: 9000
  });
});

gulp.task('watch', function () {
  $.watch('.tmp/styles/main.css')
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch([paths.views.main, paths.tmp.sprite])
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe($.connect.reload());

    gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.sprites, ['sprite']);
  gulp.watch('bower.json', ['bower']);
});

gulp.task('serve', function (cb) {
  runSequence('clean:tmp',
    'sprite',
    ['lint:scripts'],
    ['start:client'],
    'watch', cb);
});

gulp.task('serve:prod', function() {
  $.connect.server({
    root: [config.dist],
    livereload: true,
    port: 9001
  });
});

// inject bower components
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: 'bower_components',
      ignorePath: '..',
      exclude: ['inputmask', 'jquery'] // inputmask has too many unneccessary deps
    }))
  .pipe(gulp.dest(config.src));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('clean:tmp', function (cb) {
  rimraf('./.tmp', cb);
});

gulp.task('client:build', ['styles'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var htmlFilter = $.filter('**/*.html');

  return gulp.src(paths.views.main)
    .pipe($.useref({searchPath: [config.src, '.tmp']}))
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe($.rev())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss({cache: true}))
    .pipe($.rev())
    .pipe(cssFilter.restore())
    .pipe(htmlFilter)
    .pipe($.htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(htmlFilter.restore())
    .pipe($.revReplace())
    .pipe(gulp.dest(config.dist));
});

gulp.task('images', function () {

  return gulp.src([config.src + '/images/**/*', '.tmp/images/**/*'])
    .pipe($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    }))
    .pipe(gulp.dest(config.dist + '/images'))
});


gulp.task('copy:extras', function () {
  return gulp.src(config.src + '/*/.*', { dot: true })
    .pipe(gulp.dest(config.dist));
});

gulp.task('build', ['clean:dist', 'clean:tmp'], function () {
  runSequence(['sprite', 'images', 'copy:extras', 'client:build']);
});

gulp.task('default', ['build']);
