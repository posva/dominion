'use strict';
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var coffee = require('gulp-coffee');
var istanbul = require('gulp-coffee-istanbul');
var plumber = require('gulp-plumber');
var coffeeify = require('gulp-coffeeify');
var through = require('through');
var jade = require('gulp-jade');
var nodemon = require('gulp-nodemon');
var coffeelint = require('gulp-coffeelint');
var ghPages = require('gulp-gh-pages');
var del = require('del');
var isDist = process.argv.indexOf('watch') === -1;
var deployDir = process.argv.indexOf('deploy') === -1 ? '' : 'deploy/';

gulp.task('lint:js', function() {
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

gulp.task('lint:test', function() {
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

gulp.task('lint:coffee', function() {
  return gulp.src('@(server|client)/**/*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(coffeelint.reporter('fail'));
});

gulp.task('lint', ['lint:js', 'lint:coffee']);

gulp.task('test', function(done) {
  gulp.src(['js/**/*.js', '@(server|client)/**/*.coffee'])
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function() {
      gulp.src(['test/**/*.@(js|coffee)'])
        .pipe(plumber())
        .pipe(mocha())
        .pipe(istanbul.writeReports()) // Creating the reports after tests runned
        .on('end', done);
    });
});

gulp.task('html', function() {
  return gulp.src('client/**/*.jade')
    .pipe(isDist ? through() : plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./' + deployDir + 'public'));
});

gulp.task('js', function() {
  return gulp.src('client/main.coffee')
    .pipe(isDist ? through() : plumber())
    .pipe(coffeeify({
      options: {
        debug: !isDist
      }
    }))
    .pipe(gulp.dest('./' + deployDir + 'public'));
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
  return gulp.src('./server/**/*.coffee')
    .pipe(coffee({
      bare: true
    }).on('error', console.log))
    .pipe(gulp.dest('./' + deployDir + 'build/'));
});

// TODO copy data
gulp.task('build', ['js', 'html', 'js:server']);

gulp.task('watch', ['start', 'js', 'html'], function() {
  gulp.watch('client/**/*.jade', ['html']);
  gulp.watch([
    'client/**/*.coffee',
    'js/**/*.js'
  ], ['js']);
});

gulp.task('deploy', ['build'], function() {
  del.sync(['heroku-deploy']);
  return gulp.src(['deploy/**/*', 'package.json'])
    .pipe(ghPages({
      //push: false,
      force: true,
      branch: 'master',
      cacheDir: 'heroku-deploy',
      remoteUrl: 'git@heroku.com:dominiongame.git'
    }));
});

gulp.task('default', ['lint', 'test']);
