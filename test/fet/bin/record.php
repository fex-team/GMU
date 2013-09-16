<?php
    /**
     * 追加接口参数，支持过滤成功用例
     * @param unknown_type $onlyfails
     */
    require_once dirname( __FILE__ ) . DIRECTORY_SEPARATOR . '../conf/Config.php';
    require_once dirname( __FILE__ ) . DIRECTORY_SEPARATOR . '../lib/php/geneHTML.php';
    function interXML( $onlyfails )
    {
        $report = ConfigTest::$testdir . 'report/report.xml';
        if ( !file_exists( $report ) )
            return array();
        $xmlFile = simpleXML_load_file( $report );
        $caseList = array();
        foreach ( $xmlFile->testsuite as $testsuite ) {
            foreach ( $testsuite->testcase as $testResult ) {
                //			$totalCov = 0;
                $browser = $testResult[ 'browserInfo' ];
                $host = $testResult[ 'hostInfo' ];
                $caseName = $testResult[ 'name' ]; //得到用例名称
                settype( $caseName , "string" ); //$caseName本来类型为object，需要做转换
                $fail = $testResult[ 'failNumber' ];
                $total = $testResult[ 'totalNumber' ];
                $cov = $testResult[ 'cov' ];
                $recordCovForBrowser = $testResult[ 'recordCovForBrowser' ];
                settype( $browser , "string" );
                settype( $recordCovForBrowser , "string" );
                settype( $host , "string" );
                settype( $fail , "string" );
                settype( $total , "string" );
                settype( $cov , "float" );

                if ( !array_key_exists( $caseName , $caseList ) ) { //如果这个用例不存在
                    $caseInfo = array(
                        'hostInfo' => $host ,
                        'fail' => $fail ,
                        'total' => $total ,
                        'cov' => $cov ,
                        'recordCovForBrowser' => $recordCovForBrowser
                    );
                    //				$totalCov += $cov;
                    $caseList[ $caseName ] = array(
                        $browser => $caseInfo //,
                        //				'totalCov'=>$totalCov
                    );

                    //				$caseList['totalCov'] = $totalCov;
                } else { //否则添加到相应的用例中去
                    $foundCase = $caseList[ $caseName ]; //找到用例名称对应的array，$caseName为key
                    if ( !array_key_exists( $browser , $foundCase ) ) { //如果没有该浏览器信息，则添加
                        //					$totalCov += $cov;
                        $caseList[ $caseName ][ $browser ] = array(
                            'hostInfo' => $host ,
                            'fail' => $fail ,
                            'total' => $total ,
                            'cov' => $cov ,
                            'recordCovForBrowser' => $recordCovForBrowser
                        );
                        //					$caseList[$caseName]['totalCov'] = $totalCov;
                    } else {
                        $foundBrowser = $foundCase[ $browser ]; //有这个浏览器
                        array_push( $foundBrowser , array(
                            'hostInfo' => $host ,
                            'fail' => $fail ,
                            'total' => $total ,
                            'cov' => $cov ,
                            'recordCovForBrowser' => $recordCovForBrowser
                        ) );
                    }
                }

            }
        }

        //根据需求添加仅记录失败情况的接口
        if ( $onlyfails ) { //如果仅考虑失败情况，此处根据用例情况过滤
            foreach ( $caseList as $name => $info ) {
                $all_success = true; //记录当前用例是否全部运行成功
                foreach ( $info as $b => $result ) {
                    if ( $result[ 'fail' ] > 0 )
                        $all_success = false;
                    //如果有失败情况则终止循环并进入下一个用例分析
                    break;
                }
                //if($all_success) //如果全部通过则从记录中移除
                //unset($caseList[$name]);
            }
        }
        return $caseList;
    }

    function record()
    {
        $kissList = interXML( false );


        if ( sizeof( $kissList ) > 0 ) {
            //针对kissList过滤，移除全部正确用例

            $html = geneHTML( $kissList );
//        echo $html;
            $report = ConfigTest::$testdir . 'report/report.html';
            $handle = fopen( "$report" , "w" );
            fwrite( $handle , $html );
            fclose( $handle );
//        require_once 'geneHistory.php';
//        geneHistory($html);
        }
    }

?>