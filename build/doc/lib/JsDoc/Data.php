<?php
class JsDoc_Data
{
    protected  $_data = array();

    public function setData($key, $val = null){
        $this->_data[$key] = $val;
    }

    public function getData($key = null){
        return $key?(isset($this->_data[$key])?$this->_data[$key]:null):$this->_data;
    }

    public function hasData($key){
        return isset($this->_data[$key]);
    }

    /*public function __call(){

    }*/
}
