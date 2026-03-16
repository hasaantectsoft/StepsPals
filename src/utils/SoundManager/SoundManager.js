// import SoundPlayer from 'react-native-sound-player';
// import { store } from '../../redux/store';

// const APP_SOUND = require('../../assets/Audio/appbackgroundmusic.mp3');
// const BUTTON_SOUND = require('../../assets/Audio/SFX/ButtonClick.mp3');

// let isPlaying = false;

// // ----------------- Background Music -----------------
// export const startAppSound = () => {
//   const { MusicSound } = store.getState().soundReducer;

//   if (!MusicSound) return; // Only play if Music permission is true
//   if (isPlaying) return;    // Already playing

//   try {
//     SoundPlayer.playAsset(APP_SOUND);
//     SoundPlayer.setNumberOfLoops(-1); // Loop infinitely
//     isPlaying = true;
//   } catch (e) {
//     isPlaying = false;
//   }
// };

// export const stopBackgroundSound = () => {
//   try {
//     SoundPlayer.stop();
//     isPlaying = false;
//   } catch (e) {
//   }
// };

// // ----------------- Button Sound -----------------
// export const playButtonSound = () => {
//   const { Sound: SoundEnabled, MusicSound } = store.getState().soundReducer;

//   if (!SoundEnabled) return; // Only play if Sound permission is true

//   try {
//     if (isPlaying && MusicSound) {
//       // Pause background music before playing button sound
//       SoundPlayer.pause();
//     }

//     // Play button sound
//     SoundPlayer.playAsset(BUTTON_SOUND);

//     // Resume background music after button sound duration (~400ms)
//     setTimeout(() => {
//       if (isPlaying && MusicSound) {
//         SoundPlayer.playAsset(APP_SOUND);
//         SoundPlayer.setNumberOfLoops(-1);
//       }
//     }, 400);
//   } catch (e) {
//     console.log('Error playing button sound', e);
//   }
// };



import Sound from 'react-native-sound';
import { store } from '../../redux/store';
 
// Enable playback in silent mode (iOS)
Sound.setCategory('Playback', true);
 
let bgMusic = null;
let isBgLoaded = false;
 
// ----------------- Preload Background Music -----------------
// Call this once at app start (e.g. in App.js) to preload the background music
export const preloadSounds = () => {
  bgMusic = new Sound('appbackgroundmusic.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load background music', error);
      isBgLoaded = false;
      return;
    }
    isBgLoaded = true;
    bgMusic.setNumberOfLoops(-1); // Loop infinitely
  });
};
 
// ----------------- Background Music -----------------
export const startAppSound = () => {
  const { MusicSound } = store.getState().soundReducer;
 
  if (!MusicSound) return;      // Music permission off
  if (!isBgLoaded || !bgMusic) return; // Not loaded yet
  if (bgMusic.isPlaying()) return;     // Already playing
 
  bgMusic.play((success) => {
    if (!success) {
      console.log('Background music playback failed');
    }
  });
};
 
export const stopBackgroundSound = () => {
  if (bgMusic && isBgLoaded) {
    bgMusic.stop();
  }
};
 
export const pauseBackgroundSound = () => {
  if (bgMusic && isBgLoaded && bgMusic.isPlaying()) {
    bgMusic.pause();
  }
};
 
export const resumeBackgroundSound = () => {
  const { MusicSound } = store.getState().soundReducer;
  if (!MusicSound) return;
  if (bgMusic && isBgLoaded && !bgMusic.isPlaying()) {
    bgMusic.play();
  }
};
 
// ----------------- Button Sound -----------------
// Each call creates a fresh Sound instance so multiple taps overlap perfectly
export const playButtonSound = () => {
  const { Sound: SoundEnabled } = store.getState().soundReducer;
 
  if (!SoundEnabled) return; // Sound permission off
 
  const sfx = new Sound('buttonclick.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load button sound', error);
      return;
    }
 
    sfx.play((success) => {
      // Release the instance after playback to free memory
      sfx.release();
    });
  });
};
 
// ----------------- Cleanup (call on app unmount) -----------------
export const releaseSounds = () => {
  if (bgMusic) {
    bgMusic.stop();
    bgMusic.release();
    bgMusic = null;
    isBgLoaded = false;
  }
};

