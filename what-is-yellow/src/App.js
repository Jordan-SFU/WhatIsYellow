import React from "react";
import CircularSlider from "./Components/CircularSlider";
import './index.css'; // Import the CSS file
import { useState } from "react";
import db from "./Firebase";
import { onSnapshot, collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";

function App() {
  const [sliderValues, setSliderValues] = useState([0, 0, 0, 0, 0, 0]);
  
  const handleSubmit = async () => {
    const collectionRef = collection(db, "colour wheel default");
    const payload = { "color regions": sliderValues };

    await addDoc(collectionRef, payload);

    // get the document with id 'main' and its data
    const docRef = doc(db, "colour wheel default", "main");
    const docSnap = await getDoc(docRef);

    let n = docSnap.data().n;
    let regions = docSnap.data()["color regions"];

    // calculate the new average
    // TODO: special case for circular average
    let newRegions = regions.map((region, index) => {
      return (region * n + sliderValues[index]) / (n + 1);
    });

    // update the document
    await setDoc(docRef, { "color regions": newRegions, n: n + 1 });
  }

  const handleSliderChange = (index, angle) => {
    const newSliderValues = [...sliderValues];
    newSliderValues[index] = angle;
    setSliderValues(newSliderValues);
  }

  return (
    <>
      <div className="container">
        <div className="grid"></div>
        <div className="slider">
          <CircularSlider minimumDistance={5} onChange={handleSliderChange}></CircularSlider>
          <button onClick={handleSubmit}>Submit</button>
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