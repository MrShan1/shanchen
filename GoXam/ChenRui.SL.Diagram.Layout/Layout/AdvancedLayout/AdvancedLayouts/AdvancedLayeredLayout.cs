using System;
using System.Windows;
using Northwoods.GoXam.Layout;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 高级分层布局
    /// </summary>
    public class AdvancedLayeredLayout : AdvancedLayout
    {
        public static readonly DependencyProperty LayerKeyProperty = DependencyProperty.Register("LayerKey", typeof(string), typeof(AdvancedLayeredLayout), new PropertyMetadata("floorNum", OnPropertyChanged));

        /// <summary>
        /// 分层依据的关键属性名称
        /// </summary>
        public string LayerKey
        {
            get { return (string)GetValue(LayerKeyProperty); }
            set { SetValue(LayerKeyProperty, value); }
        }

        public static readonly DependencyProperty IsHorizontalProperty = DependencyProperty.Register("IsHorizontal", typeof(bool), typeof(AdvancedLayeredLayout), new PropertyMetadata(true, OnPropertyChanged));

        /// <summary>
        /// 是否是水平布局
        /// </summary>
        public bool IsHorizontal
        {
            get { return (bool)GetValue(IsHorizontalProperty); }
            set { SetValue(IsHorizontalProperty, value); }
        }

        public static readonly DependencyProperty NodeDistanceProperty = DependencyProperty.Register("NodeDistance", typeof(double), typeof(AdvancedLayeredLayout), new PropertyMetadata(10.0, OnPropertyChanged));

        /// <summary>
        /// 节点间距离
        /// </summary>
        public double NodeDistance
        {
            get { return (double)GetValue(NodeDistanceProperty); }
            set { SetValue(NodeDistanceProperty, value); }
        }

        public static readonly DependencyProperty LayerDistanceProperty = DependencyProperty.Register("LayerDistance", typeof(double), typeof(AdvancedLayeredLayout), new PropertyMetadata(20.0, OnPropertyChanged));

        /// <summary>
        /// 层间距离
        /// </summary>
        public double LayerDistance
        {
            get { return (double)GetValue(LayerDistanceProperty); }
            set { SetValue(LayerDistanceProperty, value); }
        }
    }
}
