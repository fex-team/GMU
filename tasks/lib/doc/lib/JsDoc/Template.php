<?php
class JsDoc_Template extends JsDoc_Triggerable
{

    protected $_tplFile;
    protected $_variables = array();
    static public $_basepath;
    static public $_theme = 'default';

    public function __construct($tplFile)
    {
        self::setTemplateDir();
        $this->setTemplate($tplFile);
    }

    static public function setTemplateDir($value=null){
        if(!$value){
            self::$_basepath || (self::$_basepath = BASE_DIR.'templates'.DS);
        }else {
            self::$_basepath = $value;
        }
    }

    static public function setTheme($theme){
        self::setTemplateDir();
        if(!is_dir(self::$_basepath.$theme)){
            throw new Exception("此主题不存在, ".self::$_basepath.$theme);
        }
        self::$_theme = $theme;
    }

    public function assignVariable($key, $value)
    {
        $this->_variables[$key] = $value;
    }

    public function render()
    {
        $tplFile = self::$_basepath.self::$_theme.DS.$this->_tplFile;
        if(!file_exists($tplFile)){
            $tplFile = self::$_basepath.'default'.DS.$this->_tplFile;
        }
        if (!file_exists($tplFile)) {
            throw new Exception("文件不存在:".$tplFile);
        }

        if (method_exists($this, '_beforeRender')) {
            $this->_beforeRender();
        }

        extract($this->_variables, EXTR_SKIP);
        ob_start();
        include $tplFile;
        return ob_get_clean();
    }

    public function setTemplate($tplFile){
        $this->_tplFile = $tplFile;
    }
}