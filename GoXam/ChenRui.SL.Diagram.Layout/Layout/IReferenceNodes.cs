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
    /// 支持参考点接口
    /// </summary>
    public interface IReferenceNodes
    {
        /// <summary>
        /// 参考点提供者
        /// </summary>
        IReferenceNodesProvider ReferenceNodesProvider { get; set; }

    }
}
