using System;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;

namespace Utils
{
    public static class Utils
    {
        public static int GetCurrentTimeInInteger(DateTime dateTime)
        {
            DateTime epochStart = new(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            int currentEpochTime = (int)(dateTime - epochStart).TotalSeconds;
            return currentEpochTime;
        }

        public static string GenerateTimerText(int timeInSeconds)
        {
            TimeSpan t = TimeSpan.FromSeconds(timeInSeconds);
            if (timeInSeconds is < 60 and >= 0)
            {
                return $"0:{ToTime(timeInSeconds)}";
            }

            if (t.Hours > 0 && t.TotalHours < 24)
            {
                return $"{ToTime(t.Hours)}:{ToTime(t.Minutes)}";
            }

            if (t.TotalHours >= 24)
            {
                return $"{t.Days}:{ToTime(t.Hours)}:{ToTime(t.Minutes)}";
            }

            return $"{t.Minutes}:{ToTime(t.Seconds)}";

            string ToTime(int time)
            {
                return time > 9 ? time.ToString() : $"0{time}";
            }
        }

        public static IEnumerable<T> GetEnumValues<T>()
        {
            return Enum.GetValues(typeof(T)).Cast<T>();
        }

        public static TEnum GetNextValue<TEnum>(TEnum src, int step = 1)
            where TEnum : struct, IComparable, IFormattable, IConvertible
        {
            TEnum[] allValues = GetEnumValues<TEnum>().ToArray();
            int index = Array.IndexOf(allValues, src) + step;
            return index < allValues.Length ? allValues[index] : allValues[index - allValues.Length];
        }

        public static int RoundToNearest(int number, int nearest)
        {
            return (int)(Math.Round(number / (float)nearest) * nearest);
        }

        public static int CountDayDifference(DateTimeOffset firstDate, DateTimeOffset secondDate)
        {
            TimeSpan difference = secondDate - firstDate;
            int dayCount = difference.Days;
            Debug.Log($"Days passed: {dayCount}");
            return dayCount;
        }

        public static bool AreDifferentWeeks(DateTimeOffset firstDate, DateTimeOffset secondDate)
        {
            DateTime dateA = firstDate.Date;
            DateTime dateB = secondDate.Date;

            int weekA = System.Globalization.ISOWeek.GetWeekOfYear(dateA);
            int weekB = System.Globalization.ISOWeek.GetWeekOfYear(dateB);

            int yearA = System.Globalization.ISOWeek.GetYear(dateA);
            int yearB = System.Globalization.ISOWeek.GetYear(dateB);

            return weekA != weekB || yearA != yearB;
        }

        public static float CalculateSecondsToExactTimeOfFutureDay(double dayPassed, double hourTime,
            float minutesTime = 0)
        {
            DateTime now = DateTime.Now;
            DateTime nextDay9Am = now.Date.AddDays(dayPassed).AddHours(hourTime).AddMinutes(minutesTime);
            TimeSpan timeToNextDay9Am = nextDay9Am - now;
            return (float)timeToNextDay9Am.TotalSeconds;
        }

        public static float CalculateNextWorkingHoursTimeUtc(int startWorkingHours, int endWorkingHours)
        {
            const int delayInSeconds = 60 * 5;
            DateTime utcNow = DateTime.UtcNow;
            TimeSpan nowTime = utcNow.TimeOfDay;

            TimeSpan workStart = new(startWorkingHours, 0, 0);
            TimeSpan workEnd = new(endWorkingHours, 0, 0);

            TimeSpan timeUntilStart = workStart - nowTime;
            DateTime targetTime;
            if (timeUntilStart.TotalSeconds > delayInSeconds)
            {
                targetTime = new DateTime(utcNow.Year, utcNow.Month, utcNow.Day, startWorkingHours, 0, 0,
                    DateTimeKind.Utc);
            }
            else if (nowTime >= workEnd)
            {
                DateTime nextDay = utcNow.Date.AddDays(1);
                targetTime = new DateTime(nextDay.Year, nextDay.Month, nextDay.Day, startWorkingHours, 0, 0,
                    DateTimeKind.Utc);
            }
            else
            {
                targetTime = utcNow.AddSeconds(delayInSeconds);
            }

            return (float)(targetTime - utcNow).TotalSeconds;
        }

        public static void OpenUrl(string url)
        {
            Application.OpenURL(url);
        }

        public static void OpenEmail(string email, string subject = "")
        {
            string mailto = $"mailto:{email}?subject={subject}";
            OpenUrl(mailto);
        }

        public static void QuitApp()
        {
            Application.Quit();

        #if UNITY_EDITOR
            EditorApplication.isPlaying = false;
        #endif
        }
    }
}