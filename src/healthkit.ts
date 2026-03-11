
import { requestAuthorization } from '@kingstinct/react-native-healthkit';

export async function authorizeHealthKit() {
  try {
    const granted = await requestAuthorization({
      toRead: [
        'HKQuantityTypeIdentifierStepCount',
        // 'HKQuantityTypeIdentifierHeartRate',
      ],
    //   toShare: [
    //     'HKQuantityTypeIdentifierBodyMassIndex',
    //   ],
    });
    return !!granted;
  } catch (e) {
    console.warn('HealthKit authorization failed', e);
    return false;
  }
}

