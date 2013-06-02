<?php

class JsDoc_Text2HTML extends JsDoc_Triggerable
{

    protected $_text;
    protected $_lines;
    protected $_line;
    protected $_previous_line;
    protected $_next_line;
    protected $_stack;
    protected $_protected;
    protected $_protectTags = array(
        'pre',
        'code',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'span',
        'em',
        'a',
        'strong',
        'i',
        'b',
        'div',
        'p',
        'ul',
        'ol',
    );

    public function convert($text)
    {
        $this->_text = $text;
        $this->fixLineBreak();
        $this->protectPre();
        $this->_convert();
        $this->restorePre();
        $this->convertTitle();
        $this->convertLink();
        $this->convertStar();
        //解决p里面包h1-h6, div的问题
        $this->_text = preg_replace('/<p>\s*(<(div|h1|h2|h3|h4|h5|h6)[^>]*>[\s\S]+<\/\2>)\s*<\/p>/i', '\1', $this->_text);
        return $this->_text;
    }

    protected function protectPre()
    {
        $this->_protected = array();
        if (preg_match_all('/<(' . implode("|", $this->_protectTags) . ')[^>]*>[\s\S]+?<\/\1>/i', $this->_text, $matches)) {
            foreach ($matches[0] as $index => $value) {
                $this->_protected['#######' . $index . '#######'] = $value;
            }
        }
        foreach ($this->_protected as $key => $value) {
            $this->_text = str_replace($value, $key, $this->_text);
        }
        //清除掉所以的容器html标签
        $this->_text = htmlspecialchars($this->_text);//htmlspecialchars(preg_replace('/<([a-z]+)[^>]*>[\s\S]+?<\/\1>/i', '', $this->_text));
    }

    protected function restorePre()
    {
        foreach ($this->_protected as $key => $value) {
            $this->_text = str_replace($key, $value, $this->_text);
        }
    }

    protected function _convert()
    {
        $this->_stack = array();
        $this->_previous_line = null;
        $this->_lines = preg_split('/\n/', $this->_text);
        $text = '';
        for ($i = 0, $length = count($this->_lines); $i < $length; $i++) {
            $this->_line = $line = $this->_lines[$i];
            $this->_next_line = $i < $length - 1 ? $this->_lines[$i + 1] : null;
            $this->_convert_step();
            $this->_previous_line = $line;
            $text .= $this->_line;
        }
        while (count($this->_stack)) {
            $tag = array_pop($this->_stack);
            $text .= '</' . $tag . '>';
        }
        $this->_previous_line = null;

        $this->_text = $text;
    }

    protected function _convert_step()
    {
        end($this->_stack);
        $tagInStack = current($this->_stack);
        if (!$this->_line) return;
        switch ($this->_line[0]) {
            case '-':
                $this->_line = '<li>' . substr($this->_line, 2);
                $tagInStack = 'li';
                array_push($this->_stack, $tagInStack);
                if (!$this->_next_line || $this->_next_line[0] == '-') {
                    $this->_line = $this->_line . '</li>';
                    array_pop($this->_stack);
                    end($this->_stack);
                    $tagInStack = current($this->_stack);
                } else if ($this->_next_line && !($this->_next_line[0] == '-' || $this->_next_line[0] == '+')) {
                    $this->_line .= '<br />';
                }
                if ($tagInStack != 'ul' && $tagInStack != 'li') {
                    $tagInStack = 'ul';
                    array_push($this->_stack, $tagInStack);
                    $this->_line = '<ul>' . $this->_line;
                }
                if (!$this->_next_line && $tagInStack == 'ul') {
                    array_pop($this->_stack);
                    $this->_line .= '</ul>';
                }
                break;
            case '+':
                $this->_line = '<li>' . substr($this->_line, 2);
                $tagInStack = 'li';
                array_push($this->_stack, $tagInStack);
                if (!$this->_next_line || $this->_next_line[0] == '+') {
                    $this->_line = $this->_line . '</li>';
                    array_pop($this->_stack);
                    end($this->_stack);
                    $tagInStack = current($this->_stack);
                } else if ($this->_next_line && !($this->_next_line[0] == '-' || $this->_next_line[0] == '+')) {
                    $this->_line .= '<br />';
                }
                if ($tagInStack != 'ol' && $tagInStack != 'li') {
                    $tagInStack = 'ol';
                    array_push($this->_stack, $tagInStack);
                    $this->_line = '<ol>' . $this->_line;
                }
                if (!$this->_next_line && $tagInStack == 'ol') {
                    array_pop($this->_stack);
                    $this->_line .= '</ol>';
                }
                break;
            default:
                if (!$tagInStack) {
                    $tagInStack = 'p';
                    array_push($this->_stack, $tagInStack);
                    $this->_line = '<p>' . $this->_line;
                }
                if ($this->_next_line && !($this->_next_line[0] == '-' || $this->_next_line[0] == '+')) {
                    $this->_line .= '<br />';
                } else if ($tagInStack) {
                    array_pop($this->_stack);
                    $this->_line .= '</' . $tagInStack . '>';
                }
                break;
        }
    }

    protected function fixLineBreak()
    {
        $this->_text = preg_replace('/\r\n|\r/', "\n", $this->_text);
    }


    protected function convertStar()
    {
        $this->_text = preg_replace_callback('/(\*{1,3})([^\*\r\n]+?)\1/', array(&$this, 'preg_callback_star'), $this->_text);
    }

    protected function preg_callback_star($matches)
    {
        $attrs = '';
        switch (strlen($matches[1])) {
            case 4:
                $tag = 'span';
                $attrs = 'class="deleted"';
                break;
            case 3:
                $tag = 'span';
                $attrs = 'class="code"';
                break;
            case 2:
                $tag = 'strong';
                break;
            default:
                $tag = 'em';
                break;
        }
        return '<' . $tag . ' ' . $attrs . '>' . $matches[2] . '</' . $tag . '>';
    }

    protected function convertTitle()
    {
        $this->_text = preg_replace_callback("/(#{1,6})([^#\r\n]+?)\1/", array(&$this, 'preg_callback_title'), $this->_text);
    }

    protected function preg_callback_title($matches)
    {
        $h = 'h' . strval(strlen($matches[1]));
        return "\n" . '<' . $h . '>' . $matches[2] . '</' . $h . '>';
    }

    protected function convertLink()
    {
        $this->_text = preg_replace_callback('/{@link(\[([\s\S]+?)\])?\s+([^}]+?)}/i', array(&$this, 'preg_callback_link'), $this->_text);
    }

    protected function preg_callback_link($matches)
    {
        $text = $matches[3];
        $target = '';
        if ($matches[2]) {
            $link = $matches[2];
            $event = new JsDoc_Event('convertlink', $link);
            $this->trigger($event);
            $link = $event->data;
            $target = ' target="_blank"';
        } else {
            $link = '#' . preg_replace('/\s+/', '', strtolower($matches[3]));
        }
        return '<a href="' . $link . '"' . $target . '>' . $text . '</a>';
    }


}