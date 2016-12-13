<?php

	class DB {
		private $connection;
		
		//constructor that requires class with db info
		//and connects to the database
		function __construct() {
			require_once("dbinfo.php");
			$this->connection = new mysqli($host,$user,$pass,$db);
			
			if ($this->connection->connect_error) {
				echo "Connect failed: ".mysqli_connect_errno();
				die();
			}
		}//end constructor	
		
		function findFacultyByUsername($username) {
			$data = array();

			if ($stmt = $this->connection->prepare("select id,fName,lName,email from faculty WHERE fName = ?")) {
				$stmt->bind_param("s", $username);

				$stmt->execute();
				$stmt->store_result();
				//this binds the results to the variables 
				$stmt->bind_result($id,$fName,$lName,$email);
				
				//fetch the rows
				if($stmt->num_rows > 0) {
					while ($stmt->fetch()) {
						$data[] = array('id'=>$id,
										'fName'=>$fName,
										'lName'=>$lName,
										'email'=>$email);
					}
				}
			}
			if (count($data) === 0) {
				return null;
			}
			return $data[0];
		}

		function createUserIfNotExist($username) {
			if (!$this->findFacultyByUsername($username)) {
				if ($stmt = $this->connection->prepare("insert into faculty(fName, email) values(?,?)")) {
					$email = $username."@rit.edu";
					$stmt->bind_param("ss", $username, $email);			
					$stmt->execute();
					$stmt->store_result();
				}
			}
		}

		function insertPaper($title, $abstract, $citation) {
			
			//we are taking values in sowe want to use this
			$queryString = "insert into papers(title, abstract, citation) values(?,?,?)";
			//if the return value is -1, there was a problem inserting
			$insertId = -1;
			//create statement and check it in one line
			if($stmt = $this->connection->prepare($queryString)) {
			//we need to use bind baram because we have the values (?.?,?)
				//3 string, the values are set to the following variables
				$stmt->bind_param("sss", $title, $abstract, $citation);
				
				//execute the statement
				$stmt->execute();
				//store the results
				$stmt->store_result();
				//how to get the num rows
				$numRows = $stmt->affected_rows;
				
				$insertId = $stmt->insert_id;
			}
			return $insertId;
		}


		/**
			Takes in facultyId and paperId 
			and inserts the new information into the 
			Authorship table
		*/
		function insertAuthorship($facultyId, $paperId) {
			
			//we are taking values in sowe want to use this
			$queryString = "insert into authorship(facultyId,paperId) values(?,?)";
			//if the return value is -1, there was a problem inserting
			$insertId = -1;
			//create statement and check it in one line
			if($stmt = $this->connection->prepare($queryString)) {
			//we need to use bind baram because we have the values (?.?,?)
				//3 string, the values are set to the following variables
				$stmt->bind_param("ss",$facultyId,$paperId);
				
				//execute the statement
				$stmt->execute();
				//store the results
				$stmt->store_result();
				//how to get the num rows
				$numRows = $stmt->affected_rows;
				
				$insertId = $stmt->insert_id;
			}
			return $insertId;
		}//close insertAuthorship

		function searchFaculty($query) {
			$data = array();

			if ($stmt = $this->connection->prepare("select id,fName,lName,email from faculty WHERE fName LIKE ?")) {
				$like = $query.'%';
				$stmt->bind_param("s", $like);

				$stmt->execute();
				$stmt->store_result();
				//this binds the results to the variables 
				$stmt->bind_result($id,$fName,$lName,$email);
				
				//fetch the rows
				if($stmt->num_rows > 0) {
					while ($stmt->fetch()) {
						$data[] = array('id'=>$id,
										'fName'=>$fName,
										'lName'=>$lName,
										'email'=>$email);
					}
				}
			}
			return $data;
		}


		function searchPapers($query) {
			$data = array();

			if ($stmt = $this->connection->prepare("
SELECT p.id, p.title, p.abstract, p.citation, GROUP_CONCAT(f.fName) AS authors FROM papers AS p 
INNER JOIN authorship AS a ON a.paperId = p.id 
INNER JOIN faculty AS f ON a.facultyId = f.id
WHERE title LIKE ?
GROUP BY p.id, p.title, p.abstract, p.citation
			")) {
				$like = $query.'%';
				$stmt->bind_param("s", $like);

				$stmt->execute();
				$stmt->store_result();
				//this binds the results to the variables 
				$stmt->bind_result($id, $title, $abstract, $citation, $authors);
				//fetch the rows
				if($stmt->num_rows > 0) {
					while ($stmt->fetch()) {
						$data[] = array('id'=>$id,
										'title'=>$title,
										'abstract'=>$abstract,
										'citation'=>$citation,
										'authors'=> explode(',', $authors));
					}
				}
			}
			return $data;
		}




















		/**
				This class runs a query to get all faculty based on the inputted search
				it then binds the result and puts the result 
				into an array that is returned
		**/
		function getAllFaculty($search) {
			$data = array();

			if ($stmt = $this->connection->prepare("select id,fName,lName,email from faculty WHERE fName LIKE '$search%' OR lName LIKE '$search%'")) {

				$stmt->execute();
				$stmt->store_result();
				//this binds the results to the variables 
				$stmt->bind_result($id,$fName,$lName,$email);
				
				//fetch the rows
				if($stmt->num_rows > 0) {
					while ($stmt->fetch()) {
						$data[] = array('id'=>$id,
										'fName'=>$fName,
										'lName'=>$lName,
										'email'=>$email);
					}
				}
			}
			
			return $data;
			
		}//end getAllFaculty
		
		/**
				This class calls the getAllFaculty
				method which returns an array filled with
				faculty, it then builds an HTML table 
				around this information and returns it 
				in order to display
		**/
		function getAllFacultyAsTable($search) {
			$data = $this->getAllFaculty($search);
			return json_encode($data);
			

		
		}//end getAllFacultyJSON
		
			/**
				This class runs a query to get all papers,
				it then binds the result and puts the result 
				into an array that is returned
			**/
		function getAllPapers($search) {
			$data = array();
			
			if ($stmt = $this->connection->prepare("select * from papers WHERE title LIKE '$search%'")) {
				$stmt->execute();
				$stmt->store_result();
				//this binds the results to the variables 
				$stmt->bind_result($id,$title,$abstract,$citation);
				
				
				//fetch the rows
				if($stmt->num_rows > 0) {
					while ($stmt->fetch()) {
						$data[] = array('id'=>$id,
										'title'=>$title,
										'abstract'=>$abstract,
										'citation'=>$citation,
										'authors'=>array());
					}
				}
			}
			
			return $data;
			
		}//end getAllPapers
		
		/**
				This class calls the getAllPapers
				method which returns an array filled with
				faculty, it then builds an HTML table 
				around this information and returns it 
				in order to display
		**/
		function getAllPapersAsTable($search) {
			$data = $this->getAllPapers($search);
			return json_encode($data);
		
		
		}//end getAllPapersAsTable

		/**
			takes in id of which faculty member
			should be deleted, and executes the query
		**/
		function deleteFaculty($id) {
			$queryString = "delete from faculty where id = ?";
			$numRows = 0;
			if($stmt = $this->connection->prepare($queryString)) {
				$stmt->bind_param("i",intval($id));
				$stmt->execute();
				$stmt->store_result();
				$numRows = $stmt->affected_rows;
			}
			return $numRows;
		
		}//close deleteFaculty
		
		/**
			takes in id of which paper 
			should be deleted, and executes the query
		**/
		function deletePaper($id) {
			$queryString = "delete from papers where id = ?";
			$numRows = 0;
			if($stmt = $this->connection->prepare($queryString)) {
				$stmt->bind_param("i",intval($id));
				$stmt->execute();
				$stmt->store_result();
				$numRows = $stmt->affected_rows;
			}
			return $numRows;
		}//close deletePaper
		
		/**
			takes in id of which paper_keywords
			should be deleted, and executes the query
		**/
		function deletePaperKeyword($id) {
			$queryString = "delete from paper_keywords where id = ?";
			$numRows = 0;
			if($stmt = $this->connection->prepare($queryString)) {
				$stmt->bind_param("i",intval($id));
				$stmt->execute();
				$stmt->store_result();
				$numRows = $stmt->affected_rows;
			}
			return $numRows;
		}//close deletePaperKeyword
		
		
		
		/**
			takes in facultyId for the authorship table
			that should be deleted, and executes the query
		**/
		function deleteAuthorship($id) {
			$queryString = "delete from authorship where facultyId = ?";
			$numRows = 0;
			if($stmt = $this->connection->prepare($queryString)) {
				$stmt->bind_param("i",intval($id));
				$stmt->execute();
				$stmt->store_result();
				$numRows = $stmt->affected_rows;
			}
			return $numRows;
		
		}//close deleteAuthorship
		
		

		
		/**
			Takes in Id,fName,lName,password and email
			for a new faculty member and executes the 
			query to add the faculty to the database
		**/
		function insertFaculty($id,$fName,$lName,$password,$email) {
			
			//we are taking values in sowe want to use this
			$queryString = "insert into faculty(id,fName,lName,password,email)
							values(?,?,?,?,?)";
			//if the return value is -1, there was a problem inserting
			$insertId = -1;
			//create statement and check it in one line
			if($stmt = $this->connection->prepare($queryString)) {
			//we need to use bind baram because we have the values (?.?,?)
				//3 string, the values are set to the following variables
				$stmt->bind_param("sssss",$id,$fName,$lName,$password,$email);
				
				//execute the statement
				$stmt->execute();
				//store the results
				$stmt->store_result();
				//how to get the num rows
				$numRows = $stmt->affected_rows;
				
				$insertId = $stmt->insert_id;
			}
			return $insertId;
		}//close insertFaculty
		
		function insertPaperKeyword($id,$keyword) {

			//we are taking values in sowe want to use this
			$queryString = "insert into faculty(id,keyword)
							values(?,?)";
			//if the return value is -1, there was a problem inserting
			$insertId = -1;
			//create statement and check it in one line
			if($stmt = $this->connection->prepare($queryString)) {
			//we need to use bind baram because we have the values (?.?,?)
				//3 string, the values are set to the following variables
				$stmt->bind_param("ss",$id,$keyword);
				
				//execute the statement
				$stmt->execute();
				//store the results
				$stmt->store_result();
				//how to get the num rows
				$numRows = $stmt->affected_rows;
				
				$insertId = $stmt->insert_id;
			}
			return $insertId;
		}//close insertPaperKeyword
		
		
		
		
	
		
	}//end class
	
	
