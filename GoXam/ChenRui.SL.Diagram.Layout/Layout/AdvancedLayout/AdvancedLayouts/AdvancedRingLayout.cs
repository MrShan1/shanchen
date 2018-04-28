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
    /// 高级环形布局
    /// </summary>
    public class AdvancedRingLayout : AdvancedLayout
    {
        /// <summary>
        /// 标识ArcSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty ArcSpacingRatioProperty = DependencyProperty.Register("ArcSpacingRatio", typeof(double), typeof(AdvancedRingLayout), new PropertyMetadata(0.0, OnPropertyChanged));

        /// <summary>
        /// 弧间距比例
        /// </summary>
        public double ArcSpacingRatio
        {
            get { return (double)GetValue(ArcSpacingRatioProperty); }
            set { SetValue(ArcSpacingRatioProperty, value); }
        }

        /// <summary>
        /// 标识FirstCircleNodeCount依赖属性
        /// </summary>
        public static readonly DependencyProperty FirstCircleNodeCountProperty = DependencyProperty.Register("FirstCircleNodeCount", typeof(int), typeof(AdvancedRingLayout), new PropertyMetadata(8, OnPropertyChanged));

        /// <summary>
        /// 首圈节点数
        /// </summary>
        public int FirstCircleNodeCount
        {
            get { return (int)GetValue(FirstCircleNodeCountProperty); }
            set { SetValue(FirstCircleNodeCountProperty, value); }
        }

        /// <summary>
        /// 标识FirstCircleRadius依赖属性
        /// </summary>
        public static readonly DependencyProperty FirstCircleRadiusProperty = DependencyProperty.Register("FirstCircleRadius", typeof(double), typeof(AdvancedRingLayout), new PropertyMetadata(Double.NaN, OnPropertyChanged));  // may be NaN

        /// <summary>
        /// 首圈半径
        /// </summary>
        public double FirstCircleRadius
        {
            get { return (double)GetValue(FirstCircleRadiusProperty); }
            set { SetValue(FirstCircleRadiusProperty, value); }
        }

        /// <summary>
        /// 标记CircleSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty CircleSpacingRatioProperty = DependencyProperty.Register("CircleSpacingRatio", typeof(double), typeof(AdvancedRingLayout), new PropertyMetadata(1.0, OnPropertyChanged));

        /// <summary>
        /// 圈间距比例
        /// </summary>
        public double CircleSpacingRatio
        {
            get { return (double)GetValue(CircleSpacingRatioProperty); }
            set { SetValue(CircleSpacingRatioProperty, value); }
        }

        /// <summary>
        /// 标识StartAngle依赖属性
        /// </summary>
        public static readonly DependencyProperty StartAngleProperty = DependencyProperty.Register("StartAngle", typeof(double), typeof(AdvancedRingLayout), new PropertyMetadata(-90.0, OnPropertyChanged));

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
        public static readonly DependencyProperty IsClockwiseProperty = DependencyProperty.Register("IsClockwise", typeof(bool), typeof(AdvancedRingLayout), new PropertyMetadata(true, OnPropertyChanged));

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
        public static readonly DependencyProperty CenterNodeDistanceRatioProperty = DependencyProperty.Register("CenterNodeDistanceRatio", typeof(double), typeof(AdvancedRingLayout), new PropertyMetadata(0.3, OnPropertyChanged));

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
