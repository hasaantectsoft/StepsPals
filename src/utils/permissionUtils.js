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
import { authorizationStatusFor } from '@kingstinct/react-native-healthkit';
import { Linking } from 'react-native';

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
        console.log('requesting health permission (ios) - checking status');

        const status = await authorizationStatusFor('HKQuantityTypeIdentifierStepCount');
        // 0 = NOTDETERMINED, 1 = SHARINGDENIED, 2 = SHARINGAUTHORIZED
        if (status === 2) {
          return true;
        }

        if (status === 1) {
          // Previously denied — open app settings so user can enable access
          console.log('HealthKit sharing denied - opening app settings');
          try {
            await Linking.openSettings();
          } catch (err) {
            console.warn('Unable to open settings', err);
          }
          return false;
        }

        // Not determined -> request authorization
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
