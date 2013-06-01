<?php
// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:


class Text_Wiki_Render_Xhtml_Codepreview extends Text_Wiki_Render {
    var $conf = array(
        'css_div' => 'codepreivew',
        'css_ul' => 'toptabs',
        'css_li' => null,
        'css_li_active' => 'active',
        'css_a' => null,
        'css_a_active' => null,
        'css_content' => 'codepreivew-content',
        'css_content_active' => 'codepreivew-content active',
        'css_a_link' => null,
        'css_a_javascript' => null,
        'css_footer_ul' => 'btns',
        'css_footer_li' => null,
        'css_footer_li_active' => 'active',
        'css_footer_a' => null,
        'css_footer_a_active' => null,
    );

    function token($options)
    {
        static $_id;
        $_id++;

        $mapping = array(
            'js' => 'javascript',
            'css' => 'css',
            'html' => 'html',
        );

        $files = array();
        $arr = explode("\n", trim($options['text'], "\n"));
        foreach($arr as $v){
            $content = $this->getFileConent($v);
            if(!$content) continue;
            $files[] = array(
                'path' => $v,
                'name' => substr(strrchr($v, "/"), 1),
                'ext' => substr(strrchr($v, "."), 1),
                'content' => $content
            );
        }
        $css = $this->formatCss('css_div');
        $return  = "<div$css>";

        $navs = array();
        $contents = array();
        $footers = array();
        foreach($files as $index => $file) {
            $type = isset($file['ext'])?$file['ext']:'javascript';
            $navs[] = '<li'.$this->formatCss($index==0?'css_li_active':'css_li').'><a'.$this->formatCss($index==0?'css_a_active':'css_a').' href="#codepreview_content_'.$_id.'_'.$index.'">'.$file['name'].'</a></li>';
            $contents[] = '<div'.$this->formatCss($index==0?'css_content_active':'css_content').' id="codepreview_content_'.$_id.'_'.$index.'">'.
                '<textarea class="code" data-type="'.$type.'">'.$this->textEncode($file['content']).'</textarea>'.
                '</div>';
        }
        $footers[] = '<li'.$this->formatCss('css_footer_li_active').'><a'.$this->formatCss('css_footer_a_active', 'viewmode').' href="javascript:void(0)">查看</a></li>';
        //$footers[] = '<li'.$this->formatCss('css_footer_li').'><a'.$this->formatCss('css_footer_a', 'editmode').' href="javascript:void(0)">编辑</a></li>';
        $footers[] = '<li'.$this->formatCss('css_footer_li').'><a'.$this->formatCss('css_footer_a', 'preview').' target="_blank" href="'.$options['attributes']['href'].'">预览</a></li>';

        $return .= '<ul'.$this->formatCss('css_ul').'>'.implode("", $navs).'</ul>';
        $return .= implode("", $contents);
        $return .= '<ul'.$this->formatCss('css_footer_ul').'>'.implode("", $footers).'</ul>';
        $return .= '</div>';
        return $return;
    }

    function formatCss($key, $plus = '')
    {
        $css = $plus;
        if (isset($this->conf[$key])) {
            $css = $this->conf[$key].' '.$css;
        }
        $css = trim($css);
        return $css?sprintf(' class="%s"', $css):null;
    }

    function getFileConent($file) {
        if(preg_match('/^http/', $file)){
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $file);
            curl_setopt($curl, CURLOPT_HEADER, 0);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            $data = curl_exec($curl);
            curl_close($curl);
            return $data;
        } else if(file_exists($file)) {

            if (!$fp = @fopen($file, 'rb'))
            {
                return null;
            }

            $content = '';

            if (filesize($file) > 0)
            {
                $content = fread($fp, filesize($file));
            }

            fclose($fp);

            return $content;
        }
        return null;
    }
}
