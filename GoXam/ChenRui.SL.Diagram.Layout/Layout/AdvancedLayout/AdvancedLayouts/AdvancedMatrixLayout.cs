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
    /// 高级矩阵布局
    /// </summary>
    public class AdvancedMatrixLayout : AdvancedLayout
    {
        /// <summary>
        /// 标识ColumnCount依赖属性
        /// </summary>
        public static readonly DependencyProperty ColumnCountProperty = DependencyProperty.Register("ColumnCount", typeof(int), typeof(AdvancedMatrixLayout), new PropertyMetadata(0, OnPropertyChanged));

        /// <summary>
        /// 列数
        /// </summary>
        public int ColumnCount
        {
            get { return (int)GetValue(ColumnCountProperty); }
            set { SetValue(ColumnCountProperty, value); }
        }

        /// <summary>
        /// 标识RowCount依赖属性
        /// </summary>
        public static readonly DependencyProperty RowCountProperty = DependencyProperty.Register("RowCount", typeof(int), typeof(AdvancedMatrixLayout), new PropertyMetadata(0, OnPropertyChanged));

        /// <summary>
        /// 行数
        /// </summary>
        public int RowCount
        {
            get { return (int)GetValue(RowCountProperty); }
            set { SetValue(RowCountProperty, value); }
        }

        /// <summary>
        /// 标识CenterNodePlacement依赖属性
        /// </summary>
        public static readonly DependencyProperty CenterNodePlacementProperty = DependencyProperty.Register("CenterNodePlacement", typeof(EnumCenterNodePlacement), typeof(AdvancedMatrixLayout), new PropertyMetadata(EnumCenterNodePlacement.Left, OnPropertyChanged));

        /// <summary>
        /// 中心点位置
        /// </summary>
        public EnumCenterNodePlacement CenterNodePlacement
        {
            get { return (EnumCenterNodePlacement)GetValue(CenterNodePlacementProperty); }
            set { SetValue(CenterNodePlacementProperty, value); }
        }

        /// <summary>
        /// 标识CenterNodeDistance依赖属性
        /// </summary>
        public static readonly DependencyProperty CenterNodeDistanceProperty = DependencyProperty.Register("CenterNodeDistance", typeof(double), typeof(AdvancedMatrixLayout), new PropertyMetadata(50.0, OnPropertyChanged));

        /// <summary>
        /// 中心点距离
        /// </summary>
        public double CenterNodeDistance
        {
            get { return (double)GetValue(CenterNodeDistanceProperty); }
            set { SetValue(CenterNodeDistanceProperty, value); }
        }

        /// <summary>
        /// 构造函数
        /// </summary>
        public AdvancedMatrixLayout()
        {
            Spacing = new Size(30, 30);
        }

    }
}
