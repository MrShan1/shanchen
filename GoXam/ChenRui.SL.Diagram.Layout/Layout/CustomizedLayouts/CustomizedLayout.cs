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
using System.ComponentModel;
using System.Windows;
using System.Collections.Generic;
using System.Linq;
using Northwoods.GoXam;
using Northwoods.GoXam.Layout;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 自定义布局
    /// </summary>
    public class OldCustomizedLayout : DiagramLayout, ILocation, IReferenceNodes
    {
        /// <summary>
        /// 默认间距
        /// </summary>
        private static readonly Size DefaultSpacing = new Size(10, 10);

        /// <summary>
        /// 挂起重布局
        /// </summary>
        private bool suppressRelayout;

        /// <summary>
        /// 标识CellSize依赖属性
        /// </summary>
        public static readonly DependencyProperty CellSizeProperty = DependencyProperty.Register("CellSize", typeof(Size), typeof(OldCustomizedLayout), new PropertyMetadata(new Size(Double.NaN, Double.NaN), OnPropertyChanged));

        /// <summary>
        /// 单元大小
        /// </summary>
        [TypeConverter(typeof(Route.SizeConverter))]
        public Size CellSize
        {
            get { return (Size)GetValue(CellSizeProperty); }
            set { SetValue(CellSizeProperty, value); }
        }

        /// <summary>
        /// 实际单元大小
        /// </summary>
        public Size ActualCellSize { get; protected set; }

        /// <summary>
        /// 标识Spacing依赖属性
        /// </summary>
        public static readonly DependencyProperty SpacingProperty = DependencyProperty.Register("Spacing", typeof(Size), typeof(OldCustomizedLayout), new PropertyMetadata(DefaultSpacing, OnPropertyChanged));

        /// <summary>
        /// 间距
        /// </summary>
        public Size Spacing
        {
            get { return (Size)GetValue(SpacingProperty); }
            set { SetValue(SpacingProperty, value); }
        }

        /// <summary>
        /// 标识CenterNodeType依赖属性
        /// </summary>
        public static readonly DependencyProperty CenterNodeTypeProperty = DependencyProperty.Register("CenterNodeType", typeof(EnumCenterNodeType), typeof(OldCustomizedLayout), new PropertyMetadata(EnumCenterNodeType.MaxLinkCountNode, OnPropertyChanged));

        /// <summary>
        /// 中心点类型
        /// </summary>
        public EnumCenterNodeType CenterNodeType
        {
            get { return (EnumCenterNodeType)GetValue(CenterNodeTypeProperty); }
            set { SetValue(CenterNodeTypeProperty, value); }
        }

        /// <summary>
        /// 属性变化时
        /// </summary>
        /// <param name="d">对象</param>
        /// <param name="e">事件参数</param>
        protected static void OnPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            var layout = (OldCustomizedLayout)d;
            if (!layout.suppressRelayout)
            {
                layout.InvalidateLayout();
            }
        }

        /// <summary>
        /// 位置提供者
        /// </summary>
        public ILocationProvider LocationProvider { get; set; }

        /// <summary>
        /// 参考点提供者
        /// </summary>
        public IReferenceNodesProvider ReferenceNodesProvider { get; set; }

        /// <summary>
        /// 定位点
        /// </summary>
        /// <param name="n">要定位的点</param>
        /// <param name="x">x左边</param>
        /// <param name="y">y左边</param>
        /// <param name="location">原点位置</param>
        /// <param name="move">是否移动</param>
        public void Locate(Node n, double x, double y, Point? location)
        {
            if (location == null) //有原点
            {
                n.Move(new Point(x - n.Bounds.Width / 2, y - n.Bounds.Height / 2), true);
            }
            else //无原点
            {
                var l = (Point)location;
                n.Move(new Point(l.X + x - n.Bounds.Width / 2, l.Y + y - n.Bounds.Height / 2), true);
            }
        }

        /// <summary>
        /// 获取实际单元大小
        /// </summary>
        /// <param name="nodes">节点集合</param>
        private void GetActualCellSize(IEnumerable<Node> nodes)
        {
            if (double.IsNaN(CellSize.Width) || double.IsNaN(CellSize.Height))
            {
                ActualCellSize = new Size(nodes.Max(n => n.Bounds.Width), nodes.Max(n => n.Bounds.Height));
            }
            else
            {
                ActualCellSize = CellSize;
            }
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        public override void DoLayout(IEnumerable<Node> nodes, IEnumerable<Link> links)
        {
            // 找所有点中最大的点，做为间距或其他参数调整依据
            GetActualCellSize(nodes);

            // 某一个点不参与正常布局（提供获取特殊点的计算方式）
            var specialNodes = this as ISpecialNodes;
            if (specialNodes != null) //布局实现了ISpecialNodes接口
            {
                specialNodes.SpecialNodesProvider = CreateSpecialNodesProvider();
                DoLayoutInternal(nodes, links, specialNodes.SpecialNodesProvider != null ? specialNodes.SpecialNodesProvider.GetSpecialNodes(nodes) : null);
            }
            else
            {
                DoLayoutInternal(nodes, links, null);
            }
        }

        /// <summary>
        /// 创建特殊点提供者
        /// </summary>
        /// <returns></returns>
        protected virtual ISpecialNodesProvider CreateSpecialNodesProvider()
        {
            switch (CenterNodeType)
            {
                case EnumCenterNodeType.None:
                    return null;
                case EnumCenterNodeType.MaxLinkCountNode:
                    return new MaxLinkCountNodeCenterNodeProvider { Layout = this };
                case EnumCenterNodeType.FirstNode:
                    return new FirstNodeCenterNodeProvider { Layout = this };
                case EnumCenterNodeType.CenterNode:
                    return new CenterNodeCenterNodeProvider { Layout = this };
                case EnumCenterNodeType.LastNode:
                    return new LastNodeCenterNodeProvider { Layout = this };
            }
            return null;
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="center">中心点</param>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接结合</param>
        /// <param name="specialNodes">特殊点集合</param>
        private void DoLayoutInternal(IEnumerable<Node> nodes, IEnumerable<Link> links, IEnumerable<Node> specialNodes)
        {
            if (ReferenceNodesProvider == null)
            {
                ReferenceNodesProvider = new DefaultReferenceNodesProvider { Layout = this };
            }

            if (LocationProvider == null)
            {
                LocationProvider = new DefaultLocationProvider { Layout = this };
            }

            if (LocationProvider.HasLocation) //位置提供者能提供位置
            {
                var result = DoLayout(nodes, links, specialNodes, LocationProvider.Location);

                // 偏移
                if (!LocationProvider.IsLocationCenter)
                {
                    nodes.ForEach(n => n.Location = new Point(n.Location.X + result.ResultSize.Width / 2, n.Location.Y + result.ResultSize.Height / 2));
                }
            }
            else //位置提供者不能提供位置
            {
                var result = DoLayout(nodes, links, specialNodes, null);

                if (result.IsOnlyGetSize)
                {
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
                    var location = LocationProvider.GetLocation(result.ResultSize, nodes, links, LocationProvider.ReferencePoint == null);
                    LocationProvider = new DefaultLocationProvider { Location = location, Layout = this };

                    if (!LocationProvider.IsLocationCenter)
                    {
                        location = new Point(location.X + result.ResultSize.Width / 2, location.Y + result.ResultSize.Height / 2);
                    }
                    DoLayout(nodes, links, specialNodes, location);
                }
                else
                {
                    var bounds = Diagram.Panel.ComputeBounds(nodes);
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

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接结合</param>
        /// <param name="specialNodes">特殊点集合</param>
        /// <param name="location">位置</param>
        /// <returns>布局结果</returns>
        protected virtual LayoutResult DoLayout(IEnumerable<Node> nodes, IEnumerable<Link> links, IEnumerable<Node> specialNodes, Point? location)
        {
            return new LayoutResult(new Size(0, 0));
        }

    }
}
