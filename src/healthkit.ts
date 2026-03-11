
import { requestAuthorization } from '@kingstinct/react-native-healthkit';

export async function authorizeHealthKit() {
  try {
    await requestAuthorization({
      toRead: [
        'HKQuantityTypeIdentifierStepCount',
        'HKQuantityTypeIdentifierHeartRate',
      ],
      toShare: [
        'HKQuantityTypeIdentifierBodyMassIndex',
      ],
    });
    return true;
  } catch (e) {
    console.warn('HealthKit authorization failed', e);
    return false;
  }
}

