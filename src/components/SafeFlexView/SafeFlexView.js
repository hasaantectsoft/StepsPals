import React from 'react';
import {View} from 'react-native';

import styles from './SafeFlexViewStyle';

export default function SafeFlexView({children}) {
  return <View style={styles.container}>{children}</View>;
}
