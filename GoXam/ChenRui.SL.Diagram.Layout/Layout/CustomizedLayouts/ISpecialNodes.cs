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

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 支持特殊点
    /// </summary>
    public interface ISpecialNodes
    {
        /// <summary>
        /// 特殊点提供者
        /// </summary>
        ISpecialNodesProvider SpecialNodesProvider { get; set; }

    }
}
