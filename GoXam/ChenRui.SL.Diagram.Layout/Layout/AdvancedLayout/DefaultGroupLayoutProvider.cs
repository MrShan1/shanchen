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

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 默认组布局提供者
    /// </summary>
    public class DefaultGroupLayoutProvider : IGroupLayoutProvider
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
        /// 布局
        /// </summary>
        /// <param name="isSecondTime">是否为第二次</param>
        /// <returns>是否布局</returns>
        public virtual bool Layout(bool isSecondTime)
        {
            if (isSecondTime) return true;
            Group.Width = Group.Items.Max(i => i.Width);
            Group.Height = Group.Items.Max(i => i.Height);
            Group.Items.ForEach(i => i.Location = new Point(0, 0));
            return true;
        }

    }
}
