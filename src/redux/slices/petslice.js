import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  petname: '',
  petkey: '',
  petsteps: 242,
  petspecies: '',
  petage: '',
  petcondition: '',
  petstage: '',
  petmissed: '',
  petdays: '',
  petdaysleft: '',
  petdayscompleted: '',
  petdaysremaining: '',
  petisdead: false,
  petisfullygrown: false,
  petisalive: true,
  petisgrowing: true,
};

const petSlice = createSlice({
  name: 'pet',
  initialState,
  reducers: {
    setPetName: (state, action) => { state.petname = action.payload },
    setPetKey: (state, action) => { state.petkey = action.payload },
    setPetSteps: (state, action) => { state.petsteps = action.payload },
    setPetSpecies: (state, action) => { state.petspecies = action.payload },
    setPetAge: (state, action) => { state.petage = action.payload },
    setPetCondition: (state, action) => { state.petcondition = action.payload },
    setPetStage: (state, action) => { state.petstage = action.payload },
    setPetMissed: (state, action) => { state.petmissed = action.payload },
    setPetDays: (state, action) => { state.petdays = action.payload },
    setPetDaysLeft: (state, action) => { state.petdaysleft = action.payload },
    setPetDaysCompleted: (state, action) => { state.petdayscompleted = action.payload },
    setPetDaysRemaining: (state, action) => { state.petdaysremaining = action.payload },
    setPetIsDead: (state, action) => { state.petisdead = action.payload },
    setPetIsFullyGrown: (state, action) => { state.petisfullygrown = action.payload },
    setPetIsAlive: (state, action) => { state.petisalive = action.payload },
    setPetIsGrowing: (state, action) => { state.petisgrowing = action.payload },

    clearPet: () => initialState,

    updatePet: (state, action) => ({ ...state, ...action.payload }),
  },
});

export const {
  setPetName, setPetKey, setPetSteps, setPetSpecies, setPetAge, 
  setPetCondition, setPetStage, setPetMissed, 
  setPetDays, setPetDaysLeft, setPetDaysCompleted, setPetDaysRemaining, 
  setPetIsDead, setPetIsFullyGrown, setPetIsAlive, setPetIsGrowing,
  clearPet, updatePet
} = petSlice.actions;

export default petSlice.reducer;