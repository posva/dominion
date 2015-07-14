'use strict';
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var coffee = require('gulp-coffee');
var istanbul = require('gulp-istanbul');
var plumber = require('gulp-plumber');
var coffeeify = require('gulp-coffeeify');
var through = require('through');
var jade = require('gulp-jade');
var nodemon = require('gulp-nodemon');
var isDist = process.argv.indexOf('watch') === -1;

gulp.task('eslint:src', function() {
  return gulp.src(['js/**/*.js', 'gulpfile.js'])
    .pipe(eslint({
      useEslintrc: false,
      env: {
        browser: 1,
        node: 1
      },
      rules: {
        quotes: [1, 'single'],
        strict: 1,
        eqeqeq: 2,
        'comma-dangle': 0,
        'no-extend-native': 0
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('eslint:test', function() {
  return gulp.src(['test/**/*.js'])
    .pipe(eslint({
      useEslintrc: false,
      env: {
        browser: 1,
        node: 1
      },
      rules: {
        quotes: [1, 'single'],
        strict: 1,
        eqeqeq: 2,
        'comma-dangle': 0,
        'no-extend-native': 0,
        'no-unused-expressions': 0
      },
      globals: {
        describe: 0,
        it: 0,
        before: 0,
        beforeEach: 0,
        after: 0,
        afterEach: 0
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test', function(done) {
  gulp.src(['js/**/*.js'])
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function() {
      gulp.src(['test/**/*.js'])
        .pipe(plumber())
        .pipe(mocha())
        .pipe(istanbul.writeReports()) // Creating the reports after tests runned
        .on('end', done);
    });
});

gulp.task('html', function() {
  gulp.src('client/**/*.jade')
    .pipe(isDist ? through() : plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('js', function() {
  gulp.src('client/main.coffee')
    .pipe(isDist ? through() : plumber())
    .pipe(coffeeify({
      options: {
        debug: !isDist
      }
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('start', function() {
  nodemon({
    script: 'server/server.coffee',
    ext: 'coffee',
    nodeArgs: ['--nodejs', '--debug'],
    ignore: ['client/**/*', 'public/*.js'],
    env: {
      'NODE_ENV': 'development'
    }
  });
});

gulp.task('js:server', function() {
  gulp.src('./server/**/*.coffee')
    .pipe(coffee({
      bare: true
    }).on('error', console.log))
    .pipe(gulp.dest('./build/'));
});

gulp.task('build', ['js', 'html', 'js:server']);

gulp.task('watch', ['start', 'js', 'html'], function() {
  gulp.watch('client/**/*.jade', ['html']);
  gulp.watch([
    'client/**/*.coffee',
    'js/**/*.js'
  ], ['js']);
});

gulp.task('default', ['eslint:src', 'test']);
