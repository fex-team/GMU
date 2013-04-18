<?php
    error_reporting( E_ERROR | E_WARNING );
    require_once dirname( __FILE__ ) . '/../conf/config.php';
    /*存放report的路径*/
    $tmpDir = ConfigTest::$testdir . DIRECTORY_SEPARATOR;
    /*report路径*/
    $reportDir = $tmpDir . "report/";
    /*最终的覆盖率路径*/
    $finalReport = $tmpDir . "report/report.xml";
    /*当前的相对路径的绝对地址，以斜杠开头*/

    if ( file_exists( $finalReport ) ) {
        unlink( $finalReport );
    }


    function report( $reportDir )
    {
        global $browserNum;
        /* for junit report，根据配置文件里设置的分隔符来分割结果  */
        $paras = explode( ConfigTest::$splitChar , $_POST[ 'config' ] );
        foreach ( $paras as $para ) {
            if ( preg_match("/^browser=/",$para) ) {
                $currBrowser = str_replace( 'browser=' , '' , $para );
            }
            elseif ( preg_match("/^browserNum=/",$para) ) {
                $browserNum = str_replace( 'browserNum=' , '' , $para );
            }
            if(!$currBrowser){
                $currBrowser = "SH12HNX01484_SystemBrowser";
            }
        }
//        if ( !$currBrowser ) {
//            echo "please set para browser\n";
//        }
        $dom = new DOMDocument( '1.0' , 'utf-8' );
        $suite = $dom->appendChild( $dom->createElement( 'testsuite' ) );
        $suite->setAttribute( "name" , $currBrowser );
        $failures = 0;
        $tests = 0;
        $time = 0;
        foreach ( $_POST as $key => $value ) {
            if ( $key == 'config' || $key == "isJS" )
                continue;
            $info = explode( "," , $value );

            $casetime = ( $info[ 4 ] - $info[ 3 ] ) / 1000;
            $time += $casetime;
            $tests++;
            $failure = (int)( $info[ 0 ] );
            $case = $suite->appendChild( $dom->createElement( 'testcase' ) );
            $case->setAttribute( "name" , $key );
            $case->setAttribute( "time" , $casetime );
            $case->setAttribute( "cov" , $info[ 2 ] );
            $case->setAttribute( 'failNumber' , $info[ 0 ] );
            $case->setAttribute( 'totalNumber' , $info[ 1 ] );
//            $case->setAttribute( 'recordCovForBrowser' , $info[ 5 ] );
            $case->setAttribute( 'browserInfo' , $currBrowser );
            $case->setAttribute( 'hostInfo' , ConfigTest::$BROWSERS[ $currBrowser ][ 0 ] );
            if ( $failure > 0 ) {
                $failures++;
                $failinfo = $case->appendChild( $dom->createElement( 'failure' ) );
                $failinfo->setAttribute( 'type' , 'junit.framework.AssertionFailedError' );
                //$kiss = join( "." , split( "_" , $key ) );
                //$failinfo->appendChild( new DOMText( $value ) );
                $failinfo->appendChild( new DOMText( "<a href=\"\">run</a>" ) );
            }
        }

        $suite->setAttribute( 'time' , $time );
        $suite->setAttribute( 'failures' , $failures );
        $suite->setAttribute( 'tests' , $tests );

        if ( !is_dir( $reportDir ) )
            mkdir( $reportDir );
        $dom->save( $reportDir . $currBrowser . ".xml" );
    }

    report( $reportDir );

    $dom = new DOMDocument( '1.0' , 'utf-8' );
    $testsuites = $dom->appendChild( $dom->createElement( 'testsuites' ) );

    if ( !$browserNum ) {
        $reportFiles = scandir( $reportDir );
        if ( sizeof( $reportFiles )-2 < $browserNum ) {
            echo "only ". sizeof( $reportFiles ) ." report created. Waiting for other reports.<br />";
            return;
        } else {
            if ( $dh = opendir( $reportDir ) ) {
                while ( ( $file = readdir( $dh ) ) !== false ) {
                    if ( substr( basename( $file ) , 0 , 1 ) == '.' || substr(basename($file),-4,4)!='.xml' ) {
                        continue;
                    }
                    $xmlDoc = new DOMDocument( '1.0' , 'utf-8' );
                    $xmlDoc->load( $reportDir . $file );
                    $xmlDom = $xmlDoc->documentElement;
                    $testsuites->appendChild( $dom->importNode( $xmlDom , true ) );
                    unlink( $reportDir . $file );
                }
                closedir( $dh );
            }
        }
    }
//    foreach ( ConfigTest::$BROWSERS as $key ) {
//        $file = $reportDir . $key . ".xml";
//        if ( !file_exists( $file ) ) {
//            echo "wait for report : $file\r\n<br />";
//            return;
//        }
//        $xmlDoc = new DOMDocument( '1.0' , 'utf-8' );
//        $xmlDoc->load( $file );
//        $xmlDom = $xmlDoc->documentElement;
//        $testsuites->appendChild( $dom->importNode( $xmlDom , true ) );
//        unlink( $file );
//    }
    $dom->save( $reportDir . "report.xml" );

    require_once 'record.php';
    record();
