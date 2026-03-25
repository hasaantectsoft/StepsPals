import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pets: [],
};

const petCollectionSlice = createSlice({
  name: 'petCollection',
  initialState,
  reducers: {
    addPetToCollection: (state, action) => {
      const pet = action.payload;
      if (!pet?.id) return;
      const exists = state.pets.some((p) => p.id === pet.id);
      if (exists) return;
      state.pets.unshift(pet);
      if (state.pets.length > 24) {
        state.pets.pop(); // remove oldest
      }
    },
    removePetFromCollection: (state, action) => {
      const id = action.payload;
      state.pets = state.pets.filter((p) => p.id !== id);
    },
    clearCollection: (state) => {
      state.pets = [];
    },
  },
});

export const { addPetToCollection, removePetFromCollection, clearCollection } =
  petCollectionSlice.actions;

export default petCollectionSlice.reducer;
