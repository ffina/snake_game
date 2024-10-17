const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set up the canvas size
canvas.width = 400;
canvas.height = 400;

const box = 20; // Size of each square
let snake, food, direction, score, game;
let highScore = localStorage.getItem("highScore") || 0;

// Start the Game
function startGame() {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "flex";
    restartGame();
}

// Restart the Game
function restartGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = undefined;
    score = 0;
    food = generateFood();
    document.getElementById("gameOverScreen").style.display = "none";
    game = setInterval(draw, 100);
}

// Generate Random Food
function generateFood() {
    return {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
}

// Control the snake
document.addEventListener("keydown", setDirection);
function setDirection(event) {
    if (event.keyCode == 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode == 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (event.keyCode == 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode == 40 && direction !== "UP") {
        direction = "DOWN";
    }
}

// Check if snake collides with the wall or itself
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Draw everything on the canvas
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        // ctx.fillStyle = (i === 0) ? "blue" : "lightblue";
        // ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "white";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        if (i === 0) {
            ctx.fillStyle = "#5AB2FF";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        } else {
            // Warna pelangi untuk ekor
            // const rainbowColors = ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#D5BAFF", "#FFC8DD"];
            const rainbowColors = ["#A0DEFF", "#CAF4FF", "lightblue"];
            ctx.fillStyle = rainbowColors[i % rainbowColors.length];
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }
    }

    // Draw the food
    ctx.font = `${box}px Arial`; // Atur ukuran font agar sesuai dengan kotak
    ctx.textAlign = "center"; // Agar emoji berada di tengah kotak
    ctx.textBaseline = "middle"; // Vertikal di tengah kotak
    ctx.fillText("🍎", food.x + box / 2, food.y + box / 2); // Gambar emoji


    // Snake's new position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Direction control
    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Check if snake eats the food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = generateFood();
    } else {
        snake.pop(); // Remove the tail
    }

    // Add new head
    let newHead = { x: snakeX, y: snakeY };

    // Game over if snake hits the wall or itself
    if (
        snakeX < 0 || snakeX >= canvas.width ||
        snakeY < 0 || snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        gameOver();
        return;
    }

    snake.unshift(newHead); // Add the new head to the snake
    updateScore();
}

function updateScore() {
    document.getElementById("scoreText").innerText = score;
    document.getElementById("highScoreText").innerText = highScore;
}

function gameOver() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    document.getElementById("finalScore").innerText = score;
    document.getElementById("highScore").innerText = highScore;
    document.getElementById("gameOverScreen").style.display = "flex";
}

// // Call the draw function every 100 milliseconds
// game = setInterval(draw, 100);
