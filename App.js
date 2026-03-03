

import React from 'react';
import './src/locals/i18n';
import {Provider} from 'react-redux';
import {StatusBar, StyleSheet} from 'react-native';
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
            {/* <SafeAreaView style={styles.safeAreaFlex}> */}
             <StatusBar barStyle="dark-content" backgroundColor="transparent" />
              <AppNavigation />
            {/* </SafeAreaView> */}
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaFlex: {
    flexGrow: 1,
  },
});
