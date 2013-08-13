<?php

class Text_Wiki_Parse_Codepreview extends Text_Wiki_Parse {


    var $regex = "/<codepreview(\s[^>]*)?>(.*?)<\/codepreview>/Usm";


    function process(&$matches)
    {

        // file_put_contents('/Users/liaoxuezhi/www/gmuraw/debug.php', getcwd().'\n'.print_r($matches, true));die;
        return "\n\n".$this->wiki->addToken(
            $this->rule, array(
                'text' => $matches[2],
                'attributes' => $this->getAttrs($matches[1])
            )
        )."\n\n";
    }
}