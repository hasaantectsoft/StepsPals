using UnityEngine;

namespace Builder_TestMode
{
    public class TestModeViewer : MonoBehaviour
    {
        private const int DefaultPortraitScreenWidth = 1125;
        private const int DefaultLandscapeScreenWidth = 2436;
        private float _screenAspect;
        private Rect _fpsRect;
        private GUIStyle _guiStyle;
        private Rect _infoBoxRect;
        private Texture2D _boxTexture;
        private BuildSettings _buildSettings;
        private bool _isInfoShowing = false;

        private short[] _fpsSamples;
        private int _sumLastFpsSamples;
        private short _fpsSamplesCapacity = 1000;
        private short _smallAverageRate = 5;

        private short _fpsSamplesCount = 0;
        private short _indexSample = 0;

        private short _currentFPS;
        private short _smallAverageFPS;
        private short _bigAverageFPS;

        private void Awake()
        {
            _buildSettings = BuildSettingsSO.SettingsSO.BuildSettings;
            gameObject.SetActive(_buildSettings.isTestMode);

            int defaultScreenWidth = Screen.width < Screen.height
                ? DefaultPortraitScreenWidth
                : DefaultLandscapeScreenWidth;
            _screenAspect = (float) Screen.width / defaultScreenWidth;
            float offset = 30f * _screenAspect;
            float rectHeight = 60f * _screenAspect;
            _fpsRect = new Rect(offset, offset, 150f * _screenAspect, rectHeight);
            _fpsSamples = new short[_fpsSamplesCapacity];

            _infoBoxRect = new Rect(0f, Screen.height - 100f * _screenAspect, Screen.width, rectHeight);
            _boxTexture = new Texture2D(1, 1, TextureFormat.RGBAFloat, false); 
            _boxTexture.SetPixel(0, 0, new Color(0, 0, 0, 0.6f));
            _boxTexture.Apply();
            _guiStyle = new GUIStyle
            {
                fontSize = Mathf.RoundToInt(40 * _screenAspect),
                fontStyle = FontStyle.Bold,
                alignment = TextAnchor.MiddleCenter,
                normal =
                {
                    textColor = Color.white,
                    background = _boxTexture
                }
            };
        }
        
        private void Update()
        {
            _currentFPS = (short) Mathf.RoundToInt(1f / Time.unscaledDeltaTime);

            _indexSample++;
            if (_indexSample >= _fpsSamplesCapacity) _indexSample = 0;
            _fpsSamples[_indexSample] = _currentFPS;

            if (_fpsSamplesCount < _fpsSamplesCapacity)
            {
                _fpsSamplesCount++;
            }

            uint bigAverageAddedFps = 0;
            for (int i = 0; i < _fpsSamplesCount; i++)
            {
                bigAverageAddedFps += (uint) _fpsSamples[i];
            }
            _bigAverageFPS = (short) ((float) bigAverageAddedFps / _fpsSamplesCount);

            _sumLastFpsSamples += _currentFPS;
            if (_indexSample % _smallAverageRate != 0) return;
            _smallAverageFPS = (short) ((float)_sumLastFpsSamples / _smallAverageRate);
            _sumLastFpsSamples = 0;
        }

        public void OnGUI()
        {
            if (GUI.Button(_fpsRect,$"{_smallAverageFPS} ({_bigAverageFPS})",_guiStyle))
            {
                _isInfoShowing = !_isInfoShowing;
            }

            if (_isInfoShowing)
            {
                GUI.Box(_infoBoxRect,$"{_buildSettings.buildTime} | {_buildSettings.environment} | {_buildSettings.versionInfo} | {_buildSettings.commitShortHash}", _guiStyle);
            }
        }

        private void OnApplicationPause(bool pause)
        {
            if (!pause) ClearData();
        }

        private void ClearData()
        {
            _fpsSamples = new short[_fpsSamplesCapacity];
            _sumLastFpsSamples = 0;
            _fpsSamplesCount = 0;
            _indexSample = 0;
            _currentFPS = 0;
            _smallAverageFPS = 0;
            _bigAverageFPS = 0;
        }
    }
}