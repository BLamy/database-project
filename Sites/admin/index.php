<?
require_once("../DB.class.php");
$db = new DB();
$db->createUserIfNotExist($_SERVER['AUTHENTICATE_UID']);
echo json_encode(array("user" => $_SERVER['AUTHENTICATE_UID'], "isAdmin" => true));
