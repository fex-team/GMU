<?php

/**
* 
* Parses for text marked as a code example block.
* 
* @category Text
* 
* @package Text_Wiki
* 
* @author Paul M. Jones <pmjones@php.net>
* 
* @license LGPL
* 
* @version $Id: Code.php 237313 2007-06-09 23:11:25Z justinpatrin $
* 
*/

/**
* 
* Parses for text marked as a code example block.
* 
* This class implements a Text_Wiki_Parse to find sections marked as code
* examples.  Blocks are marked as the string <code> on a line by itself,
* followed by the inline code example, and terminated with the string
* </code> on a line by itself.  The code example is run through the
* native PHP highlight_string() function to colorize it, then surrounded
* with <pre>...</pre> tags when rendered as XHTML.
*
* @category Text
* 
* @package Text_Wiki
* 
* @author Paul M. Jones <pmjones@php.net>
* 
*/

class Text_Wiki_Parse_Code extends Text_Wiki_Parse {
    
    
    /**
    * 
    * The regular expression used to find source text matching this
    * rule.
    * 
    * @access public
    * 
    * @var string
    * 
    */
    
/*    var $regex = '/^(\<code( .+)?\>)\n(.+)\n(\<\/code\>)(\s|$)/Umsi';*/
/*    var $regex = ';<code(\s[^>]*)?>(.*?)</code>;msi';*/
    var $regex = ';<code(\s[^>]*)?>((?:(?R)|.*?)*)</code>;msi';

    function parse()
    {
        $this->wiki->source = $this->parseTag('code', $this->wiki->source);
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
        // are there additional attribute arguments?
        $args = trim($matches[1]);
        $matches[2] = trim($matches[2], "\n");
        
        if ($args == '') {
            $options = array(
                'text' => $matches[2],
                'attr' => array('type' => '')
            );
        } else {
        	// get the attributes...
        	$attr = $this->getAttrs($args);
        	
        	// ... and make sure we have a 'type'
        	if (! isset($attr['type'])) {
        		$attr['type'] = '';
        	}
        	
        	// retain the options
            $options = array(
                'text' => $matches[2],
                'attr' => $attr
            );
        }
        
        return "\n\n".$this->wiki->addToken($this->rule, $options)."\n\n";
    }
}
?>
