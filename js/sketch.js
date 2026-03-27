let bgImg, fgImg, flaresImg;
let GlobeAnim, BubblesAnim;
let csfMain, csfBot;
let eyeOneIdle = [];
let eyeOneClick = [];
let eyeTwoIdle = [];
let eyeTwoClick = [];
let roseFrames = [];
let prophecyFont, subtitleFont, marqueeFont;
let marqueeX;
let emojiFont;
let eyeOneState = "idle";
let eyeTwoState = "idle";
let eyeSounds = [];

//Affirmations / prophecies datubāze :D
let fortunes = [
  { big: "A surprise is waiting", second: ":)", small: "We do not guarantee a positive surpise" },
  { big: "Your mind will become", second: "electric!", small: "Your energy will you closer to something" },
  { big: "The glass pipe opens", second: "Like the court", small: "You are not loyal to anybody, You're a demon" },
  { big: "You will shine in chrome", second: "What?", small: "You are becoming your own reflection (?)" },
   { big: "What is that smell", second: "???", small: "No, for real, what is that sour smell, do you smell it too?" },
    { big: "You will do what you want", second: "without any regrets", small: "Break free, get inspired, your mind is a lethal weapon" },
     { big: "Cutting, grassing", second: "Legend smoking rope", small: "Any damage done during the 'smoking' act is entirely on you buddy" },
      { big: "The darkness suddenly", second: "awakens the sleeping", small: "You will download VTMB again" },
      { big: "Have you seen my vape?", second: "Can you stand up?", small: "No, but what did you put in your pocket just now?" },
  { big: "Locked in, flourishing", second: "yuh?", small: "Damn is😂🎉" },
  { big: "Your lucky numbers are:", second: "3, 5, 13, 33, 42, 68", small: "Your lucky numbers are: 3, 5, 13, 33, 42, 68" },
  { big: "Someone hides a secret", second: "but you won't care", small: "Howlite meditation can help you through these complex transformations" },
  { big: "Great fortune awaits", second: "those who are brave", small: "You should sell the next time Nvidia stock drops to 180.23$" }
  //Never understood why scorpio is a water sign, we're they stupid?

];

let currentFortune = 0;
let showFortune = false;
let textChangeTimer = 0;
let textChangeInterval = 4;

let roseFrame = 0;
let eyeOneFrame = 0;
let eyeTwoFrame = 0;
let eyeOneX = 0;
let eyeTwoX = 500;

let baseW = 1920;
let baseH = 1080;

let song;
let audioStarted = false; 

let textStarted = false; 

function preload() {
  GlobeAnim = createVideo('assets/Anim/Globe.webm');
  GlobeAnim.hide();
  BubblesAnim = createVideo('assets/Anim/Bubbles.webm');
  BubblesAnim.hide();
  bgImg = loadImage('assets/Images/Background.png');
  fgImg = loadImage('assets/Images/Foreground.png');
  flaresImg = loadImage('assets/Images/LensFlares.png');
  csfMain = loadImage('assets/CSF_Main.png');
  csfBot = loadImage('assets/CSF_White.png');
  eyeSounds.push(loadSound('assets/Mp3/Hurt_001.wav'));
  eyeSounds.push(loadSound('assets/Mp3/Hurt_002.wav'));
  eyeSounds.push(loadSound('assets/Mp3/Hurt_003.wav'));
  eyeSounds.push(loadSound('assets/Mp3/Hurt_004.wav'));
  eyeSounds.push(loadSound('assets/Mp3/Hurt_005.wav'));

  song = loadSound('assets/Mp3/Ocean.mp3');


 for (let i = 1; i <= 228; i++) {
    let num = nf(i, 3);
    eyeOneIdle.push(loadImage(`assets/Cloud1Comp/Eye_One_${num}.png`));
  }

   for (let i = 1; i <= 112; i++) {
    let num = nf(i, 4);
    eyeOneClick.push(loadImage(`assets/EyeOneBlink/Eye_One_Blink_${num}.png`));
  }

  for (let i = 1; i <= 297; i++) {
    let num = nf(i, 4);
    eyeTwoIdle.push(loadImage(`assets/Cloud2Comp/Eye_Two_${num}.png`));
  }

   for (let i = 1; i <= 76; i++) {
    let num = nf(i, 4);
    eyeTwoClick.push(loadImage(`assets/EyeTwoBlink/Eye_Two_Blink_${num}.png`));
  }


  for (let i = 1; i <= 126; i++) {
    let num = nf(i, 3);
    roseFrames.push(loadImage(`assets/RoseComp/Rose_${num}.png`));
  }

  prophecyFont = loadFont('assets/Fonts/Octuple.ttf');
  subtitleFont = loadFont('assets/Fonts/LT.otf');
  marqueeFont = loadFont('assets/Fonts/Yahei.ttf');
  emojiFont = loadFont('assets/Fonts/Segu.ttf');
}

function setup() {
  let cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.position(0, 0); 
  cnv.style('display', 'block'); // remove inline gaps
  textAlign(CENTER, CENTER);
  marqueeX = width / 2;

  GlobeAnim.loop();
  BubblesAnim.loop();

    noScroll();
}

function noScroll() {
  document.body.style.overflow = "hidden";
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}



function draw() {
  background(0);
  
  let scaleFactor = min(width / baseW, height / baseH);
  push();
  scale(scaleFactor);

  // Round offsets to avoid fractional pixels
  let offsetX = Math.floor((width / scaleFactor - baseW) / 2);
  let offsetY = Math.floor((height / scaleFactor - baseH) / 2);
  translate(offsetX, offsetY);

  drawBackground();
  drawGlobe();
  drawForeground();
  drawBubbles();
  drawEyes();
  drawFlares();
  drawMainFrame();
  drawProphecyText();
  drawButtonFrame();
  drawButtonText();
  drawRoses();
  drawMarquee();
  handleFortuneChange();

  pop();
}


function mousePressed() {
  if (!audioStarted && song && !song.isPlaying()) {
    song.loop();
    song.setVolume(0.5);
    audioStarted = true; 
  }

  let scaleFactor = min(width / baseW, height / baseH);
  let mx = (mouseX - width / 2) / scaleFactor + baseW / 2;
  let my = (mouseY - height / 2) / scaleFactor + baseH / 2;

  
  let bx = baseW / 2;
  let by = baseH * 0.85;
  let bw = baseW * 0.25;
  let bh = baseH * 0.12;

  if (mx > bx - bw / 2 && mx < bx + bw / 2 && my > by - bh / 2 && my < by + bh / 2) {
    if (!textStarted) {
      textStarted = true;  
      showFortune = true;  
    } else {
      showFortune = !showFortune; 
    }
  }


  let d1 = dist(mx, my, eyeOneX, baseH * 0.2);
  if (d1 < 120 && eyeOneState === "idle") {
    eyeOneState = "click";
    eyeOneFrame = 0;

let randomIndex = floor(random(eyeSounds.length));
  eyeSounds[randomIndex].play();
  eyeSounds.setVolume(0.4);

  }


  let d2 = dist(mx, my, eyeTwoX, baseH * 0.6);
  if (d2 < 120 && eyeTwoState === "idle") {
    eyeTwoState = "click";
    eyeTwoFrame = 0;

let randomIndex = floor(random(eyeSounds.length));
  eyeSounds[randomIndex].play();
  eyeSounds.setVolume(0.4);

  }
}


function drawBackground() {
image(bgImg, 0, 0, baseW, baseH);
}

function drawGlobe() {
let globeScale = 0.8; // Scale
let globeWidth = GlobeAnim.elt.videoWidth * globeScale;
let globeHeight = GlobeAnim.elt.videoHeight * globeScale;

  
  let globeX = baseW / 2;
  let globeY = baseH * 0.60; 

  push();
  imageMode(CENTER);
  image(GlobeAnim, globeX, globeY, globeWidth, globeHeight);
  pop();

}

function drawForeground() {
image(fgImg, 0, 0, baseW, baseH);
}





function drawEyes() {
  eyeOneX -= 0.7;
  if (eyeOneX < -baseW) eyeOneX = baseW;
  eyeTwoX -= 0.2;
  if (eyeTwoX < -baseW) eyeTwoX = baseW;

  let frames1 = (eyeOneState === "idle") ? eyeOneIdle : eyeOneClick;

  eyeOneFrame += (eyeOneState === "click") ? 0.6 : 0.3;

  if (eyeOneState === "click" && eyeOneFrame >= frames1.length) {
    eyeOneState = "idle";
    eyeOneFrame = 0;
    frames1 = eyeOneIdle;


  }

  let img1 = frames1[floor(eyeOneFrame % frames1.length)];

  push();
  imageMode(CENTER);
  image(img1, eyeOneX, baseH * 0.2, img1.width * 0.4, img1.height * 0.4);
  pop();

  let frames2 = (eyeTwoState === "idle") ? eyeTwoIdle : eyeTwoClick;

  eyeTwoFrame += (eyeTwoState === "click") ? 0.6 : 0.25;

  if (eyeTwoState === "click" && eyeTwoFrame >= frames2.length) {
    eyeTwoState = "idle";
    eyeTwoFrame = 0;
    frames2 = eyeTwoIdle;
  }

  let img2 = frames2[floor(eyeTwoFrame % frames2.length)];

  push();
  imageMode(CENTER);
  image(img2, eyeTwoX, baseH * 0.6, img2.width * 0.2, img2.height * 0.2);
  pop();
}

function drawFlares() {
  push();
  blendMode(SCREEN);
  image(flaresImg, 0, 0, baseW, baseH);
  blendMode(BLEND);
  pop();
}


function drawMainFrame() {
  imageMode(CENTER);
  image(csfMain, baseW / 2, baseH * 0.45, baseW * 0.8, baseH * 0.55);
  imageMode(CORNER);
}

function drawBubbles(){
  push();
  blendMode(SCREEN);
  image(BubblesAnim, 0, 0, baseW, baseH);
  pop();

}

function drawProphecyText() {

  let bigTxt = fortunes[currentFortune].big;
  let secTxt = fortunes[currentFortune].second;
  let smallTxt = fortunes[currentFortune].small;

  push();
  textFont(prophecyFont);
  fill(255);
    drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = color(24, 85, 184, 255);
  textSize(65);
  textLeading(baseH * 0.09); 


  text(bigTxt, baseW / 2, baseH * 0.37,);

  textFont(prophecyFont);
  fill(255);
    drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = color(24, 85, 184, 255);
  textSize(65);
  textLeading(baseH * 0.09);


  text(secTxt, baseW / 2, baseH * 0.44,);

  textFont(emojiFont);
  textSize(37);
  stroke(24, 85, 184, 120);
  strokeWeight(2);
  fill(255);
    drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = color(24, 85, 184, 255);
  text(smallTxt, baseW / 2, baseH * 0.56);
  pop();
}

function drawButtonFrame() {
  imageMode(CENTER);
  image(csfBot, baseW / 2, baseH * 0.85, baseW * 0.25, baseH * 0.12);
  imageMode(CORNER);
}

function drawButtonText() {
  push();
  textFont(prophecyFont);
  fill(255);
    drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = color(98, 178, 240, 255);
  textSize(50);

   let buttonText;
  if (!textStarted) {
    textFont(prophecyFont);
  textSize(45);
    buttonText = "Start fortune";
  } else if (showFortune) {
    textFont(prophecyFont);
  textSize(49);
    buttonText = "Please stop";
  } else {
    textFont(prophecyFont);
  textSize(50);
    buttonText = "Touch me!";
  }

  text(buttonText, baseW / 2.01, baseH * 0.845);
  pop();
}

function drawRoses() {
  roseFrame = (roseFrame + 0.4) % roseFrames.length;
  let rImg = roseFrames[floor(roseFrame)];
  let roseSize = baseH * 0.5;

  image(rImg, -150, baseH - roseSize + 190, roseSize, roseSize);

  push();
  translate(baseW, 0);
  scale(-1, 1);
  image(rImg, -150, baseH - roseSize + 190, roseSize, roseSize);
  pop();
}

function drawMarquee() {
  push();
  textFont(marqueeFont);
  textSize(32);
  fill(255, 30, 30);
  textAlign(LEFT, TOP);

  let marqueeText = "若你正在閱讀這段文字，意味著我已然付諸行動，而眾神皆知我對此深感愉悅。😂🎉";
  let speed = 2;
  let txtWidth = textWidth(marqueeText);
  let x = baseW - (frameCount * speed) % (baseW + txtWidth);

  text(marqueeText, x, 20);
  pop();
}

function handleFortuneChange() {
  if (textStarted && showFortune) {
    textChangeTimer++;
    if (textChangeTimer > textChangeInterval) {
      textChangeTimer = 1;
      currentFortune = (currentFortune + 1) % fortunes.length;
    }
  }
}