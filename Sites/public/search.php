<?php
	//require the DB cllass
	require_once("../DB.class.php");
	//institiate the DB class
	$db = new DB();
	
	switch($_GET['method']){
    
    	case "papers":
    		echo json_encode($db->searchPapers($_GET['q']));
    		break;
    	case "faculty":
			echo json_encode($db->searchFaculty($_GET['q']));
			break;			
		}
	
?>