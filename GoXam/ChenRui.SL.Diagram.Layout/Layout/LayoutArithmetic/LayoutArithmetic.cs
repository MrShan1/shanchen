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
using System.Linq;
using System.Windows;
using Northwoods.GoXam;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 布局算法接口
    /// </summary>
    public class LayoutArithmetic : ILayoutArithmetic
    {
        /// <summary>
        /// 参数
        /// </summary>
        public object Parameter { set; get; }

        /// <summary>
        /// 单元大小
        /// </summary>
        public Size CellSize { get; set; }

        /// <summary>
        /// 实际单元大小
        /// </summary>
        public Size ActualCellSize { get; protected set; }

        /// <summary>
        /// 间距
        /// </summary>
        public Size Spacing { get; set; }

        /// <summary>
        /// 位置
        /// </summary>
        public Point? Location { get; set; }

        /// <summary>
        /// 是否为第二次
        /// </summary>
        public bool IsSecondTime { get; set; }

        /// <summary>
        /// 返回实际单元大小，如果单元格大小不为空则使用单元格大小
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        private void GetActualCellSize(IEnumerable<ILocatable> locatables)
        {
            if (double.IsNaN(CellSize.Width) || double.IsNaN(CellSize.Height))
            {
                ActualCellSize = new Size(locatables.Max(n => n.Width), locatables.Max(n => n.Height));
            }
            else
            {
                ActualCellSize = CellSize;
            }
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        /// <param name="center">中心</param>
        /// <returns>布局结果</returns>
        public LayoutResult Layout(IEnumerable<ILocatable> locatables, ILocatable center)
        {
            if (IsSecondTime && !NeedSecondTimeLayout())
            {
                return null;
            }
            GetActualCellSize(locatables);
            return LayoutCore(locatables, center);
        }

        /// <summary>
        /// 是否需要二次布局
        /// </summary>
        /// <returns></returns>
        protected virtual bool NeedSecondTimeLayout()
        {
            return false;
        }

        /// <summary>
        /// 布局核心
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        /// <param name="center">中心</param>
        /// <returns>布局结果</returns>
        protected virtual LayoutResult LayoutCore(IEnumerable<ILocatable> locatables, ILocatable center)
        {
            return new LayoutResult(new Size(0, 0));
        }

        /// <summary>
        /// 获取配置
        /// </summary>
        /// <param name="o">对象</param>
        public virtual void GetConfig(object o)
        {
            dynamic c = o;
            CellSize = c.CellSize;
            Spacing = c.Spacing;
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="o"></param>
        public virtual void SetConfig(object o)
        {

        }

    }
}
