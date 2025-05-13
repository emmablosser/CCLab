let cam;
let products = [];
let appliedProducts = 0;
let exposureBoost = 1.0;
let targetExposure = 1.0;
let face;
let mirrorRadius = 250;
let shimmerParticles = [];

let faceapi;
let detections;

// by default all options are set to true
const detectionOptions = {
  withLandmarks: true,
  withDescriptors: false,
};

let concealerImg, moisturizerImg, lipstickImg, mascaraImg, blushImg;

function preload() {
  concealerImg = loadImage("assets/concealer-edited.png");
  moisturizerImg = loadImage("assets/moisturizer-edited.png");
  lipstickImg = loadImage("assets/lipstick-edited.png");
  mascaraImg = loadImage("assets/mascara-edited.png");
  blushImg = loadImage("assets/blush-edited.png");
}

function setup() {
  let canvas = createCanvas(1000, 700);
  canvas.parent("p5-canvas-container");


  cam = createCapture(VIDEO);
  cam.size(800, 600);
  cam.hide();

  faceapi = ml5.faceApi(cam, detectionOptions, modelReady);

  face = new FaceCanvas(width / 2, height / 2);

  let spacing = 150;
  let startY = height - 58;
  products.push(new DraggableProduct(spacing * 0 + 180, startY, concealerImg, "Concealer", "Hide all signs of exhaustion."));
  products.push(new DraggableProduct(spacing * 1 + 180, startY, moisturizerImg, "Moisturizer", "Seal it in. Even your feelings."));
  products.push(new DraggableProduct(spacing * 2 + 180, startY, lipstickImg, "Lipstick", "A bold lip for a quiet you."));
  products.push(new DraggableProduct(spacing * 3 + 180, startY, mascaraImg, "Mascara", "Cry carefully."));
  products.push(new DraggableProduct(spacing * 4 + 180, startY, blushImg, "Blush", "Fake the flush. Pretend it’s joy."));

  for (let i = 0; i < 50; i++) {
    shimmerParticles.push(new ShimmerParticle());
  }

}

function draw() {
  background(255, 228, 240);

  for (let sp of shimmerParticles) {
    sp.update();
    sp.display();
  }
  if (cam.pixels.length > 0) {
    cam.loadPixels();
  }
  cam.loadPixels();

  exposureBoost = lerp(exposureBoost, targetExposure, 0.05);

  mirrorRadius = 250;
  let pixelRadius;
  let gridSize;

  //adujusting the pixels, hidden within the mirror frame
  if (appliedProducts === 0) {
    gridSize = 20;
    pixelRadius = mirrorRadius + 15;
  } else if (appliedProducts === 1) {
    gridSize = 17;
    pixelRadius = mirrorRadius + 10;
  } else if (appliedProducts === 2) {
    gridSize = 12;
    pixelRadius = mirrorRadius + 5;
  } else if (appliedProducts === 3) {
    gridSize = 9;
    pixelRadius = mirrorRadius + 2;
  } else {
    gridSize = 5;
    pixelRadius = mirrorRadius;
  }

  //webcam within the mirror
  push();
  translate(width / 2, 300);
  for (let y = -pixelRadius; y < pixelRadius; y += gridSize) {
    for (let x = -pixelRadius; x < pixelRadius; x += gridSize) {
      let centerDist = dist(x + gridSize / 2, y + gridSize / 2, 0, 0);
      if (centerDist < pixelRadius - gridSize / 2) {
        let camX = constrain(width - (x + width / 2), 0, cam.width - 1); //flipped camera
        let camY = constrain(y + height / 2, 0, cam.height - 1);
        let index = (int(camX) + int(camY) * cam.width) * 4;
        let r = cam.pixels[index + 0] * exposureBoost;
        let g = cam.pixels[index + 1] * exposureBoost;
        let b = cam.pixels[index + 2] * exposureBoost;

        if (moisturizerApplied) {
          b += 30;
        }
        if (blushApplied) {
          r += 40;
        }
        fill(r, g, b);
        noStroke();
        ellipseMode(CORNER);
        circle(x, y, gridSize * 1.5, gridSize * 1.5);
      }
    }
  }
  pop();


  if (detections) {
    if (detections.length > 0) {
      drawLandmarks(detections);
    }
  }

  //mirror radius
  push();
  translate(width / 2, 300);

  // circle outer ring
  let numCircles = 60;
  let circleRadius = mirrorRadius + 32;
  let circleSize = 15;
  fill(220, 190, 220);
  noStroke();

  for (let i = 0; i < numCircles; i++) {
    let angle = map(i, 0, numCircles, 0, TWO_PI);
    let x = cos(angle) * circleRadius;
    let y = sin(angle) * circleRadius;
    ellipse(x, y, circleSize, circleSize);
  }

  // gold frame
  noFill();
  stroke(255, 215, 100);
  strokeWeight(38);
  ellipse(0, 0, mirrorRadius * 2 + 10);

  stroke(255, 255, 255, 80);
  strokeWeight(8);
  ellipse(0, 0, mirrorRadius * 2);

  pop();


  // message bubble
  face.display();

  // product bay
  let bayWidth = width - 120;
  let bayHeight = 95;
  let bayX = width / 2 - bayWidth / 2;
  let bayY = height - 110;

  push();
  rectMode(CORNER);
  noStroke();
  fill(120, 80, 130, 100);
  rect(bayX + 5, bayY + 8, bayWidth, bayHeight, 25);

  fill(185, 150, 180);
  rect(bayX, bayY, bayWidth, bayHeight, 25);

  // products
  for (let p of products) {
    p.display();
  }
}

//mouse movements
function mousePressed() {
  for (let p of products) {
    p.startDrag(mouseX, mouseY);
  }
}

function mouseDragged() {
  for (let p of products) {
    p.drag(mouseX, mouseY);
  }
}

let lipstickApplied = false;
let mascaraApplied = false;
let moisturizerApplied = false;
let concealerApplied = false;
let blushApplied = false;

function mouseReleased() {
  for (let p of products) {
    let dropped = p.stopDrag(width / 2, 300, mirrorRadius);
    if (dropped && !p.applied) {
      face.showMessage(p.message);
      appliedProducts++;
      targetExposure += 0.4;
      p.applied = true;
      console.log(p.label);

      if (p.label == "Lipstick") {
        lipstickApplied = true;
      }
      if (p.label == "Mascara") {
        mascaraApplied = true;
      }
      if (p.label == "Moisturizer") {
        moisturizerApplied = true;
      }
      if (p.label == "Concealer") {
        concealerApplied = true;
      }
      if (p.label == "Blush") {
        blushApplied = true;
      }
    }
  }
}

function modelReady() {
  console.log("FaceAPI is ready!");
  faceapi.detect(gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.log(error);
    return;
  }
  // console.log(result)
  detections = results;

  // repeat the detection
  faceapi.detect(gotResults);
}

function drawBox(detections) {
  for (let i = 0; i < detections.length; i += 1) {
    const alignedRect = detections[i].alignedRect;
    const x = alignedRect._box._x;
    const y = alignedRect._box._y;
    const boxWidth = alignedRect._box._width;
    const boxHeight = alignedRect._box._height;

    noFill();
    stroke(161, 95, 251);
    strokeWeight(2);
    rect(x, y, boxWidth, boxHeight);
  }
}

function drawLandmarks(detections) {
  push();
  translate(0, 300 - height / 2);
  noFill();
  stroke(161, 95, 251);
  strokeWeight(2);

  for (let i = 0; i < detections.length; i += 1) {
    const mouth = detections[i].parts.mouth;
    const nose = detections[i].parts.nose;
    const leftEye = detections[i].parts.leftEye;
    const rightEye = detections[i].parts.rightEye;
    const rightEyeBrow = detections[i].parts.rightEyeBrow;
    const leftEyeBrow = detections[i].parts.leftEyeBrow;

    if (lipstickApplied) {
      fill(255, 0, 0, 80);
      noStroke();
      drawPart(mouth, true);
    }

    if (mascaraApplied) {
      noFill();
      stroke(0, 0, 0, 80);
      strokeWeight(2);
      drawPart(leftEye, true);
      drawPart(rightEye, true);

      fill(0, 0, 0, 30);
      noStroke();
      drawPart(leftEyeBrow, true);
      drawPart(rightEyeBrow, true);
    }

    if (concealerApplied) {
      fill(0, 0, 0, 30);
      noStroke();
      drawPart(nose, true);
    }


    // noFill();
    // stroke(161, 95, 251);
    // strokeWeight(2);
    // drawPart(nose, false);

    // noFill();
    // stroke(161, 95, 251);
    // strokeWeight(2);
    // drawPart(leftEye, true);

    // noFill();
    // stroke(161, 95, 251);
    // strokeWeight(2);
    // drawPart(leftEyeBrow, false);

    // noFill();
    // stroke(161, 95, 251);
    // strokeWeight(2);
    // drawPart(rightEye, true);

    // noFill();
    // stroke(161, 95, 251);
    // strokeWeight(2);
    // drawPart(rightEyeBrow, false);

    pop();
  }
}

function drawPart(feature, closed) {
  beginShape();
  for (let i = 0; i < feature.length; i += 1) {
    let x = width - feature[i]._x;
    let y = feature[i]._y;
    vertex(x, y);
  }

  if (closed === true) {
    endShape(CLOSE);
  } else {
    endShape();
  }
}

class DraggableProduct {
  constructor(x, y, img, label, message) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.img = img;
    this.label = label;
    this.message = message;

    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.applied = false;
  }

  checkHover(mouseX, mouseY) {
    return dist(mouseX, mouseY, this.x, this.y) < 50;
  }

  startDrag(mouseX, mouseY) {
    if (this.checkHover(mouseX, mouseY)) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  drag(mouseX, mouseY) {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  stopDrag(targetX, targetY, targetRadius) {
    if (this.dragging) {
      if (dist(this.x, this.y, targetX, targetY) < targetRadius) {
        this.dragging = false;
        return true;
      }
      this.dragging = false;
    }
    return false;
  }

  display() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, 80, 80);

    if (this.applied && !this.dragging) {
      this.x = lerp(this.x, this.originalX, 0.03);
      this.y = lerp(this.y, this.originalY, 0.03);
    }
  }
}

class FaceCanvas {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.message = "";
    this.showing = false;
    this.messageTimer = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.msgX = this.x;
    this.msgY = this.y;

  }

  showMessage(msg) {
    this.message = msg;
    this.showing = true;
    this.messageTimer = millis();


    let angle = random(PI, TWO_PI);
    let radius = mirrorRadius + 35;

    this.msgX = this.x + cos(angle) * radius;
    this.msgY = this.y + sin(angle) * radius;
  }



  display() {
    if (this.showing) {
      if (millis() - this.messageTimer < 3000) {
        push();
        fill(255);
        stroke(100);
        strokeWeight(1);
        rect(this.msgX, this.msgY, 180, 50, 10);
        noStroke();
        fill(0);
        textSize(12);
        textAlign(LEFT, TOP);
        text(this.message, this.msgX + 10, this.msgY + 5, 160);
        pop();
      } else {
        this.showing = false;
      }
    }
  }
}

class ShimmerParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(8, 15);
    this.glow = random(80, 170);
    this.speed = random(0.2, 0.6);
    this.drift = random(-0.3, 0.3);
  }

  update() {
    this.y -= this.speed;
    this.x += this.drift;

    // reset
    if (this.y < -10 || this.x < -10 || this.x > width + 10) {
      this.reset();
      this.y = height + 10;
    }
  }

  display() {
    noStroke();
    fill(255, this.glow);
    circle(this.x, this.y, this.size);
  }
}

//reset
function keyPressed() {
  if (key === 'b') {
    appliedProducts = 0;
    exposureBoost = 1.0;
    targetExposure = 1.0;

    for (let p of products) {
      p.applied = false;
    }

    lipstickApplied = false;
    mascaraApplied = false;
    moisturizerApplied = false;
    concealerApplied = false;
    blushApplied = false;
  }
}

