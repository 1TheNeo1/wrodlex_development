 <?php 
 require('db.php');
 session_start();
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true){
    $username =$_SESSION['username'];
     $sql = "UPDATE users SET games_played='1' WHERE username='$username'";
     $con->query($sql);


     $query = "SELECT * FROM `users` WHERE username='$username'";
     $result2 = mysqli_query($con, $query) or die(mysql_error());
    while ($row = $result2->fetch_assoc()) {
        echo $row['games_played']."<br>";
    }
}
?>