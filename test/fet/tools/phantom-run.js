/*
 * QtWebKit-powered headless test runner using PhantomJS
 *
 * PhantomJS binaries: http://phantomjs.org/download.html
 * Requires PhantomJS 1.6+ (1.7+ recommended)
 *
 * Run with:
 *   phantomjs runner.js [url-of-your-qunit-testsuite]
 *
 * e.g.
 *   phantomjs runner.js http://localhost/qunit/test/index.html
 */

/*global phantom:false, require:false, console:false, window:false, QUnit:false */

(function() {
    'use strict';

    var url, page, timeout,
        args = require('system').args;
        
    page = require('webpage').create();

    // Route `console.log()` calls from within the Page context to the main Phantom context (i.e. current `this`)
    page.onConsoleMessage = function(msg) {
        console.log(msg);
        doTest();
    };

    page.onCallback = function(message) {
        var result,
            failed;

        if (message) {
            if (message.name === 'QUnit.done') {
                result = message.data;
                failed = !result || result.failed;

                phantom.exit(failed ? 1 : 0);
            }
        }
    };

    var modules = require('./modules.js'),
        currentModuleIndex = -1,
        totalModules = modules.length,
        runedModules = 0,
        failedModules = 0;

    function waitFor(testFx, onReady, timeOutMillis) {
        var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 30001, //< Default Max Timout is 3s
            start = new Date().getTime(),
            condition = false,
            interval = setInterval(function() {
                if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                    // If not time-out yet and condition not yet fulfilled
                    condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
                } else {
                    if(!condition) {
                        // If condition still not fulfilled (timeout but condition is 'false')
                        console.log("'waitFor()' timeout");
                        phantom.exit(1);
                    } else {
                        // Condition fulfilled (timeout and/or condition is 'true')
                        // console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                        typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                        clearInterval(interval); //< Stop this interval
                    }
                }
            }, 100); //< repeat check every 250ms
    };

    function doTest(module){
        if(!module && ++currentModuleIndex < totalModules){
            module = modules[currentModuleIndex];
        }else{
            failedModules === 0 ? phantom.exit(0): phantom.exit(1);
        }

        console.log('>>>>>>>>>>test module:' + module);
        page.open('http://localhost/GMU/test/fet/bin/run.php?case=' + module, function(status) {
            if (status !== 'success') {
                console.error('Unable to access network: ' + status);
                phantom.exit(1);
            } else {
                waitFor(function(){
                    return page.evaluate(function(){
                        var el = document.getElementById('qunit-testresult');
                        if (el && el.innerText.match('completed')) {
                            return true;
                        }
                        return false;
                    });
                }, function(){
                    page.evaluate(function(){
                        var el = document.getElementById('qunit-testresult');
                        console.log(el.innerText + '\n');
                        try {
                            var failedNum = parseInt(el.getElementsByClassName('failed')[0].innerHTML, 10);
                            if(failedNum > 0){
                                failedModules++;
                            }
                        } catch (e) { }
                        return 10000;
                    });
                    
                    
                });
            }
        });
    }

    doTest();
})();