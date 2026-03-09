using System;
using Newtonsoft.Json;
using SaveSystem;

namespace Data.Models
{
    public class StepsModel
    {
        public int stepsCount;

        [JsonConverter(typeof(DateTimeTicksConverter))]
        public DateTimeOffset dayOfSteps;
    }
}