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
    /// 水平布局配置
    /// </summary>
    public class HorizontalLayoutConfig : LayoutConfig
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
        /// 中心点是否在上边
        /// </summary>
        public bool IsCenterNodeTop
        {
            get
            {
                return isCenterNodeTop;
            }
            set
            {
                if (isCenterNodeTop != value)
                {
                    isCenterNodeTop = value;
                    OnPropertyChanged(() => IsCenterNodeTop);
                }
            }
        }
        private bool isCenterNodeTop;

        /// <summary>
        /// 构造函数
        /// </summary>
        public HorizontalLayoutConfig()
        {
            GroupPadding = ConfigContext.Current.GetDouble(ConfigKeyInfo.HORIZONTAL_GROUP_PADDING_KEY);
            HorizontalSpacing = ConfigContext.Current.GetDouble(ConfigKeyInfo.HORIZONTAL_HORIZONTAL_SPACING_KEY);
            VerticalSpacing = ConfigContext.Current.GetDouble(ConfigKeyInfo.HORIZONTAL_VERTICAL_SPACING_KEY);
            IsCenterNodeTop = ConfigContext.Current.GetBool(ConfigKeyInfo.IS_CENTER_NODE_TOP_KEY);
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="layout">布局</param>
        public override void SetConfig(IDiagramLayout layout)
        {
            dynamic horizontalLayout = layout;
            horizontalLayout.GroupPadding = new Size(GroupPadding, GroupPadding);
            horizontalLayout.Spacing = new Size(HorizontalSpacing, VerticalSpacing);
            horizontalLayout.IsCenterNodeTop = IsCenterNodeTop;
        }

        /// <summary>
        /// 设置默认配置
        /// </summary>
        public override void SetDefaultConfig()
        {
            ConfigContext.Current.SetDouble(ConfigKeyInfo.HORIZONTAL_GROUP_PADDING_KEY, GroupPadding);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.HORIZONTAL_HORIZONTAL_SPACING_KEY, HorizontalSpacing);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.HORIZONTAL_VERTICAL_SPACING_KEY, VerticalSpacing);
            ConfigContext.Current.SetBool(ConfigKeyInfo.IS_CENTER_NODE_TOP_KEY, IsCenterNodeTop);
        }

    }

}