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
using ChenRui.SL.Common.Arithmetic;
using ChenRui.SL.Configuration;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 螺旋布局算法
    /// </summary>
    public class HelixLayoutArithmetic : LayoutArithmetic
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
        /// 起始角度
        /// </summary>
        public double StartAngle { get; set; }

        /// <summary>
        /// 角度增速
        /// </summary>
        public int AngelSpeed { get; set; }

        /// <summary>
        /// 初始半径增速
        /// </summary>
        public double RadiusInit { get; set; }

        /// <summary>
        /// 半径增速指数
        /// </summary>
        public double RadiusPow { get; set; }

        /// <summary>
        /// 是否是顺时针
        /// </summary>
        public bool IsClockwise { get; set; }

        /// <summary>
        /// 布局核心
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        /// <param name="center">中心</param>
        /// <returns>布局结果</returns>
        protected override LayoutResult LayoutCore(IEnumerable<ILocatable> locatables, ILocatable center)
        {
            var cellSize = Math.Max(ActualCellSize.Width, ActualCellSize.Height);
            var outerRadius = cellSize / 2 / Math.Sin(Math.PI / 4);
            if (center != null)
            {
                center.Location = new Point(0, 0);
                var ls = locatables.Where(l => l != center);
                var count = ls.Count();
                if (count == 0)
                {
                    return new LayoutResult(new Size(ActualCellSize.Width, ActualCellSize.Height));
                }
                Layout(ls, count, true, outerRadius);
            }
            else
            {
                Layout(locatables, locatables.Count(), false, outerRadius);
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
        /// 布局
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        /// <param name="count">数目</param>
        /// <param name="hasCenter">是否有中心</param>
        /// <param name="outerRadius">外半径</param>
        private void Layout(IEnumerable<ILocatable> locatables, int count, bool hasCenter, double outerRadius)
        {
            if (!hasCenter && count == 1)
            {
                locatables.First().Location = new Point(0, 0);
                return;
            }
            var firstCircleNodeCount = FirstCircleNodeCount < 4 ? 4 : FirstCircleNodeCount;
            var index = 0;
            var nodeCount = firstCircleNodeCount;
            var s = 0;
            var d = IsClockwise ? 1 : -1;
            locatables.ForEach(l =>
            {
                if (hasCenter) s += AngelSpeed;
                //radius = radius + 15 * Math.Pow(Math.Abs(index), 0.2);
                var radius = RadiusInit * Math.Pow(s, RadiusPow);
                s += AngelSpeed;

                if (Math.Abs(index) >= nodeCount)
                {
                    //radius = radius + 2 * outerRadius + outerRadius * CircleSpacingRatio;
                    nodeCount = (int)Math.Floor(Math.PI / Arithmetic.GetPhi(outerRadius, outerRadius * ArcSpacingRatio, radius));
                    index = 0;
                }
                l.Location = new Point(radius * Math.Cos(StartAngle / 180 * Math.PI + 2 * Math.PI / nodeCount * index), radius * Math.Sin(StartAngle / 180 * Math.PI + 2 * Math.PI / nodeCount * index));

                index = index + d;
            });
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
                StartAngle = c.StartAngle;
                AngelSpeed = c.AngelSpeed;
                RadiusInit = c.RadiusInit;
                RadiusPow = c.RadiusPow;
                IsClockwise = c.IsClockwise;
            }
            catch (Exception)
            {
                ArcSpacingRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.HELIX_ARC_SPACING_RATIO_KEY);
                FirstCircleNodeCount = ConfigContext.Current.GetInt(ConfigKeyInfo.HELIX_FIRST_CIRCLE_NODE_COUNT_KEY);
                StartAngle = ConfigContext.Current.GetDouble(ConfigKeyInfo.HELIX_START_ANGLE_KEY);
                AngelSpeed = ConfigContext.Current.GetInt(ConfigKeyInfo.HELIX_ANGLE_SPEED_KEY);
                RadiusInit = ConfigContext.Current.GetDouble(ConfigKeyInfo.HELIX_RADIUS_INIT_KEY);
                RadiusPow = ConfigContext.Current.GetDouble(ConfigKeyInfo.HELIX_RADIUS_POW_KEY);
                IsClockwise = ConfigContext.Current.GetBool(ConfigKeyInfo.HELIX_IS_CLOCKWISE_KEY);
            }
        }

    }
}
