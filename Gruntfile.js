module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        indent: 2,
        trailing: true,
        browser: true,
        globals: {},
      },
      sys: ['Gruntfile.js', 'package.json'],
      tests: ['test/**/*.js'],
      src: ['js/**/*.js'],
    },
    'http-server': {

      'dev': {

        // the server root directory
        root: ".",

        port: 8000,
        // port: function() { return 8282; }

        host: "127.0.0.1",

        cache: 60,
        showDir: true,
        autoIndex: true,
        defaultExt: "html",

        // run in parallel with other tasks
        runInBackground: false
      }
    },
    mocha_istanbul: {
      coverage: {
        src: 'test', // a folder works nicely
        options: {
          istanbulOptions: ['--hook-run-in-context'],
          coverage: true
        }
      },
    },
    shell: {
      download: {
        options: {
          stdout: true
        },
        command: 'python3 scripts/download-resources.py'
      }
    },
  });

  grunt.event.on('coverage', function(lcov, done) {
    require('coveralls').handleInput(lcov, function(err) {
      if (err) {
        console.log(err);
        return done(err);
      }
      done();
    });
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-shell');
  //grunt.loadNpmTasks('grunt-browserify');
  // I am moving to gulp anyways...
  // browserify -e js/main.js -o built.js

  grunt.registerTask('default', ['jshint:sys', 'jshint:src', 'jshint:tests', 'coverage']);
  //grunt.registerTask('deploy', ['browserify']);
  grunt.registerTask('serve', ['http-server:dev']);
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);

  grunt.registerTask('get:img', ['shell:download']);

};
