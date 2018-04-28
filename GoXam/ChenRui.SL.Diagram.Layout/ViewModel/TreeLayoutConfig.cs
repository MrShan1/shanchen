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
using System.Collections.ObjectModel;
using Northwoods.GoXam.Layout;
using ChenRui.SL.Configuration;

namespace ChenRui.SL.Diagram.Layout.ViewModel
{
    /// <summary>
    /// 树布局配置
    /// </summary>
    public class TreeLayoutConfig : LayoutConfig
    {
        /// <summary>
        /// 树样式
        /// </summary>
        public TreeStyle TreeStyle
        {
            get
            {
                return treeStyle;
            }
            set
            {
                if (treeStyle != value)
                {
                    treeStyle = value;
                    OnPropertyChanged(() => TreeStyle);
                }
            }
        }
        private TreeStyle treeStyle;

        /// <summary>
        /// 树样式集合
        /// </summary>
        public Dictionary<TreeStyle, string> TreeStyles
        {
            get
            {
                return treeStyles;
            }
            set
            {
                if (treeStyles != value)
                {
                    treeStyles = value;
                    OnPropertyChanged(() => TreeStyles);
                }
            }
        }
        private Dictionary<TreeStyle, string> treeStyles;

        /// <summary>
        /// 角度
        /// </summary>
        public double Angle
        {
            get
            {
                return angle;
            }
            set
            {
                if (angle != value)
                {
                    angle = value;
                    OnPropertyChanged(() => Angle);
                }
            }
        }
        private double angle;

        /// <summary>
        /// 角度集合
        /// </summary>
        public Collection<double> Angles
        {
            get
            {
                return angles;
            }
            set
            {
                if (angles != value)
                {
                    angles = value;
                    OnPropertyChanged(() => Angles);
                }
            }
        }
        private Collection<double> angles;

        /// <summary>
        /// 对齐
        /// </summary>
        public TreeAlignment Alignment
        {
            get
            {
                return alignment;
            }
            set
            {
                if (alignment != value)
                {
                    alignment = value;
                    OnPropertyChanged(() => Alignment);
                }
            }
        }
        private TreeAlignment alignment;

        /// <summary>
        /// 对齐集合
        /// </summary>
        public Dictionary<TreeAlignment, string> Alignments
        {
            get
            {
                return alignments;
            }
            set
            {
                if (alignments != value)
                {
                    alignments = value;
                    OnPropertyChanged(() => Alignments);
                }
            }
        }
        private Dictionary<TreeAlignment, string> alignments;

        /// <summary>
        /// 点间距
        /// </summary>
        public double NodeSpacing
        {
            get
            {
                return nodeSpacing;
            }
            set
            {
                if (nodeSpacing != value)
                {
                    nodeSpacing = value;
                    OnPropertyChanged(() => NodeSpacing);
                }
            }
        }
        private double nodeSpacing;

        /// <summary>
        /// 点缩进
        /// </summary>
        public double NodeIndent
        {
            get
            {
                return nodeIndent;
            }
            set
            {
                if (nodeIndent != value)
                {
                    nodeIndent = value;
                    OnPropertyChanged(() => NodeIndent);
                }
            }
        }
        private double nodeIndent;

        /// <summary>
        /// 经过父级的点缩进
        /// </summary>
        public double NodeIndentPastParent
        {
            get
            {
                return nodeIndentPastParent;
            }
            set
            {
                if (nodeIndentPastParent != value)
                {
                    nodeIndentPastParent = value;
                    OnPropertyChanged(() => NodeIndentPastParent);
                }
            }
        }
        private double nodeIndentPastParent;

        /// <summary>
        /// 层间距
        /// </summary>
        public double LayerSpacing
        {
            get
            {
                return layerSpacing;
            }
            set
            {
                if (layerSpacing != value)
                {
                    layerSpacing = value;
                    OnPropertyChanged(() => LayerSpacing);
                }
            }
        }
        private double layerSpacing;

        /// <summary>
        /// 父级重叠层间距
        /// </summary>
        public double LayerSpacingParentOverlap
        {
            get
            {
                return layerSpacingParentOverlap;
            }
            set
            {
                if (layerSpacingParentOverlap != value)
                {
                    layerSpacingParentOverlap = value;
                    OnPropertyChanged(() => LayerSpacingParentOverlap);
                }
            }
        }
        private double layerSpacingParentOverlap;

        /// <summary>
        /// 排序
        /// </summary>
        public TreeSorting Sorting
        {
            get
            {
                return sorting;
            }
            set
            {
                if (sorting != value)
                {
                    sorting = value;
                    OnPropertyChanged(() => Sorting);
                }
            }
        }
        private TreeSorting sorting;

        /// <summary>
        /// 排序集合
        /// </summary>
        public Dictionary<TreeSorting, string> Sortings
        {
            get
            {
                return sortings;
            }
            set
            {
                if (sortings != value)
                {
                    sortings = value;
                    OnPropertyChanged(() => Sortings);
                }
            }
        }
        private Dictionary<TreeSorting, string> sortings;

        /// <summary>
        /// 压缩
        /// </summary>
        public TreeCompaction Compaction
        {
            get
            {
                return compaction;
            }
            set
            {
                if (compaction != value)
                {
                    compaction = value;
                    OnPropertyChanged(() => Compaction);
                }
            }
        }
        private TreeCompaction compaction;

        /// <summary>
        /// 压缩集合
        /// </summary>
        public Dictionary<TreeCompaction, string> Compactions
        {
            get
            {
                return compactions;
            }
            set
            {
                if (compactions != value)
                {
                    compactions = value;
                    OnPropertyChanged(() => Compactions);
                }
            }
        }
        private Dictionary<TreeCompaction, string> compactions;

        /// <summary>
        /// 宽度限制
        /// </summary>
        public double BreadthLimit
        {
            get
            {
                return breadthLimit;
            }
            set
            {
                if (breadthLimit != value)
                {
                    breadthLimit = value;
                    OnPropertyChanged(() => BreadthLimit);
                }
            }
        }
        private double breadthLimit;

        /// <summary>
        /// 行间距
        /// </summary>
        public double RowSpacing
        {
            get
            {
                return rowSpacing;
            }
            set
            {
                if (rowSpacing != value)
                {
                    rowSpacing = value;
                    OnPropertyChanged(() => RowSpacing);
                }
            }
        }
        private double rowSpacing;

        /// <summary>
        /// 行缩进
        /// </summary>
        public double RowIndent
        {
            get
            {
                return rowIndent;
            }
            set
            {
                if (rowIndent != value)
                {
                    rowIndent = value;
                    OnPropertyChanged(() => RowIndent);
                }
            }
        }
        private double rowIndent;

        /// <summary>
        /// 构造函数
        /// </summary>
        public TreeLayoutConfig()
        {
            TreeStyle = ConfigContext.Current.GetEnum<TreeStyle>(ConfigKeyInfo.TREE_STYLE_KEY);
            TreeStyles = new Dictionary<TreeStyle, string>();
            TreeStyles.Add(TreeStyle.Layered, Resource.Layered);
            TreeStyles.Add(TreeStyle.LastParents, Resource.LastParents);
            TreeStyles.Add(TreeStyle.Alternating, Resource.Alternating);
            TreeStyles.Add(TreeStyle.RootOnly, Resource.RootOnly);
            Angle = ConfigContext.Current.GetDouble(ConfigKeyInfo.ANGLE_KEY);
            Angles = new Collection<double>();
            Angles.Add(0);
            Angles.Add(90);
            Angles.Add(180);
            Angles.Add(270);
            Alignment = ConfigContext.Current.GetEnum<TreeAlignment>(ConfigKeyInfo.ALIGNMENT_KEY);
            Alignments = new Dictionary<TreeAlignment, string>();
            Alignments.Add(TreeAlignment.CenterChildren, Resource.OptimalLinkLength);
            Alignments.Add(TreeAlignment.CenterSubtrees, Resource.LongestPathSink);
            Alignments.Add(TreeAlignment.Start, Resource.LongestPathSource);
            Alignments.Add(TreeAlignment.End, Resource.OptimalLinkLength);
            Alignments.Add(TreeAlignment.Bus, Resource.LongestPathSink);
            Alignments.Add(TreeAlignment.TopLeftBus, Resource.LongestPathSource);
            Alignments.Add(TreeAlignment.BottomRightBus, Resource.OptimalLinkLength);
            NodeSpacing = ConfigContext.Current.GetDouble(ConfigKeyInfo.NODE_SPACING_KEY);
            NodeIndent = ConfigContext.Current.GetDouble(ConfigKeyInfo.NODE_INDENT_KEY);
            NodeIndentPastParent = ConfigContext.Current.GetDouble(ConfigKeyInfo.NODE_INDENT_PAST_PARENT_KEY);
            LayerSpacing = ConfigContext.Current.GetDouble(ConfigKeyInfo.TREE_LAYER_SPACING_KEY);
            LayerSpacingParentOverlap = ConfigContext.Current.GetDouble(ConfigKeyInfo.LAYER_SPACING_PARENT_OVERLAP_KEY);
            Sorting = ConfigContext.Current.GetEnum<TreeSorting>(ConfigKeyInfo.SORTING_KEY);
            Sortings = new Dictionary<TreeSorting, string>();
            Sortings.Add(TreeSorting.Forwards, Resource.Forwards);
            Sortings.Add(TreeSorting.Reverse, Resource.Reverse);
            Sortings.Add(TreeSorting.Ascending, Resource.Ascending);
            Sortings.Add(TreeSorting.Descending, Resource.Descending);
            Compaction = ConfigContext.Current.GetEnum<TreeCompaction>(ConfigKeyInfo.COMPACTION_KEY);
            Compactions = new Dictionary<TreeCompaction, string>();
            Compactions.Add(TreeCompaction.Block, Resource.Block);
            Compactions.Add(TreeCompaction.None, Resource.None);
            BreadthLimit = ConfigContext.Current.GetDouble(ConfigKeyInfo.BREADTH_LIMIT_KEY);
            RowSpacing = ConfigContext.Current.GetDouble(ConfigKeyInfo.ROW_SPACING_KEY);
            RowIndent = ConfigContext.Current.GetDouble(ConfigKeyInfo.ROW_INDENT_KEY);
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="layout">布局</param>
        public override void SetConfig(IDiagramLayout layout)
        {
            var treeLayout = layout as TreeLayout;
            if (treeLayout == null) return;
            treeLayout.Angle = Angle;
            treeLayout.TreeStyle = TreeStyle;
            treeLayout.Alignment = Alignment;
            treeLayout.NodeSpacing = NodeSpacing;
            treeLayout.NodeIndent = NodeIndent;
            treeLayout.NodeIndentPastParent = NodeIndentPastParent;
            treeLayout.LayerSpacing = LayerSpacing;
            treeLayout.LayerSpacingParentOverlap = LayerSpacingParentOverlap;
            treeLayout.Sorting = Sorting;
            treeLayout.Compaction = Compaction;
            treeLayout.BreadthLimit = BreadthLimit;
            treeLayout.RowSpacing = RowSpacing;
            treeLayout.RowIndent = RowIndent;
        }

        /// <summary>
        /// 设置默认配置
        /// </summary>
        public override void SetDefaultConfig()
        {
            ConfigContext.Current.SetEnum(ConfigKeyInfo.TREE_STYLE_KEY, TreeStyle);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.ANGLE_KEY, Angle);
            ConfigContext.Current.SetEnum(ConfigKeyInfo.ALIGNMENT_KEY, Alignment);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.NODE_SPACING_KEY, NodeSpacing);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.NODE_INDENT_KEY, NodeIndent);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.NODE_INDENT_PAST_PARENT_KEY, NodeIndentPastParent);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.TREE_LAYER_SPACING_KEY, LayerSpacing);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.LAYER_SPACING_PARENT_OVERLAP_KEY, LayerSpacingParentOverlap);
            ConfigContext.Current.SetEnum(ConfigKeyInfo.SORTING_KEY, Sorting);
            ConfigContext.Current.SetEnum(ConfigKeyInfo.COMPACTION_KEY, Compaction);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.BREADTH_LIMIT_KEY, BreadthLimit);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.ROW_SPACING_KEY, RowSpacing);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.ROW_INDENT_KEY, RowIndent);
        }

    }
}