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

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 高级垂直布局
    /// </summary>
    public class AdvancedVerticalLayout : AdvancedLayout
    {
        /// <summary>
        /// 标识IsCenterNodeLeft依赖属性
        /// </summary>
        public static readonly DependencyProperty IsCenterNodeLeftProperty = DependencyProperty.Register("IsCenterNodeLeft", typeof(bool), typeof(AdvancedVerticalLayout), new PropertyMetadata(true, OnPropertyChanged));

        /// <summary>
        /// 中心点是否在左边
        /// </summary>
        public bool IsCenterNodeLeft
        {
            get { return (bool)GetValue(IsCenterNodeLeftProperty); }
            set { SetValue(IsCenterNodeLeftProperty, value); }
        }

        /// <summary>
        /// 构造函数
        /// </summary>
        public AdvancedVerticalLayout()
        {
            Spacing = new Size(50, 10);
        }

    }
}
