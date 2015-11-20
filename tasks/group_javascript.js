/*
 * grunt-group-javascript
 * https://github/com/ebaotech/grunt-group-javascript
 *
 * Copyright (c) 2015 brad.wu
 * Licensed under the MIT license.
 */

'use strict';

var crypto = require('crypto');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('group_javascript', 'Search and package javascript files in HTML', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      // punctuation: '.',
      // separator: ', ',
      startLine: '<!-- Project javascripts starts here -->',
      endLine: '<!-- Project javascripts ends here -->',
      algorithm: 'md5',
      hashLength: 8,
      min: true,
      date: false,
      jsx: true
    });

    if (!options.sourcePathPrefix) {
        grunt.fail.fatal('"sourcePathPrefix" can not be empty.');
    }
    if (!options.bundleName) {
        grunt.fail.fatal('"bundleName" can not be empty');
    }

    var today = new Date();
    var month = today.getMonth() + 1;
    month = month >= 10 ? month : ('0' + month);
    var day = today.getDate();
    day = day >= 10 ? day : ('0' + day);
    today = today.getFullYear() + '' + month + day;

    var path = function(filePath) {
        var fileFolder = '';
        var fileName = '';

        var lastFileSeparatorIndex = filePath.lastIndexOf('/');
        if (lastFileSeparatorIndex !== -1) {
            fileFolder = filePath.substring(0, lastFileSeparatorIndex + 1);
            fileName = filePath.substring(lastFileSeparatorIndex + 1);
        } else {
            fileName = filePath;
        }
        fileName = fileName.substring(0, fileName.lastIndexOf('.'));
        grunt.log.writeln('File folder "' + fileFolder + '"');
        grunt.log.writeln('File name "' + fileName + '"');
        return {
            folder: fileFolder,
            file: fileName
        };
    };

    var getScriptBundleFileName = function(sourceFile, options, scriptsContent) {
        var hash = crypto.createHash(options.algorithm).update(scriptsContent).digest('hex');
        var suffix = hash.slice(0, options.hashLength);
        var ext = options.jsx ? 'jsx' : 'js';
        return {
            file: sourceFile.file + '-' + options.bundleName + '-' + suffix +  (options.date ? ('-' + today) : '') + '.' + ext,
            min: sourceFile.file + '-' + options.bundleName + '-' + suffix +  (options.date ? ('-' + today) : '') + (options.min ? '.min' : '') + '.js'
        };
    };

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var lineRegExp = /\r\n|\r|\n/;
      var jsTagSrcRegExp = /(['|"]{1})(.*\.jsx?)(['|"]{1})/;

      // Concat specified files.
      var src = f.src.filter(function(filePath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filePath)) {
          grunt.log.warn('Source file "' + filePath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function(filePath) {
        // Read file source.
        grunt.log.writeln('Process file [' + filePath + '] starting...');
        var sourceFile = path(filePath);
        var fileContent = grunt.file.read(filePath);
        // grunt.log.writeln(fileContent.length);
        var lines = fileContent.split(lineRegExp);
        // grunt.log.writeln(lines ? lines.length : 'No line read.');

        var needPackageJavascriptFiles = false;
        var scriptTags = [];
        var newLines = [];
        var scriptTagIndex = -1;
        // scan html file to find the project javascript files
        // push to script files
        lines.forEach(function(line, index) {
            if (line.indexOf(options.startLine) !== -1) {
                newLines.push(line);
                needPackageJavascriptFiles = true;
                scriptTagIndex = index + 1;
            } else if (line.indexOf(options.endLine) !== -1) {
                newLines.push(line);
                needPackageJavascriptFiles = false;
            } else if (needPackageJavascriptFiles) {
                scriptTags.push(line);
            } else {
                newLines.push(line);
            }
        });
        // grunt.log.writeln(scriptTagIndex);
        if (scriptTags.length !== 0) {
            var scriptTagsPath = [];
            var scriptsContent = scriptTags.map(function(tag) {
                var match = jsTagSrcRegExp.exec(tag);
                if (match != null) {
                    var scriptFilePath = sourceFile.folder + match[2];
                    if (!grunt.file.exists(scriptFilePath)) {
                        grunt.log.error('Javascript file "' + scriptFilePath + '" not found.');
                    } else {
                        return '/* from file: ' + scriptFilePath + ' */\r' + grunt.file.read(scriptFilePath);
                    }
                }
                return null;
            }).filter(function(script) {
                return script != null;
            }).join('\r\r');

            var targetFilePath = filePath.substring(options.sourcePathPrefix.length);
            if (targetFilePath[0] === '/') {
                targetFilePath = targetFilePath.substring(1);
            }
            var targetFolder = f.dest;
            if (targetFolder[targetFolder.length - 1] !== '/') {
                targetFolder = targetFolder + '/';
            }
            targetFilePath = targetFolder + targetFilePath;
            // grunt.log.writeln(targetFilePath);
            var scriptFileName = getScriptBundleFileName(sourceFile, options, scriptsContent);
            var targetScriptFilePath = targetFilePath.substring(0, targetFilePath.lastIndexOf('/')) + '/' + scriptFileName.file;
            grunt.file.write(targetScriptFilePath, scriptsContent);
            grunt.log.writeln('Target javascript file "' + targetScriptFilePath + '" created.');

            newLines.splice(scriptTagIndex, 0, '<script src="' + scriptFileName.min + '"></script>');
            grunt.file.write(targetFilePath, newLines.join('\r'));
            grunt.log.writeln('File [' + filePath + '] processed.');
        }

        return newLines.join('\r');
      });
    });
  });
};
