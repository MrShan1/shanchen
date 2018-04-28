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

using System;
using System.Collections.Generic;
using Northwoods.GoXam;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 需要还原接口
    /// </summary>
    public interface INeedRevert
    {
        /// <summary>
        /// 还原动作
        /// </summary>
        Action<IEnumerable<Node>> Revert { get; set; }

    }
}
