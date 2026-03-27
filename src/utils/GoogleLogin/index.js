import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { store } from '../../redux/store';
import axios from 'axios';
import { dispatchSessionTicket } from '../../redux/slices/userSlice';
import { appleAuth } from '@invertase/react-native-apple-authentication';

const PLAYFAB_TITLE_ID = '143435';
const PLAYFAB_API = `https://${PLAYFAB_TITLE_ID}.playfabapi.com`;

// PlayFab often returns HTTP 4xx with a JSON body (e.g. HTTP 401 + AccountNotFound on login).
// Axios would throw before we can read body.code; accept client errors so logic can branch.
const playfabAxiosConfig = (extra = {}) => ({
  ...extra,
  headers: { 'Content-Type': 'application/json', ...extra.headers },
  validateStatus: (status) => status < 500,
});

/** PlayFab Game Manager "player overview" uses contact email + title display name — set explicitly after login. */
const syncPlayFabPlayerOverview = async (sessionTicket, email, displayName, playFabId) => {
  const auth = playfabAxiosConfig({
    headers: { 'X-Authorization': sessionTicket },
  });
  const safeEmail = (email && String(email).trim()) || '';
  if (!safeEmail) return;

  const base =
    (displayName && String(displayName).trim()) ||
    safeEmail.split('@')[0] ||
    'Player';
  // Title display name must be unique per title (PlayFab); suffix PlayFabId tail to reduce collisions.
  const compact = base.replace(/\s+/g, '').slice(0, 18) || 'Player';
  const idTail = (playFabId && String(playFabId).replace(/-/g, '').slice(-6)) || '';
  const titleDisplay = idTail
    ? `${compact}_${idTail}`.slice(0, 25)
    : compact.slice(0, 25);

  try {
    const { data: emailJson } = await axios.post(
      `${PLAYFAB_API}/Client/AddOrUpdateContactEmail`,
      { TitleId: PLAYFAB_TITLE_ID, EmailAddress: safeEmail },
      auth,
    );
    if (emailJson.code !== 200) {
      console.warn('PlayFab AddOrUpdateContactEmail:', emailJson.errorMessage);
    }

    const { data: nameJson } = await axios.post(
      `${PLAYFAB_API}/Client/UpdateUserTitleDisplayName`,
      { TitleId: PLAYFAB_TITLE_ID, DisplayName: titleDisplay },
      auth,
    );
    if (nameJson.code !== 200) {
      console.warn('PlayFab UpdateUserTitleDisplayName:', nameJson.errorMessage);
    }
  } catch (e) {
    console.warn('PlayFab profile sync failed:', e?.message || e);
  }
};

GoogleSignin.configure({
  webClientId: '242694053733-i9jkme1fn8n6f5vifg97mbpp1l8949s5.apps.googleusercontent.com',
  iosClientId: '242694053733-5c5rds787r1jv6oj4tgel8hcrtu6rbvs.apps.googleusercontent.com',
  offlineAccess: true,
});


const saveUserData = async (sessionTicket, data) => {
  try {
    const { data: json } = await axios.post(
      `${PLAYFAB_API}/Client/UpdateUserData`,
      { Data: data },
      playfabAxiosConfig({
        headers: { 'X-Authorization': sessionTicket },
      }),
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
      playfabAxiosConfig({
        headers: { 'X-Authorization': sessionTicket },
      }),
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
      playfabAxiosConfig({
        headers: { 'X-Authorization': sessionTicket },
      }),
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
    const { dailyStep, weeklyStepCount, dailyStepGoal } = store.getState().stepCountReducer;



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
    await GoogleSignin.signOut().catch(() => { });
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
      playfabAxiosConfig(),
    );

    // ✅ Register only when account does not exist (avoid register on wrong password / linked email)
    if (result.code !== 200) {
      const missingAccount =
        result.error === 'AccountNotFound' || result.errorCode === 1001;
      if (!missingAccount) {
        console.error('❌ PlayFab login failed:', result.errorMessage || result.error);
        return null;
      }
      ({ data: result } = await axios.post(
        `${PLAYFAB_API}/Client/RegisterPlayFabUser`,
        {
          TitleId: PLAYFAB_TITLE_ID,
          Email: userEmail,
          Password: password,
          DisplayName: displayName || userEmail.split('@')[0],
          RequireBothUsernameAndEmail: false,
        },
        playfabAxiosConfig(),
      ));
    }

    if (result.code !== 200) return null;

    const sessionTicket = result.data.SessionTicket;
    const playFabId = result.data?.PlayFabId;
    store.dispatch(dispatchSessionTicket(sessionTicket));

    await syncPlayFabPlayerOverview(
      sessionTicket,
      userEmail,
      displayName,
      playFabId,
    );

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

// ============= APPLE LOGIN FUNCTION =============

export const loginWithApple = async () => {
  try {
    // 1. Check if Apple authentication is available on this device (boolean getter, not a function)
    const isAvailable = appleAuth.isSupported;
    if (!isAvailable) {
      console.warn('⚠️ Apple Authentication not available on this device');
      return null;
    }

    // 2. Get current user data from Redux (same as Google login)
    const { petname, petkey, missedDays, petage } = store.getState().petReducer;
    const { entries } = store.getState().graveyardReducer;
    const { pets } = store.getState().petCollectionReducer;
    const { dailyStep, weeklyStepCount, dailyStepGoal } = store.getState().stepCountReducer;

    // 3. Prepare data to save in PlayFab
    const userDataToSave = {
      PetName: petname || 'Pet',
      PetKey: String(petkey || ''),
      MissedDays: String(missedDays || '0'),
      PetAge: String(petage || '0'),
      Graveyard: JSON.stringify(entries || []),
      Collection: JSON.stringify(pets || []),
      dailyStep: String(dailyStep || '0'),
      WeeklyStepCount: String(weeklyStepCount || '0'),
      DailyStepGoal: String(dailyStepGoal || '0'),
    };

    // 4. Perform Apple Sign In
    const appleAuthResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // 5. Check if we got user data
    if (!appleAuthResponse.user) {
      console.warn('⚠️ Apple login failed: No user data');
      return null;
    }


    console.log('🔥 appleAuthResponse:===============', appleAuthResponse);
    // 6. Extract user information from Apple response
    const appleUserId = appleAuthResponse.user; // Unique Apple ID (never changes)
    const userEmail = appleAuthResponse.email || `${appleUserId}@privaterelay.appleid.com`;
    const displayName = appleAuthResponse.fullName?.givenName ||
      appleAuthResponse.fullName?.familyName ||
      'Apple User';

    console.log('✅ Apple Login Success:');
    console.log('   User ID:', appleUserId);
    console.log('   Email:', userEmail);
    console.log('   Name:', displayName);

    // 7. Create password for PlayFab (AP prefix means Apple)
    const password = `AP_${appleUserId}_StepsPals`;

    // 8. Try to login with PlayFab using email and password
    let { data: result } = await axios.post(
      `${PLAYFAB_API}/Client/LoginWithEmailAddress`,
      {
        TitleId: PLAYFAB_TITLE_ID,
        Email: userEmail,
        Password: password
      },
      playfabAxiosConfig(),
    );

    // 9. If user doesn't exist, register new user
    if (result.code !== 200) {
      const missingAccount =
        result.error === 'AccountNotFound' || result.errorCode === 1001;
      if (!missingAccount) {
        console.error('❌ PlayFab login failed:', result.errorMessage || result.error);
        return null;
      }
      console.log('📝 User not found, registering new Apple user...');
      ({ data: result } = await axios.post(
        `${PLAYFAB_API}/Client/RegisterPlayFabUser`,
        {
          TitleId: PLAYFAB_TITLE_ID,
          Email: userEmail,
          Password: password,
          Username: displayName.replace(/\s/g, ''), // Remove spaces for username
          DisplayName: displayName,
          RequireBothUsernameAndEmail: false,
        },
        playfabAxiosConfig(),
      ));
    }

    // 10. Check if PlayFab login/register was successful
    if (result.code !== 200) {
      console.error('❌ PlayFab login/register failed:', result.errorMessage);
      return null;
    }

    // 11. Get session ticket and save to Redux
    const sessionTicket = result.data.SessionTicket;
    const playFabId = result.data?.PlayFabId;
    store.dispatch(dispatchSessionTicket(sessionTicket));
    console.log('✅ Session ticket saved to Redux');

    await syncPlayFabPlayerOverview(
      sessionTicket,
      userEmail,
      displayName,
      playFabId,
    );

    // 12. Save user data to PlayFab
    await saveUserData(sessionTicket, userDataToSave);

    // 13. Fetch saved data from PlayFab
    const fetchedData = await getUserData(sessionTicket);

    // 14. Clean and format fetched data for UI
    const cleanData = {
      PetName: fetchedData?.PetName?.Value || '',
      PetKey: fetchedData?.PetKey?.Value || '',
      MissedDays: fetchedData?.MissedDays?.Value || '0',
      PetAge: fetchedData?.PetAge?.Value || '0',
      Entries: fetchedData?.Graveyard?.Value ? JSON.parse(fetchedData.Graveyard.Value) : [],
      Pets: fetchedData?.Collection?.Value ? JSON.parse(fetchedData.Collection.Value) : [],
      dailyStep: fetchedData?.dailyStep?.Value || '0',
      WeeklyStepCount: fetchedData?.WeeklyStepCount?.Value || '0',
      DailyStepGoal: fetchedData?.DailyStepGoal?.Value || '0',
    };

    // 15. Return user data and PlayFab info
    return {
      user: {
        email: userEmail,
        name: displayName,
        appleId: appleUserId
      },
      playfab: result.data,
      data: cleanData,
    };

  } catch (error) {
    console.error('❌ Apple Login Error:', error?.message || error);
    return null;
  }
};