<?php
// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:
/**
 * Code rule end renderer for Xhtml
 *
 * PHP versions 4 and 5
 *
 * @category   Text
 * @package    Text_Wiki
 * @author     Paul M. Jones <pmjones@php.net>
 * @license    http://www.gnu.org/copyleft/lesser.html  LGPL License 2.1
 * @version    CVS: $Id: Code.php 206940 2006-02-10 23:07:03Z toggg $
 * @link       http://pear.php.net/package/Text_Wiki
 */

/**
 * This class renders code blocks in XHTML.
 *
 * @category   Text
 * @package    Text_Wiki
 * @author     Paul M. Jones <pmjones@php.net>
 * @license    http://www.gnu.org/copyleft/lesser.html  LGPL License 2.1
 * @version    Release: @package_version@
 * @link       http://pear.php.net/package/Text_Wiki
 */
class Text_Wiki_Render_Xhtml_Code extends Text_Wiki_Render {

    var $conf = array(
        'css'      => 'highlight', // class for <pre>
        'css_code' => null, // class for generic <code>
        'css_javascript'  => 'javascript',
        'css_css' => 'css',
        'css_html' => 'html',
        'css_text' => null
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
        $text = $options['text'];
        $attr = $options['attr'];
        $type = strtolower($attr['type']);
        if(!$type)$type = 'javascript';

        $css      = $this->formatConf(' class="%s"', 'css');
        $css_code = $this->formatConf(' class="%s"', isset($this->conf['css_'.$type])?'css_'.$type:'css_code');

        // generic code example:
        // convert tabs to four spaces,
        // convert entities.
        $text = str_replace("\t", "    ", $text);
        $text = $this->textEncode($text);
        $text = "<pre$css><code$css_code>$text</code></pre>";

        return "\n$text\n\n";
    }
}
?>
