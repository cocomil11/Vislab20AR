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
      // mindar-image="imageTargetSrc: target/cat.mind;  maxTrack: 2; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
      mindar-image="imageTargetSrc: target/targetCatPigDog.mind; maxTrack: 3; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
      // mindar-image="imageTargetSrc: target/pepOne.mind; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
      // mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.0/examples/image-tracking/assets/card-example/card.mind; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
      color-space="sRGB"
      embedded
      renderer="colorManagement: true, physicallyCorrectLights"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
    >
      <a-assets>
        <img
          id="card"
          src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.png"
        />
        <a-asset-item
          id="AR3MODEL"
          // src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.0/examples/image-tracking/assets/card-example/softmind/scene.gltf"
          src="models/ar3.gltf"
        ></a-asset-item>
        <a-asset-item
          id="bearModel"
          src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/band-example/bear/scene.gltf"
        ></a-asset-item>
        <a-asset-item
          id="raccoonModel"
          src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/band-example/raccoon/scene.gltf"
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
          rotation="0 0 0 "
          position="0 -0.25 0"
          scale="0.05 0.05 0.05"
          src="#raccoonModel"
          animation-mixer
        />
      </a-entity>
      <a-entity mindar-image-target="targetIndex: 1">
        <a-gltf-model
          rotation="0 0 0 "
          position="0 -0.25 0"
          scale="0.05 0.05 0.05"
          src="#bearModel"
          animation-mixer
        />
      </a-entity>
      <a-entity mindar-image-target="targetIndex: 2">
        <a-gltf-model
          rotation="0 0 0 "
          position="0 -0.25 0"
          scale="0.05 0.05 0.05"
          src="#bearModel"
          animation-mixer
        />
      </a-entity>

      {/* <a-entity mindar-image-target="targetIndex: 0">
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
        <a-plane
          src="#card"
          position="0 0 0"
          height="0.552"
          width="1"
          rotation="0 0 0"
        ></a-plane>
      </a-entity> */}
    </a-scene>
  );
};

export default ArComponent;
