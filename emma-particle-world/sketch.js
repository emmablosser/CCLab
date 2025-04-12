// CCLab Mini Project - 9.R Particle World Template

let explosionSide = "left";
let explosionInProgress = false;
let readyForNext = true;
let NUM_OF_PARTICLES_PER_EXPLOSION = 100; // Decide the initial number of particles.
let MAX_OF_PARTICLES = 500;

let particles = [];

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

}

function draw() {
  background(0, 10);

  if (!explosionInProgress && readyForNext) {
    triggerExplosion();
  }

  let allDone = true;
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    p.age();

    if (p.isDone) {
      particles.splice(i, 1);
    } else {
      allDone = false;
    }
  }

  if (explosionInProgress && allDone) {
    if (explosionSide == "left") {
      explosionSide = "right";
    } else {
      explosionSide = "left";
    }

    explosionInProgress = false;
    readyForNext = true;

    if (particles.length > MAX_OF_PARTICLES) {
      particles.splice(0, 1);
    }

  }
}

function triggerExplosion() {
  let startX;
  let direction;

  if (explosionSide == "left") {
    startX = 0;
    direction = 1;
  } else {
    startX = width;
    direction = -1;
  }
  let baseY = random(height);
  for (let i = 0; i < NUM_OF_PARTICLES_PER_EXPLOSION; i++) {
    let startY = baseY + random(-20, 20); // cluster around baseY
    particles.push(new Particle(startX, startY, direction));
  }

  explosionInProgress = true;
  readyForNext = false;
}

class Particle {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.w = random(5, 15);
    this.h = random(3, 10);

    this.r = random(255);
    this.g = random(255);
    this.b = random(255);

    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.1, 0.1);

    let baseSpeed = random(1, 4);
    let wiggle = random(-1, 1);

    if (direction === 1) {
      this.xSpeed = baseSpeed;
    } else {
      this.xSpeed = -baseSpeed;
    }

    this.xSpeed += wiggle;
    this.ySpeed = random(1, 2);

    this.lifespan = 1.0;
    this.lifeReduction = random(0.001, 0.03);
    this.isDone = false;
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.rotation += this.rotationSpeed;
  }

  age() {
    this.lifespan -= this.lifeReduction;

    if (this.lifespan <= 0 || this.y > height) {
      this.isDone = true;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    rectMode(CENTER);
    noStroke();
    fill(this.r, this.g, this.b, this.lifespan * 255);
    rect(0, 0, this.w, this.h);
    pop();
  }
}