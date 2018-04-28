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

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 垂直布局算法
    /// </summary>
    public class VerticalLayoutArithmetic : LayoutArithmetic
    {
        /// <summary>
        /// 中心点是否在上边
        /// </summary>
        public bool IsCenterNodeLeft { get; set; }

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
                return new LayoutResult(LayoutWithCenter(center, locatables.Where(l => l != center)));
            }
            return new LayoutResult(Layout(locatables));
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        /// <returns>大小</returns>
        private Size Layout(IEnumerable<ILocatable> locatables)
        {
            var count = locatables.Count();
            var size = new Size(ActualCellSize.Width, count * ActualCellSize.Height + (count - 1) * Spacing.Height);
            var index = 0;
            locatables.ForEach(l =>
            {
                l.Location = new Point(0, ActualCellSize.Height / 2 + (ActualCellSize.Height + Spacing.Height) * index - size.Height / 2);
                index++;
            });
            return size;
        }

        /// <summary>
        /// 有中心点时布局
        /// </summary>
        /// <param name="center">中心</param>
        /// <param name="locatables">可定位集合</param>
        /// <returns>大小</returns>
        private Size LayoutWithCenter(ILocatable center, IEnumerable<ILocatable> locatables)
        {
            var count = locatables.Count();
            if (count == 0)
            {
                center.Location = new Point(0, 0);
                return new Size(ActualCellSize.Width, ActualCellSize.Height);
            }
            center.Location = new Point((Spacing.Width / 2 + ActualCellSize.Width / 2) * (IsCenterNodeLeft ? -1 : 1), 0);
            var size = new Size(ActualCellSize.Width * 2 + Spacing.Width, count * ActualCellSize.Height + (count - 1) * Spacing.Height);
            var index = 0;
            locatables.ForEach(l =>
            {
                l.Location = new Point((Spacing.Width / 2 + ActualCellSize.Width / 2) * (IsCenterNodeLeft ? 1 : -1), ActualCellSize.Height / 2 + (ActualCellSize.Height + Spacing.Height) * index - size.Height / 2);
                index++;
            });
            return size;
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
                IsCenterNodeLeft = c.IsCenterNodeLeft;
            }
            catch (Exception)
            {
                Spacing = new Size(ConfigContext.Current.GetDouble(ConfigKeyInfo.VERTICAL_HORIZONTAL_SPACING_KEY), ConfigContext.Current.GetDouble(ConfigKeyInfo.VERTICAL_VERTICAL_SPACING_KEY));
                IsCenterNodeLeft = ConfigContext.Current.GetBool(ConfigKeyInfo.IS_CENTER_NODE_LEFT_KEY);
            }
        }

    }
}
