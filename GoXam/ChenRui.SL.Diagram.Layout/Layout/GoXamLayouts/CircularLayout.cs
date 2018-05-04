﻿#region Copyright ©2011北京宸瑞科技有限公司
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
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using Northwoods.GoXam;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 圆形算法
    /// </summary>
    public class CircularLayout : Northwoods.GoXam.Layout.CircularLayout, ILocation, IReferenceNodes, ILayoutConfig, INeedRevert
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
        /// 还原动作
        /// </summary>
        public Action<IEnumerable<Node>> Revert { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        public CircularLayout()
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
            if (Revert != null)
            {
                Revert(nodes);
            }

            if (LocationProvider == null)
            {
                LocationProvider = new DefaultLocationProvider { Layout = this };
            }

            if (LocationProvider.HasLocation)
            {
                ArrangementOrigin = LocationProvider.Location;
                base.DoLayout(nodes, links);
                if (LocationProvider.IsLocationCenter)
                {
                    nodes.ForEach(n => n.Location = new Point(n.Location.X - ActualXRadius, n.Location.Y - ActualYRadius));
                }
            }
            else
            {
                base.DoLayout(nodes, links);

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