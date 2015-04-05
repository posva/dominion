'use strict';
var gulp = require('gulp');
var path = require('path');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var coveralls = require('gulp-coveralls');
var plumber = require('gulp-plumber');

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

gulp.task('coveralls', ['test'], function() {
  if (!process.env.CI) {
    return;
  }
  gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

gulp.task('default', ['eslint:src', 'test', 'coveralls']);
