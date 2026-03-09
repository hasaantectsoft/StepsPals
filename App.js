

import React, { useEffect } from 'react';
import './src/locals/i18n';
import {Provider} from 'react-redux';
import {StatusBar} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {PersistGate} from 'reduxjs-toolkit-persist/integration/react';
import {QueryClient, QueryClientProvider, onlineManager} from 'react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigation from './src/navigation';
import {store, persistedStore} from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {playBackgroundSound, startAppSound} from './src/utils/SoundManager/SoundManager'

export default function App() {
  const queryClient = new QueryClient();
  // For React Query auto refetch on reconnect behavior in React Native you have to use React Query onlineManager
  onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
      setOnline(state.isConnected);
    });
  });


  useEffect(() => {
    startAppSound(); 
  },[] );

  return (
   <GestureHandlerRootView style={{flex: 1}}> 
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


