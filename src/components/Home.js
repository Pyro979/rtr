import React from 'react';
import IconButton from './IconButton';
import { TEXT } from '../constants/text';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <img src="./die_white_bg.png" id="hero-die" alt="logo" />
      <h1>{TEXT.app.title}</h1>
      <h3>{TEXT.app.subtitle}</h3>
      <IconButton to="/import" className="large" text={TEXT.sidebar.importButton} />
      <p dangerouslySetInnerHTML={{ __html: TEXT.app.description }}></p>
    </div>
  );
};

export default Home;
