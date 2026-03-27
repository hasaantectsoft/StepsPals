import { Platform } from 'react-native';
import {
  initialize,
  requestPermission,
  getGrantedPermissions,
  readRecords ,
} from 'react-native-health-connect';



export const initializeHealthConnect = async () => {
  if (Platform.OS !== 'android') return { initialized: false };

  try {
    const initialized = await initialize();
    console.log('Health Connect initialized:', initialized);
    return { initialized };
  } catch (error) {
    console.error('Error initializing Health Connect:', error);
    const msg = (error?.message || String(error)).toLowerCase();
    const notInstalled =
      msg.includes('not installed') ||
      msg.includes('not found') ||
      msg.includes('unavailable') ||
      msg.includes('resolution_required');
    return { initialized: false, notInstalled };
  }
};

/**
 * Request necessary permissions for Steps & Background Access
 */
export const requestPermissions = async () => {
  console.log('Requesting Health Connect permissions');

  try {
    const permissions = await requestPermission([
      {
        accessType: 'read',
        recordType: 'Steps',
      },
      {
        accessType: 'read',
        recordType: 'BackgroundAccessPermission', 
      },
    ]);

    console.log('Granted permissions:', permissions);
    return permissions;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return [];
  }
};

/**
 * Check if background access is granted
 */
export const checkBackgroundAccess = async () => {
  console.log('Checking Health Connect background access');

  try {
    const permissions = await getGrantedPermissions();
    const hasBackgroundAccess = permissions.some(
      (permission) =>
        permission.accessType === 'read' &&
        permission.recordType === 'BackgroundAccessPermission'
    );

    console.log('Has background access:', hasBackgroundAccess);
    return hasBackgroundAccess;
  } catch (error) {
    console.error('Error checking background access:', error);
    return false;
  }
};





/**
 * Get steps data for today
 */
export const getTodaySteps = async () => {
  try {
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // start of today

    const { records } = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startOfDay.toISOString(),
        endTime: now.toISOString(),
      },
    });

    // Sum all steps for today
    const totalSteps = records.reduce((sum, record) => sum + (record.count || 0), 0);

    console.log('Total steps today:', totalSteps);
    return totalSteps;
  } catch (error) {
    console.error('Error reading steps:', error);
    return 0;
  }
};