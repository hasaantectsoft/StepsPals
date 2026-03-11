import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'reduxjs-toolkit-persist';
import EncryptedStorage from 'react-native-encrypted-storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';

import userSlice from './slices/userSlice';
import cartSlice from './slices/cartSlice';
import themeSlice from './slices/themeSlice';
import authSlice from './slices/authSlice';
import tutorialSlice from './slices/tutorialslice';
import petSlice from './slices/petslice';
import progressSlice from './slices/progressSlice';
import soundSlice from './slices/soundSlice';

const persistConfig = {
  key: 'root',
  storage: EncryptedStorage,
  stateReconciler: autoMergeLevel1,
};

const reducers = combineReducers({
  userReducer: userSlice,
  cartReducer: cartSlice,
  themeReducer: themeSlice,
  authReducer: authSlice,
  tutorialReducer: tutorialSlice,
  petReducer: petSlice,
  progressReducer: progressSlice,
  soundReducer:soundSlice
  });

const _persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: _persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        /* ignore persistance actions */
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistedStore = persistStore(store);
