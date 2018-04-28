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
    /// 组提供者工厂
    /// </summary>
    public interface IGroupProviderFactory
    {
        /// <summary>
        /// 布局标识
        /// </summary>
        string LayoutId { get; set; }

        /// <summary>
        /// 参数
        /// </summary>
        ICollection<string> Parameters { get; set; }

        /// <summary>
        /// 返回组提供者
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        /// <returns>组提供者</returns>
        IGroupProvider GetGroupProvider(IEnumerable<NodeHost> nodes, IEnumerable<Link> links);

    }
}
