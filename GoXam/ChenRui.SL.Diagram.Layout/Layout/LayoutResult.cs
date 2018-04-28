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

using System.Windows;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 布局结果
    /// </summary>
    public class LayoutResult
    {
        /// <summary>
        /// 结果大小
        /// </summary>
        public Size ResultSize { get; set; }

        /// <summary>
        /// 是否仅为获取大小,真 表示在估算
        /// </summary>
        public bool IsOnlyGetSize { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="resultSize">结果大小</param>
        public LayoutResult(Size resultSize)
        {
            ResultSize = resultSize;
        }

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="resultSize">结果大小</param>
        /// <param name="isOnlyGetSize">是否仅为获取大小</param>
        public LayoutResult(Size resultSize, bool isOnlyGetSize)
        {
            ResultSize = resultSize;
            IsOnlyGetSize = isOnlyGetSize;
        }

    }
}
