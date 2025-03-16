let x, y;
let xSpeed, ySpeed;
let fish1X, fish1Y, fish1SpeedX, fish1SpeedY;
let fish2X, fish2Y, fish2SpeedX, fish2SpeedY;
let fish3X, fish3Y, fish3SpeedX, fish3SpeedY;
let fish4X, fish4Y, fish4SpeedX, fish4SpeedY;
let fish5X, fish5Y, fish5SpeedX, fish5SpeedY;
let fish1Active = true;
let fish2Active = true;
let fish3Active = true;
let fish4Active = true;
let fish5Active = true;
let bubble1X, bubble1Y;
let bubble2X, bubble2Y;
let bubble1Active = false;
let bubble2Active = false;
let bubbleSpeed = 2;

function setup() {
    //createCanvas(800, 500);


    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");

    x = width / 2;
    y = height / 2;
    xSpeed = random(-3, 3);
    ySpeed = random(-2, 2);

    fish1X = random(width);
    fish1Y = random(50, 400);
    fish1SpeedX = random(1, 3);
    fish1SpeedY = random(-1, 1);

    fish2X = random(width);
    fish2Y = random(50, 400);
    fish2SpeedX = random(1, 3);
    fish2SpeedY = random(-1, 1);

    fish3X = random(width);
    fish3Y = random(50, 400);
    fish3SpeedX = random(1, 3);
    fish3SpeedY = random(-1, 1);

    fish4X = random(width);
    fish4Y = random(50, 400);
    fish4SpeedX = -random(1, 3);
    fish4SpeedY = random(-1, 1);

    fish5X = random(width);
    fish5Y = random(50, 400);
    fish5SpeedX = -random(1, 3);
    fish5SpeedY = random(-1, 1);

    bubble1Y = -1;
    bubble2Y = -1;
}

function draw() {
    background(220);

    drawBackground();
    drawBackground();
    drawSeafloor();
    drawCoral();
    drawTallCoral();
    drawFish();
    drawBubbles();

    fill(255);
    text("Click the mouse on the fish to eat", 20, 20);
    text("Press space to exhale bubbles", 20, 40);

    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        for (let i = 10; i >= 0; i--) {
            let x = mouseX + (10 - i) * 20;
            let waveMove = i * 0.5; //wave motion
            let circleSize = map(i, 0, 9, 15, 40);

            drawCreature(x, mouseY, circleSize, waveMove);
        }
        //bounce if mouse not on screen
    } else {
        x += xSpeed;
        y += ySpeed;

        if (x < 25 || x > width - 75) {
            xSpeed *= -1;
        }
        if (y < 25 || y > height - 25) {
            ySpeed *= -1;
        }
        for (let i = 10; i >= 0; i--) {
            let xPos = x + (10 - i) * 20;
            let waveMove = i * 0.5;
            let circleSize = map(i, 0, 9, 15, 40);

            drawCreature(xPos, y, circleSize, waveMove);
        }
    }
}

function drawSeafloor() {
    fill(180, 140, 100);
    noStroke();
    rect(0, height - 80, width, 80); // sea floor

    fill(160, 120, 80);
    for (let i = 0; i < width; i += 50) {
        ellipse(i, height - 60, 40, 20); // sand mounds
    }
}

function drawCoral() {
    fill(200, 50, 80);
    for (let i = 50; i < width; i += 200) {
        beginShape();
        curveVertex(i, height - 60);
        curveVertex(i - 10, height - 100);
        curveVertex(i + 10, height - 120);
        curveVertex(i + 15, height - 100);
        curveVertex(i + 20, height - 80);
        endShape(CLOSE);
    }
}
function drawTallCoral() {
    fill(150, 30, 60);
    for (let i of [30, width - 50]) {
        beginShape();
        curveVertex(i, height - 50);
        curveVertex(i - 30, height - 120);
        curveVertex(i - 10, height - 180);
        curveVertex(i + 5, height - 160);
        curveVertex(i + 15, height - 190);
        curveVertex(i + 25, height - 140);
        curveVertex(i + 35, height - 100);
        endShape(CLOSE);
    }
}

function drawFish() {
    fill(150, 0, 150);

    for (let i = 1; i <= 5; i++) {
        let x, y, speedX, speedY, facingRight;

        if (i === 1) {
            x = fish1X;
            y = fish1Y;
            speedX = fish1SpeedX;
            speedY = fish1SpeedY;
            facingRight = true;
            if (fish1Active) {
                ellipse(x, y, 20, 10);

                let tailX, tailY, tailTop, tailBottom, tailEndX;

                if (facingRight) {
                    tailX = x - 10;
                    tailEndX = x - 18;
                } else {
                    tailX = x + 10;
                    tailEndX = x + 18;
                }

                tailY = y;
                tailTop = y - 5;
                tailBottom = y + 5;

                triangle(tailX, tailTop, tailX, tailBottom, tailEndX, tailY);
            }
            x += speedX;
            y += speedY;

            // bounce fish off vertical edges
            if (y < 50 || y > height - 100) {
                speedY = -speedY;
            }

            // moves off the edge, reset
            if (facingRight && x > width) {
                x = 0;
                y = random(50, 400);
            } else if (facingRight == false && x < 0) {
                x = width;
                y = random(50, 400);
            }

            fish1X = x;
            fish1Y = y;
            fish1SpeedX = speedX;
            fish1SpeedY = speedY;
        } else if (i === 2) {
            x = fish2X;
            y = fish2Y;
            speedX = fish2SpeedX;
            speedY = fish2SpeedY;
            facingRight = true;
            if (fish2Active) {
                ellipse(x, y, 20, 10);

                let tailX, tailY, tailTop, tailBottom, tailEndX;

                if (facingRight) {
                    tailX = x - 10;
                    tailEndX = x - 18;
                } else {
                    tailX = x + 10;
                    tailEndX = x + 18;
                }

                tailY = y;
                tailTop = y - 5;
                tailBottom = y + 5;

                triangle(tailX, tailTop, tailX, tailBottom, tailEndX, tailY);
            }
            x += speedX;
            y += speedY;

            // bounce fish off vertical edges
            if (y < 50 || y > height - 100) {
                speedY = -speedY;
            }

            // moves off the edge, reset
            if (facingRight && x > width) {
                x = 0;
                y = random(50, 400);
            } else if (facingRight == false && x < 0) {
                x = width;
                y = random(50, 400);
            }

            fish2X = x;
            fish2Y = y;
            fish2SpeedX = speedX;
            fish2SpeedY = speedY;
        } else if (i === 3) {
            x = fish3X;
            y = fish3Y;
            speedX = fish3SpeedX;
            speedY = fish3SpeedY;
            facingRight = true;
            if (fish3Active) {
                ellipse(x, y, 20, 10);

                let tailX, tailY, tailTop, tailBottom, tailEndX;

                if (facingRight) {
                    tailX = x - 10;
                    tailEndX = x - 18;
                } else {
                    tailX = x + 10;
                    tailEndX = x + 18;
                }

                tailY = y;
                tailTop = y - 5;
                tailBottom = y + 5;

                triangle(tailX, tailTop, tailX, tailBottom, tailEndX, tailY);
            }
            x += speedX;
            y += speedY;

            // bounce fish off vertical edges
            if (y < 50 || y > height - 100) {
                speedY = -speedY;
            }

            // moves off the edge, reset
            if (facingRight && x > width) {
                x = 0;
                y = random(50, 400);
            } else if (facingRight == false && x < 0) {
                x = width;
                y = random(50, 400);
            }

            fish3X = x;
            fish3Y = y;
            fish3SpeedX = speedX;
            fish3SpeedY = speedY;
        } else if (i == 4) {
            x = fish4X;
            y = fish4Y;
            speedX = fish4SpeedX;
            speedY = fish4SpeedY;
            facingRight = false;
            if (fish4Active) {
                ellipse(x, y, 20, 10);

                let tailX, tailY, tailTop, tailBottom, tailEndX;

                if (facingRight) {
                    tailX = x - 10;
                    tailEndX = x - 18;
                } else {
                    tailX = x + 10;
                    tailEndX = x + 18;
                }

                tailY = y;
                tailTop = y - 5;
                tailBottom = y + 5;

                triangle(tailX, tailTop, tailX, tailBottom, tailEndX, tailY);
            }
            x += speedX;
            y += speedY;

            // bounce fish off vertical edges
            if (y < 50 || y > height - 100) {
                speedY = -speedY;
            }

            // moves off the edge, reset
            if (facingRight && x > width) {
                x = 0;
                y = random(50, 400);
            } else if (facingRight == false && x < 0) {
                x = width;
                y = random(50, 400);
            }

            fish4X = x;
            fish4Y = y;
            fish4SpeedX = speedX;
            fish4SpeedY = speedY;
        } else if (i == 5) {
            x = fish5X;
            y = fish5Y;
            speedX = fish5SpeedX;
            speedY = fish5SpeedY;
            facingRight = false;
            if (fish5Active) {
                ellipse(x, y, 20, 10);

                let tailX, tailY, tailTop, tailBottom, tailEndX;

                if (facingRight) {
                    tailX = x - 10;
                    tailEndX = x - 18;
                } else {
                    tailX = x + 10;
                    tailEndX = x + 18;
                }

                tailY = y;
                tailTop = y - 5;
                tailBottom = y + 5;

                triangle(tailX, tailTop, tailX, tailBottom, tailEndX, tailY);
            }
            x += speedX;
            y += speedY;

            // bounce fish off vertical edges
            if (y < 50 || y > height - 100) {
                speedY = -speedY;
            }

            // moves off the edge, reset
            if (facingRight && x > width) {
                x = 0;
                y = random(50, 400);
            } else if (facingRight == false && x < 0) {
                x = width;
                y = random(50, 400);
            }

            fish5X = x;
            fish5Y = y;
            fish5SpeedX = speedX;
            fish5SpeedY = speedY;
        }
    }
}

function drawBubbles() {
    fill(173, 216, 230, 150);
    noStroke();

    if (bubble1Active) {
        ellipse(bubble1X, bubble1Y, 15, 20);
        ellipse(bubble1X + 15, bubble1Y + 5, 15, 15);
        bubble1Y -= bubbleSpeed;

        if (bubble1Y < 0) {
            bubble1Active = false;
        }
    }

    if (bubble2Active) {
        ellipse(bubble2X, bubble2Y, 20, 20);
        ellipse(bubble2X + 15, bubble2Y + 5, 15, 15);
        bubble2Y -= bubbleSpeed;

        if (bubble2Y < 0) {
            bubble2Active = false;
        }
    }
}

function drawBackground() {
    //background(220);

    let gridSize = 50;
    for (let y = 0; y < height; y += gridSize) {
        for (let x = 0; x < width; x += gridSize) {
            let r = 0;
            let g = 0;
            let b = map(y, 0, 800, 250, 50);

            noStroke();
            fill(r, g, b);
            rect(x, y, 50, 50);
        }

        fill(135, 206, 251, 10);
        for (let x = 0; x < width; x += 6) {
            let sinValue = sin(x * 0.009) * 20;
            let y = height / 2 + 0 + sinValue;
            circle(x, y, 5);
        }
        fill(135, 206, 251, 10);
        for (let x = 0; x < width; x += 6) {
            let sinValue = sin(x * 0.015) * 20;
            let y = 175 + 0 + sinValue;
            circle(x, y, 5);
        }
        fill(135, 206, 251, 10);
        for (let x = 0; x < width; x += 6) {
            let sinValue = sin(x * 0.013) * 20;
            let y = 280 + 0 + sinValue;
            circle(x, y, 5);
        }
        fill(135, 206, 251, 10);
        for (let x = 0; x < width; x += 6) {
            let sinValue = sin(x * 0.008) * 20;
            let y = 350 + 0 + sinValue;
            circle(x, y, 5);
        }
        fill(135, 206, 251, 10);
        for (let x = 0; x < width; x += 6) {
            let sinValue = sin(x * 0.011) * 20;
            let y = 420 + 0 + sinValue;
            circle(x, y, 5);
        }
        fill(135, 206, 251, 10);
        for (let x = 0; x < width; x += 6) {
            let sinValue = sin(x * 0.018) * 20;
            let y = 129 + 0 + sinValue;
            circle(x, y, 5);
        }
        fill(135, 206, 251, 10);
        for (let x = 0; x < width; x += 6) {
            let sinValue = sin(x * 0.007) * 20;
            let y = 75 + 0 + sinValue;
            circle(x, y, 5);
        }
        fill(135, 206, 251, 10);
        for (let x = 0; x < width; x += 6) {
            let sinValue = sin(x * 0.011) * 20;
            let y = 487 + 0 + sinValue;
            circle(x, y, 5);
        }
        fill(135, 206, 251, 10);
        for (let x = 0; x < width; x += 6) {
            let sinValue = sin(x * 0.012) * 20;
            let y = 45 + 0 + sinValue;
            circle(x, y, 5);
        }
    }
}

function drawCreature(x, y, circleSize, waveMove) {
    push();
    translate(x, y);
    let waveSpeed = 0.05;
    let waveAmplitude = 15;
    let yOffset = sin(frameCount * waveSpeed + waveMove) * waveAmplitude; // wavy motion

    let breathe = map(sin(frameCount * 0.03), -1, 1, 1, 1.3); // "breathing"

    let colorSin = sin(frameCount * 0.02);
    let r1 = map(colorSin, -1, 1, 50, 80);
    let g1 = map(colorSin, -1, 1, 150, 255);
    let b1 = map(colorSin, -1, 1, 50, 80);

    fill(r1, g1, b1, 70);
    noStroke();
    circle(0, yOffset, circleSize * breathe);

    let r2 = map(colorSin, -1, 1, 100, 150);
    let g2 = map(colorSin, -1, 1, 255, 255);
    let b2 = map(colorSin, -1, 1, 50, 100);

    fill(r2, g2, b2, 150);
    circle(0, yOffset, circleSize * breathe * 0.7);
    fill(g2, r2, b2, 50);
    circle(0, yOffset, circleSize * breathe * 0.5);
    fill(r2, g2, b2, 150);
    circle(0, yOffset, circleSize * breathe * 0.3);

    stroke(r2, g2, b2, 200);
    noFill();
    circle(0, yOffset, circleSize * breathe);

    pop();
}

function mouseClicked() {
    for (let i = 1; i <= 5; i++) {
        let x, y;

        if (i === 1) {
            x = fish1X;
            y = fish1Y;
        } else if (i === 2) {
            x = fish2X;
            y = fish2Y;
        } else if (i === 3) {
            x = fish3X;
            y = fish3Y;
        } else if (i === 4) {
            x = fish4X;
            y = fish4Y;
        } else if (i === 5) {
            x = fish5X;
            y = fish5Y;
        }

        if (dist(mouseX, mouseY, x, y) < 50) {
            if (i === 1) fish1Active = false;
            else if (i === 2) fish2Active = false;
            else if (i === 3) fish3Active = false;
            else if (i === 4) fish4Active = false;
            else if (i === 5) fish5Active = false;
        }
    }
}

function keyPressed() {
    if (key === " ") {
        if (!bubble1Active) {
            bubble1X = mouseX;
            bubble1Y = mouseY;
            bubble1Active = true;
        } else if (!bubble2Active) {
            bubble2X = mouseX;
            bubble2Y = mouseY;
            bubble2Active = true;
        }
    }
}
