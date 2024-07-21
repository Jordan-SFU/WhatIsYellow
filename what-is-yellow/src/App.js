import React from "react";
import CircularSlider from "./Components/CircularSlider";

function App() {
  return (
    <>
      <CircularSlider onChange={(index, angle) => {console.log(index, angle);}}></CircularSlider>
    </>
  );
}

export default App;
