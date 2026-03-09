using System;

namespace Managers.OpenPopupsQueue
{
    public struct PopupInfo
    {
        public Type PopupType { get; private set; }
        public object Data { get; private set; }
        public bool Animated { get; private set; }
        public bool Global { get; private set; }

        public PopupInfo(Type popupType, object data, bool animated, bool global)
        {
            Data = data;
            Animated = animated;
            PopupType = popupType;
            Global = global;
        }
    }
}