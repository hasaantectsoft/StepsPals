using System;
using System.Collections;
using System.Collections.Generic;
#if NATIVE_AUDIO
using E7.Native;
#endif
using UnityEngine;
using UnityEngine.Audio;
using Utils;
using Zenject;

namespace Sounds
{
    public class SoundsManager : MonoBehaviour
    {
        [SerializeField] private AudioMixerGroup musicMixerGroup;
        [SerializeField] private AudioMixerGroup soundsMixerGroup;

        private static SoundsManager _instance;
        private float? _musicVolume;
        private float? _soundsVolume;
        private bool? _isVibrationsOn;

        private const string MusicVolumeParam = "MusicVolume";
        private const string SoundsVolumeParam = "SoundsVolume";
        private const string Music = "Music";
        private const string Sounds = "Sounds";
        private const string Vibrations = "Vibrations";

        private const float MaxDB = 0f;
        private const float FactMinDB = -40f;
        private const float MinDB = -80f;
        private AudioMixer _audioMixer;
        private ComponentPool<AudioSource> _audioSourcePool;
        private AudioSource _musicSource;
        private readonly Dictionary<AudioKey, AudioClip> _sounds = new();
    #if NATIVE_AUDIO
        private readonly Dictionary<NativeAudioKey, NativeAudioClip> _nativeAudioSounds = new();
    #endif

        public static bool IsMusicOn => MusicVolume > FactMinDB;

        public static float MusicVolume
        {
            get
            {
                _instance._musicVolume ??= PlayerPrefs.GetFloat(Music, MaxDB);
                return _instance._musicVolume.Value;
            }
            set
            {
                if (_instance._musicVolume == value) return;
                if (value <= FactMinDB) value = MinDB;
                _instance._musicVolume = value;
                PlayerPrefs.SetFloat(Music, _instance._musicVolume.Value);
                PlayerPrefs.Save();
                SetMusicVolume(value);
            }
        }

        public static bool IsSoundOn => SoundsVolume > FactMinDB;

        public static float SoundsVolume
        {
            get
            {
                _instance._soundsVolume ??= PlayerPrefs.GetFloat(Sounds, MaxDB);
                return _instance._soundsVolume.Value;
            }
            set
            {
                if (_instance._soundsVolume == value) return;
                if (value <= FactMinDB) value = MinDB;
                _instance._soundsVolume = value;
                PlayerPrefs.SetFloat(Sounds, _instance._soundsVolume.Value);
                PlayerPrefs.Save();
                SetSoundsVolume(value);
            }
        }

        public static bool IsHapticsOn
        {
            get
            {
                _instance._isVibrationsOn ??= PlayerPrefs.GetInt(Vibrations, 1) == 1;
                return _instance._isVibrationsOn.Value;
            }
            set
            {
                if (_instance._isVibrationsOn == value) return;
                _instance._isVibrationsOn = value;
                PlayerPrefs.SetInt(Vibrations, _instance._isVibrationsOn.Value ? 1 : 0);
                PlayerPrefs.Save();
            }
        }

        [Inject]
        public void Construct(AudioAssetsSO audioAssetsSo)
        {
        #if NATIVE_AUDIO
#if !UNITY_EDITOR
            if (Application.isMobilePlatform)
            {
                NativeAudio.Initialize();
            }
#endif
            foreach (var audioClipByKey in audioAssetsSo.NativeAudioByKey)
            {
                _nativeAudioSounds[audioClipByKey.Key] = new NativeAudioClip(audioClipByKey.Value);
            }
        #endif

            foreach (var audioClipByKey in audioAssetsSo.AudioByKey)
            {
                _sounds[audioClipByKey.Key] = audioClipByKey.Value;
            }
        }

        private void Awake()
        {
            if (_instance != null)
            {
                Debug.LogError("Trying to add second SOUNDS MANAGER");
                Destroy(gameObject);
            }

            _instance = this;
            _audioMixer = musicMixerGroup.audioMixer;
            _audioSourcePool = new ComponentPool<AudioSource>(gameObject);
        }

        private void Start()
        {
            SetMusicVolume(MusicVolume);
            SetSoundsVolume(SoundsVolume);
        }

        public static void ToggleMusic(bool active) => MusicVolume = active ? MaxDB : MinDB;

        public static void ToggleSound(bool active) => SoundsVolume = active ? MaxDB : MinDB;

        public static AudioClip GetClip(AudioKey key) =>
            _instance._sounds.TryGetValue(key, out AudioClip clip) ? clip : null;

        public static void PlaySound(AudioKey audioKey, AudioSource audioSource)
        {
            _instance.StartCoroutine(PlaySound(_instance._sounds[audioKey], audioSource));
        }

        public static void PlaySound(AudioKey audioKey, float volume = 1f, bool loop = false)
        {
            PlaySoundAudioClip(_instance._sounds[audioKey], volume, loop);
        }

    #if NATIVE_AUDIO
        public static void PlaySound(NativeAudioKey audioKey, float volume = 1f, bool loop = false)
        {
            if (loop || !NativeAudio.Initialized)
            {
                PlaySoundAudioClip(_instance._nativeAudioSounds[audioKey].Clip, volume, loop);
            }
            else
            {
                if (SoundsVolume <= FactMinDB) return;
                NativeSource.PlayOptions playOptions = NativeSource.PlayOptions.defaultOptions;
                playOptions.volume = ConvertDecibelToLiner(SoundsVolume) * volume;
                NativeAudio.GetNativeSourceAuto().Play(_instance._nativeAudioSounds[audioKey].NativeAudioPointer, playOptions);
            }
        }
    #endif

        public static void PlayMusic(AudioKey audioKey, float volume, bool loop = true)
        {
            AudioSource musicSource = _instance._musicSource;
            if (musicSource == null) musicSource = _instance._audioSourcePool.Get();
            _instance._musicSource = musicSource;
            musicSource.outputAudioMixerGroup = _instance.musicMixerGroup;
            musicSource.volume = volume;
            musicSource.loop = loop;
            musicSource.clip = _instance._sounds[audioKey];
            musicSource.Play();
        }

        public static float ConvertDecibelToLiner(float volumeInDecibel) =>
            volumeInDecibel <= MinDB ? 0f : (1f - volumeInDecibel / MinDB);

        private static void SetMusicVolume(float volume)
        {
            _instance._audioMixer.SetFloat(MusicVolumeParam, volume);
        }

        private static void SetSoundsVolume(float volume)
        {
            _instance._audioMixer.SetFloat(SoundsVolumeParam, volume);
        }

        private static void PlaySoundAudioClip(AudioClip audioClip, float volume, bool loop)
        {
            AudioSource audioSource = _instance._audioSourcePool.Get();
            audioSource.playOnAwake = false;
            audioSource.outputAudioMixerGroup = _instance.soundsMixerGroup;
            audioSource.volume = volume;
            audioSource.loop = loop;
            _instance.StartCoroutine(PlaySound(audioClip, audioSource,
                delegate { _instance._audioSourcePool.Release(audioSource); }));
        }

        private static IEnumerator PlaySound(AudioClip audioClip, AudioSource audioSource, Action callback = null)
        {
            audioSource.clip = audioClip;
            audioSource.Play();
            if (audioSource.loop) yield break;
            yield return new WaitForSeconds(audioClip.length);
            callback?.Invoke();
        }

        private static float ConvertLinerToDecibel(float volumeInLiner) =>
            volumeInLiner <= 0f ? MinDB : (1f - volumeInLiner) * FactMinDB;
    }
}