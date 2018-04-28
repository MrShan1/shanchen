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
using System.Collections.ObjectModel;
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
    public class CustomizedLayout : DiagramLayout, ILocation, IReferenceNodes, ILayoutConfig, INeedRevert
    {
        /// <summary>
        /// 默认间距
        /// </summary>
        private static readonly Size DefaultSpacing = new Size(10, 10);

        /// <summary>
        /// 标识CellSize依赖属性
        /// </summary>
        public static readonly DependencyProperty CellSizeProperty = DependencyProperty.Register("CellSize", typeof(Size), typeof(CustomizedLayout), new PropertyMetadata(new Size(Double.NaN, Double.NaN), OnPropertyChanged));

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
        /// 标识Spacing依赖属性
        /// </summary>
        public static readonly DependencyProperty SpacingProperty = DependencyProperty.Register("Spacing", typeof(Size), typeof(CustomizedLayout), new PropertyMetadata(DefaultSpacing, OnPropertyChanged));

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
        public static readonly DependencyProperty CenterNodeTypeProperty = DependencyProperty.Register("CenterNodeType", typeof(EnumCenterNodeType), typeof(CustomizedLayout), new PropertyMetadata(EnumCenterNodeType.MaxLinkCountNode, OnPropertyChanged));

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
            var layout = (CustomizedLayout)d;
            layout.InvalidateLayout();
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
        /// 参考点
        /// </summary>
        public Node ReferenceNode { get; protected set; }

        /// <summary>
        /// 参考点
        /// </summary>
        public Point? ReferencePoint { get; protected set; }

        /// <summary>
        /// 参数
        /// </summary>
        public ICollection<string> Parameters { get; set; }

        /// <summary>
        /// 还原
        /// </summary>
        public Action<IEnumerable<Node>> Revert { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        public CustomizedLayout()
        {
            Parameters = new Collection<string>();
        }

        /// <summary>
        /// 定位点
        /// </summary>
        /// <param name="n">要定位的点</param>
        /// <param name="x">x左边</param>
        /// <param name="y">y左边</param>
        /// <param name="location">原点位置</param>
        /// <param name="move">是否移动</param>
        public void Locate(Node n, double x, double y, Point? location = null)
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
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        public override void DoLayout(IEnumerable<Node> nodes, IEnumerable<Link> links)
        {
            //TODO:zxy 把需链接删除，把正常链接隐藏，恢复为原始数据
            if (Revert != null)
            {
                Revert(nodes);
            }


            if (ReferenceNodesProvider == null)
            {
                //DefaultReferenceNodesProvider就是没有参考点
                ReferenceNodesProvider = new DefaultReferenceNodesProvider { Layout = this };
            }

            var referenceNodes = ReferenceNodesProvider.HasReferenceNodes ? ReferenceNodesProvider.GetReferenceNodes() : null;
            if (referenceNodes != null)
            {
                //目前只实现了使用第一个点当参考点
                ReferenceNode = referenceNodes.FirstOrDefault();
                if (ReferenceNode != null)
                {
                    //获取参考点的中心位置
                    ReferencePoint = new Point(ReferenceNode.Bounds.X + ReferenceNode.Bounds.Width / 2, ReferenceNode.Bounds.Y + ReferenceNode.Bounds.Height / 2);
                }
            }

            if (LocationProvider == null)
            {
                //return new Point(double.NaN, double.NaN);
                LocationProvider = new DefaultLocationProvider { Layout = this };
            }

            //i从0开始
            var ns = nodes.Select((n, i) => new NodeHost(n) { Index = i }).ToList();
            if (LocationProvider.HasLocation) //位置提供者能提供位置
            {
                var result = DoLayout(ns, links, LocationProvider.Location);

                // 偏移
                if (!LocationProvider.IsLocationCenter)
                {
                    ns.ForEach(n => n.Location = new Point(n.Location.X + result.ResultSize.Width / 2, n.Location.Y + result.ResultSize.Height / 2));
                }
            }
            else //位置提供者不能提供位置
            {
                var result = DoLayout(ns, links, null);

                //不能布局估算一下
                if (result.IsOnlyGetSize)
                {
                    if (LocationProvider.ReferencePoint == null)
                    {
                        LocationProvider.ReferencePoint = ReferencePoint;
                    }
                    var location = LocationProvider.GetLocation(result.ResultSize, nodes, links, LocationProvider.ReferencePoint == null);
                    LocationProvider = new DefaultLocationProvider { Location = location, Layout = this };

                    //待调试
                    if (!LocationProvider.IsLocationCenter)
                    {
                        location = new Point(location.X + result.ResultSize.Width / 2, location.Y + result.ResultSize.Height / 2);
                    }

                    DoLayout(ns, links, location);
                }
                //能够布局
                else
                {
                    if (LocationProvider.ReferencePoint == null)
                    {
                        LocationProvider.ReferencePoint = ReferencePoint;
                    }
                    var location = LocationProvider.GetLocation(new Size(result.ResultSize.Width, result.ResultSize.Height), nodes, links, LocationProvider.ReferencePoint == null);
                    ns.ForEach(n => n.Location = new Point(n.Location.X + location.X, n.Location.Y + location.Y));
                }
            }

            ns.ForEach(n => Locate(n.Node, n.Location.X, n.Location.Y));
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接结合</param>
        /// <param name="location">原点位置</param>
        /// <param name="move">是否移动</param>
        /// <returns>布局结果</returns>
        protected virtual LayoutResult DoLayout(IEnumerable<NodeHost> nodes, IEnumerable<Link> links, Point? location)
        {
            return new LayoutResult(new Size(0, 0));
        }

    }
}
