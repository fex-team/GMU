<?php

require_once 'JsDoc/Data.php';

class JsDoc extends JsDoc_Data implements ArrayAccess, IteratorAggregate
{
    protected $_folder;
    protected $_jsFiles;
    protected $_order;
    protected $_sorted = false;

    public function __construct($folder, $filter = '*', $exclude = false)
    {
        if (!is_dir($folder)) {
            throw new Exception("目录不存在");
        }
        $this->_folder = $folder = rtrim($folder, '/\\');
        $this->_jsFiles = array();

        if (is_string($filter)) {
            $filter = array($filter);
        }
        array_unique($filter);
        $jsFiles = $this->_collectJsFiles($this->_folder, $filter, $exclude);

        foreach ($jsFiles as $val) {
            $key = substr($val, strlen($folder) + 1);
            $key = str_replace('\\', '/', $key);
            $matched = $this->_isMatch($key, $filter);
            if ($exclude && $matched || !$exclude && !$matched) continue;
            $jsFile = new JsDoc_File($val, $key);
            if ($jsFile->validate()) {
                $this->_jsFiles[$key] = $jsFile;
            }
        }
    }

    public function setOrder($str)
    {
        $this->_order = array();
        $orders = preg_split('/[\r\n]+/', $str);
        foreach ($orders as $item) {
            $item = str_replace(array(
                '*',
                '/'
            ), array(
                '.+',
                '\/'
            ), trim($item));
            $item && ($this->_order[] = $item);
        }
        $this->_sorted = false;
        return $this;
    }

    protected function getJsFiles()
    {
        if (!$this->_sorted && !empty($this->_order)) {
            uksort($this->_jsFiles, array(&$this, '_jsSort'));
            $this->_sorted = true;
        }
        return $this->_jsFiles;
    }

    protected function _jsSort($a, $b)
    {
        return $this->_getWeightOfFile($a) - $this->_getWeightOfFile($b);
    }

    protected function _getWeightOfFile($file)
    {
        foreach ($this->_order as $key => $rule) {
            if (preg_match("/^" . $rule . "$/i", $file)) {
                return $key;
            }
        }
        return 9999999;
    }

    public function getFileByPath($path)
    {
        return isset($this->_jsFiles[$path]) ? $this->_jsFiles[$path] : null;
    }

    protected function _isMatch($js, $rules)
    {
        foreach ($rules as $rule) {
            $rule = str_replace(array(
                '*',
                '/'
            ), array(
                '.+',
                '\/'
            ), $rule);
            if (preg_match("/^" . $rule . "$/i", $js)) {
                return true;
            }
        }
        return false;
    }

    protected function _collectJsFiles($folder)
    {
        $results = array();
        $dir = opendir($folder);
        while (($file = readdir($dir)) !== false) {
            if ($file[0] == '.') { //忽略隐藏文件，如.svn目录
                continue;
            }
            if (is_dir($folder . DS . $file)) {
                $results = array_merge($results, $this->_collectJsFiles($folder . DS . $file));
            } else if (preg_match('/\.js$/', $file)) {
                $results[] = $folder . DS . $file;
            }
        }
        closedir($dir);
        return $results;
    }

    /**
     * Array Access: Offset Exists
     */
    public function offsetExists($offset)
    {
        return isset($this->_jsFiles[$offset]);
    }

    /**
     * Array Access: Offset Get
     */
    public function offsetGet($offset)
    {
        if (isset($this->_jsFiles[$offset])) {
            return $this->_jsFiles[$offset];
        } else {
            return null;
        }
    }

    /**
     * Array Access: Offset Set
     */
    public function offsetSet($offset, $value)
    {
        $this->_jsFiles[$offset] = $value;
    }

    /**
     * Array Access: Offset Unset
     */
    public function offsetUnset($offset)
    {
        unset($this->_jsFiles[$offset]);
    }

    /**
     * IteratorAggregate
     *
     * @return ArrayIterator
     */
    public function getIterator()
    {
        $this->getJsFiles();
        return new ArrayIterator($this->_jsFiles);
    }

    /**
     * 自动加载，之处理Gmu打头的类。
     * @param $class
     */
    public static function autoload($class)
    {
        if (strpos($class, 'JsDoc') !== 0) {
            return;
        }
        $file = dirname(__FILE__) . '/' . str_replace('_', DIRECTORY_SEPARATOR, substr($class, 6)) . '.php';
        if (file_exists($file)) {
            require $file;
        }
    }

    /**
     * 注册自动加载
     */
    public static function registerAutoloader()
    {
        spl_autoload_register(array('JsDoc', 'autoload'));
    }
}

JsDoc::registerAutoloader();
