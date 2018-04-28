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
    /// 分层有向图布局配置
    /// </summary>
    public class LayeredDigraphLayoutConfig : LayoutConfig
    {
        /// <summary>
        /// 方向
        /// </summary>
        public double Direction
        {
            get
            {
                return direction;
            }
            set
            {
                if (direction != value)
                {
                    direction = value;
                    OnPropertyChanged(() => Direction);
                }
            }
        }
        private double direction;

        /// <summary>
        /// 方向集合
        /// </summary>
        public Collection<double> Directions
        {
            get
            {
                return directions;
            }
            set
            {
                if (directions != value)
                {
                    directions = value;
                    OnPropertyChanged(() => Directions);
                }
            }
        }
        private Collection<double> directions;

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
        /// 列间距
        /// </summary>
        public double ColumnSpacing
        {
            get
            {
                return columnSpacing;
            }
            set
            {
                if (columnSpacing != value)
                {
                    columnSpacing = value;
                    OnPropertyChanged(() => ColumnSpacing);
                }
            }
        }
        private double columnSpacing;

        /// <summary>
        /// 层
        /// </summary>
        public LayeredDigraphLayering Layering
        {
            get
            {
                return layering;
            }
            set
            {
                if (layering != value)
                {
                    layering = value;
                    OnPropertyChanged(() => Layering);
                }
            }
        }
        private LayeredDigraphLayering layering;

        /// <summary>
        /// 层集合
        /// </summary>
        public Dictionary<LayeredDigraphLayering, string> Layerings
        {
            get
            {
                return layerings;
            }
            set
            {
                if (layerings != value)
                {
                    layerings = value;
                    OnPropertyChanged(() => Layering);
                }
            }
        }
        private Dictionary<LayeredDigraphLayering, string> layerings;

        /// <summary>
        /// 初始化
        /// </summary>
        public LayeredDigraphInitIndices Initialize
        {
            get
            {
                return initialize;
            }
            set
            {
                if (initialize != value)
                {
                    initialize = value;
                    OnPropertyChanged(() => Layering);
                }
            }
        }
        private LayeredDigraphInitIndices initialize;

        /// <summary>
        /// 初始化集合
        /// </summary>
        public Dictionary<LayeredDigraphInitIndices, string> Initializes
        {
            get
            {
                return initializes;
            }
            set
            {
                if (initializes != value)
                {
                    initializes = value;
                    OnPropertyChanged(() => Initializes);
                }
            }
        }
        private Dictionary<LayeredDigraphInitIndices, string> initializes;

        /// <summary>
        /// 进取
        /// </summary>
        public LayeredDigraphAggressive Aggressive
        {
            get
            {
                return aggressive;
            }
            set
            {
                if (aggressive != value)
                {
                    aggressive = value;
                    OnPropertyChanged(() => Aggressive);
                }
            }
        }
        private LayeredDigraphAggressive aggressive;

        /// <summary>
        /// 进取集合
        /// </summary>
        public Dictionary<LayeredDigraphAggressive, string> Aggressives
        {
            get
            {
                return aggressives;
            }
            set
            {
                if (aggressives != value)
                {
                    aggressives = value;
                    OnPropertyChanged(() => Aggressives);
                }
            }
        }
        private Dictionary<LayeredDigraphAggressive, string> aggressives;

        /// <summary>
        /// 包展开
        /// </summary>
        public bool PackExpand
        {
            get
            {
                return packExpand;
            }
            set
            {
                if (packExpand != value)
                {
                    packExpand = value;
                    OnPropertyChanged(() => PackExpand);
                }
            }
        }
        private bool packExpand;

        /// <summary>
        /// 包直
        /// </summary>
        public bool PackStraighten
        {
            get
            {
                return packStraighten;
            }
            set
            {
                if (packStraighten != value)
                {
                    packStraighten = value;
                    OnPropertyChanged(() => PackStraighten);
                }
            }
        }
        private bool packStraighten;

        /// <summary>
        /// 包中间
        /// </summary>
        public bool PackMedian
        {
            get
            {
                return packMedian;
            }
            set
            {
                if (packMedian != value)
                {
                    packMedian = value;
                    OnPropertyChanged(() => PackMedian);
                }
            }
        }
        private bool packMedian;

        /// <summary>
        /// 构造函数
        /// </summary>
        public LayeredDigraphLayoutConfig()
        {
            Direction = ConfigContext.Current.GetDouble(ConfigKeyInfo.DIRECTION_KEY);
            Directions = new Collection<double>();
            Directions.Add(0);
            Directions.Add(90);
            Directions.Add(180);
            Directions.Add(270);
            LayerSpacing = ConfigContext.Current.GetDouble(ConfigKeyInfo.LAYERED_DIGRAPH_LAYER_SPACING_KEY);
            ColumnSpacing = ConfigContext.Current.GetDouble(ConfigKeyInfo.COLUMN_SPACING_KEY);
            Layering = ConfigContext.Current.GetEnum<LayeredDigraphLayering>(ConfigKeyInfo.LAYERING_KEY);
            Layerings = new Dictionary<LayeredDigraphLayering, string>();
            Layerings.Add(LayeredDigraphLayering.OptimalLinkLength, Resource.OptimalLinkLength);
            Layerings.Add(LayeredDigraphLayering.LongestPathSink, Resource.LongestPathSink);
            Layerings.Add(LayeredDigraphLayering.LongestPathSource, Resource.LongestPathSource);
            Initialize = ConfigContext.Current.GetEnum<LayeredDigraphInitIndices>(ConfigKeyInfo.INITIALIZE_KEY);
            Initializes = new Dictionary<LayeredDigraphInitIndices, string>();
            Initializes.Add(LayeredDigraphInitIndices.DepthFirstOut, Resource.DepthFirstOut);
            Initializes.Add(LayeredDigraphInitIndices.DepthFirstIn, Resource.DepthFirstIn);
            Initializes.Add(LayeredDigraphInitIndices.Naive, Resource.Naive);
            Aggressive = ConfigContext.Current.GetEnum<LayeredDigraphAggressive>(ConfigKeyInfo.AGGRESSIVE_KEY);
            Aggressives = new Dictionary<LayeredDigraphAggressive, string>();
            Aggressives.Add(LayeredDigraphAggressive.None, Resource.None);
            Aggressives.Add(LayeredDigraphAggressive.Less, Resource.Less);
            Aggressives.Add(LayeredDigraphAggressive.More, Resource.More);
            PackExpand = ConfigContext.Current.GetBool(ConfigKeyInfo.PACK_EXPAND_KEY);
            PackStraighten = ConfigContext.Current.GetBool(ConfigKeyInfo.PACK_STRAIGHTEN_KEY);
            PackMedian = ConfigContext.Current.GetBool(ConfigKeyInfo.PACK_MEDIAN_KEY);
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="layout">布局</param>
        public override void SetConfig(IDiagramLayout layout)
        {
            var layeredDigraphLayout = layout as LayeredDigraphLayout;
            if (layeredDigraphLayout == null) return;
            layeredDigraphLayout.Direction = Direction;
            layeredDigraphLayout.LayerSpacing = LayerSpacing;
            layeredDigraphLayout.ColumnSpacing = ColumnSpacing;
            layeredDigraphLayout.LayeringOption = Layering;
            layeredDigraphLayout.AggressiveOption = Aggressive;
            layeredDigraphLayout.PackOption = LayeredDigraphPack.None;
            if (PackExpand)
            {
                layeredDigraphLayout.PackOption = layeredDigraphLayout.PackOption | LayeredDigraphPack.Expand;
            }
            if (PackStraighten)
            {
                layeredDigraphLayout.PackOption = layeredDigraphLayout.PackOption | LayeredDigraphPack.Straighten;
            }
            if (PackMedian)
            {
                layeredDigraphLayout.PackOption = layeredDigraphLayout.PackOption | LayeredDigraphPack.Median;
            }
        }

        /// <summary>
        /// 设置默认配置
        /// </summary>
        public override void SetDefaultConfig()
        {
            ConfigContext.Current.SetDouble(ConfigKeyInfo.DIRECTION_KEY, Direction);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.LAYERED_DIGRAPH_LAYER_SPACING_KEY, LayerSpacing);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.COLUMN_SPACING_KEY, ColumnSpacing);
            ConfigContext.Current.SetEnum(ConfigKeyInfo.LAYERING_KEY, Layering);
            ConfigContext.Current.SetEnum(ConfigKeyInfo.INITIALIZE_KEY, Initialize);
            ConfigContext.Current.SetEnum(ConfigKeyInfo.AGGRESSIVE_KEY, Aggressive);
            ConfigContext.Current.SetBool(ConfigKeyInfo.PACK_EXPAND_KEY, PackExpand);
            ConfigContext.Current.SetBool(ConfigKeyInfo.PACK_STRAIGHTEN_KEY, PackStraighten);
            ConfigContext.Current.SetBool(ConfigKeyInfo.PACK_MEDIAN_KEY, PackMedian);
        }

    }
}