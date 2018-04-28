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
    /// 位置提供者接口
    /// </summary>
    public interface ILocationProvider
    {
        /// <summary>
        /// 布局
        /// </summary>
        DiagramLayout Layout { set; get; }

        /// <summary>
        /// 参考点
        /// </summary>
        Point? ReferencePoint { get; set; }

        /// <summary>
        /// 有位置
        /// </summary>
        bool HasLocation { get; }

        /// <summary>
        /// 位置
        /// </summary>
        Point Location { get; }

        /// <summary>
        /// 位置是否是中心
        /// </summary>
        bool IsLocationCenter { get; }

        /// <summary>
        /// 返回位置
        /// </summary>
        /// <param name="size">大小</param>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        /// <param name="referencePointHasNode">参考点有节点</param>
        /// <returns>点</returns>
        Point GetLocation(Size size, IEnumerable<Node> nodes, IEnumerable<Link> links, bool referencePointHasNode);

    }
}
