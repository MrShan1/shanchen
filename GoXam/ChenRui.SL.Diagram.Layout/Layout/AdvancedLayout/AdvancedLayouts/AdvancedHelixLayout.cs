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
    public class AdvancedHelixLayout : AdvancedLayout
    {
        /// <summary>
        /// 标识ArcSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty ArcSpacingRatioProperty = DependencyProperty.Register("ArcSpacingRatio", typeof(double), typeof(AdvancedHelixLayout), new PropertyMetadata(0.0, OnPropertyChanged));

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
        public static readonly DependencyProperty FirstCircleNodeCountProperty = DependencyProperty.Register("FirstCircleNodeCount", typeof(int), typeof(AdvancedHelixLayout), new PropertyMetadata(8, OnPropertyChanged));

        /// <summary>
        /// 首圈节点数
        /// </summary>
        public int FirstCircleNodeCount
        {
            get { return (int)GetValue(FirstCircleNodeCountProperty); }
            set { SetValue(FirstCircleNodeCountProperty, value); }
        }

        /// <summary>
        /// 标识StartAngle依赖属性
        /// </summary>
        public static readonly DependencyProperty StartAngleProperty = DependencyProperty.Register("StartAngle", typeof(double), typeof(AdvancedHelixLayout), new PropertyMetadata(-90.0, OnPropertyChanged));

        /// <summary>
        /// 起始角度
        /// </summary>
        public double StartAngle
        {
            get { return (double)GetValue(StartAngleProperty); }
            set { SetValue(StartAngleProperty, value); }
        }

        /// <summary>
        /// 标识AngelSpeed依赖属性
        /// </summary>
        public static readonly DependencyProperty AngelSpeedProperty = DependencyProperty.Register("AngelSpeed", typeof(int), typeof(AdvancedHelixLayout), new PropertyMetadata(2, OnPropertyChanged));

        /// <summary>
        /// 角度增速 min : 1    max:5
        /// </summary>
        public int AngelSpeed
        {
            get { return (int)GetValue(AngelSpeedProperty); }
            set { SetValue(AngelSpeedProperty, value); }
        }

        /// <summary>
        /// 标识RadiusInit依赖属性
        /// </summary>
        public static readonly DependencyProperty RadiusInitProperty = DependencyProperty.Register("RadiusInit", typeof(double), typeof(AdvancedHelixLayout), new PropertyMetadata(70.0, OnPropertyChanged));

        /// <summary>
        /// 初始半径增速 min:65    max: 120
        /// </summary>
        public double RadiusInit
        {
            get { return (double)GetValue(RadiusInitProperty); }
            set { SetValue(RadiusInitProperty, value); }
        }

        /// <summary>
        /// 标识RadiusPow依赖属性
        /// </summary>
        public static readonly DependencyProperty RadiusPowProperty = DependencyProperty.Register("RadiusPow", typeof(double), typeof(AdvancedHelixLayout), new PropertyMetadata(0.6, OnPropertyChanged));

        /// <summary>
        /// 半径增速指数 min: 0.4   max: 1.2
        /// </summary>
        public double RadiusPow
        {
            get { return (double)GetValue(RadiusPowProperty); }
            set { SetValue(RadiusPowProperty, value); }
        }

        /// <summary>
        /// 标识IsClockwise依赖属性
        /// </summary>
        public static readonly DependencyProperty IsClockwiseProperty = DependencyProperty.Register("IsClockwise", typeof(bool), typeof(AdvancedHelixLayout), new PropertyMetadata(true, OnPropertyChanged));

        /// <summary>
        /// 是否是顺时针
        /// </summary>
        public bool IsClockwise
        {
            get { return (bool)GetValue(IsClockwiseProperty); }
            set { SetValue(IsClockwiseProperty, value); }
        }

    }
}
