/**
 * Creates a new mock object.
 * @class Mock
 * @constructor
 * @param {Object} template (Optional) An object whose methods
 *      should be stubbed out on the mock object. This object
 *      is used as the prototype of the mock object so instanceof
 *      works correctly.
 */
baidu.Mock = function ( template ) {

        //use blank object is nothing is passed in
        template = template || {};

        var mock = null;

        //try to create mock that keeps prototype chain intact
        try {
                mock = baidu.object.clone( template );
        } catch ( ex ) {
                mock = {};
        }

        //create new versions of the methods so that they don't actually do anything
        baidu.object.each( template, function ( name ) {
                if ( baidu.lang.isFunction( template[name] ) ) {
                        mock[name] = function () {
                                ok( false, "方法 " + name + "() 不应当被调用" );
                        };
                }
        } );
        //return it
        return mock;
};
/**
 * Assigns an expectation to a mock object. This is used to create
 * methods and properties on the mock object that are monitored for
 * calls and changes, respectively.
 * @param {Object} mock The object to add the expectation to.
 * @param {Object} expectation An object defining the expectation. For
 *      a method, the keys "method" and "args" are required with
 *      an optional "returns" key available. For properties, the keys
 *      "property" and "value" are required.
 * @return {void}
 * @method expect
 * @static
 */
baidu.Mock.expect = function ( mock /*:Object*/, expectation /*:Object*/ ) {

        //make sure there's a place to store the expectations
        if ( !mock.__expectations ) {
                mock.__expectations = {};
        }

        //method expectation
        if ( expectation.method ) {
                var name = expectation.method,
                    args = expectation.args || expectation.arguments || [],
                    result = expectation.returns,
                    callCount = baidu.lang.isNumber( expectation.callCount ) ? expectation.callCount : 1,
                    error = expectation.error,
                    run = expectation.run || function () {
                    };

                //save expectations
                mock.__expectations[name] = expectation;
                expectation.callCount = callCount;
                expectation.actualCallCount = 0;


                //process arguments
                baidu.array.each( args, function ( arg, i ) {
                        if ( !(arg instanceof baidu.Mock.Value) ) {
                                args[i] = baidu.Mock.Value( same, [arg], "检查" + name + "()第"+ i + "个参数的值" );
                        }
                } );

                //if the method is expected to be called
                if ( callCount > 0 ) {
                        mock[name] = function () {
                                try {
                                        expectation.actualCallCount++;
                                        equal( args.length, arguments.length, "检查方法" + name + "()  参数的个数" );
                                        for ( var i = 0, len = args.length; i < len; i++ ) {
                                                //if (args[i]){
                                                args[i].verify( arguments[i] );
                                                //} else {
                                                //    Y.Assert.fail("Argument " + i + " (" + arguments[i] + ") was not expected to be used.");
                                                //}

                                        }

                                        run.apply( this, arguments );

                                        if ( error ) {
                                                throw error;
                                        }
                                } catch ( ex ) {
                                        //route through TestRunner for proper handling
//                        Y.Test.Runner._handleError(ex);
                                        ok( false, ex );
                                }

                                return result;
                        };
                } else {

                        //method should fail if called when not expected
                        mock[name] = function () {
                                try {
                                        ok( false, "方法 " + name + "()不应当被调用" );
                                } catch ( ex ) {
                                        //route through TestRunner for proper handling
//                        Y.Test.Runner._handleError(ex);
                                        ok( false, ex );
                                }
                        };
                }
        } else if ( expectation.property ) {
                //save expectations
                mock.__expectations[name] = expectation;
        }
};

/**
 * Verifies that all expectations of a mock object have been met and
 * throws an assertion error if not.
 * @param {Object} mock The object to verify..
 * @return {void}
 * @method verify
 * @static
 */
baidu.Mock.verify = function ( mock /*:Object*/ ) {
        try {
                baidu.object.each( mock.__expectations, function ( expectation ) {
                        if ( expectation.method ) {
                                equal( expectation.callCount, expectation.actualCallCount, "检查方法" + expectation.method + "()调用的次数" );
                        } else if ( expectation.property ) {
                                equal( expectation.value, mock[expectation.property], "检查属性" + expectation.property + "  的值." );
                        }
                } );
        } catch ( ex ) {
                //route through TestRunner for proper handling
//            Y.Test.Runner._handleError(ex);
//                alert( ex );
                ok( false, ex );
        }
};

/**
 * Defines a custom mock validator for a particular argument.
 * @class Mock.Value
 * @param {Function} method The method to run on the argument. This should
 *      throw an assertion error if the value is invalid.
 * @param {Array} originalArgs The first few arguments to pass in
 *      to the method. The value to test and failure message are
 *      always the last two arguments passed into method.
 * @param {String} message The message to display if validation fails. If
 *      not specified, the default assertion error message is displayed.
 * @return {void}
 * @constructor Value
 * @static
 */

baidu.instanceOf = function ( o, type ) {
        return (o && o.hasOwnProperty && (o instanceof type));
}
baidu.Mock.Value = function ( method, originalArgs, message ) {
        if ( baidu.instanceOf( this, baidu.Mock.Value ) ) {
                this.verify = function ( value ) {
                        var args = [].concat( originalArgs || [] );
                        args.push( value );
                        args.push( message );
                        method.apply( null, args );
                };
        } else {
                return new baidu.Mock.Value( method, originalArgs, message );
        }
};

/**
 * Mock argument validator that accepts any value as valid.
 * @property Any
 * @type Function
 * @static
 */
baidu.Mock.Value.Any = baidu.Mock.Value( function () {
} );

/**
 * Mock argument validator that accepts only Boolean values as valid.
 * @property Boolean
 * @type Function
 * @static
 */
baidu.Mock.Value.Boolean = baidu.Mock.Value( baidu.lang.isBoolean );

/**
 * Mock argument validator that accepts only numeric values as valid.
 * @property Number
 * @type Function
 * @static
 */
baidu.Mock.Value.Number = baidu.Mock.Value( baidu.lang.isNumber );

/**
 * Mock argument validator that accepts only String values as valid.
 * @property String
 * @type Function
 * @static
 */
baidu.Mock.Value.String = baidu.Mock.Value( baidu.lang.isString );

/**
 * Mock argument validator that accepts only non-null objects values as valid.
 * @property Object
 * @type Function
 * @static
 */
baidu.Mock.Value.Object = baidu.Mock.Value( baidu.lang.isObject );

/**
 * Mock argument validator that accepts onlyfunctions as valid.
 * @property Function
 * @type Function
 * @static
 */
baidu.Mock.Value.Function = baidu.Mock.Value( baidu.lang.isFunction );
