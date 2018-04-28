/// <reference path="go.js" />

var $$ = go.GraphObject.make; // 简化定义模板，避免使用$（与jQuery冲突）
var visTool = null; // 可视化工具

/**
 * 初始化可视化工具
 */
function initTool() {
    // 创建可视化工具
    visTool = new CustomVisualizationTool("diagramDiv");

    // 允许虚拟化布局
    visTool.allowVirtualize = true;

    visTool.isNewNodeSelected = true; // 节点初始为选中状态
    visTool.isNewLinkSelected = true; // 链接初始为选中状态

    // 创建全景视图工具
    visTool.overviewTool = new vis.OverviewTool("overviewDiv", visTool.diagram);

    // 创建放大镜工具
    visTool.magnifierTool = new vis.MagnifierTool("magnifierDiv", visTool.diagram);

    // 创建节点右键菜单
    visTool.configNodeContextMenu("nodeContextMenu");

    // 创建链接右键菜单
    visTool.configLinkContextMenu("linkContextMenu");

    // 创建模板管理器，指定节点模板和链接模板
    visTool.templateManager = new CustomTemplateManager();
    visTool.diagram.nodeTemplate = visTool.templateManager.nodeTemplate_Normal;
    visTool.diagram.linkTemplate = visTool.templateManager.linkTemplate_ParallelNormal;
    visTool.diagram.groupTemplate = visTool.templateManager.groupTemplate;

    // 创建工具栏管理器
    visTool.toolbarManager = new vis.ToolbarManager(visTool);
    // 为可视化工具绑定页面元素
    bindHtmlElements(visTool);

    // 指定初始布局类型
    visTool.toolbarManager.layoutConfigTool.doExcute(vis.LayoutConfigTool.ForceDirected);
    //visTool.toolbarManager.layoutConfigTool.doExcute(vis.LayoutConfigTool.Circular);

    // 监听页面的复制操作
    window.document.body.addEventListener("copy", copyDiamgramData, false);
};

/**
 * 为可视化工具绑定页面元素
 * 
 * @param visTool {CustomVisualizationTool} 自定义可视化工具
 */
function bindHtmlElements(visTool) {
    if (!visTool) {
        return;
    }

    // 绑定节点数
    visTool.bindHtmlElement("nodesCount", "nodesCount", "innerHTML");
    // 绑定连接数
    visTool.bindHtmlElement("linksCount", "linksCount", "innerHTML");
    // 绑定视图比例
    visTool.bindHtmlElement("diagramScale", "diagramScale", "innerHTML", function (value) {
        return Math.round(value * 100) + "%";
    });
    // 绑定视图比例2
    visTool.bindHtmlElement("diagramScale", "diagramScaleSlider", "value", function (value) {
        return Math.round(value * 100);
    });

    if (!visTool.toolbarManager) {
        return;
    }

    var tbManager = visTool.toolbarManager;
    // 绑定颜色配置工具
    tbManager.bindHtmlController("colorConfigTool", "color1", "click", vis.ColorConfigTool.Color0);
    tbManager.bindHtmlController("colorConfigTool", "color2", "click", vis.ColorConfigTool.Color1);
    tbManager.bindHtmlController("colorConfigTool", "color3", "click", vis.ColorConfigTool.Color2);
    tbManager.bindHtmlController("colorConfigTool", "color4", "click", vis.ColorConfigTool.Color3);
    tbManager.bindHtmlController("colorConfigTool", "color5", "click", vis.ColorConfigTool.Color4);
    // 绑定形状配置工具
    tbManager.bindHtmlController("shapeConfigTool", "shape1", "click", vis.ShapeConfigTool.Rectangle);
    tbManager.bindHtmlController("shapeConfigTool", "shape2", "click", vis.ShapeConfigTool.Ellipse);
    tbManager.bindHtmlController("shapeConfigTool", "shape3", "click", vis.ShapeConfigTool.Pentagon);
    tbManager.bindHtmlController("shapeConfigTool", "shape4", "click", vis.ShapeConfigTool.Cloud);
    // 绑定布局配置工具
    tbManager.bindHtmlController("layoutConfigTool", "layout1", "click", vis.LayoutConfigTool.Circular);
    tbManager.bindHtmlController("layoutConfigTool", "layout2", "click", vis.LayoutConfigTool.ForceDirected);
    tbManager.bindHtmlController("layoutConfigTool", "layout3", "click", vis.LayoutConfigTool.LayeredDigraph);
    tbManager.bindHtmlController("layoutConfigTool", "layout4", "click", vis.LayoutConfigTool.Grid);
    tbManager.bindHtmlController("layoutConfigTool", "layout5", "click", vis.LayoutConfigTool.Tree);
    // 绑定选择方式配置工具
    tbManager.bindHtmlController("selectionConfigTool", "selectionWay1", "click", vis.SelectionConfigTool.AllNodes);
    tbManager.bindHtmlController("selectionConfigTool", "selectionWay2", "click", vis.SelectionConfigTool.AllLinks);
    tbManager.bindHtmlController("selectionConfigTool", "selectionWay3", "click", vis.SelectionConfigTool.SameTypeNodes);
    tbManager.bindHtmlController("selectionConfigTool", "selectionWay4", "click", vis.SelectionConfigTool.SameTypeLinks);
    tbManager.bindHtmlController("selectionConfigTool", "selectionWay5", "click", vis.SelectionConfigTool.NodeRelations);
    tbManager.bindHtmlController("selectionConfigTool", "selectionWay6", "click", vis.SelectionConfigTool.LinkRelations);
    tbManager.bindHtmlController("selectionConfigTool", "selectionWay7", "click", vis.SelectionConfigTool.All);
    tbManager.bindHtmlController("selectionConfigTool", "selectionWay8", "click", vis.SelectionConfigTool.UnselectedNodes);
    tbManager.bindHtmlController("selectionConfigTool", "selectionWay9", "click", vis.SelectionConfigTool.UnselectedLinks);
    tbManager.bindHtmlController("selectionConfigTool", "selectionWay10", "click", vis.SelectionConfigTool.Unselected);

    // 绑定撤销操作工具
    tbManager.bindHtmlController("undoOperationTool", "undoOperation", "click");
    // 绑定恢复操作工具
    tbManager.bindHtmlController("redoOperationTool", "redoOperation", "click");
    // 绑定隐藏选中部分工具
    tbManager.bindHtmlController("hideSelectedPartsTool", "hideSelectedParts", "click");
    // 绑定隐藏非选中部分工具
    tbManager.bindHtmlController("hideUnselectedPartsTool", "hideUnselectedParts", "click");
    // 绑定显示隐藏部分工具
    tbManager.bindHtmlController("showHiddenPartsTool", "showHiddenParts", "click");
    // 绑定适应屏幕比例工具
    tbManager.bindHtmlController("uniformScaleTool", "uniformScale", "click");
    // 绑定初始化比例工具
    tbManager.bindHtmlController("initializeScaleTool", "initializeScale", "click");
    // 绑定选择居中工具
    tbManager.bindHtmlController("centerSelectionTool", "centerSelection", "click");
    // 绑定集中分析工具
    tbManager.bindHtmlController("analysisSelectionTool", "analysisSelection", "click");
    // 绑定初始化布局工具
    tbManager.bindHtmlController("initializeLayoutTool", "initializeLayout", "click");

    // 绑定显示放大镜工具
    tbManager.bindHtmlController("showMagnifierTool", "showMagnifier", "click");
    // 绑定显示全景视图工具
    tbManager.bindHtmlController("showOverviewTool", "showOverview", "click");
    // 绑定显示网格工具
    tbManager.bindHtmlController("showGridLineTool", "showGridLine", "click");
    // 绑定显示重要度工具
    tbManager.bindHtmlController("showImportanceTool", "showImportance", "click");
    // 绑定框选缩放工具
    tbManager.bindHtmlController("boxZoomTool", "boxZoom", "click");
    // 绑定高亮关系工具
    tbManager.bindHtmlController("highlightRelationTool", "highlightRelation", "click");
    // 绑定路径分析工具
    tbManager.bindHtmlController("analysisPathTool", "analysisPath", "click");

    // 绑定改变视图比例工具
    tbManager.bindHtmlController("changeScaleTool", "diagramScaleSlider", "input", "value", true, function (value, tool) {
        return value / 100;
    });
    // 绑定改变视图比例工具2
    tbManager.bindHtmlController("changeScaleTool", "decreaseScale", "click", null, false, function (value, tool) {
        var result = 0;

        if (tool.diagram.scale > 1.5) {
            result = 1.5;
        }
        else if (tool.diagram.scale <= 1.5 && tool.diagram.scale > 0.1) {
            result = tool.diagram.scale - 0.05;
        }

        else {
            result = 0.05;
        }

        return result;
    });
    // 绑定改变视图比例工具3
    tbManager.bindHtmlController("changeScaleTool", "increaseScale", "click", null, false, function (value, tool) {
        var result = 0;

        if (tool.diagram.scale < 0.05) {
            result = 0.05;
        }
        else if (tool.diagram.scale >= 0.05 && tool.diagram.scale < 1.45) {
            result = tool.diagram.scale + 0.05;
        }

        else {
            result = 1.5;
        }

        return result;
    });

    // 绑定文本检索工具
    tbManager.bindHtmlController("searchTextTool", "searchText", "click", null, false, function () {
        var text = document.getElementById("searchInputText").value.trim();
        return text;
    }, function (tool) {
        var resultText = "第" + (tool.searchIndex + 1) + "个，共" + tool.searchResults.length + "个";
        document.getElementById("searchCountText").innerHTML = resultText;
    });
};

/**
 * 加载视图数据
 * 
 * @param data {Object} 视图数据
 * @param needLayout {Boolean} 是否允许进行布局
 * @param allowClearDiagram {Boolean} 是否允许清空视图
 * @param allowFilterSingleRelation {Boolean} 是否允许过滤单一关系
 */
function loadDiagramData(data, allowLayout, allowClearDiagram, allowFilterSingleRelation) {
    if (!visTool) {
        // 初始化可视化工具
        initTool();
    }

    // 获取视图数据
    visTool.loadData(data, allowLayout, allowClearDiagram, allowFilterSingleRelation);

    // 获取焦点
    //visTool.diagram.focus();
};

/**
 * 保存视图数据为json字符串
 * 
 * @return {String} 视图数据的json字符串
 */
function saveDiagramData() {
    if (!visTool) {
        return null;
    }

    visTool.isBusy = true;

    // 将视图数据转化为json字符串
    var jsonData = visTool.saveDataToJson();

    visTool.isBusy = false;

    return jsonData;
};

/**
 * 保存视图为图片
 */
function saveDiagramAsImage() {
    if (!visTool) {
        return null;
    }

    visTool.isBusy = true;

    var diagram = visTool.diagram;

    // 检查是否有可见的节点
    var visibleParts = diagram.currentModel.filterNode(function (data) {
        return data.isVisible && (data.isGroup || data.isMain);
    });

    // 无可见节点时，认为视图为空，返回null
    if (!visibleParts || visibleParts.count === 0) {
        visTool.isBusy = false;

        vis.MessageTool.ShowWarningMessage("视图为空");
        return null;
    }

    // 创建临时视图，并在视图上展示所有数据
    var tempDiagarm = createTempDiagarm(diagram);

    // 将视图转化为图片数据
    var imageSrc = tempDiagarm.makeImageData({
        background: "#fff",
        scale: 1,
        type: "image/png",
        maxSize: new go.Size(Infinity, Infinity),
        details: 1, // 清晰度
        returnType: "blob",
        callback: exportImage
    });

    // 将div移除页面
    document.body.removeChild(tempDiagarm.div);

    visTool.isBusy = false;

    // 返回图片路径
    // return imageSrc ? imageSrc : null;
};

/**
 * 保存视图为图片
 * 
 * @param blob {Blob} 触发事件
 */
function exportImage(blob) {
    if (!blob) {
        return;
    }

    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = "图片.png";
    document.body.appendChild(a);
    requestAnimationFrame(function () {
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
};

/**
 * 保存视图为图片
 */
function printDiagram() {
    if (!visTool) {
        return null;
    }

    visTool.isBusy = true;

    var diagram = visTool.diagram;

    // 检查是否有可见的节点
    var visibleParts = diagram.currentModel.filterNode(function (data) {
        return data.isVisible && (data.isGroup || data.isMain);
    });

    // 无可见节点时，认为视图为空，返回null
    if (!visibleParts || visibleParts.count === 0) {
        visTool.isBusy = false;

        vis.MessageTool.ShowWarningMessage("视图为空");
        return null;
    }

    // 创建临时视图，并在视图上展示所有数据
    var tempDiagarm = createTempDiagarm(diagram);
    tempDiagarm.scale = 1;

    var svgs = [];

    //var diagramBounds = tempDiagarm.computeFixedBounds();
    //var px = diagramBounds.x;
    //var py = diagramBounds.y;
    //var diagramWidth = diagramBounds.width;
    //var diagramHeight = diagramBounds.height;
    //var svgWidth = 649;
    //var svgHeight = 978;
    //var columnCount = Math.ceil(diagramWidth / svgWidth);
    //var rowCount = Math.ceil(diagramHeight / svgHeight);

    //// 将视图切片，转化为多个SVG数据
    //for (var i = 0; i < rowCount; i++) {
    //    var y = py + svgHeight * i;

    //    for (var j = 0; j < columnCount; j++) {
    //        var x = px + svgWidth * j;

    //        // 将视图转化为SVG数据
    //        var svg = tempDiagarm.makeSvg({
    //            background: "#fff",
    //            scale: 1,
    //            position: new go.Point(x, y),
    //            size: new go.Size(svgWidth, svgHeight),
    //            details: 1 // 清晰度
    //        });

    //        svgs.push(svg);
    //    }
    //}

    var diagramBounds = tempDiagarm.computeFixedBounds();
    var maxSvgWidth = 649; // A4纸一页的最大宽度
    var maxSvgHeight = 978; // A4纸一页的最大高度
    var scaleW = maxSvgWidth / diagramBounds.width;
    var scaleH = maxSvgHeight / diagramBounds.height;
    var scale = 1;
    scaleW = scaleW < 1 ? scaleW : 1;
    scaleH = scaleH < 1 ? scaleH : 1;
    scale = scaleW < scaleH ? scaleW : scaleH;

    // 将视图转化为SVG数据
    var svg = tempDiagarm.makeSvg({
        background: "#fff",
        scale: scale,
        maxSize: new go.Size(Infinity, Infinity),
        details: 1 // 清晰度
    });

    svgs.push(svg);

    // 将div移除页面
    document.body.removeChild(tempDiagarm.div);

    // 打开新页面
    var newWindow = window.open("", "_blank", "channelmodel=1", false);

    // 将所有svg按顺序写进新页面
    svgs.forEach(function (svg) {
        newWindow.document.writeln(svg.outerHTML + "<br />");
    });

    // 打印页面
    setTimeout(function () {
        newWindow.document.execCommand("print");
        //newWindow.close();

        visTool.isBusy = false;
    }, 0);
};

/**
 * 创建临时视图，并在视图上展示所有数据
 * 
 * @param diagram {go.Diagram} 主视图
 * @return {go.Diagram} 临时视图
 */
function createTempDiagarm(diagram) {
    if (!diagram) return;

    // 创建临时div
    var tempDiv = document.createElement("div");
    tempDiv.id = "tempDiv";
    tempDiv.display = "none";

    // 将div添加进页面
    document.body.appendChild(tempDiv);

    // 创建临时可视化工具
    var tempVisTool = new CustomVisualizationTool("tempDiv");
    tempVisTool.allowVirtualize = false; // 不允许虚拟化布局
    tempVisTool.allowInitializeLayout = false; // 不允许初始化布局

    // 创建模板管理器，指定节点模板和链接模板
    tempVisTool.templateManager = new CustomTemplateManager();
    tempVisTool.diagram.nodeTemplate = tempVisTool.templateManager.nodeTemplate_Normal;
    tempVisTool.diagram.linkTemplate = tempVisTool.templateManager.linkTemplate_ParallelNormal;
    tempVisTool.diagram.groupTemplate = tempVisTool.templateManager.groupTemplate;

    // 指定数据源
    tempVisTool.diagram.model = diagram.model.copy();

    // 复制节点数据
    var nodeDataArray = [];
    diagram.virtualizedModel.nodeDataArray.forEach(function (data) {
        var newData = jQuery.extend(true, {}, data);

        if (newData.isNode) {
            newData.showPicture = true; // 初始显示图片部分
            newData.showTextList = true; // 初始显示文本列表部分
        }

        nodeDataArray.push(newData);
    });

    // 复制链接数据
    var linkDataArray = [];
    diagram.virtualizedModel.linkDataArray.forEach(function (data) {
        var newData = jQuery.extend(true, {}, data);

        newData.showTextList = true; // 初始显示文本列表部分

        linkDataArray.push(newData);
    });

    // 添加数据
    nodeDataArray.length > 0 && tempVisTool.diagram.model.addNodeDataCollection(nodeDataArray);
    linkDataArray.length > 0 && tempVisTool.diagram.model.addLinkDataCollection(linkDataArray);

    return tempVisTool.diagram;
};

/**
 * 切换路径分析模式
 * 
 * @param isShowAllPath {Boolean} 是否显示所有路径标识
 */
function toggleAnalysisPathMode(middleCount, isShowAllPath) {
    if (!visTool) {
        return;
    }

    var tool = visTool.toolbarManager.analysisPathTool; // 获取路径分析工具
    tool.middleCount = middleCount; // 设置中间节点数
    tool.isShowAllPath = isShowAllPath; // 设置是否显示所有路径标识
};

/**
 * 绑定节点的右键菜单处理
 * 
 * @param obj {go.Node} 节点
 */
function bindNodeFunctions(obj) {
    if (!obj) return;

    // 电话通联
    document.getElementById("getCallRelations").onclick = function () {
        // 打开电话通联层
        cdr_seriesJudge_showSingleModelPage('telContact', '电话通联', obj.data.id);
        // 关闭右键菜单
        obj.diagram.currentTool.stopTool();
    };

    // 短信通联
    document.getElementById("getMessageRelations").onclick = function () {
        // 打开短信通联层
        cdr_seriesJudge_showSingleModelPage('mesContact', '短信通联', obj.data.id);
        // 关闭右键菜单
        obj.diagram.currentTool.stopTool();
    };

    // 选中节点直接关系
    document.getElementById("selectNodeRelation").onclick = function () {
        obj.findLinksConnected().each(function (link) {
            if (!link.visible) return;

            if (!link.isSelected) link.isSelected = true;

            var node = link.getOtherNode(obj);
            if (node && !node.isSelected) {
                node.isSelected = true;
            }
        });

        // 关闭右键菜单
        obj.diagram.currentTool.stopTool();
    };

    // 点详情
    document.getElementById("nodeJudgeId").onclick = function () {
        // 打开点详情层
        openJudgeEntityDataLayer(obj.data);
        // 关闭右键菜单
        obj.diagram.currentTool.stopTool();
    };

    // 删除节点
    document.getElementById("deleteNode").onclick = function () {
        // 删除选中元素
        deleteSelectNode(obj.data);
        // 关闭右键菜单
        obj.diagram.currentTool.stopTool();
    };
};

/**
 * 绑定链接的右键菜单处理
 * 
 * @param obj {go.Link} 节点
 */
function bindLinkFunctions(obj) {
    if (!obj) return;

    // 选中链接直接关系
    document.getElementById("selectLinkRelation").onclick = function () {
        obj.fromNode.isSelected = true;
        obj.toNode.isSelected = true;

        // 关闭右键菜单
        obj.diagram.currentTool.stopTool();
    };

    // 线详情
    document.getElementById("linkJudgeId").onclick = function () {
        // 打开线详情层
        openJudgeLinkDataLayer(obj.data);
        // 关闭右键菜单
        obj.diagram.currentTool.stopTool();
    };

    // 删除链接
    document.getElementById("deleteLink").onclick = function () {
        // 删除选中元素
        deleteSelectLink(obj.data);
        // 关闭右键菜单
        obj.diagram.currentTool.stopTool();
    };
};

/**
 * 复制视图内容
 * 
 * @param e {ClipboardEvent} 剪贴板事件
 */
function copyDiamgramData(e) {
    // 获取页面的剪贴板数据对象
    var clipboardData = window.clipboardData; // IE
    if (!clipboardData) {
        clipboardData = e.clipboardData; // Chrome
    }

    // 复制视图内容
    if (visTool && visTool.diagram.isCopiedFromDiagram && visTool.diagram.clipboardData) {
        // 设置剪贴板数据对象
        // 若之后没有复制其他的html文本，则此数据为剪贴板数据，若复制了别的html内容，则会自动以别的html内容优先，不用控制
        clipboardData.setData("TEXT", visTool.diagram.clipboardData);
        // 取消复制来源标识
        visTool.diagram.isCopiedFromDiagram = false;
        // 阻止浏览器默认的剪贴操作
        e.preventDefault();
    }
};

// #region 根据业务需求覆写相关方法

// #region 相关常量

vis.Consts = {
    scale0: 1, // 图标大小0
    scale1: 1.75, // 图标大小1
};

// #endregion 相关常量

// #region 自定义可视化工具

/**
 * 自定义可视化工具的构造函数 （override）
 * 
 * @param divId {String} 可视化视图的div容器的id
 */
function CustomVisualizationTool(diagramDivId) {
    //vis.VisualizationTool.apply(this, arguments);
    if (!document.getElementById(diagramDivId)) return;

    // 创建可视化视图
    this.createDiagram(diagramDivId);

    // 配置右键菜单工具
    this.configContextMenuTool();

    // 创建视图的定时执行工具
    this.createIntervalTools();
};
// 自定义可视化工具继承可视化工具的所有属性和方法
go.Diagram.inherit(CustomVisualizationTool, vis.VisualizationTool);

/**
 * 节点HTML右键菜单 {HTMLElement}
 */
CustomVisualizationTool.prototype.nodeContextMenu = null;

/**
 * 链接HTML右键菜单 {HTMLElement}
 */
CustomVisualizationTool.prototype.linkContextMenu = null;

/**
 * 配置视图的基本设置（override）
 * 
 * @param diagram {go.Diagram} 主视图
 */
CustomVisualizationTool.prototype.configDiagramSetting = function () {
    //this.diagram.initialScale = 0.8; // 初始缩放比例为80%
    this.diagram.initialContentAlignment = go.Spot.Center; // 初始内容对齐方式为居中
    this.diagram.contentAlignment = go.Spot.Center; // 对齐方式为居中
    this.diagram.allowCopy = false; // 禁止复制功能
    //this.diagram.allowDelete = false; // 禁止删除功能
    //this.diagram.minScale = 0.05; // 视图最小比例为5%
    //this.diagram.maxScale = 2; // 视图最大比例为400%
    //this.diagram.scrollMode = go.Diagram.InfiniteScroll; // 无限制滚动区域
    this.diagram.padding = 50; // 设置视图填充
    this.diagram.undoManager.isEnabled = false; // 禁止撤销\恢复操作记录
    this.diagram.animationManager.isEnabled = false; // 禁止动画效果
    this.diagram.toolManager.hoverDelay = 300; // 显示提示信息的延时时间

    // 覆写增大缩放操作
    this.diagram.commandHandler.increaseZoom = function (zoomFactor) {
        var diagram = this.diagram;
        var tool = diagram.visualizationTool;

        // 设置缩放点
        tool.setZoomPoint(diagram);
        // 执行增大缩放操作
        go.CommandHandler.prototype.increaseZoom.apply(this, arguments);
    };

    // 覆写增大缩放操作
    this.diagram.commandHandler.decreaseZoom = function (zoomFactor) {
        var diagram = this.diagram;
        var tool = diagram.visualizationTool;

        // 设置缩放点
        tool.setZoomPoint(diagram);
        // 执行减小缩放操作
        go.CommandHandler.prototype.decreaseZoom.apply(this, arguments);
    };

    // 覆写删除功能
    this.diagram.commandHandler.deleteSelection = function () {
        // 删除视图中的选中数据
        deleteSelectNodesLinks();
    };

    // 覆写全选功能
    this.diagram.commandHandler.selectAll = function () {
        var model = this.diagram.currentModel;

        // 选中视图中的所有可见数据
        model.each(function (data) {
            if (data.isVisible) {
                model.setDataProperty(data, "isSelected", true);
            }
        });
    };

    // 覆写键盘按下功能
    this.diagram.doKeyDown = function () {
        var diagram = this;
        var visualizationTool = diagram.visualizationTool;
        var manager = visualizationTool.toolbarManager;
        var e = diagram.lastInput;
        var cmd = diagram.commandHandler;

        if ((e.control || e.meta) && (e.key === "C" || e.key === "Insert")) {
            // 复制选中节点的id
            visualizationTool.copySelection();
        }
        else if ((e.control || e.meta) && e.key === "Z") {
            // 撤销上一步操作
            manager.undoOperationTool.doExcute();
        }
        else if ((e.control || e.meta) && e.key === "Y") {
            // 恢复撤销的操作
            manager.redoOperationTool.doExcute();
        }
        else if (e.key === " ") {
            // 居中选中部分
            manager.centerSelectionTool.doExcute();
        }
        else {
            go.CommandHandler.prototype.doKeyDown.call(cmd);
        }
    };

    // 覆写拖拽选中功能
    this.diagram.toolManager.dragSelectingTool.doActivate = function () {
        // 选中方框的线宽度与视图比例成反比，避免视图比例过小时，看不清线
        this.box.findObject("SHAPE").strokeWidth = 3 / this.diagram.scale;

        go.DragSelectingTool.prototype.doActivate.call(this);
    };
};

/**
 * 配置节点右键菜单
 *
 * @param divId {String} 右键菜单div的id
 */
CustomVisualizationTool.prototype.configNodeContextMenu = function (divId) {
    this.nodeContextMenu = document.getElementById(divId); // 获取HTML右键菜单

    // 配置右键菜单监听事件
    this.configContextMenuListener(this.nodeContextMenu);
};

/**
 * 配置链接右键菜单
 *
 * @param divId {String} 右键菜单div的id
 */
CustomVisualizationTool.prototype.configLinkContextMenu = function (divId) {
    this.linkContextMenu = document.getElementById(divId); // 获取HTML右键菜单

    // 配置右键菜单监听事件
    this.configContextMenuListener(this.linkContextMenu);
};

/**
 * 配置右键菜单监听事件
 *
 * @param contextMenu {HTMLElement} 右键菜单div
 */
CustomVisualizationTool.prototype.configContextMenuListener = function (contextMenu) {
    var tool = this.diagram.toolManager.contextMenuTool; // 获取右键菜单工具

    // 覆写右键菜单DIV的右键菜单触发事件，屏蔽本身的右键菜单
    contextMenu.addEventListener("contextmenu", function (e) {
        // 获取焦点
        this.focus();

        // 右键菜单本身属于HTML元素，右键会触发页面菜单，需要手动阻止页面元素的右键菜单出现
        e.preventDefault();

        return false;
    }, false);

    // 覆写右键菜单DIV的失去焦点事件，控制右键菜单工具的启动状态
    contextMenu.addEventListener("blur", function (e) {
        // 停止右键菜单工具
        tool.stopTool();

        // 可能启动另一个右键菜单
        if (tool.canStart()) {
            diagram.currentTool = tool;
            tool.doMouseUp();
        }
    }, false);

    //contextMenu.tabIndex = "1";
};

/**
 * 配置右键菜单工具
 */
CustomVisualizationTool.prototype.configContextMenuTool = function () {
    var diagram = this.diagram;
    var tool = diagram.toolManager.contextMenuTool; // 获取右键菜单工具

    // 展示右键菜单
    tool.showContextMenu = function (contextMenu, obj) {
        var diagram = this.diagram;
        if (diagram === null) return;

        var nodeContextMenu = diagram.visualizationTool.nodeContextMenu; // 获取节点右键菜单
        var linkContextMenu = diagram.visualizationTool.linkContextMenu; // 获取链接右键菜单

        // 隐藏其他右键菜单
        if (contextMenu !== this.currentContextMenu) {
            this.hideContextMenu();
        }

        // 右键选中对象居中
        //diagram.visualizationTool.toolbarManager.centerSelectionTool.doExcute();

        // 获取视图对象所属的节点或链接
        var part = obj.part

        //var part = obj.part instanceof go.Node ? obj.part: obj.part.findObject("TEXT_LIST_PANEL");
        //var position = part.getDocumentPoint(go.Spot.TopLeft);
        //var pointTop = new go.Point(position.x + bounds.width / 2, position.y);
        //var viewPointTop = diagram.transformDocToView(pointTop);
        //var pointRight = new go.Point(position.x + bounds.width, position.y + bounds.height / 2);
        //var viewPointRight = diagram.transformDocToView(pointRight);

        if (part instanceof go.Node) {
            // 获取邮件菜单弹出点
            var bounds = part.actualBounds;
            var point = bounds.center;
            var viewPoint = diagram.transformDocToView(point);

            // 显示右键菜单
            nodeContextMenu.style.display = "block";

            // 设置右键菜单位置
            // nodeContextMenu.style.left = viewPoint.x + 200 + "px";
            nodeContextMenu.style.top = viewPoint.y - 20 + "px";
            //nodeContextMenu.style.left = viewPointRight.x - 80 + "px";
            //nodeContextMenu.style.top = viewPointTop.y - 80 + "px";

            // 绑定右键菜单处理
            bindNodeFunctions(part);

            //因环形菜单与当前布局的影响，需要判断左侧是否收起来确定环形菜单具体位置
            if ($('.center-visu').hasClass('left-ok')) {
                nodeContextMenu.style.left = viewPoint.x + 0 + "px";
            }
            else {
                nodeContextMenu.style.left = viewPoint.x + 200 + "px";
            }

        }
        else {
            // 获取邮件菜单弹出点
            var viewPoint = diagram.lastInput.viewPoint;

            // 显示右键菜单
            linkContextMenu.style.display = "block";

            // 设置右键菜单位置
            //linkContextMenu.style.left = viewPoint.x + 0 + "px";
            linkContextMenu.style.top = viewPoint.y - 25 + "px";
            //linkContextMenu.style.left = viewPointRight.x - 80 + "px";
            //linkContextMenu.style.top = viewPointTop.y - 80 + "px";

            //因环形菜单与当前布局的影响，需要判断左侧是否收起来确定环形菜单具体位置
            if ($('.center-visu').hasClass('left-ok')) {
                linkContextMenu.style.left = viewPoint.x + 0 + "px";
            }
            else {
                linkContextMenu.style.left = viewPoint.x + 200 + "px";
            }

            // 绑定右键菜单处理
            bindLinkFunctions(part);
        }

        // 记忆当前右键菜单
        this.currentContextMenu = contextMenu;
    };

    //点击收起左侧按钮时 隐藏当前环形菜单，以便根据左侧导航的状态重新确定位置
    $(document).on('click', '.zfmx-tip-js', function () {
        $('.huan-box').hide();
    })

    // 隐藏右键菜单
    tool.hideContextMenu = function () {
        if (this.currentContextMenu === null) return;

        var diagram = this.diagram;
        if (diagram === null) return;

        var nodeContextMenu = diagram.visualizationTool.nodeContextMenu; // 获取节点右键菜单
        var linkContextMenu = diagram.visualizationTool.linkContextMenu; // 获取链接右键菜单

        // 隐藏节点右键菜单
        nodeContextMenu.style.display = "none";
        // 隐藏拓展项
        $(nodeContextMenu).find('.huan-second-1,.huan-second-2,.huan-second-3,.huan-second-4').hide();

        // 隐藏链接右键菜单
        linkContextMenu.style.display = "none";
        // 隐藏拓展项
        $(linkContextMenu).find('.huan-second-1,.huan-second-2,.huan-second-3,.huan-second-4').hide();

        // 清除当前右键菜单
        this.currentContextMenu = null;
    };
};

/**
 * 配置视图模型
 * 
 * @return {go.GraphLinksModel} 视图的数据模型
 */
CustomVisualizationTool.prototype.configDiagramModel = function () {
    var model = new go.GraphLinksModel(); // 创建视图的数据模型
    model.nodeKeyProperty = "id"; // 设置节点的主键标识为“id”
    model.linkKeyProperty = "id"; // 设置链接的主键标识为“id”
    model.linkFromKeyProperty = "fromEntityId"; // 设置链接起始节点的主键标识为“fromEntityId”
    model.linkToKeyProperty = "toEntityId"; // 设置链接到达节点的主键标识为“toEntityId”
    this.diagram.model = model;

    var virtualizedModel = new vis.VirtualizedModel(); // 创建视图的虚拟化数据模型
    virtualizedModel.nodeKeyProperty = "id"; // 设置节点的主键标识为“id”
    virtualizedModel.linkKeyProperty = "id"; // 设置链接的主键标识为“id”
    virtualizedModel.linkFromKeyProperty = "fromEntityId"; // 设置链接起始节点的主键标识为“fromEntityId”
    virtualizedModel.linkToKeyProperty = "toEntityId"; // 设置链接到达节点的主键标识为“toEntityId”
    virtualizedModel.diagramModel = model;
    this.diagram.virtualizedModel = virtualizedModel;

    var func = (function (visualizationTool) {
        return function () {
            var event = arguments[0];
            visualizationTool.listenModelChanged(event);
        };
    })(this);

    model.addChangedListener(func);
    virtualizedModel.addChangedListener(func);
};

/**
 * 复制选中数据
 */
CustomVisualizationTool.prototype.copySelection = function () {
    var model = this.diagram.currentModel;
    var idArray = [];
    var idString = null;

    // 获取选中节点数据的id
    model.eachNode(function (data) {
        if (data.isNode && data.isVisible && data.isSelected) {
            idArray.push(data.id);
        }
    });

    if (idArray.length) {
        idString = idArray.join(","); // 拼接id字符串
        this.diagram.clipboardData = idString; // 放置在视图的剪切板数据中
        this.diagram.isCopiedFromDiagram = true; // 表明本次复制操作来源为视图

        // 手动触发页面的复制操作
        window.document.execCommand("copy");

        // 弹出提示信息
        vis.MessageTool.ShowSuccessMessage("已将号码复制到剪切板");
    }
};

/**
 * 编辑实体类型信息（override）
 * 
 * @param dataType {Object} 数据类型
 */
CustomVisualizationTool.prototype.editEntityType = function (dataType) {
    vis.VisualizationTool.prototype.editEntityType.apply(this, arguments);

    dataType.color = dataType.color || vis.ColorConfigTool.Color0; // 设置颜色
    dataType.itemCount = 0; // 初始化子元素个数
};

/**
 * 编辑链接类型信息（override）
 * 
 * @param dataType {Object} 数据类型
 */
CustomVisualizationTool.prototype.editLinkType = function (dataType) {
    vis.VisualizationTool.prototype.editLinkType.apply(this, arguments);

    dataType.strokeWidth = 2; // 设置链接的粗细
    dataType.itemCount = 0; // 初始化子元素个数
};

/**
 * 编辑实体数据的主要属性（override）
 * 
 * @param dataType {Object} 数据类型
 * @param data {Object} 数据
 */
CustomVisualizationTool.prototype.editMainEntityProperty = function (dataType, data) {
    vis.VisualizationTool.prototype.editMainEntityProperty.apply(this, arguments);

    // 设置颜色
    data.color = data.color || dataType.color || vis.ColorConfigTool.Color0;
    // 设置大小
    data.scale = data.scale || vis.Consts.scale0;
    // 设置预判标签
    data.mark = data.mark || "";

    dataType.itemCount++;// 子元素个数统计
};

/**
 * 编辑链接数据的主要属性（override）
 * 
 * @param dataType {Object} 数据类型
 * @param data {Object} 数据
 */
CustomVisualizationTool.prototype.editMainLinkProperty = function (dataType, data) {
    vis.VisualizationTool.prototype.editMainLinkProperty.apply(this, arguments);

    data.canFilter = dataType.canFilter; // 设置链接的可过滤标识
    dataType.itemCount++;// 子元素个数统计
};

/**
 * 编辑新增节点（override）
 * 
 * @param node {go.Node} 新增节点
 */
CustomVisualizationTool.prototype.editNewNode = function (node) {
    if (!node || !node.data.isVirtual || !node instanceof go.Node || node instanceof go.Group) {
        return;
    }

    // 设置节点状态为非虚拟状态
    this.diagram.currentModel.setDataProperty(node.data, "isVirtual", false);

    // 创建右键菜单
    //if (!node.contextMenu) {
    //    node.contextMenu = this.templateManager.createContextMenu();

    //    // 创建点研判按钮
    //    var turnToJudgeEntityDataLayerButton = this.templateManager.createContextMenuButton("点研判", turnToJudgeEntityDataLayer);
    //    // 为右键菜单添加按钮
    //    node.contextMenu.add(turnToJudgeEntityDataLayerButton);
    //}

    // 遍历节点监听器集合，为新节点添加监听器
    this.nodeListeners.forEach(function (listener) {
        node.addEventListener(listener.eventType, listener.func, listener.caller);
    });
};

/**
 * 编辑新增链接（override）
 * 
 * @param template {go.Link} 新增链接
 */
CustomVisualizationTool.prototype.editNewLink = function (link) {
    if (!link || !link.data.isVirtual || !link instanceof go.Link) {
        return;
    }

    // 设置链接状态为非虚拟状态
    this.diagram.currentModel.setDataProperty(link.data, "isVirtual", false);

    //// 创建右键菜单
    //if (!link.contextMenu) {
    //    link.contextMenu = this.templateManager.createContextMenu();

    //    // 创建查看详情按钮
    //    var turnToRelationDetailViewButton = this.templateManager.createContextMenuButton("查看详情", turnToRelationDetailView);
    //    // 为右键菜单添加按钮
    //    link.contextMenu.add(turnToRelationDetailViewButton);
    //}

    // 遍历链接监听器集合，为新链接添加监听器
    this.linkListeners.forEach(function (listener) {
        link.addEventListener(listener.eventType, listener.func, listener.caller);
    });
};

/**
 * 
 * 过滤实体数据（override） 若数据已在视图模型中存在，则将其过滤掉。
 * 
 * @param array {Array} 需要过滤的实体数据集合
 * @param model {go.GraphLinksModel} 视图模型
 * @return {Array} 新增实体数据集合
 */
CustomVisualizationTool.prototype.filterEntities = function (array, model) {
    if (!array || !model) return [];

    var length = array.length;
    var resultArray = [];

    for (var i = 0; i < length; i++) {
        var item = array[i];
        var nodeData = model.findNodeDataForKey(item.id);

        // 不包含该数据时，将该数据添加进数据模型中
        if (!nodeData) {
            // 将该数据添加进数据模型中
            //model.addNodeData(item);
            // 将该数据添加进新增实体数据集合中
            resultArray.push(item);
        }
        else if (item.isMain) {
            // 仅更新关键标识
            nodeData.isMain = true;
        }
    }

    return resultArray;
};

/**
 * 
 * 过滤链接数据（override） 若数据已在视图模型中存在，则将其过滤掉。
 * 
 * @param array {Array} 需要过滤的链接数据集合
 * @param model {go.GraphLinksModel} 视图模型
 * @return {Array} 过滤后的链接数据集合
 */
CustomVisualizationTool.prototype.filterLinks = function (array, model) {
    if (!array || !model) return [];

    var length = array.length;
    var resultArray = [];

    for (var i = 0; i < length; i++) {
        var item = array[i];
        var linkData = model.findLinkDataForKey(item.id);

        // 不包含该数据时，将该数据添加进数据模型中
        if (!linkData) {
            // 将该数据添加进数据模型中
            //model.addLinkData(item);
            // 将该数据添加进新增实体数据集合中
            resultArray.push(item);
        }
        else if (item.isMain) {
            // 仅更新关键标识
            linkData.isMain = true;
        }
    }

    return resultArray;
};

/**
 * 过滤单一关系
 *
 * @param model {go.GraphLinksModel} 需要过滤数据的模型
 */
CustomVisualizationTool.prototype.filterSingleRelation = function (model) {
    if (!model) {
        return;
    }

    var removeNodes = new go.List(); // 创建删除节点数据集合
    var removeLinks = new go.List(); // 创建删除链接数据集合

    model.eachNode(function (node) {
        if (node.isGroup || node.isMain) return;

        // 获取邻接节点数据集合
        var neighborNodes = model.findNodesConnected(node);

        // 邻接节点数据数小于2时，则视为无关节点
        if (neighborNodes.count < 2) {
            // 向删除节点数据集合中添加数据
            removeNodes.add(node);

            neighborNodes.each(function (neighborNode) {
                // 获取节点之间的链接数据集合
                var links = model.findLinksBetween(node, neighborNode);
                // 向删除链接数据集合中添加数据
                removeLinks.addAll(links);
            });
        }
    });

    // 存在无关数据时
    if (removeNodes.count > 0) {
        // 删除无关节点数据
        model.removeNodeDataCollection(removeNodes);
        // 删除无关链接数据
        model.removeLinkDataCollection(removeLinks);

        // 进行下一次过滤
        this.filterSingleRelation(model);
    }
};

/**
 * 监听繁忙状态改变（override）
 * 
 * @param isBusy {Boolean} 繁忙状态
 */
CustomVisualizationTool.prototype.listenIsBusyChanged = function (isBusy) {
    // 繁忙时显示遮罩
    if (isBusy && !this.loadShade) {
        if (!this.loadShade) {
            this.loadShade = layer.load(2);
        }
    }
        // 非繁忙时关闭遮罩
    else if (!isBusy && this.loadShade) {
        layer.close(this.loadShade);
        this.loadShade = null;
    }
};

/**
 * 
 * 为视图加载数据（override）
 * 
 * @param modelData {Object} 需要在视图中展示的json数据
 * @param needLayout {Boolean} 是否允许进行布局
 * @param allowClearDiagram {Boolean} 是否允许清空视图
 * @param allowFilterSingleRelation {Boolean} 是否允许过滤单一关系
 */
CustomVisualizationTool.prototype.loadData = function (modelData, allowLayout, allowClearDiagram, allowFilterSingleRelation) {
    if (!modelData || (!modelData.entityTypes && !modelData.linkTypes && !modelData.entities && !modelData.links)) return;

    this.busy = true;

    if (!modelData.entityTypes) modelData.entityTypes = [];
    if (!modelData.linkTypes) modelData.linkTypes = [];
    if (!modelData.entities) modelData.entities = [];
    if (!modelData.links) modelData.links = [];


    var totalEntityCount = modelData.entities.length; // 获取输入节点总数
    var totalLinkCount = modelData.links.length; // 获取输入链接总数
    var model = this.diagram.currentModel; // 获取完全数据模型

    // 清空视图
    if (allowClearDiagram) {
        this.clearDiagram();
    }

    // 清理视图中元素的选中状态
    model.clearSelection();

    // 添加实体类型集合
    this.addTypeArrayToTypeMap(modelData.entityTypes, this.entityTypes, true);

    // 添加链接类型集合
    this.addTypeArrayToTypeMap(modelData.linkTypes, this.linkTypes, false);

    // 数据中没有包含任何节点或链接时，直接结束
    if (modelData.entities.length === 0 && modelData.links.length === 0) {
        return;
    }

    // 显示视图的隐藏部分
    this.toolbarManager.showHiddenPartsTool.doExcute();

    // 计算视图矩形边界
    this.diagram.computeFixedBounds();

    // 设置第一次加载视图标识
    var isInitial = model.nodeDataArray.length === 0 ? true : false;

    // 清理重复的节点数据
    modelData.entities = this.filterArray(modelData.entities);

    // 清理重复的链接数据
    modelData.links = this.filterArray(modelData.links);

    // 过滤单一关系
    if (allowFilterSingleRelation) {
        // 创建临时数据模型
        var temModel = this.diagram.model.copy();
        modelData.entities.forEach(function (data) { data.isVisible = true });
        modelData.links.forEach(function (data) { data.isVisible = true });
        temModel.addNodeDataCollection(modelData.entities);
        temModel.addLinkDataCollection(modelData.links);

        // 过滤单一关系
        this.filterSingleRelation(temModel);

        // 重设节点集合和链接集合
        modelData.entities = temModel.nodeDataArray;
        modelData.links = temModel.linkDataArray;
    }

    // 过滤实体数据
    var entities = this.filterEntities(modelData.entities, model);

    // 过滤链接数据
    var links = this.filterLinks(modelData.links, model);

    var intsertEntityCount = entities.length; // 获取最终加载节点总数
    var intsertLinkCount = links.length; // 获取最终加载链接总数

    // 扩展实体信息
    this.extendDataByDataType(this.entityTypes, entities, true);

    // 扩展链接信息
    this.extendDataByDataType(this.linkTypes, links, false);

    // 超出数据上限判断
    var entityCount = entities.length + model.nodeDataArray.length;
    if (entityCount > 3000) {
        vis.MessageTool.ShowErrorMessage("数据量超过上限，请在数据表格查看或者增加筛选条件");
        return;
    }

    // 空数据判断
    //if (insertCount === 0) {
    //    //vis.MessageTool.ShowErrorMessage("未获取到新数据，或数据已存在");
    //    return;
    //}

    // 向视图中添加新增节点数据
    model.addNodeDataCollection(entities);
    // 向视图中添加新增链接数据
    model.addLinkDataCollection(links);

    // 初始化布局
    if (allowLayout && (intsertEntityCount + intsertLinkCount) !== 0) {
        // 若是第一次加载数据，则按照当前布局进行布局，否则自动寻位
        if (isInitial) {
            // 按照环形布局，对新增数据进行布局
            //var list = new go.List().addAll(entities).addAll(links);
            //vis.LayoutManager.VirtualizedCircularLayout.doLayout(list, this.diagram);

            // 按照当前布局再进行一次布局
            this.diagram.layoutDiagram(true);
        }
        else {
            // 按照环形布局，对新增数据进行布局
            var list = new go.List().addAll(entities).addAll(links);
            //vis.LayoutManager.VirtualizedCircularLayout.doLayout(list, this.diagram);
            vis.LayoutManager.VirtualizedGridLayout.doLayout(list, this.diagram);

            // 自动寻位
            this.autoLocationProvider.setLocation(this.diagram, new go.List().addAll(entities));
        }

        // 计算视图矩形边界
        this.diagram.computeFixedBounds();

        // 为虚拟化布局更新视图内容
        this.updateDiagramParts();
    }

    // 初始化视图适应屏幕
    if (isInitial) {
        // 初始化视图适应屏幕
        this.toolbarManager.uniformScaleTool.doExcute();

        model.clearSelection();
    }
    else {
        // 选中获取到的数据（无论是否已在视图上）
        modelData.entities.forEach(function (data) {
            var nodeData = model.findNodeDataForKey(data.id);
            if (nodeData) {
                model.setDataProperty(nodeData, "isSelected", true);
            }
        });
        modelData.links.forEach(function (data) {
            var linkData = model.findLinkDataForKey(data.id);
            if (linkData) {
                model.setDataProperty(linkData, "isSelected", true);
            }
        });

        // 居中选择部分
        var tool = this.toolbarManager.centerSelectionTool;
        //var tool = this.toolbarManager.uniformScaleTool;
        vis.TimeoutTool.doDelay(tool, tool.doExcute, 0);
    }

    this.busy = false;

    var removeEntityCount = totalEntityCount - intsertEntityCount; // 获取无关节点总数
    var removeLinkCount = totalLinkCount - intsertLinkCount; // 获取无关链接总数

    var msgString = ""
        + "获取新增节点数 " + totalEntityCount + "、链接数 " + totalLinkCount + "；<br />"
        + "删除无关节点数 " + removeEntityCount + "、链接数 " + removeLinkCount + "；<br />"
        + "最终加载节点数 " + intsertEntityCount + "、链接数 " + intsertLinkCount + "。";
    //vis.MessageTool.ShowWarningMessage(msgString)
    myAlert(msgString, 1);
};

/**
 * 保存视图数据至json字符串（override）
 * 
 * @return {String} 视图数据的json字符串
 */
CustomVisualizationTool.prototype.saveDataToJson = function () {
    var entityTypes = []; // 节点数据类型集合
    var linkTypes = []; // 链接数据类型集合
    var entities = []; // 节点数据集合
    var links = []; // 链接数据集合
    var resultData = {}; // 返回的数据集
    var jsonData = null; // 转化后的json数据
    var model = this.diagram.currentModel; // 视图的数据模型

    // 获取节点数据类型集合
    this.entityTypes.each(function (obj) {
        entityTypes.push(obj.value);
    });

    // 获取链接数据类型集合
    this.linkTypes.each(function (obj) {
        linkTypes.push(obj.value);
    });

    // 创建临时数据模型，获取符合条件的节点数据和链接数据
    var tempModel = new go.GraphLinksModel();

    // 获取符合条件的节点数据和链接数据
    var lLength = model.linkDataArray.length;
    for (var i = 0; i < lLength; i++) {
        var link = model.linkDataArray[i];
        if (!link.isVisible) {
            continue;
        }

        var fromNode = model.findNodeDataForKey(link.fromEntityId);
        var toNode = model.findNodeDataForKey(link.toEntityId);
        if (!fromNode.isVisible || !toNode.isVisible) {
            continue;
        }

        var isRelationVisible = true;

        if (fromNode.group) {
            var groupData = model.findNodeDataForKey(fromNode.group);

            if (!groupData || (groupData && groupData.isVisible)) {
                tempModel.addNodeData(groupData);
                tempModel.addNodeData(fromNode);
            } else {
                isRelationVisible = false;
            }
        } else {
            tempModel.addNodeData(fromNode);
        }

        if (toNode.group) {
            var groupData = model.findNodeDataForKey(toNode.group);

            if (!groupData || (groupData && groupData.isVisible)) {
                tempModel.addNodeData(groupData);
                tempModel.addNodeData(toNode);
            } else {
                isRelationVisible = false;
            }
        } else {
            tempModel.addNodeData(toNode);
        }

        if (isRelationVisible) {
            tempModel.addLinkData(link);
        }
    }

    // 获取符合条件的节点数据（单节点，无关联链接）
    var nLength = model.nodeDataArray.length;
    for (var i = 0; i < nLength; i++) {
        var node = model.nodeDataArray[i];
        if (!node.isVisible) {
            continue;
        }

        if (node.group) {
            var groupData = model.findNodeDataForKey(node.group);

            if (groupData && groupData.isVisible) {
                tempModel.addNodeData(groupData);
                tempModel.addNodeData(node);
            } else {
                isRelationVisible = false;
            }
        } else {
            tempModel.addNodeData(node);
        }
    }

    // 节点数据集合为空时，返回null（节点数据集合为空时，链接数据集合必为空）
    if (tempModel.nodeDataArray.length === 0) {
        return null;
    }

    // 设置返回数据集的属性
    resultData = {
        entityTypes: entityTypes, // 节点数据类型集合
        linkTypes: linkTypes, // 链接数据类型集合
        entities: tempModel.nodeDataArray, // 节点集合
        links: tempModel.linkDataArray
        // 链接集合
    };

    // 转化为json数据
    jsonData = JSON.stringify(resultData);

    return jsonData;
};

/**
 * 设置缩放点
 * 
 * @param diagram {go.Diagram} 视图
 */
CustomVisualizationTool.prototype.setZoomPoint = function (diagram) {
    if (!diagram) {
        return;
    }

    var coll = diagram.selection; // 获取视图选中项集合
    var firstNode = null; // 第一个选中的节点

    // 获取第一个选中的节点
    if (coll.count > 0) {
        var iterator = coll.iterator;
        while (iterator.next()) {
            var part = iterator.value;

            if (part.data.isNode) {
                firstNode = part;
                break;
            }
        }
    }

    // 节点存在时，节点中心为缩放点
    if (firstNode) {
        // 获取节点中心点
        var point = firstNode.getDocumentPoint(go.Spot.Center);
        // 设置视图的缩放点
        diagram.zoomPoint = diagram.transformDocToView(point);
    }
        // 节点不存在时，鼠标位置为缩放点
    else {
        // 获取鼠标坐标点
        var point = diagram.lastInput.documentPoint;
        // 设置视图的缩放点
        diagram.zoomPoint = diagram.transformDocToView(point);
    }

};

/**
* 清空视图信息
*/
CustomVisualizationTool.prototype.clearDiagram = function () {
    this.diagram.clear();
    this.diagram.virtualizedModel.clear();
    this.entityTypes.each(function (type) {
        type.itemCount = 0;
    });
    this.linkTypes.each(function (type) {
        type.itemCount = 0;
    });
};

// #endregion 自定义可视化工具

// #region 自定义模板管理器

/**
 * 自定义模板管理器的构造函数 （override）
 */
function CustomTemplateManager() {
    vis.TemplateManager.apply(this, arguments);
};
// 自定义模板管理器继承模板管理器的所有属性和方法
go.Diagram.inherit(CustomTemplateManager, vis.TemplateManager);

/**
* 创建图片控件（图片控件_标准）(override)
*
* return {go.Panel} 图片控件
*/
CustomTemplateManager.prototype.createPicturePanel = function () {
    var picturePanel =
        // 图片面板
        $$(go.Panel, "Auto",
            {
                name: "PICTURE_PANEL",
                alignment: go.Spot.Center
            },
            // 面板图形(主要节点标识)
            $$(go.Shape, "Or",
                {
                    portId: "",
                    fill: "rgba(255, 0, 4, 0.6)",
                    stroke: "rgba(255, 0, 4, 0.6)",
                    strokeWidth: 1,
                    //desiredSize: new go.Size(130, 130),
                    alignment: go.Spot.Center
                },
                new go.Binding("visible", "isMain"),
                new go.Binding("scale", "isMain", this.convertScaleByIsMain),
                new go.Binding("stroke", "isHighlighted", this.convertStrokeByIsHighlighted).ofObject(),
                new go.Binding("stroke", "isSelected", this.convertStrokeByIsSelected).ofObject()
            ),
            // 面板图形
            $$(go.Shape, "Circle",
                {
                    name: "PICTURE_PANEL_SHAPE",
                    //portId: "",
                    fill: "#f7f7f7",
                    strokeWidth: 5,
                    desiredSize: new go.Size(100, 100),
                    alignment: go.Spot.Center
                },
                new go.Binding("fill", "color", function (data) {
                    var basicColor = data ? data : "transparent";

                    color = $$(go.Brush, "Radial",
                        {
                            0.1: "#fff",
                            1: basicColor
                        });

                    return color;
                }),
                new go.Binding("figure", "shape").makeTwoWay(),
                new go.Binding("stroke", "isHighlighted", this.convertStrokeByIsHighlighted).ofObject(),
                new go.Binding("stroke", "isSelected", this.convertStrokeByIsSelected).ofObject()
            ),
            // 照片信息
            $$(go.Picture,
                {
                    name: 'PICTURE',
                    desiredSize: new go.Size(50, 50),
                    alignment: go.Spot.Center
                    //imageStretch: go.GraphObject.UniformToFill
                },
                new go.Binding("source", "iconName"),
                new go.Binding("visible", "showPicture")
            )
        );

    return picturePanel;
};

/**
 * 
 * 创建节点模板_标准（override）
 * 
 * return {go.Node} 节点模板
 */
CustomTemplateManager.prototype.createNodeTemplate_Normal = function () {
    var picturePanel = this.createPicturePanel();
    var itemTemplate = this.createItemTemplate_Simple();
    var textListPanel = this.createTextListPanel(itemTemplate);

    // 创建节点模板（图片+文本）
    var nodeTemplate = this.createNodeTemplate("NODE_TEMPLATE_NORMAL", picturePanel, textListPanel);
    nodeTemplate.type = go.Panel.Spot;
    nodeTemplate.locationObjectName = "PICTURE_PANEL";
    nodeTemplate.locationSpot = go.Spot.Center;

    // 提示信息
    nodeTemplate.toolTip = this.createToolTip();

    // 右键菜单
    nodeTemplate.contextMenu = new go.Adornment();

    // 添加缩放比例绑定
    nodeTemplate.bind(new go.Binding("scale"));

    // 批注信息面板
    var commentTemplate = this.createCommentPanel(true);
    nodeTemplate.findObject("INFORMATION_PANEL").add(commentTemplate);

    return nodeTemplate;
};

/**
* 创建并行线链接模板_标准（override）
*
* return {go.Node} 节点模板
*/
CustomTemplateManager.prototype.createParallelLinkTemplate_Normal = function () {
    var itemTemplate = this.createItemTemplate_Simple();

    var textListPanel =
        // 信息面板
        $$(go.Panel, "Auto",
            {
                name: "TEXT_LIST_PANEL",
                alignment: go.Spot.Center,
                segmentOffset: new go.Point(30, 0),
                //mouseEnter: function (e, obj) {
                //    var scale = obj.part.diagram.scale;
                //    if (scale < 1) {
                //        // 文本放大
                //        obj.scale = 1 / scale;
                //    }
                //},
                //mouseLeave: function (e, obj) {
                //    // 文本恢复默认大小
                //    obj.scale = 1;
                //}
            },
            new go.Binding("opacity", "showTextList", this.convertOpacityByShowTextList),
            // 边框图形
            $$(go.Shape, "RoundedRectangle",
                {
                    name: "TEXT_LIST_PANEL_SHAPE",
                    fill: "#f7f7f7",
                    stroke: null,
                    strokeWidth: 1.5
                },
                new go.Binding("stroke", "isHighlighted", this.convertStrokeByIsHighlighted2).ofObject(),
                new go.Binding("stroke", "isSelected", this.convertStrokeByIsSelected2).ofObject()
            ),
            // 信息列表
            $$(go.Panel, "Vertical",
                {
                    name: "TEXT_LIST",
                    alignment: go.Spot.Center,
                    itemTemplate: itemTemplate
                },
                new go.Binding("itemArray", "propertyValues")
            )
        );

    // 由于有批注面板，外面需要包一层
    var borderPanel =
        // 信息面板
        $$(go.Panel, "Vertical",
            {
                name: "INFORMATION_PANEL",
                alignment: go.Spot.Center
            },
            textListPanel
        );

    // 创建链接模板（图片+文本）
    var linkTemplate = this.createParallelLinkTemplate("PARALLE_LINK_TEMPLATE_NORMAL", borderPanel);

    // 提示信息
    linkTemplate.toolTip = this.createToolTip();

    // 右键菜单
    linkTemplate.contextMenu = new go.Adornment();

    // 批注信息面板
    var commentTemplate = this.createCommentPanel(false);
    linkTemplate.findObject("INFORMATION_PANEL").add(commentTemplate);

    // 并行线链接模板（有文本）
    return linkTemplate;
};

/**
* 创建组织模板
*
* return {go.Group} 组织模板
*/
CustomTemplateManager.prototype.createGroupTemplate = function () {
    var template = $$(go.Group, "Vertical",
            {
                zOrder: 0,
                deletable: true,
                selectionAdorned: false,
                selectionObjectName: "GROUP_SHAPE",
                computesBoundsAfterDrag: true,
                //locationSpot: go.Spot.TopCenter,
                //isShadowed: true,
                //shadowColor: "black",
                //shadowBlur: 10,
                //shadowOffset: new go.Point(10, 10),
                layout: $$(go.ForceDirectedLayout, {
                    maxIterations: 300,
                    defaultElectricalCharge: 100,
                    defaultSpringLength: 100,
                    defaultGravitationalMass: 1000,
                    isOngoing: false
                }),
                selectionChanged: function (obj) {
                    var group = obj.part;
                    var parts = group.memberParts;

                    while (parts.next()) {
                        var part = parts.value;
                        if (part.data.isNode) {
                            part.findObject("PICTURE_PANEL").background = group.isSelected ? "rgba(0, 143, 235, 0.8)" : null;
                        }
                    }
                },
            },
            new go.Binding("visible", "isVisible").makeTwoWay(),
            new go.Binding("zOrder", "isSelected", function (data, obj) { return data ? 5 : 0 }),
            new go.Binding("isSelected", "isSelected").makeTwoWay(),
            new go.Binding("isHighlighted", "isHighlighted"),
            new go.Binding("position", "bounds", this.convertPositionByBounds).makeTwoWay(this.convertBoundsByPosition),
            $$(go.Panel, "Auto",
                $$(go.Shape,
                    "RoundedRectangle",
                    //"Circle",
                    {
                        name: "GROUP_SHAPE",
                        parameter1: 20,
                        fill: "rgba(255, 255, 255, 0.7)",
                        //stroke: "rgba(68, 68, 68, 0.3)",
                        strokeWidth: 3,
                    },
                    //new go.Binding("stroke", "color"),
                    new go.Binding("fill", "isSelected", function (data, obj) {
                        return data ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.7)"
                    }),
                    new go.Binding("stroke", "isHighlighted", this.convertStrokeByIsHighlighted2).ofObject(),
                    new go.Binding("stroke", "isSelected", this.convertStrokeByIsSelected2).ofObject()
                ),
                // 占位符
                $$(go.Placeholder,
                    {
                        padding: new go.Margin(100),
                        alignment: go.Spot.TopLeft,
                        //minSize: new go.Size(200, 200)
                    }
                )
            )
        );

    return template;
};

/**
* 创建子元素模板_提示框
*
* return {go.Panel} 子元素模板
*/
CustomTemplateManager.prototype.createItemTemplate_ToolTip = function () {
    var template =
        // 信息面板
        $$(go.Panel, "Horizontal",
            {
                background: "transparent",
                height: 25,
                alignment: go.Spot.Center
            },
            new go.Binding("visible", "isHidden", function (v) {
                return v === false ? true : false;
            }),
            // 提示文本
            $$(go.TextBlock,
                {
                    stroke: "black",
                    font: "bold 18px sans-serif",
                    // maxSize : new go.Size(1000, 25),
                    margin: new go.Margin(0, 5, 0, 5),
                    textAlign: "center",
                    wrap: go.TextBlock.WrapFit
                },
                new go.Binding("text", "value")
            )
        );

    return template;
};

/**
* 创建提示框模板
*
* return {go.Panel} 提示框模板
*/
CustomTemplateManager.prototype.createToolTip = function () {
    var itemTemplate = this.createItemTemplate_ToolTip(); // 创建子元素模板_提示框

    var template =
        // 提示面板
        $$(go.Adornment, "Auto",
            {
                alignment: go.Spot.Center,
                background: "transparent"
            },
            // 信息面板框图形
            $$(go.Shape, "RoundedRectangle",
                {
                    fill: "lightblue"
                }
            ),
            // 信息面板
            $$(go.Panel, "Vertical",
                {
                    name: "INFORMATION_PANEL",
                    alignment: go.Spot.Center
                },
                // 信息面板
                $$(go.Panel, "Vertical",
                    {
                        name: "LIST",
                        padding: 0,
                        // background : "lightgray",
                        alignment: go.Spot.Center,
                        stretch: go.GraphObject.Horizontal,
                        itemTemplate: itemTemplate
                    },
                    new go.Binding("itemArray", "propertyValues")
                ),
                // 批注信息面板
                $$(go.Panel, "Horizontal",
                    {
                        background: "transparent",
                        //height: 25,
                        alignment: go.Spot.Center
                    },
                    new go.Binding("visible", "", function (data, obj) {
                        return data.commentTitle || data.commentValue ? true : false;
                    }),
                    // 提示文本
                    $$(go.TextBlock,
                        {
                            stroke: "#404040",
                            font: "normal 16px sans-serif",
                            // maxSize : new go.Size(1000, 25),
                            margin: new go.Margin(0, 5, 0, 5),
                            textAlign: "center",
                            text: null,
                            maxSize: new go.Size(200, 500),
                            wrap: go.TextBlock.WrapFit,
                            overflow: go.TextBlock.OverflowEllipsis
                        },
                        new go.Binding("text", "", function (data, obj) {
                            var comment = null;

                            if (data.commentTitle && !data.commentValue) {
                                comment = data.commentTitle;
                            }
                            else if (!data.commentTitle && data.commentValue) {
                                comment = data.commentValue;
                            }
                            else if (data.commentTitle && data.commentValue) {
                                comment = data.commentTitle + " : " + data.commentValue
                            }

                            return comment;
                        })
                    )
                )
            )
        );

    return template;
};

/**
* 创建批注面板
*
* @param isNode {Boolean} 节点标识
* return {go.Panel} 批注面板
*/
CustomTemplateManager.prototype.createCommentPanel = function (isNode) {
    var template =
        // 信息面板
        $$(go.Panel, "Auto",
            {
                name: "COMMENT_PANEL",
                alignment: go.Spot.Center,
            },
            new go.Binding("opacity", "showTextList", this.convertOpacityByShowTextList),
            new go.Binding("visible", "", function (data, obj) {
                return data.commentTitle || data.commentValue ? true : false;
            }),
            // 边框图形
            $$(go.Shape, "RoundedRectangle",
                {
                    name: "COMMENT_PANEL_SHAPE",
                    fill: "#f7f7f7",
                    stroke: null,
                    strokeWidth: 1.5
                }
            ),
            // 信息面板
            $$(go.Panel, "Auto",
                this.styles.panelStyle3,
                {
                    name: "ITEM_TEMPLATE"
                },
                // 边框图形
                $$(go.Shape, "RoundedRectangle",
                    {
                        name: "TEXT_PANEL_SHAPE",
                        fill: "#f5f5f5",
                        stroke: null
                    }
                ),
                // 信息文本
                $$(go.TextBlock,
                    this.styles.textBlockStyle,
                    {
                        stroke: "#525252",
                        text: null,
                        //minSize: new go.Size(0, NaN),
                        font: "normal 16px sans-serif",
                        maxSize: new go.Size(200, 200),
                        wrap: go.TextBlock.WrapFit,
                        overflow: go.TextBlock.OverflowEllipsis
                    },
                    new go.Binding("text", "", function (data, obj) {
                        var comment = null;

                        if (data.commentTitle && !data.commentValue) {
                            comment = data.commentTitle;
                        }
                        else if (!data.commentTitle && data.commentValue) {
                            comment = data.commentValue;
                        }
                        else if (data.commentTitle && data.commentValue) {
                            comment = data.commentTitle + " : " + data.commentValue
                        }

                        return comment;
                    })
                )
            )
        );

    var shape = template.findObject("COMMENT_PANEL_SHAPE");
    if (isNode) {
        shape.bind(new go.Binding("stroke", "isHighlighted", this.convertStrokeByIsHighlighted).ofObject());
        shape.bind(new go.Binding("stroke", "isSelected", this.convertStrokeByIsSelected).ofObject());
    }
    else {
        shape.bind(new go.Binding("stroke", "isHighlighted", this.convertStrokeByIsHighlighted2).ofObject());
        shape.bind(new go.Binding("stroke", "isSelected", this.convertStrokeByIsSelected2).ofObject());
    }

    return template;
};

/**
 * 创建模板集合（override）
 */
CustomTemplateManager.prototype.createTemplates = function () {
    vis.TemplateManager.prototype.createTemplates.call(this);

    // 组织模板
    this.groupTemplate = this.createGroupTemplate();
};

// #endregion 自定义模板管理器

// #region 覆写消息工具

/**
* 弹出成功消息（override）
*
* @param msg {String} 消息字符串
*/
vis.MessageTool.ShowSuccessMessage = function (msg) {
    myMsg(msg, 0);
};

/**
* 弹出错误消息（override）
*
* @param msg {String} 消息字符串
*/
vis.MessageTool.ShowErrorMessage = function (msg) {
    myMsg(msg, 2);
};

/**
* 弹出警告消息（override）
*
* @param msg {String} 消息字符串
*/
vis.MessageTool.ShowWarningMessage = function (msg) {
    myMsg(msg, 99);
};

// #endregion 覆写消息工具

// #region 覆写颜色配置工具

vis.ColorConfigTool.Color0 = "#c6c6c6"; // 灰色
vis.ColorConfigTool.Color1 = "#f0353e"; // 红色
vis.ColorConfigTool.Color2 = "#f09635"; // 橙色
vis.ColorConfigTool.Color3 = "#358df0"; // 蓝色
vis.ColorConfigTool.Color4 = "#6bbf46"; // 绿色

// #endregion 覆写颜色配置工具

// #region 覆写放大镜工具

/**
 * 更新鼠标位置的节点和链接的子元素显示状态（override）
 */
vis.MagnifierTool.prototype.updateDetailsVisibility = function () {
    // 禁止更新视图元素显示状态
    this.diagram.visualizationTool.allowChangeTemplateForScale = false;

    // 对于鼠标所在位置附近的节点和链接，显示其图片和文本
    var model = this.diagram.currentModel;
    var documentPoint = this.diagram.lastInput.documentPoint; // 鼠标所在的视图位置（相对于整个视图，原点坐标在视图中心）

    var parts = this.diagram.findObjectsNear(documentPoint, 200);
    parts.each(function (part) {
        if (part instanceof go.Node && !(part instanceof go.Group)) {
            model.setDataProperty(part.data, "showPicture", true);
            model.setDataProperty(part.data, "showTextList", true);

            // 暂时屏蔽提示信息
            if (part.toolTip) {
                part.toolTip.visible = false;
            }
        } else if (part instanceof go.Link) {
            model.setDataProperty(part.data, "showTextList", true);

            // 暂时屏蔽提示信息
            if (part.toolTip) {
                part.toolTip.visible = false;
            }
        }
    });
};

/**
 * 工具失效处理（override）
 */
vis.ShowMagnifierTool.prototype.doDeactivate = function () {
    if (!this.magnifierTool) {
        return;
    }

    // 使全景视图失效
    this.magnifierTool.isActive = false;
    // 隐藏全景视图
    this.magnifierTool.visible = false;

    // 允许更新视图元素显示状态
    this.visualizationTool.allowChangeTemplateForScale = true;
    // 更新视图上的节点和链接的子元素显示状态
    this.visualizationTool.updateSubPartsVisibility();

    // 恢复提示信息功能
    this.diagram.nodes.each(function (obj) {
        if (!(obj instanceof go.Group) && obj.toolTip) {
            obj.toolTip.visible = true;
        }
    });

    // 恢复提示信息功能
    this.diagram.links.each(function (obj) {
        if (obj.toolTip) {
            obj.toolTip.visible = true;
        }
    });
};

// #endregion 覆写放大镜工具

// #region 覆写路径分析工具

vis.AnalysisPathTool.ShortestForTwo = "ShortestForTwo"; // 两节点之间最短路径
vis.AnalysisPathTool.ShortestForThree = "ShortestForThree"; // 三节点之间最短路径
vis.AnalysisPathTool.AllForTwo = "AllForTwo"; // 两节点之间所有路径
vis.AnalysisPathTool.AllForThree = "AllForThree"; // 两节点之间所有路径

/**
* 分析节点数据集合（按顺序） {Object}
*/
vis.AnalysisPathTool.prototype.middleNodeDatas = new go.List();

/**
* 路径上的最大节点数 {Number}
*/
vis.AnalysisPathTool.prototype.maxCount = 6;

/**
* 中间节点数 {Number}
*/
vis.AnalysisPathTool.prototype.middleCount = 0;

/**
* 路径集合 {go.List}
*/
vis.AnalysisPathTool.prototype.paths = new go.List(go.List);

/**
 * 是否显示所有路径标识 {Boolean}
 */
vis.AnalysisPathTool.prototype.isShowAllPath = false;

/**
* 工具激活处理（override）
*/
vis.AnalysisPathTool.prototype.doActivate = function () {
    this.diagram.startTransaction("AnalysisPathTool");

    // 清空视图中的所有高亮状态
    this.diagram.currentModel.clearHighlighteds();
    // 清空视图中的所有选中状态
    this.diagram.currentModel.clearSelection();

    this.startNodeData = null;
    this.endNodeData = null;
    this.middleNodeDatas.clear();

    // 监听鼠标选择事件（注意该事件触发时，鼠标所在的视图部分尚未被选中）
    this.diagram.toolManager.clickSelectingTool.standardMouseSelect = function () {
        var diagram = this.diagram;
        if (diagram === null || !diagram.allowSelect) return;

        var e = diagram.lastInput;
        var count = diagram.currentModel.getSelection().count;
        var object = diagram.findPartAt(e.documentPoint, false); // 获取鼠标位置的视图元素
        var tool = diagram.visualizationTool.toolbarManager.analysisPathTool;
        var maxCount = tool.middleCount + 2; // 获取最大选中数
        var middleNodeDatas = tool.middleNodeDatas;

        this.diagram.startTransaction("standardMouseSelect");

        // 视图元素存在时
        if (object !== null) {
            // 选中项小于2且选中项为节点时，该视图元素设置为选中状态
            if (count < maxCount && object instanceof go.Node) {
                if (!object.isSelected) {
                    if (count === 0) {
                        tool.startNodeData = object.data;
                        tool.endNodeData = null;
                        tool.middleNodeDatas.clear();
                    }
                    else if (count === 1) {
                        tool.endNodeData = object.data;
                    }
                    else {
                        tool.middleNodeDatas.add(object.data);
                    }

                    object.isSelected = true;
                }
            }
                // 其他情况，只选中该视图元素（清除其他已选中项）
            else {
                if (!object.isSelected) {
                    tool.startNodeData = object.data;
                    tool.endNodeData = null;
                    tool.middleNodeDatas.clear();

                    // 只选中该视图元素
                    diagram.currentModel.select(object.data);
                }
            }
            // 鼠标点击处不存在视图元素时
        }
        else if (e.left && !(e.control || e.meta) && !e.shift) {
            tool.startNodeData = null;
            tool.endNodeData = null;
            tool.middleNodeDatas.clear();

            // 清空视图中的所有选中状态
            diagram.currentModel.clearSelection();
        }

        this.diagram.commitTransaction("standardMouseSelect");
    };

    this.diagram.commitTransaction("AnalysisPathTool");
};

/**
* 工具失效处理（override）
*/
vis.AnalysisPathTool.prototype.doDeactivate = function () {
    this.diagram.startTransaction("AnalysisPathTool");

    this.startNodeData = null;
    this.endNodeData = null;
    this.middleNodeDatas.clear();

    // 清空视图中的所有选中状态
    this.diagram.currentModel.clearSelection();

    // 初始化标准工具
    //this.diagram.toolManager.initializeStandardTools();
    // 监听鼠标选择事件（注意该事件触发时，鼠标所在的视图部分尚未被选中）
    this.diagram.toolManager.clickSelectingTool.standardMouseSelect = function () {
        var diagram = this.diagram;
        if (diagram === null || !diagram.allowSelect) return;

        var e = diagram.lastInput;
        var count = diagram.currentModel.getSelection().count;
        var object = diagram.findPartAt(e.documentPoint, false); // 获取鼠标位置的视图元素

        this.diagram.startTransaction("standardMouseSelect");

        // 视图元素存在时
        if (object !== null) {
            if (e.left && !(e.control || e.meta) && !e.shift && !object.isSelected) {
                // 只选中该视图元素
                diagram.currentModel.select(object.data);
            }
            else if (e.left && (e.control || e.meta) && !e.shift) {
                // 非选中该视图元素
                object.isSelected = e.clickCount === 2 ? object.isSelected : !object.isSelected;
            }
            // 鼠标点击处不存在视图元素时
        }
        else if (e.left && !(e.control || e.meta) && !e.shift) {
            // 清空视图中的所有选中状态
            diagram.currentModel.clearSelection();
        }

        this.diagram.commitTransaction("standardMouseSelect");
    };

    this.diagram.commitTransaction("AnalysisPathTool");
};

/**
 * 以起始节点为原点，获取所有节点的相对距离（override）
 * 
 * @param node {go.Node} 当前改变选中状态的节点
 */
vis.AnalysisPathTool.prototype.analysisPath = function () {
    if (!this.isEnabled || !this.isActive) {
        return;
    }

    this.diagram.startTransaction("AnalysisPathTool");

    if (this.startNodeData && this.endNodeData && this.middleNodeDatas.count === this.middleCount && !this.isInAnalysis) {
        this.visualizationTool.isBusy = true;
        this.isInAnalysis = true; // 开始分析

        // 获取所有路径
        this.getAllPaths();

        // 未返现路径时，弹出提示信息
        if (this.paths.count === 0) {
            vis.MessageTool.ShowWarningMessage("未发现任何路径");

            this.isInAnalysis = false; // 结束分析
            this.visualizationTool.isBusy = false;
            return;
        }

        // 清空视图中的所有选中状态
        this.diagram.currentModel.clearSelection();

        // 高亮所有路径
        var iterator = this.paths.iterator;
        while (iterator.next()) {
            var path = iterator.value;

            // 高亮路径
            this.highlightPath(path);
        }

        this.isInAnalysis = false; // 结束分析
        this.visualizationTool.isBusy = false;
    }

    this.diagram.commitTransaction("AnalysisPathTool");
};

/**
 * 获取所有路径（override）
 * 
 * @param startNode {go.Node} 起始节点
 * @param endNode {go.Node} 结束节点
 * @param distances {go.Map} 节点距离集合
 */
vis.AnalysisPathTool.prototype.getAllPaths = function () {
    var start = this.startNodeData;
    var end = this.endNodeData;
    var middles = this.middleNodeDatas; // 获取中间点集合
    var count = this.maxCount;

    var stack = new go.List("object"); // 创建路径堆栈
    stack.add(start); // 将起始节点作为路径的起点

    // 初始化路径集合
    this.paths.clear();

    // 没有中间节点的情况下
    if (middles.count === 0) {
        if (this.isShowAllPath) {
            // 开始寻找所有路径
            this.findAllPath(start, end, count, stack);
        }
        else {
            // 获取其他节点与起始节点的相对距离
            var distances = this.getAllDistances(start);

            // 开始寻找最短路径
            this.findPath(start, end, distances, stack);
        }
    }
        // 存在中间节点的情况下
    else {
        // 开始寻找所有路径
        this.findAllPath(start, end, count, stack);

        // 寻找包含所有中间节点的路径集合
        this.paths = this.findPathsWithMiddles(this.paths, middles);

        if (!this.isShowAllPath) {
            // 寻找最短路径集合
            this.paths = this.findShortestPaths(this.paths);
        }
    }
};

/**
* 寻找两点之间的最短路径（override）
* @param start {Object} 起始节点数据
* @param end {Object} 结束节点数据
* @param distances {go.Map} 节点距离集合
* @param stack {go.List} 路径堆栈
*/
vis.AnalysisPathTool.prototype.findPath = function (start, end, distances, stack) {
    if (!start || !end || !distances || !stack) return;

    var startDistance = distances.getValue(start); // 获取起始节点距离
    var endDistance = distances.getValue(end); // 获取结束节点距离

    var iterator = this.diagram.currentModel.findNodesConnected(start).iterator;
    while (iterator.next()) {
        var neighbor = iterator.value; // 获取邻节点
        var neighborDistance = distances.getValue(neighbor); // 获取邻节点距离

        // 若邻节点为起始节点的下一层，则继续寻找路径，否则跳过
        if (neighborDistance === startDistance + 1) {
            // 若邻节点是结束节点,则生成路径
            if (neighbor.id === end.id) {
                var path = stack; // 获取路径

                // 若路径长度与层数相符，则认为是最短路径，将其加入路经集合，否则跳过
                if (path.count == endDistance) {
                    // 将结束节点放进路径
                    path.add(end);
                    // 将该路径添加进路径集合中
                    this.paths.add(path);
                }
                // 若邻节点不是结束节点,则继续寻找路径
            } else {
                // 生成新的路径堆栈
                var newStack = stack.copy()
                // 将邻节点放进新生成的路径堆栈
                newStack.add(neighbor);
                // 向下一层寻找路径
                this.findPath(neighbor, end, distances, newStack);
            }
        }
    }
};

/**
* 寻找两点之间的所有路径
* 
* @param start {Object} 起始节点数据
* @param end {Object} 结束节点数据
* @param maxCount {Number} 最大节点数据
* @param stack {go.List} 路径堆栈
*/
vis.AnalysisPathTool.prototype.findAllPath = function (start, end, maxCount, stack) {
    if (!start || !end || !maxCount || !stack) {
        return;
    }

    var iterator = this.diagram.currentModel.findNodesConnected(start).iterator;
    while (iterator.next()) {
        var neighbor = iterator.value; // 获取邻节点

        // 若邻节点是起始节点,则属于自反链接，跳过
        if (neighbor.id === start.id) {
            continue;
        }
            // 若邻节点不是结束节点，且不在路径堆栈中，且节点数未超出，则继续寻找路径
        else if (!stack.contains(neighbor) && stack.count < maxCount) {
            // 若邻节点是结束节点,则生成路径
            if (neighbor.id === end.id) {
                var path = stack.copy(); // 获取路径

                // 将结束节点放进路径
                path.add(end);
                // 将该路径添加进路径集合中
                this.paths.add(path);
            } else {
                // 生成新的路径堆栈
                var newStack = stack.copy()
                // 将邻节点放进新生成的路径堆栈
                newStack.add(neighbor);
                // 向下一层寻找路径
                this.findAllPath(neighbor, end, maxCount, newStack);
            }
        }
    }
};

/**
* 寻找包含所有中间节点的路径集合
* 
* @param paths {go.List} 路径集合
* @param middles {go.List} 中间节点集合
* @return {go.List} 包含所有中间节点的路径集合
*/
vis.AnalysisPathTool.prototype.findPathsWithMiddles = function (paths, middles) {
    if (!paths || !middles) {
        return;
    }

    var coll = new go.List(go.List);

    paths.each(function (path) {
        var containAll = true;
        var iterator = middles.iterator;
        while (iterator.next()) {
            var middle = iterator.value;

            if (!path.has(middle)) {
                containAll = false;
                break;
            }
        }

        if (containAll) {
            coll.add(path);
        }
    });

    return coll;
};

/**
* 寻找最短路径集合
* 
* @param paths {go.List} 路径集合
* @return {go.List} 最短路径集合
*/
vis.AnalysisPathTool.prototype.findShortestPaths = function (paths) {
    if (!paths) {
        return;
    }

    var coll = new go.List(go.List);
    var minCount = Infinity;

    paths.each(function (path) {
        if (path.count < minCount) {
            minCount = path.count;
        }
    });

    paths.each(function (path) {
        if (path.count === minCount) {
            coll.add(path);
        }
    });

    return coll;
};

// #endregion 覆写路径分析工具

// #region 覆写文本检索工具

/**
* 判断节点数据是否匹配（override）
*
* @param data {Object} 要进行匹配的节点数据
* @param condition {Object} 用于匹配的检索条件
* @return {Boolean} 是否匹配标识
*/
vis.SearchTextTool.prototype.isNodeDataMatched = function (data, condition) {
    if (!data.isVisible || !data.propertyValues) return false;

    var propertyValues = data.propertyValues;

    for (var i = 0; i < propertyValues.length; i++) {
        var property = propertyValues[i];

        // 属性显示，且属性值包含检索文本时，将该数据放进检索结果集合中
        if (!property.isHidden && property.value.indexOf(condition) >= 0) {
            return true;
        }
    }

    // 匹配批注标题
    if (data.commentTitle && data.commentTitle.indexOf(condition) >= 0) {
        return true;
    }

    // 匹配批注内容
    if (data.commentValue && data.commentValue.indexOf(condition) >= 0) {
        return true;
    }

    return false;
};

/**
* 判断链接数据是否匹配（override）
*
* @param data {Object} 要进行匹配的链接数据
* @param condition {Object} 用于匹配的检索条件
* @return {Boolean} 是否匹配标识
*/
vis.SearchTextTool.prototype.isLinkDataMatched = function (data, condition) {
    if (!data.isVisible || !data.propertyValues) return false;

    var propertyValues = data.propertyValues;

    for (var i = 0; i < propertyValues.length; i++) {
        var property = propertyValues[i];

        // 属性显示，且属性值包含检索文本时，将该数据放进检索结果集合中
        if (!property.isHidden && property.value.indexOf(condition) >= 0) {
            return true;
        }
    }

    // 匹配批注标题
    if (data.commentTitle && data.commentTitle.indexOf(condition) >= 0) {
        return true;
    }

    // 匹配批注内容
    if (data.commentValue && data.commentValue.indexOf(condition) >= 0) {
        return true;
    }

    return false;
};

// #endregion 覆写文本检索工具

// #endregion 根据业务需求覆写相关方法
