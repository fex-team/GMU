<?php
// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:

class Text_Wiki_Render_Xhtml_Nowiki extends Text_Wiki_Render {

    function token($options)
    {
        return $options['text'];
    }
}
