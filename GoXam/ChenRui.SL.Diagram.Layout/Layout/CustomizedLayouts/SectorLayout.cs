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
using Northwoods.GoXam.Layout;
using ChenRui.SL.Common.Arithmetic;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 扇形布局
    /// </summary>
    public class SectorLayout : OldCustomizedLayout, ISpecialNodes
    {
        /// <summary>
        /// 特殊点提供者
        /// </summary>
        public ISpecialNodesProvider SpecialNodesProvider { get; set; }

        /// <summary>
        /// 标识ArcSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty ArcSpacingRatioProperty = DependencyProperty.Register("ArcSpacingRatio", typeof(double), typeof(SectorLayout), new PropertyMetadata(0.0, OnPropertyChanged));

        /// <summary>
        /// 弧间距比例
        /// </summary>
        public double ArcSpacingRatio
        {
            get { return (double)GetValue(ArcSpacingRatioProperty); }
            set { SetValue(ArcSpacingRatioProperty, value); }
        }

        /// <summary>
        /// 标识FirstCircleRadiusRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty FirstCircleRadiusRatioProperty = DependencyProperty.Register("FirstCircleRadiusRatio", typeof(double), typeof(SectorLayout), new PropertyMetadata(10.0, OnPropertyChanged));

        /// <summary>
        /// 首圈半径比例
        /// </summary>
        public double FirstCircleRadiusRatio
        {
            get { return (double)GetValue(FirstCircleRadiusRatioProperty); }
            set { SetValue(FirstCircleRadiusRatioProperty, value); }
        }

        /// <summary>
        /// 标识CircleSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty CircleSpacingRatioProperty = DependencyProperty.Register("CircleSpacingRatio", typeof(double), typeof(SectorLayout), new PropertyMetadata(1.0, OnPropertyChanged));

        /// <summary>
        /// 圈间距比例
        /// </summary>
        public double CircleSpacingRatio
        {
            get { return (double)GetValue(CircleSpacingRatioProperty); }
            set { SetValue(CircleSpacingRatioProperty, value); }
        }

        /// <summary>
        /// 是否有角度
        /// </summary>
        private bool hasAngle;

        /// <summary>
        /// 标识Angle依赖属性
        /// </summary>
        public static readonly DependencyProperty AngleProperty = DependencyProperty.Register("Angle", typeof(double), typeof(SectorLayout), new PropertyMetadata(0.0, OnPropertyChanged));

        /// <summary>
        /// 角度
        /// </summary>
        public double Angle
        {
            get { return (double)GetValue(AngleProperty); }
            set { SetValue(AngleProperty, value); }
        }

        /// <summary>
        /// 标识AngleRange依赖属性
        /// </summary>
        public static readonly DependencyProperty AngleRangeProperty = DependencyProperty.Register("AngleRange", typeof(double), typeof(SectorLayout), new PropertyMetadata(90.0, OnPropertyChanged));

        /// <summary>
        /// 角度范围
        /// </summary>
        public double AngleRange
        {
            get { return (double)GetValue(AngleRangeProperty); }
            set { SetValue(AngleRangeProperty, value); }
        }

        /// <summary>
        /// 标识IsClockwise依赖属性
        /// </summary>
        public static readonly DependencyProperty IsClockwiseProperty = DependencyProperty.Register("IsClockwise", typeof(bool), typeof(SectorLayout), new PropertyMetadata(true, OnPropertyChanged));

        /// <summary>
        /// 是否是顺时针
        /// </summary>
        public bool IsClockwise
        {
            get { return (bool)GetValue(IsClockwiseProperty); }
            set { SetValue(IsClockwiseProperty, value); }
        }

        /// <summary>
        /// 标识IsContinuous依赖属性
        /// </summary>
        public static readonly DependencyProperty IsContinuousProperty = DependencyProperty.Register("IsContinuous", typeof(bool), typeof(SectorLayout), new PropertyMetadata(true, OnPropertyChanged));

        /// <summary>
        /// 是否连续
        /// </summary>
        public bool IsContinuous
        {
            get { return (bool)GetValue(IsContinuousProperty); }
            set { SetValue(IsContinuousProperty, value); }
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
            if (location == null)
            {
                return new LayoutResult(GetSize(nodes, specialNodes), true);
            }
            if (!hasAngle)
            {
                if (ReferenceNodesProvider.HasReferenceNodes)
                {
                    var referenceNode = ReferenceNodesProvider.GetReferenceNodes().FirstOrDefault();
                    if (referenceNode != null)
                    {
                        Angle = GetAngle(referenceNode, (Point)location);
                    }
                    else
                    {
                        Angle = GetAngle(null, (Point)location);
                    }
                }
                else
                {
                    Angle = GetAngle(null, (Point)location);
                }
                hasAngle = true;
            }
            var locations = new List<Point>();
            var cellSize = Math.Max(ActualCellSize.Width, ActualCellSize.Height);
            var outerRadius = cellSize / 2 / Math.Sin(Math.PI / 4);
            var _nodes = nodes;
            if (specialNodes != null)
            {
                var center = specialNodes.FirstOrDefault();
                if (center != null)
                {
                    locations.Add(new Point(0, 0));
                    _nodes = nodes.Where(n => n != center);
                    DoLayoutInternal(_nodes, true, outerRadius, Angle, locations);
                }
                else
                {
                    DoLayoutInternal(_nodes, false, outerRadius, Angle, locations);
                }
            }
            else
            {
                DoLayoutInternal(_nodes, false, outerRadius, Angle, locations);
            }
            var left = locations.Min(l => l.X) - outerRadius;
            var right = locations.Max(l => l.X) + outerRadius;
            var top = locations.Min(l => l.Y) - outerRadius;
            var bottom = locations.Max(l => l.Y) + outerRadius;
            var x = left + (right - left) / 2;
            var y = top + (bottom - top) / 2;
            var index = 0;
            if (specialNodes != null)
            {
                var center = specialNodes.FirstOrDefault();
                if (center != null)
                {
                    var l = locations.FirstOrDefault();
                    Locate(center, l.X - x, l.Y - y, location);
                    index++;
                }
            }
            _nodes.ForEach(n =>
            {
                Locate(n, locations[index].X - x, locations[index].Y - y, location);
                index++;
            });
            return new LayoutResult(new Size(right - left, bottom - top));
        }

        /// <summary>
        /// 返回角度
        /// </summary>
        /// <param name="referenceNode">参考点</param>
        /// <param name="location">位置</param>
        /// <returns>角度</returns>
        private double GetAngle(Node referenceNode, Point location)
        {
            Point center;
            if (referenceNode != null)
            {
                center = referenceNode.Location;
            }
            else
            {
                var bound = Diagram.Panel.DiagramBounds;
                center = new Point(bound.Left + (bound.Right - bound.Left) / 2, bound.Top + (bound.Right - bound.Top) / 2);
            }
            return center != location ? Arithmetic.GetAngle(center, location) : Angle;
        }

        /// <summary>
        /// 返回大小
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="specialNodes">特殊点集合</param>
        /// <returns>大小</returns>
        private Size GetSize(IEnumerable<Node> nodes, IEnumerable<Node> specialNodes)
        {
            var cellSize = Math.Max(ActualCellSize.Width, ActualCellSize.Height);
            var outerRadius = cellSize / 2 / Math.Sin(Math.PI / 4);
            var sizes = new List<Size>();
            for (var i = 0; i < 360; i = i + 45)
            {
                var locations = new List<Point>();
                var _nodes = nodes;
                if (specialNodes != null)
                {
                    var center = specialNodes.FirstOrDefault();
                    if (center != null)
                    {
                        locations.Add(new Point(0, 0));
                        _nodes = nodes.Where(n => n != center);
                        DoLayoutInternal(_nodes, true, outerRadius, i, locations);
                    }
                    else
                    {
                        DoLayoutInternal(_nodes, false, outerRadius, i, locations);
                    }
                }
                else
                {
                    DoLayoutInternal(_nodes, false, outerRadius, i, locations);
                }
                var left = locations.Min(l => l.X) - outerRadius;
                var right = locations.Max(l => l.X) + outerRadius;
                var top = locations.Min(l => l.Y) - outerRadius;
                var bottom = locations.Max(l => l.Y) + outerRadius;
                sizes.Add(new Size(right - left, bottom - top));
            }
            return new Size(sizes.Max(s => s.Width), sizes.Max(s => s.Height));
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="hasCenter">是否有中心</param>
        /// <param name="outerRadius">外半径</param>
        /// <param name="angle">角度</param>
        /// <param name="locations">位置集合</param>
        private void DoLayoutInternal(IEnumerable<Node> nodes, bool hasCenter, double outerRadius, double angle, List<Point> locations)
        {
            var nodesCount = nodes.Count();
            if (!hasCenter && nodesCount == 1)
            {
                locations.Add(new Point(0, 0));
                return;
            }
            var firstCircleRadius = outerRadius * FirstCircleRadiusRatio;
            var firstCircleNodeCount = (int)Math.Floor(Math.PI * AngleRange / 360 / Arithmetic.GetPhi(outerRadius, outerRadius * ArcSpacingRatio, firstCircleRadius));
            var index = 0;
            var radius = firstCircleRadius;
            var nodeCount = firstCircleNodeCount;
            var radiuss = new List<double> { radius };
            var nodeCounts = new List<double> { nodeCount };
            nodes.ForEach(n =>
            {
                if (index >= nodeCount)
                {
                    radius = radius + 2 * outerRadius + outerRadius * CircleSpacingRatio;
                    nodeCount = (int)Math.Floor(Math.PI * AngleRange / 360 / Arithmetic.GetPhi(outerRadius, outerRadius * ArcSpacingRatio, radius));
                    radiuss.Add(radius);
                    nodeCounts.Add(nodeCount);
                    index = 0;
                }
                index++;
            });
            var nodeCountsResult = nodeCounts;
            if (nodeCounts.Count == 1 && index < nodeCount)
            {
                var _r = radiuss[0];
                var da = AngleRange/(nodeCountsResult[0] - 1);
                var angleRange = da * (index - 1);
                var a = da * (Math.PI / 180);
                index = 0;
                nodes.ForEach(n =>
                {
                    if (IsClockwise)
                    {
                        locations.Add(new Point(_r * Math.Cos((angle - angleRange / 2) / 180 * Math.PI + a * index), _r * Math.Sin((angle - angleRange / 2) / 180 * Math.PI + a * index)));
                    }
                    else
                    {
                        locations.Add(new Point(_r * Math.Cos((angle + angleRange / 2) / 180 * Math.PI - a * index), radius * Math.Sin((angle + angleRange / 2) / 180 * Math.PI - a * index)));
                    }
                    index++;
                });
                return;
            }
            if (nodeCounts.Count > 1 && index < nodeCount)
            {
                nodeCounts.RemoveAt(nodeCounts.Count - 1);
                radiuss.RemoveAt(radiuss.Count - 1);
                var circleLength = radiuss.Select(_r => 2 * Math.PI * AngleRange / 360 * _r).Sum();
                nodeCountsResult = nodeCountsResult.ToList();
                for (var i = 0; i < nodeCounts.Count; i++)
                {
                    nodeCountsResult[i] = nodeCounts[i] + Math.Round(index * (2 * Math.PI * AngleRange / 360 * radiuss[i] / circleLength));
                }
                nodeCountsResult[nodeCountsResult.Count - 1] = nodeCountsResult[nodeCountsResult.Count - 1] - (nodeCountsResult.Sum() - nodesCount);
            }
            var r1 = Arithmetic.GetR(outerRadius, outerRadius * ArcSpacingRatio, Math.PI * AngleRange / 360 / (nodeCountsResult[0] - 1));
            var finalRadiuss = new List<double> { r1 };
            if (nodeCountsResult.Count > 1)
            {
                var r2 = Arithmetic.GetR(outerRadius, outerRadius * ArcSpacingRatio, Math.PI * AngleRange / 360 / (nodeCountsResult[nodeCountsResult.Count - 1] - 1));
                var diff = (r2 - r1) / (nodeCountsResult.Count - 1);
                for (var i = 1; i < nodeCountsResult.Count; i++)
                {
                    finalRadiuss.Add(r1 + diff * i);
                }
            }
            var r = r1;
            index = 0;
            var nodeCountsResultIndex = 0;
            var count = nodeCountsResult[nodeCountsResultIndex];
            var circleIndex = 0;
            nodes.ForEach(n =>
            {
                if (Math.Abs(index) >= count)
                {
                    nodeCountsResultIndex++;
                    count = nodeCountsResult[nodeCountsResultIndex];
                    r = finalRadiuss[nodeCountsResultIndex];
                    circleIndex++;
                    index = 0;
                }
                var a = AngleRange / (count - 1) * (Math.PI / 180);
                if (!IsContinuous)
                {
                    if (IsClockwise)
                    {
                        locations.Add(new Point(r * Math.Cos((angle - AngleRange / 2) / 180 * Math.PI + a * index), r * Math.Sin((angle - AngleRange / 2) / 180 * Math.PI + a * index)));
                    }
                    else
                    {
                        locations.Add(new Point(r * Math.Cos((angle + AngleRange / 2) / 180 * Math.PI - a * index), r * Math.Sin((angle + AngleRange / 2) / 180 * Math.PI - a * index)));
                    }
                }
                else
                {
                    if (IsClockwise)
                    {
                        if (circleIndex % 2 == 0)
                        {
                            locations.Add(new Point(r * Math.Cos((angle - AngleRange / 2) / 180 * Math.PI + a * index), r * Math.Sin((angle - AngleRange / 2) / 180 * Math.PI + a * index)));
                        }
                        else
                        {
                            locations.Add(new Point(r * Math.Cos((angle + AngleRange / 2) / 180 * Math.PI - a * index), r * Math.Sin((angle + AngleRange / 2) / 180 * Math.PI - a * index)));
                        }
                    }
                    else
                    {
                        if (circleIndex % 2 == 0)
                        {
                            locations.Add(new Point(r * Math.Cos((angle + AngleRange / 2) / 180 * Math.PI - a * index), r * Math.Sin((angle + AngleRange / 2) / 180 * Math.PI - a * index)));
                        }
                        else
                        {
                            locations.Add(new Point(r * Math.Cos((angle - AngleRange / 2) / 180 * Math.PI + a * index), r * Math.Sin((angle - AngleRange / 2) / 180 * Math.PI + a * index)));
                        }
                    }
                }
                index++;
            });
        }

    }
}
