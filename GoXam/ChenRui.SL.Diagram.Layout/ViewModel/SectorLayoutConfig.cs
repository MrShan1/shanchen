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
    /// 扇形布局配置
    /// </summary>
    public class SectorLayoutConfig : LayoutConfig
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
        /// 首圈半径比例
        /// </summary>
        public double FirstCircleRadiusRatio
        {
            get
            {
                return firstCircleRadiusRatio;
            }
            set
            {
                if (firstCircleRadiusRatio != value)
                {
                    firstCircleRadiusRatio = value;
                    OnPropertyChanged(() => FirstCircleRadiusRatio);
                }
            }
        }
        private double firstCircleRadiusRatio;

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
        /// 角度
        /// </summary>
        public double Angle
        {
            get
            {
                return angle;
            }
            set
            {
                if (angle != value)
                {
                    angle = value;
                    OnPropertyChanged(() => Angle);
                }
            }
        }
        private double angle;

        /// <summary>
        /// 角度范围
        /// </summary>
        public double AngleRange
        {
            get
            {
                return angleRange;
            }
            set
            {
                if (angleRange != value)
                {
                    angleRange = value;
                    OnPropertyChanged(() => AngleRange);
                }
            }
        }
        private double angleRange;

        /// <summary>
        /// 是否为顺时针
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
        /// 是否连续
        /// </summary>
        public bool IsContinuous
        {
            get
            {
                return isContinuous;
            }
            set
            {
                if (isContinuous != value)
                {
                    isContinuous = value;
                    OnPropertyChanged(() => IsContinuous);
                }
            }
        }
        private bool isContinuous;

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
        public SectorLayoutConfig()
        {
            GroupPadding = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_GROUP_PADDING_KEY);
            ArcSpacingRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_ARC_SPACING_RATIO_KEY);
            FirstCircleRadiusRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_FIRST_CIRCLE_RADIUS_RATIO_KEY);
            CircleSpacingRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_CIRCLE_SPACING_RATIO_KEY);
            Angle = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_ANGLE_KEY);
            AngleRange = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_ANGLE_RANGE_KEY);
            IsClockwise = ConfigContext.Current.GetBool(ConfigKeyInfo.SECTOR_IS_CLOCKWISE_KEY);
            IsContinuous = ConfigContext.Current.GetBool(ConfigKeyInfo.SECTOR_IS_CONTINUOUS_KEY);
            CenterNodeDistanceRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_CENTER_NODE_DISTANCE_RATIO_KEY);
        }

        /// <summary>
        /// 返回配置
        /// </summary>
        /// <param name="layout">布局</param>
        public override void GetConfig(IDiagramLayout layout)
        {
            dynamic sectorLayout = layout;
            Angle = sectorLayout.Angle;
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="layout">布局</param>
        public override void SetConfig(IDiagramLayout layout)
        {
            dynamic sectorLayout = layout;
            sectorLayout.GroupPadding = new Size(GroupPadding, GroupPadding);
            sectorLayout.ArcSpacingRatio = ArcSpacingRatio;
            sectorLayout.FirstCircleRadiusRatio = FirstCircleRadiusRatio;
            sectorLayout.CircleSpacingRatio = CircleSpacingRatio;
            sectorLayout.Angle = Angle;
            sectorLayout.AngleRange = AngleRange;
            sectorLayout.IsClockwise = IsClockwise;
            sectorLayout.IsContinuous = IsContinuous;
            sectorLayout.CenterNodeDistanceRatio = CenterNodeDistanceRatio;
        }

        /// <summary>
        /// 设置默认配置
        /// </summary>
        public override void SetDefaultConfig()
        {
            ConfigContext.Current.SetDouble(ConfigKeyInfo.SECTOR_GROUP_PADDING_KEY, GroupPadding);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.SECTOR_ARC_SPACING_RATIO_KEY, ArcSpacingRatio);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.SECTOR_FIRST_CIRCLE_RADIUS_RATIO_KEY, FirstCircleRadiusRatio);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.SECTOR_CIRCLE_SPACING_RATIO_KEY, CircleSpacingRatio);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.SECTOR_ANGLE_KEY, Angle);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.SECTOR_ANGLE_RANGE_KEY, AngleRange);
            ConfigContext.Current.SetBool(ConfigKeyInfo.SECTOR_IS_CLOCKWISE_KEY, IsClockwise);
            ConfigContext.Current.SetBool(ConfigKeyInfo.SECTOR_IS_CONTINUOUS_KEY, IsContinuous);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.SECTOR_CENTER_NODE_DISTANCE_RATIO_KEY, CenterNodeDistanceRatio);
        }

    }
}