#region Copyright ©2011北京宸瑞科技有限公司
/* 
 * 
 * FileName:
 * 
 * Author:  时钟
 * 
 * Date:    
 * 
 * Descript:
 * 
 */
#endregion

using System;
using System.Windows;
using Northwoods.GoXam.Layout;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 高级圆形布局
    /// </summary>
    public class AdvancedCircleLayout : AdvancedLayout
    {
        /// <summary>
        /// 标识ArcSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty ArcSpacingRatioProperty = DependencyProperty.Register("ArcSpacingRatio", typeof(double), typeof(AdvancedCircleLayout), new PropertyMetadata(0.0, OnPropertyChanged));

        /// <summary>
        /// 弧间距比例
        /// </summary>
        public double ArcSpacingRatio
        {
            get { return (double)GetValue(ArcSpacingRatioProperty); }
            set { SetValue(ArcSpacingRatioProperty, value); }
        }

        /// <summary>
        /// 标识Radius依赖属性
        /// </summary>
        public static readonly DependencyProperty RadiusProperty = DependencyProperty.Register("Radius", typeof(double), typeof(AdvancedCircleLayout), new PropertyMetadata(Double.NaN, OnPropertyChanged));  // may be NaN

        /// <summary>
        /// 半径
        /// </summary>
        public double Radius
        {
            get { return (double)GetValue(RadiusProperty); }
            set { SetValue(RadiusProperty, value); }
        }

        /// <summary>
        /// 标识AspectRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty AspectRatioProperty = DependencyProperty.Register("AspectRatio", typeof(double), typeof(AdvancedCircleLayout), new PropertyMetadata(1.0, OnPropertyChanged));

        /// <summary>
        /// 偏率
        /// </summary>
        public double AspectRatio
        {
            get { return (double)GetValue(AspectRatioProperty); }
            set { SetValue(AspectRatioProperty, value); }
        }

        /// <summary>
        /// 标识StartAngle依赖属性
        /// </summary>
        public static readonly DependencyProperty StartAngleProperty = DependencyProperty.Register("StartAngle", typeof(double), typeof(AdvancedCircleLayout), new PropertyMetadata(-90.0, OnPropertyChanged));

        /// <summary>
        /// 起始角度
        /// </summary>
        public double StartAngle
        {
            get { return (double)GetValue(StartAngleProperty); }
            set { SetValue(StartAngleProperty, value); }
        }

        /// <summary>
        /// 标识IsClockwise依赖属性
        /// </summary>
        public static readonly DependencyProperty IsClockwiseProperty = DependencyProperty.Register("IsClockwise", typeof(bool), typeof(AdvancedCircleLayout), new PropertyMetadata(true, OnPropertyChanged));

        /// <summary>
        /// 是否是顺时针
        /// </summary>
        public bool IsClockwise
        {
            get { return (bool)GetValue(IsClockwiseProperty); }
            set { SetValue(IsClockwiseProperty, value); }
        }

        /// <summary>
        /// 标识CenterNodeDistanceRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty CenterNodeDistanceRatioProperty = DependencyProperty.Register("CenterNodeDistanceRatio", typeof(double), typeof(AdvancedCircleLayout), new PropertyMetadata(0.3, OnPropertyChanged));

        /// <summary>
        /// 中心点距离比例
        /// </summary>
        public double CenterNodeDistanceRatio
        {
            get { return (double)GetValue(CenterNodeDistanceRatioProperty); }
            set { SetValue(CenterNodeDistanceRatioProperty, value); }
        }

    }
}
