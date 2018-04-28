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
    /// 原型布局算法
    /// </summary>
    public class CircleLayoutArithmetic : LayoutArithmetic
    {
        /// <summary>
        /// 弧间距比例
        /// </summary>
        public double ArcSpacingRatio { get; set; }

        /// <summary>
        /// 半径
        /// </summary>
        public double Radius { get; set; }

        /// <summary>
        /// 偏率
        /// </summary>
        public double AspectRatio { get; set; }

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
        /// <param name="locatables">可定位集合</param>
        /// <param name="count">数目</param>
        /// <param name="hasCenter">是否有中心</param>
        /// <param name="allLocatables">全部可定位集合</param>
        /// <returns>大小</returns>
        private Size Layout(IEnumerable<ILocatable> locatables, int count, bool hasCenter, IEnumerable<ILocatable> allLocatables)
        {
            //R*(phi-2theta)=d/2
            //(r/2)/R=sin(theta)
            if (!hasCenter && count == 1)
            {
                locatables.First().Location = new Point(0, 0);
                return new Size(ActualCellSize.Width, ActualCellSize.Height);
            }
            var cellSize = Math.Max(ActualCellSize.Width, ActualCellSize.Height);
            var outerRadius = cellSize / 2 / Math.Sin(Math.PI / 4);
            var radius = Radius;
            if (double.IsNaN(Radius))
            {
                //var r = (outerRadius + Distance / 2) / Math.Sin(Math.PI / count);
                radius = Arithmetic.GetR(outerRadius, outerRadius * ArcSpacingRatio, Math.PI / count);
                if (hasCenter && radius < outerRadius * 2 + outerRadius * 2 * CenterNodeDistanceRatio)
                {
                    radius = outerRadius * 2 + outerRadius * 2 * CenterNodeDistanceRatio;
                }
                if (!hasCenter && count == 2)
                {
                    radius = outerRadius;
                }
            }
            var index = 0;
            var d = IsClockwise ? 1 : -1;
            locatables.ForEach(l =>
            {
                l.Location = new Point(radius * Math.Cos(StartAngle / 180 * Math.PI + 2 * Math.PI / count * index), radius * AspectRatio * Math.Sin(StartAngle / 180 * Math.PI + 2 * Math.PI / count * index));
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
                Radius = c.Radius;
                AspectRatio = c.AspectRatio;
                StartAngle = c.StartAngle;
                IsClockwise = c.IsClockwise;
                CenterNodeDistanceRatio = c.CenterNodeDistanceRatio;
            }
            catch (Exception)
            {
                ArcSpacingRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.CIRCLE_ARC_SPACING_RATIO_KEY);
                Radius = ConfigContext.Current.GetBool(ConfigKeyInfo.CIRCLE_FIX_RADIUS_KEY) ? ConfigContext.Current.GetDouble(ConfigKeyInfo.CIRCLE_RADIUS_KEY) : double.NaN; ;
                AspectRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.CIRCLE_ASPECT_RATIO_KEY);
                StartAngle = ConfigContext.Current.GetDouble(ConfigKeyInfo.CIRCLE_START_ANGLE_KEY);
                IsClockwise = ConfigContext.Current.GetBool(ConfigKeyInfo.CIRCLE_IS_CLOCKWISE_KEY);
                CenterNodeDistanceRatio = ConfigContext.Current.GetDouble(ConfigKeyInfo.CIRCLE_CENTER_NODE_DISTANCE_RATIO_KEY);
            }
        }

    }
}
