import { Platform } from 'react-native';
import { queryStatisticsForQuantity, isHealthDataAvailableAsync } from '@kingstinct/react-native-healthkit';
import { authorizeHealthKit } from '../../healthkit';

/**
 * Reads today's step count from HealthKit. Returns null if we should not update UI state
 * (e.g. auth failed). Returns 0 if authorized but no samples in range.
 */
export async function fetchTodayStepsIOS() {
  if (Platform.OS !== 'ios') return null;

  const ok = await authorizeHealthKit();
  if (!ok) return null;

  const available = await isHealthDataAvailableAsync();
  if (!available) return null;

  try {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const res = await queryStatisticsForQuantity(
      'HKQuantityTypeIdentifierStepCount',
      ['cumulativeSum'],
      { filter: { date: { startDate: startOfDay, endDate: now } }, unit: 'count' }
    );

    const rawSteps =
      res?.sumQuantity?.quantity ??
      res?.mostRecentQuantity?.quantity ??
      res?.averageQuantity?.quantity ??
      0;
    const steps = typeof rawSteps === 'string' ? parseFloat(rawSteps) : rawSteps;
    const rounded = Number.isFinite(steps) ? Math.round(steps) : 0;
    return rounded;
  } catch (e) {
    console.error(e);
    return null;
  }
}
