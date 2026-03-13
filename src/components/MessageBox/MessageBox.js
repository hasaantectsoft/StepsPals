import React from 'react';
import {View, Text, ImageBackground} from 'react-native';

import {Styles} from './MessageBoxStyles';
import { images } from '../../assets/images';


export default function MessageBox({star=false,text, style, textStyle, numberOfLines = 4}) {
  if (!text) {
    return null;
  }

  return (
    <View style={[Styles.container, style]}>
      <ImageBackground
        source={star ? images.starmesagebox : images.messagebox}
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

// 