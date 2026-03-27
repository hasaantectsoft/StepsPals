import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { store } from '../../redux/store';
import axios from 'axios';
import { dispatchSessionTicket } from '../../redux/slices/userSlice';

const PLAYFAB_TITLE_ID = '143435';
const PLAYFAB_API = `https://${PLAYFAB_TITLE_ID}.playfabapi.com`;


GoogleSignin.configure({
  webClientId: '242694053733-i9jkme1fn8n6f5vifg97mbpp1l8949s5.apps.googleusercontent.com',
  offlineAccess: true,
});


const saveUserData = async (sessionTicket, data) => {
  try {
    const { data: json } = await axios.post(
      `${PLAYFAB_API}/Client/UpdateUserData`,
      { Data: data },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionTicket,
        },
      },
    );
    if (json.code !== 200) console.warn('❌ Save Error:', json.errorMessage);
    else console.log('✅ Data Saved');
  } catch (err) {
    console.error('❌ Save Error:', err);
  }
};




const getUserData = async (sessionTicket) => {
  try {
    const { data: json } = await axios.post(
      `${PLAYFAB_API}/Client/GetUserData`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionTicket,
        },
      },
    );
    return json.code === 200 ? json.data.Data : null;
  } catch (err) {
    console.error('❌ Get Error:', err);
    return null;
  }
};

export const syncStepCountToPlayFab = async (steps) => {
  try {
    const sessionTicket = store.getState().userReducer?.sessionTicket;
    if (!sessionTicket) return false;
console.log('🔥 syncStepCountToPlayFab:', steps);
console.log('🔥 sessionTicket:', sessionTicket);
    const { data: json } = await axios.post(
      `${PLAYFAB_API}/Client/UpdateUserData`,
      {
      
        Data: {
          dailyStep: String(steps ?? 0),
          
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionTicket,
        },
      },
    );

    return json.code === 200;
  } catch (error) {
    console.warn('Step sync failed:', error?.message || error);
    return false;
  }
};





export const loginWithGoogle = async () => {
  try {
   
    const { petname, petkey, missedDays, petage } = store.getState().petReducer;
    const { entries } = store.getState().graveyardReducer;
    const { pets } = store.getState().petCollectionReducer;
    const { dailyStep, weeklyStepCount,  dailyStepGoal } = store.getState().stepCountReducer;
    

    
    const userDataToSave = {
      PetName: petname || 'Pet',
      PetKey: String(petkey || ''),
      MissedDays: String(missedDays || '0'),
      PetAge: String(petage || '0'),
      Graveyard: JSON.stringify(entries),
      Collection: JSON.stringify(pets),
      dailyStep: String(dailyStep || '0'),
      WeeklyStepCount: String(weeklyStepCount || '0'),
      DailyStepGoal: String(dailyStepGoal || '0'),
    };

    
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut().catch(() => {});
    const response = await GoogleSignin.signIn();
    if (response.type !== 'success') return null;

    const googleUserId = response.data?.user?.id;
    const userEmail = response.data?.user?.email;
    const displayName = response.data?.user?.name;

    if (!googleUserId || !userEmail) return null;

    const password = `GP_${googleUserId}_StepsPals`;

    // ✅ PlayFab Login
    let { data: result } = await axios.post(
      `${PLAYFAB_API}/Client/LoginWithEmailAddress`,
      { TitleId: PLAYFAB_TITLE_ID, Email: userEmail, Password: password },
      { headers: { 'Content-Type': 'application/json' } },
    );

    // ✅ Register if not exist
    if (result.code !== 200) {
      ({ data: result } = await axios.post(
        `${PLAYFAB_API}/Client/RegisterPlayFabUser`,
        {
          TitleId: PLAYFAB_TITLE_ID,
          Email: userEmail,
          Password: password,
          DisplayName: displayName || userEmail.split('@')[0],
          RequireBothUsernameAndEmail: false,
        },
        { headers: { 'Content-Type': 'application/json' } },
      ));
    }

    if (result.code !== 200) return null;

    const sessionTicket = result.data.SessionTicket;
    store.dispatch(dispatchSessionTicket(sessionTicket));

  
    await saveUserData(sessionTicket, userDataToSave);

   
    const fetchedData = await getUserData(sessionTicket);

    // Clean data for UI
    const cleanData = {
      PetName: fetchedData?.PetName?.Value || '',
      PetKey: fetchedData?.PetKey?.Value || '',
      MissedDays: fetchedData?.MissedDays?.Value || '0',
      PetAge: fetchedData?.PetAge?.Value || '0',
      Entries: fetchedData?.Entries?.Value ? JSON.parse(fetchedData.Entries.Value) : [],
      Pets: fetchedData?.Pets?.Value ? JSON.parse(fetchedData.Pets.Value) : [],
      dailyStep: fetchedData?.StepCount?.Value || '0',
      WeeklyStepCount: fetchedData?.WeeklyStepGoal?.Value || '0',
      DailyStepGoal: fetchedData?.DailyStepGoal?.Value || '0',
    };

    return {
      user: { email: userEmail, name: displayName },
      playfab: result.data,
      data: cleanData,
    };
  } catch (error) {
    console.error('❌ Login Error:', error);
    return null;
  }
};



