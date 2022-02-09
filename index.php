<?php session_start();?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Wordle Unlimited</title>

    <link rel="stylesheet" href="./css/style.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
    />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous">
    
    
<!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XZW2JRT705"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-XZW2JRT705');
    </script>

    <script type='text/javascript'>
    window.smartlook||(function(d) {
        var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
        var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
        c.charset='utf-8';c.src='https://rec.smartlook.com/recorder.js';h.appendChild(c);
        })(document);
        smartlook('init', 'e05f55c75e7d25ceeaca836a0365cc045918809b');
    </script>
    <!-- Hotjar Tracking Code for https://www.wordlex.xyz/ -->
    <script>
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:2811686,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    </script>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="./js/wordle.js"></script>
  </head>
  <body>
    <div id="container">
      <div id="game">
        <header>
          <div class="header-menu left-menu">
            <button class="info"><i class="far fa-question-circle"></i></button>
          </div>
         
          <h1 class="wordle-title-main">Wordle</h1>
          <div class="header-menu right-menu">
            <div id="user-menu-container">
            <button class="show-user-menu"><i class="fas fa-user"></i></button>
            <?php
              if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true) {
                  ?>
                  <div class="dropdown-user dropdown-loggedin">
                    <ul>
                      <?php 
                        require('db.php'); 
                        $isAdmin = 0;
                              $username =$_SESSION['username'];
                              $query = "SELECT * FROM `users` WHERE username='$username'";
                              $result2 = mysqli_query($con, $query) or die(mysql_error());
                              while ($row = $result2->fetch_assoc()) {
                                  $isAdmin = $row["is_admin"];
                              }
                              if ($isAdmin == 1) { ?>
                                <li><a href="./admin-dashboard.php">Admin</a></li>
                           <?php   }?>
                      <li><a href="./logout.php">Log out</a></li>

                    </ul>
                  </div>
              <?php 
              } else {
                ?>
                <div class="dropdown-user dropdown-loggedout ">
                    <ul>
                      <li><a href="./login.php">Log in</a></li>
                      <li><a href="./registration.php">Register</a></li>
                    </ul>
                  </div>
                <?php
              }
            ?>
            </div>
            <button id="statistics"><i class="fas fa-trophy"></i></button>
            <button id="setting"><i class="fas fa-cog"></i></button>
          </div>
        </header>
         
        <div id="game-container">
          <h1 class="unlimited-title-main">UNLIMITED PLAY</h1>
          <div id="messages">
            <div id="congrats-msg"></div>
            <div id="fail-msg"></div>
          </div>
          
          <div id="board"></div>
           <div id="game-options-container">
             <?php if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true) {?>
            <button class="five-letter-word" data-mode="5" style="display:none">5 letters mode</button>
            <button class="six-letter-word" data-mode="6">6 letters mode</button>
            <button class="seven-letters-word" data-mode="7">7 letters mode</button>
             <?php } else { ?>
              <button class="five-letter-word" data-mode="5" style="display:none">5 letters mode</button>
              <button class="user-not-logged-in-buttons" >6 letters mode</button>
              <button class="user-not-logged-in-buttons">7 letters mode</button>
              <p class="not-logged-in-msg"><a href="./login.php">Login</a> to unlock unlimited 6 and 7 letter modes. <a href="./registration.php">Register</a>. </p>

              
              <?php }  ?>
          </div>
          <div id="info-message-container">
                <h3>HOW TO PLAY</h3>
                <p>Guess the <b>WORDLE</b> in 6 tries</p>
                <p>Each guess must be a valid 5(or 6/7) letter word. Hit the enter button to submit.</p>
                <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
                <hr>
                <p><b>Examples</b></p>
                <div class="info-example">
                  <div class="board-cell" style="background:#6aaa64;border-color:#6aaa64 ;color: white">W</div>
                  <div class="board-cell">E</div>
                  <div class="board-cell">A</div>
                  <div class="board-cell">R</div>
                  <div class="board-cell">Y</div>
                </div>
                <p>The letter <b>W</b> is in the word and in the correct spot</p>
                <div class="info-example">
                  <div class="board-cell">P</div>
                  <div class="board-cell" style="background:#c9b458;border-color: #c9b458;color: white">I</div>
                  <div class="board-cell">L</div>
                  <div class="board-cell">L</div>
                  <div class="board-cell">S</div>
                </div>
                <p>The letter <b>I</b> is in the word but in the wrong spot.</p>
                <div class="info-example">
                  <div class="board-cell">V</div>
                  <div class="board-cell">A</div>
                  <div class="board-cell">G</div>
                  <div class="board-cell" style="background:#787c7e;border-color: #787c7e;color: white">U</div>
                  <div class="board-cell">E</div>
                </div>
                <p>The letter <b>U</b> is not in the word in any spot.</p>
                <span class="close-info"><i class="fas fa-times"></i></span>
              </div>
        </div>
        
        <div id="options-container">
          <h3>SETTINGS</h3>
          <div class="settings-option">
            <div>
              <h2>Hard Mode</h2>
              <p>Any revealed hints must be used in subsequent guesses</p>
            </div>
            
            <div class="button r center" id="button-3">
              <input type="checkbox" class="checkbox" data-modechange="hard-mode">
              <div class="knobs"></div>
              <div class="layer"></div>
            </div>
          </div>
          <div class="settings-option">
            <div>
                  <h2>Dark Theme</h2>
            </div>
        
            
            <div class="button r center" id="button-3">
              <input type="checkbox" class="checkbox darkmode-checkbox" data-modechange="dark-theme">
              <div class="knobs"></div>
              <div class="layer"></div>
            </div>
          </div>
          <div class="settings-option">
            <div><h2>Color Blind Mode</h2>
            <p>High contrast colors</p></div>
            <div class="button r center" id="button-3">
              <input type="checkbox" class="checkbox" data-modechange="color-blind">
              <div class="knobs"></div>
              <div class="layer"></div>
            </div>
          </div>
          <div class="settings-option">
            <h2>Feedback</h2>
            <div><a href="http://twitter.com">Twitter</a> | <a href="mailto:neonlightyt7@gmail.com">Email</a></div>
          </div>
         <p class="close-settings"><i class="fas fa-times"></i></p>
             </div>
        <div id="keyborad-container">
          <div class="keyboard-list"></div>
        </div>

        
        <div class="overlay-score-board"></div>
        <div id="score-board">
          <h2>STATISTICS</h2>
         
          <div class="number-stats">
            <div class="signle-stat num-played" data-stat="num-played"> 
              <p class="stat-number">0</p>
              <p class="stat-text">Played</p>
            </div>
            <div class="signle-stat win-rate" data-stat="win-rate"> 
              <p class="stat-number">0</p>
              <p class="stat-text">Win %</p>
            </div>
            <div class="signle-stat current_streak" data-stat="current_streak"> 
              <p class="stat-number">0</p>
              <p class="stat-text">Current Streak</p>
            </div>
            <div class="signle-stat biggest_streak" data-stat="biggest_streak"> 
              <p class="stat-number">0</p>
              <p class="stat-text">Max Streak</p>
            </div>
             <?php if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true) {} else {?>
              <div class="logged-out-stats">You need to log in to have stats!</div>
            <?php } ?>
          </div>
          <div id="sharing-container">

          </div>
          <div class="share-sections-btn">
            <div class="share-btn">
                <button onclick="copy('#sharing-container');"  title="Finish game to be able to copy it">SHARE <i class="fas fa-share-alt"></i></button>
            </div>
            <div class="restart-game-btn">
                <button onclick="restart()">
                RESTART 
                <i class="fas fa-redo-alt"></i>
              </button>
          </div>
          </div>
          <p class="close-stats"><i class="fas fa-times"></i></p>
        </div>
      </div>
    </div>
  </body>
</html>
