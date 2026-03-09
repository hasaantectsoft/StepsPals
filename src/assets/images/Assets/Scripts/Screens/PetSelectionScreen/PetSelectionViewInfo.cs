namespace Screens.PetSelectionScreen
{
    public struct PetSelectionViewInfo
    {
        public bool ResetView { get; private set; }

        public PetSelectionViewInfo(bool resetView)
        {
            ResetView = resetView;
        }
    }
}