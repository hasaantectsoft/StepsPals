using Balances.Leaderboard;
using UnityEngine;
using Zenject;

namespace Balances
{
    [CreateAssetMenu(fileName = "GameBalancesSO", menuName = "SO/Balances/GameBalancesSO")]
    public class GameBalancesSOInstaller : ScriptableObjectInstaller<GameBalancesSOInstaller>
    {
        [SerializeField] private GameBalances balances;
        [SerializeField] private LeaderboardBalances leaderboardBalances;

        public override void InstallBindings()
        {
            Container.BindInstance(balances);
            Container.BindInstance(leaderboardBalances);
        }
    }
}