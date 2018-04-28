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
using System.Linq;
using Northwoods.GoXam;
using Northwoods.GoXam.Layout;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 最大链接数节点中心点提供者
    /// </summary>
    public class MaxLinkCountNodeCenterNodeProvider : ISpecialNodesProvider
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
            //找当前节点集合中连接最多的点
            var center = nodes.OrderByDescending(n => Math.Max(n.NodesInto.Count(_n => nodes.Contains(_n)), n.NodesOutOf.Count(_n => nodes.Contains(_n)))).FirstOrDefault();
            //如果当前的点是孤立点则认为没找到
            yield return center != null && Math.Max(center.NodesInto.Count(_n => nodes.Contains(_n)), center.NodesOutOf.Count(_n => nodes.Contains(_n))) > 0 ? center : null;
        }

    }
}
