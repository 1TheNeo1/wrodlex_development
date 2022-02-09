 <?php 

 function setScore($gamesPlayed, $gamesWon, $currentStreak, $biggestStreak) {
    require('db.php');
    session_start();
    if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true){
        $username =$_SESSION['username'];
        $sql = "UPDATE users SET games_played='$gamesPlayed', games_won='$gamesWon', current_winstreak='$currentStreak', biggest_winstreak='$biggestStreak' WHERE username='$username'";
          
        $con->query($sql);
        echo $currentStreak;

    }
    
 }
 $gamesPlayed =  $_POST['gamesPlayed'];
 $gamesWon =  $_POST['gamesWon'];
 $currentStreak =  $_POST['currentStreak'];
 $biggestStreak =  $_POST['biggestStreak'];
  setScore($gamesPlayed, $gamesWon, $currentStreak, $biggestStreak)
?>