module.exports = function( grunt ) {
    /*grunt.registerTask( "doc", function() {
        var done = this.async(),
            path = require('path');

        grunt.verbose.writeln( "生成doc文档..." );
        grunt.util.spawn({
            cmd: "which",
            args: [ "php" ]
        }, function( error, result ) {
            if ( error ) {
                grunt.verbose.error( error );
                done( error );
                return;
            }

            grunt.util.spawn({
                cmd: result.stdout,
                args: [ path.resolve('tasks/lib/doc/index.php') ]
            }, function( error ) {
                if ( error ) {
                    grunt.verbose.error( error );
                    done( error );
                    return;
                }
                done();
            });
        });
    });*/

    var Doc = require( 'gmudoc/lib/doc.js' );


    grunt.registerTask( 'doc', function() {
        var opts = this.options({
                cwd: '',
                files: [],
                theme: 'gmu',
                outputDir: './doc'
            }),
            done = this.async();


        var ins = new Doc( opts );

        ins.run( done );
    });
};