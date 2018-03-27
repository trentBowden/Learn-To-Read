//Serving from your own computer? navigate to the dir then terminal: "python -m SimpleHTTPServer 8000"

//variables
var currentWord = -1;
var currentLevel = 0;
var scrollDuration = 1200;
var currentLevelWords;
var failedWords = 0;

var time1;
var time2;

//Button clicks
// $( ".statisticsPlease" ).on("click",function() {
//     scrollToStatistic(currentLevel);
// });
$( ".nextLevelPlease" ).on("click",function() {
    $("#firstScreenContainer").addClass("hideDiv");
    $("#readingContainer").removeClass("hideDiv");
    scrollToNextLevel();
});
$( ".nextWord" ).on("click",function() {
    failedWord();
    moveToNextWord();
    lightUpWords();
});


function failedWord(){
    failedWords++;
    console.log("Skipped a word? It counts to your failed words! so far: " + failedWords);
    $("#skippedWords").text("("+failedWords+ " words skipped)");
}


function moveToNextWord() {
    console.log("-> next word");
    currentWord++;
    if (currentWord >= 0) {
        updateAnnyangCommands();
    }
}

function checkWordIsCorrect(input) {
    if(input) {
        var wordToRead = currentLevelWords[currentWord];
        var regX = new RegExp(wordToRead.trim().toUpperCase());
        console.log("Comparing " + wordToRead.trim() + " with " + input);
        if (regX.test(input.trim().toUpperCase())) {
            console.log("Found");
            correctWord();
        }
    }
}

function updateAnnyangCommands() {
    var wordToRead = currentLevelWords[currentWord];
    // console.log("Annyang now looking for word: " + wordToRead);
    // var commands = {[wordToRead] : correctWord};
    // annyang.removeCommands();
    // annyang.addCommands(commands);
}

function correctWord() {
    // console.log("Hey that's correct!");
    moveToNextWord();
    lightUpWords();
}

//Internal use JY574222

function resetForNewLevel() {
    currentWord = -1;
    currentLevel++;
    currentLevelWords = [];
    time1 = null;
    time2 = null;
}

function scrollToNextLevel() {
    resetForNewLevel();
    console.log("Scrolling to level: " + currentLevel);
    switch(currentLevel) {
        case 1:
            scrollTo("firstScreen","levelOne");
            break;
        case 2:
            scrollTo("levelOne","levelTwo");
            break;
        case 3:
            scrollTo("levelTwo","levelThree");
            break;
        case 4:
            scrollTo("levelThree","levelFour");
            break;
        case 5:
            scrollTo("statisticsOne","finalPage");
            break;
    }
    lightUpWords();
    time1 = new Date();
}

function scrollToStatistic(level) {
    switch(level) {
        case 1:
            scrollTo("levelFour","statisticsOne");
            $("#info-container-hide").addClass("hideDiv");
            break;
        case 2:
            scrollTo("levelTwo","statisticsTwo");
            break;
        case 3:
            scrollTo("levelThree","statisticsThree");
            break;
        case 4:
            scrollTo("levelFour","statisticsFour");
            break;
    }
    console.log("Say /next level/ to continue!");
    // var commands = {'next level' : scrollToNextLevel};
    // annyang.removeCommands();
    // annyang.addCommands(commands);
}

function scrollTo(prevClass,divClass) {
    console.log('scrolling from '+prevClass+' to '+divClass)
    //hide first, show second
    $("#"+prevClass).addClass("hideDiv");
    $("#"+divClass).removeClass("hideDiv");

    $("html, body").delay(0).animate({
        scrollTop: $("#"+divClass).offset().top
    }, 0);
}

function lightUpWords() {
    console.log('currentLevelWords: '+currentLevelWords)
    console.log("Lighting up word #" + currentWord + " = " + currentLevelWords[currentWord]);

    var content = $("#contentL"+currentLevel);

    if (currentWord < 0) {
        currentLevelWords = content.text().split(' ');
        moveToNextWord();
    }

    content.empty().html(function() {
        for (i = 0; i < currentLevelWords.length; i++) {
            if (i == currentWord) {
                content.append('<span class = "completedWord">' + currentLevelWords[i] + '</span>' + '&nbsp;');
                $(".completedWord").fadeTo( "fast", .33 );
                $(".completedWord").fadeTo( "fast", 1 );
            } else {
                content.append('<span class = "notCompletedWord">' + currentLevelWords[i] + '</span>' + '&nbsp;');
            }
        }
    });

    levelCompleteCheck();
}

function levelCompleteCheck() {
    //We don't say length-1 because we want it to advance one after the final word before we change.
    if (currentWord === currentLevelWords.length) {
        console.log("Level Complete with currentWord = "+currentWord);
        if (currentLevel === 4) {
            scrollToStatistic(1);
        } else {
            time2 = new Date();
            timeTaken(time1,time2);
            scrollToNextLevel(currentLevel);
        }
    }
}

function timeTaken(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffSeconds = Math.ceil(timeDiff / (1000));
    console.log("Time taken: " + diffSeconds + " Seconds");
    $("#L"+currentLevel+"TimeTaken").text("Time taken: " + diffSeconds + " Seconds");
}

// //Voice recognition
// if (annyang) {
//     console.log("Annyang initiated!");
//
//     annyang.addCallback('error', function() {
//         console.log('Make sure you are speaking clearly!');
//     });
//
//     annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
//         console.log("Word spoken: " + userSaid + ". Other possibilities are:"); // sample output: 'hello'
//         // console.log(commandText); // sample output: 'hello (there)'
//         console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
//     });
//
//     console.log("Say /start/ to begin!");
//     var commandsTest = {'start': function() {scrollToNextLevel()}};
//     annyang.addCommands(commandsTest);
//     annyang.start({ autoRestart: true, continuous: true });
// }
