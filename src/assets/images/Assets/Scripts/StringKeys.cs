public static class StringKeys
{
    public const string LoadingText = "Loading {0}%";
    public const string StepsStatusText = "{0}/{1} Steps";
    public const string VersionText = "Ver. {0}";
    public const string StepsSetUpCountText = "{0} steps";
    public const string PetStatusOnMonitorText = "<color=#{1}>is {0}</color>";
    public const string PetMenuInfoText = "{0}: <color=#{1}>{2}{3}</color>";
    public const string ReviveInAppButtonText = "Revive {0}";
    public const string ResultPopupTextFormat = "Total score last week: \n{0} steps";
    public const string ResultPopupLeagueFormat = "{0} League";
    public const string CollectionPopupText = "You've Got {0}/24 Little Companions So Far. The Rest Are Waiting For You";
    public const string NoPetsCollectionPopupText = "There Are No Pets In The Collection Yet";
    public const string ConfirmationReplacePopupText = "Do you want to replace\nyour oldest pet\n<color=#652A09>{0}</color>\nwith this new one?";

    public const string HintCompletePrevAction = "Complete previous actions";
    public const string HintNeedToHitStepGoal = "You need to hit {0}% \nof your step goal";

    public const string DeathPopupText =
        "Your pet died from lack of care. You can revive <color=#{0}>{1}</color> to save your best streak progress. Or start from scratch with a new pet, and <color=#{0}>{1}</color> ends up in the Graveyard.";

    #region Permissions

    public const string IOSAuthorizeHealthButtonTitle = "Authorize HealthKit";
    public const string AndroidAuthorizeHealthButtonTitle = "Authorize Health Connect";

    public const string IOSAuthorizeHealthDesc =
        "StepPals requires Health access to function. Without step data, your pet can’t track progress and the core experience is unavailable.\n\nYou can always manage permissions later in your \ndevice Settings.";

    public const string AndroidAuthorizeHealthDesc =
        "Note: To keep step counts consistent, any other step-tracking apps you use must also sync with Health Connect.\n\nYou can always manage permissions later in your \ndevice Settings.";

    #endregion

    #region Subscription

    public const string HasFreeTrialText = "Subscribe to keep caring for your StepPal.\nYou can cancel at anytime";

    public const string NoFreeTrialText =
        "Subscription expired — gameplay is paused.\nSubscribe to come back!\nYou can cancel at anytime";

    public const string PerYear = "/year";
    public const string PerMonth = "/month";
    public const string PerWeek = "/week";

    public const string WelcomeFreeTrialTitle = "Welcome!";
    public const string WelcomeBackTitle = "Welcome Back!";

    public const string WelcomeFreeTrialText =
        "Enjoy <color=#806D58>3 Days</color> of full access. Walk and take care of your StepPal!";

    public const string WelcomeText = "Full access restored - time to walk and care!";

    #endregion

    #region Statistics

    public const string BestStreakText = "Best Streak: <color=#{1}>{0}</color>";
    public const string CurrentStreakText = "Current Streak: <color=#{1}>{0}</color>";
    public const string TotalMissedDaysText = "Total Missed Days: <color=#{1}>{0}</color>";
    public const string DeadPetsText = "Dead Pets: <color=#{1}>{0}</color>";
    public const string FullyGrownPetsText = "Fully Grown Pets: <color=#{1}>{0}</color>";

    #endregion

    #region EvolutionStagePopupTexts

    public const string TeenPopupTitle = "Great job!";
    public const string AdultPopupTitle = "Congratulations!";

    public const string TeenPopupSubtitle = "Your Pet is growing up!";
    public const string AdultPopupSubtitle = "Your Pet Has Grown Up!";

    public const string TeenPopupMainText =
        "You've taken care of <color=#{1}>{0}</color>\nfor <color=#{1}>{2}</color> days!";

    public const string AdultPopupMainText =
        "Keep nurturing <color=#{1}>{0}</color> to stay on track and maintain your streak!\n";

    #endregion

    #region ConditionsPopupsTexts

    public const string SickPopupText =
        "You didn't reach your goal yesterday, so your pet is sick. Take care of {0} so that it gets better! If you miss another day it will get very sick!";

    public const string VerySickPopupText =
        "You missed <color=#{1}>2</color> days and your pet is very sick. One more missed day and it may die.Take care of <color=#{1}>{0}</color> to prevent it from dying!";

    #endregion

    #region PetMenuStats

    public const string StepsGoalCountText = "{0} steps/day";
    public const string GrowthDaysFormat = "{0}/<color=#{1}>{2}{3}</color>";
    public const string MaxGrowthDaysFormat = "<color=#{0}>MAX</color>";

    public const string Species = "Species";
    public const string Age = "Age";
    public const string AgeMeasurePlural = " days";
    public const string AgeMeasureSingular = " day";
    public const string Condition = "Condition";
    public const string MatureStage = "Mature stage";
    public const string MissedDays = "Missed days";

    #endregion

    #region Pets

    public const string DogTypeName = "Dog";
    public const string CatTypeName = "Cat";
    public const string DinoTypeName = "Dino";

    public const string BabyDogTypeName = "Puppy";
    public const string BabyCatTypeName = "Kitten";
    public const string BabyDinoTypeName = "Dino";

    #endregion

    #region Conditions

    public const string Healthy = "Healthy";
    public const string Sick = "Sick";
    public const string VerySick = "Very Sick";
    public const string Dead = "Dead";

    public const string HealthyOnMonitor = "Happy";

    #endregion

    #region HatchEggText

    public const string NoTapsText = "Tap the egg to hatch it!";
    public const string AfterFirstTapText = "Keep tapping!";

    #endregion

    #region Errors

    public const string TooShortNameError = "Name is too short. Minimum 2 characters";
    public const string NotAllowedCharacterError = "Only letters, numbers, space and '_'";
    public const string NotLatinCharacterError = "Please use Latin letters (A-Z) only";
    public const string EmptyFieldError = "This field cannot be empty";

    #endregion

    #region URLs

    private const string AppleTermsOfUseURL = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";
    private const string AndroidTermsOfUseURL = "https://play.google.com/about/play-terms/";
    public const string PrivacyPolicyURL = "https://steppals.co/";

    public static string GetTermsOfUseURL()
    {
    #if UNITY_IOS
        return AppleTermsOfUseURL;
    #else
        return AndroidTermsOfUseURL;
    #endif
    }

    #endregion

    #region Login

    public const string SignInWithText = "Sign In With {0}";
    public const string SignOutWithText = "Sign Out Of {0}";
    public const string AppleAccount = "Apple";
    public const string GoogleAccount = "Google";

    #endregion
}