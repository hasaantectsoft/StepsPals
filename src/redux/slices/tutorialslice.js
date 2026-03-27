import {createSlice} from '@reduxjs/toolkit';

const tutorialSlice  = createSlice({
  name: 'tutorial',
  initialState: {
    isnewuser: true,
  },
  reducers: {
    setNewUser: (state, action) => {
      state.isnewuser = action.payload;
    },
  },
});

export const {setNewUser} = tutorialSlice.actions;

export default tutorialSlice.reducer;
