import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { setProgressStep } from './redux/slices/progressSlice';
import { fetchSteps } from './utils/handler/fetchsteps';
import { fetchTodayStepsIOS } from './utils/handler/fetchIosSteps';
import { mergeIOSWidgetStepsOnly } from './utils/widgetSync';

export default function HealthKitInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function init() {
      if (Platform.OS === 'android') {
        const { granted, steps } = await fetchSteps();
        if (granted && steps != null) dispatch(setProgressStep(steps));
        return;
      }

      const rounded = await fetchTodayStepsIOS();
      if (rounded != null) {
        dispatch(setProgressStep(rounded));
        mergeIOSWidgetStepsOnly(rounded);
      }
    }

    void init();
  }, [dispatch]);

  return null;
}
