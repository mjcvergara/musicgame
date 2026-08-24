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

// We don't create the AudioContext
// until the player presses START.

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

    // Create audio after
    // the user taps START.

    if (!audioContext) {

        audioContext =
            new AudioContext();

    }


    // Resume audio if necessary.

    if (
        audioContext.state
        === "suspended"
    ) {

        audioContext.resume();

    }


    // Reset game.

    sequence = [];

    playerSequence = [];

    round = 0;

    score = 0;

    gameStarted = true;

    playerTurn = false;


    roundDisplay.textContent =
        round;

    scoreDisplay.textContent =
        score;


    startButton.textContent =
        "RESTART";


    message.textContent =
        "Get ready...";


    nextRound();

}


// =================================
// NEXT ROUND
// =================================

function nextRound() {

    round++;

    playerSequence = [];

    playerTurn = false;


    roundDisplay.textContent =
        round;


    // Pick random note.

    const randomIndex =
        Math.floor(
            Math.random()
            * notes.length
        );


    const randomNote =
        notes[randomIndex];


    // Add note.

    sequence.push(
        randomNote
    );


    // Play sequence.

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


    // Player's turn.

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

    if (!audioContext) {

        return;

    }


    // Find piano key.

    const button =
        document.querySelector(
            `[data-note="${note}"]`
        );


    // Light up key.

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


    // Create oscillator.

    const oscillator =
        audioContext.createOscillator();


    // Volume control.

    const gainNode =
        audioContext.createGain();


    // Set note.

    oscillator.frequency.value =
        frequencies[note];


    // Piano-like waveform.

    oscillator.type =
        "triangle";


    // Connect audio.

    oscillator.connect(
        gainNode
    );

    gainNode.connect(
        audioContext.destination
    );


    // Volume.

    gainNode.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );


    // Fade out.

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.6
    );


    // Start.

    oscillator.start();


    // Stop.

    oscillator.stop(
        audioContext.currentTime + 0.6
    );

}


// =================================
// PLAYER PRESSES NOTE
// =================================

function handleNoteClick(event) {

    // Ignore if game isn't ready.

    if (
        !gameStarted
        || !playerTurn
    ) {

        return;

    }


    // Make sure audio is active.

    if (
        audioContext.state
        === "suspended"
    ) {

        audioContext.resume();

    }


    // Get clicked note.

    const clickedNote =
        event.currentTarget.dataset.note;


    // Save player's note.

    playerSequence.push(
        clickedNote
    );


    // Play note.

    playNote(
        clickedNote
    );


    // Check answer.

    checkAnswer();

}


// =================================
// CHECK ANSWER
// =================================

function checkAnswer() {

    const currentIndex =
        playerSequence.length - 1;


    // Wrong note.

    if (
        playerSequence[currentIndex]
        !== sequence[currentIndex]
    ) {

        gameOver();

        return;

    }


    // Entire sequence completed.

    if (
        playerSequence.length
        === sequence.length
    ) {

        score += 100;


        scoreDisplay.textContent =
            score;


        message.textContent =
            "Correct! ✨";


        playerTurn = false;


        // Next round.

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
        "Game Over! Score: "
        + score;


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
