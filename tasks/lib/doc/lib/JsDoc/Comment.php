<?php
class JsDoc_Comment implements Iterator
{

    const TYPE_OF_FILE = "file";
    const TYPE_OF_METHOD = "method";
    protected $_content;
    protected $_props;
    protected $_type;

    protected $_file;

    public function __construct($content, $file)
    {
        $this->_file = &$file;
        $this->_content = trim(preg_replace('/^\s*?(\*+\/|\*+ ?|\/\*+)/m', '', $content));//trim(preg_replace('/^\s*?(\*( |$)|\/\*\*|\*\/)/m', '', $content));
        $this->_collectProperties();
        $this->_type = $this->hasProperty('fileOverview') || $this->hasProperty('file') ? self::TYPE_OF_FILE:self::TYPE_OF_METHOD;
    }

    public function getType(){
        return $this->_type;
    }

    public function getFile()
    {
        return $this->_file;
    }

    public function getHash(){
        return md5($this->_file->getFilePath().$this->_content);
    }

    public function validate()
    {
        return !$this->hasProperty("ignore") && ($this->hasProperty("name") || $this->hasProperty("file") || $this->hasProperty("fileOverview"));
    }

    protected function _collectProperties()
    {
        if (!$this->_props) {
            $this->_props = array();
            $this->_cache = array();

            $content = $this->_content;
            if ($content[0] !== '@') {
                $content = '@desc ' . $content;
            }
            $propsInfo = array();
            preg_match_all('/^\s*?(@\w+)\b/m', $content, $matches, PREG_OFFSET_CAPTURE);
            if (isset($matches[1])) {
                $propsInfo = $matches[1];
                $i = count($propsInfo) - 1;
                if (preg_match('/\*\//', $content, $m2, PREG_OFFSET_CAPTURE, $propsInfo[$i][1])) {
                    $propsInfo[$i][2] = $m2[0][1];
                } else {
                    $propsInfo[$i][2] = strlen($content);
                }
                for (; $i >= 0; $i--) {
                    $k = $i - 1;
                    if ($k >= 0) {
                        $propsInfo[$k][2] = $propsInfo[$i][1] - 1;
                    }
                }
            }
            foreach ($propsInfo as $info) {
                $info[1] += strlen($info[0]);
                $info[2] -= $info[1];

                $key = substr($info[0], 1);
                $value = trim(substr($content, $info[1] + 1, $info[2]), "\n");
                $this->_props[] = array('key' => $key, 'value' => $value);
                if(!isset($this->_cache[$key])){
                    $this->_cache[$key] = array();
                }
                $this->_cache[$key][] = $value;
            }
        }
    }
    /**
     * Iterator Interface: Rewind
     * @return void
     */
    public function rewind() {
        reset($this->_props);
    }

    /**
     * Iterator Interface: Current
     * @return Slim_Route|false
     */
    public function current() {
        $val = current($this->_props);
        return $val?$val['value']:null;
    }

    /**
     * Iterator Interface: Key
     * @return int|null
     */
    public function key() {
        $val = current($this->_props);
        return $val['key'];
    }

    /**
     * Iterator Interface: Next
     * @return void
     */
    public function next() {
        next($this->_props);
    }

    /**
     * Iterator Interface: Valid
     * @return boolean
     */
    public function valid() {
        return $this->current();
    }

    public function hasProperty($key)
    {
        return $this->$key !== null;
    }

    public function __get($key)
    {
        if( isset($this->_cache[$key]) ){
            $value = $this->_cache[$key];
            return count($value) == 1 ? $value[0] : $value;
        }
        return null;
    }
}