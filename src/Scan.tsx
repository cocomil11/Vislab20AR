import React, { useState, useEffect } from 'react';

const Scan: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if ((window as any).cv) {
      setLoaded(true);
    } else {
      (window as any).openCvReady = () => {
        setLoaded(true);
      };
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgElement = document.createElement('img');
        // @ts-ignore
        imgElement.src = e.target?.result as string;
        imgElement.onload = () => {
        // @ts-ignore
          compareImages(imgElement);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const compareImages = (uploadedImage: HTMLImageElement) => {
    const cv = (window as any).cv;

    // Load target image
    const targetImage = document.getElementById('targetImage') as HTMLImageElement;
    const src1 = cv.imread(targetImage);
    const src2 = cv.imread(uploadedImage);

    cv.cvtColor(src1, src1, cv.COLOR_RGBA2GRAY, 0);
    cv.cvtColor(src2, src2, cv.COLOR_RGBA2GRAY, 0);

    const orb = new cv.ORB();
    const kp1 = new cv.KeyPointVector();
    const des1 = new cv.Mat();
    const kp2 = new cv.KeyPointVector();
    const des2 = new cv.Mat();

    orb.detectAndCompute(src1, new cv.Mat(), kp1, des1);
    orb.detectAndCompute(src2, new cv.Mat(), kp2, des2);

    const bf = new cv.BFMatcher(cv.NORM_HAMMING, false);
    const matches = new cv.DMatchVector();
    bf.match(des1, des2, matches);

    const goodMatches = [];
    for (let i = 0; i < matches.size(); ++i) {
      const m = matches.get(i);
      if (m.distance < 10) { // Adjust the distance threshold as needed
        goodMatches.push(m);
      }
    }

    const matchThreshold = 10;
    setResult(goodMatches.length > matchThreshold ? 'Image is similar' : 'Image is not similar');

    src1.delete(); src2.delete();
    kp1.delete(); des1.delete();
    kp2.delete(); des2.delete();
    matches.delete();
  };

  return (
    <div>
      <h1>Scan Page</h1>
      <input type="file" onChange={handleImageUpload} />
      <img id="targetImage" src="http://localhost:3000/imgs/cat1.jpg" style={{ display: 'none' }} alt="target" />
      <p>{result}</p>
    </div>
  );
};

export default Scan;
