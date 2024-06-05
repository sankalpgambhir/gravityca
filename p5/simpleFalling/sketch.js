
let w;
let columns;
let rows;
let board;
let next;

function mod(n, m) {
  return ((n % m) + m) % m;
}


function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(20);
  createCanvas(720, 400);
  w = 20;
  // Calculate columns and rows
  columns = floor(width / w);
  rows = floor(height / w);
  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  init();
}

function draw() {
  background(255);
  generate();
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      if ((board[i][j] == 1)) fill(0);
      else fill(255);
      stroke(0);
      rect(i * w, j * w, w-1, w-1);
    }
  }

}

// reset board when mouse is pressed
function mousePressed() {
  init();
}

// Fill board randomly
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1) board[i][j] = 0;
      // Filling the rest randomly
      else board[i][j] = floor(random(2));
      next[i][j] = board[i][j];
    }
  }
}

// The process of creating the new generation
function generate() {

  let temp = next
  next = board


  // Loop through every spot in our 2D array and check spots neighbors
  for (let y = rows - 2; y >= 0; y--) {
    for (let x = 0; x < columns; x++) {
      if (y == rows - 1) {
        next[x][y] = board[x][y]
        continue
      }
      let coordsDown = [mod((x), columns), mod((y + 1), rows)]
      let coordsLeft = [mod((x - 1), columns), mod((y + 1), rows)]
      let coordsRight = [mod((x + 1), columns), mod((y + 1), rows)]

      console.log(coordsDown)
      console.log(coordsLeft)
      console.log(coordsRight)
      console.log(board)
      let emptyDown = board[coordsDown[0]][coordsDown[1]] == 0
      let emptyLeft = (board[coordsLeft[0]][coordsLeft[1]] == 0) && (x != 0)
      let emptyRight = (board[coordsRight[0]][coordsRight[1]] == 0) && (x != columns - 1)

      let filled = board[x][y] == 1

      if (filled && emptyDown) {
        next[coordsDown[0]][coordsDown[1]] = 1
        next[x][y] = 0
      } else if (filled && emptyLeft) {
        if (emptyRight) {
          // pick random
          let rand = floor(random(2))
          if (rand == 0) {
            next[coordsLeft[0]][coordsLeft[1]] = 1
          } else {
            next[coordsRight[0]][coordsRight[1]] = 1
          }
          next[x][y] = 0
        }
        else {
          next[coordsLeft[0]][coordsLeft[1]] = 1
          next[x][y] = 0
        }
      } else if (filled && emptyRight) {
        next[coordsRight[0]][coordsRight[1]] = 1
        next[x][y] = 0
      }
      else {
        next[x][y] = board[x][y]
      }
    }
  }

  // Swap!
  board = next;
  next = temp;
}

