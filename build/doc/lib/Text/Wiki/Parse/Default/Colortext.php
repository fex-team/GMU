<?php

/**
* 
* Parses for colorized text.
* 
* @category Text
* 
* @package Text_Wiki
* 
* @author Paul M. Jones <pmjones@php.net>
* 
* @license LGPL
* 
* @version $Id: Colortext.php 180591 2005-02-23 17:38:29Z pmjones $
* 
*/

/**
* 
* Parses for colorized text.
* 
* @category Text
* 
* @package Text_Wiki
* 
* @author Paul M. Jones <pmjones@php.net>
* 
*/

class Text_Wiki_Parse_Colortext extends Text_Wiki_Parse {
    
    /**
    * 
    * The regular expression used to parse the source text and find
    * matches conforming to this rule.  Used by the parse() method.
    * 
    * @access public
    * 
    * @var string
    * 
    * @see parse()
    * 
    */
    
    var $regex = "/\#\#(.+?)\|(.+?)\#\#/";
    
    
    /**
    * 
    * Generates a replacement for the matched text.  Token options are:
    * 
    * 'type' => ['start'|'end'] The starting or ending point of the
    * emphasized text.  The text itself is left in the source.
    * 
    * 'color' => the color indicator
    * 
    * @access public
    *
    * @param array &$matches The array of matches from parse().
    *
    * @return string A pair of delimited tokens to be used as a
    * placeholder in the source text surrounding the text to be
    * emphasized.
    *
    */
    
    function process(&$matches)
    {
        $start = $this->wiki->addToken(
            $this->rule, 
            array(
                'type' => 'start',
                'color' => $matches[1]
            )
        );
        
        $end = $this->wiki->addToken(
            $this->rule, 
            array(
                'type' => 'end',
                'color' => $matches[1]
            )
        );
        
        return $start . $matches[2] . $end;
    }
}
?>