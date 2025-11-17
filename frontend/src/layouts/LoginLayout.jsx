import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LoginLayout.css";

import gif1 from "/assets/gifs/bg1.gif";
// import gif2 from "/assets/gifs/bg2.gif";
// import gif3 from "/assets/gifs/bg3.gif";
import gif4 from "/assets/gifs/bg4.gif";
// import gif5 from "/assets/gifs/bg5.gif";
import gif6 from "/assets/gifs/bg6.gif";

const gifs = [gif1, gif6, gif4];

const LoginLayout = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle through GIFs every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gifs.length);
    }, 5000); // change duration here
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="login-layout d-flex justify-content-center align-items-center">
      {/* Background container */}
      <div className="bg-slideshow">
        {gifs.map((gif, index) => (
          <img
            key={index}
            src={gif}
            alt={`background-${index}`}
            className={`bg-slide ${index === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="overlay"></div>

      {/* Centered login content */}
      <div className="login-content position-relative text-center">
        <Outlet />
      </div>
    </div>
  );
};

export default LoginLayout;
