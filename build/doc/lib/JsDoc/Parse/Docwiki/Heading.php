<?php
// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:

class Text_Wiki_Parse_Heading extends Text_Wiki_Parse {


    var $regex = '/^(#{1,6})(.*?)(\1\s|\1$|$)/m';

    var $conf = array(
        'id_prefix' => 'toc'
    );


    function process(&$matches)
    {
        static $id;
        if (! isset($id)) {
            $id = 0;
        }

        $prefix = htmlspecialchars($this->getConf('id_prefix'));
        $level = strlen($matches[1]);
        $text = trim($matches[2]);

        $start = $this->wiki->addToken(
            $this->rule,
            array(
                'type' => 'start',
                'level' => $level,
                'text' => $text,
                'id' => $prefix . $id ++
            )
        );

        $end = $this->wiki->addToken(
            $this->rule,
            array(
                'type' => 'end',
                'level' => $level
            )
        );

        return $start . $text . $end."\n\n";
    }
}
