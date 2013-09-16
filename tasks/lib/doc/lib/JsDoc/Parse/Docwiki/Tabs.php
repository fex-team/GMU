<?php


class Text_Wiki_Parse_Tabs extends Text_Wiki_Parse {



    var $regex = ';<tabs(\s[^>]*)?>((?:(?R)|.*?)*)</tabs>;msi';

    var $depth = 1;

    function parse()
    {
        $this->wiki->source = $this->parseTag('tabs', $this->wiki->source);
    }

    public function parseTag($tagName, $src){
        preg_match_all(";(?:<".$tagName."(\s[^>]+?)?>)|(?:</".$tagName.">);msi", $src, $m, PREG_OFFSET_CAPTURE);
        $matches = array();
        $stack = array();
        if(!empty($m[0])){
            foreach($m[0] as $k =>$v){
                if($v[0]{1} == '/'){
                    $start = array_pop($stack);
                } else {
                    array_push($stack, array(
                        'pos' => $v[1],
                        'str' => $v[0],
                        'attr' => $m[1][$k][0]
                    ));
                }
                if(empty($stack)){
                    $offset = $start['pos'];
                    $length = $v[1]+strlen($tagName)+3-$offset;
                    $content = substr($src, $offset, $length);
                    $matches[] = array(
                        'offset' => $offset,
                        'length' => $length,
                        'm' => array(
                            $content,
                            $start['attr'],
                            substr($src, $offset+strlen($start[str]), $v[1] - $offset - strlen($start[str]))
                        )
                    );
                }
            }

        }
        $matches = array_reverse($matches);
        foreach($matches as $match) {
            $src = $this->str_splice($src, $match['offset'], $match['length'], $this->process($match['m']));
        }
        return $src;
    }

    protected function str_splice($input, $offset, $length=null, $splice='')
    {
        $input = (string)$input;
        $splice = (string)$splice;
        $count = strlen($input);

        // Offset handling (negative values measure from end of string)
        if ($offset<0) $offset = $count + $offset;

        // Length handling (positive values measure from $offset; negative, from end of string; omitted = end of string)
        if (is_null($length)) $length = $count;
        elseif ($length < 0)  $length = $count-$offset+$length;

        // Do the splice
        return substr($input, 0, $offset) . $splice . substr($input, $offset+$length);
    }


    function process(&$matches)
    {
        $attributes = $this->getAttrs($matches[1]);
        $active = 0;
        if(is_array($attributes) && isset($attributes['active'])) {
            $active = intval($attributes['active']);
            unset($attributes['active']);
        }

        $content = trim($matches[2], "\n");
        $parts = explode("\n", $content, 2);
        $parts[1] = trim($parts[1], "\n");
        $titles = explode("|", $parts[0]);
        if(!count($titles)){
            return '选项卡标签语法错误';
        }
        $titles = array_values(array_filter($titles));
        $contents = explode(str_pad("\n", $this->depth + 5, "-")."\n", $parts[1]);
        $return = $this->wiki->addToken(
            $this->rule,
            array(
                'type' => 'tabs_title_start',
                'depth' => $this->depth
            )
        );
        foreach($titles as $index => $title){
            $type2 = '';
            $url = '';
            if(preg_match('/^(.*?)(?:(link|javascript):)(.*)$/', $title, $m)) {
                $title = $m[1];
                $type2 = $m[2];
                $url = $m[3];
                array_splice($contents, $index, 0, array(''));
            }
            $return .= $this->wiki->addToken(
                $this->rule,
                array(
                    'type' => 'tabs_title_item_start',
                    'text' => $title,
                    'type2' => $type2,
                    'url' => $url,
                    'active' => $active == $index,
                    'index' => $index,
                    'depth' => $this->depth
                )
            ).$title.$this->wiki->addToken(
                $this->rule,
                array(
                    'type' => 'tabs_title_item_end',
                    'depth' => $this->depth
                )
            );
        }
        $return .= $this->wiki->addToken(
            $this->rule,
            array(
                'type' => 'tabs_title_end',
                'depth' => $this->depth
            )
        );
        foreach($contents as $index => $content){
            $content = "\n\n".trim($content, "\n")."\n\n";
            if(!$content)continue;
            if(preg_match(";(?:<tabs(\s[^>]+?)?>)|(?:</tabs>);msi", $content)){
                $this->depth++;
                $content = $this->parseTag("tabs", $content);
                $this->depth--;
            }
            $return .= $this->wiki->addToken(
                $this->rule,
                array(
                    'type' => 'tabs_content_start',
                    'active' => $active == $index,
                    'text' => $content,
                    'index' => $index,
                    'depth' => $this->depth
                )
            ).$content.$this->wiki->addToken(
                $this->rule,
                array(
                    'type' => 'tabs_content_end',
                    'depth' => $this->depth
                )
            );
        }
        $return = $this->wiki->addToken(
            $this->rule,
            array(
                'type' => 'tabs_start',
                'attributes' => $attributes,
                'depth' => $this->depth
            )
        ).$return.$this->wiki->addToken(
            $this->rule,
            array(
                'type' => 'tabs_end',
                'depth' => $this->depth
            )
        );
        return $return;
    }
}
