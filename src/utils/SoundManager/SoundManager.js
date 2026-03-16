import Sound from 'react-native-sound';
import { store } from '../../redux/store';

// Enable playback in silent mode (iOS)
Sound.setCategory('Playback', true);

let bgMusic = null;
let isBgLoaded = false;

// ----------------- Preload Background Music -----------------
export const preloadSounds = () => {
  bgMusic = new Sound('appbackgroundmusic.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load background music', error);
      isBgLoaded = false;
      return;
    }

    isBgLoaded = true;

    // Loop forever
    bgMusic.setNumberOfLoops(-1);

    // Lower background music volume so button sound is clear
    bgMusic.setVolume(0.3);
  });
};

// ----------------- Start Background Music -----------------
export const startAppSound = () => {
  const { MusicSound } = store.getState().soundReducer;

  if (!MusicSound) return;
  if (!isBgLoaded || !bgMusic) return;
  if (bgMusic.isPlaying()) return;

  bgMusic.play((success) => {
    if (!success) {
      console.log('Background music playback failed');
    }
  });
};

// ----------------- Stop Background Music -----------------
export const stopBackgroundSound = () => {
  if (bgMusic && isBgLoaded) {
    bgMusic.stop();
  }
};

// ----------------- Pause Background Music -----------------
export const pauseBackgroundSound = () => {
  if (bgMusic && isBgLoaded && bgMusic.isPlaying()) {
    bgMusic.pause();
  }
};

// ----------------- Resume Background Music -----------------
export const resumeBackgroundSound = () => {
  const { MusicSound } = store.getState().soundReducer;

  if (!MusicSound) return;

  if (bgMusic && isBgLoaded && !bgMusic.isPlaying()) {
    bgMusic.play();
  }
};

// ----------------- Button Click Sound -----------------
export const playButtonSound = () => {
  const { Sound: SoundEnabled } = store.getState().soundReducer;

  if (!SoundEnabled) return;

  const sfx = new Sound('buttonclick.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load button sound', error);
      return;
    }

    // Make button sound louder
    sfx.setVolume(1.0);

    // Optional: slightly reduce background music for clarity
    if (bgMusic && bgMusic.isPlaying()) {
      bgMusic.setVolume(0.15);

      setTimeout(() => {
        bgMusic.setVolume(0.3);
      }, 200);
    }

    sfx.play(() => {
      sfx.release();
    });
  });
};

// ----------------- Cleanup (Call on App Exit) -----------------
export const releaseSounds = () => {
  if (bgMusic) {
    bgMusic.stop();
    bgMusic.release();
    bgMusic = null;
    isBgLoaded = false;
  }
};