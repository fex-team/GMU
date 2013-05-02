<?php

class Text_Wiki_Parse_List extends Text_Wiki_Parse {

    var $regex = '/^((\*|n|-|\+)\s.*\n)(?!\s+\S|\2\s|(?:\s+((?:\*|n|-|\+) |\n)))/Usm';

    function parse(){
        //统一数字列表符号
        $this->wiki->source = preg_replace('/^(\s*)\d+\./sm', '\1n', $this->wiki->source);
        parent::parse();
    }

    function process(&$matches)
    {
        // the replacement text we will return
        $return = '';

        // the list of post-processing matches
        $list = array();

        // a stack of list-start and list-end types; we keep this
        // so that we know what kind of list we're working with
        // (bullet or number) and what indent level we're at.
        $stack = array();

        // the item count is the number of list items for any
        // given list-type on the stack
        $itemcount = array();

        // have we processed the very first list item?
        $pastFirst = false;

        // populate $list with this set of matches. $matches[1] is the
        // text matched as a list set by parse().

        preg_match_all(
            '=^(\s*)(\*|\+|-|n)\s(.*)\n(?!^\s+[^*+\-n\s].*\n)=Usm',
            //'=^(\s*)(\*|#)\s(.*)$=Ums',
            $matches[1],
            $list,
            PREG_SET_ORDER
        );

        $numSpaces = 0;

        // loop through each list-item element.
        foreach ($list as $key => $val) {

            // $val[0] is the full matched list-item line
            // $val[1] is the number of initial spaces (indent level)
            // $val[2] is the list item type (* or #)
            // $val[3] is the list item text

            // how many levels are we indented? (1 means the "root"
            // list level, no indenting.)
            $val[1] = str_replace("    ", "\t", $val[1]);
            $level = strlen($val[1]) + 1;

            // get the list item type
            if (in_array($val[2], array('*', '+', '-'))) {
                $type = 'bullet';
            } elseif ($val[2] == 'n') {
                $type = 'number';
            } else {
                $type = 'unknown';
            }


            // get the text of the list item
            $text = $val[3];

            // add a level to the list?
            if ($level > count($stack)) {

                //watch for the same # of spaces and reset level
                if ($level == $numSpaces) {
                    $level = count($stack);
                } else {

                    $numSpaces = $level;

                    // reset level as sometimes people use too many spaces
                    $level = count($stack) + 1;

                    // the current indent level is greater than the
                    // number of stack elements, so we must be starting
                    // a new list.  push the new list type onto the
                    // stack...
                    array_push($stack, $type);

                    // ...and add a list-start token to the return.
                    $return .= $this->wiki->addToken(
                        $this->rule,
                        array(
                            'type' => $type . '_list_start',
                            'level' => $level - 1
                        )
                    );
                }
            }


            // remove a level from the list?
            while (count($stack) > $level) {

                // so we don't keep counting the stack, we set up a temp
                // var for the count.  -1 becuase we're going to pop the
                // stack in the next command.  $tmp will then equal the
                // current level of indent.
                $tmp = count($stack) - 1;

                // as long as the stack count is greater than the
                // current indent level, we need to end list types.
                // continue adding end-list tokens until the stack count
                // and the indent level are the same.
                $return .= $this->wiki->addToken(
                    $this->rule,
                    array (
                        'type' => array_pop($stack) . '_list_end',
                        'level' => $tmp
                    )
                );

                // reset to the current (previous) list type so that
                // the new list item matches the proper list type.
                $type = $stack[$tmp - 1];

                // reset the item count for the popped indent level
                unset($itemcount[$tmp + 1]);
                $numSpaces = $level;
            }

            // add to the item count for this list (taking into account
            // which level we are at).
            if (! isset($itemcount[$level])) {
                // first count
                $itemcount[$level] = 0;
            } else {
                // increment count
                $itemcount[$level]++;
            }

            // is this the very first item in the list?
            if (! $pastFirst) {
                $first = true;
                $pastFirst = true;
            } else {
                $first = false;
            }

            // create a list-item starting token.
            $start = $this->wiki->addToken(
                $this->rule,
                array(
                    'type' => $type . '_item_start',
                    'level' => $level,
                    'count' => $itemcount[$level],
                    'first' => $first
                )
            );

            // create a list-item ending token.
            $end = $this->wiki->addToken(
                $this->rule,
                array(
                    'type' => $type . '_item_end',
                    'level' => $level,
                    'count' => $itemcount[$level]
                )
            );

            // add the starting token, list-item text, and ending token
            // to the return.
            $return .= $start . $text . $end;
        }

        // the last list-item may have been indented.  go through the
        // list-type stack and create end-list tokens until the stack
        // is empty.
        while (count($stack) > 0) {
            $return .= $this->wiki->addToken(
                $this->rule,
                array (
                    'type' => array_pop($stack) . '_list_end',
                    'level' => count($stack)
                )
            );
        }

        // we're done!  send back the replacement text.
        return "\n\n" . $return . "\n\n";
    }
}
?>
