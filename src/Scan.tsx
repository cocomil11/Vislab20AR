import React, { useEffect, useRef, useState, useCallback } from 'react';

const Scan: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const loadOpenCv = () => {
      // @ts-ignore
      if (!window.cv) {
        const script = document.createElement('script');
      // @ts-ignore
        script.src = 'https://docs.opencv.org/4.5.2/opencv.js';
      // @ts-ignore
        script.async = true;
        script.onload = () => {
      // @ts-ignore
          if (window.cv && !window.cv['onRuntimeInitialized']) {
      // @ts-ignore
            window.cv['onRuntimeInitialized'] = () => {
              setLoaded(true);
            };
      // @ts-ignore
          } else if (window.cv && window.cv['onRuntimeInitialized']) {
            setLoaded(true);
          }
        };
        document.body.appendChild(script);
      // @ts-ignore
      } else if (window.cv && window.cv['onRuntimeInitialized']) {
        setLoaded(true);
      } else {
      // @ts-ignore
        window.cv['onRuntimeInitialized'] = () => {
          setLoaded(true);
        };
      }
    };

    loadOpenCv();
  }, []);

  const processVideo = useCallback(() => {
      // @ts-ignore
    const cv = window.cv;
    const videoElement = videoRef.current as HTMLVideoElement;
    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;

    if (!loaded || !width || !height) {
      console.error("Video element has zero width or height or OpenCV not loaded.");
      return;
    }

    const cap = new cv.VideoCapture(videoElement);
    const src = new cv.Mat(height, width, cv.CV_8UC4);
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
          setIsDetected(true);
        } else {
          setIsDetected(false);
        }

        targetSrc.delete();
        matches.delete();
      }

      src.delete(); gray.delete();
      kp1.delete(); des1.delete();
      kp2.delete(); des2.delete();

      requestAnimationFrame(processFrame);
    };

    requestAnimationFrame(processFrame);
  }, [loaded]);

  const startVideo = useCallback(() => {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    })
      .then(stream => {
        const videoElement = videoRef.current as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.onloadedmetadata = () => {
            videoElement.play().then(() => {
              console.log('Video playing');
              processVideo();
            }).catch(err => {
              console.error('Error playing video: ', err);
            });
          };
        }
      })
      .catch(err => {
        console.error("Error accessing webcam: ", err);
      });
  }, [processVideo]);

  useEffect(() => {
    if (loaded) {
      startVideo();
    }
  }, [loaded, startVideo]);

  useEffect(() => {
    if (videoRef.current && targetImgRef.current) {
      const imageElement = targetImgRef.current;
      imageElement.onload = () => {
        processVideo();
      };
      // In case the image is already loaded, call processVideo immediately
      if (imageElement.complete) {
        processVideo();
      }
    }
  }, [videoRef, targetImgRef, processVideo]);

  return (
    <div>
      <h1>Scan Page</h1>
      <video ref={videoRef} style={{ width: '100%', height: 'auto' }}></video>
      <img ref={targetImgRef} id="targetImage" src="http://localhost:3000/imgs/target.jpg" style={{ display: 'none' }} alt="target" />
      <p>{isDetected ? 'Image is detected!' : 'Image is not detected.'}</p>
    </div>
  );
};

export default Scan;
