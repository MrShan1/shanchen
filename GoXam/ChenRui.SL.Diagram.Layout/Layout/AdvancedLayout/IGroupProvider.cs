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
    /// 组提供者
    /// </summary>
    public interface IGroupProvider
    {
        /// <summary>
        /// 布局
        /// </summary>
        AdvancedLayout Layout { set; get; }

        /// <summary>
        /// 返回组
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        /// <returns>组</returns>
        Group GetGroup(IEnumerable<NodeHost> nodes, IEnumerable<Link> links);

    }
}
