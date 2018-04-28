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
using System.Collections.Generic;
using System.Linq;
using Northwoods.GoXam;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 水平布局
    /// </summary>
    public class HorizontalLayout : OldCustomizedLayout, ISpecialNodes
    {
        /// <summary>
        /// 特殊点提供者
        /// </summary>
        public ISpecialNodesProvider SpecialNodesProvider { get; set; }

        /// <summary>
        /// 标识IsCenterNodeTop依赖属性
        /// </summary>
        public static readonly DependencyProperty IsCenterNodeTopProperty = DependencyProperty.Register("IsCenterNodeTop", typeof(bool), typeof(HorizontalLayout), new PropertyMetadata(true, OnPropertyChanged));

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
        public HorizontalLayout()
        {
            Spacing = new Size(10, 50);
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
            var size = new Size(count * ActualCellSize.Width + (count - 1) * Spacing.Width, ActualCellSize.Height);
            var index = 0;
            nodes.ForEach(n =>
            {
                Locate(n, ActualCellSize.Width / 2 + (ActualCellSize.Width + Spacing.Width) * index - size.Width / 2, 0, location);
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
            Locate(center, 0, (Spacing.Height / 2 + ActualCellSize.Height / 2) * (IsCenterNodeTop ? -1 : 1), location);
            var count = nodes.Where(n => n != center).Count();
            var size = new Size(count * ActualCellSize.Width + (count - 1) * Spacing.Width, ActualCellSize.Height * 2 + Spacing.Height);
            var index = 0;
            nodes.Where(n => n != center).ForEach(n =>
            {
                Locate(n, ActualCellSize.Width / 2 + (ActualCellSize.Width + Spacing.Width) * index - size.Width / 2, (Spacing.Height / 2 + ActualCellSize.Height / 2) * (IsCenterNodeTop ? 1 : -1), location);
                index++;
            });
            return size;
        }

    }
}
