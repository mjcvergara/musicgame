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
// AUDIO
// ==============================

// Create ONE audio context
// and reuse it for the whole game.

const audioContext = new AudioContext();


// Frequencies for each note

const frequencies = {

    C: 261.63,

    D: 293.66,

    E: 329.63,

    F: 349.23,

    G: 392.00,

    A: 440.00,

    B: 493.88

};


// ==============================
// START GAME
// ==============================

function startGame() {

    // Resume audio after
    // the user clicks START

    if (audioContext.state === "suspended") {

        audioContext.resume();

    }


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


    // Pick random note

    const randomIndex =
        Math.floor(Math.random() * notes.length);


    const randomNote =
        notes[randomIndex];


    // Add note to sequence

    sequence.push(randomNote);


    // Play sequence

    playSequence();
}


// ==============================
// PLAY SEQUENCE
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


    // Player can play after sequence

    setTimeout(function() {

        message.textContent = "Your turn!";

        playerTurn = true;

    }, delay);
}


// ==============================
// PLAY NOTE
// ==============================

function playNote(note) {

    // Find piano button

    const button = document.querySelector(
        `[data-note="${note}"]`
    );


    // Light up button

    button.classList.add("active");


    setTimeout(function() {

        button.classList.remove("active");

    }, 400);


    // Create oscillator

    const oscillator =
        audioContext.createOscillator();


    // Create volume control

    const gainNode =
        audioContext.createGain();


    // Set note frequency

    oscillator.frequency.value =
        frequencies[note];


    // Use a nicer waveform

    oscillator.type = "sine";


    // Connect:

    // oscillator
    //      ↓
    // gain
    //      ↓
    // speakers

    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);


    // Start volume

    gainNode.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );


    // Fade out the sound

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.5
    );


    // Play

    oscillator.start();


    // Stop

    oscillator.stop(
        audioContext.currentTime + 0.5
    );
}


// ==============================
// PLAYER CLICKS NOTE
// ==============================

function handleNoteClick(event) {

    if (!gameStarted || !playerTurn) {

        return;

    }


    // Make sure audio is running

    if (audioContext.state === "suspended") {

        audioContext.resume();

    }


    // Get clicked note

    const clickedNote =
        event.target.dataset.note;


    // Save player's note

    playerSequence.push(clickedNote);


    // Play sound

    playNote(clickedNote);


    // Check answer

    checkAnswer();
}


// ==============================
// CHECK ANSWER
// ==============================

function checkAnswer() {

    const currentIndex =
        playerSequence.length - 1;


    // Wrong note

    if (
        playerSequence[currentIndex]
        !== sequence[currentIndex]
    ) {

        gameOver();

        return;
    }


    // Completed sequence

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
// START BUTTON
// ==============================

startButton.addEventListener(
    "click",
    startGame
);


// ==============================
// PIANO BUTTONS
// ==============================

noteButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        handleNoteClick
    );

});
