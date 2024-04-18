import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": any;
      "a-assets": any;
      "a-image": any;
      "a-camera-static": any;
      // Add more Aframe components as needed
      "a-asset-item": any;
      "a-entity": any;
      "a-camera": any;
      "a-gltf-model": any;
      "a-plane": any;
      "a-text": any;
    }
  }
}
