<?php
	$filename = "highscores.json";

	$file = fopen("highscores.json", "r");
	$json = fread($file, filesize($filename));
	fclose($file);

	echo $json;
?>