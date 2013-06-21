/*
 * grunt-contrib-qunit
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Nodejs libs.
    var path = require('path');

    var sprintf = require( './lib/sprintf.js' );

    var Tempfile = require('temporary/lib/file');

    // External lib.
    var phantomjs = require('grunt-lib-phantomjs').init(grunt);

    // Keep track of the last-started module, test and status.
    var currentModule, currentTest, status;
    // Keep track of the last-started test(s).
    var unfinished = {};

    // Get an asset file, local to the root of the project.
    var asset = path.join.bind(null, __dirname, '..');

    // Allow an error message to retain its color when split across multiple lines.
    var formatMessage = function(str) {
        return String(str).split('\n').map(function(s) {
            return s.magenta;
        }).join('\n');
    };

    // Keep track of failed assertions for pretty-printing.
    var failedAssertions = [];
    var logFailedAssertions = function() {
        var assertion;
        // Print each assertion error.
        while (assertion = failedAssertions.shift()) {
            grunt.verbose.or.error(assertion.testName);
            grunt.log.error('Message: ' + formatMessage(assertion.message));
            if (assertion.actual !== assertion.expected) {
                grunt.log.error('Actual: ' + formatMessage(assertion.actual));
                grunt.log.error('Expected: ' + formatMessage(assertion.expected));
            }
            if (assertion.source) {
                grunt.log.error(assertion.source.replace(/ {4}(at)/g, '  $1'));
            }
            grunt.log.writeln();
        }
    };

    var outputRows = function(rows, wrap) {
        var maxLen = [],
            strs = [],
            newvalue,
            text,
            str,
            sep;

        rows[0].forEach(function(cell, i) {
            maxLen[i] = cell.length;
        });

        rows.forEach(function(row) {
            row.forEach(function(cell, i) {
                if (cell.length > maxLen[i]) {
                    maxLen[i] = cell.length;
                }
            });
        });

        rows.forEach(function(row, i) {
            sep = i === 0 ? '^' : '|';
            str = sep + ' ';
            row.forEach(function(cell, j) {
                newvalue = wrap ? wrap( cell, i, j ) : cell;
                text = sprintf('%-' + maxLen[j] + 's', cell);
                if( newvalue !== cell ) {
                    text = text.replace( cell, newvalue );
                }

                str += text + ' ' + sep + ' ';
            });

            strs.push(str);
        });

        grunt.log.writeln(strs.join('\n'));
    }

    var tempfile;

    var coverageRender = require('./lib/cov_render.js');

    // QUnit hooks.
    phantomjs.on('qunit.moduleStart', function(name) {
        unfinished[name] = true;
        currentModule = name;
    });

    phantomjs.on('qunit.moduleDone', function(name /*, failed, passed, total*/ ) {
        delete unfinished[name];
    });

    phantomjs.on('qunit.log', function(result, actual, expected, message, source) {
        if (!result) {
            failedAssertions.push({
                actual: actual,
                expected: expected,
                message: message,
                source: source,
                testName: currentTest
            });
        }
    });

    phantomjs.on('qunit.testStart', function(name) {
        currentTest = (currentModule ? currentModule + ' - ' : '') + name;
        grunt.verbose.write(currentTest + '...');
    });

    phantomjs.on('qunit.testDone', function(name, failed /*, passed, total*/ ) {
        // Log errors if necessary, otherwise success.
        if (failed > 0) {
            // list assertions
            if (grunt.option('verbose')) {
                grunt.log.error();
                logFailedAssertions();
            } else {
                grunt.log.write('X'.red);
            }
        } else {
            grunt.verbose.ok().or.write('.');
        }
    });

    phantomjs.on('qunit.done', function(failed, passed, total, duration, covData) {
        phantomjs.halt();
        status.failed += failed;
        status.passed += passed;
        status.total += total;
        status.duration += duration;
        // Print assertion errors here, if verbose mode is disabled.
        if (!grunt.option('verbose')) {
            if (failed > 0) {
                grunt.log.writeln();
                logFailedAssertions();
            } else {
                grunt.log.ok();
            }
        }
    });

    // Built-in error handlers.
    phantomjs.on('fail.load', function(url) {
        phantomjs.halt();
        grunt.verbose.write('Running PhantomJS...').or.write('...');
        grunt.log.error();
        grunt.warn('PhantomJS unable to load "' + url + '" URI.');
    });

    // Re-broadcast qunit events on grunt.event.
    phantomjs.on('qunit.*', function() {
        var args = [this.event].concat(grunt.util.toArray(arguments));
        grunt.event.emit.apply(grunt.event, args);
    });

    phantomjs.on('fail.timeout', function() {
        phantomjs.halt();
        grunt.log.writeln();
        grunt.warn('PhantomJS timed out, possibly due to a missing QUnit start() call.');
    });

    // Pass-through console.log statements.
    phantomjs.on('console', console.log.bind(console));

    grunt.registerMultiTask("fet", "Testing...", function() {
        var done = this.async(),
            options = this.options({

                // Default PhantomJS timeout.
                timeout: 5000,

                inject: asset('tasks/lib/bridge.js'),
                phantomScript: asset('tasks/lib/phantom.js'),

                url: 'http://localhost/GMU/test/fet/bin/run.php?case='
            });

        tempfile = options.cov && new Tempfile();
        options.coverageFile = tempfile && tempfile.path;

        // Reset status.
        status = {
            failed: 0,
            passed: 0,
            total: 0,
            duration: 0
        };

        this.files.forEach(function(f) {

            var cwd = f.cwd ? (path.resolve(f.cwd) + path.sep) : '',
                files;

            files = f.src.filter(function(filepath) {

                if (!grunt.file.exists(cwd + filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            // Process each filepath in-order.
            grunt.util.async.forEachSeries(files, function(module, next) {
                var url = options.url + module.replace(/\.js$/i, '' );

                options.cov && (url += '&cov=true');

                var basename = path.basename(url);
                grunt.verbose.subhead( 'Testing ' + module + ' ' ).or.write('Testing ' + module + ' ' );

                // Reset current module.
                currentModule = null;

                // Launch PhantomJS.
                grunt.event.emit('qunit.spawn', url);
                phantomjs.spawn(url, {
                    // Additional PhantomJS options.
                    options: options,
                    // Do stuff when done.
                    done: function(err) {
                        if (err) {
                            // If there was an error, abort the series.
                            done();
                        } else {
                            // Otherwise, process next url.
                            next();
                        }
                    },
                });
            },
            // All tests have been run.

            function() {
                var coverage;
                // Log results.
                if (status.failed > 0) {
                    grunt.warn(status.failed + '/' + status.total + ' assertions failed (' +
                        status.duration + 'ms)');
                } else if (status.total === 0) {
                    grunt.warn('0/0 assertions ran (' + status.duration + 'ms)');
                } else {
                    grunt.verbose.writeln();
                    grunt.log.ok(status.total + ' assertions passed (' + status.duration + 'ms)');

                    // output coverage;
                    if ( options.cov && (coverage = grunt.file.read(tempfile.path)) ) {
                        coverage = JSON.parse( coverage );
                        grunt.log.writeln('\n覆盖率输出结果');
                        outputRows( coverageRender(coverage), function( value, x, y) {
                            if( /^100%/.test(value) ) {
                                return String(value).magenta
                            } else if( x === 1 ) {
                                return String(value).red;
                            } else if( x===0 ) {
                                return String(value).green;
                            }

                            return value;
                        } );
                    }
                }
                // All done!
                tempfile && tempfile.unlink();
                done();
            });
        });
    });
};