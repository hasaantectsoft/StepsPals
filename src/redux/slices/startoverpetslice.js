import {createSlice} from '@reduxjs/toolkit';

const startoverpetslice = createSlice({
  name: 'startoverpetslice',
  initialState: {
    startoverpet: false,
  },
  reducers: {
    setStartoverPet: (state, action) => {
      state.startoverpet = action.payload;
    },
  },
});

export const {setStartoverPet} = startoverpetslice.actions;

export default startoverpetslice.reducer;
