// =================================
// GAME DATA
// =================================

const notes = [
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "B"
];


// =================================
// HTML ELEMENTS
// =================================

const noteButtons =
    document.querySelectorAll(".note");

const startButton =
    document.querySelector("#startButton");

const roundDisplay =
    document.querySelector("#round");

const scoreDisplay =
    document.querySelector("#score");

const message =
    document.querySelector("#message");


// =================================
// GAME VARIABLES
// =================================

let sequence = [];

let playerSequence = [];

let round = 0;

let score = 0;

let gameStarted = false;

let playerTurn = false;


// =================================
// AUDIO
// =================================

let audioContext = null;


// =================================
// NOTE FREQUENCIES
// =================================

const frequencies = {

    C: 261.63,

    D: 293.66,

    E: 329.63,

    F: 349.23,

    G: 392.00,

    A: 440.00,

    B: 493.88

};


// =================================
// START GAME
// =================================

function startGame() {

    /*
        Create the audio system only
        after the player touches/clicks
        START.

        This is important for iPhone.
    */

    if (!audioContext) {

        audioContext =
            new AudioContext();

    }


    /*
        Resume audio if iPhone/browser
        has suspended it.
    */

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    // Reset game

    sequence = [];

    playerSequence = [];

    round = 0;

    score = 0;

    gameStarted = true;

    playerTurn = false;


    // Update screen

    roundDisplay.textContent =
        round;

    scoreDisplay.textContent =
        score;


    startButton.textContent =
        "RESTART";


    message.textContent =
        "Get ready...";


    // Start first round

    nextRound();

}


// =================================
// NEXT ROUND
// =================================

function nextRound() {

    round++;

    playerSequence = [];

    playerTurn = false;


    // Update round

    roundDisplay.textContent =
        round;


    // Pick random note

    const randomIndex =
        Math.floor(
            Math.random()
            * notes.length
        );


    const randomNote =
        notes[randomIndex];


    // Add note to sequence

    sequence.push(
        randomNote
    );


    // Play sequence

    playSequence();

}


// =================================
// PLAY SEQUENCE
// =================================

function playSequence() {

    message.textContent =
        "Listen...";


    playerTurn = false;


    let delay = 0;


    sequence.forEach(
        function(note) {

            setTimeout(
                function() {

                    playNote(note);

                },
                delay
            );


            delay += 700;

        }
    );


    /*
        Allow player to answer
        after the sequence finishes.
    */

    setTimeout(
        function() {

            message.textContent =
                "Your turn! 🎹";

            playerTurn = true;

        },
        delay
    );

}


// =================================
// PLAY NOTE
// =================================

function playNote(note) {

    // Make sure audio exists

    if (!audioContext) {

        return;

    }


    // Find matching piano key

    const button =
        document.querySelector(
            `[data-note="${note}"]`
        );


    // Safety check

    if (button) {

        button.classList.add(
            "active"
        );


        setTimeout(
            function() {

                button.classList.remove(
                    "active"
                );

            },
            400
        );

    }


    // Create oscillator

    const oscillator =
        audioContext.createOscillator();


    // Create volume control

    const gainNode =
        audioContext.createGain();


    // Set frequency

    oscillator.frequency.value =
        frequencies[note];


    /*
        Triangle sounds softer
        and more like a simple
        electronic piano.
    */

    oscillator.type =
        "triangle";


    // Connect audio

    oscillator.connect(
        gainNode
    );

    gainNode.connect(
        audioContext.destination
    );


    // Start volume

    gainNode.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );


    // Fade out

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.6
    );


    // Start sound

    oscillator.start();


    // Stop sound

    oscillator.stop(
        audioContext.currentTime + 0.6
    );

}


// =================================
// PLAYER PRESSES NOTE
// =================================

function handleNoteClick(event) {

    /*
        Don't allow piano keys
        before the game starts.
    */

    if (
        !gameStarted ||
        !playerTurn
    ) {

        return;

    }


    // Make sure audio is running

    if (
        audioContext &&
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    // Get note

    const clickedNote =
        event.currentTarget.dataset.note;


    // Add to player's sequence

    playerSequence.push(
        clickedNote
    );


    // Play note

    playNote(
        clickedNote
    );


    // Check answer

    checkAnswer();

}


// =================================
// CHECK ANSWER
// =================================

function checkAnswer() {

    const currentIndex =
        playerSequence.length - 1;


    /*
        Check if the latest note
        is wrong.
    */

    if (
        playerSequence[currentIndex]
        !== sequence[currentIndex]
    ) {

        gameOver();

        return;

    }


    /*
        Check if the entire
        sequence was completed.
    */

    if (
        playerSequence.length ===
        sequence.length
    ) {

        // Add score

        score += 100;


        scoreDisplay.textContent =
            score;


        message.textContent =
            "Correct! ✨";


        playerTurn = false;


        /*
            Wait one second before
            starting the next round.
        */

        setTimeout(
            function() {

                nextRound();

            },
            1000
        );

    }

}


// =================================
// GAME OVER
// =================================

function gameOver() {

    gameStarted = false;

    playerTurn = false;


    message.textContent =
        "Game Over! Score: " + score;


    startButton.textContent =
        "PLAY AGAIN";

}


// =================================
// START BUTTON
// =================================

startButton.addEventListener(
    "click",
    startGame
);


// =================================
// PIANO BUTTONS
// =================================

noteButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            handleNoteClick
        );

    }
);
