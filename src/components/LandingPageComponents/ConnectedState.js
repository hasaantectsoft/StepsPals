import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { StartButton } from "../StartButton/StartButton";
import RetroLoader from "../Retroprogreebar/RetroProgressBar";

export const ConnectedState = ({ onStart }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 10) {  
          clearInterval(interval);
          onStart();       
          return 10;
        }
        return prev + 1;
      });
    }, 100); 

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <StartButton 
        onPress={onStart} 
        label={`Loading ${percentage * 10}%`} 
      />
      <RetroLoader progress={percentage} />
    </>
  );
};

ConnectedState.propTypes = {
  onStart: PropTypes.func.isRequired,
};