import React from 'react';
import {View, Text} from 'react-native';

import {useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';

import getStyles from './Style';
import {updateAppTheme} from '../../utils/handlers/themeHandler';

export default function ThemeManager() {
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text
        style={styles.buttonText}
        onPress={() => updateAppTheme(dispatch, 'dark')}>
        Use Dark Mode
      </Text>
      <Text
        onPress={() => updateAppTheme(dispatch, 'light')}
        style={styles.buttonText}>
        Use Light Mode
      </Text>
      <Text
        style={styles.buttonText}
        onPress={() => updateAppTheme(dispatch, 'system')}>
        Use System Theme
      </Text>
    </View>
  );
}
