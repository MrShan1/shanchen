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
using System.Windows;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 普通组布局提供者
    /// </summary>
    public class NormalGroupLayoutProvider : IGroupLayoutProvider
    {
        /// <summary>
        /// 组
        /// </summary>
        public Group Group { set; get; }

        /// <summary>
        /// 位置
        /// </summary>
        public Point? Location { get; set; }

        /// <summary>
        /// 布局算法
        /// </summary>
        public ILayoutArithmetic LayoutArithmetic { get; set; }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="isSecondTime">是否为第二次</param>
        /// <returns>是否布局</returns>
        public bool Layout(bool isSecondTime)
        {
            if (LayoutArithmetic == null)
            {
                throw new ArgumentNullException();
            }
            //返回的是layout实例
            var root = Group.GetRootParent();
            LayoutArithmetic.GetConfig(root);
            LayoutArithmetic.Parameter = Group;
            LayoutArithmetic.Location = Location;
            LayoutArithmetic.IsSecondTime = isSecondTime;
            var layoutResult = LayoutArithmetic.Layout(Group.Items, Group.Center);
            //防止出错
            if (layoutResult == null) return true;

            Group.Width = layoutResult.ResultSize.Width;
            Group.Height = layoutResult.ResultSize.Height;
            if (!layoutResult.IsOnlyGetSize)
            {
                //设置哪些与依赖属性配对的属性
                LayoutArithmetic.SetConfig(root);
            }
            return !layoutResult.IsOnlyGetSize;
        }

    }
}
