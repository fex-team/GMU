<?php
// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:
/**
 * List rule end renderer for Xhtml
 *
 * PHP versions 4 and 5
 *
 * @category   Text
 * @package    Text_Wiki
 * @author     Paul M. Jones <pmjones@php.net>
 * @license    http://www.gnu.org/copyleft/lesser.html  LGPL License 2.1
 * @version    CVS: $Id: List.php 200073 2005-11-06 10:38:25Z toggg $
 * @link       http://pear.php.net/package/Text_Wiki
 */

/**
 * This class renders bullet and ordered lists in XHTML.
 *
 * @category   Text
 * @package    Text_Wiki
 * @author     Paul M. Jones <pmjones@php.net>
 * @license    http://www.gnu.org/copyleft/lesser.html  LGPL License 2.1
 * @version    Release: @package_version@
 * @link       http://pear.php.net/package/Text_Wiki
 */
class Text_Wiki_Render_Xhtml_Tabs extends Text_Wiki_Render {

    var $conf = array(
        'css_div' => 'ui-tabs',
        'css_ul' => null,
        'css_li' => null,
        'css_li_active' => 'active',
        'css_a' => null,
        'css_a_active' => null,
        'css_content' => 'ui-tabs-content',
        'css_content_active' => 'ui-tabs-content active',
        'css_a_link' => null,
        'css_a_javascript' => null
    );

    var $stack = array();
    var $id = 1;

    function token($options)
    {
        // make nice variables (type, level, count)
        extract($options);
        $id = current($this->stack);

        switch ($type) {
            case 'tabs_start':
                array_push($this->stack, $this->id++);
                $csss = array();
                if(isset($this->conf['css_div'])) {
                    $csss[] = $this->conf['css_div'];
                }
                if(isset($attributes['class'])){
                    $csss[] = $attributes['class'];
                    unset($attributes['class']);
                }
                $css = '';
                if(count($csss)) {
                    $css = sprintf(' class="%s"', implode(" ", $csss));
                }
                $attrs = '';
                if(is_array($attributes))foreach($attributes as $key=>$val){
                    $attrs.= "$key=\"$val\" ";
                }
                return "<div$css $attrs>";
            case 'tabs_end':
                array_pop($this->stack);
                return "</div>";
            case 'tabs_title_start':
                $css = $this->formatConf(' class="%s"', 'css_ul');
                return "<ul$css>";
            case 'tabs_title_end':
                return "</ul>";
            case 'tabs_title_item_start':
                $css = $this->formatConf(' class="%s"', $active ? 'css_li_active':'css_li');
                $html = "<li$css>";
                $css = $this->formatConf(' class="%s"', $active ? 'css_a_active':'css_a');
                switch($type2) {
                    case 'link':
                        $html .= "<a$css href=\"$url\" title=\"$text\" target=\"_blank\">";
                        break;
                    case 'javascript':
                        $html .= "<a$css href=\"javascript:window.open ('$url','newwindow','height=640,width=480,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')\" title=\"$text\">";
                        break;
                    default:
                        $html .= "<a$css href=\"#tabs_".$id."_".$depth."_".$index."\" title=\"$text\">";
                        break;
                }
                return $html;
            case 'tabs_title_item_end':
                return "</a></li>";
            case 'tabs_content_start':
                $css = $this->formatConf(' class="%s"', $active ? 'css_content_active':'css_content');
                return "<div$css id=\"tabs_".$id."_".$depth."_".$index."\">";
            case 'tabs_content_end':
                return '</div>';
            default:
                return '';
        }
    }
}
?>
