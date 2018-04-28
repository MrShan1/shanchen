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
    /// 参考点提供者接口
    /// </summary>
    public interface IReferenceNodesProvider
    {
        /// <summary>
        /// 布局
        /// </summary>
        DiagramLayout Layout { get; set; }

        /// <summary>
        /// 是否有参考点
        /// </summary>
        bool HasReferenceNodes { get; }

        /// <summary>
        /// 返回参考点集合
        /// </summary>
        /// <returns></returns>
        IEnumerable<Node> GetReferenceNodes();

        /// <summary>
        /// 是否需要处理参考点
        /// </summary>
        bool NeedHandleReferenceNodes { get; }

        /// <summary>
        /// 处理参考点
        /// </summary>
        void HandleReferenceNodes();

    }
}
