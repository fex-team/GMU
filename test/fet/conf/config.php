<?php
    class ConfigTest
    {
        /*配置url中分割浏览器参数的字符，用&符号在windows下会被截断*/
        public static $splitChar = '--__--';
        public static $BROWSERS = array(
            'SH12HNX01484_SystemBrowser'
        );
        public static $DEBUG = false;
        /**
         * 源码路径配置，会在所有位置寻找源码
         */
        public static $srcdir = array( "../../../src/" );
        /**
         * 测试文件路径配置
         */
        public static $testdir = "../../../test/";

        /**
         * 覆盖率相关源码所在路径
         */
        public static $covdir = "../../../src_cov/";


    }

?>