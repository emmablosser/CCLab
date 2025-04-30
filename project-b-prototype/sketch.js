let cam;
let products = [];
let appliedProducts = 0;
let exposureBoost = 1.0;
let targetExposure = 1.0;
let face;
let mirrorRadius = 150;

let concealerImg, moisturizerImg, lipstickImg, mascaraImg, blushImg;

function preload() {
  concealerImg = loadImage("assets/concealer.jpeg");
  moisturizerImg = loadImage("assets/moisturizer.jpeg");
  lipstickImg = loadImage("assets/lipstick.png");
  mascaraImg = loadImage("assets/mascara.png");
  blushImg = loadImage("assets/blush.jpeg");
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");


  cam = createCapture(VIDEO);
  cam.size(800, 600);
  cam.hide();

  face = new FaceCanvas(width / 2, height / 2);

  let spacing = 140;
  let startY = height - 80;
  products.push(new DraggableProduct(spacing * 0 + 80, startY, concealerImg, "Concealer", "Hide all signs of exhaustion."));
  products.push(new DraggableProduct(spacing * 1 + 80, startY, moisturizerImg, "Moisturizer", "Seal it in. Even your feelings."));
  products.push(new DraggableProduct(spacing * 2 + 80, startY, lipstickImg, "Lipstick", "A bold lip for a quiet you."));
  products.push(new DraggableProduct(spacing * 3 + 80, startY, mascaraImg, "Mascara", "Cry carefully."));
  products.push(new DraggableProduct(spacing * 4 + 80, startY, blushImg, "Blush", "Fake the flush. Pretend it’s joy."));
}

function draw() {
  background(245);

  cam.loadPixels();

  let gridSize;
  let targetExposure;

  if (appliedProducts == 0) {
    gridSize = 18;
    targetExposure = 1.0;
  } else if (appliedProducts == 1) {
    gridSize = 15;
    targetExposure = 1.2;
  } else if (appliedProducts == 2) {
    gridSize = 12;
    targetExposure = 1.5;
  } else if (appliedProducts == 3) {
    gridSize = 7;
    targetExposure = 2.0;
  } else if (appliedProducts == 4) {
    gridSize = 5;
    targetExposure = 2.0;
  } else {
    gridSize = 3;
    targetExposure = 2.5;
  }

  exposureBoost = lerp(exposureBoost, targetExposure, 0.05);

  // mirror
  push();
  translate(width / 2, height / 2);
  stroke(180);
  strokeWeight(5);
  noFill();
  ellipse(0, 0, mirrorRadius * 2, mirrorRadius * 2);
  pop();

  // webcam inside the mirror
  push();
  translate(width / 2, height / 2);
  for (let y = -mirrorRadius; y < mirrorRadius; y += gridSize) {
    for (let x = -mirrorRadius; x < mirrorRadius; x += gridSize) {
      if (dist(x, y, 0, 0) < mirrorRadius) {
        let cx = constrain(x + width / 2, 0, cam.width - 1);
        let cy = constrain(y + height / 2, 0, cam.height - 1);
        let index = (cx + cy * cam.width) * 4;
        let r = cam.pixels[index + 0] * exposureBoost;
        let g = cam.pixels[index + 1] * exposureBoost;
        let b = cam.pixels[index + 2] * exposureBoost;
        fill(r, g, b);
        noStroke();
        rect(x, y, gridSize, gridSize);
      }
    }
  }
  pop();


  face.display();

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

function mouseReleased() {
  for (let p of products) {
    let dropped = p.stopDrag(width / 2, height / 2, mirrorRadius);
    if (dropped && !p.applied) {
      face.showMessage(p.message);
      appliedProducts++;
      targetExposure += 0.4;
      p.applied = true;
    }
  }
}


class DraggableProduct {
  constructor(x, y, img, label, message) {
    this.x = x;
    this.y = y;
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
  }
}

class FaceCanvas {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.message = "";
    this.showing = false;
    this.messageTimer = 0;
  }

  showMessage(msg) {
    this.message = msg;
    this.showing = true;
    this.messageTimer = millis();
  }

  display() {
    if (this.showing) {
      if (millis() - this.messageTimer < 3000) {
        push();
        fill(255);
        stroke(100);
        strokeWeight(1);
        rect(this.x + 100, this.y - 120, 180, 50, 10);
        noStroke();
        fill(0);
        textSize(12);
        textAlign(LEFT, TOP);
        text(this.message, this.x + 110, this.y - 115, 160);
        pop();
      } else {
        this.showing = false;
      }
    }
  }
}
