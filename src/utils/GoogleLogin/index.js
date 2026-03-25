import { GoogleSignin } from '@react-native-google-signin/google-signin';

const PLAYFAB_TITLE_ID = '143435';
const PLAYFAB_API = `https://${PLAYFAB_TITLE_ID}.playfabapi.com`;

GoogleSignin.configure({
  webClientId: '242694053733-i9jkme1fn8n6f5vifg97mbpp1l8949s5.apps.googleusercontent.com',
  offlineAccess: true,
});

export const loginWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();

    await GoogleSignin.signOut().catch(() => {});

    const response = await GoogleSignin.signIn();

    if (response.type !== 'success') {
      console.warn('Google Sign-In cancelled:', response.type);
      return null;
    }

    const googleUserId = response.data?.user?.id;
    const userEmail = response.data?.user?.email;

    if (!googleUserId || !userEmail) {
      console.error('❌ No user info received from Google');
      return null;
    }

    console.log('✅ Google Sign-In success, user:', userEmail);

    const password = `GP_${googleUserId}_StepsPals`;

    let loginResponse = await fetch(`${PLAYFAB_API}/Client/LoginWithEmailAddress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        TitleId: PLAYFAB_TITLE_ID,
        Email: userEmail,
        Password: password,
      }),
    });

    let result = await loginResponse.json();

    if (result.code !== 200) {
      console.log('Account not found, registering...', result.error);

      const registerResponse = await fetch(`${PLAYFAB_API}/Client/RegisterPlayFabUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          TitleId: PLAYFAB_TITLE_ID,
          Email: userEmail,
          Password: password,
          DisplayName: userEmail.split('@')[0],
          RequireBothUsernameAndEmail: false,
        }),
      });

      result = await registerResponse.json();
    }

    if (result.code !== 200) {
      console.error('❌ PlayFab Error:', result.error, result.errorMessage, JSON.stringify(result.errorDetails));
      return null;
    }

    console.log('✅ PlayFab Login Success:', result);
    return result;

  } catch (error) {
    console.error('❌ Login Error:', error);
    return null;
  }
};
