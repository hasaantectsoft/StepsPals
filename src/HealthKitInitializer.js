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

      const available = await isHealthDataAvailableAsync();
      console.log('Health data available:', available);

      const authStatus = await authorizationStatusFor('HKQuantityTypeIdentifierStepCount');
      console.log('HealthKit authorization status for step count:', authStatus); // 0 = NOTDETERMINED, 1 = SHARINGDENIED, 2 = SHARINGAUTHORIZED
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


        // Try common response fields for the statistic result
        const rawSteps = res?.sumQuantity?.quantity ?? res?.mostRecentQuantity?.quantity ?? res?.averageQuantity?.quantity ?? 0;
        const steps = typeof rawSteps === 'string' ? parseFloat(rawSteps) : rawSteps;
        console.log( steps);
        const rounded = Number.isFinite(steps) ? Math.round(steps) : 0;
        console.log('Steps today:', rounded);
        dispatch(setProgressStep(rounded));
      } catch (e) {
        console.error(e);
      }
    }

    void init();
  }, [dispatch]);

  return null;
}
