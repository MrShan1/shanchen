﻿/// <reference path="go.js" />

var myOverview = null;
var highlightColor = "red";  // color parameterization
var selectedColor = "khaki";
//window.onload = init;

//页面初始化
function init() {
    //简化定义模板，避免使用$（与jQuery冲突）
    var $$ = go.GraphObject.make;

    //#region 主视图定义
    myDiagram =
        $$(go.Diagram, "myDiagramDiv",
            {
                initialAutoScale: go.Diagram.UniformToFill,
                initialContentAlignment: go.Spot.Center,
                //validCycle: go.Diagram.CycleDestinationTree,
                //autoScale: go.Diagram.Uniform,
                //layout: $$(go.ForceDirectedLayout),
                allowDrop: true,  // support drag-and-drop from the Palette

                "grid.visible": false,
                "toolManager.hoverDelay": 300,
                "undoManager.isEnabled": true// enable undo & redo
                //"SelectionMoved": function (e) { e.diagram.layout.invalidateLayout(); }
            }
        );
    //#endregion

    //#region 自定义扩展按钮
    go.GraphObject.defineBuilder("CustomExpanderButton", function (args) {
        var button = /** @type {Panel} */ (
          go.GraphObject.make("Button",
              { // set these values for the isTreeExpanded binding conversion
                  "_treeExpandedFigure": "MinusLine",
                  "_treeCollapsedFigure": "PlusLine"
              },
              go.GraphObject.make(go.Shape,  // the icon
                {
                    name: "ButtonIcon",
                    figure: "MinusLine",  // default value for isTreeExpanded is true
                    desiredSize: new go.Size(6, 6)
                },
                // bind the Shape.figure to the Node.isTreeExpanded value using this converter:
                new go.Binding("figure", "isTreeExpanded",
                               function (exp, shape) {
                                   var button = shape.panel;
                                   return exp ? button["_treeExpandedFigure"] : button["_treeCollapsedFigure"];
                               })
                    .ofObject()),
              // assume initially not visible because there are no links coming out
              { visible: true }
                  )
        );

        // tree expand/collapse behavior
        button.click = function (e, button) {
            var node = button.part;
            if (node instanceof go.Adornment) node = node.adornedPart;
            if (!(node instanceof go.Node)) return;
            var diagram = node.diagram;
            if (diagram === null) return;
            var cmd = diagram.commandHandler;
            if (node.isTreeExpanded) {
                if (!cmd.canCollapseTree(node)) return;
            } else {
                if (!cmd.canExpandTree(node)) return;
            }
            e.handled = true;
            if (node.isTreeExpanded) {
                cmd.collapseTree(node);
            } else {
                cmd.expandTree(node);
            }
        };

        return button;
    });
    //#endregion

    //#region 动态元素模板
    var itemTemplate =
        $$(go.Panel, "Horizontal",
          new go.Binding("visible", "IsHidden", function (v) { return v === "false" ? true : false; }),
          //$$(go.Shape,
          //  {
          //      alignment: go.Spot.TopLeft,
          //      desiredSize: new go.Size(10, 10)
          //  }
          //),
          //$$(go.TextBlock,
          //  {
          //      alignment: go.Spot.TopLeft,
          //      stroke: "#333333",
          //      font: "bold 14px sans-serif"
          //  },
          //  new go.Binding("text", "Name", function (v) { return v + " : "; })
          //),
          $$(go.TextBlock,
            {
                stroke: "#333333", width: 100,
                font: "bold 14px sans-serif",
                textAlign: "start",
                wrap: go.TextBlock.WrapFit
            },
            new go.Binding("text", "Value")
          )
        );
    //#endregion

    //#region 视图节点模板
    var nodeTemplateForDiagram = $$(go.Node, "Auto",
        {
            selectionAdorned: true,
            selectionChanged: nodeSelectionChanged,
            doubleClick: showProperty,
            mouseEnter: function (e, node) {
                if (document.getElementById("highlightLinkId").dataset.visible === "true") {
                    if (node.diagram === myDiagram) {
                        node.deletable = false;
                        node.diagram.clearHighlighteds();

                        //控制节点连接文本显示与否
                        myDiagram.links.each(function (obj) {
                            var linksText = obj.findObject("LIST");
                            linksText.visible = false;
                        });

                        node.linksConnected.each(function (l) {
                            highlightLink(l, true);
                            showLinkText(l, true);
                        });

                        node.isHighlighted = true;
                    }
                }
            },
            mouseLeave: function (e, node) {
                if (document.getElementById("highlightLinkId").dataset.visible === "true") {
                    node.deletable = true;
                    //node.diagram.nodes.allowDelete = false;
                    node.diagram.clearHighlighteds();

                    //控制节点连接文本显示与否
                    myDiagram.links.each(function (obj) {
                        var linksText = obj.findObject("LIST");
                        linksText.visible = true;
                    });
                }
            }
        },
        //节点图形
        $$(go.Shape, "RoundedRectangle",
            {
                name: "NODE",
                fromLinkable: true,
                toLinkable: true,
                portId: "",
                fill: "transparent",
                width: 100,
                cursor: "pointer",
                fromSpot: go.Spot.Default,
                toSpot: go.Spot.Default
            },
            new go.Binding("stroke", "isHighlighted",
             function (h) { return h ? highlightColor : "transparent"; })
            .ofObject()
        ),
        //信息面板
        $$(go.Panel, "Vertical",
            {
                alignment: go.Spot.Center
            },
            //照片信息
            $$(go.Picture,
                {
                    name: 'Picture',
                    desiredSize: new go.Size(40, 50),
                    margin: new go.Margin(5, 5, 5, 5)
                },
                new go.Binding("source", "Image")
            ),
            $$(go.Panel, "Vertical",
                {
                    name: "LIST",
                    padding: 3,
                    alignment: go.Spot.TopLeft,
                    defaultAlignment: go.Spot.Left,
                    stretch: go.GraphObject.Horizontal,
                    itemTemplate: itemTemplate
                },
                new go.Binding("itemArray", "PropertyValues")
            ),
            $$("CustomExpanderButton",
                {
                    name: "EXPANDER",
                    visible: false
                }
            )
        )
    );
    //指定为视图的节点模板
    myDiagram.nodeTemplate = nodeTemplateForDiagram;
    //#endregion

    //#region 模板管理器节点模板
    var nodeTemplateForPalette =
        $$(go.Node, "Auto",
            {
                selectionAdorned: true,
            },
            //节点图形
            $$(go.Shape, "RoundedRectangle",
                {
                    name: "NODE",
                    fromLinkable: true,
                    toLinkable: true,
                    portId: "",
                    fill: "transparent",
                    width: 100,
                    cursor: "pointer",
                    fromSpot: go.Spot.Default,
                    toSpot: go.Spot.Default
                }
            ),
            //信息面板
            $$(go.Panel, "Vertical",
                {
                    alignment: go.Spot.Center
                },
                //照片信息
                $$(go.Picture,
                    {
                        name: 'Picture',
                        desiredSize: new go.Size(40, 50),
                        margin: new go.Margin(5, 5, 5, 5)
                    },
                    new go.Binding("source", "Image")
                ),
                $$(go.Panel, "Vertical",
                    {
                        name: "LIST",
                        padding: 3,
                        alignment: go.Spot.TopLeft,
                        defaultAlignment: go.Spot.Left,
                        stretch: go.GraphObject.Horizontal,
                        itemTemplate: itemTemplate
                    },
                    new go.Binding("itemArray", "PropertyValues")
                )
            )
        );
    //#endregion

    //#region 节点右键菜单
    nodeTemplateForDiagram.contextMenu =
        $$(go.Adornment, "Vertical");
    //#endregion

    //#region 节点模板地图
    myDiagram.nodeTemplate = nodeTemplateForDiagram;
    //#endregion

    //#region 链接模板
    myDiagram.linkTemplate =
        $$(go.Link,
            {
                curve: go.Link.Bezier,
                selectionAdorned: true,
                routing: go.Link.Normal,
                relinkableFrom: true,
                relinkableTo: true,
                selectable: true,
                doubleClick: function (e, obj) { showProperty(e, obj); }
            },
            //链接的线
            $$(go.Shape,
                { name: "LINK" },
                //new go.Binding("stroke", "Color"),
                //new go.Binding("strokeWidth", "Thickness", function (v) { return parseInt(v) }),
                new go.Binding("stroke", "isHighlighted",
                        function (h, shape) { return h ? highlightColor : shape.part.data.Color; })
                    .ofObject(),
                new go.Binding("strokeWidth", "isHighlighted",
                                function (h, shape) { return h ? 2 : parseInt(shape.part.data.Thickness); })
                            .ofObject()
            ),
            //链接的开始箭头
            $$(go.Shape,
                {
                    fromArrow: "",
                    scale: 1.5
                },
                new go.Binding("fromArrow", "FromArrowType"),
                //new go.Binding("stroke", "Color"),
                new go.Binding("stroke", "isHighlighted",
                        function (h, shape) { return h ? highlightColor : shape.part.data.Color; })
                    .ofObject(),
                new go.Binding("strokeWidth", "isHighlighted",
                        function (h, v) { return h ? 2 : parseInt(v); })
                    .ofObject(),
                new go.Binding("fill", "Color")
            ),
            //链接的结束箭头
            $$(go.Shape,
                {
                    toArrow: "Standard",
                    scale: 1.5
                },
                new go.Binding("toArrow", "ToArrowType"),
                //new go.Binding("stroke", "Color"),
               new go.Binding("stroke", "isHighlighted",
                        function (h, shape) { return h ? highlightColor : shape.part.data.Color; })
                    .ofObject(),
                new go.Binding("strokeWidth", "isHighlighted",
                        function (h, v) { return h ? 2 : parseInt(v); })
                    .ofObject(),
                new go.Binding("fill", "Color")
            ),
            //链接的文本
            $$(go.Panel, "Vertical",
                {
                    name: "LIST",
                    padding: 3,

                    alignment: go.Spot.TopLeft,
                    defaultAlignment: go.Spot.Left,
                    stretch: go.GraphObject.Horizontal,
                    itemTemplate: itemTemplate
                },
                new go.Binding("itemArray", "PropertyValues")
            )
         );
    //#endregion

    //#region 外部元素添加监听器
    myDiagram.addDiagramListener("ExternalObjectsDropped", addPaletteElement);
    //#endregion

    //#region 监听事件改变状态栏
    myDiagram.addChangedListener(function (e) {
        var nodenum = 0;
        myDiagram.nodes.each(function (node) {
            nodenum = nodenum + 1;
        });
        document.getElementById("nodeNum").innerText = nodenum;

        var linknum = 0;
        myDiagram.links.each(function (link) {
            linknum = linknum + 1;
        });
        document.getElementById("linkNum").innerText = linknum;

    });
    //#endregion

    //#region 视区边界改变事件
    myDiagram.addDiagramListener("ViewportBoundsChanged", function (e) {
        var scale = e.diagram.scale;

        //if (scale < 0.1) {
        //    e.diagram.scale = 0.1;
        //}
        //else if (scale > 4) {
        //    e.diagram.scale = 4;
        //}

        //设定滑块值
        var mySlider = document.getElementById("mySlider");
        mySlider.value = myDiagram.scale * 100;

        var sliderValueLabel = document.getElementById("scaleId");
        sliderValueLabel.innerText = mySlider.value + "%";

    });
    //#endregion

    //#region 视图的鼠标移动事件
    myDiagram.toolManager.doMouseMove = function () {
        go.ToolManager.prototype.doMouseMove.call(myDiagram.toolManager);
        var myMagnifierDiv = document.getElementById("myMagnifierDiv");
        //使放大镜显示在鼠标位置
        if (myMagnifierDiv.style.display !== "none") {
            var e = myDiagram.lastInput;
            var osize = myMagnifier.viewportBounds.size;
            myMagnifier.position = new go.Point(e.documentPoint.x - osize.width / 2, e.documentPoint.y - osize.height / 2);

            //控制放大镜的x轴位置
            if ((myMagnifier.documentBounds.x < (e.documentPoint.x - osize.width / 2))
                && (e.documentPoint.x + osize.width / 2) < (myMagnifier.documentBounds.x + myMagnifier.documentBounds.width)) {
                myMagnifierDiv.style.left = (e.viewPoint.x + myMagnifierDiv.scrollWidth / 2) + "px";
            }
            //控制放大镜的Y轴位置
            if ((myMagnifier.documentBounds.y < (e.documentPoint.y - osize.height / 2))
                && (e.documentPoint.y + osize.height / 2) < (myMagnifier.documentBounds.y + myMagnifier.documentBounds.height)) {
                myMagnifierDiv.style.top = (e.viewPoint.y) + "px";
            }
        }
    };
    //#endregion

    //#region 放大镜视图
    myMagnifier =
        $$(go.Overview, myMagnifierDiv,  // the HTML DIV element for the Overview
            {
                observed: myDiagram,   // tell it which Diagram to show
                initialScale: 1.5,  // zoom in even more than normal
                autoScale: go.Diagram.None,  // don't show whole observed Diagram
                hasHorizontalScrollbar: false,  // don't show any scrollbars
                hasVerticalScrollbar: false
            }
        );

    // disable all mouse-down tools
    myMagnifier.toolManager.mouseDownTools.each(function (t) { t.isEnabled = false; });

    // handle mouse moves within the Overview by redirecting the events to the myDiagram
    myMagnifier.doMouseMove = function () {
        var pt = myMagnifier.lastInput.documentPoint.copy();
        var e = myDiagram.lastInput;
        e.documentPoint = pt;
        e.viewPoint = myDiagram.transformDocToView(e.documentPoint);
        myDiagram.toolManager.doMouseMove();
    };
    //#endregion

    //#region 模板管理器
    myPalette =
        $$(go.Palette, "myPalette",
            {
                nodeTemplate: nodeTemplateForPalette,
                autoScale: go.Diagram.Uniform  // everything always fits in viewport
            }
        );
    //#endregion

    jQuery.getJSON("test/json/Person_1.js", load);

    //load(dataInfo());

}

// ajax后台读取json数据
//var datajson;
//function dataInfo() {
//    $.ajax({
//        type: "post",
//        url: "ashx/Datahandler.ashx",
//        data: { "type": "loaddatajson" },
//        dataType: "json",
//        async: false,
//        success: function (data) {
//            datajson = data;
//        }
//    });
//    return datajson;
//}

//加载面板
function load(data) {
    //解析json数据
    var modeldata = analysisJsonData(data);

    //设定面板模型
    myDiagram.model = new go.GraphLinksModel(modeldata.nodeDataArray, modeldata.linkDataArray);

    //生成右键菜单
    createContextMenu(modeldata.linkTypes, myDiagram);

    //获取模板管理器元素
    getPaletteItems(modeldata.nodeTypes, myPalette);

    //显示节点筛选面板
    showNodeFilterTable(modeldata.nodeTypes);

    //选择布局
    selectLayout(modeldata.layout);

    //新增链接监听器
    myDiagram.addDiagramListener("LinkDrawn", function (e) { addNewLink(e, modeldata.linkTypes) });

    //初始显示节点扩展按钮
    myDiagram.nodes.each(function (obj) {
        var expanderButton = obj.findObject("EXPANDER");
        if (obj.isTreeLeaf === false) {
            expanderButton.visible = true;
        }
    });
}

//解析json数据
function analysisJsonData(data) {
    var layout = data.Layout;
    var nodeTypes = [];
    var linkTypes = [];
    var nodes = [];
    var links = [];

    for (var i = 0; i < data.NodeTypes.length; i++) {
        nodeTypes[data.NodeTypes[i].Id] = data.NodeTypes[i];
    }
    for (var i = 0; i < data.LinkTypes.length; i++) {
        linkTypes[data.LinkTypes[i].Id] = data.LinkTypes[i];
    }
    for (var i = 0; i < data.Nodes.length; i++) {
        nodes[data.Nodes[i].Id] = data.Nodes[i];
    }
    for (var i = 0; i < data.Links.length; i++) {
        links[data.Links[i].Id] = data.Links[i];
    }

    var nodeDataArray = [];
    for (var key in nodes) {
        var originalNode = nodes[key];
        var finalNode = [];
        var nodeType;

        finalNode.key = originalNode.Id;
        finalNode.NodeTypeId = originalNode.NodeTypeId;
        finalNode.Image = originalNode.Image;
        finalNode.PropertyValues = originalNode.PropertyValues;
        //finalNode.category = "NODE_TEMPLATE";

        nodeType = nodeTypes[finalNode.NodeTypeId];
        for (var m = 0; m < finalNode.PropertyValues.length; m++) {
            var propertyValue = finalNode.PropertyValues[m];
            for (var n = 0; n < nodeType.Properties.length; n++) {
                var property = nodeType.Properties[n];
                if (propertyValue.Key === property.Key) {
                    propertyValue.Name = property.Name;
                    propertyValue.IsHidden = property.IsHidden;
                    break;
                }
            }
        }

        nodeDataArray.push(finalNode);
    }

    var linkDataArray = [];
    for (var key in links) {
        var originalLink = links[key];
        var finalLink = [];
        var linkType;

        finalLink.key = originalLink.Id;
        finalLink.LinkTypeId = originalLink.LinkTypeId;
        finalLink.from = originalLink.FromId;
        finalLink.to = originalLink.ToId;
        finalLink.PropertyValues = originalLink.PropertyValues;

        linkType = linkTypes[finalLink.LinkTypeId];
        finalLink.Color = linkType.Color;
        finalLink.Thickness = linkType.Thickness;
        finalLink.FromArrowType = linkType.FromArrowType;
        finalLink.ToArrowType = linkType.ToArrowType;

        for (var m = 0; m < finalLink.PropertyValues.length; m++) {
            var propertyValue = finalLink.PropertyValues[m];
            for (var n = 0; n < linkType.Properties.length; n++) {
                var property = linkType.Properties[n];
                if (propertyValue.Key === property.Key) {
                    propertyValue.Name = property.Name;
                    propertyValue.IsHidden = property.IsHidden;
                    break;
                }
            }
        }

        linkDataArray.push(finalLink);
    }

    var modelData = [];
    modelData.layout = layout;
    modelData.nodeTypes = nodeTypes;
    modelData.linkTypes = linkTypes;
    modelData.nodeDataArray = nodeDataArray;
    modelData.linkDataArray = linkDataArray;

    return modelData;
}

//生成右键菜单
function createContextMenu(linkTypes, diagram) {
    var $$ = go.GraphObject.make;
    var contextMenu = diagram.nodeTemplate.contextMenu;

    for (var key in linkTypes) {
        var textBlock = new go.TextBlock();
        textBlock.text = "关联" + linkTypes[key].Name;

        var button =  new $$("ContextMenuButton");
        button.add(textBlock);
        button.name = linkTypes[key].Id;
        button.click = function (e, obj) {
            doContextMenuItemClick(e, obj);
        }

        contextMenu.add(button);
    }
}

//执行右键菜单元素点击动作
function doContextMenuItemClick(e, obj) {
    var adorn = obj.part;
    var diagram = adorn.diagram;
    var oldnode = adorn.adornedPart;
    var olddata = oldnode.data;

    //获取拓展数据
    getExpandedDatas(olddata, obj.name, diagram);
}

//获取拓展数据
function getExpandedDatas(olddata, relationType, diagram) {
    if (olddata.key !== null || olddata.key !== undefined) {
        var startDateTime = Date.now();

        diagram.startTransaction("AddData");

        jQuery.ajax({
            url: "test/json/" + "Person_All_Person_1_New_100.js",
            async: false,
            success: function (data) {
                        

                //解析json数据
                var modeldata = analysisJsonData(data);

                var nodeArray = modeldata.nodeDataArray;
                for (var i = 0; i < nodeArray.length; i++) {
                    var node = nodeArray[i];

                    if (diagram.model.findNodeDataForKey(node.key) === null) {
                        diagram.model.addNodeData(node);
                    }
                }

                var linkArray = modeldata.linkDataArray;
                for (var i = 0; i < linkArray.length; i++) {
                    var link = linkArray[i];
                    var isExist = false;

                    for (var j = 0; j < diagram.model.linkDataArray.length; j++) {
                        var tempLinkData = diagram.model.linkDataArray[j];
                        if (tempLinkData.from === link.from
                            && tempLinkData.to === link.to) {
                            isExist = true;
                            break;
                        }
                    }

                    if (isExist === false) {
                        diagram.model.addLinkData(link);
                    }
                }

                        
            },
            dataType: "json"
        });

        diagram.commitTransaction("AddData");

        var endDateTime = Date.now();

        alert("耗时" + (endDateTime - startDateTime) + "毫秒");
    }
}

//获取模板管理器元素
function getPaletteItems(nodeTypes, palette) {
    for (var key in nodeTypes) {
        var nodeType = nodeTypes[key];
        var nodeData = [];

        nodeData.key = "undefined";
        nodeData.NodeTypeId = nodeType.Id;
        nodeData.Image = nodeType.DefaultImage;
        nodeData.PropertyValues = [];

        for (var i = 0; i < nodeType.Properties.length; i++) {
            var property = nodeType.Properties[i];
            var propertyValue = [];

            propertyValue.Key = property.Key;
            propertyValue.Name = property.Name;
            propertyValue.IsHidden = property.IsHidden;
            propertyValue.Value = "undefined";

            nodeData.PropertyValues.push(propertyValue);
        }

        palette.model.addNodeData(nodeData);
    }
}

//视图适应屏幕
function fitScreen() {
    myDiagram.startTransaction("initialize");

    //重置视图的初始化内设定
    myDiagram.delayInitialization();

    myDiagram.commitTransaction("initialize");

    myDiagram.startTransaction("fitScreen");

    //视图适应屏幕
    myDiagram.zoomToFit();

    //重新设定滑块值为默认值
    //var mySlider = document.getElementById("mySlider");
    //mySlider.value = myDiagram.scale * 100;

    myDiagram.commitTransaction("fitScreen");
}

//显示放大镜
function showMagnifier(obj) {
    var myMagnifierDiv = document.getElementById("myMagnifierDiv");
    if (myMagnifierDiv === undefined) {
        return;
    }

    if (obj.dataset.visible === "false") {
        obj.dataset.visible = "true";
        obj.style.backgroundColor = selectedColor;
        obj.style.borderRadius = "8px";

        // show DIV
        myMagnifierDiv.style.display = "inline";
    } else {
        obj.dataset.visible = "false";
        obj.style.backgroundColor = "";

        // hide DIV
        myMagnifierDiv.style.display = "none";
    }
}

//显示全景视图
function showOverview(obj) {
    var myOverviewDiv = document.getElementById("myOverviewDiv");
    if (myOverviewDiv === undefined) {
        return;
    }

    if (obj.dataset.visible === "false") {
        obj.dataset.visible = "true";
        obj.style.backgroundColor = selectedColor;
        obj.style.borderRadius = "8px";

        // show DIV
        myOverviewDiv.style.display = "inline";

        if (myOverview === null) {
            var $$ = go.GraphObject.make
            myOverview =
                $$(go.Overview, "myOverviewDiv",
                    {
                        observed: myDiagram,
                        contentAlignment: go.Spot.Center
                    }
                );
        }
    } else {
        obj.dataset.visible = "false";
        obj.style.backgroundColor = "";

        // hide DIV
        myOverviewDiv.style.display = "none";
    }
}

//显示网格
function showGridLine(obj) {
    if (myDiagram === undefined) {
        return;
    }

    if (obj.dataset.visible === "false") {
        obj.dataset.visible = "true";
        obj.style.backgroundColor = selectedColor;
        obj.style.borderRadius = "8px";

        myDiagram.grid.visible = true;
    } else {
        obj.dataset.visible = "false";
        obj.style.backgroundColor = "";

        myDiagram.grid.visible = false;
    }
}

//显示节点扩展按钮
function showExpanderButton(obj) {
    var isChecked;
    if (obj.dataset.visible === "false") {
        obj.dataset.visible = "true";
        obj.style.backgroundColor = selectedColor;
        obj.style.borderRadius = "8px";

        isChecked = true;
    } else {
        obj.dataset.visible = "false";
        obj.style.backgroundColor = "";

        isChecked = false;
    }

    myDiagram.nodes.each(function (obj) {
        var expanderButton = obj.findObject("EXPANDER");
        if (isChecked && obj.isTreeLeaf === false) {
            expanderButton.visible = true;
        }
        else {
            expanderButton.visible = false;
            //不显示节点扩展按钮时，所有节点都展开
            obj.isTreeExpanded = true;
        }
    });
}

//视图的放大与缩小
function changeScale(value) {
    //设定视图大小
    myDiagram.scale = value * 0.01;

    var sliderValueLabel = document.getElementById("scaleId");
    sliderValueLabel.innerText = value + "%";
}

//选择颜色
function selectColor(value) {
    if (myDiagram.selection !== null && myDiagram.selection.count > 0) {
        myDiagram.selection.each(function (obj) {
            if (obj instanceof go.Node) {
                var tb = obj.findObject("NODE");
                if (tb !== null) tb.fill = value;
            }
            else if (obj instanceof go.Link) {
                var tb = obj.findObject("LINK");
                if (tb !== null) tb.stroke = value;
            }
        });
    }
}

//选择形状
function selectShape(value) {
    if (myDiagram.selection !== null && myDiagram.selection.count > 0) {
        myDiagram.selection.each(function (obj) {
            if (obj instanceof go.Node) {
                var tb = obj.findObject("NODE");
                if (tb !== null) tb.figure = value;
            }
        });
    }
}

//选择布局
function selectLayout(value) {
    myDiagram.startTransaction("Layout");

    var layout;
    switch (value) {
        case "TreeLayout":
            layout = new go.TreeLayout();
            layout.nodeSpacing = 50;
            layout.layerSpacing = 100;
            layout.angle = 90;
            break;
        case "CircularLayout":
            layout = new go.CircularLayout();
            layout.spacing = 50;
            break;
        case "ForceDirectedLayout":
            layout = new go.ForceDirectedLayout();
            //layout.arrangementSpacing = new go.Size(150,150);
            break;
        case "LayeredDigraphLayout":
            layout = new go.LayeredDigraphLayout();
            layout.layerSpacing = 150;
            layout.angle = 90;
            break;
        default:
            layout = new go.GridLayout();
            layout.spacing = new go.Size(20, 20);;
            break;
    }

    layout.isInitial = true;
    //layout.isOngoing = false;
    myDiagram.layout = layout;

    myDiagram.commitTransaction("Layout");
}

//在属性面板上显示视图元素的详细属性
function showProperty(e, obj) {
    var elementData = obj.part.data;

    //非视图元素
    if (myDiagram.findNodeForData(elementData) === null
        && myDiagram.findLinkForData(elementData) === null) {
        return;
    }

    //确认是否为新增节点
    var index = elementData.key.indexOf('NewItem');
    var disabled = true;
    //新增节点时，可编辑
    if (index === 0) {
        disabled = false;
    }

    //获取属性面板
    var propertyTable = document.getElementById("propertyTable");
    //清空属性面板的内容
    propertyTable.innerHTML = "";

    //属性键列的模板
    var tdKeyTemplate = document.createElement("td");
    tdKeyTemplate.width = "90px";
    tdKeyTemplate.style = "text-align: left";
    //属性值列的模板
    var tdValueTemplate = document.createElement("td");
    tdValueTemplate.width = "110px";
    tdValueTemplate.style = "text-align: left";
    //文本框的模板
    var textboxTemplate = document.createElement("input");
    textboxTemplate.setAttribute("type", "text");

    //添加ID信息
    var tr = document.createElement("tr");
    var tdKey_Id = tdKeyTemplate.cloneNode(true);
    tdKey_Id.innerHTML = "ID";
    var tdValue_Id = tdValueTemplate.cloneNode(true);
    var textbox_Id = textboxTemplate.cloneNode(true);
    textbox_Id.setAttribute("value", elementData.key);
    textbox_Id.setAttribute("disabled", true);
    tdValue_Id.appendChild(textbox_Id);

    tr.appendChild(tdKey_Id);
    tr.appendChild(tdValue_Id);
    propertyTable.appendChild(tr);

    //添加类型信息
    var tr = document.createElement("tr");
    var tdKey_Type = tdKeyTemplate.cloneNode(true);
    tdKey_Type.innerHTML = "类型";
    var tdValue_Type = tdValueTemplate.cloneNode(true);
    var textbox_Type = textboxTemplate.cloneNode(true);
    if (elementData.NodeTypeId !== undefined) {
        textbox_Type.setAttribute("value", elementData.NodeTypeId);
    }
    else {
        textbox_Type.setAttribute("value", elementData.LinkTypeId);
    }
    textbox_Type.setAttribute("disabled", true);
    tdValue_Type.appendChild(textbox_Type);

    tr.appendChild(tdKey_Type);
    tr.appendChild(tdValue_Type);
    propertyTable.appendChild(tr);

    //添加其他属性信息
    for (var i = 0; i < elementData.PropertyValues.length; i++) {
        var propertyValue = elementData.PropertyValues[i];
        var tr = document.createElement("tr");

        var tdKey = tdKeyTemplate.cloneNode(true);
        tdKey.innerHTML = propertyValue.Name;
        var tdValue = tdValueTemplate.cloneNode(true);
        var textbox = textboxTemplate.cloneNode(true);
        textbox.setAttribute("id", propertyValue.Key);
        textbox.setAttribute("value", propertyValue.Value);
        textbox.setAttribute("onchange", "updatePartData(this, '" + elementData.key + "')");
        if (disabled) {
            textbox.setAttribute("disabled", true);
        }
        tdValue.appendChild(textbox);

        tr.appendChild(tdKey);
        tr.appendChild(tdValue);
        propertyTable.appendChild(tr);
    }
}

//显示节点筛选面板
function showNodeFilterTable(nodeTypes) {
    var nodeFilterTable = document.getElementById("nodeFilterTable");

    nodeFilterTable.innerHTML = "";

    for (var key in nodeTypes) {
        var dl = document.createElement("dl");
        dl.setAttribute("class", "fl");
        dl.setAttribute("id", key);
        dl.setAttribute("onclick", "filterNode(this)");
        dl.style.backgroundColor = selectedColor;

        var dt = document.createElement("dt");
        var img = document.createElement("img");
        img.style.width = "18px";
        img.style.height = "25px";
        img.src = nodeTypes[key].DefaultImage;
        dl.appendChild(img);

        var dd = document.createElement("dd");
        dd.innerHTML = nodeTypes[key].Name;

        dl.appendChild(dt);
        dl.appendChild(dd);

        nodeFilterTable.appendChild(dl);
    }
}

//筛选节点
function filterNode(obj) {
    var type = obj.id;
    var isChecked;

    if (obj.style.backgroundColor === "") {
        obj.style.backgroundColor = selectedColor;

        isChecked = true;
    } else {
        obj.style.backgroundColor = "";

        isChecked = false;
    }

    myDiagram.startTransaction("Update");
    var nodeDataArray = myDiagram.model.nodeDataArray;

    for (var i = 0; i < nodeDataArray.length; i++) {
        var nodedata = nodeDataArray[i];
        if (nodedata === null || nodedata === undefined || nodedata.NodeTypeId !== type) {
            continue;
        }

        var node = myDiagram.findNodeForData(nodedata);
        if (node !== null) {
            node.visible = isChecked;
            node.updateTargetBindings();
        }
    }

    myDiagram.commitTransaction("Update");
}

//更新视图元素属性
function updatePartData(obj, key) {
    var nodeData = myDiagram.model.findNodeDataForKey(key);
    var linkData = null;

    if (nodeData === null) {
        for (var j = 0; j < myDiagram.model.linkDataArray.length; j++) {
            var tempLinkData = myDiagram.model.linkDataArray[j];
            if (key === tempLinkData.key) {
                linkData = tempLinkData;
                break;
            }
        }
    }

    var partData = (nodeData !== null) ? nodeData : linkData;

    if (partData !== null) {
        for (var i = 0; i < partData.PropertyValues.length; i++) {
            var propertyValue = partData.PropertyValues[i];

            if (obj.id === propertyValue.Key) {
                propertyValue.Value = obj.value;
                break;
            }
        }

        var part = myDiagram.findPartForData(partData);
        if (part !== null) {
            part.updateTargetBindings();
        }
    }
}

//添加画板元素
function addPaletteElement(e) {
    e.diagram.selection.each(function (obj) {
        var isNode = obj instanceof go.Node;
        if (isNode) {
            var nodeData = myDiagram.model.findNodeDataForKey(obj.part.data.key);
            if (nodeData !== null) {
                var guidKey = createNewGuid();
                var key = guidKey;
                //设定新的Key值
                myDiagram.model.setKeyForNodeData(nodeData, key);
            }
        }
    });
}

//添加新链接
function addNewLink(e, linkTypes) {
    var link = e.subject;
    var newLinkData = link.data;
    var fromNodeData = link.fromNode.data;
    var toNodeData = link.toNode.data;

    newLinkData.key = createNewGuid();
    newLinkData.LinkTypeId = fromNodeData.NodeTypeId + "_" + toNodeData.NodeTypeId;
    newLinkData.PropertyValues = [];

    var linkType = linkTypes[newLinkData.LinkTypeId];
    if (linkType !== undefined) {
        newLinkData.Color = linkType.Color;
        newLinkData.Thickness = linkType.Thickness;
        newLinkData.FromArrowType = linkType.FromArrowType;
        newLinkData.ToArrowType = linkType.ToArrowType;

        for (var i = 0; i < linkType.Properties.length; i++) {
            var property = linkType.Properties[i];
            var propertyValue = [];

            propertyValue.Key = property.Key;
            propertyValue.Name = property.Name;
            propertyValue.IsHidden = property.IsHidden;
            propertyValue.Value = "undefined";

            newLinkData.PropertyValues.push(propertyValue);
        }
    }

    link.updateTargetBindings();
}

//生成唯一标识符
function createNewGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return "NewItem_" + guid;
}

//一键拓展数据（伪）
function expandAllDatas() {
    myDiagram.selection.each(function (obj) {
        var isNode = obj instanceof go.Node;
        if (isNode) {
            var nodeData = myDiagram.model.findNodeDataForKey(obj.part.data.key);
            if (nodeData !== null) {
                getExpandedDatas(nodeData, nodeData.NodeTypeId + "_All", myDiagram);
            }
        }
    });
}

//——————————————————————————————————————————————

//撤销操作
function undo() {
    myDiagram.commandHandler.undo();
    nodelinkNum();
}

//恢复操作
function redo() {
    myDiagram.commandHandler.redo();
    nodelinkNum();
}

//计算视图节点连接数 状态栏显示
function nodelinkNum() {
    var nodenum = 0;
    myDiagram.nodes.each(function (node) {
        nodenum = nodenum + 1;
    });
    document.getElementById("nodeNum").innerText = nodenum;

    var linknum = 0;
    myDiagram.links.each(function (link) {
        linknum = linknum + 1;
    });
    document.getElementById("linkNum").innerText = linknum;
}

//选中居中
function selectedCenter() {
    var coll = new go.Set();
    myDiagram.nodes.each(function (node) {
        if (node.isSelected) {
            coll.add(node);
        }
    });
    if (coll.count > 0) {
        myDiagram.centerRect(myDiagram.computePartsBounds(coll));
    }
}

//显示框选缩放
function boxZoom(obj) {
    if (obj.dataset.visible === "false") {
        obj.dataset.visible = "true";
        obj.style.backgroundColor = selectedColor;
        obj.style.borderRadius = "8px";

        myDiagram.toolManager.mouseMoveTools.insertAt(2, new DragZoomingTool());
    }
    else {
        obj.dataset.visible = "false";
        obj.style.backgroundColor = "";

        myDiagram.toolManager.mouseMoveTools.each(function (t) {
            if (t.Ub === "test") {
                t.isEnabled = false;
            }
        });
    }
}

//#region 选择功能
function show(value) {
    if (value == "AllNodesSelect") {
        AllNodesSelect();
    }
    if (value == "AllLinksSelect") {
        AllLinksSelect();
    }
    if (value == "FanNodesSelect") {
        FanNodesSelect();
    }
    if (value == "FanLinksSelect") {
        FanLinksSelect();
    }
    if (value == "AllSelect") {
        AllSelect();
    }
}

function AllNodesSelect() {
    myDiagram.nodes.each(function (node) { node.isSelected = true; });
}

function AllLinksSelect() {
    myDiagram.links.each(function (link) { link.isSelected = true; });
}

function FanNodesSelect() {
    myDiagram.nodes.each(function (node) {
        if (node.isSelected) {
            node.isSelected = false;
        }
        else {
            node.isSelected = true;
        }
    });
}

function FanLinksSelect() {
    myDiagram.links.each(function (link) {
        if (link.isSelected) {
            link.isSelected = false;
        }
        else {
            link.isSelected = true;
        }
    });
}

function AllSelect() {
    myDiagram.nodes.each(function (node) { node.isSelected = true; });
    myDiagram.links.each(function (link) { link.isSelected = true; });
    //myDiagram.parts.each(function (part) { part.isSelected = true; });
}
//#endregion

//闭环分析
function selectedAnalysis() {
    var coll = new go.Set();
    myDiagram.nodes.each(function (node) {
        if (node.isSelected) {
            coll.add(node);
        }
    });
    var stack = new go.List(go.Node);
    var noNodes = new go.List(go.Node);

    if (coll.count > 0) {
        coll.each(function (node) {
            if (node.isSelected) {
                function find(source) {
                    source.findNodesConnected().each(function (n) {
                        if (n === source) return;  // ignore reflexive links
                        if (!stack.contains(n)) {  // inefficient way to check having visited
                            stack.add(n);
                            find(n);
                        }
                    });
                }

                stack.add(node);  // start the path at the begin node
                node.isSelected = false;                                         //    zwb    add   2017.1.12     选中分析节点 选中状态取消
                find(node);
            }
        });

        myDiagram.nodes.each(function (node) {
            if (!stack.contains(node)) {
                noNodes.add(node);
            }

        });
        myDiagram.removeParts(noNodes, false);
        //myDiagram.links.each(function (link) { link.isSelected = false; });             //     zwb    add    2017.1.12    集中分析删除 连接错误

        //myDiagram.commandHandler.deleteSelection();
    }

    coll.each(function (node) {
        node.isSelected = true;
    });
}

//#region 最短路径分析功能
// When a node is selected show distances from the first selected node.
// When a second node is selected, highlight the shortest path between two selected nodes.
// If a node is deselected, clear all highlights.
function nodeSelectionChanged(node) {
    if (document.getElementById("analysisPathId").dataset.visible === "true") {
        var diagram = node.diagram;
        if (diagram === null) return;
        diagram.clearHighlighteds();
        if (node.isSelected) {
            // show the distance for each node from the selected node
            var begin = diagram.selection.first();
            showDistances(begin);

            if (diagram.selection.count === 2) {
                var end = node;  // just became selected
                // highlight the shortest path
                //highlightShortestPath(begin, end);              //     zwb    del    2017.1.12

                // list all paths
                listAllPaths(begin, end);
            }
        }
    }
}

function showDistances(begin) {
    // compute and remember the distance of each node from the BEGIN node
    distances = findDistances(begin);

    // show the distance on each node
    var it = distances.iterator;                                              //     zwb    del  2017.1.10
    while (it.next()) {
        var n = it.key;
        var dist = it.value;
        myDiagram.model.setDataProperty(n.data, "distance", dist);
    }
}

// There are three bits of functionality here:
// 1: findDistances(Node) computes the distance of each Node from the given Node.
//    This function is used by showDistances to update the model data.
// 2: findShortestPath(Node, Node) finds a shortest path from one Node to another.
//    This uses findDistances.  This is used by highlightShortestPath.
// 3: collectAllPaths(Node, Node) produces a collection of all paths from one Node to another.
//    This is used by listAllPaths.  The result is remembered in a global variable
//    which is used by highlightSelectedPath.  This does not depend on findDistances.

// Returns a Map of Nodes with distance values from the given source Node.
// Assumes all links are unidirectional.
function findDistances(source) {
    var diagram = source.diagram;
    // keep track of distances from the source node
    var distances = new go.Map(go.Node, "number");
    // all nodes start with distance Infinity
    var nit = diagram.nodes;
    while (nit.next()) {
        var n = nit.value;
        distances.add(n, Infinity);
    }
    // the source node starts with distance 0
    distances.add(source, 0);
    // keep track of nodes for which we have set a non-Infinity distance,
    // but which we have not yet finished examining
    var seen = new go.Set(go.Node);
    seen.add(source);

    // keep track of nodes we have finished examining;
    // this avoids unnecessary traversals and helps keep the SEEN collection small
    var finished = new go.Set(go.Node);
    while (seen.count > 0) {
        // look at the unfinished node with the shortest distance so far
        var least = leastNode(seen, distances);
        var leastdist = distances.getValue(least);
        // by the end of this loop we will have finished examining this LEAST node
        seen.remove(least);
        finished.add(least);
        // look at all Links connected with this node
        var it = least.findLinksConnected();
        while (it.next()) {
            var link = it.value;
            var neighbor = link.getOtherNode(least);
            // skip nodes that we have finished
            if (finished.contains(neighbor)) continue;
            var neighbordist = distances.getValue(neighbor);
            // assume "distance" along a link is unitary, but could be any non-negative number.
            var dist = leastdist + 1;  //Math.sqrt(least.location.distanceSquaredPoint(neighbor.location));
            if (dist < neighbordist) {
                // if haven't seen that node before, add it to the SEEN collection
                if (neighbordist === Infinity) {
                    seen.add(neighbor);
                }
                // record the new best distance so far to that node
                distances.add(neighbor, dist);
            }
        }
    }
    return distances;
}

// Highlight links along one of the shortest paths between the BEGIN and the END nodes.
// Assume links are unidirectional.
function highlightShortestPath(begin, end) {
    highlightPath(findShortestPath(begin, end));
}

// Find a path that is shortest from the BEGIN node to the END node.
// (There might be more than one, and there might be none.)
function findShortestPath(begin, end) {
    // compute and remember the distance of each node from the BEGIN node
    distances = findDistances(begin);

    // now find a path from END to BEGIN, always choosing the adjacent Node with the lowest distance
    var path = new go.List();
    path.add(end);
    while (end !== null) {
        var next = leastNode(end.findNodesConnected(), distances);
        if (next !== null) {
            if (distances.getValue(next) < distances.getValue(end)) {
                path.add(next);  // making progress towards the beginning
            } else {
                next = null;  // nothing better found -- stop looking
            }
        }
        end = next;
    }
    // reverse the list to start at the node closest to BEGIN that is on the path to END
    // NOTE: if there's no path from BEGIN to END, the first node won't be BEGIN!
    path.reverse();
    return path;
}

function leastNode(coll, distances) {
    var bestdist = Infinity;
    var bestnode = null;
    var it = coll.iterator;
    while (it.next()) {
        var n = it.value;
        var dist = distances.getValue(n);
        if (dist < bestdist) {
            bestdist = dist;
            bestnode = n;
        }
    }
    return bestnode;
}

// Highlight a particular path, a List of Nodes.
function highlightPath(path) {
    myDiagram.clearHighlighteds();
    var i = 0
    for (i = 0; i < path.count - 1; i++) {
        var f = path.elt(i);
        var t = path.elt(i + 1);
        f.findLinksBetween(t).each(function (l) { l.isHighlighted = true; });                //   findLinksTo     ZWB   mod   2017.1.10
        f.isHighlighted = true;
        t.isHighlighted = true;
    }
}

// List all paths from BEGIN to END
function listAllPaths(begin, end) {
    // compute and remember all paths from BEGIN to END: Lists of Nodes
    paths = collectAllPaths(begin, end);
}

// A collection of all of the paths between a pair of nodes, a List of Lists of Nodes
var paths = null;

// Recursively walk the graph starting from the BEGIN node;
// when reaching the END node remember the list of nodes along the current path.
// Finally return the collection of paths, which may be empty.
// This assumes all links are unidirectional.
function collectAllPaths(begin, end) {
    var stack = new go.List(go.Node);
    var coll = new go.List(go.List);

    function find(source, end) {
        source.findNodesConnected().each(function (n) {
            if (distances.getValue(n) === (distances.getValue(source) + 1)) {

                if (n === source) return;  // ignore reflexive links
                if (n === end) {  // success
                    var path = stack.copy();
                    path.add(end);  // finish the path at the end node
                    if (path.length == (distances.getValue(end) + 1)) {
                        coll.add(path);  // remember the whole path
                        highlightPath(path);
                    }
                    // coll.add(path);  // remember the whole path
                } else if (!stack.contains(n)) {  // inefficient way to check having visited
                    stack.add(n);  // remember that we've been here for this path (but not forever)
                    find(n, end);
                    stack.removeAt(stack.count - 1);
                }  // else might be a cycle
            }
        });
    }

    stack.add(begin);  // start the path at the begin node
    find(begin, end);
    return coll;
}
// #endregion

//显示高亮直接关系
function highlightLinkId(obj) {
    if (obj.dataset.visible === "false") {
        obj.dataset.visible = "true";
        obj.style.backgroundColor = selectedColor;
        obj.style.borderRadius = "8px";

        //myDiagram.allowDelete = false;

    } else {
        obj.dataset.visible = "false";
        obj.style.backgroundColor = "";

        //myDiagram.allowDelete = true;
    }
}

//连接关系高亮显示
function highlightLink(link, show) {
    link.isHighlighted = show;
    link.fromNode.isHighlighted = show;
    link.toNode.isHighlighted = show;
}

//显示路径分析
function analysisPathId(obj) {
    if (obj.dataset.visible === "false") {
        obj.dataset.visible = "true";
        obj.style.backgroundColor = selectedColor;
        obj.style.borderRadius = "8px";

        //#region 监听鼠标点击选中节点时间
        // Override the clickSelectingTool's standardMouseSelect
        // If less than 2 nodes are selected, always add to the selection
        myDiagram.toolManager.clickSelectingTool.standardMouseSelect = function () {
            var diagram = this.diagram;
            //myDiagram.maxSelectionCount = 2;
            if (diagram === null || !diagram.allowSelect) return;
            var e = diagram.lastInput;
            var count = diagram.selection.count;
            var curobj = diagram.findPartAt(e.documentPoint, false);
            if (curobj !== null) {
                if (count < 2) {  // add the part to the selection
                    if (!curobj.isSelected) {
                        var part = curobj;
                        if (part !== null) {
                            part.isSelected = true;
                        }
                    }
                } else {
                    if (!curobj.isSelected) {
                        var part = curobj;
                        if (part !== null) {
                            diagram.select(part);
                        }
                    }
                }
            } else if (e.left && !(e.control || e.meta) && !e.shift) {
                // left click on background with no modifier: clear selection
                diagram.clearSelection();
            }
        }
    }
    else {
        obj.dataset.visible = "false";
        obj.style.backgroundColor = "";

        myDiagram.clearSelection();
        myDiagram.clearHighlighteds();
        myDiagram.toolManager.initializeStandardTools();
    }
}

//控制连接关系文字显示与隐藏
function showLinkText(link, show) {
    var linksText = link.findObject("LIST");
    linksText.visible = true;
}