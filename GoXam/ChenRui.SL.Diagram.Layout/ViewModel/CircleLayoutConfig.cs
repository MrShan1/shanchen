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
using Northwoods.GoXam.Layout;
using ChenRui.SL.Configuration;

namespace ChenRui.SL.Diagram.Layout.ViewModel
{
    public class CircleLayoutConfig : LayoutConfig
    {
        /// <summary>
        /// 组内边距
        /// </summary>
        public double GroupPadding
        {
            get
            {
                return groupPadding;
            }
            set
            {
                if (groupPadding != value)
                {
                    groupPadding = value;
                    OnPropertyChanged(() => GroupPadding);
                }
            }
        }
        private double groupPadding;

        /// <summary>
        /// 弧间距比例
        /// </summary>
        public double ArcSpacingRatio
        {
            get
            {
                return arcSpacingRatio;
            }
            set
            {
                if (arcSpacingRatio != value)
                {
                    arcSpacingRatio = value;
                    OnPropertyChanged(() => ArcSpacingRatio);
                }
            }
        }
        private double arcSpacingRatio;

        /// <summary>
        /// 是否固定半径
        /// </summary>
        public bool FixRadius
        {
            get
            {
                return fixRadius;
            }
            set
            {
                if (fixRadius != value)
                {
                    fixRadius = value;
                    OnPropertyChanged(() => FixRadius);
                }
            }
        }
        private bool fixRadius;

        /// <summary>
        /// 半径
        /// </summary>
        public double Radius
        {
            get
            {
                return radius;
            }
            set
            {
                if (radius != value)
                {
                    radius = value;
                    OnPropertyChanged(() => Radius);
                }
            }
        }
        private double radius;

        /// <summary>
        /// 偏率
        /// </summary>
        public double AspectRatio
        {
            get
            {
                return aspectRatio;
            }
            set
            {
                if (aspectRatio != value)
                {
                    aspectRatio = value;
                    OnPropertyChanged(() => AspectRatio);
                }
            }
        }
        private double aspectRatio;

        /// <summary>
        /// 起始角度
        /// </summary>
        public double StartAngle
        {
            get
            {
                return startAngle;
            }
            set
            {
                if (startAngle != value)
                {
                    startAngle = value;
                    OnPropertyChanged(() => StartAngle);
                }
            }
        }
        private double startAngle;

        /// <summary>
        /// 是否顺时针
        /// </summary>
        public bool IsClockwise
        {
            get
            {
                return isClockwise;
            }
            set
            {
                if (isClockwise != value)
                {
                    isClockwise = value;
                    OnPropertyChanged(() => IsClockwise);
                }
            }
        }
        private bool isClockwise;

        /// <summary>
        /// 中心点距离比例
        /// </summary>
        public double CenterNodeDistanceRatio
        {
            get
            {
                return centerNodeDistanceRatio;
            }
            set
            {
                if (centerNodeDistanceRatio != value)
                {
                    centerNodeDistanceRatio = value;
                    OnPropertyChanged(() => CenterNodeDistanceRatio);
                }
            }
        }
        private double centerNodeDistanceRatio;

        /// <summary>
        /// 构造函数
        /// </summary>
        public CircleLayoutConfig()
        {
            GroupPadding = ConfigContext.Current.GetDouble(ConfigKeyInfo.CIRCLE_GROUP_PADDING_KEY);
            FixRadius = ConfigContext.Current.GetBool(ConfigKeyInfo.CIRCLE_FIX_RADIUS_KEY);
            ArcSpacingRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.CIRCLE_ARC_SPACING_RATIO_KEY);
            Radius = ConfigContext.Current.GetDouble(ConfigKeyInfo.CIRCLE_RADIUS_KEY);
            AspectRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.CIRCLE_ASPECT_RATIO_KEY);
            StartAngle = ConfigContext.Current.GetDouble(ConfigKeyInfo.CIRCLE_START_ANGLE_KEY);
            IsClockwise = ConfigContext.Current.GetBool(ConfigKeyInfo.CIRCLE_IS_CLOCKWISE_KEY);
            CenterNodeDistanceRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.CIRCLE_CENTER_NODE_DISTANCE_RATIO_KEY);
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="layout">布局</param>
        public override void SetConfig(IDiagramLayout layout)
        {
            dynamic circleLayout = layout;
            circleLayout.GroupPadding = new Size(GroupPadding, GroupPadding);
            circleLayout.ArcSpacingRatio = ArcSpacingRatio;
            circleLayout.Radius = FixRadius ? Radius : double.NaN;
            circleLayout.AspectRatio = AspectRatio;
            circleLayout.StartAngle = StartAngle;
            circleLayout.IsClockwise = IsClockwise;
            circleLayout.CenterNodeDistanceRatio = CenterNodeDistanceRatio;
        }

        /// <summary>
        /// 设置默认配置
        /// </summary>
        public override void SetDefaultConfig()
        {
            ConfigContext.Current.SetDouble(ConfigKeyInfo.CIRCLE_GROUP_PADDING_KEY, GroupPadding);
            ConfigContext.Current.SetBool(ConfigKeyInfo.CIRCLE_FIX_RADIUS_KEY, FixRadius);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.CIRCLE_ARC_SPACING_RATIO_KEY, ArcSpacingRatio);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.CIRCLE_RADIUS_KEY, Radius);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.CIRCLE_ASPECT_RATIO_KEY, AspectRatio);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.CIRCLE_START_ANGLE_KEY, StartAngle);
            ConfigContext.Current.SetBool(ConfigKeyInfo.CIRCLE_IS_CLOCKWISE_KEY, IsClockwise);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.CIRCLE_CENTER_NODE_DISTANCE_RATIO_KEY, CenterNodeDistanceRatio);
        }

    }
}