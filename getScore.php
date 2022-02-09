 <?php 
 function getScore(){
     require('db.php');
      session_start();
    if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true){
        $username =$_SESSION['username'];
        $query = "SELECT * FROM `users` WHERE username='$username'";
        $result2 = mysqli_query($con, $query) or die(mysql_error());
        while ($row = $result2->fetch_assoc()) {
            echo json_encode($row);
        }
            
    }
 }

 getScore();

?>