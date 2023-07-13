import React, { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

//this one was for previous tests with img html element

import "./App.scss";
function CompName() {
  const [file, setFile] = useState([]);
  const [canvas, setcanvas] = useState([]);
  const [Image, setImg] = useState(null);
  const [isModeuleLoded, setIsModeleLoded] = useState(false);

  function fileChangeHandler(event) {
    // console.log(event);
    const obj = URL.createObjectURL(event);
    console.log(obj);
    setImg(obj);
    setFile(event);
  }

  useEffect(() => {
    loadModels();

    if (file.size > 0) {
      detectF();
      // console.log("file ", file);
    }
  }, [file]);

  async function loadModels() {
    console.log("enterd");
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    setcanvas(faceapi.createCanvas(file));
    console.log("file 1 ", file.size);
    setIsModeleLoded(true);
    document.getElementById("mycanvas").append(canvas);
    console.log("models loaded");
  }

  const displaySize = {
    width: "1024",
    height: "623"
  };

  faceapi.matchDimensions(canvas, displaySize);

  async function detectF() {
    console.log(file);
    const img = await faceapi.bufferToImage(file);
    const detections = await faceapi
      .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
    console.log(detections);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    // const landmarkPositions = resizedDetections[0].landmarks.positions;

    console.log({ detections });
  }
  const handleImageLoad = () => {};
  return (
    <div>
      {isModeuleLoded ? (
        <>
          <input
            type="file"
            onChange={(e) => fileChangeHandler(e.target.files[0])}
          />
          <div id="mycanvas" style={{ position: "fixed" }}>
            {Image && (
              <img
                src={Image}
                style={{
                  position: "absolute",
                  width: "1024px",
                  height: "623px"
                }}
                id="canvsdraw"
                onLoad={handleImageLoad}
                alt="check"
              />
            )}
          </div>{" "}
        </>
      ) : (
        <h1>Wait for module to load</h1>
      )}
    </div>
  );
}

export default CompName;
