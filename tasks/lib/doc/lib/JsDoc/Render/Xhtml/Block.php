<?php
// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:

class Text_Wiki_Render_Xhtml_Block extends Text_Wiki_Render {

    var $conf = array(
        'css' => 'div-block',
        'css_alignleft' => 'alignleft',
        'css_alignright' => 'alignright',
        'css_aligncenter' => 'aligncenter'
    );

    /**
     *
     * Renders a token into text matching the requested format.
     *
     * @access public
     *
     * @param array $options The "options" portion of the token (second
     * element).
     *
     * @return string The text rendered from the token options.
     *
     */

    function token($options)
    {
        extract($options); //type

        if ($type == 'start') {
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
            $attris = '';
            if( is_array($attributes) ){
                unset($attributes['class']);
                foreach($attributes as $key=> $val){
                   $attris .= "$key=\"$val\" ";
                }
            }
            return "<div$css $attris>";
        }

        if ($type == 'end') {
            return "</div>";
        }
    }
}
