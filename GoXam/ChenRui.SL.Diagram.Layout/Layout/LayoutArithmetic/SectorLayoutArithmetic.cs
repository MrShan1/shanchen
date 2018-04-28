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
    /// 扇形布局算法
    /// </summary>
    public class SectorLayoutArithmetic : LayoutArithmetic
    {
        /// <summary>
        /// 弧间距比例
        /// </summary>
        public double ArcSpacingRatio { get; set; }

        /// <summary>
        /// 首圈半径比例
        /// </summary>
        public double FirstCircleRadiusRatio { get; set; }

        /// <summary>
        /// 圈间距比例
        /// </summary>
        public double CircleSpacingRatio { get; set; }

        /// <summary>
        /// 角度
        /// </summary>
        public double Angle { get; set; }

        /// <summary>
        /// 角度范围
        /// </summary>
        public double AngleRange { get; set; }

        /// <summary>
        /// 是否是顺时针
        /// </summary>
        public bool IsClockwise { get; set; }

        /// <summary>
        /// 是否是连续
        /// </summary>
        public bool IsContinuous { get; set; }

        /// <summary>
        /// 中心点距离比例
        /// </summary>
        public double CenterNodeDistanceRatio { get; set; }

        /// <summary>
        /// 是否需要二次布局
        /// </summary>
        /// <returns></returns>
        protected override bool NeedSecondTimeLayout()
        {
            return true;
        }

        /// <summary>
        /// 布局核心
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        /// <param name="center">中心</param>
        /// <returns>布局结果</returns>
        protected override LayoutResult LayoutCore(IEnumerable<ILocatable> locatables, ILocatable center)
        {
            var group = Parameter as Group;
            if (group == null)
            {
                throw new ArgumentException();
            }
            var angle = Angle;
            var advancedLayout = group.Parent as AdvancedLayout;
            if (advancedLayout != null && !advancedLayout.Parameters.Contains("ChangeConfigLayout"))
            {
                if (IsSecondTime)
                {
                    return null;
                }
                if (Location == null)
                {
                    return new LayoutResult(GetSize(locatables), true);
                }
                if (group.ReferencePoint != null)
                {
                    angle = GetAngle((Point)group.ReferencePoint, (Point)Location);
                    Angle = angle;
                }
                else
                {
                    var bound = advancedLayout.Diagram.Panel.DiagramBounds;
                    angle = GetAngle(new Point(bound.Left + (bound.Right - bound.Left) / 2, bound.Top + (bound.Right - bound.Top) / 2), (Point)Location);
                    Angle = angle;
                }
            }
            if (group.Parent is Group)
            {
                if (group.ReferenceLocatable != null)
                {
                    if (!IsSecondTime)
                    {
                        return new LayoutResult(GetSize(locatables), false);
                    }
                    var c = group.ReferenceLocatable.Location;
                    var g = Group.FindGroup(group.Parent as Group, group.ReferenceLocatable);
                    if (g != null)
                    {
                        c = new Point(g.Location.X + c.X, g.Location.Y + c.Y);
                    }
                    angle = GetAngle(c, group.Location);
                }
            }
            var cellSize = Math.Max(ActualCellSize.Width, ActualCellSize.Height);
            var outerRadius = cellSize / 2 / Math.Sin(Math.PI / 4);
            var ls = locatables;
            ILocatable locatable1, locatable2;
            if (center != null)
            {
                ls = locatables.Where(l => l != center);
                var count = ls.Count();
                if (count == 0)
                {
                    return new LayoutResult(new Size(ActualCellSize.Width, ActualCellSize.Height));
                }
                Layout(ls, count, true, outerRadius, angle, out locatable1, out locatable2);
            }
            else
            {
                Layout(ls, ls.Count(), false, outerRadius, angle, out locatable1, out locatable2);
            }
            if (center != null)
            {
                var cx = locatable1.Location.X + (locatable2.Location.X - locatable1.Location.X) / 2;
                var cy = locatable1.Location.Y + (locatable2.Location.Y - locatable1.Location.Y) / 2;
                var t = Math.Atan(Math.Abs(cx) / Math.Abs(cy));
                var dx = outerRadius * CenterNodeDistanceRatio * Math.Sin(t);
                var dy = outerRadius * CenterNodeDistanceRatio * Math.Cos(t);
                double adx;
                double ady;
                if (cx > 0)
                {
                    adx = cx - dx;
                }
                else
                {
                    adx = cx + dx;
                }
                if (cy > 0)
                {
                    ady = cy - dy;
                }
                else
                {
                    ady = cy + dy;
                }
                center.Location = new Point(adx, ady);
            }
            var left = locatables.Min(l => l.Location.X) - outerRadius;
            var right = locatables.Max(l => l.Location.X) + outerRadius;
            var top = locatables.Min(l => l.Location.Y) - outerRadius;
            var bottom = locatables.Max(l => l.Location.Y) + outerRadius;
            var x = left + (right - left) / 2;
            var y = top + (bottom - top) / 2;
            var index = 0;
            locatables.ForEach(l =>
            {
                l.Location = new Point(l.Location.X - x, l.Location.Y - y);
                index++;
            });
            return new LayoutResult(new Size(right - left, bottom - top));
        }

        /// <summary>
        /// 返回角度
        /// </summary>
        /// <param name="referencePoint">参考点</param>
        /// <param name="location">位置</param>
        /// <returns>角度</returns>
        private double GetAngle(Point referencePoint, Point location)
        {
            return referencePoint != location ? Arithmetic.GetAngle(referencePoint, location) : Angle;
        }

        /// <summary>
        /// 返回大小
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        /// <returns>大小</returns>
        private Size GetSize(IEnumerable<ILocatable> locatables)
        {
            var cellSize = Math.Max(ActualCellSize.Width, ActualCellSize.Height);
            var outerRadius = cellSize / 2 / Math.Sin(Math.PI / 4);
            var sizes = new List<Size>();
            for (var i = 0; i < 360; i = i + 45)
            {
                ILocatable locatable1, locatable2;
                Layout(locatables, locatables.Count(), false, outerRadius, Angle, out locatable1, out locatable2);
                var left = locatables.Min(l => l.Location.X) - outerRadius;
                var right = locatables.Max(l => l.Location.X) + outerRadius;
                var top = locatables.Min(l => l.Location.Y) - outerRadius;
                var bottom = locatables.Max(l => l.Location.Y) + outerRadius;
                sizes.Add(new Size(right - left, bottom - top));
            }
            return new Size(sizes.Max(s => s.Width), sizes.Max(s => s.Height));
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        /// <param name="count">数目</param>
        /// <param name="hasCenter">是否有中心</param>
        /// <param name="outerRadius">外半径</param>
        /// <param name="angle">角度</param>
        /// <param name="locatable1">输出可定位1</param>
        /// <param name="locatable2">输出可定位2</param>
        private void Layout(IEnumerable<ILocatable> locatables, int count, bool hasCenter, double outerRadius, double angle, out ILocatable locatable1, out ILocatable locatable2)
        {
            locatable1 = locatables.First();
            locatable2 = locatables.Last();
            if (!hasCenter && count == 1)
            {
                locatables.First().Location = new Point(0, 0);
                return;
            }
            var firstCircleRadius = outerRadius * FirstCircleRadiusRatio;
            var firstCircleNodeCount = (int)Math.Floor(Math.PI * AngleRange / 360 / Arithmetic.GetPhi(outerRadius, outerRadius * ArcSpacingRatio, firstCircleRadius));
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
                var da = AngleRange / (nodeCountsResult[0] - 1);
                var angleRange = da * (index - 1);
                var a = da * (Math.PI / 180);
                index = 0;
                locatables.ForEach(l =>
                {
                    if (IsClockwise)
                    {
                        l.Location = new Point(_r * Math.Cos((angle - angleRange / 2) / 180 * Math.PI + a * index), _r * Math.Sin((angle - angleRange / 2) / 180 * Math.PI + a * index));
                    }
                    else
                    {
                        l.Location = new Point(_r * Math.Cos((angle + angleRange / 2) / 180 * Math.PI - a * index), radius * Math.Sin((angle + angleRange / 2) / 180 * Math.PI - a * index));
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
                nodeCountsResult[nodeCountsResult.Count - 1] = nodeCountsResult[nodeCountsResult.Count - 1] - (nodeCountsResult.Sum() - count);
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
            var c = nodeCountsResult[nodeCountsResultIndex];
            var circleIndex = 0;
            foreach (var l in locatables)
            {
                if (Math.Abs(index) >= c)
                {
                    nodeCountsResultIndex++;
                    c = nodeCountsResult[nodeCountsResultIndex];
                    r = finalRadiuss[nodeCountsResultIndex];
                    if (circleIndex == 0)
                    {
                        locatable2 = locatables.ElementAt(index - 1);
                    }
                    circleIndex++;
                    index = 0;
                }
                var a = AngleRange / (c - 1) * (Math.PI / 180);
                if (!IsContinuous)
                {
                    if (IsClockwise)
                    {
                        l.Location = new Point(r * Math.Cos((angle - AngleRange / 2) / 180 * Math.PI + a * index), r * Math.Sin((angle - AngleRange / 2) / 180 * Math.PI + a * index));
                    }
                    else
                    {
                        l.Location = new Point(r * Math.Cos((angle + AngleRange / 2) / 180 * Math.PI - a * index), r * Math.Sin((angle + AngleRange / 2) / 180 * Math.PI - a * index));
                    }
                }
                else
                {
                    if (IsClockwise)
                    {
                        if (circleIndex % 2 == 0)
                        {
                            l.Location = new Point(r * Math.Cos((angle - AngleRange / 2) / 180 * Math.PI + a * index), r * Math.Sin((angle - AngleRange / 2) / 180 * Math.PI + a * index));
                        }
                        else
                        {
                            l.Location = new Point(r * Math.Cos((angle + AngleRange / 2) / 180 * Math.PI - a * index), r * Math.Sin((angle + AngleRange / 2) / 180 * Math.PI - a * index));
                        }
                    }
                    else
                    {
                        if (circleIndex % 2 == 0)
                        {
                            l.Location = new Point(r * Math.Cos((angle + AngleRange / 2) / 180 * Math.PI - a * index), r * Math.Sin((angle + AngleRange / 2) / 180 * Math.PI - a * index));
                        }
                        else
                        {
                            l.Location = new Point(r * Math.Cos((angle - AngleRange / 2) / 180 * Math.PI + a * index), r * Math.Sin((angle - AngleRange / 2) / 180 * Math.PI + a * index));
                        }
                    }
                }
                index++;
            };
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
                FirstCircleRadiusRatio = c.FirstCircleRadiusRatio;
                CircleSpacingRatio = c.CircleSpacingRatio;
                Angle = c.Angle;
                AngleRange = c.AngleRange;
                IsClockwise = c.IsClockwise;
                IsContinuous = c.IsContinuous;
                CenterNodeDistanceRatio = c.CenterNodeDistanceRatio;
            }
            catch (Exception)
            {
                ArcSpacingRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_ARC_SPACING_RATIO_KEY);
                FirstCircleRadiusRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_FIRST_CIRCLE_RADIUS_RATIO_KEY);
                CircleSpacingRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_CIRCLE_SPACING_RATIO_KEY);
                Angle = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_ANGLE_KEY);
                AngleRange = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_ANGLE_RANGE_KEY);
                IsClockwise = ConfigContext.Current.GetBool(ConfigKeyInfo.SECTOR_IS_CLOCKWISE_KEY);
                IsContinuous = ConfigContext.Current.GetBool(ConfigKeyInfo.SECTOR_IS_CONTINUOUS_KEY);
                CenterNodeDistanceRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.SECTOR_CENTER_NODE_DISTANCE_RATIO_KEY);
            }
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="o">对象</param>
        public override void SetConfig(object o)
        {
            try
            {
                dynamic c = o;
                c.Angle = Angle;
            }
            catch (Exception)
            {

            }
        }

    }
}
