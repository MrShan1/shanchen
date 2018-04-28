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
using System.Windows;
using Northwoods.GoXam;
using ChenRui.SL.Common.Arithmetic;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 径向排列组布局提供者
    /// </summary>
    public class RadialArrangeGroupLayoutProvider : ArrangeGroupLayoutProvider
    {
        /// <summary>
        /// 布局核心
        /// </summary>
        public override void LayoutCore()
        {
            var locatables = new List<ILocatable>();
            Group.Items.ForEach(i =>
            {
                var center = new Point(0, 0);
                var group = i as Group;
                if (group != null && group.ReferenceLocatable != null)
                {
                    center = group.ReferenceLocatable.Location;
                    var g = Find(Group, group.ReferenceLocatable);
                    while (g != null && g != Group)
                    {
                        center = new Point(center.X + g.Location.X, center.Y + g.Location.Y);
                        g = g.Parent as Group;
                    }
                }
                var c = new Point(0, 0);
                var startAngle = c != center ? Arithmetic.GetAngle(c, center) - 180 : 0;
                var r0 = group != null && group.ReferencePoint != null ? Math.Min(i.Width + Padding.Width * 2, i.Height + Padding.Height * 2) / 2 : 0;
                var index = 1;
                while (true)
                {
                    var r = r0 + (index - 1) * d;
                    var da = d / (2 * Math.PI * r) * 360;
                    for (var a = startAngle; a < startAngle + 360; a = a + da)
                    {
                        var p = new Point(center.X + r * Math.Cos(a / 180 * Math.PI), center.Y + r * Math.Sin(a / 180 * Math.PI));
                        var rect = new Rect(p.X - (i.Width + Padding.Width * 2) / 2, p.Y - (i.Height + Padding.Height * 2) / 2, i.Width + Padding.Width * 2, i.Height + Padding.Height * 2);
                        if (!HitTest(rect, locatables))
                        {
                            i.Location = p;
                            locatables.Add(i);
                            return;
                        }
                    }
                    index++;
                }
            });
        }

        /// <summary>
        /// 查找
        /// </summary>
        /// <param name="group">组</param>
        /// <param name="locatable">可定位</param>
        /// <returns>组</returns>
        private Group Find(Group group, ILocatable locatable)
        {
            foreach (var i in group.Items)
            {
                if (i == locatable)
                {
                    return group;
                }
                var g = i as Group;
                if (g != null && g.Items != null)
                {
                    var r = Find(g, locatable);
                    if (r != null)
                    {
                        return r;
                    }
                }
            }
            return null;
        }

    }
}
