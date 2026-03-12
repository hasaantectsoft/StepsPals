import { Platform } from 'react-native';
import { checkBackgroundAccess, getTodaySteps, initializeHealthConnect, requestPermissions } from '../StepCounter';
import { NativeModules } from 'react-native';

export const fetchSteps = async () => {
  if (Platform.OS !== 'android') return { granted: false };

  try {
    const initialized = await initializeHealthConnect();
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