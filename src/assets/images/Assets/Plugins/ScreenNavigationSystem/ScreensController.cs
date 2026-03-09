using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using JetBrains.Annotations;
using UnityEngine;
using UnityEngine.SceneManagement;
#if SNS_WITH_UNIRX
    using UniRx;
#endif

namespace ScreenNavigationSystem
{
    public class ScreensController : IDisposable
    {
        private readonly List<ScreenPresenter> _navigationStack = new();
        private readonly List<ScreenPresenter> _localScreens = new();
        private readonly Dictionary<Type, ScreenPresenter> _availableScreens = new();
        private readonly Queue<NavigationCommand> _delayedCommands = new();
        private readonly Queue<NavigationCommand> _waitingCommands = new();
        private readonly ProjectScreensInstaller _projectScreensInstaller;

    #if SNS_WITH_UNIRX
        private readonly Subject<Type> _screenShowing = new();
        private readonly Subject<Type> _screenClosing = new();
        public ISubject<Type> ScreenShowing => _screenShowing;
        public ISubject<Type> ScreenClosing => _screenClosing;
        private CompositeDisposable _compositeDisposable;
    #else
        public event Action<Type> ScreenShowing;
        public event Action<Type> ScreenClosing;
    #endif

        private ScreenPresenter _currentShowAnimatedScreen;
        private IEnumerator _showInformationProcess;
        private SceneScreensInstaller _sceneScreensInstaller;
        private Type? _screenUnderProcessing;

        private IDisposable _shouldCloseAfterNextScreenShownDisposable;

        public bool IsSomeScreenActiveNow => _navigationStack.Any(screen => screen.OrderLayer != 0);

        public ScreensController(ProjectScreensInstaller projectScreensInstaller)
        {
            _projectScreensInstaller = projectScreensInstaller;
            SceneManager.sceneUnloaded += scene =>
            {
                foreach (ScreenPresenter localScreen in _localScreens)
                {
                    if (_navigationStack.Contains(localScreen))
                    {
                        if (_currentShowAnimatedScreen == localScreen)
                        {
                            _currentShowAnimatedScreen = null;
                        }

                        _navigationStack.Remove(localScreen);
                    }

                    if (_availableScreens.ContainsKey(localScreen.GetType()))
                    {
                        _availableScreens.Remove(localScreen.GetType());
                    }
                }

                _localScreens.Clear();
                LogStack();
            };
        }

        public void Dispose()
        {
        #if SNS_WITH_UNIRX
            _screenShowing?.Dispose();
            _screenClosing?.Dispose();
            _compositeDisposable?.Dispose();
        #endif
            _shouldCloseAfterNextScreenShownDisposable?.Dispose();
        }

        public bool IsScreenActive<TScreenType>() where TScreenType : ScreenPresenter =>
            _navigationStack.Any(it => it is TScreenType);

        public bool IsScreenActive(Type screenType) => _navigationStack.Any(it => it.GetType() == screenType);

        public void SetSceneScreensInstaller(SceneScreensInstaller sceneScreensInstaller)
        {
            _sceneScreensInstaller = sceneScreensInstaller;
        }

        public void ExecuteCommand(NavigationCommand navigationCommand)
        {
            if (navigationCommand.IsDelayed && (_currentShowAnimatedScreen != null || _navigationStack.Count != 0))
            {
                _delayedCommands.Enqueue(navigationCommand);
                return;
            }

            if (_navigationStack.Count != 0)
            {
                if (navigationCommand.IsNextScreenInQueue)
                {
                    PreparePreviousScreens(navigationCommand);
                }

                if (navigationCommand.IsCloseCurrentScreen)
                {
                    Close(_navigationStack.Last(), navigationCommand.IsNextScreenInQueue);
                }

                if (navigationCommand.ScreenToClose != null &&
                    _availableScreens.TryGetValue(navigationCommand.ScreenToClose, out ScreenPresenter screenPresenter))
                {
                    Close(screenPresenter, navigationCommand.IsNextScreenInQueue);
                }

                if (navigationCommand.IsCloseScreens)
                {
                    ForceCloseScreensByCondition(navigationCommand.CloseCondition);
                }
            }

            if (!navigationCommand.IsNextScreenInQueue)
            {
                return;
            }

            bool isReturnedToPrevious = false;
            if (navigationCommand.CanReturnToPreviousScreen)
            {
                isReturnedToPrevious = ReturnToPreviousScreenInStack(navigationCommand);
            }

            if (isReturnedToPrevious)
            {
                return;
            }

            Show(navigationCommand);
        }

        private void GetNewScreen(NavigationCommand navigationCommand)
        {
            if (!navigationCommand.IsGlobal && _sceneScreensInstaller == null)
            {
                Debug.LogError("SNS | Scene Screens Installer does not exist on the scene!");
                return;
            }

            (navigationCommand.IsGlobal ? _projectScreensInstaller : _sceneScreensInstaller).InstantiateScreen(
                navigationCommand.NextScreenType, screen =>
                {
                    _screenUnderProcessing = null;
                    if (!navigationCommand.IsGlobal)
                    {
                        _localScreens.Add(screen);
                    }

                    AddScreen(navigationCommand.NextScreenType, screen);
                    ExecuteCommand(navigationCommand);
                });
        }

        private void AddScreen(Type type, ScreenPresenter screenPresenter)
        {
            _availableScreens[type] = screenPresenter;
            screenPresenter.PrepareScreen(() => Close(screenPresenter));
            if (screenPresenter.ShouldDeleteAfterHide)
            {
            #if SNS_WITH_UNIRX
        screenPresenter.OnHideCallback.Subscribe(_ => { _availableScreens.Remove(type); })
                    .AddTo(_compositeDisposable);
            #else
                screenPresenter.OnHideCallback += () => { _availableScreens.Remove(type); };
            #endif
            }
        }

        private void PreparePreviousScreens(NavigationCommand navigationCommand)
        {
            ScreenPresenter peek = _navigationStack.Last();
            peek.LostFocus();

            if (!_availableScreens.ContainsKey(navigationCommand.NextScreenType))
            {
                //GetNewScreen(navigationCommand.NextScreenName, () => PreparePreviousScreens(navigationCommand));
                return;
            }

            ScreenPresenter nextScreen = _availableScreens[navigationCommand.NextScreenType];

            //lay stack under next screen layer to correct show animation
            LayStackUnderNextScreen(nextScreen);


            if (peek == nextScreen)
            {
                return;
            }

            if (navigationCommand.ShouldCloseAfterNextScreenShown)
            {
            #if SNS_WITH_UNIRX
                _shouldCloseAfterNextScreenShownDisposable = nextScreen.OnShowCallback.Subscribe(_ =>
                {
                    Close(peek);
                    _shouldCloseAfterNextScreenShownDisposable?.Dispose();
                });
            #else
                void OnNewScreenActivatedAction(object obj)
                {
                    Close(peek);
                    nextScreen.OnShowCallback -= OnNewScreenActivatedAction;
                }

                nextScreen.OnShowCallback += OnNewScreenActivatedAction;
            #endif
            }
        }

        private void LayStackUnderNextScreen(ScreenPresenter nextScreen)
        {
            if (nextScreen == null)
            {
                return;
            }

            ScreenPresenter[] array = _navigationStack.ToArray();
            for (int index = 0; index < array.Length; index++)
            {
                ScreenPresenter screenPresenter = array[index];
                screenPresenter.LayUnderScreen(index + 1);
            }

            nextScreen.LayUnderScreen(array.Length + 1);
        }

        private bool ReturnToPreviousScreenInStack(NavigationCommand navigationCommand)
        {
            bool isReturnToPrevious = false;
            ScreenPresenter nextScreen = _availableScreens[navigationCommand.NextScreenType];
            if (nextScreen != null && _navigationStack.Count != 0 && _navigationStack.Contains(nextScreen))
            {
                isReturnToPrevious = true;
                while (_navigationStack.Last() != nextScreen && _navigationStack.Count != 0)
                {
                    ScreenPresenter peek = _navigationStack.Last();
                    peek.DeactivateScreen();
                    _navigationStack.Remove(peek);
                }

                nextScreen.GotFocus();
            }

            return isReturnToPrevious;
        }

        private void Show(NavigationCommand navigationCommand)
        {
            Type screenType = navigationCommand.NextScreenType;
            object extraData = navigationCommand.ExtraData;
            bool withAnim = navigationCommand.IsWithAnimation;

        #if SNS_LOGS
            Debug.Log("SNS | Try to show screen " + screenType);
        #endif

            if (screenType == _screenUnderProcessing)
            {
                return;
            }

            if (!_availableScreens.TryGetValue(screenType, out ScreenPresenter screenToShow) || screenToShow == null)
            {
            #if SNS_LOGS
                Debug.Log($"SNS | Screen {screenType} has not loaded yet. Try to load.");
            #endif
                _screenUnderProcessing = screenType;
                GetNewScreen(navigationCommand);
                return;
            }

            if (_localScreens.Contains(screenToShow) && navigationCommand.IsGlobal)
            {
            #if SNS_LOGS
                Debug.Log($"SNS | Try to reopen Screen {screenType} in project context.");
            #endif
                ForceCloseScreen(screenToShow);

                if (_availableScreens.ContainsKey(screenToShow.GetType()))
                {
                    _availableScreens.Remove(screenToShow.GetType());
                }

                _localScreens.Remove(screenToShow);
                _sceneScreensInstaller.DestroyScreen(screenToShow);
                Show(navigationCommand);
                return;
            }

            if (!_localScreens.Contains(screenToShow) && !navigationCommand.IsGlobal)
            {
            #if SNS_LOGS
                Debug.Log($"SNS | Try to reopen Screen {screenType} in scene context.");
            #endif
                ForceCloseScreen(screenToShow);

                if (_availableScreens.ContainsKey(screenToShow.GetType()))
                {
                    _availableScreens.Remove(screenToShow.GetType());
                }

                _projectScreensInstaller.DestroyScreen(screenToShow);
                Show(navigationCommand);
                return;
            }

            if (_currentShowAnimatedScreen == _availableScreens[screenType])
            {
                Debug.LogError("SNS | You are trying to show the same screen again. " + screenType);
                return;
            }

            if (_currentShowAnimatedScreen != null && withAnim)
            {
            #if SNS_LOGS
                Debug.Log("SNS | Animation of another screen is still running (WAIT)");
            #endif
                if (_waitingCommands.Any(nc => nc.NextScreenType == screenType))
                {
                    return;
                }

                _waitingCommands.Enqueue(navigationCommand);
                return;
            }

            ScreenPresenter screenPresenter = _availableScreens[screenType];
            CheckRootScreenShown(screenPresenter);
            AddScreenToStack(screenPresenter);
        #if SNS_WITH_UNIRX
            _screenShowing.OnNext(screenType);
        #else
            ScreenShowing?.Invoke(screenType);
        #endif

            if (screenPresenter.ShowAnimation != null && withAnim)
            {
                _currentShowAnimatedScreen = screenPresenter;
                screenPresenter.PerformShowAnimationWhenReady(delegate
                {
                    _currentShowAnimatedScreen = null;
                    if (_waitingCommands.Count <= 0)
                    {
                        return;
                    }

                    NavigationCommand waitingNavigationCommand = _waitingCommands.Dequeue();
                    ExecuteCommand(waitingNavigationCommand);
                });
                screenPresenter.InvokeShowWith(extraData);
            }
            else
            {
                screenPresenter.ShowOnPosition(extraData);
            }

            LogStack();
        }

        private void CheckRootScreenShown(ScreenPresenter screenPresenter)
        {
            if (screenPresenter.OrderLayer != 0)
            {
                return;
            }

        #if SNS_LOGS
            Debug.Log("SNS | Root screen shown. Close all screens");
        #endif

            for (int i = _navigationStack.Count - 1; i >= 0; i--)
            {
                if (screenPresenter != _navigationStack[i])
                {
                    Close(_navigationStack[i]);
                }
            }
        }

        private void LogStack()
        {
        #if SNS_LOGS
            if (_navigationStack.Count == 0)
            {
                Debug.Log("SNS | -----Stack is empty!-----");
            }
            else
            {
                Debug.Log("SNS | -----Now in stack:-----");
                foreach (ScreenPresenter screen in _navigationStack)
                {
                    Debug.Log("SNS | " + screen.name);
                }
            }
        #endif
        }

        private void AddScreenToStack(ScreenPresenter screenPresenter)
        {
            if (_navigationStack.Count != 0 && _navigationStack.Contains(screenPresenter))
            {
                Debug.LogWarning("SNS | Can not add screen " + screenPresenter.name +
                                 " to stack because they already in");
                LogStack();
                return;
            }

            _navigationStack.Add(screenPresenter);
        #if SNS_LOGS
            Debug.Log("SNS | Screen ADDED to stack " + screenPresenter.name);
        #endif

            LogStack();
        }

        private void RemoveScreenFromStack(ScreenPresenter screenPresenter, bool nextScreenInQueue = false)
        {
            if (_navigationStack.Count == 0)
            {
                return;
            }

            if (_navigationStack.Contains(screenPresenter))
            {
                _navigationStack.Remove(screenPresenter);

            #if SNS_WITH_UNIRX
                _screenClosing.OnNext(screenPresenter.GetType());
            #else
                ScreenClosing?.Invoke(screenPresenter.GetType());
            #endif
                screenPresenter.LostFocus();
                if (_delayedCommands.Count > 0)
                {
                    NavigationCommand nextNavigationCommand = _delayedCommands.Dequeue();
                    nextNavigationCommand.Delayed(false);
                    Show(nextNavigationCommand);
                }
                else if (_navigationStack.Count > 0 && !nextScreenInQueue)
                {
                    //move focus to previous screen
                    ScreenPresenter activeScreen = _navigationStack.Last();
                    activeScreen.GotFocus();
                }

            #if SNS_LOGS
                Debug.Log("SNS | Screen REMOVED from stack " + screenPresenter.name);
            #endif
                if (_navigationStack.Count > 0)
                {
                    //check previous screen for panels
                    ScreenPresenter activeScreen = _navigationStack.Last();
                #if SNS_LOGS
                    Debug.Log("SNS | After close now screen name: " + activeScreen.gameObject.name);
                #endif
                }
            }

            LogStack();
        }

        private void Close(ScreenPresenter screenPresenter, bool nextScreenInQueue = false, bool withAnim = true)
        {
            if (!_navigationStack.Contains(screenPresenter))
            {
                return;
            }

            RemoveScreenFromStack(screenPresenter, nextScreenInQueue);

            if (screenPresenter.HideAnimation == null || !withAnim)
            {
                screenPresenter.DeactivateScreen();
            }
            else
            {
                screenPresenter.PerformHideAnimation(screenPresenter.DeactivateScreen);
            }
        }

        private void ForceCloseScreensByCondition([CanBeNull] Func<ScreenPresenter, bool> condition = null)
        {
            for (int i = _navigationStack.Count - 1; i >= 0; i--)
            {
                ScreenPresenter someScreen = _navigationStack[i];
                if (condition == null || condition(someScreen))
                {
                    ForceCloseScreen(someScreen);
                }
            }
        }

        private void ForceCloseScreen(ScreenPresenter screen)
        {
            screen.HideAnimation?.KillAnim();
            screen.ShowAnimation?.KillAnim();
            if (_currentShowAnimatedScreen == screen)
            {
                _currentShowAnimatedScreen = null;
            }

            screen.DeactivateScreen();
            RemoveScreenFromStack(screen);
        }
    }
}