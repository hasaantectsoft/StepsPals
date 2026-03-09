import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    MusicSound: true, // controls background music
    Sound: true       // controls button/UI sounds
};

const soundSlice = createSlice({
    name: 'sound',
    initialState,
    reducers: {
        setMusicSound: (state, action) => { state.MusicSound = action.payload },
        setSound: (state, action) => { state.Sound = action.payload },
    }
});

export const { setMusicSound, setSound } = soundSlice.actions;

export default soundSlice.reducer;