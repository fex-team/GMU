<?php

class Text_Wiki_Parse_Codepreview extends Text_Wiki_Parse {


    var $regex = "/<codepreview(\s[^>]*)?>(.*?)<\/codepreview>/Usm";


    function process(&$matches)
    {

        return "\n\n".$this->wiki->addToken(
            $this->rule, array(
                'text' => $matches[2],
                'attributes' => $this->getAttrs($matches[1])
            )
        )."\n\n";
    }
}