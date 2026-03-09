using System;

namespace Data.Models
{
    [Serializable]
    public class TutorialProgressModel
    {
        public bool passed;
        public int lastStep;
    }
}