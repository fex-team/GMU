<?php

class Text_Wiki_Parse_Keyword extends Text_Wiki_Parse {


    var $regex = "!''(.*?)''!";


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