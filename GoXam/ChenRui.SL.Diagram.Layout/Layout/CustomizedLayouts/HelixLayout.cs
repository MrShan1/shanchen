#region Copyright ©2011北京宸瑞科技有限公司
/* 
 * 
 * FileName:
 * 
 * Author:  吕晓宇
 * 
 * Date:    2012.4.23
 * 
 * Descript: 螺旋算法
 * 
 */
#endregion

using System;
using System.Windows;
using System.Collections.Generic;
using System.Linq;
using Northwoods.GoXam;
using ChenRui.SL.Common.Arithmetic;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 螺旋布局
    /// </summary>
    public class HelixLayout : OldCustomizedLayout, ISpecialNodes
    {
        /// <summary>
        /// 特殊点提供者
        /// </summary>
        public ISpecialNodesProvider SpecialNodesProvider { get; set; }

        /// <summary>
        /// 标识ArcSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty ArcSpacingRatioProperty = DependencyProperty.Register("ArcSpacingRatio", typeof(double), typeof(HelixLayout), new PropertyMetadata(0.0, OnPropertyChanged));

        /// <summary>
        /// 弧间距比例
        /// </summary>
        public double ArcSpacingRatio
        {
            get { return (double)GetValue(ArcSpacingRatioProperty); }
            set { SetValue(ArcSpacingRatioProperty, value); }
        }

        /// <summary>
        /// 标识ArcSpacingRatio依赖属性
        /// </summary>
        public static readonly DependencyProperty FirstCircleNodeCountProperty = DependencyProperty.Register("FirstCircleNodeCount", typeof(int), typeof(HelixLayout), new PropertyMetadata(8, OnPropertyChanged));

        /// <summary>
        /// 首圈节点数
        /// </summary>
        public int FirstCircleNodeCount
        {
            get { return (int)GetValue(FirstCircleNodeCountProperty); }
            set { SetValue(FirstCircleNodeCountProperty, value); }
        }

        /// <summary>
        /// 标识StartAngle依赖属性
        /// </summary>
        public static readonly DependencyProperty StartAngleProperty = DependencyProperty.Register("StartAngle", typeof(double), typeof(HelixLayout), new PropertyMetadata(-90.0, OnPropertyChanged));

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
        public static readonly DependencyProperty IsClockwiseProperty = DependencyProperty.Register("IsClockwise", typeof(bool), typeof(HelixLayout), new PropertyMetadata(true, OnPropertyChanged));

        /// <summary>
        /// 是否是顺时针
        /// </summary>
        public bool IsClockwise
        {
            get { return (bool)GetValue(IsClockwiseProperty); }
            set { SetValue(IsClockwiseProperty, value); }
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
            var locations = new List<Point>();
            var cellSize = Math.Max(ActualCellSize.Width, ActualCellSize.Height);
            var outerRadius = cellSize / 2 / Math.Sin(Math.PI / 4);
            var _nodes = nodes;
            if (specialNodes != null)
            {
                var center = specialNodes.FirstOrDefault();
                if (center != null)
                {
                    locations.Add(new Point(0, 0));
                    _nodes = nodes.Where(n => n != center);
                    DoLayoutInternal(_nodes, true, outerRadius, locations);
                }
                else
                {
                    DoLayoutInternal(_nodes, false, outerRadius, locations);
                }
            }
            else
            {
                DoLayoutInternal(_nodes, false, outerRadius, locations);
            }
            var left = locations.Min(l => l.X) - outerRadius;
            var right = locations.Max(l => l.X) + outerRadius;
            var top = locations.Min(l => l.Y) - outerRadius;
            var bottom = locations.Max(l => l.Y) + outerRadius;
            var x = left + (right - left) / 2;
            var y = top + (bottom - top) / 2;
            var index = 0;
            if (specialNodes != null)
            {
                var center = specialNodes.FirstOrDefault();
                if (center != null)
                {
                    var l = locations.FirstOrDefault();
                    Locate(center, l.X - x, l.Y - y, location);
                    index++;
                }
            }
            _nodes.ForEach(n =>
            {
                Locate(n, locations[index].X - x, locations[index].Y - y, location);
                index++;
            });
            return new LayoutResult(new Size(right - left, bottom - top));
        }

        /// <summary>
        /// 角度增速 min : 1    max:5
        /// </summary>
        public int AngelSpeed
        {
            get { return (int)GetValue(AngelSpeedProperty); }
            set { SetValue(AngelSpeedProperty, value); }
        }

        /// <summary>
        /// 标识AngelSpeed依赖属性
        /// </summary>
        public static readonly DependencyProperty AngelSpeedProperty = DependencyProperty.Register("AngelSpeed", typeof(int), typeof(HelixLayout), new PropertyMetadata(2,OnPropertyChanged));

        /// <summary>
        /// 初始半径增速 min:65    max: 120
        /// </summary>
        public double RadiusInit
        {
            get { return (double)GetValue(RadiusInitProperty); }
            set { SetValue(RadiusInitProperty, value); }
        }

        /// <summary>
        /// 标识RadiusInit依赖属性
        /// </summary>
        public static readonly DependencyProperty RadiusInitProperty = DependencyProperty.Register("RadiusInit", typeof(double), typeof(HelixLayout), new PropertyMetadata(70.0,OnPropertyChanged));

        /// <summary>
        /// 半径增速指数 min: 0.4   max: 1.2
        /// </summary>
        public double RadiusPow //
        {
            get { return (double)GetValue(RadiusPowProperty); }
            set { SetValue(RadiusPowProperty, value); }
        }

        // 标识RadiusPow依赖属性
        public static readonly DependencyProperty RadiusPowProperty = DependencyProperty.Register("RadiusPow", typeof(double), typeof(HelixLayout), new PropertyMetadata(0.6,OnPropertyChanged));

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="hasCenter">是否有中心点</param>
        /// <param name="outerRadius">外半径</param>
        /// <param name="locations">位置集合</param>
        private void DoLayoutInternal(IEnumerable<Node> nodes, bool hasCenter, double outerRadius, List<Point> locations)
        {
            if (!hasCenter && nodes.Count() == 1)
            {
                locations.Add(new Point(0, 0));
                return;
            }
            var firstCircleNodeCount = FirstCircleNodeCount < 4 ? 4 : FirstCircleNodeCount;
            var index = 0;
            var nodeCount = firstCircleNodeCount;
            int ddd = 0;
            nodes.ForEach(n =>
            {
                if (hasCenter) ddd += AngelSpeed;
                //radius = radius + 15 * Math.Pow(Math.Abs(index), 0.2);
                var radius = RadiusInit * Math.Pow(ddd, RadiusPow);
                ddd += AngelSpeed;

                if (Math.Abs(index) >= nodeCount)
                {
                    //radius = radius + 2 * outerRadius + outerRadius * CircleSpacingRatio;                    
                    nodeCount = (int)Math.Floor(Math.PI / Arithmetic.GetPhi(outerRadius, outerRadius * ArcSpacingRatio, radius));
                    index = 0;
                }
                Point pt1 = new Point(radius * Math.Cos(StartAngle / 180 * Math.PI + 2 * Math.PI / nodeCount * index), radius * Math.Sin(StartAngle / 180 * Math.PI + 2 * Math.PI / nodeCount * index));

                locations.Add(pt1);

                if (IsClockwise)
                {
                    index++;
                }
                else
                {
                    index--;
                }
            });
        }

    }
}
