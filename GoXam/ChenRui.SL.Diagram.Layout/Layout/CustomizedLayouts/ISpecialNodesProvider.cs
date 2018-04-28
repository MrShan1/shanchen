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
using Northwoods.GoXam;
using Northwoods.GoXam.Layout;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 特殊点提供者
    /// </summary>
    public interface ISpecialNodesProvider
    {
        /// <summary>
        /// 布局
        /// </summary>
        DiagramLayout Layout { get; set; }

        /// <summary>
        /// 返回特殊点集合
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <returns>特殊点集合</returns>
        IEnumerable<Node> GetSpecialNodes(IEnumerable<Node> nodes);

    }
}
