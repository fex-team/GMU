<?php
error_reporting(E_ERROR | E_WARNING | E_PARSE);

//初始化
define("DS", DIRECTORY_SEPARATOR);
define("PS", PATH_SEPARATOR);

define("BASE_DIR", dirname(__FILE__).DS);

header("Content-type: text/html; charset=utf-8");

class GMU2FIS {
    const TYPE_WEBAPP = "widget";

    protected $type;
    protected $outputDir;
    protected $srcDir;
    protected $cssDir;
    protected $components;
    protected $_cache_files = array();
    protected $_dependences = array();
    protected $_zipObj;

    protected function __construct($type = GMU2FIS::TYPE_WEBAPP, $srcDir = null, $cssDir=null, $dir = '/static/common/lib/gmu'){
        $this->type = $type;
        $this->outputDir = $dir;
        $this->srcDir = $srcDir?$srcDir:BASE_DIR.'_src';
        $this->cssDir = $cssDir?$cssDir:BASE_DIR.'assets';
    }

    protected function parse(){
        $this->components = array();
        $this->parseZepto();
        $this->parseBase();
        $this->parseWidget();
    }

    protected function render(){
        $tmpFile = tempnam('./', 'gmu2fis');
        $this->_zipObj = $zipObj = new ZipArchive();
        if(!$zipObj->open($tmpFile, ZIPARCHIVE::CREATE)){
            throw new Exception("Zip 无法写入");
        }

        foreach($this->components as $component) {
            $this->renderComponent($component);
        }

        //生成gmuDeps.php文件
        $deps = array();
        foreach($this->components as $component){
            if(!empty($component['dependences'])){
                $_deps = array();
                foreach($component['dependences'] as $_dep){
                    $_com = $this->components[$_dep];
                    $_js = $this->outputDir.'/'.$_com['name'].'/'.$_com['component'].'.js';
                    $_deps[$_js] = $_js;
                }
                $js = $this->outputDir.'/'.$component['name'].'/'.$component['component'].'.js';
                $deps[$js] = $_deps;
            }
        }
        $zipObj->addFromString('gmuDeps.php', '<?php $gmuDeps = ' . var_export($deps, true) . ';');

        $zipObj->close();
        $fileName = "gmu_".$this->type."2.0.0.zip";
        if(@copy($tmpFile, $fileName)) {
            echo '已经生成了一个ZIP文件在当前目录，文件名为'.$fileName;
        }
        @unlink($tmpFile);
    }

    protected function renderComponent($component){
        $zipObj = $this->_zipObj;
        $content = '';
        foreach($component['dependences'] as $require) {
            $content .= 'require(\'gmu:'.$this->getNameByPath($require).'\');'."\n";
        }
        $content.=$component['content']."\nexports = ".$component['export'].";";
        $zipObj->addFromString($component['name'].'/'.$component['component'].'.js', $content);

        //收集看有多少主题要处理
        $widgetComponent=null;
        if(!empty($component['plugin'])){
            $widgetComponent = & $this->components[$component['widgetPath']];
        } else if(!empty($component['widget'])){
            $widgetComponent = & $component;
        }
        if($widgetComponent){
            $themes = array();
            if(!empty($widgetComponent['css']['themes'])){
                $themes = array_merge($themes, array_keys($widgetComponent['css']['themes']));
            }
            if(!empty($widgetComponent['plugins']))foreach($widgetComponent['plugins'] as $plugin){
                $plugin = $this->components[$plugin];
                if(!empty($plugin['css']['themes'])){
                    $themes = array_merge($themes, array_keys($plugin['css']['themes']));
                }
            }
            $themes = array_unique($themes);
            foreach($themes as $theme){
                $file = $component['widget'].'.'.$theme.'/'.(!empty($component['plugin'])?$component['component'].'/'.$component['component'].'.js':$component['widget'].'.'.$theme.'.js');
                $zipObj->addFromString($file, (!empty($component['plugin'])?"require('gmu:".$component['widget'].".".$theme."');\n":"").
                    "exports = require('gmu:".$component['name']."');"
                );
            }
        }



        if(!empty($component['css'])){
            $css = $component['css'];
            $cssContent = $this->getFileConetent($css['relativePath'], 'css');
            if(!empty($css['dependences'])){
                foreach($css['dependences'] as $dependence){
                    $dependencePath = $this->cssDir.'/'.$dependence;
                    if(!file_exists($dependencePath))continue;
                    $cssContent = "@import url('".$this->outputDir."/".'commoncss/'.$dependence."');\n".$cssContent;
                    $this->renderCss('commoncss/', $dependence, file_get_contents($dependencePath), $dependencePath);
                }
            }
            $this->getFileConetent($css['relativePath'], 'css') && $this->renderCss($component['name'].'/', $component['component'].'.css', $cssContent, $css['path']);

            //处理theme
            if(!empty($css['themes']))foreach($css['themes'] as $theme => $file){
                $cssContent = $this->getFileConetent($file, 'css');
                if(!empty($css['dependences'])){
                    foreach($css['dependences'] as $dependence){
                        $dependence = preg_replace('/\.css$/i', '.'.$theme.'.css', $dependence);
                        $dependencePath = $this->cssDir.'/'.$dependence;
                        if(!file_exists($dependencePath))continue;
                        $cssContent = "@import url('".$this->outputDir."/".'commoncss/'.$dependence."');\n".$cssContent;
                        $this->renderCss('commoncss/', $dependence, file_get_contents($dependencePath), $dependencePath);
                    }
                }
                $path = $component['widget'].'.'.$theme.'/'.(!empty($component['plugin'])?$component['component'].'/':'');
                $this->renderCss($path, !empty($component['plugin'])?$component['component'].'.css':$component['widget'].'.'.$theme.'.css', $cssContent, $this->cssDir.'/'.$file);
            }
        }
    }

    protected function renderCss($path, $fileName, $content, $realpath){
        $zipObj = $this->_zipObj;
        preg_match_all('/url\((([\'"]?)(?!data)([^\'"]+?)\2)\)/im', $content, $m);
        if(isset($m[3])) {
            foreach($m[3] as $image) {
                if(!preg_match('/\.(gif|png|jpg|jpeg)$/i', $image))continue;
                $imagePath = realpath(dirname($realpath)."/".$image);
                $baseName = basename($imagePath);
                if(file_exists($imagePath)) {
                    $zipObj->addFromString($path.$baseName, file_get_contents($imagePath));
                }
                $content = str_replace($image, $baseName, $content);
            }
        }
        $zipObj->addFromString($path.$fileName, $content);
    }

    protected function getNameByPath($relativePath){
        foreach($this->components as $component) {
            if($component['relativePath'] == $relativePath) {
                return $component['name'];
            }
        }
        return null;
    }

    protected function getPathByName($name){
        foreach($this->components as $component) {
            if($component['name'] == $name) {
                return $component['relativePath'];
            }
        }
        return null;
    }

    protected function getFileConetent($file, $type='js'){
        if(!isset($this->_cache_files[$file]) && is_file($path = ($type=='js'?$this->srcDir:$this->cssDir)."/".$file)) {
            $this->_cache_files[$file] = file_get_contents($path);
        }
        return $this->_cache_files[$file];
    }

    protected function buildJsDependences($file){
        if(!isset($this->_dependences[$file])) {
            $content = $this->getFileConetent($file);
            if(preg_match('/@import\s(.+?)$/im', $content, $match)){
                $dependences = explode(",", $match[1]);
                $this->_dependences[$file] = array();
                foreach($dependences as $dependence) {
                    $dependence = trim($dependence);
                    if(!$dependence || !$this->getFileConetent($dependence))continue;
                    $this->buildJsDependences($dependence);
                    $this->_dependences[$file][] = $dependence;
                }
            }
        }
    }

    protected function getJsDependences($file, &$result = array()){
        $this->buildJsDependences($file);
        if(isset($this->_dependences[$file]) && !in_array($file, $result)) {
            foreach($this->_dependences[$file] as $dempendence) {
                if(isset($this->_dependences[$file])){
                    $this->getJsDependences($dempendence, $result);
                }
                $result[] = $dempendence;
            }
            $result = array_unique($result);
        }
        return $result;
    }

    protected function parseFile($jsFile, Array $attch = array()) {
        $relativePath = isset($attch['relativePath'])?$attch['relativePath']:substr($jsFile, strlen($this->srcDir)+1);

        //解析@import, 获得js依赖
        $dependences = $this->getJsDependences($relativePath);

        $info = array_merge(array(
            'path' => $jsFile,
            'content' => $this->getFileConetent($relativePath),
            'dependences' => $dependences
        ), $attch);

        //查找css文件，并且加上依赖
        if($info['plugin']) {
            $cssFile = $this->cssDir.'/'.$this->type.'/'.$info['widget'].'/'.$info['widget'].'.'.$info['plugin'].'.css';
        } else {
            $cssFile = $this->cssDir.'/'.$this->type.'/'.$info['widget'].'/'.$info['widget'].'.css';
        }

        $themes = array();
        $themeRE = '/(?:\/|^)'.$info['widget'].(!empty($info['plugin'])?'.'.$info['plugin']:'').'\.(default|blue|dark)\.css$/i';
        $files = self::rScandir($this->cssDir.'/'.$this->type.'/'.$info['widget'], $themeRE);
        foreach($files as $file){
            if(preg_match($themeRE, $file, $m)){
                $themes[$m[1]] = substr($file, strlen($this->cssDir)+1);
            }
        }

        $cssDeps = array();
        if(preg_match('/@importcss\s(.+?)$/im', $this->getFileConetent($relativePath), $match)){
            $dependences = explode(",", $match[1]);
            foreach($dependences as $dependence) {
                $dependence = trim($dependence);
                if(!$dependence)continue;
                $cssDeps[] = $dependence;
            }
        }

        $info['css'] = array(
            'dependences' => array_unique($cssDeps),
            'themes' => $themes
        );

        if(is_file($cssFile)) {
            $info['css']['path'] = $cssFile;
            $info['css']['relativePath'] =  substr($cssFile, strlen($this->cssDir)+1);
        }

        return $info;
    }

    protected function parseZepto(){
        $component = $this->parseFile(BASE_DIR.'_src/core/zepto.js', array(
            'name' => 'zepto',
            'export' => 'Zepto',
            'component' => 'zepto',
            'relativePath' => 'core/zepto.js'
        ));

        $component['content'] = str_replace('window.Zepto = Zepto', '', $component['content']);
        $component['content'] = str_replace('\'$\' in window || (window.$ = Zepto)', '', $component['content']);

        $this->components['core/zepto.js'] = $component;
    }

    protected function parseBase(){
        $jsFiles = self::rScandir($this->srcDir.'/core', '/\.js$/i');
        $excude = '/^core\/(zepto\.js$|zepto\.min\.js$|zepto\.fx\.js$|zepto\/.*)/i';
        $exportsRule = array(
            '^zepto\.ui\.js$' => 'Zepto.ui',
            'default' => 'Zepto',
        );
        foreach($jsFiles as $file) {
            $relativePath = substr($file, strlen($this->srcDir)+1);
            if(preg_match($excude, $relativePath)) {
                continue;
            }
            $basename = basename($file);
            if(!preg_match('/^zepto\.(.+)\.js$/', $basename, $match) && $basename !== 'touch.js')continue;
            $match[1] = isset($match[1])?$match[1]:'touch';
            $export = '';
            foreach($exportsRule as $key=>$val){
                $export = $val;
                if(preg_match('/'.$key.'/i', $basename)){
                    break;
                }
            }
            $this->components[$relativePath] = $this->parseFile($file, array(
                'name' => 'base/'.$match[1],
                'component' => $match[1],
                'export' => $export,
                'relativePath' => $relativePath
            ));
        }
    }

    protected function parseWidget(){
        $jsFiles = self::rScandir($this->srcDir.'/'.$this->type.'/', '/\.js$/i');
        foreach($jsFiles as $file) {
            $relativePath = substr($file, strlen($this->srcDir)+1);
            $basename = basename($file);
            if(!preg_match('/^(.*?)(?:\.(.+))?\.js$/', $basename, $match))continue;
            $info = $this->parseFile($file, array(
                'name' => $match[1].(isset($match[2])?'/'.$match[2]:''),
                'component' => isset($match[2])?$match[2]:$match[1],
                'plugin' => isset($match[2])?$match[2]:'',
                'widget' => $match[1],
                'export' => 'Zepto.ui.'.$match[1],
                'relativePath' => $relativePath
            ));
            $this->components[$relativePath] = $info;
        }

        foreach($jsFiles as $file) {
            $relativePath = substr($file, strlen($this->srcDir)+1);
            $info = &$this->components[$relativePath];
            if($info['plugin'] && ($path = $this->getPathByName($info['widget']))) { //如果是plugin
                $this->components[$path]['plugins'][] = $relativePath;
                $info['widgetPath'] = $path;
            }
        }
    }

    public function build(){
        $this->parse();
        $this->render();
    }

    public static function run() {
        $script = new GMU2FIS('widget');
        $script->build();
    }

    public static function rScandir($path, $exts, &$res=array()) {
        $path = rtrim(str_replace('\\', '/', $path), '/\\');
        $files = scandir($path);
        foreach ($files as $file) {
            $filepath = $path . '/' . $file;
            if (is_dir($filepath) && $file[0] != '.') {
                self::rScandir($filepath, $exts, $res);
            } else {
                if (preg_match($exts, $file) && is_file($filepath)) {
                    $res[] = $filepath;
                }
            }
        }
        return $res;
    }
}
GMU2FIS::run();