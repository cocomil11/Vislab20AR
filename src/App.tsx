import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";

import LineChart from "./LineChart.js";

import logo from "./vislab_logo.png";
import "./assets/css/ui.css";
import "./assets/css/App.css"; // import MindARViewer from "./mindar-viewer";

const mSVG = (
  <svg className="icon" viewBox="0 0 1194 1024">
    <path
      d="M481.457 880.601l-89.86-81.301 263.168-290.983-263.168-290.983 89.86-81.301 335.913 372.283z"
      p-id="5100"
    ></path>
  </svg>
);

const Slider: React.FC<{ currentYear: number }> = ({ currentYear }) => {
  var progress = ((currentYear - 2004) / 20) * 100;

  return (
    <div className="slider">
      <div className="slider-thumb" style={{ left: `${progress}%` }}></div>
      <div className="slider-annotation" style={{ left: `${progress}%` }}>
        {currentYear.toString()}
      </div>
    </div>
  );
};

interface ImageList {
  "2014": string[];
  "2015": string[];
  "2016": string[];
  "2017": string[];
  "2018": string[];
  "2019": string[];
  "2020": string[];
  "2021": string[];
  "2022": string[];
  "2023": string[];
  "2024": string[];
}

const App: React.FC = () => {
  // TODO: change the URL in deployment
  // const imageURLBase: string = "http://localhost:3000/imgs"
  const imageURLBase: string = "imgs";

  const [year, setYear] = useState<number>(2014);
  const [imagePage, setimagePage] = useState<number>(1);
  const [imageList, setImageList] = useState<ImageList | null>(null);
  const [imageURL, setImageURL] = useState<string>("");
  const [imageCount, setImageCount] = useState<number>(0);

  const getImageURL = (
    imageList: ImageList | null,
    year: number,
    imagePage: number
  ) => {
    if (imageList === null) {
      const imageURLForNoImage: string = `${imageURLBase}/no_image.png`;
      return imageURLForNoImage;
    } else {
      const imageListKey: keyof ImageList = year.toString() as keyof ImageList;
      const imageURLEnd: string = imageList[imageListKey][imagePage - 1];
      const imageURLNew: string = `${imageURLBase}/${imageURLEnd}`;
      return imageURLNew;
    }
  };

  const getImageCount = (imageList: ImageList | null, year: number) => {
    if (imageList === null) {
      return 0;
    } else {
      const imageListKey: keyof ImageList = year.toString() as keyof ImageList;
      const imageNumInYear: number = imageList[imageListKey].length;
      return imageNumInYear;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: change the URL in deployment
        const response = await fetch("data/images_by_year.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const imageListData: ImageList = await response.json();
        setImageList(imageListData);

        // set URL of the default image
        const imageURLNew: string = getImageURL(imageListData, year, imagePage);
        setImageURL(imageURLNew);

        // set image count for pagenation
        const imageCountNew: number = getImageCount(imageListData, year);
        setImageCount(imageCountNew);
      } catch (error) {
        console.log("=== Error on fetching image list ===");
      }
    };

    fetchData();
  }, []);

  const handleChangePagenation = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setimagePage(page);

    const imageURLNew: string = getImageURL(imageList, year, page);
    setImageURL(imageURLNew);
  };

  const goToPrevYear = () => {
    // update year
    const newYear: number = year > 2014 ? year - 1 : 2024;
    setYear(newYear);
    // reset image index
    setimagePage(1);

    // update image
    const imageURLNew: string = getImageURL(imageList, newYear, 1);
    setImageURL(imageURLNew);

    // set image count for pagenation
    const imageCountNew: number = getImageCount(imageList, newYear);
    setImageCount(imageCountNew);
  };

  const goToNextYear = () => {
    // update year
    const newYear: number = year < 2024 ? year + 1 : 2014;
    setYear(newYear);
    // reset image index
    setimagePage(1);

    // update image
    const imageURLNew: string = getImageURL(imageList, newYear, 1);
    setImageURL(imageURLNew);

    // set image count for pagenation
    const imageCountNew: number = getImageCount(imageList, newYear);
    setImageCount(imageCountNew);
  };

  return (
    <div className="App">
      <div className="heading">
        <img src={logo} className="heading-logo" alt="logo" />
        <div className="heading-title">VisLab 20th Anniversary</div>
      </div>
      <div className="canvas">
        <div className="photo-container">
          <Button variant="outlined" onClick={goToPrevYear}>
            <span id="left-arrow">{mSVG}</span>
          </Button>
          <div className="photo-canvas">
            <img
              src={imageURL}
              className="photo"
              alt=""
              style={{ width: "100%", height: "auto" }}
            />
            <div className="photo-caption">VisLab {year.toString()}</div>
            <Stack spacing={2} sx={{ display: "flex", alignItems: "center" }}>
              <Pagination
                count={imageCount}
                page={imagePage}
                onChange={handleChangePagenation}
              />
            </Stack>
          </div>
          <Button variant="outlined" onClick={goToNextYear}>
            <span id="right-arrow">{mSVG}</span>
          </Button>
        </div>

        <div className="chart-container">
          <div className="chart">
            <LineChart currentYear={year} />
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
