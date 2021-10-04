// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using a pre-trained customized model and p5.js
This example uses p5 preload function to create the classifier
=== */

// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/_6AZWTN_r/';
let imageModelGenre = 'https://teachablemachine.withgoogle.com/models/quZz9LyuP/';
// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let img_not;

let img_yes;

// Load the model first
function preload() {
    classifier = ml5.imageClassifier(imageModelGenre + 'model.json');
}

function setup() {
    createCanvas(200, 100);
    // Create the video
    video = createCapture(VIDEO);
    video.size(320,240);
    // video.hide();
    img_not = createImg("bear_question_mark.jpg");
    img_not.size(200, 350);
    img_yes = createImg("mmbear_appears.jpg");
    img_yes.size(200, 350);
    img_yes.hide();
    img_not.hide();
    img_not.position(500, 100);
    img_yes.position(500, 100);
    classifyVideo();
    flippedVideo = ml5.flipImage(video)
    // Start classifying

}

function draw() {

    frameRate(30);
    background(255);
    // Draw the video
    // image(flippedVideo, 0, 0);

    // Draw the label
    // fill(255);
    textSize(25);
    textAlign(CENTER);
    text("This is "+label, 100, 80);
}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;
    // if (label === "咩咩熊！") {
    //     img_not.hide();
    //     img_yes.show();
    // } else {
    //     img_not.show();
    //     img_yes.hide();
    // }
    // Classifiy again!
    classifyVideo();
}