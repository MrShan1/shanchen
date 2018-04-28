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
    /// 环形布局
    /// </summary>
    public class RingLayout : OldCustomizedLayout, ISpecialNodes
    {
        /// <summary>
        /// 特殊点提供者
        /// </summary>
        public ISpecialNodesProvider SpecialNodesProvider { get; set; }

        /// <summary>
        /// 标识ArcSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty ArcSpacingRatioProperty = DependencyProperty.Register("ArcSpacingRatio", typeof(double), typeof(RingLayout), new PropertyMetadata(0.0, OnPropertyChanged));

        /// <summary>
        /// 弧间距比例
        /// </summary>
        public double ArcSpacingRatio
        {
            get { return (double)GetValue(ArcSpacingRatioProperty); }
            set { SetValue(ArcSpacingRatioProperty, value); }
        }

        /// <summary>
        /// 标识FirstCircleNodeCount依赖属性
        /// </summary>
        public static readonly DependencyProperty FirstCircleNodeCountProperty = DependencyProperty.Register("FirstCircleNodeCount", typeof(int), typeof(RingLayout), new PropertyMetadata(8, OnPropertyChanged));

        /// <summary>
        /// 首圈节点数
        /// </summary>
        public int FirstCircleNodeCount
        {
            get { return (int)GetValue(FirstCircleNodeCountProperty); }
            set { SetValue(FirstCircleNodeCountProperty, value); }
        }

        /// <summary>
        /// 标识FirstCircleRadius依赖属性
        /// </summary>
        public static readonly DependencyProperty FirstCircleRadiusProperty = DependencyProperty.Register("FirstCircleRadius", typeof(double), typeof(RingLayout), new PropertyMetadata(Double.NaN, OnPropertyChanged));  // may be NaN

        /// <summary>
        /// 首圈半径
        /// </summary>
        public double FirstCircleRadius
        {
            get { return (double)GetValue(FirstCircleRadiusProperty); }
            set { SetValue(FirstCircleRadiusProperty, value); }
        }

        /// <summary>
        /// 标识CircleSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty CircleSpacingRatioProperty = DependencyProperty.Register("CircleSpacingRatio", typeof(double), typeof(RingLayout), new PropertyMetadata(1.0, OnPropertyChanged));

        /// <summary>
        /// 圈间距比例
        /// </summary>
        public double CircleSpacingRatio
        {
            get { return (double)GetValue(CircleSpacingRatioProperty); }
            set { SetValue(CircleSpacingRatioProperty, value); }
        }

        /// <summary>
        /// 标识StartAngle依赖属性
        /// </summary>
        public static readonly DependencyProperty StartAngleProperty = DependencyProperty.Register("StartAngle", typeof(double), typeof(RingLayout), new PropertyMetadata(-90.0, OnPropertyChanged));

        /// <summary>
        /// 起始角度
        /// </summary>
        public double StartAngle
        {
            get { return (double)GetValue(StartAngleProperty); }
            set { SetValue(StartAngleProperty, value); }
        }

        /// <summary>
        /// 标识IsClockwise依赖属性
        /// </summary>
        public static readonly DependencyProperty IsClockwiseProperty = DependencyProperty.Register("IsClockwise", typeof(bool), typeof(RingLayout), new PropertyMetadata(true, OnPropertyChanged));

        /// <summary>
        /// 是否是顺时针
        /// </summary>
        public bool IsClockwise
        {
            get { return (bool)GetValue(IsClockwiseProperty); }
            set { SetValue(IsClockwiseProperty, value); }
        }

        /// <summary>
        /// 标识CenterNodeDistanceRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty CenterNodeDistanceRatioProperty = DependencyProperty.Register("CenterNodeDistanceRatio", typeof(double), typeof(RingLayout), new PropertyMetadata(0.3, OnPropertyChanged));

        /// <summary>
        /// 中心点距离比例
        /// </summary>
        public double CenterNodeDistanceRatio
        {
            get { return (double)GetValue(CenterNodeDistanceRatioProperty); }
            set { SetValue(CenterNodeDistanceRatioProperty, value); }
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
                if (center != null)
                {
                    Locate(center, 0, 0, location);
                    return nodes.Count() > 1 ? new LayoutResult(DoLayoutInternal(nodes.Where(n => n != center), location, true)) : new LayoutResult(new Size(ActualCellSize.Width, ActualCellSize.Height));
                }
                return new LayoutResult(DoLayoutInternal(nodes, location, false));
            }
            return new LayoutResult(DoLayoutInternal(nodes, location, false));
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="location">位置</param>
        /// <param name="hasCenter">是否有中心</param>
        /// <returns>大小</returns>
        private Size DoLayoutInternal(IEnumerable<Node> nodes, Point? location, bool hasCenter)
        {
            var nodesCount = nodes.Count();
            if (!hasCenter && nodesCount == 1)
            {
                Locate(nodes.FirstOrDefault(), 0, 0, location);
                return new Size(ActualCellSize.Width, ActualCellSize.Height);
            }
            var cellSize = Math.Max(ActualCellSize.Width, ActualCellSize.Height);
            var outerRadius = cellSize / 2 / Math.Sin(Math.PI / 4);
            var firstCircleRadius = FirstCircleRadius;
            var firstCircleNodeCount = FirstCircleNodeCount < 4 ? 4 : FirstCircleNodeCount;

            if (double.IsNaN(firstCircleRadius))
            {
                //var r = (outerRadius + Distance / 2) / Math.Sin(Math.PI / count);
                firstCircleRadius = Arithmetic.GetR(outerRadius, outerRadius * ArcSpacingRatio, Math.PI / firstCircleNodeCount);
                if (hasCenter && firstCircleRadius < outerRadius * 2 + outerRadius * 2 * CenterNodeDistanceRatio)
                {
                    firstCircleRadius = outerRadius * 2 + outerRadius * 2 * CenterNodeDistanceRatio;
                }
            }
            else
            {
                if (hasCenter && firstCircleRadius < outerRadius * 2 + outerRadius * 2 * CenterNodeDistanceRatio)
                {
                    firstCircleRadius = outerRadius * 2 + outerRadius * 2 * CenterNodeDistanceRatio;
                }
                firstCircleNodeCount = (int)Math.Floor(Math.PI / Arithmetic.GetPhi(outerRadius, outerRadius * ArcSpacingRatio, firstCircleRadius));
            }
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
                    nodeCount = (int)Math.Floor(Math.PI / Arithmetic.GetPhi(outerRadius, outerRadius * ArcSpacingRatio, radius));
                    radiuss.Add(radius);
                    nodeCounts.Add(nodeCount);
                    index = 0;
                }
                index++;
            });
            var nodeCountsResult = nodeCounts;
            if (nodeCounts.Count > 1 && index < nodeCount)
            {
                nodeCounts.RemoveAt(nodeCounts.Count - 1);
                radiuss.RemoveAt(radiuss.Count - 1);
                var circleLength = radiuss.Select(_r => 2 * Math.PI * _r).Sum();
                nodeCountsResult = nodeCountsResult.ToList();
                for (var i = 0; i < nodeCounts.Count; i++)
                {
                    nodeCountsResult[i] = nodeCounts[i] + Math.Round(index * (2 * Math.PI * radiuss[i] / circleLength));
                }
                nodeCountsResult[nodeCountsResult.Count - 1] = nodeCountsResult[nodeCountsResult.Count - 1] - (nodeCountsResult.Sum() - nodesCount);
            }
            var r1 = Arithmetic.GetR(outerRadius, outerRadius * ArcSpacingRatio, Math.PI / nodeCountsResult[0]);
            var finalRadiuss = new List<double> { r1 };
            if (nodeCountsResult.Count > 1)
            {
                var r2 = Arithmetic.GetR(outerRadius, outerRadius * ArcSpacingRatio, Math.PI / nodeCountsResult[nodeCountsResult.Count - 1]);
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
            nodes.ForEach(n =>
            {
                if (Math.Abs(index) >= count)
                {
                    nodeCountsResultIndex++;
                    count = nodeCountsResult[nodeCountsResultIndex];
                    r = finalRadiuss[nodeCountsResultIndex];
                    index = 0;
                }
                Locate(n, r * Math.Cos(StartAngle / 180 * Math.PI + 2 * Math.PI / count * index), r * Math.Sin(StartAngle / 180 * Math.PI + 2 * Math.PI / count * index), location);
                if (IsClockwise)
                {
                    index++;
                }
                else
                {
                    index--;
                }
            });
            return new Size(r * 2 + cellSize, r * 2 + cellSize);
        }

    }
}
