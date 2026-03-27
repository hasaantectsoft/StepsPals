import { createSlice } from '@reduxjs/toolkit';
import { images } from '../../assets/images';

const GRAVE_IMG = {
  '1': images.PetGravYard,
  '2': images.GraveYardCat,
  '3': images.GraveYardDino,
};

const fmt = (ts) => {
  if (!ts) return '--.--.--';
  const d = new Date(ts);
  return [d.getDate(), d.getMonth() + 1, String(d.getFullYear()).slice(-2)].map((n) => String(n).padStart(2, '0')).join('.');
};

const initialState = { entries: [] };

const graveyardSlice = createSlice({
  name: 'graveyard',
  initialState,
  reducers: {
    addToGraveyard: (state, action) => {
      const { name, key, petcreatedat } = action.payload;
      const now = Date.now();
      state.entries.push({
        id: now,
        name: name || 'Pet',
        key: String(key ?? ''),
        bornDate: fmt(petcreatedat),
        dieDate: fmt(now),
        img: GRAVE_IMG[String(key)] || images.PetGravYard,
      });
    },
    clearGraveyard: () => initialState,
  },
});

export const { addToGraveyard, clearGraveyard } = graveyardSlice.actions;
export default graveyardSlice.reducer;
