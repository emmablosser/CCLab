let steps = [];
let concealerImg;
let moisturizerImg;
let lipstickImg;
let mascaraImg;
let blushImg;
let sound;
let products = [];
let face;

function preload() {
  sound = loadSound("assets/beat.mp3");
  concealerImg = loadImage("assets/concealer.jpeg");
  moisturizerImg = loadImage("assets/moisturizer.jpeg");
  lipstickImg = loadImage("assets/lipstick.png");
  mascaraImg = loadImage("assets/mascara.png");
  blushImg = loadImage("assets/blush.jpeg");
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  face = new FaceCanvas(width / 2, height / 2);

  let spacing = 150;
  products.push(new DraggableProduct(spacing * 0 + 100, height - 100, concealerImg, "Concealer", "Hide all signs of exhaustion."));
  products.push(new DraggableProduct(spacing * 1 + 100, height - 100, moisturizerImg, "Moisturizer", "Seal it in. Even your feelings.", "glow"));
  products.push(new DraggableProduct(spacing * 2 + 100, height - 100, lipstickImg, "Lipstick", "A bold lip for a quiet you."));
  products.push(new DraggableProduct(spacing * 3 + 100, height - 100, mascaraImg, "Mascara", "Cry carefully."));
  products.push(new DraggableProduct(spacing * 4 + 100, height - 100, blushImg, "Blush", "Fake the flush. Pretend it’s joy.", "blush"));


}

function draw() {
  background(245);

  face.display();

  for (let i = 0; i < products.length; i++) {
    products[i].display();
  }
}

function mousePressed() {
  for (let i = 0; i < products.length; i++) {
    products[i].startDrag(mouseX, mouseY);
  }
}

function mouseDragged() {
  for (let i = 0; i < products.length; i++) {
    products[i].drag(mouseX, mouseY);
  }
}

function mouseReleased() {
  for (let i = 0; i < products.length; i++) {
    let p = products[i];
    let dropped = p.stopDrag(face.x, face.y, 100); // Drop radius
    if (dropped) {
      face.applyEffect(p.effect, p.message);
    }
  }
}



class DraggableProduct {
  constructor(x, y, img, label, message, effect) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.label = label;
    this.message = message;
    this.effect = effect; // string like "glow", "blush", etc.

    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.applied = false;
  }

  checkHover(mx, my) {
    return dist(mx, my, this.x, this.y) < 50; // circular bounds
  }

  startDrag(mx, my) {
    if (this.checkHover(mx, my)) {
      this.dragging = true;
      this.offsetX = this.x - mx;
      this.offsetY = this.y - my;
    }
  }

  drag(mx, my) {
    if (this.dragging) {
      this.x = mx + this.offsetX;
      this.y = my + this.offsetY;
    }
  }

  stopDrag(faceX, faceY, faceRadius) {
    if (this.dragging) {
      this.dragging = false;
      if (dist(this.x, this.y, faceX, faceY) < faceRadius) {
        this.applied = true;
        return true;
      }
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
    this.glow = false;
    this.blush = false;
    this.message = "";
    this.showMessage = false;
    this.messageStart = 0;
  }

  applyEffect(effect, message) {
    if (effect === "glow") this.glow = true;
    if (effect === "blush") this.blush = true;
    this.message = message;
    this.showMessage = true;
    this.messageStart = millis();
  }

  display() {
    push();
    translate(this.x, this.y);
    fill(255, 230, 230);
    ellipse(0, 0, 200); // face

    if (this.glow) {
      noFill();
      stroke(255, 220, 150, 100);
      strokeWeight(10);
      ellipse(0, 0, 220);
    }

    if (this.blush) {
      noStroke();
      fill(255, 100, 150, 120);
      ellipse(-50, 20, 40, 20);
      ellipse(50, 20, 40, 20);
    }
    pop();

    // Thought bubble
    if (this.showMessage && millis() - this.messageStart < 3000) {
      this.displayMessage();
    } else if (this.showMessage) {
      this.showMessage = false;
    }
  }

  displayMessage() {
    push();
    fill(255);
    stroke(100);
    strokeWeight(1);
    rect(this.x + 110, this.y - 60, 180, 50, 10);
    noStroke();
    fill(0);
    textSize(12);
    textAlign(LEFT, TOP);
    text(this.message, this.x + 120, this.y - 55, 160);
    pop();
  }
}
