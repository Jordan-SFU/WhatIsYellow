import CircularSlider from "./CircularSlider";
import SubmitBar from "./SubmitBar";
import { useState } from "react";
import React from "react";
import { MobileStepper, Button, Typography } from "@mui/material/";
import { ProtanopiaFilter, ProtanomalyFilter, DeuteranopiaFilter, DeuteranomalyFilter, TritanopiaFilter, TritanomalyFilter, AchromatopsiaFilter, AchromatomalyFilter } from "./Filters";
import './CircularSlider.css';

const SliderStages = () => {
  const [sliderValues, setSliderValues] = useState({
    stage1: [0, 0, 0, 0, 0, 0],
    stage2: [0, 0, 0, 0, 0, 0],
    stage3: [0, 0, 0, 0, 0, 0],
    stage4: [0, 0, 0, 0, 0, 0],
    stage5: [0, 0, 0, 0, 0, 0],
    stage6: [0, 0, 0, 0, 0, 0],
    stage7: [0, 0, 0, 0, 0, 0],
    stage8: [0, 0, 0, 0, 0, 0],
    stage9: [0, 0, 0, 0, 0, 0]
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
    <div key="stage1">
      <CircularSlider key="stage1" size={2.5} onChange={(index, angle) => handleSliderChange('stage1', index, angle)} knobs={6} angleOffset={30} />
    </div>,
    <div key="stage2" className="protanopia">
      <ProtanopiaFilter />
      <CircularSlider key="stage2" size={2.5} onChange={(index, angle) => handleSliderChange('stage2', index, angle)} knobs={6} />
    </div>,
    <div key="stage3" className="protanomaly">
      <ProtanomalyFilter />
      <CircularSlider key="stage3" size={2.5} onChange={(index, angle) => handleSliderChange('stage3', index, angle)} knobs={6} />
    </div>,
    <div key="stage4" className="deuteranopia">
      <DeuteranopiaFilter />
      <CircularSlider key="stage4" size={2.5} onChange={(index, angle) => handleSliderChange('stage4', index, angle)} knobs={6} />
    </div>,
    <div key="stage5" className="deuteranomaly">
      <DeuteranomalyFilter />
      <CircularSlider key="stage5" size={2.5} onChange={(index, angle) => handleSliderChange('stage5', index, angle)} knobs={6} />
    </div>,
    <div key="stage6" className="tritanopia">
      <TritanopiaFilter />
      <CircularSlider key="stage6" size={2.5} onChange={(index, angle) => handleSliderChange('stage6', index, angle)} knobs={6} />
    </div>,
    <div key="stage7" className="tritanomaly">
      <TritanomalyFilter />
      <CircularSlider key="stage7" size={2.5} onChange={(index, angle) => handleSliderChange('stage7', index, angle)} knobs={6} />
    </div>,
    <div key="stage8" className="achromatopsia">
      <AchromatopsiaFilter />
      <CircularSlider key="stage8" size={2.5} onChange={(index, angle) => handleSliderChange('stage8', index, angle)} knobs={6} />
    </div>,
    <div key="stage9" className="achromatomaly">
      <AchromatomalyFilter />
      <CircularSlider key="stage9" size={2.5} onChange={(index, angle) => handleSliderChange('stage9', index, angle)} knobs={6} />
    </div>
  ];

  const types = [
    "Normal",
    "Protanopia",
    "Protanomaly",
    "Deuteranopia",
    "Deuteranomaly",
    "Tritanopia",
    "Tritanomaly",
    "Achromatopsia",
    "Achromatomaly"
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Typography variant="h3" style={{ textAlign: 'center', marginTop: '5vh' }}>What is Yellow?</Typography>
      <Typography variant="h6" style={{ textAlign: 'center' }}>{types[activeStep]}</Typography>
      <div key={activeStep} className="CircularSlider" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {stages[activeStep]}
      </div>
      <MobileStepper
        steps={9}
        activeStep={activeStep}
        color="primary"
        position="static"
        style={{ justifyContent: 'center', alignItems: 'center', marginBottom: '10vh', backgroundColor: 'transparent' }}
      />
      <SubmitBar hasSubmitted={submitted} onNext={() => handleNext()} onSubmit={() => handleSubmit(activeStep + 1)} currentStage={activeStep + 1} numStages={9} style={{ position: 'fixed', bottom: 0, width: '100%' }} />
    </div>
  );
}

export default SliderStages;
