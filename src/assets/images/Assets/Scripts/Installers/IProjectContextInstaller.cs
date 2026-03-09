namespace Installers
{
    public interface IProjectContextInstaller
    {
        public T Create<T>();
        public T Create<T>(params object[] args);
    }
}