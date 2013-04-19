<?php
class JsDoc_Triggerable
{
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
