import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styles from './NativeButton2Styles';

const NativeButton2 = ({
  title,
  subtitle,
  description,
  borderColor = '#FFFFFF',
  onPress,
  containerStyle,
  titleStyle,
  subtitleStyle,
  descriptionStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, containerStyle, { borderColor }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        
        {subtitle && (
          <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
        )}
        
        {description && (
          <Text style={[styles.description, descriptionStyle]}>{description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NativeButton2;

NativeButton2.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  borderColor: PropTypes.string,
  onPress: PropTypes.func,
  containerStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  subtitleStyle: PropTypes.object,
  descriptionStyle: PropTypes.object,
  disabled: PropTypes.bool,
};

NativeButton2.defaultProps = {
  borderColor: '#FFFFFF',
  disabled: false,
  containerStyle: {},
  titleStyle: {},
  subtitleStyle: {},
  descriptionStyle: {},
};
