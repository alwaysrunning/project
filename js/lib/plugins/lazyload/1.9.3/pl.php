<?php
$arr = explode("%", file_get_contents(dirname(__FILE__) . "/science.txt"));
$i = rand(0, count($arr) - 1);
sleep(rand(1, 10) / 10);
echo "<pre>" . $arr[$i] . "</pre>";
