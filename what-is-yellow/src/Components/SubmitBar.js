import { AppBar, Toolbar, Typography, Button } from "@mui/material/";

const SubmitBar = ({onSubmit}) => {
  return (
    <AppBar position="fixed" style={{ top: 'auto', bottom: 0, height: '10vh', justifyContent: 'center', alignItems: 'center' }}>
      <Toolbar>
        <Button color="inherit" onClick={onSubmit}>Submit</Button>
      </Toolbar>
    </AppBar>
  );
}

export default SubmitBar;