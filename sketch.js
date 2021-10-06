// Classifier Variable
let classifier;
// Model URL
// let imageModelURL = 'https://teachablemachine.withgoogle.com/models/_6AZWTN_r/';
let imageModelGenre = 'https://teachablemachine.withgoogle.com/models/quZz9LyuP/';
// Video
let video;
// To store the classification
let label = "loading...";

let shotButton;
let ifShot = false;
let shotImage;
let shotLabel = 'loading...';
let cuttedFeed;
let buttonCreate;
let buttonAgain;
let buttonFontColor;
let buttonFontPos;
let filterParam = false;
let flippedVideo;
let ifGenerate = false;
let randomNum;
let nameInput;
let name;
let metalFont1;
let metalFont2;
let indieFont1;
let indieFont2;
let indieFont3;

let jazzFont1;
let jazzFont2;

let fontColor = 'black';
let fontX;
let fontY;
let alignValue = 'LEFT';
let infoPic;

// Load the model first
function preload() {
    metalFont1 = loadFont("Heartless.ttf");
    metalFont2 = loadFont("ZOMBIES REBORN.ttf");
    indieFont1 = loadFont("Indie1.otf");
    indieFont2 = loadFont("Indie2.ttf");
    indieFont3 = loadFont("Indie3.ttf");
    jazzFont1 = loadFont("Jazz1.ttf");
    jazzFont2 = loadFont("Jazz2.ttf");

    classifier = ml5.imageClassifier(imageModelGenre + 'model.json');
}

function setup() {
    nameInput = createInput();
    // nameInput.size(18);
    nameInput.hide();
    createCanvas(1280, 720);
    // Create the video
    video = createCapture(VIDEO);
    video.size(640, 360);
    video.hide();
    // video = video.get(40,0,240,240);
    shotButton = createButton('take a shot!');
    shotButton.mousePressed(takeScreenShot);
    shotButton.hide();
    buttonCreate = createButton('Enter your album name and generate!');
    buttonCreate.mousePressed(generateArt);
    buttonAgain = createButton('try again');
    buttonAgain.mousePressed(tryAgain);
    buttonCreate.hide();
    buttonAgain.hide();
    buttonFontColor = createButton('Change Text Color');
    buttonFontColor.mousePressed(changeFontColor);
    buttonFontColor.hide();
    buttonFontPos = createButton('Change Text Position');
    buttonFontPos.mousePressed(changeFontPosition);
    buttonFontPos.hide();
    fontX = (width - 360) / 2 + 20;
    fontY = 50;
    classifyVideo();

}

function takeScreenShot() {
    ifShot = true;
    shotImage = video.get(40, 0, 360, 360);
    classifier.classify(shotImage, gotResultForShot);
    // cuttedFeed.hide();
}


function changeFontColor() {
    fontColor = fontColor === 'black' ? 'white' : fontColor === 'white' ? 'red' : fontColor === 'red' ? 'cyan' : 'black';
    fill(fontColor);
}

function changeFontPosition() {
    if (fontX === ((width -360) / 2 + 20)) {
        fontX += 320;
        alignValue = 'RIGHT';
    } else {
        alignValue = 'LEFT';
        fontX = ((width - 360) / 2 + 20);
    }
    fontY = fontY === 50 ? 325 : 50;
}

function draw() {
    frameRate(24);
    background(255);
    textSize(18);
    if (ifGenerate) {
        buttonAgain.position((width - 360) / 2 + 10, 670);
        buttonFontColor.position((width - 360) / 2 + 240, 670);
        buttonFontColor.show();
        buttonFontPos.position((width - 360) / 2 + 90, 670);
        buttonFontPos.show();
        image(shotImage, (width - 360) / 2, 0);

        if (shotLabel === 'Indie') {
            textSize(42);
            randomNum > 0.33 && randomNum < 0.66 ? textFont(indieFont1) : textFont(indieFont2);
            randomNum > 0.5 ? filter(THRESHOLD, 0.42) : filter(POSTERIZE, 2);
        } else if (shotLabel === "Metal") {
            textSize(50);
            // filter(THRESHOLD, 0.45)
            randomNum > 0.5 ? textFont(metalFont1) : textFont(metalFont2);
            randomNum > 0.5 ? filter(INVERT) : filter(POSTERIZE, 2);
        } else if (shotLabel === "Jazz") {
            textSize(50);
            randomNum > 0.5 ? textFont(jazzFont1) : textFont(jazzFont2);
            randomNum > 0.5 ? filter(THRESHOLD, 0.42) : filter(GRAY);
        }
        textAlign(alignValue === 'LEFT' ? LEFT : RIGHT);
        text(name, fontX, fontY); // left-upper Corner
    } else {
        // Cut the video stream to a square
        cuttedFeed = video.get(40, 0, 360, 360);
        image(cuttedFeed, width - 360, 0);
        shotButton.position(width - 220, 770);
        shotButton.show();
        // Draw the video
        // image(flippedVideo, 0, 0);
        if (ifShot) {
            textSize(18);
            // textAlign(CENTER);
            text(shotLabel === "loading..." ? shotLabel : "This is your:\n " + shotLabel + " \nalbum cover!", 140, 440);
            nameInput.show();
            image(shotImage, 0, 0);
            buttonAgain.position(60, 630);
            buttonCreate.position(130, 630);
            nameInput.position(buttonCreate.x + 44, buttonCreate.y + 25);

            // buttonAgain.show();
            buttonCreate.show();
            if (filterParam !== false) {
                filter(filterParam);
            }
        }
        // Draw the label
        // fill(255);
        textSize(20);
        textAlign(CENTER);
        // really unfortunate formatting...
        text(label === "loading..." ? label : ("👆\nI think... This is " + ((label === "Indie") ? "an " : ("a ")) + label + " album cover! \n If you are ready, take a shot!\n I will generate your album cover."), width - 180, 410);

    }

}

function generateArt() {
    name = nameInput.value();
    nameInput.value("");
    nameInput.hide();
    randomNum = Math.random();
    ifGenerate = true;
    // buttonAgain.hide();
    shotButton.hide();
    buttonCreate.hide();
    // cuttedFeed.hide();
}

// Basically reset everything
function tryAgain() {
    buttonFontColor.hide();
    buttonFontPos.hide();
    fontColor = 'black';
    fill('black');
    textFont('fontRegular');
    nameInput.hide();
    ifShot = false;
    ifGenerate = false;
    buttonAgain.hide();
    buttonCreate.hide();
}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(video);
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    label = results[0].label;
    classifyVideo();
}

function gotResultForShot(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    shotLabel = results[0].label;
    // classifyVideo();
}

function clearCanvas() {
    rect(0, 0, canvas.width, canvas.height);
    background(255);
}
