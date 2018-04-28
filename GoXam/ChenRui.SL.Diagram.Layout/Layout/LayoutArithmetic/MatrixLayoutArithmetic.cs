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
using System.Linq;
using System.Windows;
using Northwoods.GoXam;
using ChenRui.SL.Configuration;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 矩阵布局算法
    /// </summary>
    public class MatrixLayoutArithmetic : LayoutArithmetic
    {
        /// <summary>
        /// 列数
        /// </summary>
        public int ColumnCount { get; set; }

        /// <summary>
        /// 行数
        /// </summary>
        public int RowCount { get; set; }

        /// <summary>
        /// 中心点位置
        /// </summary>
        public EnumCenterNodePlacement CenterNodePlacement { get; set; }

        /// <summary>
        /// 中心点距离
        /// </summary>
        public double CenterNodeDistance { get; set; }

        /// <summary>
        /// 布局核心
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        /// <param name="center">中心</param>
        /// <returns>布局结果</returns>
        protected override LayoutResult LayoutCore(IEnumerable<ILocatable> locatables, ILocatable center)
        {
            if (center != null)
            {
                return new LayoutResult(LayoutWithCenter(center, locatables.Where(l => l != center)));
            }
            return new LayoutResult(Layout(locatables));
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="locatables">可定位集合</param>
        /// <returns>大小</returns>
        private Size Layout(IEnumerable<ILocatable> locatables)
        {
            var count = locatables.Count();
            int columnCount;
            int rowCount;
            if (ColumnCount <= 0 && RowCount <= 0)
            {
                columnCount = (int)Math.Ceiling(Math.Sqrt(count));
                rowCount = (int)Math.Ceiling((double)count / columnCount);
            }
            else if (ColumnCount > 0)
            {
                columnCount = ColumnCount;
                rowCount = (int)Math.Ceiling((double)count / columnCount);
            }
            else
            {
                columnCount = (int)Math.Ceiling((double)count / RowCount);
                rowCount = (int)Math.Ceiling((double)count / columnCount);
            }
            var size = new Size(columnCount * ActualCellSize.Width + (columnCount - 1) * Spacing.Width, rowCount * ActualCellSize.Height + (rowCount - 1) * Spacing.Height);
            var index = 0;
            locatables.ForEach(l =>
            {
                l.Location = new Point(ActualCellSize.Width / 2 + (ActualCellSize.Width + Spacing.Width) * (index % columnCount) - size.Width / 2, ActualCellSize.Height / 2 + (ActualCellSize.Height + Spacing.Height) * (index / columnCount) - size.Height / 2);
                index++;
            });
            return size;
        }

        /// <summary>
        /// 有中心点时布局
        /// </summary>
        /// <param name="center">中心</param>
        /// <param name="locatables">可定位集合</param>
        /// <returns>大小</returns>
        private Size LayoutWithCenter(ILocatable center, IEnumerable<ILocatable> locatables)
        {
            if (locatables.Count() == 0)
            {
                center.Location = new Point(0, 0);
                return new Size(ActualCellSize.Width, ActualCellSize.Height);
            }
            var size = Layout(locatables);
            var x = 0.0;
            var y = 0.0;
            switch (CenterNodePlacement)
            {
                case EnumCenterNodePlacement.Left:
                    center.Location = new Point(ActualCellSize.Width / 2 - (ActualCellSize.Width + CenterNodeDistance + size.Width) / 2, 0);
                    x = (ActualCellSize.Width + CenterNodeDistance) / 2;
                    break;
                case EnumCenterNodePlacement.Top:
                    center.Location = new Point(0, ActualCellSize.Height / 2 - (ActualCellSize.Height + CenterNodeDistance + size.Height) / 2);
                    y = (ActualCellSize.Height + CenterNodeDistance) / 2;
                    break;
                case EnumCenterNodePlacement.Right:
                    center.Location = new Point((ActualCellSize.Width + CenterNodeDistance + size.Width) / 2 - ActualCellSize.Width / 2, 0);
                    x = -(ActualCellSize.Width + CenterNodeDistance) / 2;
                    break;
                case EnumCenterNodePlacement.Bottom:
                    center.Location = new Point(0, (ActualCellSize.Height + CenterNodeDistance + size.Height) / 2 - ActualCellSize.Height / 2);
                    y = -(ActualCellSize.Height + CenterNodeDistance) / 2;
                    break;
            }
            var index = 0;
            locatables.ForEach(l =>
            {
                l.Location = new Point(l.Location.X + x, l.Location.Y + y);
                index++;
            });
            return new Size(size.Width + Math.Abs(x) * 2, size.Height + Math.Abs(y) * 2);
        }

        /// <summary>
        /// 获取配置
        /// </summary>
        /// <param name="o">对象</param>
        public override void GetConfig(object o)
        {
            try
            {
                base.GetConfig(o);
                dynamic c = o;
                ColumnCount = c.ColumnCount;
                RowCount = c.RowCount;
                CenterNodePlacement = c.CenterNodePlacement;
                CenterNodeDistance = c.CenterNodeDistance;
            }
            catch (Exception)
            {
                Spacing = new Size(ConfigContext.Current.GetDouble(ConfigKeyInfo.MATRIX_HORIZONTAL_SPACING_KEY), ConfigContext.Current.GetDouble(ConfigKeyInfo.MATRIX_VERTICAL_SPACING_KEY));
                ColumnCount = ConfigContext.Current.GetBool(ConfigKeyInfo.MATRIX_FIX_COLUMN_COUNT_KEY) ? ConfigContext.Current.GetInt(ConfigKeyInfo.MATRIX_COLUMN_COUNT_KEY) : 0;
                RowCount = ConfigContext.Current.GetBool(ConfigKeyInfo.MATRIX_FIX_ROW_COUNT_KEY) ? ConfigContext.Current.GetInt(ConfigKeyInfo.MATRIX_ROW_COUNT_KEY) : 0;
            }
        }

    }
}
