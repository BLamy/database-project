<?
require_once("../DB.class.php");
$db = new DB();
$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$paperId = $db->insertPaper($data->title, $data->abstract, $data->citation);
	$user = $db->findFacultyByUsername($_SERVER['AUTHENTICATE_UID']);
	$db->insertAuthorship($user['id'], $paperId);
}