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
    /// 垂直布局
    /// </summary>
    public class VerticalLayout : OldCustomizedLayout, ISpecialNodes
    {
        /// <summary>
        /// 特殊点提供者
        /// </summary>
        public ISpecialNodesProvider SpecialNodesProvider { get; set; }

        /// <summary>
        /// 标识IsCenterNodeLeft依赖属性
        /// </summary>
        public static readonly DependencyProperty IsCenterNodeLeftProperty = DependencyProperty.Register("IsCenterNodeLeft", typeof(bool), typeof(VerticalLayout), new PropertyMetadata(true, OnPropertyChanged));

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
        public VerticalLayout()
        {
            Spacing = new Size(50, 10);
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
            var size = new Size(ActualCellSize.Width, count * ActualCellSize.Height + (count - 1) * Spacing.Height);
            var index = 0;
            nodes.ForEach(n =>
            {
                Locate(n, 0, ActualCellSize.Height / 2 + (ActualCellSize.Height + Spacing.Height) * index - size.Height / 2, location);
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
            Locate(center, (Spacing.Width / 2 + ActualCellSize.Width / 2) * (IsCenterNodeLeft ? -1 : 1), 0, location);
            var count = nodes.Where(n => n != center).Count();
            var size = new Size(ActualCellSize.Width * 2 + Spacing.Width, count * ActualCellSize.Height + (count - 1) * Spacing.Height);
            var index = 0;
            nodes.Where(n => n != center).ForEach(n =>
            {
                Locate(n, (Spacing.Width / 2 + ActualCellSize.Width / 2) * (IsCenterNodeLeft ? 1 : -1), ActualCellSize.Height / 2 + (ActualCellSize.Height + Spacing.Height) * index - size.Height / 2, location);
                index++;
            });
            return size;
        }

    }
}
