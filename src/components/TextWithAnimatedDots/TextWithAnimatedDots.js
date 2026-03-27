import React, {useState, useEffect} from 'react';
import {Text, Animated} from 'react-native';

import PropTypes from 'prop-types';

import styles from './TextWithAnimatedDotsStyle';

export default function TextWithAnimatedDots({animating, label}) {
  const [dotsAnimation] = useState(new Animated.Value(0));
  const dots = [...Array(3).keys()];

  useEffect(() => {
    if (animating) {
      const startDotsAnimation = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dotsAnimation, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(dotsAnimation, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          {iterations: -1},
        )?.start();
      };
      startDotsAnimation();
    } else {
      dotsAnimation?.stopAnimation();
    }
  }, [dotsAnimation, animating]);

  return (
    <Animated.View style={styles.animatedLine}>
      <Text style={styles.loadingText}>{label}</Text>
      {dots.map(index => (
        <Animated.Text
          key={index}
          style={{
            ...styles.loadingText,
            opacity: dotsAnimation,
            transform: [
              {
                translateX: dotsAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 10 * (index + 1)],
                }),
              },
            ],
          }}>
          .
        </Animated.Text>
      ))}
    </Animated.View>
  );
}

TextWithAnimatedDots.propTypes = {
  animating: PropTypes.bool,
  label: PropTypes.string,
};

TextWithAnimatedDots.defaultProps = {
  animating: false,
  label: 'Loading',
};
