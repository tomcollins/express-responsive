module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/vendor/*.js', 'src/*.js'],
        dest: 'public/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/js/<%= pkg.name %>.<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: []
    },
    jshint: {
      files: ['gruntfile.js', 'src/main.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['src/**/*.js'],
      tasks: ['dev'],
      options: {
        nospawn: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('dev', ['jshint', 'concat', 'uglify']);

  grunt.registerTask('default', ['jshint'/*, 'qunit'*/, 'concat', 'uglify']);

};
