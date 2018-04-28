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
    /// <summary>
    /// 环形布局配置
    /// </summary>
    public class RingLayoutConfig : LayoutConfig
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
        /// 首圈节点数
        /// </summary>
        public int FirstCircleNodeCount
        {
            get
            {
                return firstCircleNodeCount;
            }
            set
            {
                if (firstCircleNodeCount != value)
                {
                    firstCircleNodeCount = value;
                    OnPropertyChanged(() => FirstCircleNodeCount);
                }
            }
        }
        private int firstCircleNodeCount;

        /// <summary>
        /// 是否首圈固定半径
        /// </summary>
        public bool FirstCircleFixRadius
        {
            get
            {
                return firstCircleFixRadius;
            }
            set
            {
                if (firstCircleFixRadius != value)
                {
                    firstCircleFixRadius = value;
                    OnPropertyChanged(() => FirstCircleFixRadius);
                }
            }
        }
        private bool firstCircleFixRadius;

        /// <summary>
        /// 首圈半径
        /// </summary>
        public double FirstCircleRadius
        {
            get
            {
                return firstCircleRadius;
            }
            set
            {
                if (firstCircleRadius != value)
                {
                    firstCircleRadius = value;
                    OnPropertyChanged(() => FirstCircleRadius);
                }
            }
        }
        private double firstCircleRadius;

        /// <summary>
        /// 圈间距比例
        /// </summary>
        public double CircleSpacingRatio
        {
            get
            {
                return circleSpacingRatio;
            }
            set
            {
                if (circleSpacingRatio != value)
                {
                    circleSpacingRatio = value;
                    OnPropertyChanged(() => CircleSpacingRatio);
                }
            }
        }
        private double circleSpacingRatio;

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
        public RingLayoutConfig()
        {
            GroupPadding = ConfigContext.Current.GetDouble(ConfigKeyInfo.RING_GROUP_PADDING_KEY);
            ArcSpacingRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.RING_ARC_SPACING_RATIO_KEY);
            FirstCircleNodeCount = ConfigContext.Current.GetInt(ConfigKeyInfo.RING_FIRST_CIRCLE_NODE_COUNT_KEY);
            FirstCircleFixRadius = ConfigContext.Current.GetBool(ConfigKeyInfo.RING_FIRST_CIRCLE_FIX_RADIUS_KEY);
            FirstCircleRadius = ConfigContext.Current.GetDouble(ConfigKeyInfo.RING_FIRST_CIRCLE_RADIUS_KEY);
            CircleSpacingRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.RING_CIRCLE_SPACING_RATIO_KEY);
            StartAngle = ConfigContext.Current.GetDouble(ConfigKeyInfo.RING_START_ANGLE_KEY);
            IsClockwise = ConfigContext.Current.GetBool(ConfigKeyInfo.RING_IS_CLOCKWISE_KEY);
            CenterNodeDistanceRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.RING_CENTER_NODE_DISTANCE_RATIO_KEY);
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="layout">布局</param>
        public override void SetConfig(IDiagramLayout layout)
        {
            dynamic ringLayout = layout;
            ringLayout.GroupPadding = new Size(GroupPadding, GroupPadding);
            ringLayout.ArcSpacingRatio = ArcSpacingRatio;
            ringLayout.FirstCircleNodeCount = FirstCircleNodeCount;
            ringLayout.FirstCircleRadius = FirstCircleFixRadius ? FirstCircleRadius : double.NaN;
            ringLayout.CircleSpacingRatio = CircleSpacingRatio;
            ringLayout.StartAngle = StartAngle;
            ringLayout.IsClockwise = IsClockwise;
            ringLayout.CenterNodeDistanceRatio = CenterNodeDistanceRatio;
        }

        /// <summary>
        /// 设置默认配置
        /// </summary>
        public override void SetDefaultConfig()
        {
            ConfigContext.Current.SetDouble(ConfigKeyInfo.RING_GROUP_PADDING_KEY, GroupPadding);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.RING_ARC_SPACING_RATIO_KEY, ArcSpacingRatio);
            ConfigContext.Current.SetInt(ConfigKeyInfo.RING_FIRST_CIRCLE_NODE_COUNT_KEY, FirstCircleNodeCount);
            ConfigContext.Current.SetBool(ConfigKeyInfo.RING_FIRST_CIRCLE_FIX_RADIUS_KEY, FirstCircleFixRadius);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.RING_FIRST_CIRCLE_RADIUS_KEY, FirstCircleRadius);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.RING_CIRCLE_SPACING_RATIO_KEY, CircleSpacingRatio);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.RING_START_ANGLE_KEY, StartAngle);
            ConfigContext.Current.SetBool(ConfigKeyInfo.RING_IS_CLOCKWISE_KEY, IsClockwise);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.RING_CENTER_NODE_DISTANCE_RATIO_KEY, CenterNodeDistanceRatio);
        }

    }
}