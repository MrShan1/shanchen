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
    /// 垂直布局配置
    /// </summary>
    public partial class VerticalLayoutConfig : LayoutConfig
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public VerticalLayoutConfig()
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

        private void RadComboBox_SelectionChanged(object sender, Telerik.Windows.Controls.SelectionChangedEventArgs e)
        {
            SetConfig();
        }

        private void CheckBox_Click(object sender, System.Windows.RoutedEventArgs e)
        {
            SetConfig();
        }

    }
}
