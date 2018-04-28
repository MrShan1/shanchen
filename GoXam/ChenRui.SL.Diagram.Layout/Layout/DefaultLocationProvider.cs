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
using System.Windows;
using Northwoods.GoXam;
using Northwoods.GoXam.Layout;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 默认位置提供者
    /// </summary>
    public class DefaultLocationProvider : ILocationProvider
    {
        /// <summary>
        /// 布局
        /// </summary>
        public DiagramLayout Layout { get; set; }

        /// <summary>
        /// 参考点
        /// </summary>
        public Point? ReferencePoint { get; set; }

        /// <summary>
        /// 是否有位置
        /// </summary>
        public bool HasLocation { get { return true; } }

        /// <summary>
        /// 位置
        /// </summary>
        public Point Location { get; set; }

        /// <summary>
        /// 位置是否是中心
        /// </summary>
        public bool IsLocationCenter { get; set; }

        /// <summary>
        /// 返回位置
        /// </summary>
        /// <param name="size">大小</param>
        /// <param name="nodes">节点</param>
        /// <param name="links">链接</param>
        /// <param name="referencePointHasNode">参考点是否有点</param>
        /// <returns>位置</returns>
        public Point GetLocation(Size size, IEnumerable<Node> nodes, IEnumerable<Link> links, bool referencePointHasNode)
        {
            return new Point(double.NaN, double.NaN);
        }

        /// <summary>
        /// 构造函数
        /// </summary>
        public DefaultLocationProvider()
        {
            IsLocationCenter = true;
        }

    }
}
