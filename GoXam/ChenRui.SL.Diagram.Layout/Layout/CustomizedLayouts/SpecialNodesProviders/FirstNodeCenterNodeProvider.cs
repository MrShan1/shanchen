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
using Northwoods.GoXam;
using Northwoods.GoXam.Layout;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 第一个点中心点提供者
    /// </summary>
    public class FirstNodeCenterNodeProvider : ISpecialNodesProvider
    {
        /// <summary>
        /// 布局
        /// </summary>
        public DiagramLayout Layout { get; set; }

        /// <summary>
        /// 返回特殊点集合
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <returns>特殊点集合</returns>
        public IEnumerable<Node> GetSpecialNodes(IEnumerable<Node> nodes)
        {
            var node = nodes.FirstOrDefault();
            if (node != null)
            {
                yield return node;
            }
        }

    }
}
