module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            // define the files to lint
            files: [
                'Gruntfile.js',
                'app.js',
                'app/**/*.js',
                'controllers/**/*.js',
                'models/**/*.js',
                'routes/**/*.js',
                'test/**/*.js'
            ],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                'node': true,
                'unused': 'vars',
                'white': false,
                'indent': 4,
                'onevar': true,
                'onecase' : false,
                'immed' : true,
                'debug' : false,
                'evil' : false,
                'strict' : false,
                'multistr' : false,
                'laxbreak' : false,
                'globalstrict' : false,
                'supernew' : false,
                'laxcomma' : false,
                'asi' : false,
                'scripturl' : false,
                'withstmt' : false,
                'bitwise' : true,
                'eqeqeq' : true,
                'shadow' : false,
                'expr' : false,
                'noarg' : true,
                'newcap' : true,
                'forin' : true,
                'regexdash' : false,
                'eqnull' : false,
                'browser' : true,
                'iterator' : false,
                'undef' : true,
                'latedef' : true,
                'nonstandard' : false,
                'trailing' : true,
                'jquery' : true,
                'loopfunc' : false,
                'boss' : false,
                'nonew' : true,
                'funcscope' : false,
                'regexp' : true,
                'lastsemic' : false,
                'smarttabs' : true,
                'devel' : false,
                'esnext' : false,
                'sub' : false,
                'curly' : true,
                'prototypejs' : false,
                'proto' : false,
                'plusplus' : false,
                'noempty' : false,
                'quotmark': true
            }
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['jshint', 'watch']);
};