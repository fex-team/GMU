<?php
require_once dirname(__FILE__).'/../conf/config.php';
//error_reporting(E_ERROR|E_WARNING);
/**
 *
 * 分析源码引入及依赖关系，提供单次读取中的文件载入缓存 dfddf
 * @author yangbo
 * @姜曙光做了部分修改，可以查看diff
 */
class Analysis{
	/**
	 * 缓存数据提高效率，c映射内容，i映射依赖列表，s映射缩略名称
	 * @var array
	 */
	static private $_cache = array();
	//static private $projpath = array();
	var $circle = array();

	public function Analysis(){
		$ss = explode('/', substr($_SERVER['SCRIPT_NAME'], 1));
		/*配置修改为使用Config.php中的配置, by bell 2011-3-25
		 * if(sizeof(self::$projpath) == 0){
			self::$projpath[0] = '../../../src/';
			self::$projpath[1] = '../../../../tangram/src/';
			self::$projpath[2] = '../../../../base-me/src/';
			self::$projpath[3] = '../../../../Tangram-base/src/';
			//TODO : 项目路径提取方式应该考虑使用test切分，用于支持ui项目使用同一套框架
			}*/
	}

	/**
	 * 因测试需要更新的引入方法，domain支持多个通过,分割，支持第二参数忽略已经引入内容，递归判定跳过的入口必须提前
	 * @param $domain 期望载入的依赖库
	 * @param $exclude 期望排除的依赖库
	 * @param $parent 解决相互依赖问题
	 */
	public function get_import_srcs($domain){
		if(ConfigTest::$DEBUG) var_dump("分析$domain");
        $domainDone = preg_replace("/\s+/","",$domain);
		if(in_array($domainDone, $this->circle))
            return array();
		array_push($this->circle, $domainDone);
        $contents = array();
		$cnts = self::get_src_cnt($domainDone);

        if(sizeof($cnts["i"])>0){
            foreach($cnts["i"] as $d){
                if(!empty($d)){
                    $contents = array_merge($contents, $this->get_import_srcs($d));
                }
            }
        }

        array_push($contents,$cnts);
        return $contents;
	}


	/**
	 * 读取源文件内容，支持缓存，支持覆盖率文件读取，覆盖率路径在Config中配置
	 * @param string $domain
	 * @see ConfigTest::$covdir
	 */
	static function get_src_cnt($domain){
		if(!array_key_exists($domain, self::$_cache)){
			$cnt =''; $covcnt = '';
            $path = $domain;
			//文件在当前项目存在则取当前项目，否则取tangram项目
			foreach(ConfigTest::$srcdir as $i=>$d){
				if(ConfigTest::$DEBUG)
				var_dump($d.$path);
                $jsPath = preg_replace('/\s+/','',$d.$path);
				if(file_exists($jsPath)){
					$cnt = file_get_contents($jsPath);
					$cnt.=";\n";//读取文件内容必须加个回车
					break;
				}
			}

			//尝试读取cov目录下的文件，如果不存在则忽略
			$covpath = ConfigTest::$covdir.$path;
            $covpath = preg_replace("/\s+/","",$covpath) ;
			if(file_exists($covpath)){
				if(ConfigTest::$DEBUG)var_dump($covpath);
				$covcnt = file_get_contents($covpath).";\n";
			}
			else{
                $covcnt = $cnt;
            }
			if($cnt == ''){
				if(ConfigTest::$DEBUG)
				print "fail read file : ".$path;
				return array('', array(), '');
			}

			if(ConfigTest::$DEBUG)
			print "start read file $domain<br />";

			$is = array();
            $depend = array();
			//正则匹配，提取所有(@import xxx;)中的xxx
            preg_match('/@import\s+.+/', $cnt, $is);    //jiangshuguang
            if(count($is)>0){
                $depend = explode(",",preg_replace('/@import/','',preg_replace("/\s*/","",$is[0])));
            }
            self::$_cache[$domain] = array('c'=>$cnt, 'i'=>$depend, 'cc'=>$covcnt); //jiangshuguang
		}
		return self::$_cache[$domain];
	}
}
?>
