import { Platform } from 'react-native';
import {
  RESULTS,
  PERMISSIONS,
  request,
  requestMultiple,
  requestNotifications,
  requestLocationAccuracy,
  openSettings,
} from 'react-native-permissions';

const handlePermission = result => {
  let isPermitted = false;
  switch (result) {
    case RESULTS.UNAVAILABLE:
     
      break;
    case RESULTS.DENIED:
     
      break;
    case RESULTS.LIMITED:
     
      isPermitted = true;
      break;
    case RESULTS.GRANTED:
     
      isPermitted = true;
      break;
    case RESULTS.BLOCKED:
      break;
  }
  return isPermitted;
};

const permissionUtils = {
  getSinglePermission: async permission => {
    let isPermitted = false;
    try {
      const result = await request(permission);
      return handlePermission(result);
    } catch (error) {
      return isPermitted;
    }
  },
  getMultiplePermission: async permissions => {
    let isPermitted = false;

    try {
      const results = await requestMultiple(permissions);

      for (let i = 0; i < permissions.length; i++) {
        isPermitted = handlePermission(results[permissions[i]]) || isPermitted;
      }

      return isPermitted;
    } catch (error) {
      return isPermitted;
    }
  },
  requestNotificationPermission: async () => {
    try {
      const { status } = await requestNotifications(['alert', 'badge', 'sound']);
      return status === 'granted';
    } catch {
      return false;
    }
  },
  requestHealthPermission: async () => {
    if (Platform.OS === 'android') {
      const result = await request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
      return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
    }
    
    if (Platform.OS === 'ios') {
      try {
        const { initHealthKitPermissions } = require('../services/healthkitObserver');
        const granted = await new Promise(resolve => {
          try {
            initHealthKitPermissions(success => resolve(!!success));
          } catch (e) {
            resolve(false);
          }
        });
        if (!granted) {
          openSettings();
          return false;
        }
        return true;
      } catch (e) {
        console.log('Health permission error:', e);
        openSettings();
        return false;
      }
    }
    return false;
  },
  openSettings,
  requestLocationAccuracyPermission: async () => {
    try {
      const accuracy = await requestLocationAccuracy({
        purposeKey:
          'Need to fetch your location to show active route between two points',
      });
      if (
        accuracy === 'denied' ||
        accuracy === 'blocked' ||
        accuracy === 'unavailable'
      ) {
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

export default permissionUtils;
