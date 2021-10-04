// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/_6AZWTN_r/';
let imageModelGenre = 'https://teachablemachine.withgoogle.com/models/quZz9LyuP/';
// Video
let video;
// To store the classification
let label = "loading...";
let img_not;

let img_yes;
let button;
let ifShot = false;
let shotImage;
let shotLabel = 'loading...';
let cuttedFeed;
let buttonCreate;
let buttonAgain;
let filterParam = false;
let flippedVideo;
let ifGenerate = false;
let randomNum;
let nameInput;
let name;

// Load the model first
function preload() {
    classifier = ml5.imageClassifier(imageModelGenre + 'model.json');
}

function setup() {
    nameInput = createInput();
    nameInput.hide();
    createCanvas(1280, 720);
    // Create the video
    video = createCapture(VIDEO);
    video.size(640, 360);
    video.hide();
    // video = video.get(40,0,240,240);
    button = createButton('take a shot!');
    button.mousePressed(takeScreenShot);
    button.hide();
    buttonCreate = createButton('Enter your album name and generate!');
    buttonCreate.mousePressed(generateArt);
    buttonAgain = createButton('try again');
    buttonAgain.mousePressed(tryAgain);
    classifyVideo();

}

function takeScreenShot() {
    ifShot = true;
    shotImage = ml5.flipImage(video).get(40, 0, 360, 360);
    classifier.classify(shotImage, gotResultForShot);

}

function draw() {
    frameRate(15);
    background(255);
    textSize(18);
    if (ifGenerate) {

        image(shotImage, (width - 360) / 2, 0);

        if (shotLabel === 'Indie') {
            // randomNum > 0.5 ? filter(THRESHOLD, 0.42) : filter(INVERT);
        } else if (shotLabel === "Metal") {
            // filter(THRESHOLD, 0.45)
            filter(POSTERIZE, 2);
        } else if (shotLabel === "Jazz") {
            randomNum > 0.5 ? filter(GRAY) : filter(THRESHOLD, 0.5);
        }
        textAlign(LEFT);
        textFont("Helvetica", 23);
        text(name, (width - 360) / 2 + 20, 25); // left-upper Corner
    } else {
        // Cut the video stream to a square
        cuttedFeed = video.get(140, 0, 360, 360);
        image(cuttedFeed, width - 360, 0);
        button.position(width - 220, 740);
        button.show();
        // Draw the video
        // image(flippedVideo, 0, 0);
        if (ifShot) {
            textSize(18);
            // textAlign(CENTER);
            text(shotLabel === "loading..." ? shotLabel : "your are a:\n " + shotLabel + " \nalbum cover!", 140, 440);
            nameInput.show();
            nameInput.position(buttonAgain.x + 45, buttonAgain.y + 25);
            image(shotImage, 0, 0);
            buttonAgain.position(60, 630);
            buttonCreate.position(130, 630);
            buttonAgain.show();
            buttonCreate.show();
            if (filterParam !== false) {
                filter(filterParam);
            }
        }
        // Draw the label
        // fill(255);
        textSize(20);
        textAlign(CENTER);
        text(label === "loading..." ? label : "👆This is " + label + ". \n If you are ready, take a shot!\n I will generate your album cover", width - 180, 400);

    }

}

function generateArt() {
    name = nameInput.value();
    nameInput.value("");
    nameInput.hide();
    randomNum = Math.random();
    ifGenerate = true;
    // buttonAgain.hide();
    button.hide();
    buttonCreate.hide();
    cuttedFeed.hide();
}

function tryAgain() {
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
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    shotLabel = results[0].label;

    classifyVideo();
}

function clearCanvas() {
    rect(0, 0, canvas.width, canvas.height);
    background(255);
}