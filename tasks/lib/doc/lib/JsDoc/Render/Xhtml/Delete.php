<?php
// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:

class Text_Wiki_Render_Xhtml_Delete extends Text_Wiki_Render {

    var $conf = array(
        'css' => 'deleted'
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
