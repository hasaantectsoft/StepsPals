import { readRecords } from 'react-native-health-connect';
import { NativeModules } from 'react-native';

const { HealthModule } = NativeModules;

/**
 * Enhanced step sync handler that integrates with Android background tasks
 */
export const initializeHealthSync = async () => {
  try {
    console.log('Initializing Health Connect sync');
    // Note: The actual background service scheduling happens on Android native side
    // This ensures React Native module is ready for receiving health data
    return true;
  } catch (error) {
    console.error('Error initializing health sync:', error);
    return false;
  }
};

export const getSteps = async () => {
  const now = new Date();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // Start of today

  try {
    const steps = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startOfDay.toISOString(),
        endTime: now.toISOString(),
      },
    });

    const totalSteps = steps.records.reduce((sum, record) => sum + record.count, 0);
    console.log('Total steps today:', totalSteps);
    return totalSteps;
  } catch (error) {
    console.error('Error reading steps from Health Connect:', error);
    throw error;
  }
};

/**
 * Get exercise records (physical activity)
 */
export const getExerciseSessions = async (startDate = null, endDate = null) => {
  const now = new Date();
  const start = startDate || new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days by default
  const end = endDate || now;

  try {
    const sessions = await readRecords('ExerciseSessions', {
      timeRangeFilter: {
        operator: 'between',
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      },
    });

    console.log('Exercise sessions:', sessions);
    return sessions.records || [];
  } catch (error) {
    console.error('Error reading exercise sessions:', error);
    throw error;
  }
};

/**
 * Trigger a manual sync with Health Connect (useful for testing)
 */
export const triggerManualSync = async () => {
  try {
    console.log('Triggering manual health data sync');
    // This can call into the HealthSyncManager on Android if needed
    if (HealthModule?.triggerSync) {
      await HealthModule.triggerSync();
    }
    return true;
  } catch (error) {
    console.error('Error triggering manual sync:', error);
    return false;
  }
};

/**
 * Cancel health sync
 */
export const cancelHealthSync = async () => {
  try {
    console.log('Cancelling health sync');
    if (HealthModule?.cancelSync) {
      await HealthModule.cancelSync();
    }
    return true;
  } catch (error) {
    console.error('Error cancelling health sync:', error);
    return false;
  }
};
