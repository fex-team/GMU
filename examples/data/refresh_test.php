<?php
header('Content-Type: application/json');
sleep(2);
$data = array();

$image = array('txt', 'doc', 'xls', 'album', 'pdf', 'ppt', 'ufo');
$count = count($image);

for($i =0; $i < 10; $i++){
    $data[] = array(
        'html'=>'<li data-highlight="ui-list-hover">
                    <img src="../../../examples/assets/refresh/'.($image[rand(0, $count-1)]).'.png"/>
                    <dl>
                        <dt>英国地标“大本钟”用女王名</dt>
                        <dd class="content">新华网深圳3月23日电（记者 赵瑞西）23日，深圳市南山区西里医院的大楼</dd>
                        <dd class="source">来源：新浪</dd>
                    </dl>
                </li>'
    );
}
echo json_encode($data);
?>