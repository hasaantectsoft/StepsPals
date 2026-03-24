/* eslint-disable react-native/no-inline-styles */


import React, { useEffect } from 'react';
import './src/locals/i18n';
import { Provider } from 'react-redux';
import { AppState, Platform, StatusBar } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import { QueryClient, QueryClientProvider, onlineManager } from 'react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './src/navigation';
import { store, persistedStore } from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { pauseBackgroundSound, preloadSounds, releaseSounds, resumeBackgroundSound, startAppSound } from './src/utils/SoundManager/SoundManager'
import { authorizeHealthKit } from './src/healthkit';
import HealthKitInitializer from './src/HealthKitInitializer';

export default function App() {
  const queryClient = new QueryClient();
  onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
      setOnline(state.isConnected);
    });
  });


  useEffect(() => {
    if (Platform.OS === 'ios') authorizeHealthKit();

    preloadSounds();

    // Small delay to ensure sounds are loaded before playing
    const timer = setTimeout(() => {
      startAppSound();
    }, 500);

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        pauseBackgroundSound();
      } else if (nextAppState === 'active') {
        resumeBackgroundSound();
      }
    });

    return () => {
      clearTimeout(timer);
      subscription.remove();
      releaseSounds();
    };
  }, []);



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistedStore}>
            <SafeAreaProvider>
              <StatusBar barStyle="dark-content" backgroundColor="transparent" />
              <AppNavigation />
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}


