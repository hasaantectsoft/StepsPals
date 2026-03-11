import SoundPlayer from 'react-native-sound-player';
import { store } from '../../redux/store';

const APP_SOUND = require('../../assets/Audio/appbackgroundmusic.mp3');
const BUTTON_SOUND = require('../../assets/Audio/SFX/ButtonClick.mp3');

let isPlaying = false;

// ----------------- Background Music -----------------
export const startAppSound = () => {
  const { MusicSound } = store.getState().soundReducer;

  if (!MusicSound) return; // Only play if Music permission is true
  if (isPlaying) return;    // Already playing

  try {
    SoundPlayer.playAsset(APP_SOUND);
    SoundPlayer.setNumberOfLoops(-1); // Loop infinitely
    isPlaying = true;
  } catch (e) {
    isPlaying = false;
  }
};

export const stopBackgroundSound = () => {
  try {
    SoundPlayer.stop();
    isPlaying = false;
  } catch (e) {
  }
};

// ----------------- Button Sound -----------------
export const playButtonSound = () => {
  const { Sound: SoundEnabled, MusicSound } = store.getState().soundReducer;

  if (!SoundEnabled) return; // Only play if Sound permission is true

  try {
    if (isPlaying && MusicSound) {
      // Pause background music before playing button sound
      SoundPlayer.pause();
    }

    // Play button sound
    SoundPlayer.playAsset(BUTTON_SOUND);

    // Resume background music after button sound duration (~400ms)
    setTimeout(() => {
      if (isPlaying && MusicSound) {
        SoundPlayer.playAsset(APP_SOUND);
        SoundPlayer.setNumberOfLoops(-1);
      }
    }, 400);
  } catch (e) {
    console.log('Error playing button sound', e);
  }
};



// import Sound from 'react-native-sound';
// import { store } from '../../redux/store';

// const APP_SOUND = require('../../assets/Audio/appbackgroundmusic.mp3');
// const BUTTON_SOUND = require('../../assets/Audio/SFX/ButtonClick.mp3');

// let backgroundMusic = null; // separate instance for music

// // ----------------- Background Music -----------------
// export const startAppSound = () => {
//   const { MusicSound } = store.getState().soundReducer;
//   if (!MusicSound) return; // do nothing if music is off
//   if (backgroundMusic) return; // already playing

//   backgroundMusic = new Sound(APP_SOUND, Sound.MAIN_BUNDLE, (error) => {
//     if (error) {
//       console.log('Failed to load background music', error);
//       backgroundMusic = null;
//       return;
//     }
//     backgroundMusic.setNumberOfLoops(-1); // infinite loop
//     backgroundMusic.play((success) => {
//       if (!success) console.log('Background music playback failed');
//     });
//     console.log('Background music started');
//   });
// };

// export const stopBackgroundSound = () => {
//   if (backgroundMusic) {
//     backgroundMusic.stop(() => {
//       console.log('Background music stopped');
//     });
//     backgroundMusic.release();
//     backgroundMusic = null;
//   }
// };

// // ----------------- Button Sound -----------------
// export const playButtonSound = () => {
//   const { Sound: SoundEnabled } = store.getState().soundReducer;
//   if (!SoundEnabled) return; // do nothing if sound effects are off

//   const buttonSound = new Sound(BUTTON_SOUND, Sound.MAIN_BUNDLE, (error) => {
//     if (error) {
//       console.log('Failed to load button sound', error);
//       return;
//     }
//     buttonSound.play(() => {
//       buttonSound.release(); // free memory
//       console.log('Button sound played');
//     });
//   });
// };