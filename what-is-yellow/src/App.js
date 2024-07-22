import React from "react";
import SliderStages from "./Components/SliderStages";
import ColourBlindSliderStages from "./Components/ColourBlindSliderStages";
import './index.css'; // Import the CSS file

function App() {
  return (
    <>
      <div className="container">
        <div className="grid"></div>
        <ColourBlindSliderStages />
      </div>
    </>
  );
}

export default App;