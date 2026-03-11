import React, { useEffect } from 'react';
import { queryStatisticsForQuantity, isHealthDataAvailableAsync, authorizationStatusFor } from '@kingstinct/react-native-healthkit';
import { authorizeHealthKit } from './healthkit';
import { useDispatch } from 'react-redux';
import { setProgressStep } from './redux/slices/progressSlice';

export default function HealthKitInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function init() {
      const ok = await authorizeHealthKit();
      console.log('requestAuthorization result:', ok);

      const available = await isHealthDataAvailableAsync();
      console.log('isHealthDataAvailableAsync:', available);

      const authStatus = await authorizationStatusFor('HKQuantityTypeIdentifierStepCount');
      console.log('authorizationStatusFor step count:', authStatus);

      if (!ok) return;

      try {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const res = await queryStatisticsForQuantity(
          'HKQuantityTypeIdentifierStepCount',
          ['cumulativeSum'],
          { filter: { date: { startDate: startOfDay, endDate: now } }, unit: 'count' }
        );

        console.log('HealthKit raw response:', res);

        // Try common response fields for the statistic result
        const rawSteps = res?.sumQuantity?.quantity ?? res?.mostRecentQuantity?.quantity ?? res?.averageQuantity?.quantity ?? 0;
        const steps = typeof rawSteps === 'string' ? parseFloat(rawSteps) : rawSteps;
        const rounded = Number.isFinite(steps) ? Math.round(steps) : 0;
        console.log('Resolved HealthKit steps:', rounded);
        dispatch(setProgressStep(rounded));
      } catch (e) {
        console.warn('Failed to fetch steps from HealthKit', e);
      }
    }

    void init();
  }, [dispatch]);

  return null;
}
