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

namespace ChenRui.SL.Diagram.Layout.View
{
    /// <summary>
    /// 高级布局配置
    /// </summary>
    public partial class AdvancedLayoutConfig : LayoutConfig
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public AdvancedLayoutConfig()
        {
            InitializeComponent();
        }

        private void RadNumericUpDown_LostFocus(object sender, System.Windows.RoutedEventArgs e)
        {
            SetConfig();
        }

        private void RadSlider_DragCompleted(object sender, Telerik.Windows.Controls.RadDragCompletedEventArgs e)
        {
            SetConfig();
        }

    }
}
