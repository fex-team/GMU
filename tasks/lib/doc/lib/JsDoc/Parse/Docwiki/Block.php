<?php


class Text_Wiki_Parse_Block extends Text_Wiki_Parse {



    var $regex = ';<block(\s[^>]*)?>((?:(?R)|.*?)*)</block>;msi';

    function process(&$matches)
    {
        $attributes = $this->getAttrs($matches[1]);
        $text = trim($matches[2], "\n");
        $start = $this->wiki->addToken(
            $this->rule,
            array(
                'type' => 'start',
                'text' => $text,
                'attributes' => $attributes
            )
        );

        $end = $this->wiki->addToken(
            $this->rule,
            array(
                'type' => 'end',
            )
        );
        return $start ."\n\n". $text ."\n\n". $end;
    }
}
