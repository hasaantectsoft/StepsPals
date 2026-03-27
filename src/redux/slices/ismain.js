import {createSlice} from '@reduxjs/toolkit';

const mainslice  = createSlice({
  name: 'main',
  initialState: {
    isMain: false,
  },
  reducers: {
    setIsMain: (state, action) => {
      state.isMain = action.payload;
    },
  },
});

export const {setIsMain} = mainslice.actions;
export default mainslice.reducer;
