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
using System.Windows;
using System.Collections.Generic;
using System.Linq;
using Northwoods.GoXam;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 矩阵布局
    /// </summary>
    public class MatrixLayout : OldCustomizedLayout, ISpecialNodes
    {
        /// <summary>
        /// 特殊点提供者
        /// </summary>
        public ISpecialNodesProvider SpecialNodesProvider { get; set; }

        /// <summary>
        /// 标识ColumnCount依赖属性
        /// </summary>
        public static readonly DependencyProperty ColumnCountProperty = DependencyProperty.Register("ColumnCount", typeof(int), typeof(MatrixLayout), new PropertyMetadata(0, OnPropertyChanged));

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
        public static readonly DependencyProperty RowCountProperty = DependencyProperty.Register("RowCount", typeof(int), typeof(MatrixLayout), new PropertyMetadata(0, OnPropertyChanged));

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
        public static readonly DependencyProperty CenterNodePlacementProperty = DependencyProperty.Register("CenterNodePlacement", typeof(EnumCenterNodePlacement), typeof(MatrixLayout), new PropertyMetadata(EnumCenterNodePlacement.Left, OnPropertyChanged));

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
        public static readonly DependencyProperty CenterNodeDistanceProperty = DependencyProperty.Register("CenterNodeDistance", typeof(double), typeof(MatrixLayout), new PropertyMetadata(50.0, OnPropertyChanged));

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
        public MatrixLayout()
        {
            Spacing = new Size(30, 30);
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        /// <param name="specialNodes">特殊点集合</param>
        /// <param name="location">位置</param>
        /// <returns>布局结果</returns>
        protected override LayoutResult DoLayout(IEnumerable<Node> nodes, IEnumerable<Link> links, IEnumerable<Node> specialNodes, Point? location)
        {
            if (specialNodes != null)
            {
                var center = specialNodes.FirstOrDefault();
                return center != null ? new LayoutResult(DoLayoutWithCenter(center, nodes.Where(n => n != center), location)) : new LayoutResult(DoLayout(nodes, location));
            }
            return new LayoutResult(DoLayout(nodes, location));
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="location">位置</param>
        /// <returns>大小</returns>
        private Size DoLayout(IEnumerable<Node> nodes, Point? location)
        {
            var count = nodes.Count();
            int columnCount;
            int rowCount;
            if (ColumnCount <= 0 && RowCount <= 0)
            {
                columnCount = (int)Math.Ceiling(Math.Sqrt(count));
                rowCount = (int)Math.Ceiling((double)count / columnCount);
            }
            else if (ColumnCount > 0)
            {
                columnCount = ColumnCount;
                rowCount = (int)Math.Ceiling((double)count / columnCount);
            }
            else
            {
                columnCount = (int)Math.Ceiling((double)count / RowCount);
                rowCount = (int)Math.Ceiling((double)count / columnCount);
            }
            var size = new Size(columnCount * ActualCellSize.Width + (columnCount - 1) * Spacing.Width, rowCount * ActualCellSize.Height + (rowCount - 1) * Spacing.Height);
            var index = 0;
            nodes.ForEach(n =>
            {
                Locate(n, ActualCellSize.Width / 2 + (ActualCellSize.Width + Spacing.Width) * (index % columnCount) - size.Width / 2, ActualCellSize.Height / 2 + (ActualCellSize.Height + Spacing.Height) * (index / columnCount) - size.Height / 2, location);
                index++;
            });
            return size;
        }

        /// <summary>
        /// 有中心点时布局
        /// </summary>
        /// <param name="center">中心</param>
        /// <param name="nodes">节点集合</param>
        /// <param name="location">位置</param>
        /// <returns>大小</returns>
        private Size DoLayoutWithCenter(Node center, IEnumerable<Node> nodes, Point? location)
        {
            var ns = nodes.Where(n => n != center);
            var size = DoLayout(ns, location);
            var x = 0.0;
            var y = 0.0;
            switch (CenterNodePlacement)
            {
                case EnumCenterNodePlacement.Left:
                    Locate(center, ActualCellSize.Width / 2 - (ActualCellSize.Width + CenterNodeDistance + size.Width) / 2, 0, location);
                    x = (ActualCellSize.Width + CenterNodeDistance) / 2;
                    break;
                case EnumCenterNodePlacement.Top:
                    Locate(center, 0, ActualCellSize.Height / 2 - (ActualCellSize.Height + CenterNodeDistance + size.Height) / 2, location);
                    y = (ActualCellSize.Height + CenterNodeDistance) / 2;
                    break;
                case EnumCenterNodePlacement.Right:
                    Locate(center, (ActualCellSize.Width + CenterNodeDistance + size.Width) / 2 - ActualCellSize.Width / 2, 0, location);
                    x = -(ActualCellSize.Width + CenterNodeDistance) / 2;
                    break;
                case EnumCenterNodePlacement.Bottom:
                    Locate(center, 0, (ActualCellSize.Height + CenterNodeDistance + size.Height) / 2 - ActualCellSize.Height / 2, location);
                    y = -(ActualCellSize.Height + CenterNodeDistance) / 2;
                    break;
            }
            var index = 0;
            nodes.Where(n => n != center).ForEach(n =>
            {
                n.Location = new Point(n.Location.X + x, n.Location.Y + y);
                index++;
            });
            return new Size(size.Width + Math.Abs(x) * 2, size.Height + Math.Abs(y) * 2);
        }

    }
}
