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
    /// 组转换提供者
    /// </summary>
    public interface IGroupTransformProvider
    {
        /// <summary>
        /// 组
        /// </summary>
        Group Group { set; get; }

        /// <summary>
        /// 转换
        /// </summary>
        void Transform();

    }
}
