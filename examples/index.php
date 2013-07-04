<?php
    header('location: widget');
?>

<div id="J_toolbar">
    <div class="ui-toolbar-wrap">
        <div class="ui-toolbar-left">
            <a href="../">返回</a>
        </div>
        <h3 class="ui-toolbar-title">百度首页</h3>
        <div class="ui-toolbar-right">
            <span class="btn_1">百科</span>
            <span class="btn_1">知道</span>
        </div>
    </div>
</div>

<div id="J_toolbar2">
    <div class="ui-toolbar-left">
        <a href="../">返回</a>
    </div>
    <h3>工具栏</h3>
    <span class="btn_1">百科</span>
    <span class="btn_1">知道</span>
</div>


<div id="J_toolbar1">
    <a href="../">返回</a>
    <h2>工具栏</h2>
    <span class="btn_1"><span>百科</span></span>
    <span class="btn_1">知道</span>
</div>


<div id="J_toolbar4"></div>

<script type="text/javascript">
    $('#J_toolbar2').toolbar();
    new gmu.Toolbar('#id', {});
    new gmu.Toolbar('<div>');
    new gmu.Toolbar({});
</script>