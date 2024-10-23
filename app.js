let boxes = document.querySelectorAll(".box");
let btn = document.querySelector("#btn");
let newBtn = document.querySelector("#new-btn");
let container = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turn0 = true; // Computer starts first with "O"
let count = 0;
const winPatterns = [
    [0, 1, 2],
    [1, 4, 7],
    [2, 5, 8],
    [3, 4, 5],
    [2, 4, 6],
    [6, 7, 8],
    [0, 4, 8],
    [0, 3, 6],
];
const resetGame = () => {
    turn0 = true;
    count = 0;
    enableBoxes();
    container.classList.add("hide");
    computerMove(); // Start computer move after reset
};

// Function to handle computer's move intelligently
const computerMove = () => {
    if (count === 9 || checkWinner()) return; // Stop if the game is over

    // First, try to find a winning move
    let boxToPlay = findBestMove("O");
    
    // If no winning move, block the opponent from winning
    if (!boxToPlay) {
        boxToPlay = findBestMove("X");
    }
    
    // If no block or winning move, pick a random available box
    if (!boxToPlay) {
        let availableBoxes = Array.from(boxes).filter((box) => box.innerText === "");
        boxToPlay = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
    }

    // Computer plays as "O"
    boxToPlay.innerText = "O";
    boxToPlay.classList.add("o-color");
    boxToPlay.disabled = true;
    turn0 = false; // Turn passes to the human player
    count++;

    let isWinner = checkWinner();
    if (count == 9 && !isWinner) {
        gameDraw();
    }
};

// Human player makes a move by clicking on the boxes
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (!turn0 && box.innerText === "") {
            // Human plays as "X"
            box.innerText = "X";
            box.classList.add("x-color");
            box.disabled = true;
            turn0 = true; // Turn passes to the computer
            count++;

            let isWinner = checkWinner();
            if (count == 9 && !isWinner) {
                gameDraw();
            } else if (!isWinner) {
                setTimeout(computerMove, 500); // Computer move after a short delay
            }
        }
    });
});

const gameDraw = () => {
    msg.innerText = "Game was a draw";
    container.classList.remove("hide");
    disableBoxes();
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("o-color", "x-color");
    }
};

const showWinner = (winner) => {
    msg.innerText = `Congratulations, ${winner} you won!`;
    container.classList.remove("hide");
    disableBoxes();
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if (pos1val !== "" && pos2val !== "" && pos3val !== "") {
            if (pos1val === pos2val && pos2val === pos3val) {
                showWinner(pos1val);
                return true;
            }
        }
    }
    return false;
};

// Function to find the best move for either winning or blocking
const findBestMove = (player) => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        let pos1val = boxes[a].innerText;
        let pos2val = boxes[b].innerText;
        let pos3val = boxes[c].innerText;

        // Check if two positions are occupied by the same player and the third is empty
        if (pos1val === player && pos2val === player && boxes[c].innerText === "") return boxes[c];
        if (pos1val === player && pos3val === player && boxes[b].innerText === "") return boxes[b];
        if (pos2val === player && pos3val === player && boxes[a].innerText === "") return boxes[a];
    }
    return null; // No immediate win or block found
};

newBtn.addEventListener("click", resetGame);
btn.addEventListener("click", resetGame);

// Start the game with the first computer move
computerMove();
