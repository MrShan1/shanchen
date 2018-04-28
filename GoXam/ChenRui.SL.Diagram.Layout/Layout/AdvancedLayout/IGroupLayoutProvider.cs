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

using System.Windows;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 组布局提供者
    /// </summary>
    public interface IGroupLayoutProvider
    {
        /// <summary>
        /// 组
        /// </summary>
        Group Group { set; get; }

        /// <summary>
        /// 位置
        /// </summary>
        Point? Location { get; set; }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="isSecondTime">是否为第二次</param>
        /// <returns>是否布局</returns>
        bool Layout(bool isSecondTime);

    }
}
