import React, { useEffect, useState, useRef } from "react";
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import { Scene } from "aframe";

const ArComponent: React.FC = () => {
  const sceneRef = useRef<Scene | null>(null);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const sceneEl = sceneRef.current; // TypeScript automatically understands sceneEl is of type Scene | null
    if (sceneEl) {
      // Typing ensures we acknowledge possible null values
      const arSystem = sceneEl.systems["mindar-image-system"] as any;
      const startAr = (): void => {
        if (arSystem) {
          arSystem.start(); // start AR
        }
      };
      sceneEl.addEventListener("renderstart", startAr);
      return () => {
        if (arSystem) {
          arSystem.stop(); // Proper cleanup on unmount
        }
      };
    }
  }, []);

  const handleModelClick = () => {
    setCount((prevCount) => prevCount + 1); 
  };
  const getImageSrc = () => {
    const imageNumber = (count % 3) + 1;
    return `imgs/cat${imageNumber}.jpg`;
  };
  return (
    <a-scene
      ref={sceneRef}
      // mindar-image="imageTargetSrc: target/cat.mind; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
      mindar-image="imageTargetSrc: target/pep-two.mind; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
      // mindar-image="imageTargetSrc: target/pepOne.mind; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
      // mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.0/examples/image-tracking/assets/card-example/card.mind; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
      color-space="sRGB"
      embedded
      renderer="colorManagement: true, physicallyCorrectLights"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
    >
      <a-assets>
        <a-asset-item
          id="AR3MODEL"
          // src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.0/examples/image-tracking/assets/card-example/softmind/scene.gltf"
          src="models/ar3.gltf"
        ></a-asset-item>
      </a-assets>
      {/* <a-camera position="0 0 0" look-controls="enabled: false"></a-camera> */}
      <a-camera
        position="0 0 0"
        look-controls="enabled: false"
        cursor="fuse: false; rayOrigin: mouse;"
        raycaster="far: ${customFields.libVersion}; objects: .clickable"
      ></a-camera>
      <a-entity mindar-image-target="targetIndex: 0">
        <a-gltf-model
          id="AR3"
          rotation="0 180 180"
          position="0 0 0.1"
          scale="0.01 0.01 0.01"
          src="#AR3MODEL"
          class="clickable"
          animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
          onClick={handleModelClick} 
        ></a-gltf-model>
        <a-image
          src={getImageSrc()} 
          position="0 0.5 0.1"
          height="0.3"
          width="0.3"
        ></a-image>
        <a-text
          value={`# of Clicks: ${count}`} 
          position="0 0.2 0.1" 
          scale="0.5 0.5 0.5"
          color="blue"
        ></a-text>
      </a-entity>
    </a-scene>
  );
};

export default ArComponent;
