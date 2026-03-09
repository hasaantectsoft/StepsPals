using System.Collections.Generic;
using UnityEngine;
using Utils;

namespace Sounds
{
    [CreateAssetMenu(fileName = "AudioAssetsSO", menuName = "SO/GameAssets/Audio")]
    public class AudioAssetsSO : ScriptableObject
    {
        [field: SerializeField] public List<ValueByKey<AudioKey, AudioClip>> AudioByKey { private set; get; }
#if NATIVE_AUDIO
        [field: SerializeField] public List<ValueByKey<NativeAudioKey, AudioClip>> NativeAudioByKey { private set; get; }
#endif
    }
}