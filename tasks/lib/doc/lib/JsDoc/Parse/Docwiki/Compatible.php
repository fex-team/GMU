<?php

class Text_Wiki_Parse_Compatible extends Text_Wiki_Parse {
  function parse(){
      $text = $this->wiki->source;

      $text = preg_replace('/(?<!\*)\*([^*\n]+?)\*(?!\*)/ms', '//\1//', $text);
      $text = preg_replace('/(?<!\*)\*\*\*([^*\n]+?)\*\*\*(?!\*)/ms', '\'\'\1\'\'', $text);

      $text = preg_replace('/^\+ /ms', '1. ', $text);
      $text = preg_replace('/^- /ms', '* ', $text);

      $text = preg_replace_callback('/{@link(\[(.+?)\])?\s+([^}]+?)}/ims', create_function('$matches', 'return "[".$matches[3]."]".(empty($matches[2])?"":"($matches[2])");'), $text);
      $this->wiki->source = $text;
  }

}
?>