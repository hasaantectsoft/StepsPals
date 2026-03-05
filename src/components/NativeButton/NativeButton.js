import React from 'react';
import { TouchableOpacity, Text, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';

import styles from './NativeButtonStyles';

const NativeButton = ({
  onPress,
  title,
  containerStyle,
  titleStyle,
  disabled,
  image, // new prop
}) => {
  const Content = (
    <Text style={[styles.buttonText, titleStyle]}>{title}</Text>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={disabled}
      style={[styles.button, containerStyle]}
      onPress={onPress}
    >
      {image ? (
        <ImageBackground source={image} style={styles.imageBackground} imageStyle={styles.imageBackground}>
          {Content}
        </ImageBackground>
      ) : (
        Content
      )}
    </TouchableOpacity>
  );
};

export default NativeButton;

NativeButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  containerStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  disabled: PropTypes.bool,
  image: PropTypes.any,
};

NativeButton.defaultProps = {
  disabled: false,
  titleStyle: {},
  containerStyle: {},
  image: null,
};