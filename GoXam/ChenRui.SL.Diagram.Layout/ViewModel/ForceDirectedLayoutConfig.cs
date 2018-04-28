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

using Northwoods.GoXam.Layout;
using ChenRui.SL.Configuration;

namespace ChenRui.SL.Diagram.Layout.ViewModel
{
    /// <summary>
    /// 弹簧布局配置
    /// </summary>
    public class ForceDirectedLayoutConfig : LayoutConfig
    {
        /// <summary>
        /// 电荷
        /// </summary>
        public double ElectricalCharge
        {
            get
            {
                return electricalCharge;
            }
            set
            {
                if (electricalCharge != value)
                {
                    electricalCharge = value;
                    OnPropertyChanged(() => ElectricalCharge);
                }
            }
        }
        private double electricalCharge;

        /// <summary>
        /// 弹簧长
        /// </summary>
        public double SpringLength
        {
            get
            {
                return springLength;
            }
            set
            {
                if (springLength != value)
                {
                    springLength = value;
                    OnPropertyChanged(() => SpringLength);
                }
            }
        }
        private double springLength;

        /// <summary>
        /// 弹簧硬度
        /// </summary>
        public double SpringStiffness
        {
            get
            {
                return springStiffness;
            }
            set
            {
                if (springStiffness != value)
                {
                    springStiffness = value;
                    OnPropertyChanged(() => SpringStiffness);
                }
            }
        }
        private double springStiffness;
        
        /// <summary>
        /// 构造函数
        /// </summary>
        public ForceDirectedLayoutConfig()
        {
            ElectricalCharge = ConfigContext.Current.GetDouble(ConfigKeyInfo.ELECTRICAL_CHARGE_KEY);
            SpringLength = ConfigContext.Current.GetDouble(ConfigKeyInfo.SPRING_LENGTH_KEY);
            SpringStiffness = ConfigContext.Current.GetDouble(ConfigKeyInfo.SPRING_STIFFNESS_KEY);
        }

        /// <summary>
        /// 设置配置
        /// </summary>
        /// <param name="layout">布局</param>
        public override void SetConfig(IDiagramLayout layout)
        {
            var forceDirectedLayout = layout as ForceDirectedLayout;
            if (forceDirectedLayout == null) return;
            forceDirectedLayout.DefaultElectricalCharge = ElectricalCharge;
            forceDirectedLayout.DefaultSpringLength = SpringLength;
            forceDirectedLayout.DefaultSpringStiffness = SpringStiffness;
        }

        /// <summary>
        /// 设置默认配置
        /// </summary>
        public override void SetDefaultConfig()
        {
            ConfigContext.Current.SetDouble(ConfigKeyInfo.ELECTRICAL_CHARGE_KEY, ElectricalCharge);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.SPRING_LENGTH_KEY, SpringLength);
            ConfigContext.Current.SetDouble(ConfigKeyInfo.SPRING_STIFFNESS_KEY, SpringStiffness);
        }

    }
}