import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 0,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setProgressStep: (state, action) => { state.step = action.payload },
    clearProgress: () => initialState,
  },
});

export const { setProgressStep, clearProgress } = progressSlice.actions;

export default progressSlice.reducer;
