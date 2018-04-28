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
    /// 组
    /// </summary>
    public class Group : ILocatable
    {
        /// <summary>
        /// 位置
        /// </summary>
        public Point Location { get; set; }

        /// <summary>
        /// 宽
        /// </summary>
        public double Width { get; set; }

        /// <summary>
        /// 高
        /// </summary>
        public double Height { get; set; }

        /// <summary>
        /// 参考可定位
        /// </summary>
        public ILocatable ReferenceLocatable { get; set; }

        /// <summary>
        /// 参考点
        /// </summary>
        public Point? ReferencePoint { get; set; }

        /// <summary>
        /// 中心
        /// </summary>
        public ILocatable Center { get; set; }

        /// <summary>
        /// 父
        /// </summary>
        public object Parent { get; set; }

        /// <summary>
        /// 项集合
        /// </summary>
        public IEnumerable<ILocatable> Items { get; set; }

        /// <summary>
        /// 组布局提供者
        /// </summary>
        public IGroupLayoutProvider GroupLayoutProvider { get; set; }

        /// <summary>
        /// 组转换提供者
        /// </summary>
        public IGroupTransformProvider GroupTransformProvider { get; set; }

        /// <summary>
        /// 返回根父
        /// </summary>
        /// <returns>对象</returns>
        public object GetRootParent()
        {
            var parent = Parent;
            while (true)
            {
                var group = parent as Group;
                if (group != null)
                {
                    parent = group.Parent;
                }
                else
                {
                    return parent;
                }
            }
        }

        /// <summary>
        /// 查找组
        /// </summary>
        /// <param name="group">组</param>
        /// <param name="locatable">可定位</param>
        /// <returns>组</returns>
        public static Group FindGroup(Group group, ILocatable locatable)
        {
            if (group == null) return null;
            if (group.Items.Contains(locatable))
            {
                return group;
            }
            foreach (var i in group.Items)
            {
                var g = i as Group;
                if (FindGroup(g, locatable) != null)
                {
                    return g;
                }
            }
            return null;
        }

    }
}
