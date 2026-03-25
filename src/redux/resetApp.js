import { persistedStore } from "./store";

import { setSignedIn } from "./slices/authSlice";
import { setNewUser } from "./slices/tutorialslice";
import { clearPet } from "./slices/petslice";
import { clearCollection } from "./slices/petCollectionSlice";
import { addToGraveyard, clearGraveyard } from "./slices/graveyardSlice";
import { clearProgress } from "./slices/progressSlice";
import { dispatchMakeCartEmpty } from "./slices/cartSlice";
import { dispatchThemeMode } from "./slices/themeSlice";
import { dispatchToken, dispatchUser } from "./slices/userSlice";
import { setIsMain } from "./slices/ismain";
import { setStartoverPet, setPendingEggHatch } from "./slices/startoverpetslice";
import { setMusicSound, setSound } from "./slices/soundSlice";

export async function resetApp(dispatch, pet) {
  const { petname, petkey, petcreatedat } = pet || {};
  if (petname || petkey || petcreatedat) {
    dispatch(addToGraveyard({ name: petname, key: petkey, petcreatedat }));
  }

  dispatch(setSignedIn(false));
  dispatch(setNewUser(true));
  dispatch(clearPet());
  dispatch(clearCollection());
  dispatch(clearProgress());
  dispatch(clearGraveyard());
  dispatch(dispatchMakeCartEmpty());
  dispatch(dispatchThemeMode("system"));
  dispatch(dispatchToken(null));
  dispatch(dispatchUser(null));
  dispatch(setIsMain(false));
  dispatch(setStartoverPet(false));
  dispatch(setPendingEggHatch(false));
  dispatch(setMusicSound(true));
  dispatch(setSound(true));

  try {
    await persistedStore.purge();
  } catch (e) {}
}

