let song;
let amp;

function preload() {
  song = loadSound("assets/beat.mp3");
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  amp = new p5.Amplitude();


}

function draw() {
  background(220);

  let volume = amp.getLevel();




  console.log(amp.getLevel());
}


function mousePressed() {
  if (song.is.playing() == false) {
    //song.play();
    song.loop();
  } else {
    //song.pause();
    song.stop(); //
  }

}