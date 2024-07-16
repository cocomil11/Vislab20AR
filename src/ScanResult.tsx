import React, { useState } from "react";
import "./assets/css/App.css"; // import MindARViewer from "./mindar-viewer";
import ArComponent from "./ArComponent";

import logo from './vislab_logo.png';
import photo2023 from './photos/VISLab2023.png';
import LineChart from './LineChart.js';
import "./assets/css/ui.css"


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

const ScanResult: React.FC = () => {
  const [started, setStarted] = useState<string | null>(null);
  var year = 2023;

  return (
      <div className="canvas">
          <div className="photo-container">
              <span id="left-arrow">{mSVG}</span>
              <div className="photo-canvas">
                  <img src={photo2023} className="photo" alt="photo" />
                  <div className="photo-caption">VisLab {year.toString()}</div>
              </div>
              <span id="right-arrow">{mSVG}</span>
          </div>

          <div className="chart-container">
              <div className="chart">
                  <LineChart currentYear={year}/>
              </div>
              <div className="slider-container">
                  <Slider currentYear={year}></Slider>
              </div>
          </div>
      </div>
  )
}

export default ScanResult