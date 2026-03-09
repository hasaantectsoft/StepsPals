using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace SaveSystem
{
    public class DateTimeTicksConverter : JsonConverter<DateTimeOffset>
    {
        public override void WriteJson(JsonWriter writer, DateTimeOffset value, JsonSerializer serializer)
        {
            writer.WriteStartObject();
            writer.WritePropertyName("ticks");
            writer.WriteValue(value.Ticks);
            writer.WritePropertyName("offsetMinutes");
            writer.WriteValue(value.Offset.TotalMinutes);
            writer.WriteEndObject();
        }

        public override DateTimeOffset ReadJson(JsonReader reader, Type objectType, DateTimeOffset existingValue,
            bool hasExistingValue, JsonSerializer serializer)
        {
            JObject obj = JObject.Load(reader);
            long ticks = (obj["ticks"] ?? 0).Value<long>();
            double offsetMinutes = (obj["offsetMinutes"] ?? 0).Value<double>();
            TimeSpan offset = TimeSpan.FromMinutes(offsetMinutes);
            return new DateTimeOffset(ticks, offset);
        }
    }
}