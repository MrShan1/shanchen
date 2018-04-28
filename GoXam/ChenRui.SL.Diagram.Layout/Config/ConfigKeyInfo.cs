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
    /// 配置Key信息
    /// </summary>
    public class ConfigKeyInfo
    {
        public const string LAYOUT_NEED_GROUP = "LayoutNeedGroup";

        public const string ELECTRICAL_CHARGE_KEY = "ForceDirectedLayout.ElectricalCharge";
        public const string SPRING_LENGTH_KEY = "ForceDirectedLayout.SpringLength";
        public const string SPRING_STIFFNESS_KEY = "ForceDirectedLayout.SpringStiffness";

        public const string DIRECTION_KEY = "LayeredDigraphLayout.Direction";
        public const string LAYERED_DIGRAPH_LAYER_SPACING_KEY = "LayeredDigraphLayout.LayerSpacing";
        public const string COLUMN_SPACING_KEY = "LayeredDigraphLayout.ColumnSpacing";
        public const string LAYERING_KEY = "LayeredDigraphLayout.Layering";
        public const string INITIALIZE_KEY = "LayeredDigraphLayout.Initialize";
        public const string AGGRESSIVE_KEY = "LayeredDigraphLayout.Aggressive";
        public const string PACK_EXPAND_KEY = "LayeredDigraphLayout.PackExpand";
        public const string PACK_STRAIGHTEN_KEY = "LayeredDigraphLayout.PackStraighten";
        public const string PACK_MEDIAN_KEY = "LayeredDigraphLayout.PackMedian";

        public const string TREE_STYLE_KEY = "TreeLayout.TreeStyle";
        public const string ANGLE_KEY = "TreeLayout.Angle";
        public const string ALIGNMENT_KEY = "TreeLayout.Alignment";
        public const string NODE_SPACING_KEY = "TreeLayout.NodeSpacing";
        public const string NODE_INDENT_KEY = "TreeLayout.NodeIndent";
        public const string NODE_INDENT_PAST_PARENT_KEY = "TreeLayout.NodeIndentPastParent";
        public const string TREE_LAYER_SPACING_KEY = "TreeLayout.LayerSpacing";
        public const string LAYER_SPACING_PARENT_OVERLAP_KEY = "TreeLayout.LayerSpacingParentOverlap";
        public const string SORTING_KEY = "TreeLayout.TreeSorting";
        public const string COMPACTION_KEY = "TreeLayout.Compaction";
        public const string BREADTH_LIMIT_KEY = "TreeLayout.BreadthLimit";
        public const string ROW_SPACING_KEY = "TreeLayout.RowSpacing";
        public const string ROW_INDENT_KEY = "TreeLayout.RowIndent";

        public const string HORIZONTAL_GROUP_PADDING_KEY = "HorizontalLayout.GroupPadding";
        public const string HORIZONTAL_HORIZONTAL_SPACING_KEY = "HorizontalLayout.HorizontalSpacing";
        public const string HORIZONTAL_VERTICAL_SPACING_KEY = "HorizontalLayout.VerticalSpacing";
        public const string IS_CENTER_NODE_TOP_KEY = "HorizontalLayout.IsCenterNodeTop";

        public const string VERTICAL_GROUP_PADDING_KEY = "VerticalLayout.GroupPadding";
        public const string VERTICAL_HORIZONTAL_SPACING_KEY = "VerticalLayout.HorizontalSpacing";
        public const string VERTICAL_VERTICAL_SPACING_KEY = "VerticalLayout.VerticalSpacing";
        public const string IS_CENTER_NODE_LEFT_KEY = "VerticalLayout.IsCenterNodeLeft";

        public const string CIRCLE_GROUP_PADDING_KEY = "CircleLayout.GroupPadding";
        public const string CIRCLE_ARC_SPACING_RATIO_KEY = "CircleLayout.ArcSpacingRatio";
        public const string CIRCLE_FIX_RADIUS_KEY = "CircleLayout.FixRadius";
        public const string CIRCLE_RADIUS_KEY = "CircleLayout.Radius";
        public const string CIRCLE_ASPECT_RATIO_KEY = "CircleLayout.AspectRatio";
        public const string CIRCLE_START_ANGLE_KEY = "CircleLayout.StartAngle";
        public const string CIRCLE_IS_CLOCKWISE_KEY = "CircleLayout.IsClockwise";
        public const string CIRCLE_CENTER_NODE_DISTANCE_RATIO_KEY = "CircleLayout.CenterNodeDistanceRatio";

        public const string RING_GROUP_PADDING_KEY = "RingLayout.GroupPadding";
        public const string RING_ARC_SPACING_RATIO_KEY = "RingLayout.ArcSpacingRatio";
        public const string RING_FIRST_CIRCLE_NODE_COUNT_KEY = "RingLayout.FirstCircleNodeCount";
        public const string RING_FIRST_CIRCLE_FIX_RADIUS_KEY = "RingLayout.FirstCircleFixRadius";
        public const string RING_FIRST_CIRCLE_RADIUS_KEY = "RingLayout.FirstCircleRadius";
        public const string RING_CIRCLE_SPACING_RATIO_KEY = "RingLayout.CircleSpacingRatio";
        public const string RING_START_ANGLE_KEY = "RingLayout.StartAngle";
        public const string RING_IS_CLOCKWISE_KEY = "RingLayout.IsClockwise";
        public const string RING_CENTER_NODE_DISTANCE_RATIO_KEY = "RingLayout.CenterNodeDistanceRatio";

        public const string SECTOR_GROUP_PADDING_KEY = "SectorLayout.GroupPadding";
        public const string SECTOR_ARC_SPACING_RATIO_KEY = "SectorLayout.ArcSpacingRatio";
        public const string SECTOR_FIRST_CIRCLE_RADIUS_RATIO_KEY = "SectorLayout.FirstCircleRadiusRatio";
        public const string SECTOR_CIRCLE_SPACING_RATIO_KEY = "SectorLayout.CircleSpacingRatio";
        public const string SECTOR_ANGLE_KEY = "SectorLayout.Angle";
        public const string SECTOR_ANGLE_RANGE_KEY = "SectorLayout.AngleRange";
        public const string SECTOR_IS_CLOCKWISE_KEY = "SectorLayout.IsClockwise";
        public const string SECTOR_IS_CONTINUOUS_KEY = "SectorLayout.IsContinuous";
        public const string SECTOR_CENTER_NODE_DISTANCE_RATIO_KEY = "SectorLayout.CenterNodeDistanceRatio";

        public const string HELIX_GROUP_PADDING_KEY = "HelixLayout.GroupPadding";
        public const string HELIX_ARC_SPACING_RATIO_KEY = "HelixLayout.ArcSpacingRatio";
        public const string HELIX_FIRST_CIRCLE_NODE_COUNT_KEY = "HelixLayout.FirstCircleNodeCount";
        public const string HELIX_START_ANGLE_KEY = "HelixLayout.StartAngle";
        public const string HELIX_ANGLE_SPEED_KEY = "HelixLayout.AngelSpeed";
        public const string HELIX_RADIUS_INIT_KEY = "HelixLayout.RadiusInit";
        public const string HELIX_RADIUS_POW_KEY = "HelixLayout.RadiusPow";
        public const string HELIX_IS_CLOCKWISE_KEY = "HelixLayout.IsClockwise";

        public const string MATRIX_GROUP_PADDING_KEY = "MatrixLayout.GroupPadding";
        public const string MATRIX_HORIZONTAL_SPACING_KEY = "MatrixLayout.HorizontalSpacing";
        public const string MATRIX_VERTICAL_SPACING_KEY = "MatrixLayout.VerticalSpacing";
        public const string MATRIX_FIX_COLUMN_COUNT_KEY = "MatrixLayout.FixColumnCount";
        public const string MATRIX_COLUMN_COUNT_KEY = "MatrixLayout.ColumnCount";
        public const string MATRIX_FIX_ROW_COUNT_KEY = "MatrixLayout.FixRowCount";
        public const string MATRIX_ROW_COUNT_KEY = "MatrixLayout.RowCount";
        public const string MATRIX_CENTER_NODE_PLACEMENT_KEY = "MatrixLayout.CenterNodePlacement";
        public const string MATRIX_CENTER_NODE_DISTANCE_KEY = "MatrixLayout.CenterNodeDistance";

        public const string BOW_GROUP_PADDING_KEY = "BowLayout.GroupPadding";
        public const string BOW_HORIZONTAL_SPACING_KEY = "BowLayout.HorizontalSpacing";
        public const string BOW_VERTICAL_SPACING_KEY = "BowLayout.VerticalSpacing";
        public const string BOW_FIX_COLUMN_COUNT_KEY = "BowLayout.FixColumnCount";
        public const string BOW_COLUMN_COUNT_KEY = "BowLayout.ColumnCount";
        public const string BOW_FIX_ROW_COUNT_KEY = "BowLayout.FixRowCount";
        public const string BOW_ROW_COUNT_KEY = "BowLayout.RowCount";
        public const string BOW_CENTER_NODE_PLACEMENT_KEY = "BowLayout.CenterNodePlacement";
        public const string BOW_CENTER_NODE_DISTANCE_KEY = "BowLayout.CenterNodeDistance";

    }
}
