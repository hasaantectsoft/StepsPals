import React from 'react';
import {useColorScheme} from 'react-native';

import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';

import {Theme} from '../libs';
import UnAuthStack from './UnAuthStack';
import AuthStack from './AuthStack';

export default function AppNavigation() {
  const {themeMode} = useSelector(state => state.themeReducer);
  // Make sure all of your app stack are wrapped inside this screen
  const scheme = useColorScheme();
  let isDarkMode =
    (themeMode !== 'light' && scheme === 'dark') || themeMode === 'dark';
  const {colors} = Theme;
  // My Theme will auto apply colors to background and text based on theme, otherwise you can also use color as desired in your file
  const MyTheme = {
    dark: isDarkMode,
    colors: {
      primary: colors.primary,
      background: isDarkMode ? colors.dark : colors.white,
      card: isDarkMode ? colors.dark : colors.white,
      text: isDarkMode ? colors.white : colors.text,
      border: isDarkMode ? colors.border : colors.grey,
      notification: colors.primary,
      transparent: isDarkMode
        ? colors.darkTransparent
        : colors.lightTransparent,
    },
  };

  // You can get auth value for redux, firebase auth or any other logic according to your logic
  const isSignedIn = false;

  // It's important to note that when using such a setup, you don't manually navigate to the Home screen by calling navigation.navigate('Home') or any other method. React Navigation will automatically navigate to the correct screen when isSignedIn changes - Home screen when isSignedIn becomes true, and to SignIn screen when isSignedIn becomes false. You'll get an error if you attempt to navigate manually.

  return (
    <NavigationContainer theme={MyTheme}>
      {isSignedIn ? <AuthStack /> : <UnAuthStack />}
    </NavigationContainer>
  );
}
