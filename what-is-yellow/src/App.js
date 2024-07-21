import React from "react";
import CircularSlider from "./Components/CircularSlider";
import './index.css'; // Import the CSS file

function App() {
  return (
    <>
      <div className="container">
        <div className="grid"></div>
        <div className="slider"><CircularSlider onChange={(index, angle) => {console.log(index, angle);}}></CircularSlider></div>
      </div>
    </>
  );
}

export default App;