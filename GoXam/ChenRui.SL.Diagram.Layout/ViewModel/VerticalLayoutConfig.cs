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
    /// 垂直布局配置
    /// </summary>
    public class VerticalLayoutConfig : LayoutConfig
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
        /// 水平间隔
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
        /// 垂直间隔
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
        /// 中心是否在左边
        /// </summary>
        public bool IsCenterNodeLeft
        {
            get
            {
                return isCenterNodeLeft;
            }
            set
            {
                if (isCenterNodeLeft != value)
                {
                    isCenterNodeLeft = value;
                    OnPropertyChanged(() => IsCenterNodeLeft);
                }
            }
        }
        private bool isCenterNodeLeft;

        /// <summary>
        /// 构造函数
        /// </summary>
        public VerticalLayoutConfig()
        {
            GroupPadding = ConfigContext.Current.GetDouble(ConfigKeyInfo.VERTICAL_GROUP_PADDING_KEY);
            HorizontalSpacing = ConfigContext.Current.GetDouble(ConfigKeyInfo.VERTICAL_HORIZONTAL_SPACING_KEY);
            VerticalSpacing = ConfigContext.Current.GetDouble(ConfigKeyInfo.VERTICAL_VERTICAL_SPACING_KEY);
            IsCenterNodeLeft = ConfigContext.Current.GetBool(ConfigKeyInfo.IS_CENTER_NODE_LEFT_KEY);
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="layout">布局</param>
        public override void SetConfig(IDiagramLayout layout)
        {
            dynamic verticalLayout = layout;
            verticalLayout.GroupPadding = new Size(GroupPadding, GroupPadding);
            verticalLayout.Spacing = new Size(HorizontalSpacing, VerticalSpacing);
            verticalLayout.IsCenterNodeLeft = IsCenterNodeLeft;
        }

        /// <summary>
        /// 设置默认配置
        /// </summary>
        public override void SetDefaultConfig()
        {
            ConfigContext.Current.SetDouble(ConfigKeyInfo.VERTICAL_GROUP_PADDING_KEY, GroupPadding);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.VERTICAL_HORIZONTAL_SPACING_KEY, HorizontalSpacing);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.VERTICAL_VERTICAL_SPACING_KEY, VerticalSpacing);
            ConfigContext.Current.SetBool(ConfigKeyInfo.IS_CENTER_NODE_LEFT_KEY, IsCenterNodeLeft);
        }

    }

}