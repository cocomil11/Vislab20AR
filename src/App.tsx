import React, { useState } from "react";
import "./assets/css/App.css"; // import MindARViewer from "./mindar-viewer";
import logo from './vislab_logo.png';
import "./assets/css/ui.css"
import ScanResult from "./ScanResult";


var mSVG = <svg className="icon" viewBox="0 0 1194 1024"><path d="M481.457 880.601l-89.86-81.301 263.168-290.983-263.168-290.983 89.86-81.301 335.913 372.283z" p-id="5100"></path></svg>

const Slider: React.FC<{ currentYear: number }> = ({ currentYear }) => {
  var progress = (currentYear - 2004)/20 * 100;

  return (
    <div className="slider">
      <div className="slider-thumb" style={{ left: `${progress}%`}}></div>
      <div className="slider-annotation" style={{ left: `${progress}%`}}>{currentYear.toString()}</div>
    </div>
  );
}





const App: React.FC = () => {
  const [started, setStarted] = useState<string | null>(null);
  var year = 2023;

  return (
    <div className="App">
      <div className="heading">
          <img src={logo} className="heading-logo" alt="logo" />
          <div className="heading-title">VisLab 20th Anniversary</div>
      </div>
      <ScanResult />
      {/* <h1>PEP : READY, GET SET, GO!</h1>

      <div className="control-buttons">
        {started === null && (
          <button
            onClick={() => {
              setStarted("aframe");
            }}
          >
            Start Tracking
          </button>
        )}
        {started !== null && (
          <button
            onClick={() => {
              setStarted(null);
            }}
          >
            Stop
          </button>
        )}
      </div>

      {started === "aframe" && (
        <div className="container">
          <ArComponent />
          <video></video>
        </div>
      )} */}
    </div>
  );
};

export default App;
