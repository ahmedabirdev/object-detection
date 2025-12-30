import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);

  const videoConstraints = {
    facingMode: { ideal: "environment" }, // 👈 back camera
    width: { ideal: 640 },
    height: { ideal: 480 },
  };

  const runCoco = async () => {
    await tf.setBackend("webgl");
    await tf.ready();

    modelRef.current = await cocossd.load();
    detect();
  };

  const detect = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      video.width = videoWidth;
      video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const predictions = await modelRef.current.detect(video);

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, videoWidth, videoHeight);
      drawRect(predictions, ctx);
    }

    requestAnimationFrame(detect); // 👈 SAFE loop
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="app">
      <header className="app_header">
        <div className="camera_container">
          <Webcam
            ref={webcamRef}
            audio={false}
            muted
            playsInline
            videoConstraints={videoConstraints}
            className="camera_video"
          />

          <canvas
            ref={canvasRef}
            className="camera_canvas"
          />

          <div className="ui_overlay">
            <h1>Object Detection </h1>
            <p>Created By Ahmed Abir</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
