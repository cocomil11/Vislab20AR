import React, { useState } from "react";
import "./assets/css/App.css"; // import MindARViewer from "./mindar-viewer";
import ArComponent from "./ArComponent";

const App: React.FC = () => {
  const [started, setStarted] = useState<string | null>(null);

  return (
    <div className="App">
      <h1>PEP : READY, GET SET, GO!</h1>

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
      )}
    </div>
  );
};

export default App;
