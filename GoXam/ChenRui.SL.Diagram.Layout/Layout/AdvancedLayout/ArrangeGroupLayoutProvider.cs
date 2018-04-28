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

using System.Collections.Generic;
using System.Linq;
using System.Windows;
using Northwoods.GoXam;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 排列组布局提供者
    /// </summary>
    public abstract class ArrangeGroupLayoutProvider : IGroupLayoutProvider
    {
        /// <summary>
        /// 组
        /// </summary>
        public Group Group { set; get; }

        /// <summary>
        /// 位置
        /// </summary>
        public Point? Location { get; set; }

        /// <summary>
        /// 内边距
        /// </summary>
        public Size Padding { get; set; }

        protected const double d = 50;

        /// <summary>
        /// 构造函数
        /// </summary>
        protected ArrangeGroupLayoutProvider()
        {
            Padding = new Size(100, 100);
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="isSecondTime">是否为第二次</param>
        /// <returns>是否布局</returns>
        public virtual bool Layout(bool isSecondTime)
        {
            if (isSecondTime) return true;
            LayoutCore();
            //计算组的长宽
            var x2 = Group.Items.Max(i => i.Location.X + i.Width / 2);
            var x1 = Group.Items.Min(i => i.Location.X - i.Width / 2);
            var y2 = Group.Items.Max(i => i.Location.Y + i.Height / 2);
            var y1 = Group.Items.Min(i => i.Location.Y - i.Height / 2);
            Group.Width = x2 - x1;
            Group.Height = y2 - y1;
            //计算组中心
            var x = Group.Width / 2 + x1;
            var y = Group.Height / 2 + y1;
            //中心点移动到坐标系原点
            Group.Items.ForEach(i => i.Location = new Point(i.Location.X - x, i.Location.Y - y));
            return true;
        }

        /// <summary>
        /// 布局核心
        /// </summary>
        public abstract void LayoutCore();

        /// <summary>
        /// 碰撞测试
        /// </summary>
        /// <param name="rect">矩形</param>
        /// <param name="nodes">可定位集合</param>
        /// <returns>是否碰撞</returns>
        protected static bool HitTest(Rect rect, IEnumerable<ILocatable> locatables)
        {
            foreach (var l in locatables)
            {
                var r = new Rect(rect.X, rect.Y, rect.Width, rect.Height);
                r.Intersect(new Rect(l.Location.X - (l.Width + 200) / 2, l.Location.Y - (l.Height + 200) / 2, l.Width + 200, l.Height + 200));
                if (!r.IsEmpty) return true;
            }
            return false;
        }
    }
}
