import { Platform } from 'react-native';
import { checkBackgroundAccess, getTodaySteps, initializeHealthConnect, requestPermissions } from '../StepCounter';
import { NativeModules } from 'react-native';

export const HEALTH_CONNECT_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata';

export const fetchSteps = async () => {
  if (Platform.OS !== 'android') return { granted: false };

  try {
    const { initialized, notInstalled } = await initializeHealthConnect();
    if (notInstalled) return { granted: false, notInstalled: true };
    if (!initialized) return { granted: false };

    const hasAccess = await checkBackgroundAccess();
    if (!hasAccess) {
      await requestPermissions();
      const granted = await checkBackgroundAccess();
      if (!granted) return { granted: false };
    }

    const steps = await getTodaySteps();
    if (NativeModules.StepWidget?.updateSteps) {
      NativeModules.StepWidget.updateSteps(steps);
    }
    return { granted: true, steps };
  } catch (error) {
    return { granted: false };
  }
};