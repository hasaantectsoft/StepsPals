import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    MusicSound: true, 
    Sound: true       
};

const soundSlice = createSlice({
    name: 'sound',
    initialState,
    reducers: {
        setMusicSound: (state, action) => { 
            state.MusicSound = action.payload;
        },
        setSound: (state, action) => { 
            state.Sound = action.payload;
        },
    }
});

export const { setMusicSound, setSound } = soundSlice.actions;

export default soundSlice.reducer;