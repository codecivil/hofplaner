<?php
$_content = $_POST['content'];
header("Content-type: text/calendar");
header("Content-Disposition: attachment; filename=HOF.ics");
header("Pragma: no-cache");
header("Expires: 0");
echo(urldecode($_content));
?>
