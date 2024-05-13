"use strict";

let eyesClosedThreshold = 0.65; // For 65% open eyes.
let timeThreshold = 500; // For 0.5 seconds;

let lastClosedTime,
    continuous = false;
let body = document.querySelector("body");
let videoContainer = document.getElementById("video-container");

// Adjust the size of the video container
videoContainer.style.width = "100%"; // Example: 80% of the parent container width
videoContainer.style.height = "auto"; // Maintain aspect ratio

function main() {
  JEEFACETRANSFERAPI.init({
    canvasId: "canvas",
    NNCpath: "src/model/",
    callbackReady: function(errCode) {
      if (errCode) {
        console.log(
            "ERROR - cannot init JEEFACETRANSFERAPI. errCode =",
            errCode
        );
        errorCallback(errCode);
        return;
      }
      console.log("INFO : JEEFACETRANSFERAPI is ready !!!");
      successCallback();
    } //end callbackReady()
  });
}

function successCallback() {
  document.getElementById("full-page-loader").style.display = "none";
  nextFrame();
}

function errorCallback(errorCode) {
  alert("Cannot work without camera. Check if the camera is attached.");
}

function nextFrame() {
  let deltaTime = Date.now() - lastClosedTime;
  if (deltaTime > timeThreshold && continuous) {
    start_alarm();
    body.style.background = "#f00";
  } else {
    stop_alarm();
    body.style.background = "#fff";
  }

  if (JEEFACETRANSFERAPI.is_detected()) {
    let expressions = JEEFACETRANSFERAPI.get_morphTargetInfluences();
    if (
        expressions[8] >= eyesClosedThreshold && // For left and right eye
        expressions[9] >= eyesClosedThreshold
    ) {
      if (lastClosedTime === undefined || !continuous)
        lastClosedTime = Date.now();
      continuous = true;
    } else {
      continuous = false;
    }
  } else {
    continuous = false;
  }
  requestAnimationFrame(nextFrame);
}
