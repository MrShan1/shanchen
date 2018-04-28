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
    /// 螺旋布局配置
    /// </summary>
    public class HelixLayoutConfig : LayoutConfig
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
        /// 开始角度
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
        /// 角度增速
        /// </summary>
        public int AngelSpeed
        {
            get
            {
                return angelSpeed;
            }
            set
            {
                if (angelSpeed != value)
                {
                    angelSpeed = value;
                    OnPropertyChanged(() => AngelSpeed);
                }
            }
        }
        private int angelSpeed;

        /// <summary>
        /// 初始半径增速
        /// </summary>
        public double RadiusInit
        {
            get
            {
                return radiusInit;
            }
            set
            {
                if (radiusInit != value)
                {
                    radiusInit = value;
                    OnPropertyChanged(() => RadiusInit);
                }
            }
        }
        private double radiusInit;

        /// <summary>
        /// 半径增速指数
        /// </summary>
        public double RadiusPow
        {
            get
            {
                return radiusPow;
            }
            set
            {
                if (radiusPow != value)
                {
                    radiusPow = value;
                    OnPropertyChanged(() => RadiusPow);
                }
            }
        }
        private double radiusPow;

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
        /// 构造函数
        /// </summary>
        public HelixLayoutConfig()
        {
            GroupPadding = ConfigContext.Current.GetDouble(ConfigKeyInfo.HELIX_GROUP_PADDING_KEY);
            ArcSpacingRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.HELIX_ARC_SPACING_RATIO_KEY);
            FirstCircleNodeCount = ConfigContext.Current.GetInt(ConfigKeyInfo.HELIX_FIRST_CIRCLE_NODE_COUNT_KEY);
            StartAngle = ConfigContext.Current.GetDouble(ConfigKeyInfo.HELIX_START_ANGLE_KEY);
            AngelSpeed = ConfigContext.Current.GetInt(ConfigKeyInfo.HELIX_ANGLE_SPEED_KEY);
            RadiusInit = ConfigContext.Current.GetDouble(ConfigKeyInfo.HELIX_RADIUS_INIT_KEY);
            RadiusPow = ConfigContext.Current.GetDouble(ConfigKeyInfo.HELIX_RADIUS_POW_KEY);
            IsClockwise = ConfigContext.Current.GetBool(ConfigKeyInfo.HELIX_IS_CLOCKWISE_KEY);
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="layout">布局</param>
        public override void SetConfig(IDiagramLayout layout)
        {
            dynamic helixLayout = layout;
            helixLayout.GroupPadding = new Size(GroupPadding, GroupPadding);
            helixLayout.ArcSpacingRatio = ArcSpacingRatio;
            helixLayout.FirstCircleNodeCount = FirstCircleNodeCount;
            helixLayout.StartAngle = StartAngle;
            helixLayout.AngelSpeed = AngelSpeed;
            helixLayout.RadiusInit = RadiusInit;
            helixLayout.RadiusPow = RadiusPow;
            helixLayout.IsClockwise = IsClockwise;
        }

        /// <summary>
        /// 设置默认配置
        /// </summary>
        public override void SetDefaultConfig()
        {
            ConfigContext.Current.SetDouble(ConfigKeyInfo.HELIX_GROUP_PADDING_KEY, GroupPadding);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.HELIX_ARC_SPACING_RATIO_KEY, ArcSpacingRatio);
            ConfigContext.Current.SetInt(ConfigKeyInfo.HELIX_FIRST_CIRCLE_NODE_COUNT_KEY, FirstCircleNodeCount);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.HELIX_START_ANGLE_KEY, StartAngle);
            ConfigContext.Current.SetInt(ConfigKeyInfo.HELIX_ANGLE_SPEED_KEY, AngelSpeed);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.HELIX_RADIUS_INIT_KEY, RadiusInit);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.HELIX_RADIUS_POW_KEY, RadiusPow);
            ConfigContext.Current.SetBool(ConfigKeyInfo.HELIX_IS_CLOCKWISE_KEY, IsClockwise);
        }

    }
}