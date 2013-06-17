module.exports = function( grunt ) {
    var path = require('path'),
        cliPath = path.resolve('./node_modules/smart-cov/lib/cli.js'),
        file = grunt.file;
    
    grunt.registerTask( 'smart_cov', function() {
        var opts = this.options({
                src: '',
                dest: ''
            }),
            done = this.async();


        if( !file.exists( cliPath ) ) {
            grunt.log.error();
            grunt.warn('smart-cov没有安装');
            done();
        }

        grunt.util.spawn({
            cmd: 'node',
            args: [ cliPath, 'instrument', path.resolve(opts.src), '-o', path.resolve(opts.dest) ]
        }, function( error, result ) {
            if ( error ) {
                grunt.log.error( error );
                grunt.warn( error );
                done( error );
                return;
            }

            grunt.log.writeln( result.stdout.replace(/^\n*/, '').replace(/^(.*)\n[\s\S]*$/, '$1') );
            done();
        });
    });
};