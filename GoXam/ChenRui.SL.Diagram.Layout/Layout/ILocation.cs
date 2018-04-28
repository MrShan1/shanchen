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
    /// 支持定位
    /// </summary>
    public interface ILocation
    {
        /// <summary>
        /// 位置提供者
        /// </summary>
        ILocationProvider LocationProvider { get; set; }

    }
}
