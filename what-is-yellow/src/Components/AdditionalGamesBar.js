import React from 'react';
import '../index.css';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const AdditionalGamesBar = () => {
    return (
        <AppBar position="fixed" style={{ top: 'auto', bottom: 0, height: '10vh', justifyContent: 'center', alignItems: 'center' }}>
            <Toolbar>
                <div className="additional-games">
                    <Link to="/colour-blind">
                        <Button style={{ color: 'white' }}>
                            Colour Blind
                        </Button>
                    </Link>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default AdditionalGamesBar;