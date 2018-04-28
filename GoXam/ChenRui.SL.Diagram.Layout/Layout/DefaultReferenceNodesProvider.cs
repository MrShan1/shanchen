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
    /// 默认参考点提供者
    /// </summary>
    public class DefaultReferenceNodesProvider : IReferenceNodesProvider
    {
        /// <summary>
        /// 布局
        /// </summary>
        public DiagramLayout Layout { get; set; }

        /// <summary>
        /// 是否有参考点
        /// </summary>
        public bool HasReferenceNodes { get { return false; } }

        /// <summary>
        /// 返回参考点集合
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Node> GetReferenceNodes()
        {
            return null;
        }

        /// <summary>
        /// 是否需要处理参考点
        /// </summary>
        public bool NeedHandleReferenceNodes { get { return false; } }

        /// <summary>
        /// 处理参考点
        /// </summary>
        public void HandleReferenceNodes()
        {

        }

    }
}
