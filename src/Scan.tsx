import React, { useEffect, useRef, useState } from 'react';

const Scan: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const loadOpenCv = () => {
      const script = document.createElement('script');
      // @ts-ignore
      script.src = 'https://docs.opencv.org/4.5.2/opencv.js';
      // @ts-ignore
      script.async = true;
      script.onload = () => {
        console.log('OpenCV script loaded');
        if ((window as any).cv) {
          (window as any).cv['onRuntimeInitialized'] = () => {
            console.log('OpenCV initialized');
            setLoaded(true);
          };
        }
      };
      document.body.appendChild(script);
    };

    if (!(window as any).cv) {
      loadOpenCv();
    } else {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      startVideo();
    }
  }, [loaded]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
      },
    })
      .then(stream => {
        const videoElement = videoRef.current as HTMLVideoElement;
        if (videoElement) {
          console.log('Setting video stream');
          videoElement.srcObject = stream;
          videoElement.play().then(() => {
            console.log('Video playing');
          }).catch(err => {
            console.error('Error playing video: ', err);
          });
        }
      })
      .catch(err => {
        console.error("Error accessing webcam: ", err);
      });
  };

  const processVideo = () => {
    if (!loaded || !videoRef.current || !canvasRef.current || !targetImgRef.current) return;

    const cv = (window as any).cv;
    const videoElement = videoRef.current as HTMLVideoElement;
    const cap = new cv.VideoCapture(videoElement);
    const src = new cv.Mat(videoElement.videoHeight, videoElement.videoWidth, cv.CV_8UC4);
    const gray = new cv.Mat();

    const processFrame = () => {
      cap.read(src);
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

      // ORB detector
      const orb = new cv.ORB();
      const kp1 = new cv.KeyPointVector();
      const des1 = new cv.Mat();
      const kp2 = new cv.KeyPointVector();
      const des2 = new cv.Mat();

      // Read the image only if it is fully loaded
      const targetImgElement = targetImgRef.current as HTMLImageElement;
      if (targetImgElement.complete) {
        const targetSrc = cv.imread(targetImgElement);
        cv.cvtColor(targetSrc, targetSrc, cv.COLOR_RGBA2GRAY, 0);

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

        targetSrc.delete();
        matches.delete(); // Move this line here
      }

      src.delete(); gray.delete();
      kp1.delete(); des1.delete();
      kp2.delete(); des2.delete();

      requestAnimationFrame(processFrame);
    };

    requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    if (videoRef.current && canvasRef.current && targetImgRef.current) {
      targetImgRef.current.onload = () => {
        processVideo();
      };
      // In case the image is already loaded, call processVideo immediately
      if (targetImgRef.current.complete) {
        processVideo();
      }
    }
  }, [videoRef, canvasRef, targetImgRef]);

  return (
    <div>
      <h1>Scan Page</h1>
      <video ref={videoRef} style={{ width: '640px', height: '480px' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <img ref={targetImgRef} id="targetImage" src="http://localhost:3000/imgs/cat1.jpg" style={{ display: 'none' }} alt="target" />
      <p>{result}</p>
    </div>
  );
};

export default Scan;
