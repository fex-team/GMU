<?php
// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:

require_once "phpqrcode.php";

class Text_Wiki_Render_Xhtml_Qrcode extends Text_Wiki_Render {
    var $conf = array(
        'css' => 'qrcode-block',
        'css_alignleft' => 'alignleft',
        'css_alignright' => 'alignright',
        'css_aligncenter' => 'aligncenter'
    );

    function token($options)
    {
        $link = $options['link'];
        $attributes = $options['attributes'];

        $csses = array();
        if($this->getConf('css', '')){
            $csses[] = $this->getConf('css');
        }
        if( is_array($attributes) && isset($attributes['align']) ){
            $tmp = $this->getConf('css_align'.$attributes['align']);
            $tmp && ($csses[] = $tmp);
            unset($attributes['align']);
        }
        $css = sprintf(' class="%s"', implode(" ", $csses));

        $suffix = '';
        if(is_array($attributes) && (isset($attributes['title'])) ){
            $suffix = '<p><a href="'.$link.'" target="_blank">'.$attributes['title'].'</a></p>';
        }

        $attris = '';
        if( is_array($attributes) ){
            unset($attributes['class']);
            foreach($attributes as $key=> $val){
                $attris .= "$key=\"$val\" ";
            }
        }
        return "<div$css $attris>".'<img class="qrcode" alt="'.$link.'" src="./qrcode.php?data='.urlencode($link).'" />'.$suffix.'</div>';
    }
}


