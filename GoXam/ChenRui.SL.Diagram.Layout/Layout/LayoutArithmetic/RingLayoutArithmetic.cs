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
using ChenRui.SL.Configuration;
using ChenRui.SL.Common.Arithmetic;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 环形布局算法
    /// </summary>
    public class RingLayoutArithmetic : LayoutArithmetic
    {
        /// <summary>
        /// 弧间距比例
        /// </summary>
        public double ArcSpacingRatio { get; set; }

        /// <summary>
        /// 首圈节点数
        /// </summary>
        public int FirstCircleNodeCount { get; set; }
        
        /// <summary>
        /// 首圈半径
        /// </summary>
        public double FirstCircleRadius { get; set; }

        /// <summary>
        /// 圈间距比例
        /// </summary>
        public double CircleSpacingRatio { get; set; }

        /// <summary>
        /// 起始角度
        /// </summary>
        public double StartAngle { get; set; }

        /// <summary>
        /// 是否是顺时针
        /// </summary>
        public bool IsClockwise { get; set; }

        /// <summary>
        /// 中心点距离比例
        /// </summary>
        public double CenterNodeDistanceRatio { get; set; }

        /// <summary>
        /// 布局核心
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        /// <param name="center">中心</param>
        /// <returns>布局结果</returns>
        protected override LayoutResult LayoutCore(IEnumerable<ILocatable> locatables, ILocatable center)
        {
            if (center != null)
            {
                center.Location = new Point(0, 0);
                var ls = locatables.Where(l => l != center);
                var count = ls.Count();
                return count == 0 ? new LayoutResult(new Size(ActualCellSize.Width, ActualCellSize.Height)) : new LayoutResult(Layout(ls, count, true, locatables));
            }
            return new LayoutResult(Layout(locatables, locatables.Count(), false, locatables));
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="locatables">可定位集合，就是点或者组,不包含中心</param>
        /// <param name="count">可定位集合的个数</param>
        /// <param name="hasCenter">是否有中心</param>
        /// <param name="allLocatables">全部可定位集合，包含中心</param>
        /// <returns>大小</returns>
        private Size Layout(IEnumerable<ILocatable> locatables, int count, bool hasCenter, IEnumerable<ILocatable> allLocatables)
        {
            if (!hasCenter && count == 1)
            {
                locatables.First().Location = new Point(0, 0);
                return new Size(ActualCellSize.Width, ActualCellSize.Height);
            }
            var cellSize = Math.Max(ActualCellSize.Width, ActualCellSize.Height);
            var outerRadius = cellSize / 2 / Math.Sin(Math.PI / 4);
            var firstCircleRadius = FirstCircleRadius;
            var firstCircleNodeCount = FirstCircleNodeCount < 4 ? 4 : FirstCircleNodeCount;

            if (double.IsNaN(firstCircleRadius))
            {
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
            locatables.ForEach(l =>
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
            var d = IsClockwise ? 1 : -1;
            if (nodeCounts.Count == 1 && index < nodeCount)
            {
                var _r = radiuss[0];
                if (!hasCenter && count == 2)
                {
                    _r = outerRadius;
                }
                index = 0;
                locatables.ForEach(l =>
                {
                    l.Location = new Point(_r * Math.Cos(StartAngle / 180 * Math.PI + 2 * Math.PI / count * index), _r * Math.Sin(StartAngle / 180 * Math.PI + 2 * Math.PI / count * index));
                    index = index + d;
                });
                return new Size(allLocatables.Max(l => l.Location.X + cellSize / 2) - allLocatables.Min(l => l.Location.X - cellSize / 2), allLocatables.Max(l => l.Location.Y + cellSize / 2) - allLocatables.Min(l => l.Location.Y - cellSize / 2));
            }
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
                nodeCountsResult[nodeCountsResult.Count - 1] = nodeCountsResult[nodeCountsResult.Count - 1] - (nodeCountsResult.Sum() - count);
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
            var c = nodeCountsResult[nodeCountsResultIndex];
            locatables.ForEach(l =>
            {
                if (Math.Abs(index) >= c)
                {
                    nodeCountsResultIndex++;
                    c = nodeCountsResult[nodeCountsResultIndex];
                    r = finalRadiuss[nodeCountsResultIndex];
                    index = 0;
                }
                l.Location = new Point(r * Math.Cos(StartAngle / 180 * Math.PI + 2 * Math.PI / c * index), r * Math.Sin(StartAngle / 180 * Math.PI + 2 * Math.PI / c * index));
                index = index + d;
            });
            return new Size(allLocatables.Max(l => l.Location.X + cellSize / 2) - allLocatables.Min(l => l.Location.X - cellSize / 2), allLocatables.Max(l => l.Location.Y + cellSize / 2) - allLocatables.Min(l => l.Location.Y - cellSize / 2));
        }

        /// <summary>
        /// 获取配置
        /// </summary>
        /// <param name="o">对象</param>
        public override void GetConfig(object o)
        {
            try
            {
                base.GetConfig(o);
                dynamic c = o;
                ArcSpacingRatio = c.ArcSpacingRatio;
                FirstCircleNodeCount = c.FirstCircleNodeCount;
                FirstCircleRadius = c.FirstCircleRadius;
                CircleSpacingRatio = c.CircleSpacingRatio;
                StartAngle = c.StartAngle;
                IsClockwise = c.IsClockwise;
                CenterNodeDistanceRatio = c.CenterNodeDistanceRatio;
            }
            catch (Exception)
            {
                ArcSpacingRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.RING_ARC_SPACING_RATIO_KEY);
                FirstCircleNodeCount = ConfigContext.Current.GetInt(ConfigKeyInfo.RING_FIRST_CIRCLE_NODE_COUNT_KEY);
                FirstCircleRadius = ConfigContext.Current.GetBool(ConfigKeyInfo.RING_FIRST_CIRCLE_FIX_RADIUS_KEY) ? ConfigContext.Current.GetDouble(ConfigKeyInfo.RING_FIRST_CIRCLE_RADIUS_KEY) : double.NaN;
                CircleSpacingRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.RING_CIRCLE_SPACING_RATIO_KEY);
                StartAngle = ConfigContext.Current.GetDouble(ConfigKeyInfo.RING_START_ANGLE_KEY);
                IsClockwise = ConfigContext.Current.GetBool(ConfigKeyInfo.RING_IS_CLOCKWISE_KEY);
                CenterNodeDistanceRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.RING_CENTER_NODE_DISTANCE_RATIO_KEY);
            }
        }

    }
}
