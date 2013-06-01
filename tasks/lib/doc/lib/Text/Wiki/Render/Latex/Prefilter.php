<?php
// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:
/**
 * This class implements a Text_Wiki_Render_Xhtml to "pre-filter" source text so
 * that line endings are consistently \n, lines ending in a backslash \
 * are concatenated with the next line, and tabs are converted to spaces.
 *
 * PHP versions 4 and 5
 *
 * @category   Text
 * @package    Text_Wiki
 * @author     Jeremy Cowgar <jeremy@cowgar.com>
 * @license    http://www.gnu.org/copyleft/lesser.html  LGPL License 2.1
 * @version    CVS: $Id: Prefilter.php 248435 2007-12-17 16:19:44Z justinpatrin $
 * @link       http://pear.php.net/package/Text_Wiki
 */

/* vim: set expandtab tabstop=4 shiftwidth=4: */
// +----------------------------------------------------------------------+
// | PHP version 4                                                        |
// +----------------------------------------------------------------------+
// | Copyright (c) 1997-2003 The PHP Group                                |
// +----------------------------------------------------------------------+
// | This source file is subject to version 2.0 of the PHP license,       |
// | that is bundled with this package in the file LICENSE, and is        |
// | available through the world-wide-web at                              |
// | http://www.php.net/license/2_02.txt.                                 |
// | If you did not receive a copy of the PHP license and are unable to   |
// | obtain it through the world-wide-web, please send a note to          |
// | license@php.net so we can mail you a copy immediately.               |
// +----------------------------------------------------------------------+
// | Authors:                            |
// +----------------------------------------------------------------------+
//
// $Id: Prefilter.php 248435 2007-12-17 16:19:44Z justinpatrin $


/**
* 
* This class implements a Text_Wiki_Render_Latex to "pre-filter" source text so
* that line endings are consistently \n, lines ending in a backslash \
* are concatenated with the next line, and tabs are converted to spaces.
*
* @author Jeremy Cowgar <jeremy@cowgar.com>
*
* @package Text_Wiki
*
*/

class Text_Wiki_Render_Latex_Prefilter extends Text_Wiki_Render {
    function token()
    {
        return '';
    }
}
?>