<?php

class Text_Wiki_Parse_Bold extends Text_Wiki_Parse {


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

    var $regex =  "/\*\*(()|[^\*].*)\*\*/U";



    function process(&$matches)
    {
        $start = $this->wiki->addToken($this->rule, array('type' => 'start'));
        $end = $this->wiki->addToken($this->rule, array('type' => 'end'));
        return $start . $matches[1] . $end;
    }
}