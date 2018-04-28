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

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 支持布局配置
    /// </summary>
    public interface ILayoutConfig
    {
        /// <summary>
        /// 参数
        /// </summary>
        ICollection<string> Parameters { get; set; }

    }
}
