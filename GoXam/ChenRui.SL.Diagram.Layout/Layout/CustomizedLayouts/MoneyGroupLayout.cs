using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using Northwoods.GoXam;
using ChenRui.SL.Common;
using System.Windows.Media;

namespace ChenRui.SL.Diagram.Layout
{
    public class MoneyGroupLayout : Northwoods.GoXam.Layout.ForceDirectedLayout, ILocation, IReferenceNodes, ILayoutConfig, INeedRevert
    {
       /// <summary>
        /// 位置提供者
        /// </summary>
        public ILocationProvider LocationProvider { get; set; }

        /// <summary>
        /// 参考点提供者
        /// </summary>
        public IReferenceNodesProvider ReferenceNodesProvider { get; set; }

        /// <summary>
        /// 参数
        /// </summary>
        public ICollection<string> Parameters { get; set; }

        /// <summary>
        /// 还原动作
        /// </summary>
        public Action<IEnumerable<Node>> Revert { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        public MoneyGroupLayout()
        {
            Parameters = new Collection<string>();
        }

        /// <summary>
        /// 布局
        /// </summary>
        /// <param name="nodes">节点集合</param>
        /// <param name="links">链接集合</param>
        public override void DoLayout(IEnumerable<Node> nodes, IEnumerable<Link> links)
        {
            if (Revert != null)
            {
                Revert(nodes);
            }

            if (LocationProvider == null)
            {
                LocationProvider = new DefaultLocationProvider { Layout = this };
            }

            //if (LocationProvider.HasLocation)
            //{
            //    ArrangesToOrigin = true;
            //    ArrangementOrigin = LocationProvider.Location;
            //    //LogHelper.WriterDebugLog("布局开始");
            //    base.DoLayout(nodes, links);
            //    //LogHelper.WriterDebugLog("布局结束");
            //    //LogHelper.WriterDebugLog("移动位置开始");
            //    if (LocationProvider.IsLocationCenter)
            //    {
            //        var bounds = Diagram.Panel.ComputeBounds(nodes);
            //        nodes.ForEach(n => n.Location = new Point(n.Location.X - bounds.Width / 2, n.Location.Y - bounds.Height / 2));
            //    }
            //    //LogHelper.WriterDebugLog("移动位置结束");
            //}
            //else
            //{
            base.DoLayout(nodes, links);

            var bounds = Diagram.Panel.ComputeBounds(nodes);

            if (ReferenceNodesProvider == null)
            {
                ReferenceNodesProvider = new DefaultReferenceNodesProvider { Layout = this };
            }
            if (LocationProvider.ReferencePoint == null)
            {
                var referenceNodes = ReferenceNodesProvider.HasReferenceNodes ? ReferenceNodesProvider.GetReferenceNodes() : null;
                if (referenceNodes != null)
                {
                    var referenceNode = referenceNodes.FirstOrDefault();
                    if (referenceNode != null)
                    {
                        LocationProvider.ReferencePoint = new Point(referenceNode.Bounds.X + referenceNode.Bounds.Width / 2, referenceNode.Bounds.Y + referenceNode.Bounds.Height / 2);
                    }
                }
            }
            //var location = LocationProvider.GetLocation(new Size(bounds.Width, bounds.Height), nodes, links, LocationProvider.ReferencePoint == null);
            //var x = bounds.Left - location.X;
            //var y = bounds.Top - location.Y;
            //if (LocationProvider.IsLocationCenter)
            //{
            //    x = x + bounds.Width / 2;
            //    y = y + bounds.Height / 2;
            //}
            //ChenRui.SL.AnalysisDiagram.Models.PartDefine.NodeDefine.NodeData data = (nodes.ToArray()[0].Data as ChenRui.SL.AnalysisDiagram.Models.PartDefine.NodeDefine.NodeData);
            //nodes.ForEach(n => n.Location = new Point(n.Location.X - x, n.Location.Y - y));
            //}
            Point? point = new Point(0,0);
            LocationDivided ld = new LocationDivided(nodes, point, 5);
            ld.CalculateLocation();
        }

        protected class LocationDivided
        {
            protected Point? CenterPoint { get; set; }
            protected List<List<Point>> LeftPoints { get; set; }
            protected List<List<Point>> RightPoints { get; set; }

            //左侧所有的点数
            protected int LeftTotalNodeCount { get; set; }
            protected int LeftColumnCount { get; set; }
            
            //右侧所有点数
            protected int RightTotalNodeCount { get; set; }
            //右侧列数
            protected int RightColumnCount { get; set; }
            //右侧最大列数
            protected int RightMaxGroupElementCount { get; set; }

            List<Node> TotalNodeCollection { get; set; }

            Dictionary<string, List<Node>> RightTotalNodeCollection { get; set; }
            List<Node> LeftTotalNodeCollection { get; set; }
            

            Node PublicNode { get; set; }


            //右侧颜色数组
            private List<SolidColorBrush> RightColors { get; set; }
            
            private void InitColorArray()
            {
                RightColors = new List<SolidColorBrush>()
                {
                    new SolidColorBrush(Colors.Red),
                    new SolidColorBrush(Colors.Orange),
                    new SolidColorBrush(Colors.Yellow),
                    new SolidColorBrush(Colors.LightGray),
                    new SolidColorBrush(Colors.Green),
                    new SolidColorBrush(Colors.Blue),
                    new SolidColorBrush(Colors.Purple),
                    new SolidColorBrush(Colors.DarkGray)
                };

            }

            int LeftOneColumnElementCount { get; set; }

            public LocationDivided(IEnumerable<Node> totalNodeCollection, Point? centerPoint, int leftOneColumnElementCount = 5)
            {
                if (totalNodeCollection == null)
                {
                    return;
                }

                if (centerPoint == null)
                {
                    centerPoint = new Point(0, 0);
                }

                LeftPoints = new List<List<Point>>();
                RightPoints = new List<List<Point>>();
                RightTotalNodeCollection = new Dictionary<string, List<Node>>();
                LeftTotalNodeCollection = new List<Node>();
                TotalNodeCollection = totalNodeCollection.ToList();
                CenterPoint = centerPoint;
                LeftOneColumnElementCount = leftOneColumnElementCount;
                InitColorArray();
            }

            void SeparateNodes()
            {
                foreach (var node in TotalNodeCollection)
                {
                    string isPublic = GetNodePropertyValue(node, "IS_PUBLIC");
                    //如果是公共卡，做记录
                    if (isPublic.ToLower().Equals("true"))
                    {
                        PublicNode = node;
                        continue;
                    }

                    string location = GetNodePropertyValue(node, "NODE_LOCATION");
                    string nodeMoney = GetNodePropertyValue(node, "TRADING_MONEY");

                    //如果是左侧节点
                    if (location.ToLower().Equals("left"))
                    {
                        LeftTotalNodeCollection.Add(node);
                    }
                    //如果是右侧节点
                    else if (location.ToLower().Equals("right"))
                    {
                        //如果存在包含的组
                        if (RightTotalNodeCollection.Keys.Contains(nodeMoney))
                        {
                            RightTotalNodeCollection[nodeMoney].Add(node);
                        }
                        //如果不存这样的组，就穿件新的组
                        else
                        {
                            List<Node> nodeList = new List<Node>();
                            nodeList.Add(node);
                            RightTotalNodeCollection.Add(nodeMoney, nodeList);
                        }
                    }

                }
            }

            public void CalculateLocation()
            {
                //将左侧点和右侧点点分开
                SeparateNodes();
                //取得一个基点的大小（不是公共节点）
                GetNodeArea();
                //左侧分组与左侧最大数的取得
                if (LeftTotalNodeCollection.Count % LeftOneColumnElementCount == 0)
                {
                    LeftColumnCount = LeftTotalNodeCollection.Count / LeftOneColumnElementCount;
                }
                else
                {
                    LeftColumnCount = LeftTotalNodeCollection.Count / LeftOneColumnElementCount + 1;
                }

                //取得右侧分组数
                RightColumnCount = RightTotalNodeCollection.Keys.Count;
                //取得右侧分组中，组中元素最多的那个
                foreach (var rightNode in RightTotalNodeCollection.Values)
                {
                    if (rightNode.Count > RightMaxGroupElementCount)
                    {
                        RightMaxGroupElementCount = rightNode.Count;
                    }
                }

                //RightMaxGroupElementCount = RightTotalNodeCollection.value

                //分配左侧位置


                //分配右侧位置
                SetRightNodePosition();
                //分配左侧位置
                SetLeftNodePosintion();
                if (PublicNode != null)
                {
                    PublicNode.Position = new Point(CenterPoint.Value.X,CenterPoint.Value.Y);
                }
            }


            string GetNodePropertyValue(Node node,string key)
            {
                string nodeValue = string.Empty;

                ChenRui.SL.AnalysisDiagram.Models.PartDefine.NodeDefine.NodeData nodeData =
                    node.Data as ChenRui.SL.AnalysisDiagram.Models.PartDefine.NodeDefine.NodeData;

                if (nodeData == null)
                {
                    return nodeValue;
                }

                //取得交易额
                if(nodeData.Properties.Keys.Contains(key))
                {
                    nodeValue = nodeData.Properties[key];
                }
                
                return nodeValue;
            }

            double NodeWidth { get; set; }
            double NodeHeight { get; set; }

            void GetNodeArea()
            {
                foreach (var node in TotalNodeCollection)
                {
                    string isPublic = GetNodePropertyValue(node, "IS_PUBLIC");
                    //如果是公共卡，做记录
                    if (!isPublic.ToLower().Equals("true"))
                    {
                        NodeWidth = node.Width;
                        NodeHeight = node.Height;
                        break;
                    }
                }

            }

            void SetRightNodePosition()
            {

                List<List<Node>> groupList = new List<List<Node>>();
                //转化节点
                foreach (var group in RightTotalNodeCollection.Values)
                {
                    groupList.Add(group);
                }

                //按组内个数不同，从小到大排序
                for (int i = 0; i < groupList.Count;i++ )
                {
                    for (int j = i+1; j < groupList.Count; j++)
                    {
                        if (groupList[i].Count > groupList[j].Count)
                        {
                            var tempGroupList = groupList[i];
                            groupList[i] = groupList[j];
                            groupList[j] = tempGroupList;
                        }
                    }
                }

                double cx = CenterPoint.Value.X;
                double cy = CenterPoint.Value.Y;

                //最上面的坐标为total * height

                int colorFlag = 0;

                for (int i = 0; i < groupList.Count; i++)
                {
                    if (colorFlag + 1 == RightColors.Count)
                    {
                        colorFlag = 0;
                    }

                    int count = groupList[i].Count;
                    double maxY = 0.0;
                    //如果是偶数
                    if (count % 2 == 0)
                    {
                        maxY = count * NodeHeight / 2;
                    }
                    else
                    {
                        maxY = (count - 1) * NodeHeight / 2;
                    }

                    for (int j = 0; j < groupList[i].Count; j++)
                    {
                        double x = ((i + 1) ) *2* NodeWidth + CenterPoint.Value.X;
                        double y = maxY - NodeHeight  * j + CenterPoint.Value.Y;

                        groupList[i][j].Location = new Point(x,y);
                        groupList[i][j].LinksConnected.ToArray()[0].Path.Stroke = RightColors[colorFlag];
                    }
                    colorFlag++;
                }

                    
                    //foreach (var group in groupList)
                    //{
                    //    int count = group.Count;
                    //    double maxY = 0.0;



                    //    foreach (var oneItem in group)
                    //    {

                    //    }
                    //}


            }

            void SetLeftNodePosintion()
            {

                

                //从小到大排序
                for (int i = 0; i < LeftTotalNodeCollection.Count; i++)
                {
                    for (int j = i + 1; j < LeftTotalNodeCollection.Count; j++)
                    {
                        string sourceValue = GetNodePropertyValue(LeftTotalNodeCollection[i], "TRADING_MONEY");

                        double sourceIntValue = 0;

                        if (!double.TryParse(sourceValue, out sourceIntValue))
                        {
                            break;
                        }

                        string targetValue = GetNodePropertyValue(LeftTotalNodeCollection[j], "TRADING_MONEY");

                        double targetIntValue = 0;

                        if (!double.TryParse(targetValue, out targetIntValue))
                        {
                            break;
                        }

                        if (sourceIntValue > targetIntValue)
                        {
                            Node tempNode = LeftTotalNodeCollection[i];
                            LeftTotalNodeCollection[i] = LeftTotalNodeCollection[j];
                            LeftTotalNodeCollection[j] = tempNode;

                        }
                    }
                }

                List<string> dicValue = new List<string>();
                //取得最大的前三项
                for (int i = 0; i < LeftTotalNodeCollection.Count; i++)
                {
                    string value = GetNodePropertyValue(LeftTotalNodeCollection[i], "TRADING_MONEY");
                    if (!dicValue.Contains(value))
                    {
                        dicValue.Add(value);
                    }
                }

                if (dicValue.Count > 3)
                {
                    for (int i = 0; i < dicValue.Count-3; i++)
                    {
                        dicValue.RemoveAt(i);
                        i--;
                    }
                }

                double cx = CenterPoint.Value.X;
                double cy = CenterPoint.Value.Y;

                double maxY = 0.0;

                int totalElementCount = 1;
                //如果分组内的元素个数小于要求的一个组的个数，就去当前个数
                if (LeftTotalNodeCollection.Count < LeftOneColumnElementCount)
                {
                    totalElementCount = LeftTotalNodeCollection.Count;
                }
                else
                {
                    totalElementCount = LeftOneColumnElementCount;
                }

                //如果是偶数
                if (LeftOneColumnElementCount % 2 == 0)
                {
                    maxY = totalElementCount * NodeHeight / 2;
                }
                else
                {
                    maxY = (totalElementCount - 1) * NodeHeight / 2;
                }

                int elementCount = 0;
                int groupCount =0;

                string tradingValue = string.Empty;
                int  stokenThikness = 1;
                foreach (var item in LeftTotalNodeCollection)
                {
                    string value = GetNodePropertyValue(item, "TRADING_MONEY");

                    if (!value.Equals(tradingValue) &&
                        stokenThikness<=4)
                    {
                        //stokenThikness += 1;
                    }

                    if (elementCount % LeftOneColumnElementCount==0)
                    {
                        groupCount++;
                        elementCount = 0;
                    }
                    double x = cx - groupCount * NodeWidth*2;
                    double y = maxY - NodeHeight * elementCount + CenterPoint.Value.Y;
                    item.Location = new Point(x,y);
                    elementCount++;



                    if (dicValue.Contains(value))
                    {
                        int index = dicValue.IndexOf(value);
                        switch (index)
                        {
                            case 0:
                                item.LinksConnected.ToArray()[0].Path.StrokeThickness = 10;
                                item.LinksConnected.ToArray()[0].Path.Stroke = new System.Windows.Media.SolidColorBrush(Colors.Blue);
                                //LinkPanel.SetToArrowScale(item.LinksConnected.ToArray()[0].Path, 10);
                                
                                break;
                            case 1:
                                item.LinksConnected.ToArray()[0].Path.StrokeThickness = 15;
                                item.LinksConnected.ToArray()[0].Path.Stroke = new System.Windows.Media.SolidColorBrush(Colors.Orange);
                                //LinkPanel.SetToArrowScale(item.LinksConnected.ToArray()[0].Path, 15);
                                break;

                            case 2:
                                item.LinksConnected.ToArray()[0].Path.Stroke = new System.Windows.Media.SolidColorBrush(Colors.Red);
                                item.LinksConnected.ToArray()[0].Path.StrokeThickness = 20;
                                //LinkPanel.SetToArrowScale(item.LinksConnected.ToArray()[0].Path, 20);
                                break;
                            default: break;
                        }

                        
                    }
                    else
                    {
                        item.LinksConnected.ToArray()[0].Path.StrokeThickness = stokenThikness;
                        tradingValue = GetNodePropertyValue(item, "TRADING_MONEY");
                    }
                }
            }
        }

    }
}
