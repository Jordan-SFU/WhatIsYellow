import * as React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import './Home.css';
import StartIcon from '@mui/icons-material/Start';
import AdditionalGamesBar from './AdditionalGamesBar';

const Home = () => {
    return (
        <div className="home">
            <Typography variant="h1" style={{ color: 'var(--primary-color)', fontFamily: 'Shantell Sans', fontSize: '7.5em' }}>what is yellow?</Typography>
            <div className="title">
                <Typography variant="h3" style={{ fontFamily: 'Shantell Sans' }}>
                    a game about <span className="rainbow-text">
                        <span className="c">c</span>
                        <span className="o1">o</span>
                        <span className="l">l</span>
                        <span className="o2">o</span>
                        <span className="u">u</span>
                        <span className="r">r</span>
                    </span>
                </Typography>
            </div>
            <div className= 'start-button'>
                <Link to="/play">
                    <Button style={{color: 'white'}}>
                        <StartIcon style={{ width: '50px', height: 'auto'}} />
                    </Button>
                </Link>
            </div>
            <AdditionalGamesBar />
        </div>
    );
};

export default Home;