<?php
class JsDoc_File implements ArrayAccess, IteratorAggregate
{
    protected $_path;
    protected $_filename;
    protected $_fileComment;
    protected $_methodComments;
    protected $_comments;
    protected $_content;
    protected $_filePath;

    public function __construct($path, $filePath)
    {
        if (!is_file($path)) {
            throw new Exception("文件不存在");
        }
        $this->_path = $path;
        $this->_filename = basename($path);
        $this->_filePath = $filePath;
        $this->_collectComments();
    }

    public function getFilePath()
    {
        return $this->_filePath;
    }

    public function getFileName()
    {
        return $this->_filename;
    }

    public function getMethodComments()
    {
        return $this->_methodComments;
    }

    public function getFileComment()
    {
        return $this->_fileComment;
    }

    public function validate()
    {
        if ($this->_fileComment && count($this->_methodComments)) return true;
        return false;
    }

    protected function _collectComments()
    {
        $contents = $this->_getFileContent();
        $this->_methodComments = array();
        $this->_comments = array();


        preg_match_all('/\/\*{2,}.*\*\//Ums', $contents, $matches);

        if(isset($matches[0])){
            foreach($matches[0] as $val){
                $comment = new JsDoc_Comment(trim($val), $this);
                if (!$comment->validate()) continue;
                if ($comment->getType() == JsDoc_Comment::TYPE_OF_FILE) {
                    $this->_fileComment = $comment;
                } else {
                    $this->_methodComments[$comment->name] = $comment;
                }
                $this->_comments[$comment->name] = $comment;
            }
        }
    }

    protected function _getFileContent()
    {
        if (!$this->_content) {
            $this->_content = file_get_contents($this->_path);
        }
        return $this->_content;
    }

    /**
     * Array Access: Offset Exists
     */
    public function offsetExists($offset)
    {
        return isset($this->_comments[$offset]);
    }

    /**
     * Array Access: Offset Get
     */
    public function offsetGet($offset)
    {
        if (isset($this->_comments[$offset])) {
            return $this->_comments[$offset];
        } else {
            return null;
        }
    }

    /**
     * Array Access: Offset Set
     */
    public function offsetSet($offset, $value)
    {
        $this->_comments[$offset] = $value;
    }

    /**
     * Array Access: Offset Unset
     */
    public function offsetUnset($offset)
    {
        unset($this->_comments[$offset]);
    }

    /**
     * IteratorAggregate
     *
     * @return ArrayIterator
     */
    public function getIterator()
    {
        return new ArrayIterator($this->_comments);
    }
}