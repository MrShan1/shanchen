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
    /// 布局算法接口
    /// </summary>
    public interface ILayoutArithmetic
    {
        /// <summary>
        /// 参数
        /// </summary>
        object Parameter { set; get; }

        /// <summary>
        /// 位置
        /// </summary>
        Point? Location { get; set; }

        /// <summary>
        /// 是否为第二次
        /// </summary>
        bool IsSecondTime { get; set; }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        /// <param name="center">中心</param>
        /// <returns>布局结果</returns>
        LayoutResult Layout(IEnumerable<ILocatable> locatables, ILocatable center);

        /// <summary>
        /// 获取配置
        /// </summary>
        /// <param name="o">对象</param>
        void GetConfig(object o);

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="o">对象</param>
        void SetConfig(object o);

    }
}
