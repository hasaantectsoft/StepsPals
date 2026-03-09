using System;
using JetBrains.Annotations;

namespace ScreenNavigationSystem
{
    public class NavigationCommand
    {
        public Type NextScreenType { get; private set; }
        public Type? ScreenToClose { get; private set; }
        public object ExtraData { get; private set; }
        public bool IsWithAnimation { get; private set; } = true;
        public bool IsDelayed { get; private set; }
        public bool IsCloseCurrentScreen { get; private set; }
        public bool IsCloseScreens { get; private set; }
        [CanBeNull] public Func<ScreenPresenter, bool> CloseCondition { get; private set; }
        public bool CanReturnToPreviousScreen { get; private set; }
        public bool ShouldCloseAfterNextScreenShown { get; private set; }
        public bool IsGlobal { get; private set; }

        public bool IsNextScreenInQueue => NextScreenType != null;

        /// <summary>
        ///     Opens a screen of the specified type.
        /// </summary>
        public NavigationCommand ShowNextScreen<TScreenType>() where TScreenType : ScreenPresenter =>
            ShowNextScreen(typeof(TScreenType));

        /// <summary>
        ///     Opens a screen of the specified type.
        /// </summary>
        public NavigationCommand ShowNextScreen(Type screenType)
        {
            NextScreenType = screenType;
            return this;
        }

        /// <summary>
        ///     Allows you to pass some data to the screen before it is shown. (Works only together with ShowNextScreen)
        /// </summary>
        public NavigationCommand WithExtraData(object data)
        {
            ExtraData = data;
            return this;
        }

        /// <summary>
        ///     Show screen with or without animation. (Works only together with ShowNextScreen. Without specifying this parameter,
        ///     Delayed = true by default)
        /// </summary>
        public NavigationCommand Animated(bool withAnimation = true)
        {
            IsWithAnimation = withAnimation;
            return this;
        }

        /// <summary>
        ///     Show the screen with or without delay. Delay means that this screen will be shown after the previous one is closed.
        ///     (Works only together with ShowNextScreen. Without specifying this parameter, Delayed = false by default)
        /// </summary>
        public NavigationCommand Delayed(bool isDelayed = true)
        {
            IsDelayed = isDelayed;
            return this;
        }

        /// <summary>
        ///     Closes the currently active screen. (Not compatible with "CloseScreen", "CloseAllScreensByConditions" and
        ///     "CloseAfterNextScreenShown"!)
        /// </summary>
        public NavigationCommand CloseCurrentScreen()
        {
            IsCloseCurrentScreen = true;
            ScreenToClose = null;
            return this;
        }

        /// <summary>
        ///     Instantly closes all screens that satisfy the specified condition. (Not compatible with "CloseScreen",
        ///     CloseAllScreens", "CloseCurrentScreen" and
        ///     "CloseAfterNextScreenShown"!)
        /// </summary>
        public NavigationCommand CloseAllScreensByConditions([CanBeNull] Func<ScreenPresenter, bool> condition)
        {
            CloseCondition = condition;
            IsCloseScreens = true;
            return this;
        }

        /// <summary>
        ///     Closes all screens. If the condition is empty, then
        ///     closes all screens. (Not compatible with "CloseScreen", CloseAllScreens", "CloseCurrentScreen" and
        ///     "CloseAfterNextScreenShown"!)
        /// </summary>
        public NavigationCommand CloseAllScreens()
        {
            CloseCondition = null;
            IsCloseScreens = true;
            return this;
        }

        /// <summary>
        ///     Closes a screen of the specified type. (Not compatible with "CloseAllScreensByConditions", CloseAllScreens",
        ///     "CloseCurrentScreen" and
        ///     "CloseAfterNextScreenShown"!)
        /// </summary>
        public NavigationCommand CloseScreen<TScreenType>() where TScreenType : ScreenPresenter =>
            CloseScreen(typeof(TScreenType));

        /// <summary>
        ///     Closes a screen of the specified type. (Not compatible with "CloseAllScreensByConditions", CloseAllScreens",
        ///     "CloseCurrentScreen" and
        ///     "CloseAfterNextScreenShown"!)
        /// </summary>
        public NavigationCommand CloseScreen(Type screenType)
        {
            ScreenToClose = screenType;
            IsCloseCurrentScreen = false;
            return this;
        }

        /// <summary>
        ///     Closes the current screen after showing the next one. (Works only together with "ShowNextScreen". Not compatible
        ///     with "CloseAllScreensByConditions", CloseAllScreens", "CloseCurrentScreen" and "CloseScreen"!)
        /// </summary>
        public NavigationCommand CloseAfterNextScreenShown(bool isShouldCloseAfterNextScreenShown = true)
        {
            ShouldCloseAfterNextScreenShown = isShouldCloseAfterNextScreenShown;
            return this;
        }

        /// <summary>
        ///     Allows you to return to the screen if it was open before. This means that all screens that were open after it will
        ///     be closed. (Works only together with "ShowNextScreen". Without specifying this parameter, CanReturnToPreviousScreen
        ///     = false by default)
        /// </summary>
        public NavigationCommand CanReturnToPrevious()
        {
            CanReturnToPreviousScreen = true;
            return this;
        }

        /// <summary>
        ///     If the parameter Global = true, then the screen will be opened in the project context. If Global = false, then in
        ///     the scene context. (Without specifying this parameter, Global = false by default)
        /// </summary>
        public NavigationCommand Global(bool isGlobal = true)
        {
            IsGlobal = isGlobal;
            return this;
        }
    }
}