let guessedWords = [[]];
let availableSpace = 1;

let word;
let guessedWordCount = 0;

let gameMode = 5;
let numberOfCells = 30;

let hardMode = false;
let guessedLetters = [];

let darkMode = false;

let endGame = false;

let colorsObject = {
  greyCell: "rgb(120, 124, 126)",
  greenCell: "rgb(106, 170, 100)",
  yellowCell: "rgb(201, 180, 88)",
  body: "#ffffff",
  textColor: "rgb(26, 26, 27)",
  keysBg: "rgb(211, 214, 218)",
  cellText: "#ffffff",
  keysText: "rgb(26, 26, 27)",
}; //USED FOR COLOR MODES

const createCells = () => {
  const gameBoard = document.getElementById("board");

  for (let index = 0; index < numberOfCells; index++) {
    const cell = document.createElement("div");
    cell.classList.add("board-cell");
    cell.classList.add("animate__animated");
    cell.setAttribute("id", index + 1);

    if (darkMode) {
      cell.classList.add("dark-mode-cell");
    } else {
      cell.classList.remove("dark-mode-cell");
    }

    gameBoard.appendChild(cell);
  }
};

async function getNewWordHelper() {
  var request1 = new XMLHttpRequest();

  https: request1.open(
    "GET",
    `https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=%20noun%2C%20adjective%2C%20verb&excludePartOfSpeech=family-name%2C%20given-name%2C%20idiom%2C%20imperative%2C%20noun-plural%2C%20noun-posessive%2C%20past-participle%2C%20phrasal-prefix%2C&minCorpusCount=120000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=${gameMode}&maxLength=${gameMode}&api_key=mvolm05kq69wdwohoc4wmhrgncir1w8vmnpzhucc4ibaieaig`,
    true
  );
  request1.onload = function () {
    var data = JSON.parse(this.response);
    if (request1.status >= 200 && request1.status < 400) {
      word = data.word.toLowerCase();

      if (word.includes(" ") || word.includes("-")) {
        // some times API returns weird words like "a leaf", so this is a filter for it
        request1.send();
      }
    } else {
      console.error("error");
    }
  };
  request1.send();
}
function getNewWord() {
  getNewWordHelper();
}

const displayMessage = (messageType, message) => {
  const messageContainer = document.getElementById("messages");
  let messageEl;
  const xBtn = document.createElement("span");
  xBtn.textContent = "x";
  xBtn.classList.add("x-btn");
  xBtn.addEventListener("click", () => {
    messageEl.style.display = "none";
    messageEl.innerHTML = "";
    $(".unlimited-title-main").removeClass("hide");
  });
  if (messageType == "congrats") {
    messageEl = document.getElementById("congrats-msg");
    messageEl.textContent = message;
    messageEl.style.display = "block";
  } else if (messageType == "fail") {
    messageEl = document.getElementById("fail-msg");
    messageEl.innerHTML = "";
    messageEl.textContent = message;

    messageEl.style.display = "block";
  }
  if ($(window).height() < 700) {
    $(".unlimited-title-main").addClass("hide");
  }
  messageEl.appendChild(xBtn);
};

const halfSpacer = () => {
  const halfSpacer = document.createElement("div");
  halfSpacer.classList.add("half-spacer");
  return halfSpacer;
};
const createKeyboard = () => {
  const keyboradContainer = document.getElementById("keyborad-container");
  const keyboardArray = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"],
  ];
  keyboardArray.forEach((array, index) => {
    const keyboardRow = document.createElement("div");
    keyboardRow.classList.add("keyboard-list");
    if (index == 1) {
      keyboardRow.appendChild(halfSpacer());
    }
    array.forEach((keyboardBtn) => {
      const btn = document.createElement("button");
      btn.setAttribute("data-keyBtn", keyboardBtn);
      btn.textContent = keyboardBtn;
      btn.classList.add("keyboard-signle-btn");
      if (keyboardBtn.length > 1) {
        btn.classList.add("keyboard-big-btn");
      }
      keyboardRow.appendChild(btn);
    });
    if (index == 1) {
      keyboardRow.appendChild(halfSpacer());
    }
    keyboradContainer.appendChild(keyboardRow);
  });
};

const handleDeleteLetter = () => {
  const currentWordArr = getCurrentWordArr();

  if (guessedWordCount * gameMode != availableSpace - 1) {
    const removedLetter = currentWordArr.pop();
    guessedWords[guessedWords.length - 1] = currentWordArr;

    const lastLetterEl = document.getElementById(String(availableSpace - 1));

    lastLetterEl.textContent = "";
    availableSpace = availableSpace - 1;
  }
};

const hideMessages = () => {
  const messages = document.querySelectorAll("#messages div");
  messages.forEach((message) => {
    message.style.display = "none";
  });
};

const keyboardKeysLogic = () => {
  const allKeys = document.querySelectorAll(".keyboard-signle-btn");
  allKeys.forEach((key) => {
    key.addEventListener("click", (element) => {
      keyLetter = element.target.getAttribute("data-keybtn");
      hideMessages();
      if (keyLetter === "ENTER") {
        handleSubmitWord();
        return;
      }
      if (keyLetter === "DEL") {
        handleDeleteLetter();
        return;
      }

      updateGuessedWords(keyLetter);
    });
  });
};

const realKeyboardLogic = () => {
  const Letters = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
  ];
  document.addEventListener("keydown", function (e) {
    let keyNum;
    hideMessages();

    if (window.event) {
      // IE
      keyNum = e.keyCode;
    } else if (e.which) {
      keyNum = e.which;
    }

    if (keyNum == 13) {
      handleSubmitWord();
      return;
    }
    if (keyNum == 8) {
      handleDeleteLetter();
      return;
    }
    let keyLetter = String.fromCharCode(keyNum);
    if (Letters.includes(keyLetter)) updateGuessedWords(keyLetter);
  });
};

const getCurrentWordArr = () => {
  const numberOfGuessedWords = guessedWords.length;
  return guessedWords[numberOfGuessedWords - 1];
};

const updateGuessedWords = (letter) => {
  const currentWordArr = getCurrentWordArr();

  if (currentWordArr && currentWordArr.length < gameMode) {
    currentWordArr.push(letter);

    const availableSpaceEl = document.getElementById(String(availableSpace));
    availableSpace = availableSpace + 1;

    availableSpaceEl.textContent = letter;
  }
};

const getTileColor = (letter, index) => {
  const isCorrectLetter = word.includes(letter.toLowerCase());
  if (!isCorrectLetter) {
    return colorsObject.greyCell;
  }
  addGuessedLetter(letter);
  const letterInThatPosition = word.charAt(index);
  const isCorrectPosition =
    letter.toLowerCase() === letterInThatPosition.toLowerCase();

  if (isCorrectPosition) {
    return colorsObject.greenCell;
  }
  return colorsObject.yellowCell;
};
const showEndGame = () => {
  endGame = true;
  $("#statistics").trigger("click");
};

const checkIfAllLettersAreUsed = (word) => {
  if (guessedLetters.length > 0) {
    let unusedCounter = 0;
    guessedLetters.forEach((letter) => {
      if (!word.includes(letter)) {
        unusedCounter++;
      }
    });
    return unusedCounter == 0;
  } else {
    return true;
  }
};

const addGuessedLetter = (letter) => {
  if (!guessedLetters.includes(letter)) guessedLetters.push(letter);
};

const handleSubmitHelper = (currentWord, currentWordArr) => {
  //CHecking to see if the word user typed exist
  fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
      "x-rapidapi-key": "7bf62976c0msh2214e8ffd1584aap1167fajsn7ba32dade8b8",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw Error();
      } else {
        const firstLetterId = guessedWordCount * gameMode + 1; //USED TO CHECK IF NEW ROW
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index);
            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            letterEl.classList.add("animate__flipInX"); //adding flipping animation from animate libarary
            letterEl.style = `background-color:${tileColor}; border-color:${tileColor}; color: white;`;
          }, interval * index);
          const allKeys = document.querySelectorAll(".keyboard-signle-btn");
          allKeys.forEach((key) => {
            if (letter.toLowerCase() === key.textContent.toLowerCase()) {
              const tileColor = getTileColor(letter, index);
              key.style = `background-color:${tileColor}; border-color:${tileColor}; color: white;`;
            }
          });
        });

        guessedWordCount += 1;

        if (currentWord.toLowerCase() == word.toLowerCase()) {
          displayMessage("congrats", " You have got it!");
          setStatsData(true);
          showEndGame();
        } else if (guessedWords.length === 6) {
          //if user tried to 6 times finish the game
          displayMessage("fail", `The word is ${word}`);
          setStatsData(false);
          showEndGame();
          return;
        }

        guessedWords.push([]);
      }
    })
    .catch(() => {
      displayMessage("fail", "Word is not recognised");
    });
};

const getStatsData = () => {
  //GETTING USER STATS
  $.ajax({
    type: "POST",
    url: "getScore.php",
  }).done(function (msg) {
    const data = JSON.parse(msg);
    $(".num-played .stat-number").text(data.games_played);
    if (data.games_played > 0) {
      $(".win-rate .stat-number").text(
        (data.games_won / data.games_played) * 100
      );
    } else {
      $(".win-rate .stat-number").text(0);
    }

    $(".current_streak .stat-number").text(data.current_winstreak);
    $(".biggest_streak .stat-number").text(data.biggest_winstreak);
  });
};

const setStatsDataHelper = (
  gamesPlayed,
  gamesWon,
  currentStreak,
  biggestStreak
) => {
  //SETTING USER STATS UPPON FINISH A GAME
  $.ajax({
    type: "POST",
    url: "setScore.php",
    data: {
      gamesPlayed: gamesPlayed,
      gamesWon: gamesWon,
      currentStreak: currentStreak,
      biggestStreak: biggestStreak,
    },
  }).done(function (msg) {
    console.log(msg);
  });
};

const setStatsData = (win) => {
  $.ajax({
    type: "POST",
    url: "getScore.php",
  }).done(function (msg) {
    const data = JSON.parse(msg);
    if (win) {
      const gamesPlayed = parseInt(data.games_played) + 1;
      const gamesWon = parseInt(data.games_won) + 1;
      const currentWinstreak = parseInt(data.current_winstreak) + 1;
      let biggestWinStreak;
      if (currentWinstreak > parseInt(data.biggest_winstreak)) {
        biggestWinStreak = currentWinstreak;
      } else {
        biggestWinStreak = parseInt(data.biggest_winstreak);
      }
      setStatsDataHelper(
        gamesPlayed,
        gamesWon,
        currentWinstreak,
        biggestWinStreak
      );
    } else {
      const gamesPlayed = parseInt(data.games_played) + 1;
      const gamesWon = parseInt(data.games_won);
      const currentWinstreak = 0;
      const biggestWinStreak = parseInt(data.biggest_winstreak);
      setStatsDataHelper(
        gamesPlayed,
        gamesWon,
        currentWinstreak,
        biggestWinStreak
      );
    }
  });
};

const handleSubmitWord = () => {
  const currentWordArr = getCurrentWordArr();

  if (currentWordArr.length !== gameMode) {
    displayMessage("fail", `Word must be ${gameMode} letters`);
  } else {
    const currentWord = currentWordArr.join("");
    if (hardMode == false) {
      handleSubmitHelper(currentWord, currentWordArr);
    } else {
      if (checkIfAllLettersAreUsed(currentWord)) {
        handleSubmitHelper(currentWord, currentWordArr);
      } else {
        displayMessage("fail", "Hard Mode ON");
      }
    }
  }
};

function restart() {
  $(".five-letter-word").trigger("click");
  $(".close-stats").trigger("click");
  //triggering clicks since i already implement function there
}

const toggleShow = (element) => {
  element.classList.toggle("show");
};

const userMenu = () => {
  const userBtn = document.querySelector(".show-user-menu");
  userBtn.addEventListener("click", () => {
    const menu = document.querySelector(".dropdown-user");
    toggleShow(menu);
  });
};
const destroyBoard = () => {
  const gameBoard = document.getElementById("board");
  gameBoard.innerHTML = "";
};

const showAllBtns = () => {
  const gameOptionsContainer = document.getElementById(
    "game-options-container"
  );
  const gameModesButtons = gameOptionsContainer.querySelectorAll("button");
  gameModesButtons.forEach((btn) => {
    btn.style.display = "block";
  });
};
const changeGameMode = () => {
  const gameOptionsContainer = document.getElementById(
    "game-options-container"
  );
  const gameModesButtons = gameOptionsContainer.querySelectorAll("button");
  gameModesButtons.forEach((btn) => {
    if (!btn.classList.contains("user-not-logged-in-buttons")) {
      btn.addEventListener("click", () => {
        gameMode = parseInt(btn.getAttribute("data-mode"));
        numberOfCells = gameMode * 6;
        const gameBoard = document.getElementById("board");
        gameBoard.className = "";
        gameBoard.classList.add(`game-mode-${gameMode}`);
        btn.blur();

        guessedWords = [[]];
        availableSpace = 1;
        endGame = false;
        guessedWordCount = 0;

        guessedLetters = [];
        hardMode = false;

        destroyBoard();
        createCells();
        getNewWord();
        showAllBtns();
        btn.style.display = "none";
        const allKeys = document.querySelectorAll(".keyboard-signle-btn");
        allKeys.forEach((key) => {
          key.style = `background-color:${colorsObject.keysBg}; border-color:${colorsObject.keysBg}; color: ${colorsObject.keysText}`;
        });
      });
    }
  });
};
const closeShowInfo = () => {
  const infoBtn = document.querySelector("button.info");
  infoBtn.addEventListener("click", () => {
    const messageBoard = document.getElementById("info-message-container");
    messageBoard.style.display = "flex";
  });

  const closeBtn = document.querySelector(".close-info");
  closeBtn.addEventListener("click", () => {
    const messageBoard = document.getElementById("info-message-container");
    messageBoard.style.display = "none";
  });
};

const closeShowSettings = () => {
  const infoBtn = document.getElementById("setting");
  infoBtn.addEventListener("click", () => {
    const settingsBoard = document.getElementById("options-container");
    settingsBoard.style.display = "flex";
  });

  const closeBtn = document.querySelector(".close-settings");
  closeBtn.addEventListener("click", () => {
    const settingsBoard = document.getElementById("options-container");
    settingsBoard.style.display = "none";
  });
};

const toggleDarkTheme = (checkboxValue) => {
  darkMode = checkboxValue;
  window.localStorage.setItem("darkmode", checkboxValue);
  if (checkboxValue) {
    const body = document.querySelector("#container");
    body.style.background = "#090909";
    $("#score-board").css("background", "#121213");
    $("div#user-menu-container > div > ul").css("background", "#121213");
    $(".overlay-score-board").css("background-color", "rgba(0,0,0, 0.5)");
    $(".logged-out-stats").addClass("logged-out-stats-dark");
    document
      .getElementById("options-container")
      .classList.add("dark-container");
    document
      .getElementById("info-message-container")
      .classList.add("dark-container");
    const texts = document.querySelectorAll("p, span, a,h1,h2,h3");

    const allKeys = document.querySelectorAll(".keyboard-signle-btn");
    allKeys.forEach((key) => {
      key.classList.add("dark-mode-keyboard");
    });

    texts.forEach((text) => {
      text.classList.add("dark-mode-text");
    });

    const allCells = document.querySelectorAll(".board-cell");

    allCells.forEach((cell) => {
      cell.classList.add("dark-mode-cell");
    });
  } else {
    const body = document.querySelector("#container");
    body.style.background = "white";
    $("div#user-menu-container > div > ul").css(
      "background",
      "rgb(211, 214, 218)"
    );
    $("#score-board").css("background", "white");
    $(".overlay-score-board").css("background-color", "rgba(255,255,255, 0.5)");
    $(".logged-out-stats").removeClass("logged-out-stats-dark");
    const texts = document.querySelectorAll("p, span, a, h1,h2,h3");
    texts.forEach((text) => {
      text.classList.remove("dark-mode-text");
    });

    document
      .getElementById("options-container")
      .classList.remove("dark-container");
    document
      .getElementById("info-message-container")
      .classList.remove("dark-container");
    const allCells = document.querySelectorAll(".board-cell");

    allCells.forEach((cell) => {
      cell.classList.remove("dark-mode-cell");
    });
  }
};
const toggleColorBlind = (checkboxValue) => {
  if (checkboxValue) {
    const colorBlindColor = {
      greenCell: "rgb(245, 121, 58)",
      greyCell: "rgb(120, 124, 126)",
      yellowCell: "rgb(133, 192, 249)",
    };

    const allCells = document.querySelectorAll(".board-cell");

    allCells.forEach((cell) => {
      if (cell.style.backgroundColor == colorsObject.greyCell) {
        cell.style.backgroundColor = colorBlindColor.greyCell;
        cell.style.borderColor = colorBlindColor.greyCell;
      } else if (cell.style.backgroundColor == colorsObject.greenCell) {
        cell.style.backgroundColor = colorBlindColor.greenCell;
        cell.style.borderColor = colorBlindColor.greenCell;
      } else if (cell.style.backgroundColor == colorsObject.yellowCell) {
        cell.style.backgroundColor = colorBlindColor.yellowCell;
        cell.style.borderColor = colorBlindColor.yellowCell;
      }
    });

    const allKeys = document.querySelectorAll(".keyboard-signle-btn");
    allKeys.forEach((key) => {
      if (key.style.backgroundColor == colorsObject.greyCell) {
        key.style.backgroundColor = colorBlindColor.greyCell;
        key.style.borderColor = colorBlindColor.greyCell;
      } else if (key.style.backgroundColor == colorsObject.greenCell) {
        key.style.backgroundColor = colorBlindColor.greenCell;
        key.style.borderColor = colorBlindColor.greenCell;
      } else if (key.style.backgroundColor == colorsObject.yellowCell) {
        key.style.backgroundColor = colorBlindColor.yellowCell;
        key.style.borderColor = colorBlindColor.yellowCell;
      }
    });
    colorsObject.greenCell = colorBlindColor.greenCell;
    colorsObject.greyCell = colorBlindColor.greyCell;
    colorsObject.yellowCell = colorBlindColor.yellowCell;
  } else {
    const colorBlindColor = {
      greenCell: "rgb(106, 170, 100)",
      greyCell: "rgb(120, 124, 126)",
      yellowCell: "rgb(201, 180, 88)",
    };
    const allCells = document.querySelectorAll(".board-cell");

    allCells.forEach((cell) => {
      console.log(cell.style.backgroundColorColor);
      if (cell.style.backgroundColor == colorsObject.greyCell) {
        cell.style.backgroundColor = colorBlindColor.greyCell;
        cell.style.borderColor = colorBlindColor.greyCell;
      } else if (cell.style.backgroundColor == colorsObject.greenCell) {
        cell.style.backgroundColor = colorBlindColor.greenCell;
        cell.style.borderColor = colorBlindColor.greenCell;
      } else if (cell.style.backgroundColor == colorsObject.yellowCell) {
        cell.style.backgroundColor = colorBlindColor.yellowCell;
        cell.style.borderColor = colorBlindColor.yellowCell;
      }
    });

    const allKeys = document.querySelectorAll(".keyboard-signle-btn");
    allKeys.forEach((key) => {
      if (key.style.backgroundColor == colorsObject.greyCell) {
        key.style.backgroundColor = colorBlindColor.greyCell;
        key.style.borderColor = colorBlindColor.greyCell;
      } else if (key.style.backgroundColor == colorsObject.greenCell) {
        key.style.backgroundColor = colorBlindColor.greenCell;
        key.style.borderColor = colorBlindColor.greenCell;
      } else if (key.style.backgroundColor == colorsObject.yellowCell) {
        key.style.backgroundColor = colorBlindColor.yellowCell;
        key.style.borderColor = colorBlindColor.yellowCell;
      }
    });

    colorsObject.greenCell = colorBlindColor.greenCell;
    colorsObject.greyCell = colorBlindColor.greyCell;
    colorsObject.yellowCell = colorBlindColor.yellowCell;
  }
};
const toggleHardMode = (checkboxValue) => {
  hardMode = checkboxValue == true;

  numberOfCells = gameMode * 6;
  const gameBoard = document.getElementById("board");
  gameBoard.className = "";
  gameBoard.classList.add(`game-mode-${gameMode}`);

  guessedWords = [[]];
  endGame = false;
  availableSpace = 1;

  guessedWordCount = 0;

  guessedLetters = [];

  destroyBoard();
  createCells();
  getNewWord();
  showAllBtns();

  const allKeys = document.querySelectorAll(".keyboard-signle-btn");
  allKeys.forEach((key) => {
    key.style = `background-color:${colorsObject.keysBg}; border-color:${colorsObject.keysBg}; color: ${colorsObject.keysText}`;
  });
};

const setGameModes = () => {
  const optionsContainer = document.getElementById("options-container");
  const checkBoxModes = optionsContainer.querySelectorAll("input.checkbox");
  checkBoxModes.forEach((checkBox) => {
    checkBox.addEventListener("click", () => {
      if (checkBox.getAttribute("data-modechange") == "dark-theme") {
        toggleDarkTheme(checkBox.checked);
      } else if (checkBox.getAttribute("data-modechange") == "color-blind") {
        toggleColorBlind(checkBox.checked);
      } else if (checkBox.getAttribute("data-modechange") == "hard-mode") {
        toggleHardMode(checkBox.checked);
      }
    });
  });
};
document.addEventListener("DOMContentLoaded", () => {
  createCells();
  getNewWord();
  createKeyboard();
  keyboardKeysLogic();
  realKeyboardLogic();
  userMenu();
  changeGameMode();
  closeShowInfo();
  closeShowSettings();
  setGameModes();
});

const checkForNewRow = (index) => {
  console.log(index);
  return (index + 1) % gameMode == 0 ? "<br />" : "";
};
// A $( document ).ready() block.
function copy(selector) {
  if (endGame) {
    var $temp = $("<div>");
    $("body").append($temp);
    $temp
      .attr("contenteditable", true)
      .html($(selector).html())
      .select()
      .on("focus", function () {
        document.execCommand("selectAll", false, null);
      })
      .focus();
    document.execCommand("copy");
    $temp.remove();
  }
}
$(document).ready(function () {
  $("#statistics").click(function () {
    getStatsData();
    $(".overlay-score-board").css("display", "block");
    $("#score-board").css("display", "flex");
    $("#sharing-container").html("");
    setTimeout(() => {
      //Drawing the text for sharing,
      $("#sharing-container").html("");
      $("#board .board-cell").each(function (index) {
        if (
          $(this).css("background-color") == "rgb(106, 170, 100)" ||
          $(this).css("background-color") == "rgb(245, 121, 58)"
        ) {
          $("#sharing-container").append("🟩");
          $("#sharing-container").append(checkForNewRow(index));
        } else if (
          $(this).css("background-color") == "rgb(133, 192, 249)" ||
          $(this).css("background-color") == "rgb(201, 180, 88)"
        ) {
          $("#sharing-container").append("🟨");
          $("#sharing-container").append(checkForNewRow(index));
        } else if (
          $(this).css("background-color") == "rgb(120, 124, 126)" ||
          $(this).css("background-color") == "rgb(120, 124, 126)"
        ) {
          $("#sharing-container").append("⬜");
          $("#sharing-container").append(checkForNewRow(index));
        }
      });
    }, 1000);

    if (!endGame) {
      $("#sharing-container").addClass("unselectable");
    } else {
      $("#sharing-container").removeClass("unselectable");
    }
  });
  $(".close-stats").click(function () {
    $("#score-board").css("display", "none");
    $(".overlay-score-board").css("display", "none");
  });

  if (localStorage.getItem("darkmode") !== null) {
    let mode = JSON.parse(window.localStorage.getItem("darkmode")); //setting inforamtion about dark mode in local storage
    toggleDarkTheme(mode);
    $(".darkmode-checkbox").prop("checked", mode);
  }
});
