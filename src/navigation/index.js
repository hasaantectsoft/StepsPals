import React from 'react';
import { useColorScheme, View, Platform } from 'react-native';

import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { Theme } from '../libs';
import UnAuthStack from './UnAuthStack';
import AuthStack from './AuthStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { typography } = Theme;

const defaultFonts = Platform.select({
  ios: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '600' },
    heavy: { fontFamily: 'System', fontWeight: '700' },
  },
  android: {
    regular: { fontFamily: 'sans-serif', fontWeight: '400' },
    medium: { fontFamily: 'sans-serif-medium', fontWeight: '500' },
    bold: { fontFamily: 'sans-serif', fontWeight: '600' },
    heavy: { fontFamily: 'sans-serif', fontWeight: '700' },
  },
  default: {
    regular: { fontFamily: typography?.body?.fontFamily || 'System', fontWeight: '400' },
    medium: { fontFamily: typography?.body?.fontFamily || 'System', fontWeight: '500' },
    bold: { fontFamily: typography?.heading?.fontFamily || 'System', fontWeight: '600' },
    heavy: { fontFamily: typography?.heading?.fontFamily || 'System', fontWeight: '700' },
  },
});

export default function AppNavigation() {
  const { themeMode } = useSelector(state => state.themeReducer);
  const scheme = useColorScheme();
  let isDarkMode =
    (themeMode !== 'light' && scheme === 'dark') || themeMode === 'dark';
  const { colors } = Theme;
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
    fonts: defaultFonts,
  };

  // You can get auth value for redux, firebase auth or any other logic according to your logic
  const isSignedIn = useSelector(state => state.authReducer?.isSignedIn);
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer theme={MyTheme}>
      <View style={{ flex: 1, paddingBottom: Platform.OS === 'android' ? insets.bottom : 0 }}>
        {isSignedIn ? <AuthStack /> : <UnAuthStack />}
      </View>
    </NavigationContainer>
  );
}
