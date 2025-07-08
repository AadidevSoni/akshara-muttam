import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [loadingScreen, setLoadingScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='homeContainer'>
      {loadingScreen && (
        <div className="initial-loading-screen">
          <div className="loader-circle"></div>
          <p className="loading-text">Loading Home Screen...</p>
        </div>
      )}

      <div className="video-wrapper">
        <video
          autoPlay
          muted
          loop
          className="video-background"
          playsInline
        >
          <source src="/videos/footballer.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="homeContent">
        <h1 className='homeTitle'>
          Welcome to <br />
          <span className='academyName'>GRO ACADEMY</span>
        </h1>
        <p className="homeSubtitle">
          Training future champions with dedication, discipline, and skill.
        </p>
      </div>
    </div>
  );
};

export default Home;
