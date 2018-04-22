/// <reference path="go.js" />

var config = {
    diagramId: null,
    viewTool: {
        paletteId: null,
        overviewId: null,
        magnifierId: null
    },
    managerTool: {
        colorManagerId: null,
        shapeManagerId: null,
        layoutManagerId: null,
        selectionManagerId: null
    },
    buttonTool: {
        undoId: null,
        redoId: null,
        fitToScreenId: null,
        centerSelectionId: null,
        analysisSelectionId: null
    },
    switchTool: {
        showMagnifierId: null,
        highlightedRelationId: null,
        showExpanderButtonId: null,
        boxZoomId: null,
        showOverviewId: null,
        showGridLineId: null,
        analysisPathId: null
    },
    tableTool: {
        nodeFilterTableId: null,
        propertyTableId: null
    },
    dataTool: {
        nodeNumId: null,
        linkNumId: null,
        scaleNumId: null,
        scaleSliderId: null
    }
};

//简化定义模板，避免使用$（与jQuery冲突）
var $$ = go.GraphObject.make;

function VirtualizationTool() {


};

//页面初始化
VirtualizationTool.prototype.init = function () {
    try {

        if (config.diagramId === null) {
            return;
        }

        //创建主视图
        myDiagram = this.createMainDiagram(config.diagramId);

        //创建自定义扩展按钮
        this.createExpanderButton();

        //创建视图节点模板
        myDiagram.nodeTemplate = this.createNodeTemplate();

        //创建视图链接模板
        myDiagram.linkTemplate = this.createLinkTemplate();

        //创建模板管理器
        if (config.viewTool.paletteId !== null) {
            //创建模板管理器
            myPalette = this.createPalette(config.viewTool.paletteId);
            myDiagram.allowDrop = true;
            this.getPaletteItems.canExcute = true;
            this.addPaletteElement.canExcute = true;
            //外部元素添加监听器
            myDiagram.addDiagramListener("ExternalObjectsDropped", this.addPaletteElement.excute);
        }

        //创建全景视图
        if (config.viewTool.overviewId !== null) {
            //创建全景视图
            myOverview = this.createOverview(config.viewTool.overviewId);
        }

        //创建放大镜视图
        if (config.viewTool.magnifierId !== null) {
            //创建放大镜视图
            myMagnifier = this.createMagnifier(config.viewTool.magnifierId);

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
        }

        //创建颜色管理器
        if (config.managerTool.colorManagerId !== null) {
            this.createColorManager(config.managerTool.colorManagerId);
        }

        //创建形状管理器
        if (config.managerTool.shapeManagerId !== null) {
            this.createShapeManager(config.managerTool.shapeManagerId);
        }

        //创建布局管理器
        if (config.managerTool.layoutManagerId !== null) {
            this.createLayoutManager(config.managerTool.layoutManagerId);
        }

        //创建选择管理器
        if (config.managerTool.selectionManagerId !== null) {
            this.createSelectionManager(config.managerTool.selectionManagerId);
        }

        //为撤销操作按钮关联点击事件
        if (config.buttonTool.undoId !== null) {
            this.addClickEventForController(config.buttonTool.undoId, this.undoOperation);
        }

        //为恢复操作按钮关联点击事件
        if (config.buttonTool.undoId !== null) {
            var undoOperation = this.undoOperation;
            var getNodesNum = this.getNodesNum;
            var getLinksNum = this.getLinksNum;

            this.addClickEventForController(config.buttonTool.undoId,
                function () {
                    undoOperation.excute();
                    getNodesNum.excute(config.dataTool.nodeNumId);
                    getLinksNum.excute(config.dataTool.linkNumId)
                });
        }

    } catch (e) {
        alert(e.toString());
    }
};

//创建主视图
VirtualizationTool.prototype.createMainDiagram = function (containerId) {
    var diagram =
        $$(go.Diagram, containerId,
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
            }
        );

    return diagram;
};

//创建自定义扩展按钮
VirtualizationTool.prototype.createExpanderButton = function () {
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
};

//创建节点模板
VirtualizationTool.prototype.createNodeTemplate = function () {
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
    var nodeTemplate = $$(go.Node, "Auto",
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
    //#endregion

    return nodeTemplate;
};

//创建链接模板
VirtualizationTool.prototype.createLinkTemplate = function () {
    //#region 链接模板
    var linkTemplate =
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

    return linkTemplate;
};

//创建模板管理器
VirtualizationTool.prototype.createPalette = function (containerId) {
    var palette =
                $$(go.Palette, containerId,
                    {
                        nodeTemplate: nodeTemplateForPalette,
                        autoScale: go.Diagram.Uniform  // everything always fits in viewport
                    }
                );

    return palette;
};

//创建全景视图
VirtualizationTool.prototype.createOverview = function (containerId) {
    var overview =
        $$(go.Overview, containerId,
            {
                observed: myDiagram,
                contentAlignment: go.Spot.Center
            }
        );

    return overview;
};

//创建放大镜视图
VirtualizationTool.prototype.createMagnifier = function (containerId) {
    var magnifier =
               $$(go.Overview, containerId,  // the HTML DIV element for the Overview
                   {
                       observed: myDiagram,   // tell it which Diagram to show
                       initialScale: 1.5,  // zoom in even more than normal
                       autoScale: go.Diagram.None,  // don't show whole observed Diagram
                       hasHorizontalScrollbar: false,  // don't show any scrollbars
                       hasVerticalScrollbar: false
                   }
               );

    // disable all mouse-down tools
    magnifier.toolManager.mouseDownTools.each(function (t) { t.isEnabled = false; });

    // handle mouse moves within the Overview by redirecting the events to the myDiagram
    magnifier.doMouseMove = function () {
        var pt = magnifier.lastInput.documentPoint.copy();
        var e = myDiagram.lastInput;
        e.documentPoint = pt;
        e.viewPoint = myDiagram.transformDocToView(e.documentPoint);
        myDiagram.toolManager.doMouseMove();
    };

    return magnifier;
};

//创建颜色管理器
VirtualizationTool.prototype.createColorManager = function (containerId) {
    var manager = document.getElementById(containerId);
    var selectColor = this.selectColor;

    for (var i = 0; i < this.Colors.length; i++) {
        var color = this.Colors[i];
        var b = document.createElement("b");

        b.onclick = (function (arg) {
            return function () {
                selectColor.excute(arg);
            }
        })(color.Value);
        b.innerHTML = color.Name;

        manager.appendChild(b);
    }
};

//创建形状管理器
VirtualizationTool.prototype.createShapeManager = function (containerId) {

    var manager = document.getElementById(containerId);
    var selectShape = this.selectShape;

    for (var i = 0; i < this.Shapes.length; i++) {
        var shape = this.Shapes[i];
        var b = document.createElement("b");

        b.onclick = (function (arg) {
            return function () {
                selectShape.excute(arg);
            }
        })(shape.Value);
        b.innerHTML = shape.Name;

        manager.appendChild(b);
    }
};

//创建布局管理器
VirtualizationTool.prototype.createLayoutManager = function (containerId) {
    var manager = document.getElementById(containerId);
    var selectLayout = this.selectLayout;

    for (var i = 0; i < this.Layouts.length; i++) {
        var layout = this.Layouts[i];
        var b = document.createElement("b");

        b.onclick = (function (arg) {
            return function () {
                selectLayout.excute(arg);
            }
        })(layout.Value);
        b.innerHTML = layout.Name;

        manager.appendChild(b);
    }
};

//创建选择管理器
VirtualizationTool.prototype.createSelectionManager = function (containerId) {
    var manager = document.getElementById(containerId);
    var selectPartSelectionWay = this.selectPartSelectionWay;

    for (var i = 0; i < this.PartSelectionWays.length; i++) {
        var selctionWay = this.PartSelectionWays[i];
        var b = document.createElement("b");

        b.onclick = (function (arg) {
            return function () {
                selectPartSelectionWay.excute(arg);
            }
        })(selctionWay.Value);
        b.innerHTML = selctionWay.Name;

        manager.appendChild(b);
    }
};

//为功能控制器关联点击事件
VirtualizationTool.prototype.addClickEventForController = function (containerId, operation) {
    var controller = document.getElementById(containerId);
    controller.onclick = operation;
};






//向视图中添加模板管理器元素
VirtualizationTool.prototype.addPaletteElement = {
    canExcute: false,
    excute: function () {
        if (!this.canExcute) {
            return;
        }

        myDiagram.selection.each(function (obj) {
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
};

//获取模板管理器元素
VirtualizationTool.prototype.getPaletteItems = {
    canExcute: false,
    excute: function (nodeTypes, palette) {
        if (!this.canExcute) {
            return;
        }

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
};

//选择颜色功能
VirtualizationTool.prototype.selectColor = {
    canExcute: false,
    excute: function (value) {
        if (!this.canExcute) {
            return;
        }

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
};

//选择形状功能
VirtualizationTool.prototype.selectShape = {
    canExcute: false,
    excute: function (value) {
        if (!this.canExcute) {
            return;
        }

        if (myDiagram.selection !== null && myDiagram.selection.count > 0) {
            myDiagram.selection.each(function (obj) {
                if (obj instanceof go.Node) {
                    var tb = obj.findObject("NODE");
                    if (tb !== null) tb.figure = value;
                }
            });
        }
    }
};

//选择布局功能
VirtualizationTool.prototype.selectLayout = {
    canExcute: false,
    excute: function (value) {
        if (!this.canExcute) {
            return;
        }

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
                //layout.epsilonDistance = 50;
                layout.maxIterations = 25;
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
};

//选择元素选择方式功能
VirtualizationTool.prototype.selectPartSelectionWay = {
    canExcute: false,
    excute: function (value) {
        if (!this.canExcute) {
            return;
        }

        if (value == "AllNodesSelect") {
            myDiagram.nodes.each(function (node) { node.isSelected = true; });
        }
        if (value == "AllLinksSelect") {
            myDiagram.links.each(function (link) { link.isSelected = true; });
        }
        if (value == "FanNodesSelect") {
            myDiagram.nodes.each(function (node) {
                if (node.isSelected) {
                    node.isSelected = false;
                }
                else {
                    node.isSelected = true;
                }
            });
        }
        if (value == "FanLinksSelect") {
            myDiagram.links.each(function (link) {
                if (link.isSelected) {
                    link.isSelected = false;
                }
                else {
                    link.isSelected = true;
                }
            });
        }
        if (value == "AllSelect") {
            myDiagram.nodes.each(function (node) { node.isSelected = true; });
            myDiagram.links.each(function (link) { link.isSelected = true; });
        }
    }
};

//撤销操作功能
VirtualizationTool.prototype.undoOperation = {
    canExcute: false,
    excute: function () {
        if (!this.canExcute) {
            return;
        }

        myDiagram.commandHandler.undo();

    }
};

//获取节点数
VirtualizationTool.prototype.getNodesNum = {
    canExcute: false,
    excute: function (controllerId) {
        if (!this.canExcute) {
            return;
        }

        var nodenum = 0;
        myDiagram.nodes.each(function (node) {
            nodenum = nodenum + 1;
        });
        document.getElementById(controllerId).innerText = nodenum;
    }
};

//获取连接数
VirtualizationTool.prototype.getLinksNum = {
    canExcute: false,
    excute: function (controllerId) {
        if (!this.canExcute) {
            return;
        }

        var linknum = 0;
        myDiagram.links.each(function (link) {
            linknum = linknum + 1;
        });
        document.getElementById(controllerId).innerText = linknum;
    }
};



//显示全景视图
VirtualizationTool.prototype.showOverview = {
    canExcute: false,
    isSwitchOn: false,
    toggleSwitch: function () {
        this.isSwitchOn = !this.isSwitchOn;
    },
    excute: function (controllerId) {
        if (!this.canExcute) {
            return;
        }

        var myOverviewDiv = document.getElementById(myOverview.div);
        if (myOverviewDiv === undefined) {
            return;
        }

        var container = document.getElementById(controllerId);
        if (myOverviewDiv === undefined) {
            return;
        }

        if (this.isSwitchOn) {
            container.style.backgroundColor = selectedColor;
            container.style.borderRadius = "8px";
            // show DIV
            myOverviewDiv.style.display = "inline";
        } else {
            container.style.backgroundColor = "";
            // hide DIV
            myOverviewDiv.style.display = "none";
        }
    }
};




//颜色集合
VirtualizationTool.prototype.Colors = [
    { Name: "蓝色", Value: "blue" },
    { Name: "红色", Value: "red" },
    { Name: "黄色", Value: "yellow" },
    { Name: "橙色", Value: "orange" }
];

//形状集合
VirtualizationTool.prototype.Shapes = [
    { Name: "长方形", Value: "Rectangle" },
    { Name: "圆形", Value: "Ellipse" },
    { Name: "三角形", Value: "TriangleRight" },
    { Name: "云型", Value: "Cloud" }
];

//选择方式集合
VirtualizationTool.prototype.PartSelectionWays = [
    { Name: "选择全部节点", Value: "AllNodesSelect" },
    { Name: "选择全部链接", Value: "AllLinksSelect" },
    { Name: "反向选择节点", Value: "FanNodesSelect" },
    { Name: "反向选择链接", Value: "FanLinksSelect" },
    { Name: "全部选择", Value: "AllSelect" }
];
