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
    /// 高级水平布局
    /// </summary>
    public class AdvancedHorizontalLayout : AdvancedLayout
    {
        /// <summary>
        /// 标识IsCenterNodeTop依赖属性
        /// </summary>
        public static readonly DependencyProperty IsCenterNodeTopProperty = DependencyProperty.Register("IsCenterNodeTop", typeof(bool), typeof(AdvancedHorizontalLayout), new PropertyMetadata(true, OnPropertyChanged));

        /// <summary>
        /// 中心点是否在上边
        /// </summary>
        public bool IsCenterNodeTop
        {
            get { return (bool)GetValue(IsCenterNodeTopProperty); }
            set { SetValue(IsCenterNodeTopProperty, value); }
        }

        /// <summary>
        /// 构造函数
        /// </summary>
        public AdvancedHorizontalLayout()
        {
            Spacing = new Size(10, 50);
        }

    }
}
