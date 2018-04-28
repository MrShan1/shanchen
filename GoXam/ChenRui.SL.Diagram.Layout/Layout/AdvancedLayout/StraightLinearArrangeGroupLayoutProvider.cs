using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using Northwoods.GoXam;

namespace ChenRui.SL.Diagram.Layout
{
    public class StraightLinearArrangeGroupLayoutProvider : ArrangeGroupLayoutProvider
    {
        /// <summary>
        /// 是否是水平布局
        /// </summary>
        public bool IsHorizontal { get; set; }

        /// <summary>
        /// 组间距离
        /// </summary>
        public double LayerDistance { get; set; }

        /// <summary>
        /// 布局为直线
        /// </summary>
        public override void LayoutCore()
        {
            var xMove = Group.Items.Max(p => p.Width) / 2 + LayerDistance;
            var yMove = Group.Items.Max(p => p.Height) / 2 + LayerDistance;
            var x = 0.0;
            var y = 0.0;
            var locatables = new List<ILocatable>();
            Group.Items.ForEach(p =>
                {
                    if (IsHorizontal)
                    {
                        p.Location = new Point(x, y);
                        locatables.Add(p);
                        x += xMove;
                    }
                    else
                    {
                        p.Location = new Point(x, y);
                        locatables.Add(p);
                        y += yMove;
                    }
                });
        }
    }
}
