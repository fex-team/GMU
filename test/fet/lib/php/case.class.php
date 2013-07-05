<?php

class Testcase
{
    /**
     * case name
     * @var string
     */
    public $name;

    public $path;

    /**
     * case id shown in html
     * @var string
     */
    public $case_id;

    /**
     * 某些用例是空的，应该直接过滤掉
     * @var unknown_type
     */
    public $empty = false;


    function __construct( $name = '' )
    {
        $this->name = $name;
    }


    public static function print_common_js()
    {
        /*加载库文件*/
        print '<script type="text/javascript" src="../lib/js/jquery-1.5.1.js"></script>' . "\n";
//        print '<script type="text/javascript" src="../lib/js/tangram.js"></script>' . "\n";
//        print '<script type="text/javascript" src="../lib/js/TMock.js"></script>' . "\n";
        print '<script type="text/javascript" src="../lib/js/testrunner.js"></script>' . "\n";
        print '<script type="text/javascript" src="../lib/js/ext_qunit.js"></script>' . "\n";
        print '<script type="text/javascript" src="../lib/js/UserAction.js"></script>' . "\n";
        print '<script type="text/javascript" src="../lib/js/TouchAction.js"></script>' . "\n";
        
        print '<link media="screen" href="../lib/css/qunit.css" type="text/css" rel="stylesheet" />' . "\n";
    }

    public function print_js( $caseName , $cov ,$release=false)
    {
        require_once ( dirname( __FILE__ ) . DIRECTORY_SEPARATOR . "../../conf/config.php" );
        $this->print_common_js();
        print '<script type="text/javascript" src="../lib/js/calcov.js"></script>' . "\n";

        // 页面中存在多个import.php请求时，每个import中都会包含Zepto，后面的Zepto会覆盖前面的Zepto，导致之前挂到$上的方法没了
        // 因此直接在head中注入zepto，import中不再包含zepto
        print '<script type="text/javascript" src="../../../dist/zepto.js"></script>' . "\n";

        if($release){  //为了支持release模式而修改 田丽丽
            print "<script type='text/javascript' src='zepto.js'></script>\n";
            print "<script type='text/javascript' src='iscroll.js'></script>\n";
            print "<script type='text/javascript' src='gmu.js'></script>\n";
        }else{
            $importurl = "import.php?f=$caseName";
            if ( $cov )
                $importurl .= '&cov=true';
            print "<script type='text/javascript' src='$importurl' ></script>\n";
        }


        /*加载测试文件*/
        $testdir = ConfigTest::$testdir;

        //$ps = explode( '.' , $this->name );
        $ps = explode( '/' , $this->name ); //为了支持xx.xx.js类型的文件名而修改 田丽丽
        print '<script type="text/javascript" src="' . $testdir . implode( '/' , $ps ) . '.js"></script>' . "\n";

        //        $cssFiles = array();
        //        foreach ( ConfigTest::$cssdir as $dir ) {
        //            $cssFiles = array_merge( $cssFiles , getAllFiles( $dir , '\.css' , '' ) );
        //        foreach ( $cssFiles as $css ) {
        //            print '<link type=text/css href="' . $css . '" rel="stylesheet" />' . "\n";
        //        }
        array_pop( $ps );
        array_push( $ps , 'tools' );
        if ( file_exists( $testdir . implode( '/' , $ps ) . '.js' ) ) {
            print '<script type="text/javascript" src="' . $testdir . implode( '/' , $ps ) . '.js"></script>' . "\n";
        } //没有就不加载了

    }

    public function match( $matcher )
    {
        if ( $matcher == '*' )
            return true;
        $len = strlen( $matcher );
        /**
         * 处理多选分支，有一个成功则成功，filter后面参数使用|切割
         * @var unknown_type
         */
        $ms = explode( ',' , $matcher );
        if ( sizeof( $ms ) > 1 ) {
            foreach ( $ms as $matcher1 ) {
                if ( $this->match( $matcher1 ) )
                    return true;
            }
            return false;
        }

        /**
         * 处理反向选择分支
         */
        if ( substr( $matcher , 0 , 1 ) == '!' ) {
            $m = substr( $matcher , 1 );
            if ( substr( $this->name , 0 , strlen( $m ) ) == $m )
                return false;
            return true;
        }

        if ( $len > strlen( $this->name ) ) {
            return false;
        }
        return substr( $this->name , 0 , $len ) == $matcher;
    }

    public static function listcase( $matcher = "*" )
    {
        require_once ( dirname( __FILE__ ) . DIRECTORY_SEPARATOR . "../../conf/config.php" );
        require_once  ( dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'filehelper.php' );


        $testdir = ConfigTest::$testdir;

        $caselist = array();
        $caselist = array_merge( $caselist , getAllFiles( $testdir , "\\.js$" , "fet" ) );

        foreach ( $caselist as $caseitem ) {
            if ( !preg_match( "/import\\.js/" , $caseitem ) ) {

                /*将文件名替换为域名方式，替换/为.，移除.js*/
                $caseitem = str_replace( $testdir , "" , $caseitem );
                //$name = str_replace( '/' , '.' , substr( $caseitem , 0 , -3 ) );
                $name = substr( $caseitem , 0 , -3 );  //为了支持xx.xx.js类型的文件名而修改 田丽丽
                $c = new Testcase( $name );
                if ( $c->empty )
                    continue;
                $c->case_id = "id_case_" . str_replace( '.' , '__' , $name );
                /* jiangshuguang 支持批量过滤，例如filter=webapp只保留webapp的所有的case*/
//                    if(!strpos($matcher,"/") && $matcher!="*"){
//                        $mod=explode("/",$name);
//                        if($mod[0]==$matcher){
//                              print( "<a href=\"run.php?case=$name\" id=\"$c->case_id\" class=\"jsframe_qunit\" target=\"_blank\" title=\"$name\" onclick=\"run('$name');\$J('#id_rerun').html('$name');return false;\">"
//                                  . $name . "</a>\n" );
//                          }
//                    }else{
                if ( $c->match( $matcher ) ) {
                    print( "<a href=\"run.php?case=$name\" id=\"$c->case_id\" class=\"jsframe_qunit\" target=\"_blank\" title=\"$name\" onclick=\"run('$name');\$J('#id_rerun').html('$name');return false;\">"
                        /*过长的时候屏蔽超出20的部分，因为隐藏的处理，所有用例不能直接使用标签a中的innerHTML，而应该使用title*/
                        . $name . "</a>\n" );
                }
//                    }
            }
        }
    }
}

?>