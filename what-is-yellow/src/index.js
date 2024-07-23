import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Home from './Components/Home';
import ColourBlindSliderStages from './Components/ColourBlindSliderStages';
import SliderStages from './Components/SliderStages';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/colour-blind',
    element: <ColourBlindSliderStages />,
  },
  {
    path: '/play',
    element: <SliderStages />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <RouterProvider router={router} />
  </React.StrictMode>
);
