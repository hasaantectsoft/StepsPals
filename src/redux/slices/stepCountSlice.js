import {createSlice} from '@reduxjs/toolkit';

const stepCountSlice = createSlice({
  name: 'stepCount',
  initialState: {
    dailyStep: 0,
    weeklyStepCount: 0,
    dailyStepGoal: 0,
  },
  reducers: {
    setDailyStep: (state, action) => {
      state.dailyStep = action.payload;
    },
    setWeeklyStepCount: (state, action) => {
      state.weeklyStepCount = action.payload;
    },
    setDailyStepGoal: (state, action) => {
      state.dailyStepGoal = action.payload;
    },
  },
});

export const {setDailyStep, setWeeklyStepCount, setDailyStepGoal} = stepCountSlice.actions;

export default stepCountSlice.reducer;
