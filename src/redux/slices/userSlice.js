import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    user: null,
  },
  reducers: {
    dispatchToken: (state, action) => {
      state.token = action.payload;
    },
    dispatchUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {dispatchToken, dispatchUser} = userSlice.actions;

export default userSlice.reducer;
