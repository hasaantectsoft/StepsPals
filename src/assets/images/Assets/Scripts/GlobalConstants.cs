using System.Collections.Generic;

public static class GlobalConstants
{
    public const string SupportEmail = "steppals.co@gmail.com";
    
    public static readonly int[] NumberOfTapsProgression = {1, 4, 4};

    public static readonly List<string> NonConsumableSku = new();

    public static readonly List<string> ConsumableSku = new()
    {
    #if UNITY_ANDROID
        "com.steppals.revive",
    #elif UNITY_IOS
        "com.steppals.revive",
    #endif
    };

}