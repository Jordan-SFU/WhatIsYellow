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
    stage2: [0, 0, 0, 0, 0, 0],
    stage3: [0, 0, 0, 0, 0, 0, 0],
    stage4: [0, 0, 0, 0, 0, 0],
    stage5: [0, 0, 0, 0, 0, 0],
    stage6: [0, 0, 0, 0, 0, 0]
  });
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSubmitted(false);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (currentStage) => {
    const stageKey = "stage" + currentStage;
    const currentValues = sliderValues[stageKey];

    if (currentValues.includes(undefined)) {
      console.error(`Invalid data for stage ${currentStage}:`, currentValues);
      return;
    }

    const collectionRef = collection(db, "ColourWheel-" + currentStage);
    const payload = { "Regions": currentValues };

    await addDoc(collectionRef, payload);

    const docRef = doc(db, "ColourWheel-" + currentStage, "Main");
    let docSnap = await getDoc(docRef);

    // if it does not exist, create it
    if (!docSnap.exists()) {
        await setDoc(docRef, { "Regions": currentValues, n: 1 });
        setSubmitted(true);
        return;
    }
    
    let n = docSnap.data().n;
    let regions = docSnap.data()["Regions"];

    // Calculate new regions
    const newRegions = regions.map((region, index) => {
        const newRegion = (region * n + currentValues[index]) / (n + 1);
        return newRegion;
    });

    await setDoc(docRef, { "Regions": newRegions, n: n + 1 });

    setSubmitted(true);

  };

  const handleSliderChange = (stage, index, angle) => {
    console.log(`Stage: ${stage}, Index: ${index}, Angle: ${angle}`);
    setSliderValues((prevValues) => {
      const newStageValues = [...prevValues[stage]];
      if (index < newStageValues.length) {
        newStageValues[index] = angle;
      } else {
        console.error(`Index ${index} out of bounds for stage ${stage}`);
      }
      return { ...prevValues, [stage]: newStageValues };
    });
  };

  const stages = [
    <CircularSlider key="stage1" size={2.5} onChange={(index, angle) => handleSliderChange('stage1', index, angle)} knobs={2} textValues={["Yellow", "Not Yellow"]} />,
    <CircularSlider key="stage2" size={2.5} onChange={(index, angle) => handleSliderChange('stage2', index, angle)} knobs={6} />,
    <CircularSlider key="stage3" size={2.5} onChange={(index, angle) => handleSliderChange('stage3', index, angle)} knobs={7} textValues={["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Purple"]}/>,
    <div className="colourblind">
        <svg width="0" height="0">
            <defs>
                <filter id="protanopiaColourMatrix">
                    <feColorMatrix
                        id="protanopiaColourMatrix"
                        type="matrix"
                        values=".56667 .43333 0      0 0
                                .55833 .44167 0      0 0
                                0      .24167 .75833 0 0
                                0      0      0      1 0" />
                </filter>
            </defs>
        </svg>
        <CircularSlider key="stage4" size={2.5} onChange={(index, angle) => handleSliderChange('stage4', index, angle)} knobs={6} />
    </div>,
    <CircularSlider key="stage5" size={2.5} onChange={(index, angle) => handleSliderChange('stage5', index, angle)} knobs={6} />,
    <CircularSlider key="stage6" size={2.5} onChange={(index, angle) => handleSliderChange('stage6', index, angle)} knobs={6} />
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Typography variant="h3" style={{ textAlign: 'center', marginTop: '5vh' }}>What is Yellow?</Typography>
      <Typography variant="h6" style={{ textAlign: 'center'}}>Variant {activeStep + 1}</Typography>
      <div className="stage" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {stages[activeStep]}
      </div>
      <MobileStepper 
        steps={6} 
        activeStep={activeStep} 
        color="primary"
        position="static"
        style={{ justifyContent: 'center', alignItems: 'center', marginBottom: '10vh' }}
      />
      <SubmitBar hasSubmitted={submitted} onNext={() => handleNext()} onSubmit={() => handleSubmit(activeStep + 1)} currentStage={activeStep + 1} numStages={6} style={{ position: 'fixed', bottom: 0, width: '100%' }} />
    </div>
  );
}

export default SliderStages;
