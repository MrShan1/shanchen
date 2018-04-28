using System.Windows;

namespace Northwoods.GoXam
{
    public interface ILocatable
    {
        Point Location { get; set; }

        double Width { get; }

        double Height { get; }

    }
}
