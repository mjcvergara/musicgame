// ==============================
// GAME DATA
// ==============================

const notes = ["C", "D", "E", "F", "G", "A", "B"];


// ==============================
// HTML ELEMENTS
// ==============================

const noteButtons = document.querySelectorAll(".note");

const startButton = document.querySelector("#startButton");

const roundDisplay = document.querySelector("#round");

const scoreDisplay = document.querySelector("#score");

const message = document.querySelector("#message");


// ==============================
// GAME VARIABLES
// ==============================

let sequence = [];

let playerSequence = [];

let round = 0;

let score = 0;

let gameStarted = false;

let playerTurn = false;


// ==============================
// START GAME
// ==============================

function startGame() {

    sequence = [];

    playerSequence = [];

    round = 0;

    score = 0;

    gameStarted = true;

    playerTurn = false;

    roundDisplay.textContent = round;

    scoreDisplay.textContent = score;

    message.textContent = "Get ready...";

    startButton.textContent = "RESTART";

    nextRound();
}


// ==============================
// NEXT ROUND
// ==============================

function nextRound() {

    round++;

    playerSequence = [];

    playerTurn = false;

    roundDisplay.textContent = round;


    // Pick a random note

    const randomIndex =
        Math.floor(Math.random() * notes.length);


    const randomNote =
        notes[randomIndex];


    // Add the note to the sequence

    sequence.push(randomNote);


    // Play the sequence

    playSequence();
}


// ==============================
// PLAY THE WHOLE SEQUENCE
// ==============================

function playSequence() {

    message.textContent = "Listen...";

    playerTurn = false;


    let delay = 0;


    sequence.forEach(function(note) {

        setTimeout(function() {

            playNote(note);

        }, delay);


        delay += 700;

    });


    // Give the player control
    // after the sequence finishes

    setTimeout(function() {

        message.textContent = "Your turn!";

        playerTurn = true;

    }, delay);
}


// ==============================
// PLAY ONE NOTE
// ==============================

function playNote(note) {

    const frequencies = {

        C: 261.63,

        D: 293.66,

        E: 329.63,

        F: 349.23,

        G: 392.00,

        A: 440.00,

        B: 493.88

    };


    // Find the button

    const button = document.querySelector(
        `[data-note="${note}"]`
    );


    // Make the button light up

    button.classList.add("active");


    setTimeout(function() {

        button.classList.remove("active");

    }, 400);


    // Create audio

    const audioContext =
        new AudioContext();


    const oscillator =
        audioContext.createOscillator();


    oscillator.frequency.value =
        frequencies[note];


    oscillator.connect(
        audioContext.destination
    );


    oscillator.start();


    oscillator.stop(
        audioContext.currentTime + 0.4
    );
}


// ==============================
// PLAYER CLICKS A NOTE
// ==============================

function handleNoteClick(event) {

    // Don't allow clicks when
    // it isn't the player's turn

    if (!gameStarted || !playerTurn) {

        return;

    }


    // Get the clicked note

    const clickedNote =
        event.target.dataset.note;


    // Add it to player's sequence

    playerSequence.push(clickedNote);


    // Play the note

    playNote(clickedNote);


    // Check the answer

    checkAnswer();
}


// ==============================
// CHECK PLAYER'S ANSWER
// ==============================

function checkAnswer() {

    const currentIndex =
        playerSequence.length - 1;


    // Check if the latest note
    // is correct

    if (
        playerSequence[currentIndex]
        !== sequence[currentIndex]
    ) {

        gameOver();

        return;

    }


    // Check if the player completed
    // the entire sequence

    if (
        playerSequence.length
        === sequence.length
    ) {

        score += 100;

        scoreDisplay.textContent =
            score;


        message.textContent =
            "Correct! 🎉";


        playerTurn = false;


        // Start the next round

        setTimeout(function() {

            nextRound();

        }, 1000);

    }
}


// ==============================
// GAME OVER
// ==============================

function gameOver() {

    gameStarted = false;

    playerTurn = false;


    message.textContent =
        "Game Over! Score: " + score;


    startButton.textContent =
        "PLAY AGAIN";
}


// ==============================
// START BUTTON EVENT
// ==============================

startButton.addEventListener(
    "click",
    startGame
);


// ==============================
// PIANO BUTTON EVENTS
// ==============================

noteButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        handleNoteClick
    );

});