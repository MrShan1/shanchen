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
using System.Collections.Generic;
using System.Linq;
using Northwoods.GoXam;
using Northwoods.GoXam.Layout;
using ChenRui.SL.Common.Arithmetic;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 圆形布局
    /// </summary>
    public class CircleLayout : OldCustomizedLayout, ISpecialNodes
    {
        /// <summary>
        /// 特殊点提供者
        /// </summary>
        public ISpecialNodesProvider SpecialNodesProvider { get; set; }

        /// <summary>
        /// 标识ArcSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty ArcSpacingRatioProperty = DependencyProperty.Register("ArcSpacingRatio", typeof(double), typeof(CircleLayout), new PropertyMetadata(0.0, OnPropertyChanged));

        /// <summary>
        /// 弧间距比例
        /// </summary>
        public double ArcSpacingRatio
        {
            get { return (double)GetValue(ArcSpacingRatioProperty); }
            set { SetValue(ArcSpacingRatioProperty, value); }
        }

        /// <summary>
        /// 标识Radius依赖属性
        /// </summary>
        public static readonly DependencyProperty RadiusProperty = DependencyProperty.Register("Radius", typeof(double), typeof(CircleLayout), new PropertyMetadata(Double.NaN, OnPropertyChanged));  // may be NaN

        /// <summary>
        /// 半径
        /// </summary>
        public double Radius
        {
            get { return (double)GetValue(RadiusProperty); }
            set { SetValue(RadiusProperty, value); }
        }

        /// <summary>
        /// 标识AspectRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty AspectRatioProperty = DependencyProperty.Register("AspectRatio", typeof(double), typeof(CircleLayout), new PropertyMetadata(1.0, OnPropertyChanged));

        /// <summary>
        /// 偏率
        /// </summary>
        public double AspectRatio
        {
            get { return (double)GetValue(AspectRatioProperty); }
            set { SetValue(AspectRatioProperty, value); }
        }

        /// <summary>
        /// 标识StartAngle依赖属性
        /// </summary>
        public static readonly DependencyProperty StartAngleProperty = DependencyProperty.Register("StartAngle", typeof(double), typeof(CircleLayout), new PropertyMetadata(-90.0, OnPropertyChanged));

        /// <summary>
        /// 起始角度
        /// </summary>
        public double StartAngle
        {
            get { return (double)GetValue(StartAngleProperty); }
            set { SetValue(StartAngleProperty, value); }
        }

        /// <summary>
        /// 标识IsClockwise依赖属性
        /// </summary>
        public static readonly DependencyProperty IsClockwiseProperty = DependencyProperty.Register("IsClockwise", typeof(bool), typeof(CircleLayout), new PropertyMetadata(true, OnPropertyChanged));

        /// <summary>
        /// 是否是顺时针
        /// </summary>
        public bool IsClockwise
        {
            get { return (bool)GetValue(IsClockwiseProperty); }
            set { SetValue(IsClockwiseProperty, value); }
        }

        /// <summary>
        /// 标识CenterNodeDistanceRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty CenterNodeDistanceRatioProperty = DependencyProperty.Register("CenterNodeDistanceRatio", typeof(double), typeof(CircleLayout), new PropertyMetadata(0.3, OnPropertyChanged));

        /// <summary>
        /// 中心点距离比例
        /// </summary>
        public double CenterNodeDistanceRatio
        {
            get { return (double)GetValue(CenterNodeDistanceRatioProperty); }
            set { SetValue(CenterNodeDistanceRatioProperty, value); }
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        /// <param name="specialNodes">特殊点集合</param>
        /// <param name="location">位置</param>
        /// <returns>布局结果</returns>
        protected override LayoutResult DoLayout(IEnumerable<Node> nodes, IEnumerable<Link> links, IEnumerable<Node> specialNodes, Point? location)
        {
            if (specialNodes != null)
            {
                var center = specialNodes.FirstOrDefault();
                if (center != null)
                {
                    Locate(center, 0, 0, location);
                    return nodes.Count() > 1 ? new LayoutResult(DoLayoutInternal(nodes.Where(n => n != center), location, true)) : new LayoutResult(new Size(ActualCellSize.Width, ActualCellSize.Height));
                }
                return new LayoutResult(DoLayoutInternal(nodes, location, false));
            }
            return new LayoutResult(DoLayoutInternal(nodes, location, false));
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="location">位置</param>
        /// <param name="hasCenter">是否有中心</param>
        /// <returns>大小</returns>
        private Size DoLayoutInternal(IEnumerable<Node> nodes, Point? location, bool hasCenter)
        {
            //R*(phi-2theta)=d/2
            //(r/2)/R=sin(theta)
            if (!hasCenter && nodes.Count() == 1)
            {
                Locate(nodes.FirstOrDefault(), 0, 0, location);
                return new Size(ActualCellSize.Width, ActualCellSize.Height);
            }
            var cellSize = Math.Max(ActualCellSize.Width, ActualCellSize.Height);
            var outerRadius = cellSize / 2 / Math.Sin(Math.PI / 4);
            var count = nodes.Count();
            var radius = Radius;
            if (double.IsNaN(Radius))
            {
                //var r = (outerRadius + Distance / 2) / Math.Sin(Math.PI / count);
                radius = Arithmetic.GetR(outerRadius, outerRadius * ArcSpacingRatio, Math.PI / count);
                if (hasCenter && radius < outerRadius * 2 + outerRadius * 2 * CenterNodeDistanceRatio)
                {
                    radius = outerRadius * 2 + outerRadius * 2 * CenterNodeDistanceRatio;
                }
            }
            var index = 0;
            nodes.ForEach(n =>
            {
                Locate(n, radius * Math.Cos(StartAngle / 180 * Math.PI + 2 * Math.PI / count * index), radius * AspectRatio * Math.Sin(StartAngle / 180 * Math.PI + 2 * Math.PI / count * index), location);
                if (IsClockwise)
                {
                    index++;
                }
                else
                {
                    index--;
                }
            });
            return new Size(radius * 2 + cellSize, radius * AspectRatio * 2 + cellSize);
        }

    }
}
