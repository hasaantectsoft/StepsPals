import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';

import { Styles } from './MessageBoxStyles';
import { images } from '../../assets/images';

export default function MessageBox({
  star = false,
  text,
  style,
  textStyle,
  numberOfLines = 4,
}) {
  const [visible, setVisible] = useState(false);

  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!text) return;

    setVisible(true);

    // Reset animation values
    scale.setValue(0.5);
    opacity.setValue(0);

    // Pop-in animation
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after 2s with fade-out
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [text]);

  if (!text || !visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        Styles.container,
        style,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <ImageBackground
        source={star ? images.starmesagebox : images.messagebox}
        resizeMode="contain"
        style={Styles.background}
        imageStyle={Styles.image}
      >
        <Text style={[Styles.text, textStyle]} numberOfLines={numberOfLines}>
          {text}
        </Text>
      </ImageBackground>
    </Animated.View>
  );
}