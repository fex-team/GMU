<?php

class Text_Wiki_Parse_Qrcode extends Text_Wiki_Parse {


    var $regex = "/<qrcode(\s[^>]*)?>(.*?)<\/qrcode>/Usm";


    function process(&$matches)
    {

        return "\n\n".$this->wiki->addToken(
            $this->rule, array(
                'link' => $matches[2],
                'attributes' => $this->getAttrs($matches[1])
            )
        )."\n\n";
    }
}