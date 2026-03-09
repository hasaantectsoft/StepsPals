#if NATIVE_AUDIO
using E7.Native;
using UnityEngine;

namespace Sounds
{
    public class NativeAudioClip
    {
        public AudioClip Clip { get; }
        public NativeAudioPointer NativeAudioPointer { get; }

        public NativeAudioClip(AudioClip audioClip)
        {
            Clip = audioClip;
#if !UNITY_EDITOR
            if (Application.isMobilePlatform)
                NativeAudioPointer = NativeAudio.Load(audioClip);
#endif
        }
    }
}
#endif