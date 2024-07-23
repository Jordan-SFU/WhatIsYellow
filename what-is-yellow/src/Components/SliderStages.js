import CircularSlider from "./CircularSlider";
import SubmitBar from "./SubmitBar";
import '../index.css';
import { useState } from "react";
import db from "../Firebase";
import { onSnapshot, collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import React from "react";
import { MobileStepper, Button, Typography } from "@mui/material/";
import { ProtanopiaFilter, DeuteranopiaFilter, TritanopiaFilter } from "./Filters";
import InfoIcon from '@mui/icons-material/Info';

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
  const [newRegions, setNewRegions] = useState(null);

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
      setNewRegions(currentValues);
      return;
    }

    let n = docSnap.data().n;
    let regions = docSnap.data()["Regions"];

    // Calculate new regions
    const newRegions = regions.map((region, index) => {
      const a = region;
      const b = currentValues[index];

      const radiansA = a * Math.PI / 180;
      const radiansB = b * Math.PI / 180;

      const sinA = Math.sin(radiansA) * n;
      const cosA = Math.cos(radiansA) * n;
      const sinB = Math.sin(radiansB);
      const cosB = Math.cos(radiansB);

      const total_sin = sinA + sinB;
      const total_cos = cosA + cosB;

      const mean_rad = Math.atan2(total_sin, total_cos);

      const angle = Math.round(mean_rad * 180 / Math.PI);

      return angle < 0 ? angle + 360 : angle;
    });

    await setDoc(docRef, { "Regions": newRegions, n: n + 1 });

    setSubmitted(true);
    setNewRegions(newRegions);
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
    <CircularSlider key="stage1" size={2.5} onChange={(index, angle) => handleSliderChange('stage1', index, angle)} knobs={2} textValues={["yellow", "not yellow"]} />,
    <CircularSlider key="stage2" size={2.5} onChange={(index, angle) => handleSliderChange('stage2', index, angle)} knobs={6} />,
    <CircularSlider key="stage3" size={2.5} onChange={(index, angle) => handleSliderChange('stage3', index, angle)} knobs={7} textValues={["red", "orange", "yellow", "green", "blue", "indigo", "purple"]} />,
    <div className="protanopia">
      <ProtanopiaFilter />
      <CircularSlider key="stage4" size={2.5} onChange={(index, angle) => handleSliderChange('stage4', index, angle)} knobs={6} />
    </div>,
    <div className="deuteranopia">
      <DeuteranopiaFilter />
      <CircularSlider key="stage5" size={2.5} onChange={(index, angle) => handleSliderChange('stage5', index, angle)} knobs={6} />
    </div>,
    <div className="tritanopia">
      <TritanopiaFilter />
      <CircularSlider key="stage6" size={2.5} onChange={(index, angle) => handleSliderChange('stage6', index, angle)} knobs={6} />
    </div>
  ];

  function renderSliderStage(activeStep, newRegions, handleSliderChange, submitted) {
    if (!submitted) return null;

    switch (activeStep) {
      case 0:
        return <CircularSlider key="stage1res" size={2.5} onChange={(index, angle) => handleSliderChange('stage1', index, angle)} knobs={2} textValues={["yellow", "not yellow"]} readOnly={true} initialPositions={sliderValues['stage' + (activeStep + 1)]} extraDisplays={newRegions} />;
      case 1:
        return <CircularSlider key="stage2res" size={2.5} onChange={(index, angle) => handleSliderChange('stage2', index, angle)} knobs={6} readOnly={true} initialPositions={sliderValues['stage' + (activeStep + 1)]} extraDisplays={newRegions} />;
      case 2:
        return <CircularSlider key="stage3res" size={2.5} onChange={(index, angle) => handleSliderChange('stage3', index, angle)} knobs={7} textValues={["red", "orange", "yellow", "green", "blue", "indigo", "purple"]} readOnly={true} initialPositions={sliderValues['stage' + (activeStep + 1)]} extraDisplays={newRegions} />;
      case 3:
        return (
          <div className="protanopia">
            <ProtanopiaFilter />
            <CircularSlider key="stage4res" size={2.5} onChange={(index, angle) => handleSliderChange('stage4', index, angle)} knobs={6} readOnly={true} initialPositions={sliderValues['stage' + (activeStep + 1)]} extraDisplays={newRegions} />
          </div>
        );
      case 4:
        return (
          <div className="deuteranopia">
            <DeuteranopiaFilter />
            <CircularSlider key="stage5res" size={2.5} onChange={(index, angle) => handleSliderChange('stage5', index, angle)} knobs={6} readOnly={true} initialPositions={sliderValues['stage' + (activeStep + 1)]} extraDisplays={newRegions} />
          </div>
        );
      case 5:
        return (
          <div className="tritanopia">
            <TritanopiaFilter />
            <CircularSlider key="stage6res" size={2.5} onChange={(index, angle) => handleSliderChange('stage6', index, angle)} knobs={6} readOnly={true} initialPositions={sliderValues['stage' + (activeStep + 1)]} extraDisplays={newRegions} />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Typography variant="h3" style={{ textAlign: 'center', marginTop: '5vh' }}>What is Yellow?</Typography>
      <Typography variant="h6" style={{ textAlign: 'center' }}>Variant {activeStep + 1}</Typography>
      <div key={activeStep} className="CircularSlider" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="info-icon">
          <InfoIcon style={{ fontSize: '2.5em' }} />
          <div className="info-box">
            drag the sliders or use the scroll wheel to adjust the regions
          </div>
        </div>
        {!submitted ? stages[activeStep] : renderSliderStage(activeStep, newRegions, handleSliderChange, submitted)}
      </div>
      <MobileStepper
        steps={6}
        activeStep={activeStep}
        color="primary"
        position="static"
        style={{ justifyContent: 'center', alignItems: 'center', marginBottom: '10vh', backgroundColor: 'transparent' }}
      />
      <SubmitBar hasSubmitted={submitted} onNext={() => handleNext()} onSubmit={() => handleSubmit(activeStep + 1)} currentStage={activeStep + 1} numStages={6} style={{ position: 'fixed', bottom: 0, width: '100%' }} />
    </div>
  );
}

export default SliderStages;
