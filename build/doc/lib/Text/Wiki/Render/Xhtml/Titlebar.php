<?php
// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:
/**
 * Titlebar rule end renderer for Xhtml
 *
 * PHP versions 4 and 5
 *
 * @category   Text
 * @package    Text_Wiki
 * @author     Paul M. Jones <pmjones@php.net>
 * @license    http://www.gnu.org/copyleft/lesser.html  LGPL License 2.1
 * @version    CVS: $Id: Titlebar.php 191862 2005-07-30 08:03:29Z toggg $
 * @link       http://pear.php.net/package/Text_Wiki
 */

/**
 * This class renders a title bar in XHTML.
 *
 * @category   Text
 * @package    Text_Wiki
 * @author     Paul M. Jones <pmjones@php.net>
 * @license    http://www.gnu.org/copyleft/lesser.html  LGPL License 2.1
 * @version    Release: @package_version@
 * @link       http://pear.php.net/package/Text_Wiki
 */
class Text_Wiki_Render_Xhtml_Titlebar extends Text_Wiki_Render {

    var $conf = array(
        'css' => 'titlebar'
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
            return "<div$css>";
        }

        if ($options['type'] == 'end') {
            return '</div>';
        }
    }
}
?>
