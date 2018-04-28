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

using System.Windows;
using System.Collections.Generic;
using Northwoods.GoXam;

namespace ChenRui.SL.Diagram.Layout
{
    /// <summary>
    /// 高级布局
    /// </summary>
    public class AdvancedLayout : CustomizedLayout
    {
        /// <summary>
        /// 默认组内边距
        /// </summary>
        private static readonly Size DefaultGroupPadding = new Size(100, 100);

        /// <summary>
        /// 标识GroupPadding依赖属性
        /// </summary>
        public static readonly DependencyProperty GroupPaddingProperty = DependencyProperty.Register("GroupPadding", typeof(Size), typeof(AdvancedLayout), new PropertyMetadata(DefaultGroupPadding, OnPropertyChanged));

        /// <summary>
        /// 组内边距
        /// </summary>
        public Size GroupPadding
        {
            get { return (Size)GetValue(GroupPaddingProperty); }
            set { SetValue(GroupPaddingProperty, value); }
        }

        /// <summary>
        /// 布局标识
        /// </summary>
        public string LayoutId { get; set; }

        /// <summary>
        /// 组提供者工厂
        /// </summary>
        public IGroupProviderFactory GroupProviderFactory { get; set; }

        /// <summary>
        /// 组提供者
        /// </summary>
        public IGroupProvider GroupProvider { get; set; }

        /// <summary>
        /// 根组
        /// </summary>
        public Group RootGroup { get; set; }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        /// <param name="location">位置</param>
        /// <returns>布局结果</returns>
        protected override LayoutResult DoLayout(IEnumerable<NodeHost> nodes, IEnumerable<Link> links, Point? location)
        {
            Group rootGroup;
            var isRealLayout = false;
            if (RootGroup == null)
            {
                GroupProvider = GroupProviderFactory.GetGroupProvider(nodes, links);
                GroupProvider.Layout = this;
                rootGroup = GroupProvider.GetGroup(nodes, links);
            }
            else
            {
                rootGroup = RootGroup;
                isRealLayout = true;
            }
            //布局失败，是指由不知道如果布局的
            if (!LayoutGroup(rootGroup, location, isRealLayout))
            {
                RootGroup = rootGroup;
                return new LayoutResult(new Size(rootGroup.Width, rootGroup.Height), true);
            }
            //真的去布局组中的组
            LayoutGroupSecondTime(rootGroup, location);
            //把组的位置转化为点的位置
            GetLocation(rootGroup, location);
            //相当于flag，用于控制 rootGroup = GroupProvider.GetGroup(nodes, links)是否执行
            RootGroup = null;
            if (!Parameters.Contains("ChangeConfigLayout"))
            {
                Parameters.Add("ChangeConfigLayout");
            }
            return new LayoutResult(new Size(rootGroup.Width, rootGroup.Height));
        }

        /// <summary>
        /// 布局组
        /// </summary>
        /// <param name="group">组</param>
        /// <param name="location">位置</param>
        /// <param name="isRealLayout">是否为真布局</param>
        /// <returns>返回布局结果</returns>
        private bool LayoutGroup(Group group, Point? location, bool isRealLayout)
        {
            var r = true;
            group.Items.ForEach(i =>
            {
                var g = i as Group;
                if (g != null)
                {
                    if (!LayoutGroup(g, location, isRealLayout))
                    {
                        r = false;
                    }
                }
            });
            //第一次进来是假布局，所以当真布局时就不要重复操作了
            if (!isRealLayout)
            {
                if (group.GroupTransformProvider != null)
                {
                    //给用户操作组内节点和链接的机会
                    group.GroupTransformProvider.Transform();
                }
            }
            //尝试布局组里面的节点和组
            if (group.GroupLayoutProvider != null)
            {
                group.GroupLayoutProvider.Location = location;
                if (!group.GroupLayoutProvider.Layout(false))
                {
                    r = false;
                }
            }
            return r;
        }

        /// <summary>
        /// 第二次布局组
        /// </summary>
        /// <param name="group">组</param>
        /// <param name="location">位置</param>
        private void LayoutGroupSecondTime(Group group, Point? location)
        {
            if (group.GroupLayoutProvider != null)
            {
                group.GroupLayoutProvider.Location = location;
                //真正的去布局组中的组和点
                group.GroupLayoutProvider.Layout(true);
            }
            group.Items.ForEach(i =>
            {
                var g = i as Group;
                if (g != null)
                {
                    LayoutGroupSecondTime(g, location);
                }
            });
        }

        /// <summary>
        /// 返回位置
        /// </summary>
        /// <param name="locatable">可定位</param>
        /// <param name="location">位置</param>
        private void GetLocation(ILocatable locatable, Point? location)
        {
            var l = location != null ? (Point)location : new Point(0, 0);
            var group = locatable as Group;
            if (group != null)
            {
                group.Items.ForEach(i => GetLocation(i, new Point(l.X + locatable.Location.X, l.Y + locatable.Location.Y)));
                return;
            }
            var nodeHost = locatable as NodeHost;
            if (nodeHost != null)
            {
                nodeHost.Location = new Point(l.X + locatable.Location.X, l.Y + locatable.Location.Y);
            }
        }

    }
}
