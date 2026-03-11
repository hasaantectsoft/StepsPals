import { Platform } from 'react-native';
import {
  RESULTS,
  PERMISSIONS,
  request,
  requestMultiple,
  requestNotifications,
} from 'react-native-permissions';
import { handlePermission } from './extra/handlePermission';
import { authorizeHealthKit } from '../healthkit';

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
      try {
        const result = await request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
        return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
      } catch (e) {
        console.log('Health permission error (android):', e);
        return false;
      }
    }

    if (Platform.OS === 'ios') {
      try {
        console.log('requesting health permission (ios)');
        const granted = await authorizeHealthKit();
        return !!granted;
      } catch (e) {
        console.log('Health permission error (ios):', e);
        return false;
      }
    }

    return false;
  },
};

export default permissionUtils;
