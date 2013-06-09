<?php
	$json = $_POST['json'];

	$file = fopen("highscores.json", "w+");
	fwrite($file, json_encode($json));
	fclose($file);
?>