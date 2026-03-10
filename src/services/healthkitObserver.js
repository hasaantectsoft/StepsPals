import AppleHealthKit from 'react-native-health';
import { NativeAppEventEmitter, Platform } from 'react-native';

export function startHealthKitObservers() {
  if (Platform.OS !== 'ios') return () => {};

  if (!AppleHealthKit || typeof AppleHealthKit.setObserver !== 'function') {
    return () => {};
  }

  try {
    AppleHealthKit.setObserver({ type: 'Walking' });

    const subscription = NativeAppEventEmitter.addListener(
      'healthKit:Walking:new',
      (res) => {
        console.log(res);
      }
    );

    return () => subscription.remove();
  } catch (error) {
    console.warn('Failed to start HealthKit observers', error);
    return () => {};
  }
}

export function initHealthKitPermissions(callback) {
  if (Platform.OS !== 'ios') {
    callback && callback(false);
    return;
  }

  if (!AppleHealthKit || typeof AppleHealthKit.initializeHealthKit !== 'function') {
    callback && callback(false);
    return;
  }

  const permissions = {
    permissions: {
      read: [AppleHealthKit.Constants.Permissions.Steps],
      write: [AppleHealthKit.Constants.Permissions.Steps],
    },
  };

  AppleHealthKit.initializeHealthKit(permissions, (err) => {
    if (err) {
      console.warn('HealthKit init error:', err);
      callback && callback(false);
      return;
    }
    console.log('HealthKit initialized');
    callback && callback(true);
  });
}