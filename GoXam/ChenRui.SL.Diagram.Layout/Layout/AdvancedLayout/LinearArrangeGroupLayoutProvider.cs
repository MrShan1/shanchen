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

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 线性排列组布局提供者
    /// </summary>
    public class LinearArrangeGroupLayoutProvider : ArrangeGroupLayoutProvider
    {
        /// <summary>
        /// 布局核心
        /// </summary>
        public override void LayoutCore()
        {
            var sumWidth = Group.Items.Sum(i => i.Width + Padding.Width * 2);
            var maxWidth = Group.Items.Max(i => i.Width + Padding.Width * 2);
            var sumHeight = Group.Items.Sum(i => i.Height + Padding.Height * 2);
            var maxHeight = Group.Items.Max(i => i.Height + Padding.Height * 2);
            var length = Math.Sqrt((sumWidth * maxHeight + sumHeight * maxWidth) / 2);
            var x = 0.0;
            var y = 0.0;
            var locatables = new List<ILocatable>();
            Group.Items.ForEach(i =>
            {
                while (true)
                {
                    var rect = new Rect(x - (i.Width + Padding.Width * 2) / 2, y - (i.Height + Padding.Height * 2) / 2, i.Width + Padding.Width * 2, i.Height + Padding.Height * 2);
                    if (!HitTest(rect, locatables))
                    {
                        i.Location = new Point(x, y);
                        locatables.Add(i);
                        return;
                    }
                    x += d;
                    if (x + (i.Width + Padding.Width * 2) / 2 > length)
                    {
                        x = 0;
                        y += d;
                    }
                }
            });
        }

    }
}
