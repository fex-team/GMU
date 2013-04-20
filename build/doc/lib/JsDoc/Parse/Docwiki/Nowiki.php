<?php

class Text_Wiki_Parse_Nowiki extends Text_Wiki_Parse {


    var $regex = "/<nowiki>(.*?)<\/nowiki>/Usm";


    function process(&$matches)
    {

        return $this->wiki->addToken(
            $this->rule, array('text' => $matches[1])
        );
    }
}