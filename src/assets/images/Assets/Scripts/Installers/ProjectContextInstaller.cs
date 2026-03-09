using System;
using System.Linq;
using Analytics;
using Assets;
using Authentication;
using Data;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using InApps;
using Infrastructure.GameStateMachine;
using Managers;
using Managers.OpenPopupsQueue;
using Modules.InAppPurchasesProvider;
using Notifications;
using Playfab;
using SaveSystem;
using SceneManagement;
using ScreenNavigationSystem;
using Services;
using Steps;
using Subscription;
using Tutorials.ViewPresenter;
using UnityEngine;
using Zenject;

namespace Installers
{
    public class ProjectContextInstaller : MonoInstaller, IProjectContextInstaller
    {
        public T Create<T>() => Container.Instantiate<T>();

        public T Create<T>(params object[] args) => Container.Instantiate<T>(args);

        public override void InstallBindings()
        {
            Container.BindInterfacesTo<ProjectContextInstaller>().FromInstance(this).AsSingle();
            BindCore();
            BindManagers();
            BindServices();
            BindDataProxies();
            Container.Bind<StepsManager>().FromComponentInHierarchy().AsSingle();
        }

        private void BindCore()
        {
            Container.BindInterfacesAndSelfTo<GameStateMachine>().AsSingle().NonLazy();
            Container.Bind<ProjectScreensInstaller>().FromComponentInHierarchy().AsSingle().NonLazy();
            Container.Bind<ScreensController>().AsSingle().NonLazy();
            Container.Bind<SceneLoader>().AsSingle().NonLazy();
            Container.Bind<AssetsProvider>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<IAPProvider>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<InAppPurchasesController>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<TutorialOverlayPresenter>().FromComponentsInHierarchy().AsSingle();
            Container.Bind<RevenueCatManager>().FromComponentInHierarchy().AsSingle().NonLazy();
        }

        private void BindManagers()
        {
            Container.Bind<DayChangeManager>().AsSingle().NonLazy();
            Container.Bind<DeviceIdManager>().AsSingle().NonLazy();
            Container.Bind<BinarySaveSystem>().AsSingle().NonLazy();
            Container.Bind<GameNotificationsManager>().FromNewComponentOnNewGameObject().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<PushNotificationManager>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<StatisticsManager>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<DevToDevManager>().FromComponentsInHierarchy().AsSingle();
            Container.BindInterfacesAndSelfTo<SubscriptionManager>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<OpenPopupOnLaunchManager>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<RateUsManager>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<StepProgressManager>().AsSingle().NonLazy();
            Container.Bind<IApiInterface>().To<PlayfabApi>().AsSingle().NonLazy();
            BindAuthenticationManager();
        }

        private void BindAuthenticationManager()
        {
            switch (Application.platform)
            {
                case RuntimePlatform.Android:
                    Container.Bind<IAuthenticationManager>().To<AndroidAuthenticationManager>().AsSingle().NonLazy();
                    break;
                case RuntimePlatform.IPhonePlayer:
                    Container.Bind<IAuthenticationManager>().To<AppleAuthenticationManager>().AsSingle().NonLazy();
                    break;
                default:
                    Container.Bind<IAuthenticationManager>().To<EditorAuthenticationManager>().AsSingle().NonLazy();
                    break;
            }
        }

        private void BindServices()
        {
            Container.BindInterfacesAndSelfTo<InternetConnectionService>().AsSingle().NonLazy();

            #if UNITY_IOS
                // Use reflection to avoid circular assembly dependency
                var widgetDataExporterType = AppDomain.CurrentDomain.GetAssemblies()
                    .SelectMany(a => a.GetTypes())
                    .FirstOrDefault(t => t.FullName == "iOS.WidgetDataExporter");
                
                if (widgetDataExporterType != null)
                {
                    Container.BindInterfacesAndSelfTo(widgetDataExporterType).AsSingle().NonLazy();
                }
            #endif
        }

        private void BindDataProxies()
        {
            Container.BindInterfacesAndSelfTo<PlayersPetsDataProxy>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<StatisticsDataProxy>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<HealthStepsDataProxy>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<PermissionsDataProxy>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<TutorialsDataProxy>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<DataController>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<TimeDataProxy>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<LeaderboardsDataProxy>().AsSingle().NonLazy();
            Container.Bind<ScreenOrderDataProxy>().AsSingle().NonLazy();
            Container.Bind<MonetizationDataProxy>().AsSingle().NonLazy();
        }
    }
}