<?php
//returns raw result
function _execute_stmt(array $stmt_array, mysqli $conn)
{
	$stmt = ''; $str_types = ''; $arr_values = ''; $message = '';
	if (isset($stmt_array['stmt']) ) { $stmt = $stmt_array['stmt']; };
	if (isset($stmt_array['str_types']) ) { $str_types = $stmt_array['str_types']; };
	if (isset($stmt_array['arr_values']) ) {  $arr_values = $stmt_array['arr_values']; };
	if (isset($stmt_array['message']) ) { $message = $stmt_array['message']; }
	$dbMessage = ''; $dbMessageGood = '';
	if ( !$statement = $conn->prepare($stmt) ) { $dbMessage = "Verbindung war nicht erfolgreich."; $dbMessageGood = "false"; }
	else {
		if ( $str_types != '' AND !$statement->bind_param($str_types, ...$arr_values) ) { $dbMessage = "Übertragung war nicht erfolgreich."; $dbMessageGood = "false"; }
		else {
			if ( !$statement->execute() ) { $dbMessage = "Operation war nicht erfolgreich."; $dbMessageGood = "false"; }
			else {
				$dbMessage = $message; $dbMessageGood = "true";
				$result = $statement->get_result();
			}
		}
	}
	$_return = array();
	if ( isset($result) ) { $_return['result'] = $result; }; $_return['dbMessage'] = $dbMessage; $_return['dbMessageGood'] = $dbMessageGood; $_return['insert_id'] = $conn->insert_id;
	return $_return;
}

//returns result as three dimensional array: index1 = 'result','dbMessage','dbMessageGood';  index2 = key; index3 of 'result' = row number;
//$flip=true: flip index2 and index3; defaults to false
function execute_stmt(array $stmt_array, mysqli $conn, bool $flip = false)
{
	$_result_array = _execute_stmt($stmt_array,$conn);
	//if ( ! isset($_result_array['result']) ) { print_r($stmt_array); }; //for debug only
	$return = array(); $return['dbMessage'] = $_result_array['dbMessage']; $return['dbMessageGood'] = $_result_array['dbMessageGood']; $return['result'] = array(); $return['insert_id'] = $_result_array['insert_id']; $index = 0;
	if ( $_result = $_result_array['result'] AND $_result->num_rows > 0 ) {
		while ($row=$_result->fetch_assoc()) {
			if ( isset($flip) AND $flip ) { $return['result'][$index] = array(); }
			unset($value);
			foreach ($row as $key=>$value) {
				//problem are NULL values in the field values! Handle them!
				if ( is_null($key) ) { $key = ''; }
				if ( is_null($value) ) { $value = ''; }
				
				if ( (! isset($flip) OR ! $flip ) AND ! isset($return['result'][$key]) ) { $return['result'][$key] = array(); }
				if ( isset($flip) AND $flip ) { $return['result'][$index][$key] = $value; } else { $return['result'][$key][$index] = $value; }
			}
			$index++;
		}
		return $return;
	}
}

