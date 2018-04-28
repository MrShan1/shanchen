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

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 节点宿主
    /// </summary>
    public class NodeHost : ILocatable
    {
        /// <summary>
        /// 位置
        /// </summary>
        public Point Location { get; set; }

        /// <summary>
        /// 宽
        /// </summary>
        public double Width
        {
            get
            {
                return Node == null ? 0.0 : Node.Width;
            }
        }

        /// <summary>
        /// 高
        /// </summary>
        public double Height
        {
            get
            {
                return Node == null ? 0.0 : Node.Height;
            }
        }

        /// <summary>
        /// 节点
        /// </summary>
        public Node Node { get; private set; }

        /// <summary>
        /// 索引
        /// </summary>
        public int Index { get; set; }

        /// <summary>
        /// 内连接节点集合
        /// </summary>
        public ICollection<NodeHost> NodesInnerConnected { get; set; }

        /// <summary>
        /// 外连接节点集合
        /// </summary>
        public ICollection<Node> NodesOuterConnected { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="node"></param>
        public NodeHost(Node node)
        {
            Node = node;
        }

    }
}
