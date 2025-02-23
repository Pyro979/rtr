import React from 'react';
import IconButton from './IconButton';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <img src="./die_white_bg.jpg" id="hero-die" alt="logo" />
      <h1>RtR: Random Table Roller</h1>
      <h3>for D&D and other TTRPGs</h3>
      <IconButton to="/import" className="large" />
      <p>Create, manage, and roll on custom random tables for your tabletop roleplaying games.</p>
    </div>
  );
};

export default Home;
