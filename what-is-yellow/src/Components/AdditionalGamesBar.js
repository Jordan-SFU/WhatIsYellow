import React from 'react';
import './AdditionalGamesBar.css';
import { Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import GamesIcon from '@mui/icons-material/Games';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import ColorizeIcon from '@mui/icons-material/Colorize';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArticleIcon from '@mui/icons-material/Article';

const games = [
    {
        name: 'Colour Blind',
        route: '/colour-blind',
        description: 'Can you tell colours apart while being colourblind?',
        icon: <VisibilityOffIcon />
    }
];

const AdditionalGamesBar = () => {
    return (
        <div className="additional-games-bar">
            <Typography variant="h6" className="bar-title" style={{fontFamily: "Shantell Sans", fontSize: "1em"}}>
                try out these variants!
                <div className='down-arrow'>
                    <ArrowDownwardIcon/>
                </div>
            </Typography>
            <div className="additional-games">
                {games.map(game => (
                    <Link key={game.name} to={game.route} style={{ margin: '0 10px' }}>
                        <div className="game-preview">
                            <IconButton>
                                {game.icon}
                            </IconButton>
                            <div className="game-description">{game.description}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AdditionalGamesBar;
