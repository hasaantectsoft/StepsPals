import {createSlice} from '@reduxjs/toolkit';

const startoverpetslice = createSlice({
  name: 'startoverpetslice',
  initialState: {
    startoverpet: false,
    pendingEggHatch: false,
  },
  reducers: {
    setStartoverPet: (state, action) => {
      state.startoverpet = action.payload;
    },
    setPendingEggHatch: (state, action) => {
      state.pendingEggHatch = action.payload;
    },
  },
});

export const { setStartoverPet, setPendingEggHatch } = startoverpetslice.actions;

export default startoverpetslice.reducer;
