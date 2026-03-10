import React from 'react';
import {View, Text, ImageBackground} from 'react-native';

import {Styles} from './MessageBoxStyles';
import { images } from '../../assets/images';


export default function MessageBox({text, style, textStyle, numberOfLines = 3}) {
  if (!text) {
    return null;
  }

  return (
    <View style={[Styles.container, style]}>
      <ImageBackground
        source={images.messagebox}
        resizeMode="contain"
        style={Styles.background}
        imageStyle={Styles.image}>
        <Text style={[Styles.text, textStyle]} numberOfLines={numberOfLines}>
          {text}
        </Text>
      </ImageBackground>
    </View>
  );
}

