<?php

class Text_Wiki_Render_Xhtml_Keyword extends Text_Wiki_Render {

    var $conf = array(
        'css' => 'code'
    );


    function token($options)
    {
        if ($options['type'] == 'start') {
            $css = $this->formatConf(' class="%s"', 'css');
            return "<span$css>";
        }

        if ($options['type'] == 'end') {
            return '</span>';
        }
    }
}
?>
