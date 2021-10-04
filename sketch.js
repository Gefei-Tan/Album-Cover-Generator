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

// Load the model first
function preload() {
    classifier = ml5.imageClassifier(imageModelGenre + 'model.json');
}

function setup() {
    createCanvas(1280, 720);
    // Create the video
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();
    // video = video.get(40,0,240,240);
    button = createButton('take a shot!');
    button.mousePressed(takeScreenShot);
    button.hide();
    buttonCreate = createButton('generate your art work!');
    buttonCreate.mousePressed(generateArt);
    buttonAgain = createButton('try again');
    buttonAgain.mousePressed(tryAgain);
    // buttonCreate.hide();
    // buttonAgain.hide();
    // img_not = createImg("bear_question_mark.jpg");
    // img_not.size(200, 350);
    // img_yes = createImg("mmbear_appears.jpg");
    // img_yes.size(200, 350);
    // img_yes.hide();
    // img_not.hide();
    // img_not.position(500, 100);
    // img_yes.position(500, 100);
    // flippedVideo = ml5.flipImage(video);
    // Start classifying
    classifyVideo();

}

function takeScreenShot() {
    ifShot = true;
    shotImage = ml5.flipImage(video).get(40, 0, 240, 240);
    classifier.classify(shotImage, gotResultForShot);

}

function draw() {
    frameRate(15);
    background(255);
    cuttedFeed = video.get(40, 0, 240, 240);
    image(cuttedFeed, width - 320, 0);
    button.position(width - 230, 500);
    button.show();
    // Draw the video
    // image(flippedVideo, 0, 0);
    if (ifShot) {
        textSize(20);
        textAlign(CENTER);
        text(shotLabel === "loading..." ? shotLabel : "your are a:\n " + shotLabel + " album cover!", 110, 300);
        image(shotImage, 0, 0);
        buttonAgain.position(30, 510);
        buttonCreate.position(100, 510);
        buttonAgain.show();
        buttonCreate.show();
        if (filterParam !== false) {
            filter(filterParam);
        }
    }
    // Draw the label
    // fill(255);
    textSize(23);
    textAlign(CENTER);
    text(label === "loading..." ? label : "👆This is " + label + ". \n If you are ready, take a shot!\n I will generate your album cover", width - 180, 300);
}

function generateArt() {
    // if(shotLabel==='Indie'){
    //     filterParam='INVERT';
    // }
}

function tryAgain() {
    ifShot = false;
    buttonAgain.hide();
    buttonCreate.hide();
    // clearCanvas();
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