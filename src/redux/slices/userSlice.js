import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    user: null,
    sessionTicket: null,
  },
  reducers: {
    dispatchToken: (state, action) => {
      state.token = action.payload;
    },
      dispatchUser: (state, action) => {
        state.user = action.payload;
      },
      dispatchSessionTicket: (state, action) => {
        state.sessionTicket = action.payload;
      },
  },
});

export const {dispatchToken, dispatchUser, dispatchSessionTicket} = userSlice.actions;

export default userSlice.reducer;
