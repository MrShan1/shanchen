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
    /// 水平布局算法
    /// </summary>
    public class HorizontalLayoutArithmetic : LayoutArithmetic
    {
        /// <summary>
        /// 中心点是否在上边
        /// </summary>
        public bool IsCenterNodeTop { get; set; }

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
            var size = new Size(count * ActualCellSize.Width + (count - 1) * Spacing.Width, ActualCellSize.Height);
            var index = 0;
            locatables.ForEach(l =>
            {
                l.Location = new Point(ActualCellSize.Width / 2 + (ActualCellSize.Width + Spacing.Width) * index - size.Width / 2, 0);
                index++;
            });
            return size;
        }

        /// <summary>
        /// 有中心时布局
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
            center.Location = new Point(0, (Spacing.Height / 2 + ActualCellSize.Height / 2) * (IsCenterNodeTop ? -1 : 1));
            var size = new Size(count * ActualCellSize.Width + (count - 1) * Spacing.Width, ActualCellSize.Height * 2 + Spacing.Height);
            var index = 0;
            locatables.ForEach(l =>
            {
                l.Location = new Point(ActualCellSize.Width / 2 + (ActualCellSize.Width + Spacing.Width) * index - size.Width / 2, (Spacing.Height / 2 + ActualCellSize.Height / 2) * (IsCenterNodeTop ? 1 : -1));
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
                IsCenterNodeTop = c.IsCenterNodeTop;
            }
            catch (Exception)
            {
                Spacing = new Size(ConfigContext.Current.GetDouble(ConfigKeyInfo.HORIZONTAL_HORIZONTAL_SPACING_KEY), ConfigContext.Current.GetDouble(ConfigKeyInfo.HORIZONTAL_VERTICAL_SPACING_KEY));
                IsCenterNodeTop = ConfigContext.Current.GetBool(ConfigKeyInfo.IS_CENTER_NODE_TOP_KEY);
            }

        }

    }
}
