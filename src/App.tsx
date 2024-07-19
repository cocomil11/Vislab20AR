import React, { useState } from "react";
import "./assets/css/App.css"; // import MindARViewer from "./mindar-viewer";
import logo from './vislab_logo.png';
import "./assets/css/ui.css"
import photo2023 from './photos/VISLab2023.png';
import LineChart from './LineChart.js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

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
  const [year, setYear] = useState<number>(2014)
  const [imagePage, setimagePage] = useState<number>(1);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setimagePage(value);
  };

  const onClickLeft = () => {
    const newYear: number = year > 2014 ? year - 1 : 2024
    setYear(newYear)
    setimagePage(1)
  }

  const onClickRight = () => {
    const newYear: number = year < 2024 ? year + 1 : 2014
    setYear(newYear)
    setimagePage(1)
  }

  return (
    <div className="App">
      <div className="heading">
          <img src={logo} className="heading-logo" alt="logo" />
          <div className="heading-title">VisLab 20th Anniversary</div>
      </div>
      <div className="canvas">
          <div className="photo-container">
            <Button variant="outlined" onClick={onClickLeft}>
              <span id="left-arrow">{mSVG}</span>
            </Button>
            <div className="photo-canvas">
              <img src={photo2023} className="photo"  alt="image"/>
              <div className="photo-caption">VisLab {year.toString()}</div>
              <Stack spacing={2} sx={{display: "flex", alignItems: "center"}}>
                <Typography>Page: {imagePage}</Typography>
                <Pagination count={10} page={imagePage} onChange={handleChange} />
              </Stack>
            </div>
            <Button variant="outlined" onClick={onClickRight}>
              <span id="right-arrow">{mSVG}</span>
            </Button>
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
    </div>
  );
};

export default App;
