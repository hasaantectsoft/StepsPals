import React from 'react';
import {View, ActivityIndicator} from 'react-native';

import PropTypes from 'prop-types';

import {Theme} from '../../libs';
import styles from './CenteralLoaderStyle';

export default function CenteralLoader({color}) {
  return (
    <View style={styles.centerFlex}>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
}

CenteralLoader.propTypes = {
  color: PropTypes.string,
};

CenteralLoader.defaultProps = {
  color: Theme.colors.primary,
};
