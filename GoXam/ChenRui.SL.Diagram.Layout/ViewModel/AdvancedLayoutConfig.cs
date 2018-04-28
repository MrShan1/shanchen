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
    /// 高级布局配置
    /// </summary>
    public class AdvancedLayoutConfig : LayoutConfig
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
        /// 构造函数
        /// </summary>
        public AdvancedLayoutConfig()
        {
            GroupPadding = ConfigContext.Current.GetDouble(ConfigKeyInfo.VERTICAL_GROUP_PADDING_KEY);
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="layout">布局</param>
        public override void SetConfig(IDiagramLayout layout)
        {
            dynamic advancedLayout = layout;
            advancedLayout.GroupPadding = new Size(GroupPadding, GroupPadding);
        }

        /// <summary>
        /// 设置默认配置
        /// </summary>
        public override void SetDefaultConfig()
        {
            ConfigContext.Current.SetDouble(ConfigKeyInfo.VERTICAL_GROUP_PADDING_KEY, GroupPadding);
        }

    }

}