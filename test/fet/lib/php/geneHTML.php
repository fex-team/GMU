<?php
        require_once dirname( __FILE__ ) . '/../../conf/config.php';
/**
 * 使用注意事项：一般情况下不会所产生的测试结果表格内容不会有问题，
 * 问题的引入是没有对每次添加的数据做浏览器判断，在正常情况下浏览器的顺序恒定不变的
 * 当不同浏览器运行的测试内容不同的情况下，如ie8下采用filter=baidu.fx，
 * 而chrome下采用filter=baidu.fx.collaplse
 * 在添加浏览器的时候按照顺序会先添加chrome，再添加ie8
 * 那么当chrome下用例只有baidu.fx.collapse的时候，
 * 由于他会默认先找到的浏览器为chrome，那么与它相邻的ie8的baidu.fx.current的内容会左移到chrome下。
 * 这个跟存储数据的格式有关系：caseList
 * 							/         \
 *               baidu.fx.collapse    baidu.fx.current
 *              /           \             /            \
 *          chrome          ie8         null           ie8
 *         /  |  \         / |  \    (supposed       /   |  \
 *    fail  total hostInfo          to be chrome)  fail total hostInfo
 *
 *
 *
 * 不直接使用<style type ="text/css">来设置css是因为有的邮件客户端会过滤这样的信息
 *
 * ***/
function geneHTML($caseList, $name=''){
	date_default_timezone_set('PRC');
	$url = (isset ($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '') . $_SERVER['PHP_SELF'];
	$html = "<!DOCTYPE><html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
<style>td, th {border: 1px solid black;}</style></head><body><div>
<h2 align='center'>自动化用例测试结果".date('Y-m-d H:i:s')."</h2>
<table align='center' cellspacing='0' style='font:normal bolder 12pt Arial;border: 1px solid black; color: #000000; background-color: #fff; text-align: center;'>
<tr><th colspan='17'>全部用例统计</th></tr><tr><th rowspan='2'>用例名称</th><th rowspan='2'>总覆盖率</th>".getThBrowser($caseList).
"</tr>".getTrCase($caseList,false)."</table></div></body></html>";
//  ."</table></div>"._srcOnlyList()."</body></html>"
	return $html;
}

/**
 * 创建遗漏用例列表
 * FIXME: 需要过滤package类型，考虑使用js名称同名目录存在进行过滤或者白名单
 */
//function _srcOnlyList(){
//	require 'case.class.php';
//	$list = Testcase::listSrcOnly(false);
//	$len = sizeof($list);
//	$flag="<table cellspacing='0' style='border: 1px solid black; "
//	."color: #fff; background-color: #0d3349; "
//	."text-shadow: rgba(0, 0, 0, 0.5) 2px 2px 1px; "
//	."text-align: center;'><thead><tr><th>遗漏列表：总计$len，未过滤无需用例的package类型</th></tr><tr><td>";
////	$flag.=implode("</td></tr><tr><td>", $list);
//	$flag.="</tr></table>";
//	return $flag;
//}

/**
 *
 * 根据实际浏览器书目确认生成表头
 * @param  $caseList
 */
function getThBrowser($caseList){
	//创建浏览器相关单元格
	$thBrowser = '';
	$count = 0;
	foreach ($caseList as $casename => $casedetail) {
		//每一个用例
		foreach ($casedetail as $b => $info) {
			$thBrowser .= "<th colspan='3'>$b</th>";
			$count++;
		}
		$thBrowser .="</tr><tr>";
		break;//遍历一次就知道所有浏览器的信息
	}
	for($index = 0; $index < $count; $index++) {
		$thBrowser .= "<td>cov</td><td>fail</td><td>total</td>";
	}

	return $thBrowser;
}

/**
 *
 * 根据执行结果生成单元格信息
 * @param unknown_type $caseList
 */
function getTrCase($caseList,$forFail){
//$forFail 为真时，只显示 fail 的用例
	//创建case名对应的单元格
    $totalTrCase = '';
	$numBro = count(ConfigTest::$BROWSERS);
	foreach ($caseList as $casename => $caseDetail) {
		//每一个用例
        $ifFail = false;
		$cnurl = implode('.', explode('/', $casename));
		$trCase = "<tr><td style='text-align: left'><a href='http://{$_SERVER['HTTP_HOST']}/{$_SERVER['PHP_SELF']}/../run.php?case=$cnurl'>运行</a>$casename</td>";
		$totalCov = calTotalCov($caseDetail,$numBro);
		$trCase .= "<td title='所有覆盖率的均值'>$totalCov</td>";
		foreach ($caseDetail as $br => $infos) {
			//$b为browser名字,$info为详细信息
			$fail = $infos['fail'];
            $ifFail = $fail==0?$ifFail:true;
			$total = $infos['total'];
			$cov = $infos['cov'];
			$color = $fail == 0 ? '#34F005' : '#FF2A02';
			$trCase .= "<td style='background-color:$color'>$cov%</td><td style='background-color:$color'>$fail</td><td style='background-color:$color'>$total</td>";
        }
		$trCase .= "</tr>";
        if(!$forFail||$ifFail){
                $totalTrCase =$totalTrCase.$trCase;
        }
	}
	return $totalTrCase;
}

/**
 *
 * 计算总覆盖率信息
 * @param unknown_type $caseDetail
 * @param unknown_type $brcount
 */
function calTotalCov($caseDetail,$brcount){
    $length = -1;
    $num_statements = 0;
    $num_executed = 0;
    $totalInfo = null;//数组，记录全浏览器的覆盖情况，对文件中的每一行：覆盖为1，没覆盖为0，不计数为2
    $flag = 1;//$flag==-1时，各个浏览器覆盖率记录的文件信息有冲突，不能计算出全浏览器覆盖率（统计的文件长度不同/标记为2的不计入统计的行信息不同）
	foreach ($caseDetail as $caseInfo){
        $infos = explode(',',$caseInfo['recordCovForBrowser']);
        $length = ($length==-1||$length==count($infos))?count($infos):-1;
        if($length==-1||$length!=count($infos))
            break;//统计的文件长度不同
        else
            ;
        if($totalInfo==null){
            if(count($infos)==1){
                $flag = 0;//没有覆盖率信息
                break;
            }
            for($i=0;$i<count($infos);$i++){
                $totalInfo[$i] = $infos[$i];

            }
        }
        else{
            for($i=0;$i<count($infos);$i++){

                if($totalInfo[$i]==2){
                    continue;
                }
                elseif($infos[$i]==2){
                    $flag  = -1;//标记为2的不计入统计的行信息不同
                    break;
                }
                elseif($totalInfo[$i]==0&&$infos[$i]==1){
                    $totalInfo[$i] = 1;
                }
                else;
            }
            if($flag==-1){
                break;
            }
	    }
    }
    if($length==-1||$flag==-1){
            $totalCov = "fail";
    }
    elseif($flag==0){
            $totalCov = '0%';
    }
    else{
        for($i=0;$i<count($totalInfo);$i++){
            if($totalInfo[$i]==0)
                $num_statements++;
            elseif($totalInfo[$i]==1){
                $num_statements++;
                $num_executed++;
            }
        }
        $totalCov = number_format(100*($num_executed/$num_statements),1).'%';
    }
	return $totalCov;
}

?>