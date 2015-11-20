# grunt-group-javascript

> Search and package javascript files in HTML

### Status
[![Build Status](https://travis-ci.org/eBaoTech/grunt-group-javascript.svg?branch=master)](https://travis-ci.org/eBaoTech/grunt-group-javascript)

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-group-javascript --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-group-javascript');
```

## The "group_javascript" task

### Overview
This task will concat the javascript files between `startLine` and `endLine`, and replace the javascript lines in html file with `<script src='htmlFileName-bundle-hash-date.js'></script>`. All javascript files will be concatenated into one file at the same folder with target html file.
In your project's Gruntfile, add a section named `group_javascript` to the data object passed into `grunt.initConfig()`.

For example:  

There is a html file which named `test/index.html`, contains javascript references as below,
```html
<script src='a.js'></script>
<script src='b.jsx' type='text/jsx'></script>
```

Simply add start and end line to define the files you want to bundle,  
```html
<!-- starts -->
<script src='a.js'></script>
<script src='b.jsx' type='text/jsx'></script>
<!-- ends -->
```

Define task,  
```js
grunt.initConfig({
  group_javascript: {
    options: {
      sourcePathPrefix: 'test',
      bundleName: 'entry',
      startLine: '<!-- starts -->',
      endLine: '<!-- ends -->',
      algorithm: 'md5',
      hashLength: 8,
      date: false,  // no date stamp in target script file name
      min: true,    // in html, target script file reference ends with '.min.js'
      jsx: true     // has jsx script file(s)
    },
    files: {
      'dest': ['test/**/*.html']
    }
  },
});
```

After grouping, create HTML file in destination folder,  
```html
<!-- starts -->
<script src='index-entry-hashcode.min.js'></script>
<!-- ends -->
```
Meanwhile, a concatenated javascript file was created at the same folder, which name is `index-entry-hashcode.jsx`. Then you can do JSX compiling and uglify base this file.

### Options

#### options.startLine
Type: `String`  
Default value: `'<!-- Project javascripts starts here -->'`  

To flag the javascript references start, must be a single line.  

#### options.endLine
Type: `String`  
Default value: `'<!-- Project javascripts ends here -->'`

To flag the javascript references end, must be a single line.  

#### options.sourcePathPrefix
Type: `String`  
Required: true

The source path prefix of source file.  
Eg. when `sourcePathPrefix: 'test'`, source file `'target': 'test/fixtures/index.html'` should be copy to `target/fixtures/index.html`  

#### options.algorithm
Type: `String`  
Default value: `md5`  

Algorithm of crypto, refers to [crypto](https://www.npmjs.com/package/crypto)  

#### options.hashLength
Type: `String`  
Default value: 8  

Hash length of crypto, refers to [crypto](https://www.npmjs.com/package/crypto)  

#### options.date
Type: `Boolean`  
Default value: `true`  

Add today to file name of `bundle.js`  

#### options.min
Type: `Boolean`  
Default value: `true`  

Create `bundle.js` as `bundle.min.js`. Not really minify javascript, only change the file name.

#### options.jsx  
Type: `Boolean`  
Default value: `true`

Create bundle javascript file with extension 'jsx'.  

#### options.bundleName  
Type: `String`  
Required: true

Target bundle javascript name.

## License
MIT
