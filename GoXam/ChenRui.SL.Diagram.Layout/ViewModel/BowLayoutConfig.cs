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

using System.Collections.Generic;
using System.Windows;
using Northwoods.GoXam.Layout;
using ChenRui.SL.Configuration;

namespace ChenRui.SL.Diagram.Layout.ViewModel
{
    /// <summary>
    /// 弓形布局配置
    /// </summary>
    public class BowLayoutConfig : LayoutConfig
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
        /// 水平间距
        /// </summary>
        public double HorizontalSpacing
        {
            get
            {
                return horizontalSpacing;
            }
            set
            {
                if (horizontalSpacing != value)
                {
                    horizontalSpacing = value;
                    OnPropertyChanged(() => HorizontalSpacing);
                }
            }
        }
        private double horizontalSpacing;

        /// <summary>
        /// 垂直间距
        /// </summary>
        public double VerticalSpacing
        {
            get
            {
                return verticalSpacing;
            }
            set
            {
                if (verticalSpacing != value)
                {
                    verticalSpacing = value;
                    OnPropertyChanged(() => VerticalSpacing);
                }
            }
        }
        private double verticalSpacing;

        /// <summary>
        /// 固定列数
        /// </summary>
        public bool FixColumnCount
        {
            get
            {
                return fixColumnCount;
            }
            set
            {
                if (fixColumnCount != value)
                {
                    fixColumnCount = value;
                    OnPropertyChanged(() => FixColumnCount);
                }
            }
        }
        private bool fixColumnCount;

        /// <summary>
        /// 列数
        /// </summary>
        public int ColumnCount
        {
            get
            {
                return columnCount;
            }
            set
            {
                if (columnCount != value)
                {
                    columnCount = value;
                    OnPropertyChanged(() => ColumnCount);
                }
            }
        }
        private int columnCount;

        /// <summary>
        /// 固定行数
        /// </summary>
        public bool FixRowCount
        {
            get
            {
                return fixRowCount;
            }
            set
            {
                if (fixRowCount != value)
                {
                    fixRowCount = value;
                    OnPropertyChanged(() => FixRowCount);
                }
            }
        }
        private bool fixRowCount;

        /// <summary>
        /// 行数
        /// </summary>
        public int RowCount
        {
            get
            {
                return rowCount;
            }
            set
            {
                if (rowCount != value)
                {
                    rowCount = value;
                    OnPropertyChanged(() => RowCount);
                }
            }
        }
        private int rowCount;

        /// <summary>
        /// 中心点位置
        /// </summary>
        public EnumCenterNodePlacement CenterNodePlacement
        {
            get
            {
                return centerNodePlacement;
            }
            set
            {
                if (centerNodePlacement != value)
                {
                    centerNodePlacement = value;
                    OnPropertyChanged(() => CenterNodePlacement);
                }
            }
        }
        private EnumCenterNodePlacement centerNodePlacement;

        /// <summary>
        /// 中心点位置集合
        /// </summary>
        public Dictionary<EnumCenterNodePlacement, string> CenterNodePlacements { get; set; }

        /// <summary>
        /// 中心点距离
        /// </summary>
        public double CenterNodeDistance
        {
            get
            {
                return centerNodeDistance;
            }
            set
            {
                if (centerNodeDistance != value)
                {
                    centerNodeDistance = value;
                    OnPropertyChanged(() => CenterNodeDistance);
                }
            }
        }
        private double centerNodeDistance;

        /// <summary>
        /// 构造函数
        /// </summary>
        public BowLayoutConfig()
        {
            GroupPadding = ConfigContext.Current.GetDouble(ConfigKeyInfo.BOW_GROUP_PADDING_KEY);
            HorizontalSpacing = ConfigContext.Current.GetDouble(ConfigKeyInfo.BOW_HORIZONTAL_SPACING_KEY);
            VerticalSpacing = ConfigContext.Current.GetDouble(ConfigKeyInfo.BOW_VERTICAL_SPACING_KEY);
            FixColumnCount = ConfigContext.Current.GetBool(ConfigKeyInfo.BOW_FIX_COLUMN_COUNT_KEY);
            ColumnCount = ConfigContext.Current.GetInt(ConfigKeyInfo.BOW_COLUMN_COUNT_KEY);
            FixRowCount = ConfigContext.Current.GetBool(ConfigKeyInfo.BOW_FIX_ROW_COUNT_KEY);
            RowCount = ConfigContext.Current.GetInt(ConfigKeyInfo.BOW_ROW_COUNT_KEY);
            CenterNodePlacement = ConfigContext.Current.GetEnum<EnumCenterNodePlacement>(ConfigKeyInfo.BOW_CENTER_NODE_PLACEMENT_KEY);
            CenterNodePlacements = new Dictionary<EnumCenterNodePlacement, string>();
            CenterNodePlacements.Add(EnumCenterNodePlacement.Left, Resource.Left);
            CenterNodePlacements.Add(EnumCenterNodePlacement.Top, Resource.Top);
            CenterNodeDistance = ConfigContext.Current.GetDouble(ConfigKeyInfo.BOW_CENTER_NODE_DISTANCE_KEY);
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="layout">布局</param>
        public override void SetConfig(IDiagramLayout layout)
        {
            dynamic bowLayout = layout;
            bowLayout.GroupPadding = new Size(GroupPadding, GroupPadding);
            bowLayout.Spacing = new Size(HorizontalSpacing, VerticalSpacing);
            bowLayout.ColumnCount = FixColumnCount ? ColumnCount : 0;
            bowLayout.RowCount = FixRowCount ? RowCount : 0;
            bowLayout.CenterNodePlacement = CenterNodePlacement;
            bowLayout.CenterNodeDistance = CenterNodeDistance;
        }

        /// <summary>
        /// 设置默认配置
        /// </summary>
        public override void SetDefaultConfig()
        {
            ConfigContext.Current.SetDouble(ConfigKeyInfo.BOW_GROUP_PADDING_KEY, GroupPadding);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.BOW_HORIZONTAL_SPACING_KEY, HorizontalSpacing);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.BOW_VERTICAL_SPACING_KEY, VerticalSpacing);
            ConfigContext.Current.SetBool(ConfigKeyInfo.BOW_COLUMN_COUNT_KEY, FixColumnCount);
            ConfigContext.Current.SetInt(ConfigKeyInfo.BOW_COLUMN_COUNT_KEY, ColumnCount);
            ConfigContext.Current.SetBool(ConfigKeyInfo.BOW_FIX_ROW_COUNT_KEY, FixRowCount);
            ConfigContext.Current.SetInt(ConfigKeyInfo.BOW_ROW_COUNT_KEY, RowCount);
            ConfigContext.Current.SetEnum(ConfigKeyInfo.BOW_CENTER_NODE_PLACEMENT_KEY, CenterNodePlacement);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.BOW_CENTER_NODE_DISTANCE_KEY, CenterNodeDistance);
        }

    }
}