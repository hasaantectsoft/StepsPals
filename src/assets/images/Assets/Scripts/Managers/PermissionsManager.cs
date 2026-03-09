using Analytics;
using Data.DataProxy;
using Steps;

namespace Managers
{
    public class PermissionsManager
    {
        private readonly PushNotificationManager _pushNotificationManager;
        private readonly PermissionsDataProxy _permissionsDataProxy;
        private readonly StepsManager _stepsManager;

        public PermissionsManager(PushNotificationManager pushNotificationManager,
            PermissionsDataProxy permissionsDataProxy,
            StepsManager stepsManager)
        {
            _pushNotificationManager = pushNotificationManager;
            _permissionsDataProxy = permissionsDataProxy;
            _stepsManager = stepsManager;
        }

        public void TryInitializePermissions()
        {
            if (!_permissionsDataProxy.IsPermissionGranted)
            {
                return;
            }

            InitializeNotifications();
            InitializeStepsManager();
        }

        public void InitializeNotifications() => _pushNotificationManager.Initialize();
        public void InitializeStepsManager() => _stepsManager.Initialize();

        public void GrantPermissions()
        {
            DevToDevManager.LogEvent(DevToDevKey.start_onboarding_steps,
                (DevToDevKey.onboarding_step, DevToDevKey.permissions_granted_5.ToString()));
            _permissionsDataProxy.GrandPermissions();
        }
    }
}