import * as React from 'react';
import { Route, Link } from 'react-router-dom';

// home page with two buttons: one for colour blind and one for normal vision
const Home = () => {
  return (
    <div className="home" style={{zIndex: 1}}>
      <h1>What is Yellow?</h1>
      <div className="home-buttons">
        <Link to="/colour-blind">
          <button>Colour Blind</button>
        </Link>
        <Link to="/normal-vision">
          <button>Normal Vision</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;