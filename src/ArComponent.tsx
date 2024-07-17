import React, { useEffect, useState, useRef } from "react";
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import { Scene } from "aframe";
// import * as echarts from "echarts";

const ArComponent: React.FC = () => {
  const sceneRef = useRef<Scene | null>(null);
  const [count, setCount] = useState<number>(0);
  const [year, setYear] = useState(2014); // 状態を初期化
  const [imgIndex, setImgIndex] = useState(0); // 状態を初期化
  const [imageLists, setImageLists] = useState<{ [key: number]: string[] }>({});
  const chartRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    fetch("./images_by_year.json")
      .then((response) => response.json())
      .then((data) => {
        setImageLists(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching the image list:", error));
  }, []);

  // useEffect(() => {
  //   const chart = echarts.init(chartRef.current);
  //   const option = {
  //     xAxis: {
  //       type: "category",
  //       data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  //     },
  //     yAxis: {
  //       type: "value",
  //     },
  //     series: [
  //       {
  //         data: [150, 230, 224, 218, 135, 147, 260],
  //         type: "line",
  //       },
  //     ],
  //   };
  //   chart.setOption(option);
  // }, []);

  const handleImageYearClick = () => {
    setYear((prevYear) => (prevYear < 2024 ? prevYear + 1 : 2014));
    setImgIndex(0);
  };

  const handleImageIndexClick = () => {
    setImgIndex((prevIndex) => (prevIndex + 1) % imageLists[year].length);
  };

  const getImageSrc = () => {
    // const imageNumber = (count % 3) + 1;
    if (imageLists[year]) {
      const imgPath = imageLists[year][imgIndex];
      console.log(`imgs/${imgPath}`);
      // return `imgs/2016/dongyu_wedding2.jpg`;
      return `imgs/${imgPath}`;
    }
    return `imgs/2016/dongyu_wedding2.jpg`;
  };

  return (
    <a-scene
      ref={sceneRef}
      mindar-image="imageTargetSrc: target/targets_m.mind; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
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
      <a-camera
        position="0 0 0"
        look-controls="enabled: false"
        cursor="fuse: false; rayOrigin: mouse;"
        raycaster="far: ${customFields.libVersion}; objects: .clickable"
      ></a-camera>

      <a-entity mindar-image-target="targetIndex: 0">
        {/* <a-gltf-model
          id="AR3"
          rotation="0 180 180"
          position="0 0 0.1"
          scale="0.01 0.01 0.01"
          src="#AR3MODEL"
          class="clickable"
          animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
          onClick={handleImageClick}
        ></a-gltf-model> */}
        <a-image
          src={`./${getImageSrc()}`}
          position="0 0.8 0.1"
          height="0.9"
          width="1.2"
        ></a-image>
        <a-entity position="0 0 0">
          <a-plane
            height="0.552"
            width="1"
            rotation="0 0 0"
            class="clickable"
            onClick={handleImageYearClick}
            color="lightblue" // 背景色
          ></a-plane>
          <a-text
            value={`Year ${year}`}
            position="0 0 0.1"
            align="center"
            scale="0.5 0.5 0.5" // フォントサイズを小さく
            color="black"
          ></a-text>
        </a-entity>
        <a-entity position="0 -0.6 0">
          <a-plane
            height="0.552"
            width="1"
            rotation="0 0 0"
            class="clickable"
            onClick={handleImageIndexClick}
            color="lightgreen" // 背景色
          ></a-plane>
          <a-text
            value={`Photo #${imgIndex}`}
            position="0 0 0.1"
            align="center"
            scale="0.5 0.5 0.5" // フォントサイズを小さく
            color="black"
          ></a-text>
        </a-entity>
        {/* <a-entity position="1 -1 0"> */}
        {/* <a-entity
            ref={chartRef}
            style={{ width: "100%", height: "100%" }}
          ></a-entity> */}
        {/* <div ref={chartRef} style={{ width: "100%", height: "100%" }}></div> */}
        {/* </a-entity> */}
      </a-entity>
    </a-scene>
  );
};

export default ArComponent;
