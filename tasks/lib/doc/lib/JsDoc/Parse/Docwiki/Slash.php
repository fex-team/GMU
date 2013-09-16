<?php


class Text_Wiki_Parse_Slash extends Text_Wiki_Parse {


    var $regex = '=((?<!\\\)\\\(\\\|\*|\+|-|\'|_|\[|\]|\.|\^|#|\'|/))=ms';


    function process(&$matches)
    {
        return $this->wiki->addToken(
            $this->rule, array('text' => $matches[2])
        );
    }
}
?>