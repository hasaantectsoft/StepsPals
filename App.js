

import React from 'react';

import {Provider} from 'react-redux';
import {StyleSheet} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {PersistGate} from 'reduxjs-toolkit-persist/integration/react';
import {QueryClient, QueryClientProvider, onlineManager} from 'react-query';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import AppNavigation from './src/navigation';
import {store, persistedStore} from './src/redux/store';

export default function App() {
  const queryClient = new QueryClient();
  // For React Query auto refetch on reconnect behavior in React Native you have to use React Query onlineManager
  onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
      setOnline(state.isConnected);
    });
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistedStore}>
          <SafeAreaProvider>
            <SafeAreaView style={styles.safeAreaFlex}>
              <AppNavigation />
            </SafeAreaView>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaFlex: {
    flex: 1,
  },
});
