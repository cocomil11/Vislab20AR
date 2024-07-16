import React, { useEffect, useRef, useState } from 'react';

const Scan: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if ((window as any).cv) {
      setLoaded(true);
    } else {
      (window as any).openCvReady = () => {
        setLoaded(true);
      };
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      startVideo();
    }
  }, [loaded]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(err => {
        console.error("Error accessing webcam: ", err);
      });
  };

  const processVideo = () => {
    if (!loaded || !videoRef.current || !canvasRef.current) return;

    const cv = (window as any).cv;
    const cap = new cv.VideoCapture(videoRef.current);
    const src = new cv.Mat(videoRef.current.videoHeight, videoRef.current.videoWidth, cv.CV_8UC4);
    const gray = new cv.Mat();
    const targetImgElement = document.getElementById('targetImage') as HTMLImageElement;
    const targetSrc = cv.imread(targetImgElement);
    cv.cvtColor(targetSrc, targetSrc, cv.COLOR_RGBA2GRAY, 0);

    const processFrame = () => {
      cap.read(src);
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

      // ORB detector
      const orb = new cv.ORB();
      const kp1 = new cv.KeyPointVector();
      const des1 = new cv.Mat();
      const kp2 = new cv.KeyPointVector();
      const des2 = new cv.Mat();

      orb.detectAndCompute(targetSrc, new cv.Mat(), kp1, des1);
      orb.detectAndCompute(gray, new cv.Mat(), kp2, des2);

      const bf = new cv.BFMatcher(cv.NORM_HAMMING, false);
      const matches = new cv.DMatchVector();
      bf.match(des1, des2, matches);

      const goodMatches = [];
      for (let i = 0; i < matches.size(); ++i) {
        const m = matches.get(i);
        if (m.distance < 50) {
          goodMatches.push(m);
        }
      }

      const matchThreshold = 10;
      if (goodMatches.length > matchThreshold) {
        setResult('Image is similar');
      } else {
        setResult('Image is not similar');
      }

      src.delete(); gray.delete();
      kp1.delete(); des1.delete();
      kp2.delete(); des2.delete();
      matches.delete();

      requestAnimationFrame(processFrame);
    };

    requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      processVideo();
    }
  }, [videoRef, canvasRef]);

  return (
    <div>
      <h1>Scan Page</h1>
      <video ref={videoRef} style={{ display: 'none' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <img id="targetImage" src="http://localhost:3000/imgs/cat1.jpg" style={{ display: 'none' }} alt="target" />
      <p>{result}</p>
    </div>
  );
};

export default Scan;
