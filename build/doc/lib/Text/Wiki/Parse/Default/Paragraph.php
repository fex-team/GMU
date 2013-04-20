<?php

/**
* 
* Parses for paragraph blocks.
* 
* @category Text
* 
* @package Text_Wiki
* 
* @author Paul M. Jones <pmjones@php.net>
* 
* @license LGPL
* 
* @version $Id: Paragraph.php 286814 2009-08-04 17:03:17Z rodrigosprimo $
* 
*/

/**
* 
* Parses for paragraph blocks.
* 
* This class implements a Text_Wiki rule to find sections of the source
* text that are paragraphs.  A para is any line not starting with a token
* delimiter, followed by two newlines.
*
* @category Text
* 
* @package Text_Wiki
* 
* @author Paul M. Jones <pmjones@php.net>
* 
*/

class Text_Wiki_Parse_Paragraph extends Text_Wiki_Parse {
    
    /**
    * 
    * The regular expression used to find source text matching this
    * rule.
    * 
    * @access public
    * 
    * @var string
    * 
    */
    
    var $regex = "/^.*?\n\n/m";
    
    var $conf = array(
        'skip' => array(
            'blockquote', // are we sure about this one?
            'code',
            'heading',
            'horiz',
            'deflist',
            'table',
            'list',
            'toc'
        )
    );
    
    
    /**
    * 
    * Generates a token entry for the matched text.  Token options are:
    * 
    * 'start' => The starting point of the paragraph.
    * 
    * 'end' => The ending point of the paragraph.
    * 
    * @access public
    *
    * @param array &$matches The array of matches from parse().
    *
    * @return A delimited token number to be used as a placeholder in
    * the source text.
    *
    */
    
    function process(&$matches)
    {
        $delim = $this->wiki->delim;
        $skip = $this->getConf('skip', array());
        
        // was anything there?
        if (trim($matches[0]) == '') {
            return '';
        }
        
        // does the match has tokens inside?
        preg_match_all("/(?:$delim)(\d+?)(?:$delim)/", $matches[0], $delimiters, PREG_SET_ORDER);

        // look each delimiter inside the match and see if it's skippable
        // (if we skip, it will not be marked as a paragraph)
        foreach ($delimiters as $d) {
            $token_type = strtolower($this->wiki->tokens[$d[1]][0]);
            if (in_array($token_type, $skip)) {
                return $matches[0];
            }
        }

        // if there is no skipable token inside the match
        // add the Paragraph token and return
        $start = $this->wiki->addToken(
            $this->rule, array('type' => 'start')
        );
        
        $end = $this->wiki->addToken(
            $this->rule, array('type' => 'end')
        );
        
        return $start . trim($matches[0]) . $end;
    }
}
?>
