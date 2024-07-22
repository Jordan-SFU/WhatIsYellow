import { AppBar, Toolbar, Typography, Button } from "@mui/material/";

const SubmitBar = ({onSubmit, onNext, hasSubmitted, currentStage, numStages}) => {
  return (
    <AppBar position="fixed" style={{ top: 'auto', bottom: 0, height: '10vh', justifyContent: 'center', alignItems: 'center' }}>
      <Toolbar>
        {!hasSubmitted ? 
        <Button color="inherit" onClick={onSubmit}>Submit</Button> 
        : 
        <>
            <Typography variant="h6">thanks, very cool!</Typography>
            {currentStage < numStages ? <Button color="inherit" onClick={onNext}>Next</Button> : null}
        </>}
      </Toolbar>
    </AppBar>
  );
}

export default SubmitBar;