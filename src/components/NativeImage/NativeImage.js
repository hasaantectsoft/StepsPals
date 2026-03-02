import React from 'react';
import {TouchableOpacity, Image} from 'react-native';

import PropTypes from 'prop-types';

import styles from './NativeImageStyle';
import {devImage} from '../../utils/exports';

export default function NativeImage({
  onPress,
  containerStyle,
  disabled,
  source,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.imageWrapper, containerStyle]}>
      <Image
        source={{uri: source}}
        style={[styles.image, {borderRadius: containerStyle?.borderRadius}]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

NativeImage.propTypes = {
  onPress: PropTypes.func,
  containerStyle: PropTypes.object,
  disabled: PropTypes.bool,
};

// Define default values
NativeImage.defaultProps = {
  disabled: true,
  onPress: () => null,
  containerStyle: {},
  source: devImage,
};
