/*
 * grunt-group-javascript
 * https://github/com/ebaotech/grunt-group-javascript
 *
 * Copyright (c) 2015 brad.wu
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        targetPath: 'test/expected',
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['test/expected']
        },

        // Configuration to be run (and then tested).
        group_javascript: {
            default_options: {
                options: {
                    sourcePathPrefix: 'test',
                    // date: true,
                    bundleName: 'bundle',
                    min: true
                },
                files: {
                    '<%= targetPath %>': ['test/fixtures/*.html']
                }
            },
        },
        react: {
            default_options: {
                files: [{
                    expand: true,
                    cwd: '<%= targetPath %>',
                    src: ['**/*.jsx'],
                    dest: '<%= targetPath %>',
                    ext: '.js'
                }]
            }
        },
        uglify: {
            default_options: {
                options: {
                    // banner: '/** <%= pkg.groupId %>.<%= pkg.artifactId %>.V<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= targetPath %>',
                    src: '**/*.js',
                    dest: '<%= targetPath %>',
                    ext: '.min.js'
                }]
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-react');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'group_javascript', 'react', 'uglify']); //, 'nodeunit'

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
