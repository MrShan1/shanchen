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

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 模型转换
    /// </summary>
    public interface IModelTransform
    {
        /// <summary>
        /// 转换
        /// </summary>
        /// <param name="diagram">画板</param>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        void Transform(Northwoods.GoXam.Diagram diagram, IEnumerable<Node> nodes, IEnumerable<Link> links);

        /// <summary>
        /// 还原
        /// </summary>
        /// <param name="diagram">画板</param>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        void Revert(Northwoods.GoXam.Diagram diagram, IEnumerable<Node> nodes, IEnumerable<Link> links);

    }
}
