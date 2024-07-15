import React, { useState } from "react";
import "./assets/css/App.css"; // import MindARViewer from "./mindar-viewer";
import ArComponent from "./ArComponent";

const App: React.FC = () => {
  // const [started, setStarted] = useState<string | null>(null);
  const [started, setStarted] = useState<string | null>(null);

  return (
    <div className="App">
      <h1>VISLAB 20th Anniversary!</h1>

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
        </div>
      )}
    </div>
  );
};

export default App;
