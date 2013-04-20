<?php
class JsDoc_Event
{
    public $type = '';
    public $data = null;
    public function __construct($type, $data)
    {
        $this->type = $type;
        $this->data = $data;
    }
}
