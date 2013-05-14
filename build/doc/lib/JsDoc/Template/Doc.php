<?php
class JsDoc_Template_Doc extends JsDoc_Template
{

    protected $_jsDocs = array();
    protected $_fileLinks;
    protected $_commentIds = array();
    protected $_search_entries = array();

    public function __construct($tplFile, JsDoc $jsDoc = null)
    {
        parent::__construct($tplFile);
        $this->addJsDoc($jsDoc);
    }

    public function addJsDoc(JsDoc $jsDoc){
        if($jsDoc){
            $this->_jsDocs[] = $jsDoc;
        }
    }

    public function getJsDocs(){
        return $this->_jsDocs;
    }

    public function addSearchEntry($label, $value, $desc, $href, $category){
        $desc = strip_tags($desc);
        $desc = $this->_substr($desc, 0, 35).(strlen($desc)>40?'...':'');
        $this->_search_entries[] = array(
            'label' => $label,
            'value' => $value,
            'desc' => $desc,
            'href' => $href,
            'category' => $category,
        );
    }

    protected function _substr($str, $start)
    {
        $null = "";
        preg_match_all("/./u", $str, $ar);
        if(func_num_args() >= 3) {
            $end = func_get_arg(2);
            return join($null, array_slice($ar[0],$start,$end));
        } else {
            return join($null, array_slice($ar[0],$start));
        }
    }

    public function getSearchEntries(){
        return $this->_search_entries;
    }

    public function hook_content($type){
        $event = new JsDoc_Event('output'.$type, isset($this->_variables[$type])?$this->_variables[$type]:'');
        $this->trigger($event);
        return $event->data;
    }


    public function getFileLink($filename)
    {
        return isset($this->_fileLinks[$filename]) ? $this->_fileLinks[$filename] : null;
    }

    public function gennerateCommentId($comment)
    {
        $file = $comment->getFile();
        $filePath = $file->getFilePath();
        if(!isset($this->_commentIds[$filePath])){
            $this->_commentIds[$filePath] = array();
        }
        if(isset($this->_commentIds[$filePath][$comment->getHash()])) {
            return $this->_commentIds[$filePath][$comment->getHash()];
        }
        $id = preg_replace('/\s+/', '', strtolower($comment->name));
        if(in_array($id, $this->_commentIds)){
            $fileComment = $file->getFileComment();
            $id = preg_replace('/\s+/', '', strtolower($fileComment->name)).'_'.$id;
        }
        while(in_array($id, $this->_commentIds)){
            if(preg_match('/_(\d)$/', $id, $matches)) {
                $id = preg_replace('/_(\d)$/', intval($matches[1])+1, $id);
            }else {
                $id = $id.'_1';
            }
        }
        $this->_commentIds[$filePath][$comment->getHash()] = $id;
        $this->_commentIds[] = $id;
        return $id;
    }

    public function getFileByPath($path){
        $result = null;
        foreach($this->_jsDocs as $jsDoc){
            if($result = $jsDoc->getFileByPath($path)){
                break;
            }
        }
        return $result;
    }

    public function onConvertLink(JsDoc_Event $e){
        $options = &$e->data;

        if(is_string($options['href']) && preg_match('/^(.+?\.js)(#(.+))?$/', $options['href'], $mathes)) {
            $options['attributes']['target'] = '_self';
            $options['type'] = 'inline';
            $file = $this->getFileByPath($mathes[1]);
            if($file) {
                if($mathes[3]){
                    foreach($file->getMethodComments() as $comment){
                        if($comment->name == $mathes[3]){
                            $options['href'] = '#'.$this->gennerateCommentId($comment);
                            $e->data = $options;
                            return false;
                        }
                    }
                    $options['href'] = '#'.$mathes[3];
                    $e->data = $options;
                    return false;
                } else if(!$mathes[3] && ($link = $this->_fileLinks[$mathes[1]])) {
                    $options['href'] = $link['href'];
                    $e->data = $options;
                    return false;
                }
            }
            $options['href'] = '#';
            $e->data = $options;
            return false;
        }else if(!preg_match('/#/', $options['href'])) {
            $options['type'] = 'external';
            $options['attributes']['target'] = '_blank';
            $e->data = $options;
            return false;
        }
    }

    public function wrapText($text)
    {
        static $wiki;
        if (!$wiki) {
            $wiki = new JsDoc_Docwiki();
            $wiki->setCompatible();
            $wiki->bind('convertlink', array(&$this, 'onConvertLink'));
        }
       return $wiki->transform($text);
    }

    public function wrapCode($text, $type = 'javascript')
    {
        $text = '<code type="'.$type.'">'.$text.'</code>';
        return $this->wrapText($text);
    }

    public function wrapNotice($text)
    {
        return "<div class=\"notice\">" . $this->wrapText($text) . "</div>";
    }

    public function wrapGrammar($text)
    {
        $text = htmlspecialchars(str_replace("=>", '⇒', $text));
        $text = preg_replace('/\b(v[\d\.\+]+)($|\b)/m', '<span class="version">\1</span>', $text);
        $text = preg_replace('/(⇒.*)$/m', '<span class="return">\1</span>', $text);
        return $text;
    }

    public function wrapImport($text)
    {
        return htmlspecialchars($text);
    }

    protected function preg_callback_code($matches)
    {
        $type = 'javascript';
        if($matches[1] && preg_match('/type=(["\'])(.*)\1/i', $matches[1], $m)){
            $type = $m[2];
        }
        return $this->wrapCode(trim($matches[2], "\n"), $type);
    }

    protected function _beforeRender()
    {
        $this->_fileLinks = array(
            'zepto.js' => array(
                'link' => '#zeptojs',
                'text' => 'Zepto',
                'title' => 'Zepto',
                'target' => '_blank'
            )
        );
        foreach($this->_jsDocs as $jsDoc){
            foreach($jsDoc as $key => $jsFile){
                $fileComment = $jsFile->getFileComment();
                if ($fileComment->name) {
                    $this->_fileLinks[$key] = array(
                        'link' => '#' . $this->gennerateCommentId($fileComment),
                        'text' => $fileComment->name,
                        'title' => $key
                    );
                }
            }
        }
    }
}