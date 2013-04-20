<?php
// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:

class Text_Wiki_Parse_Url extends Text_Wiki_Parse {


    var $regex = '/\[([^\]]+?)\](\(([^\)]+?)\))?/ms';


    function process(&$matches)
    {
        $text = $matches[1];
        $href = '#'.preg_replace('/\s+/', '', strtolower($text));
        $target = '_self';
        $attributes = array(
            'title' => $text,
            'target' => '_self',
        );
        if(!empty($matches[3]) && preg_match('/^(\S+?)(\s+"([^"]+)"\s*)?(###(.*))?$/', $matches[3], $parts)) {
            $href = $parts[1];
            if(!empty($parts[3])) {
                $attributes['title'] = $parts[3];
            }
            !empty($parts[5]) && preg_match_all('/(\w+)=(["\'])(.*?)\2/', $parts[5], $m);
            if(!empty($m[0])){
                foreach($m[1] as $index => $key){
                    $attributes[$key] = $m[3][$index];
                }
            }
        }

        // set options
        $options = array(
            'type' => 'inline',
            'href' => $href,
            'text' => $text,
            'attributes' => $attributes
        );

        $event = new JsDoc_Event('convertlink', $options);
        $this->wiki->trigger($event);
        $options = $event->data;
        // tokenize
        return $this->wiki->addToken($this->rule, $options);
    }
}
