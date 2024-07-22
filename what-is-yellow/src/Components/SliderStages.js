import CircularSlider from "./CircularSlider";
import SubmitBar from "./SubmitBar";
import '../index.css'; // Import the CSS file
import { useState } from "react";
import db from "../Firebase";
import { onSnapshot, collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import React from "react";
import { MobileStepper, Button, Typography } from "@mui/material/";

const SliderStages = () => {
  const [sliderValues, setSliderValues] = useState({
    stage1: [0, 0],
    stage2: [0, 0],
    stage3: [0, 0, 0],
    stage4: [0, 0, 0, 0],
    stage5: [0, 0, 0, 0, 0],
    stage6: [0, 0, 0, 0, 0, 0]
  });
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    const collectionRef = collection(db, "colour wheel default");
    const payload = { "color regions": sliderValues };

    await addDoc(collectionRef, payload);

    const docRef = doc(db, "colour wheel default", "main");
    const docSnap = await getDoc(docRef);

    let n = docSnap.data().n;
    let regions = docSnap.data()["color regions"];

    let newRegions = Object.keys(regions).reduce((acc, key) => {
      acc[key] = regions[key].map((region, index) => {
        return (region * n + sliderValues[key][index]) / (n + 1);
      });
      return acc;
    }, {});

    await setDoc(docRef, { "color regions": newRegions, n: n + 1 });
  };

  const handleSliderChange = (stage, index, angle) => {
    setSliderValues((prevValues) => {
      const newStageValues = [...prevValues[stage]];
      newStageValues[index] = angle;
      return { ...prevValues, [stage]: newStageValues };
    });
  };

  const stages = [
    <CircularSlider key="stage1" size={2.5} onChange={(angle, index) => handleSliderChange('stage1', index, angle)} knobs={2} textValues={["Yellow", "Not Yellow"]} />,
    <CircularSlider key="stage2" size={2.5} onChange={(angle, index) => handleSliderChange('stage2', index, angle)} knobs={6} />,
    <CircularSlider key="stage3" size={2.5} onChange={(angle, index) => handleSliderChange('stage3', index, angle)} knobs={7} textValues={["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Purple"]}/>,
    <div style={{filter:
        <filter>
            <feColorMatrix
                id="protanopiaColourMatrix"
                type="matrix"
                values=".56667 .43333 0      0 0
                        .55833 .44167 0      0 0
                        0      .24167 .75833 0 0
                        0      0      0      1 0" />
        </filter>
    }}><CircularSlider key="stage4" size={2.5} onChange={(angle, index) => handleSliderChange('stage4', index, angle)} knobs={6} /></div>,
    <CircularSlider key="stage5" size={2.5} onChange={(angle, index) => handleSliderChange('stage5', index, angle)} knobs={6} />,
    <CircularSlider key="stage6" size={2.5} onChange={(angle, index) => handleSliderChange('stage6', index, angle)} knobs={6} />
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Typography variant="h3" style={{ textAlign: 'center', marginTop: '5vh' }}>What is Yellow?</Typography>
      <Typography variant="h6" style={{ textAlign: 'center'}}>Variant {activeStep + 1}</Typography>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {stages[activeStep]}
      </div>
      <MobileStepper 
        steps={6} 
        activeStep={activeStep} 
        color="primary"
        position="static"
        style={{ justifyContent: 'center', alignItems: 'center', marginBottom: '10vh' }}
        nextButton={
          <Button onClick={handleNext} disabled={activeStep === 5}>
            Next
          </Button>
        }
        backButton={
          <Button onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>
        }
      />
      <SubmitBar onSubmit={handleSubmit} style={{ position: 'fixed', bottom: 0, width: '100%' }} />
    </div>
  );
}

export default SliderStages;
