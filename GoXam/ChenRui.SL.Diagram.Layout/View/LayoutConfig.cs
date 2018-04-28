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

using System;
using System.Windows.Controls;

namespace ChenRui.SL.Diagram.Layout.View
{
    /// <summary>
    /// 布局配置View
    /// </summary>
    public partial class LayoutConfig : UserControl
    {
        /// <summary>
        /// ViewModel
        /// </summary>
        public ViewModel.LayoutConfig ViewModel { get; private set; }

        /// <summary>
        /// 组
        /// </summary>
        public Northwoods.GoXam.Group Group { get; set; }

        /// <summary>
        /// 设置ViewModel
        /// </summary>
        /// <param name="viewModel">viewModel</param>
        public void SetViewModel(ViewModel.LayoutConfig viewModel)
        {
            ViewModel = viewModel;
            DataContext = viewModel;
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        public void SetConfig()
        {
            if (Group == null || ViewModel == null) return;
            string strKey = "go" + Guid.NewGuid();
            Group.Diagram.StartTransaction(strKey);
            try
            {
                ViewModel.SetConfig(Group.Layout);
            }
            catch (Exception)
            {

            }
            Group.Diagram.CommitTransaction(strKey);
        }

    }
}
