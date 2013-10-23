module.exports = function( grunt ) {
    var glob = require("glob");

    grunt.registerTask( 'demo', function() {
        var opts = this.options({
                cwd: './examples/widget/',
                files: '**/*.html',
                output: './examples/assets/demos.js'
            }),
            output = {};

        var demos = glob.sync( opts.files, {
            cwd: opts.cwd
        });

        demos.forEach(function(demo){
            var content = grunt.file.read(opts.cwd + demo),
                widget = demo.match(/(^.*)\//)[1],
                //  <title>render方式创建add2desktop</title>
                title = content.match(/<title>(.*?)<\/title>/)[1];

            if(!output[widget]){
                output[widget] = [];
            }
            output[widget].push({
                file: demo,
                title: title
            });
        });

        grunt.file.write(opts.output, 'var demos = ' + JSON.stringify(output) + ';');
    });
};