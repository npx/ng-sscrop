module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      build: ['src/sscrop.js']
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/sscrop.js',
        dest: 'dist/sscrop.min.js'
      }
    },

    copy: {
      build: {
        src: 'src/sscrop.js',
        dest: 'dist/sscrop.js',
      },
      demo: {
        src: 'dist/sscrop.min.js',
        dest: 'demo/js/sscrop.min.js',
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['jshint', 'uglify', 'copy']);
};
