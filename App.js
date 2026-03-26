
import React, { useEffect } from 'react';
import './src/locals/i18n';
import { Provider } from 'react-redux';
import { AppState, Platform, StatusBar } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import { QueryClient, QueryClientProvider, onlineManager } from 'react-query';
import { SafeAreaProvider, SafeAreaView,  } from 'react-native-safe-area-context';
import AppNavigation from './src/navigation';
import { store, persistedStore } from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { pauseBackgroundSound, preloadSounds, releaseSounds, resumeBackgroundSound, startAppSound } from './src/utils/SoundManager/SoundManager'
import { authorizeHealthKit } from './src/healthkit';


export default function App() {
  const queryClient = new QueryClient();
  onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
      setOnline(state.isConnected);
    });
  });


  useEffect(() => {
    const syncStepsOnAppOpen = async () => {
      if (Platform.OS !== 'android') return;
      const { granted, steps } = await fetchSteps();
      if (!granted || steps == null) return;

      store.dispatch(setProgressStep(steps));
      store.dispatch(setStepCount(steps));
      store.dispatch(setDailyStepCount(steps));
      await syncStepCountToPlayFab(steps);
    };

    if (Platform.OS === 'ios') authorizeHealthKit();
    syncStepsOnAppOpen();

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
        syncStepsOnAppOpen();
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
              <SafeAreaView
                style={{ flex: 1 }}
                edges={[ ]}
              >
                <StatusBar  translucent barStyle="dark-content" backgroundColor="transparent" />
                <AppNavigation />
              </SafeAreaView>

            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}


