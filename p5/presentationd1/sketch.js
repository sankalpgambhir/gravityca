
let w;
let columns;
let rows;
let board;
let next;

let gfxBoard;
let gfxBoids;

let boids;
let sandMass = 1.0
let G = 100.0

let forcedRegenerate = false
let numSteps = 1

let drawBoids = false

function mod(n, m) {
  return ((n % m) + m) % m;
}

let nextID = 0


function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(1);
  createCanvas(400, 800);

  gfxBoard = createGraphics(width, height / 2)
  gfxBoids = createGraphics(width, height / 2)

  w = 10;
  // Calculate columns and rows
  columns = floor(width / w);
  rows = floor(height / (2 * w));
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
  gfxBoard.background(255);
  gfxBoids.background(255);
  // generate();
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      if ((board[i][j] == 1)) gfxBoard.fill(0);
      else gfxBoard.fill(255);
      gfxBoard.stroke(0);
      gfxBoard.rect(i * w, j * w, w-1, w-1);
    }
  }

  if (drawBoids) {
    boids.boids.forEach(boid => {
      gfxBoids.fill(0)
      if (boid.id == 1) {
        gfxBoids.fill(255, 0, 0)
      }
      gfxBoids.stroke(0)
      gfxBoids.circle(boid.pos.x, boid.pos.y, 10)
      gfxBoids.line(boid.pos.x, boid.pos.y, boid.pos.x + boid.vel.x, boid.pos.y + boid.vel.y)
    })
  }

  // draw the individual buffers to the screen
  image(gfxBoard, 0, 0)
  image(gfxBoids, 0, height / 2)

  // draw detail box bottom-right
  fill(255)
  rect(width - 100, height - 60, 100, 60)
  fill(0)
  text("numSteps: " + numSteps, width - 90, height - 42)
  text("regen: " + forcedRegenerate, width - 90, height - 22)
  // fps
  text("fps: " + frameRate().toFixed(2), width - 90, height - 2)

  save(gfxBoard, "gfxBoard" + frameCount + ".png")

}

// reset board when mouse is pressed
function mousePressed() {
  init();
}

// change params
function keyPressed() {
  // change regen
  if (key === 'r') {
    forcedRegenerate = !forcedRegenerate
  }
  // change numSteps
  if (keyCode === UP_ARROW) {
    numSteps++
  }
  if (keyCode === DOWN_ARROW) {
    numSteps--
  }
  if (numSteps < 1) {
    numSteps = 1
  }

  // change drawBoids
  if (key === 'b') {
    drawBoids = !drawBoids
  }
}

// Fill board randomly
function init() {

  boids = new Boids();

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1) board[i][j] = 0;
      // Filling the rest randomly
      else board[i][j] = floor(random(100)) > 85 ? 1 : 0;
      next[i][j] = board[i][j];
    }
  }

  regenerateBoids()
}

// The process of creating the new generation
function generate() {

  if (forcedRegenerate) {
    regenerateBoids()
  }

  // simulate boids
  for (let i = 0; i < numSteps; i++) {
    boids.step()
  }

  // render boids onto board
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j] = 0
    }
  }
  boids.boids.forEach(boid => {
    let i = Math.floor(boid.pos.x / w)
    let j = Math.floor(boid.pos.y / w)
    // find closest unoccupied cell
    while (board[i][j] == 1) {
      // randomly choose a direction to move
      let direction = Math.floor(random(2))
      if (direction == 0) {
        i = mod(i + 1, columns)
      } else {
        j = mod(j + 1, rows)
      }
    }
    board[i][j] = 1
  })

}

function regenerateBoids() {
  boids.boids.splice(0, boids.boids.length) // stupid clear

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] == 1) {
        let newPos = new Victor(i * w, j * w)
        let newBoid = new Boid(newPos, new Victor(0, 0), sandMass, nextID++)
        boids.boids.push(newBoid)
      }
    }
  }
}

class Boid {
  constructor(ipos, ivel, imass, id) {
    this.pos = ipos
    this.vel = ivel
    this.mass = imass
    this.id = id
  }
}

class Boids {

  boids = [];

  constructor() {
    this.boids = []
    this.timeScale = 1
  }

  step() {
    this.boids.forEach(boid => this.stepBoid(boid));
  }

  stepBoid(boid) {
    let force = this.gravitationalForce(boid)
    let accel = force.divide(new Victor(boid.mass, boid.mass))
    boid.vel.add(accel)
    boid.pos.add(boid.vel.clone().multiply(new Victor(this.timeScale, this.timeScale)))
    boid.pos.x = mod(boid.pos.x, width)
    boid.pos.y = mod(boid.pos.y, height / 2)
  }

  gravitationalForce(target) {
    let at = target.pos
    let force = new Victor(0, 0)
    this.boids.forEach(boid => {
      let d = boid.pos.distance(at)
      let direction = boid.pos.clone().subtract(at).normalize()
      if (d > 15) {
        let f = G * boid.mass * target.mass / (d * d)
        let newForce = direction.multiply(new Victor(f, f))
        force.add(newForce)
      }
      if (d > 1) {
        // slow a bit
        let speed = target.vel.magnitude() 
        let friction = speed * speed * target.mass
        let factor = -0.01 / (d * d * d * d)
        let repulsionForce = direction.multiply(new Victor(factor * friction, factor * friction))
        force.add(repulsionForce)
      }
    })
    // general friction
    let friction = target.vel.clone().multiply(new Victor(-0.2, -0.2))
    force.add(friction)
    if (target.id == 1) {
      console.log("Boid1:", "pos", target.pos, "force", force)
    }
    return force
  }
}

