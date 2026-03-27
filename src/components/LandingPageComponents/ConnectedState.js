import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { StartButton } from "../StartButton/StartButton";
import { Image } from "react-native";
import { images } from "../../assets/images";
import { styles } from "./ConnectedStateStyles";

const LOADING_STEPS = [0, 90, 100];

export const ConnectedState = ({ onStart }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const percentage = LOADING_STEPS[stepIndex];

  useEffect(() => {
    let startTimeout;
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(interval);
          startTimeout = setTimeout(() => onStart(), 250);
          return prev;
        }
        return prev + 1;
      });
    }, 350);

    return () => {
      clearInterval(interval);
      if (startTimeout) {
        clearTimeout(startTimeout);
      }
    };
  }, [onStart]);

  const loadingImage =
    percentage >= 100
      ? images.loading100
      : percentage >= 90
      ? images.loading90
      : images.loadingzero;

  return (
    <>
      <StartButton onPress={onStart} label={`Loading ${percentage}%`} />
      <Image source={loadingImage} style={styles.loadingImage} />
    </>
  );
};

ConnectedState.propTypes = {
  onStart: PropTypes.func.isRequired,
};