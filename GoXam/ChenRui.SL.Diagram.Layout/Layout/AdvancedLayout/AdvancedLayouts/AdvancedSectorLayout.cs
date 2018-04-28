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

using System.Windows;

namespace ChenRui.SL.Diagram.Layout
{
    public class AdvancedSectorLayout : AdvancedLayout
    {
        /// <summary>
        /// 标识ArcSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty ArcSpacingRatioProperty = DependencyProperty.Register("ArcSpacingRatio", typeof(double), typeof(AdvancedSectorLayout), new PropertyMetadata(0.0, OnPropertyChanged));

        /// <summary>
        /// 弧间距比例
        /// </summary>
        public double ArcSpacingRatio
        {
            get { return (double)GetValue(ArcSpacingRatioProperty); }
            set { SetValue(ArcSpacingRatioProperty, value); }
        }

        /// <summary>
        /// 标识FirstCircleRadiusRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty FirstCircleRadiusRatioProperty = DependencyProperty.Register("FirstCircleRadiusRatio", typeof(double), typeof(AdvancedSectorLayout), new PropertyMetadata(10.0, OnPropertyChanged));

        /// <summary>
        /// 首圈半径比例
        /// </summary>
        public double FirstCircleRadiusRatio
        {
            get { return (double)GetValue(FirstCircleRadiusRatioProperty); }
            set { SetValue(FirstCircleRadiusRatioProperty, value); }
        }

        /// <summary>
        /// 标识CircleSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty CircleSpacingRatioProperty = DependencyProperty.Register("CircleSpacingRatio", typeof(double), typeof(AdvancedSectorLayout), new PropertyMetadata(1.0, OnPropertyChanged));

        /// <summary>
        /// 圈间距比例
        /// </summary>
        public double CircleSpacingRatio
        {
            get { return (double)GetValue(CircleSpacingRatioProperty); }
            set { SetValue(CircleSpacingRatioProperty, value); }
        }

        private bool hasAngle;

        /// <summary>
        /// 标识Angle依赖属性
        /// </summary>
        public static readonly DependencyProperty AngleProperty = DependencyProperty.Register("Angle", typeof(double), typeof(AdvancedSectorLayout), new PropertyMetadata(0.0, OnPropertyChanged));

        /// <summary>
        /// 角度
        /// </summary>
        public double Angle
        {
            get { return (double)GetValue(AngleProperty); }
            set { SetValue(AngleProperty, value); }
        }

        /// <summary>
        /// 标识AngleRange依赖属性
        /// </summary>
        public static readonly DependencyProperty AngleRangeProperty = DependencyProperty.Register("AngleRange", typeof(double), typeof(AdvancedSectorLayout), new PropertyMetadata(90.0, OnPropertyChanged));

        /// <summary>
        /// 角度范围
        /// </summary>
        public double AngleRange
        {
            get { return (double)GetValue(AngleRangeProperty); }
            set { SetValue(AngleRangeProperty, value); }
        }

        /// <summary>
        /// 标记IsClockwise依赖属性
        /// </summary>
        public static readonly DependencyProperty IsClockwiseProperty = DependencyProperty.Register("IsClockwise", typeof(bool), typeof(AdvancedSectorLayout), new PropertyMetadata(true, OnPropertyChanged));

        /// <summary>
        /// 是否是顺时针
        /// </summary>
        public bool IsClockwise
        {
            get { return (bool)GetValue(IsClockwiseProperty); }
            set { SetValue(IsClockwiseProperty, value); }
        }

        /// <summary>
        /// 标识IsContinuous依赖属性
        /// </summary>
        public static readonly DependencyProperty IsContinuousProperty = DependencyProperty.Register("IsContinuous", typeof(bool), typeof(AdvancedSectorLayout), new PropertyMetadata(true, OnPropertyChanged));

        /// <summary>
        /// 是否连续
        /// </summary>
        public bool IsContinuous
        {
            get { return (bool)GetValue(IsContinuousProperty); }
            set { SetValue(IsContinuousProperty, value); }
        }

        /// <summary>
        /// 标识CenterNodeDistanceRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty CenterNodeDistanceRatioProperty = DependencyProperty.Register("CenterNodeDistanceRatio", typeof(double), typeof(AdvancedSectorLayout), new PropertyMetadata(0.3, OnPropertyChanged));

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
