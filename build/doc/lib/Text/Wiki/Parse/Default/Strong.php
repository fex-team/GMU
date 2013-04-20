<?php

/**
* 
* Parses for strongly-emphasized text.
* 
* @category Text
* 
* @package Text_Wiki
* 
* @author Paul M. Jones <pmjones@php.net>
* 
* @license LGPL
* 
* @version $Id: Strong.php 180591 2005-02-23 17:38:29Z pmjones $
* 
*/


/**
* 
* Parses for strongly-emphasized text.
* 
* This class implements a Text_Wiki_Parse to find source text marked for
* strong emphasis (bold) as defined by text surrounded by three
* single-quotes. On parsing, the text itself is left in place, but the
* starting and ending instances of three single-quotes are replaced with
* tokens.
*
* @category Text
* 
* @package Text_Wiki
* 
* @author Paul M. Jones <pmjones@php.net>
* 
*/

class Text_Wiki_Parse_Strong extends Text_Wiki_Parse {
    
    
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
    
    var $regex =  "/\*\*(.*?)\*\*/";
    
    
    /**
    * 
    * Generates a replacement for the matched text.  Token options are:
    * 
    * 'type' => ['start'|'end'] The starting or ending point of the
    * emphasized text.  The text itself is left in the source.
    * 
    * @access public
    *
    * @param array &$matches The array of matches from parse().
    *
    * @return A pair of delimited tokens to be used as a placeholder in
    * the source text surrounding the text to be emphasized.
    *
    */
    
    function process(&$matches)
    {
        $start = $this->wiki->addToken(
            $this->rule, array('type' => 'start')
        );
        
        $end = $this->wiki->addToken(
            $this->rule, array('type' => 'end')
        );
        
        return $start . $matches[1] . $end;
    }
}
?>