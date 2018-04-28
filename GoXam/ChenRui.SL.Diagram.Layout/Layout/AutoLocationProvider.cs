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
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using Northwoods.GoXam;
using Northwoods.GoXam.Layout;
using ChenRui.SL.Common.Arithmetic;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 自动位置提供者
    /// </summary>
    public class AutoLocationProvider : ILocationProvider
    {
        /// <summary>
        /// 间距
        /// </summary>
        public Size Padding { get; set; }

        /// <summary>
        /// 布局
        /// </summary>
        public DiagramLayout Layout { get; set; }

        /// <summary>
        /// 是否有位置
        /// </summary>
        public bool HasLocation { get { return false; } }

        /// <summary>
        /// 参考点
        /// </summary>
        public Point? ReferencePoint { get; set; }

        /// <summary>
        /// 位置
        /// </summary>
        public Point Location { get; set; }

        /// <summary>
        /// 位置是否是中心
        /// </summary>
        public bool IsLocationCenter { get; set; }

        /// <summary>
        /// 返回位置
        /// </summary>
        /// <param name="size">大小</param>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        /// <param name="referencePointHasNode">参考点是否有点</param>
        /// <returns>点</returns>
        public Point GetLocation(Size size, IEnumerable<Node> nodes, IEnumerable<Link> links, bool referencePointHasNode)
        {
            Point center;
            //有参考点用参考点，没参考点用中心
            if (ReferencePoint != null)
            {
                center = (Point)ReferencePoint;
            }
            else
            {
                center = GetCenter(Layout.Diagram.Panel.DiagramBounds);
            }

            var s = new Size(size.Width + Padding.Width * 2, size.Height + Padding.Height * 2);

            //LogHelper.WriterDebugLog("扫描初始点：" + center);
            //LogHelper.WriterDebugLog("需要大小：" + s);

            var location = GetLocation(center, s, nodes, ReferencePoint != null && referencePointHasNode, Layout.Diagram);
            ReferencePoint = location;
            return location;
        }

        /// <summary>
        /// 构造函数
        /// </summary>
        public AutoLocationProvider()
        {
            IsLocationCenter = true;
            Padding = new Size(100, 100);
        }

        /// <summary>
        /// 返回中心
        /// </summary>
        /// <param name="bound">边界</param>
        /// <returns>中心点</returns>
        private static Point GetCenter(Rect bound)
        {
            return new Point(bound.X + bound.Width / 2, bound.Y + bound.Height / 2);
        }

        /// <summary>
        /// 返回位置
        /// </summary>
        /// <param name="center">中心</param>
        /// <param name="size">大小</param>
        /// <param name="nodes">节点集合</param>
        /// <param name="referencePointHasNode">参考点是否有点</param>
        /// <param name="diagram">画板</param>
        /// <returns>位置</returns>
        private static Point GetLocation(Point center, Size size, IEnumerable<Node> nodes, bool referencePointHasNode, Northwoods.GoXam.Diagram diagram)
        {
            //获取中心
            var c = GetCenter(diagram.Panel.DiagramBounds);
            //如果参考点不是中心，取两点相对于x轴的夹角-180，否则为0
            var startAngle = c != center ? Arithmetic.GetAngle(c, center) - 180 : 0;
            //如果参考点有节点，则需要给节点留些地方，所以要计算一个宽度
            var r0 = referencePointHasNode ? Math.Min(size.Width, size.Height) / 2 : 0;
            //可选的点，不是组的，把要布局的点去掉，剩下的是要碰撞的点
            var ns = diagram.Nodes.Where(n => n.Selectable && !(n is Northwoods.GoXam.Group)).Except(nodes).ToList();
            //初始化一个变化量，转圈扫描
            var dr = ns.Any() ? Math.Min(ns.Max(n => n.Bounds.Width), ns.Max(n => n.Bounds.Height)) : 100;
            var i = 1;
            while (true)
            {
                var r = r0 + (i - 1) * dr;
                var da = dr / (2 * Math.PI * r) * 360;
                for (var a = startAngle; a < startAngle + 360; a = a + da)
                {
                    var p = new Point(center.X + r * Math.Cos(a / 180 * Math.PI), center.Y + r * Math.Sin(a / 180 * Math.PI));
                    var rect = new Rect(p.X - size.Width / 2, p.Y - size.Height / 2, size.Width, size.Height);
                    if (!HitTest(rect, ns))
                    {
                        //LogHelper.WriterDebugLog("找到的坐标值:" + p);
                        return p;
                    }
                }
                i++;
            }
        }

        /// <summary>
        /// 碰撞测试
        /// </summary>
        /// <param name="rect">矩形</param>
        /// <param name="nodes">节点集合</param>
        /// <returns>是否碰撞</returns>
        private static bool HitTest(Rect rect, IEnumerable<Node> nodes)
        {
            foreach (var n in nodes)
            {
                var r = new Rect(rect.X, rect.Y, rect.Width, rect.Height);
                r.Intersect(n.Bounds);
                if (!r.IsEmpty) return true;
            }
            return false;
        }

    }
}
