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
    /// 单参考点提供者
    /// </summary>
    public class SingleReferenceNodesProvider : IReferenceNodesProvider
    {
        /// <summary>
        /// 节点
        /// </summary>
        private Node node;

        /// <summary>
        /// 布局
        /// </summary>
        public DiagramLayout Layout { get; set; }

        /// <summary>
        /// 是否有参考点
        /// </summary>
        public bool HasReferenceNodes { get { return true; } }

        /// <summary>
        /// 返回参考点集合
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Node> GetReferenceNodes()
        {
            yield return node;
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

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="node"></param>
        public SingleReferenceNodesProvider(Node node)
        {
            this.node = node;
        }

    }
}
