import React from "react";
import CircularSlider from "./Components/CircularSlider";
import './index.css'; // Import the CSS file

function App() {
  return (
    <>
      <div className="container">
        <div className="grid"></div>
        <div className="slider">
          <CircularSlider minimumDistance={5} onChange={(index, angle) => {console.log(index, angle);}}></CircularSlider>
        </div>
        <div className="slider">
          <CircularSlider knobs={7} textValues={["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Purple"]} size={1.5} onChange={(index, angle) => {console.log(index, angle);}}></CircularSlider>
          <CircularSlider knobs={2} textValues={["Red", "Not red"]} size={1.5} thickness={7} centerScale={0} strokeThickness={2} onChange={(index, angle) => {console.log(index, angle);}}></CircularSlider>
          </div>
      </div>
    </>
  );
}

export default App;