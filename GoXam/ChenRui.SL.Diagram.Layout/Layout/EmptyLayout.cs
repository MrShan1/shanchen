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

using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using Northwoods.GoXam;
using Northwoods.GoXam.Layout;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 空布局
    /// </summary>
    public class EmptyLayout : DiagramLayout, ILocation, IReferenceNodes, ILayoutConfig
    {
        /// <summary>
        /// 位置提供者
        /// </summary>
        public ILocationProvider LocationProvider { get; set; }

        /// <summary>
        /// 参考点提供者
        /// </summary>
        public IReferenceNodesProvider ReferenceNodesProvider { get; set; }

        /// <summary>
        /// 参数
        /// </summary>
        public ICollection<string> Parameters { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        public EmptyLayout()
        {
            Parameters = new Collection<string>();
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        public override void DoLayout(IEnumerable<Node> nodes, IEnumerable<Link> links)
        {
            if (LocationProvider == null)
            {
                LocationProvider = new DefaultLocationProvider { Layout = this };
            }

            if (LocationProvider.HasLocation)
            {
                var bounds = Diagram.Panel.ComputeBounds(nodes);
                var x = bounds.Left - LocationProvider.Location.X;
                var y = bounds.Top - LocationProvider.Location.Y;
                if (LocationProvider.IsLocationCenter)
                {
                    x = x + bounds.Width / 2;
                    y = y + bounds.Height / 2;
                }
                nodes.ForEach(n => n.Location = new Point(n.Location.X - x, n.Location.Y - y));
            }
            else
            {
                var bounds = Diagram.Panel.ComputeBounds(nodes);

                if (ReferenceNodesProvider == null)
                {
                    ReferenceNodesProvider = new DefaultReferenceNodesProvider { Layout = this };
                }
                if (LocationProvider.ReferencePoint == null)
                {
                    var referenceNodes = ReferenceNodesProvider.HasReferenceNodes ? ReferenceNodesProvider.GetReferenceNodes() : null;
                    if (referenceNodes != null)
                    {
                        var referenceNode = referenceNodes.FirstOrDefault();
                        if (referenceNode != null)
                        {
                            LocationProvider.ReferencePoint = new Point(referenceNode.Bounds.X + referenceNode.Bounds.Width / 2, referenceNode.Bounds.Y + referenceNode.Bounds.Height / 2);
                        }
                    }
                }
                var location = LocationProvider.GetLocation(new Size(bounds.Width, bounds.Height), nodes, links, LocationProvider.ReferencePoint == null);
                var x = bounds.Left - location.X;
                var y = bounds.Top - location.Y;
                if (LocationProvider.IsLocationCenter)
                {
                    x = x + bounds.Width / 2;
                    y = y + bounds.Height / 2;
                }
                nodes.ForEach(n => n.Location = new Point(n.Location.X - x, n.Location.Y - y));
            }
        }

    }
}
