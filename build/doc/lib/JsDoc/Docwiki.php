<?php
require_once('Text/Wiki.php');

class JsDoc_Docwiki extends Text_Wiki {

    var $compatible = false;

    var $rules = array(
        'Prefilter',
        'Delimiter',
        'Code',
        'Codepreview',
        'Qrcode',
        //'Function',
        //'Html',
        //'Raw',
        'Nowiki', //
        'Slash',
        'Compatible',
        //'Block',
        //'Include',
        //'Embed',
        //'Anchor',
        'Tabs', //选项卡
        'Heading',//标题
        //'Toc',
        'Horiz',
        //'Break',
        'Blockquote',
        'List',//列表
        //'Deflist',
        'Table',
        //'Image',
        //'Phplookup',
        //'Center',
        'Newline',//\n => br
        'Paragraph',//段落
        'Url',
        //'Freelink',
        //'Interwiki',
        //'Wikilink',
        //'Colortext',
        //'Strong',
        'Bold',//粗体
        //'Emphasis',
        'Italic',//斜体
        'Underline',//下划线
        'Keyword',//关键字
        'Delete',//删除的标签
        //'Tt',
        'Superscript',
        'Subscript',
        //'Revise',
        'Tighten'//删除多余的换行
    );

    var $formatConf = array(
        'Docbook' => array(),
        'Latex' => array(),
        'Pdf' => array(),
        'Plain' => array(),
        'Rtf' => array(),
        'Xhtml' => array(
            'charset' => 'UTF-8'
        )
    );

    var $parseConf = array(
        'Paragraph' => array(
            'skip' => array(
                'blockquote', // are we sure about this one?
                'code',
                'heading',
                'horiz',
                'deflist',
                'table',
                'list',
                'toc',
                'geshicode',
                'block',
                'qrcode',
                'tabs'
            )
        )
    );

    public function setCompatible($val = true){
        $this->compatible = $val;
    }

    function JsDoc_Docwiki($rules = null) {
        parent::Text_Wiki($rules);
        $this->addPath('parse', $this->fixPath(dirname(__FILE__)).'Parse/Docwiki');
        $this->addPath('render', $this->fixPath(dirname(__FILE__)).'Render');
    }

    function parse($text){
        if(!$this->compatible && (false !== $index = array_search('Compatible', $this->rules))) {
            unset($this->rules[$index]);
        }
        parent::parse($text);
    }

    //triggerable

    protected  $_handers = array();

    public function bind($type, $hander){
        if( is_callable($hander)
        ) {
            if(!isset($this->_handers[$type])) {
                $this->_handers[$type] = array();
            }
            $this->_handers[$type][] = $hander;
        }
        return $this;
    }

    public function unbind($type, $hander = null){
        if($hander === null) {
            $this->_handers[$type] = array();
        } else if(is_array($this->_handers[$type])) foreach($this->_handers[$type] as $key => $value){
            if($value == $hander) {
                unset($this->_handers[$type][$key]);
            }
        }
        return $this;
    }

    public function trigger(JsDoc_Event $event){
        $handers = isset($this->_handers[$event->type])?$this->_handers[$event->type]:null;
        if( is_array($handers))foreach($handers as $val) {
            if(call_user_func($val, $event) === false){
                break;
            }
        }
        return $this;
    }
}