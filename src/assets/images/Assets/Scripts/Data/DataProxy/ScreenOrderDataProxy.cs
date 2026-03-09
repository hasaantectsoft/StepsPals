using UniRx;

namespace Data.DataProxy
{
    public class ScreenOrderDataProxy
    {
        private readonly ReactiveProperty<bool> _isGoingForward = new(true);
        public IReadOnlyReactiveProperty<bool> IsGoingForward => _isGoingForward;

        public void SetClosingScreenDirectingForward(bool isForward)
        {
            _isGoingForward.Value = isForward;
        }
    }
}