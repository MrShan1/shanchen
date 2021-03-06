﻿/// <reference path="go-debug-1.7-test.js" />

(function () {
    var $$ = go.GraphObject.make; //简化定义模板，避免使用$（与jQuery冲突）
    var Consts = {
        BUFFER_HEIGHT: 53, // 坐标缓冲高度
        BUFFER_WIDTH: 0, // 坐标缓冲宽度
        STANDARD_WIDTH_H: 50, // 小时的标准间隔宽度
        STANDARD_WIDTH_M: 24, // 分钟的标准间隔宽度
    };

    //#region 时序图工具

    /**
    * 时序图工具的构造函数
    *
    * @param containerId {String} 视图的容器id
    */
    function TimeSequenceTool(containerId) {
        if (!containerId || !document.getElementById(containerId)) return;

        // 创建模板管理器
        this.templateManager = new ts.TemplateManager();

        // 创建可视化视图
        this.createDiagram(containerId);
    };

    /**
    * 主视图 {go.Diagram}
    */
    TimeSequenceTool.prototype.diagram = null;

    /**
    * 时序图的结束时间 {Date}
    */
    TimeSequenceTool.prototype.endDateTime = null;

    /**
    * 实体类型集合 {go.Map}
    */
    TimeSequenceTool.prototype.entityTypes = new go.Map("string", "object");

    /**
    * 时间轴间隔的初始单位长度(px) {Number}
    */
    TimeSequenceTool.prototype.initialIntervalWidth = 0.5 / 60;

    /**
    * 链接类型集合 {go.Map}
    */
    TimeSequenceTool.prototype.linkTypes = new go.Map("string", "object");

    /**
    * 时序图的开始时间 {Date}
    */
    TimeSequenceTool.prototype.startDateTime = null;

    /**
    * 模板管理器 {TemplateManager}
    */
    TimeSequenceTool.prototype.templateManager = null;

    /**
    * 为视图事件添加监听器
    *
    * @param eventName {String} 视图事件名称
    * @param func {Function} 监听函数
    * @param caller {Object|null} 函数呼出元
    */
    TimeSequenceTool.prototype.addDiagramListener = function (eventName, func, caller) {
        if (!eventName || !func) return;

        var listener = function (event) {
            if (caller) {
                func.apply(caller, arguments);
            }
            else {
                func.apply(null, arguments);
            }
        };

        this.diagram.addDiagramListener(eventName, listener);
    };

    /**
    * 将类型集合添加进对应的类型Map中
    *
    * @param array {Array} 要添加的数据集合
    * @param map {go.Map} 数据集合对应的Map
    * @param isEntityType {Boolean} 数据是否为实体类型
    */
    TimeSequenceTool.prototype.addTypeArrayToTypeMap = function (array, map, isEntityType) {
        if (!array || !map) return;

        var length = array.length;
        for (var i = 0; i < length; i++) {
            var item = array[i];

            // 不包含该数据时，将该数据添加进Map中
            if (!map.contains(item.id)) {
                // 判定数据是否为实体类型
                if (isEntityType) {
                    // 编辑实体类型信息
                    this.editEntityType(item);
                }
                else {
                    // 编辑链接类型信息
                    this.editLinkType(item);
                }

                // 将类型集合添加进对应的类型Map中
                map.add(item.id, item);
            }
        }
    };

    /**
    * 组合属性信息
    * 
    * @param properties {Array} 属性集合
    * @param propertyValues {Array} 属性值集合
    */
    TimeSequenceTool.prototype.combinePropertyInfo = function (properties, propertyValues) {
        if (!properties || !propertyValues) return;

        var proLength = properties.length;
        var proValLength = propertyValues.length;

        for (var i = 0; i < proValLength; i++) {
            var propertyValue = propertyValues[i];

            for (var j = 0; j < proLength; j++) {
                var property = properties[j];

                // 数据id匹配时，组合属性信息
                if (propertyValue.id === property.id) {
                    for (var p in property) {
                        if (!p in propertyValue) {
                            propertyValue[p] = property[p];
                        }
                    }

                    break;
                }
            }
        }
    };

    /**
    * 配置视图的数据模型
    *
    * @param diagram {go.Diagram} 主视图
    */
    TimeSequenceTool.prototype.configDiagramModel = function (model) {
        if (!model) return;

        model.nodeKeyProperty = "id"; // 设置节点的主键标识为"id"
        model.linkKeyProperty = "id"; // 设置链接的主键标识为"id"
        model.linkFromKeyProperty = "fromEntityId"; // 设置链接起始节点的主键标识为"fromEntityId"
        model.linkToKeyProperty = "toEntityId"; // 设置链接到达节点的主键标识为"toEntityId"
        model.modelData = {}; // 初始化modelData
    };

    /**
    * 配置视图的基本设置
    *
    * @param diagram {go.Diagram} 主视图
    */
    TimeSequenceTool.prototype.configDiagramSetting = function (diagram) {
        if (!diagram) return;

        diagram.allowCopy = false; // 禁止复制功能
        diagram.allowDelete = false; // 禁止删除功能
        diagram.commandHandler.decreaseZoom = this.decreaseTimeLineWidth; // 覆写减小缩放处理
        diagram.commandHandler.increaseZoom = this.increaseTimeLineWidth; // 覆写增加缩放处理
        diagram.contentAlignment = go.Spot.TopLeft; // 设置内容对齐方式为左上
        //diagram.grid.visible = true; // 显示背景网格
        diagram.layout = $$(go.GridLayout,
            {
                alignment: go.GridLayout.Position,
                comparer: function (a, b) {
                    var ay = a.location.y;
                    var by = b.location.y;
                    if (isNaN(ay) || isNaN(by)) return 0;
                    if (ay < by) return -1;
                    if (ay > by) return 1;
                    return 0;
                },
                //isOngoing: false,
                wrappingColumn: 1,
            }); // 设置视图的布局为网格布局
        diagram.linkTemplate = this.templateManager.linkTemplate; // 设置视图的链接模板
        diagram.model = new go.GraphLinksModel(); // 设置视图的数据模型
        diagram.nodeTemplate = this.templateManager.nodeTemplate; // 设置视图的节点模板
        diagram.toolManager.resizingTool.maxSize = new go.Size(NaN, NaN); // 设置调整大小工具的最大值
        diagram.undoManager.isEnabled = false; // 禁止撤销\恢复操作记录
    };

    /**
    * 创建可视化视图
    *
    * @param containerId {String} 视图的容器id
    */
    TimeSequenceTool.prototype.createDiagram = function (containerId) {
        if (!containerId) return;

        // 创建视图
        this.diagram = new go.Diagram(containerId);

        // 将时序图工具附在视图上
        this.diagram.parentTool = this;

        // 配置视图的基本设置
        this.configDiagramSetting(this.diagram);

        // 配置视图的数据模型
        this.configDiagramModel(this.diagram.model);

        // 初始化模型数据
        this.initializeModelData(this.diagram.model.modelData);

        // 初始化时间线
        this.initializeTimeLine();

        // 布局完成时，更新视图的图形边界
        this.addDiagramListener("LayoutCompleted", this.updateDocumentBounds, this);

        // 调整元素大小时，更新视图上所有链接的路由
        //this.addDiagramListener("PartResized", this.updateAllLinksRoute, this);

        // 选中元素移动时，更新视图的图形边界
        this.addDiagramListener("SelectionMoved", this.updateDocumentBounds, this);

        // 选中元素移动时，更新视图的可视边界坐标
        this.addDiagramListener("SelectionMoved", this.updateViewPoint, this);

        // 选中元素移动时，更新视图的布局
        this.addDiagramListener("SelectionMoved", this.updateLayout, this);

        // 可视区域的边界改变时，更新视图的可视边界坐标
        this.addDiagramListener("ViewportBoundsChanged", this.updateViewPoint, this);
    };

    /**
    * 减小时间轴长度
    */
    TimeSequenceTool.prototype.decreaseTimeLineWidth = function () {
        var diagram = this.diagram;
        var tool = diagram.parentTool;
        var object = diagram.timeline.locationObject; // 获取时间轴的坐标对象

        // 减少当前长度的10%
        object.width -= object.width / 10;

        // 延时更新视图的链接路由
        ts.TimeoutTool.doDelay(tool, tool.updateAllLinksRoute, 50);
        // 延时更新链视的图形边界
        ts.TimeoutTool.doDelay(tool, tool.updateDocumentBounds, 50);
    };

    /**
    * 编辑实体类型信息
    *
    * @param dataType {Object} 数据类型
    */
    TimeSequenceTool.prototype.editEntityType = function (dataType) {
        if (!dataType) return;
    };

    /**
    * 编辑时间轴的极值
    *
    * @param links {Array} 链接数据集合
    */
    TimeSequenceTool.prototype.editLimitValueByEntity = function (links) {
        if (!links) return;

        var length = links.length;
        for (var i = 0; i < length; i++) {
            var link = links[i];
            var date = new Date(link.startDateTime);

            // 设置时序图的开始时间
            if (!this.startDateTime || this.startDateTime > date) {
                // 设置为该日期的0点整
                this.startDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            }

            // 设置时序图的结束时间
            if (!this.endDateTime || this.endDateTime < date) {
                // 设置为该日期的下一天的0点整
                this.endDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
            }
        }
    };

    /**
    * 编辑链接类型信息
    *
    * @param dataType {Object} 数据类型
    */
    TimeSequenceTool.prototype.editLinkType = function (dataType) {
        if (!dataType) return;

        // 设置颜色
        dataType.color = go.Brush.randomColor(64, 192);
        // 设置线的宽度
        dataType.strokeWidth = 2.5;
    };

    /**
    * 编辑实体数据的主要属性
    *
    * @param dataType {Object} 数据类型
    * @param data {Object} 数据
    */
    TimeSequenceTool.prototype.editMainEntityProperty = function (dataType, data) {
        if (!dataType || !data) return;

        // 设置节点标识
        data.isNode = true;
        // 设置颜色
        data.color = data.color || dataType.color || "#ea9543";
        // 设置形状
        data.shape = data.shape || dataType.shape || "Circle";
        // 设置图片路径
        data.iconName = dataType.iconName;
        // 设置显示状态
        data.isVisible = data.isVisible === undefined ? true : data.isVisible;
        // 设置选中状态
        data.isSelected = this.isNewNodeSelected;
        // 设置高亮状态
        data.isHighlighted = false;
        // 初始显示图片部分
        data.showPicture = false;
        // 初始显示文本列表部分
        data.showTextList = false;
    };

    /**
    * 编辑链接数据的主要属性
    *
    * @param dataType {Object} 数据类型
    * @param data {Object} 数据
    */
    TimeSequenceTool.prototype.editMainLinkProperty = function (dataType, data) {
        if (!dataType || !data) return;

        // 设置链接标识
        data.isLink = false;
        // 设置颜色
        data.color = data.color || dataType.color || "black";
        // 设置线的宽度
        data.strokeWidth = dataType.strokeWidth || 1.5;
        // 设置显示状态
        data.isVisible = data.isVisible === undefined ? true : data.isVisible;
        // 设置选中状态
        data.isSelected = this.isNewLinkSelected;
        // 设置高亮状态
        data.isHighlighted = false;
        // 初始显示文本列表部分
        data.showTextList = false;
    };

    /**
    * 根据数据类型扩展数据信息
    *
    * @param dataTypes {go.Map} 数据类型集合
    * @param datas {Array} 数据集合
    * @param isEntityData {Boolean} 是否为实体数据
    */
    TimeSequenceTool.prototype.extendDataByDataType = function (dataTypes, datas, isEntityData) {
        if (!dataTypes || !datas) return;

        var length = datas.length;
        for (var i = 0; i < length; i++) {
            var data = datas[i];
            var typeId = data.typeId;

            // 数据类型匹配时，组合属性信息
            if (typeId && dataTypes.contains(typeId)) {
                var dataType = dataTypes.getValue(typeId);

                if (isEntityData) {
                    // 编辑实体数据的主要属性
                    this.editMainEntityProperty(dataType, data);
                }
                else {
                    // 编辑链接数据的主要属性
                    this.editMainLinkProperty(dataType, data);
                }

                // 组合属性信息
                this.combinePropertyInfo(dataType.properties, data.propertyValues);
            }
        }
    };

    /**
    * 过滤掉已存在的实体数据
    * 
    * @param array {Array} 需要过滤的实体数据集合
    * @param model {go.GraphLinksModel} 视图模型
    * @return {Array} 过滤后的实体数据集合
    */
    TimeSequenceTool.prototype.filterEntities = function (array, model) {
        if (!array || !model) return;

        var length = array.length;
        var resultArray = [];

        for (var i = 0; i < length; i++) {
            var item = array[i];

            // 不包含该数据时，将该数据添加进Map中
            if (!model.findNodeDataForKey(item.id)) {
                resultArray.push(item);
            }
        }

        return resultArray;
    };

    /**
    * 过滤掉已存在的链接数据
    * 
    * @param array {Array} 需要过滤的链接数据集合
    * @param model {go.GraphLinksModel} 视图模型
    * @return {Array} 过滤后的链接数据集合
    */
    TimeSequenceTool.prototype.filterLinks = function (array, model) {
        if (!array || !model) return;

        var length = array.length;
        var resultArray = [];

        for (var i = 0; i < length; i++) {
            var item = array[i];

            // 不包含该数据时，将该数据添加进Map中
            if (!model.findLinkDataForKey(item.id)) {
                resultArray.push(item);
            }
        }

        return resultArray;
    };

    /**
    * 增加时间轴长度
    */
    TimeSequenceTool.prototype.increaseTimeLineWidth = function () {
        var diagram = this.diagram;
        var tool = diagram.parentTool;
        var object = diagram.timeline.locationObject; // 获取时间轴的坐标对象

        // 增加当前长度的10%
        object.width += object.width / 10;

        // 延时更新视图的链接路由
        ts.TimeoutTool.doDelay(tool, tool.updateAllLinksRoute, 20);
        // 延时更新链视的图形边界
        ts.TimeoutTool.doDelay(tool, tool.updateDocumentBounds, 20);
    };

    /**
    * 初始化模型数据
    *
    * @param modelData {object} 模型数据
    */
    TimeSequenceTool.prototype.initializeModelData = function (modelData) {
        if (!modelData) return;

        var date = new Date(); // 获取当前时间
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var millisecond = date.getMilliseconds();

        // 获取开始时间
        this.startDateTime = new Date(year, month, day - 1, hour, minute, second);
        // 获取结束时间
        this.endDateTime = new Date(year, month, day + 1, hour, minute, second);

        // 初始化modelData，用于时间轴初始显示
        modelData.intervalWidth = this.initialIntervalWidth; // 设置初始的单位间距宽度
        modelData.startDateTime = this.startDateTime; // 设置初始的开始时间
        modelData.endDateTime = this.startDateTime; // 设置初始的结束时间
        modelData.viewPoint = new go.Point(0, 0); // 设置初始的坐标原点
    };

    /**
    * 初始化时间线
    */
    TimeSequenceTool.prototype.initializeTimeLine = function () {
        // 创建日期线
        var dateline = this.templateManager.dateLineTemplate;
        dateline.data = this.diagram.model.modelData; // 将数据模型作为轴线的数据源

        // 将日期轴添加进视图中
        this.diagram.add(dateline);
        this.diagram.dateline = dateline;

        // 创建时间线
        var timeline = this.templateManager.timeLineTemplate;
        timeline.data = this.diagram.model.modelData; // 将数据模型作为轴线的数据源

        // 将时间轴添加进视图中
        this.diagram.add(timeline);
        this.diagram.timeline = timeline;
    };

    /**
    * 监听繁忙状态改变
    *
    * @param isBusy {Boolean} 繁忙状态
    */
    TimeSequenceTool.prototype.listenIsBusyChanged = function (isBusy) {

    };

    /**
    * 为视图加载数据
    *
    * @param modelData {Object} 需要在视图中展示的json数据
    */
    TimeSequenceTool.prototype.loadData = function (modelData) {
        if (!modelData || !modelData.entities) return;

        this.isBusy = true; // 设置为繁忙状态

        var model = this.diagram.model; // 获取当前数据模型

        // 视图上无节点，则视为第一次加载，清空开始时间和结束时间
        if (this.diagram.nodes.count === 0) {
            this.startDateTime = null;
            this.endDateTime = null;
        }

        // 添加实体类型集合
        this.addTypeArrayToTypeMap(modelData.entityTypes, this.entityTypes, true);

        // 添加链接类型集合
        this.addTypeArrayToTypeMap(modelData.linkTypes, this.linkTypes, false);

        // 过滤实体数据
        var entities = this.filterEntities(modelData.entities, model);

        // 过滤链接数据
        var links = this.filterLinks(modelData.links, model);

        // 扩展实体信息
        this.extendDataByDataType(this.entityTypes, entities, true);

        // 扩展链接信息
        this.extendDataByDataType(this.linkTypes, links, false);

        // 向视图中添加实体信息
        entities && model.addNodeDataCollection(entities);

        // 向视图中添加实体关系信息
        links && model.addLinkDataCollection(links);

        // 编辑时间轴的极值
        this.editLimitValueByEntity(links);

        // 获取新增节点集合
        this.newNodeDataCollection = entities;

        // 获取新增链接集合
        this.newLinkDataCollection = links;

        // 初始化布局
        if (this.allowInitializeLayout) {
            this.diagram.layoutDiagram(true);
        }

        this.isBusy = false; // 取消繁忙状态

        // 刷新时间轴
        this.updateTimeline();
    };

    /**
    * 更新视图中的所有的链接路由
    */
    TimeSequenceTool.prototype.updateAllLinksRoute = function () {
        var diagram = this.diagram;

        // 重新计算链接路由
        diagram.links.each(function (obj) {
            obj.computeStartPointX();
            obj.computeEndPointX();
        });

        // 更新视图
        diagram.rebuildParts();
    };

    /**
    * 更新视图的图形边界
    */
    TimeSequenceTool.prototype.updateDocumentBounds = function () {
        var diagram = this.diagram;
        var bounds = diagram.computePartsBounds(diagram.nodes); // 获取视图上的节点集合的边界
        var bufferHeight = ts.Consts.BUFFER_HEIGHT; // 获取缓冲高度

        // 计算视图的图形边界
        diagram.fixedBounds = new go.Rect(bounds.x, bounds.y - bufferHeight,
            bounds.width + 58, bounds.height + bufferHeight);
    };

    /**
    * 更新视图的布局
    */
    TimeSequenceTool.prototype.updateLayout = function () {
        // 布局无效化，触发重新布局
        this.diagram.layout.invalidateLayout();
    };

    /**
    * 刷新时间轴
    *
    * @param startDateTime {Date} 开始时间
    * @param endDateTime {Date} 结束时间
    */
    TimeSequenceTool.prototype.updateTimeline = function (startDateTime, endDateTime) {
        var model = this.diagram.model;

        // 更新开始时间
        if (startDateTime) {
            this.startDateTime = startDateTime;
        }

        // 更新结束时间
        if (endDateTime) {
            this.endDateTime = endDateTime;
        }

        // 设置模型数据的开始时间
        model.setDataProperty(model.modelData, "startDateTime", this.startDateTime);
        // 设置模型数据的结束时间
        model.setDataProperty(model.modelData, "endDateTime", this.endDateTime);
    };

    /**
    * 更新视图的可视边界坐标
    */
    TimeSequenceTool.prototype.updateViewPoint = function () {
        var diagram = this.diagram;
        var model = diagram.model;
        var vb = diagram.viewportBounds;

        // 更新视图的可视边界坐标
        model.setDataProperty(model.modelData, "viewPoint", new go.Point(vb.x, vb.y));
        // 更新视图的相关数据绑定
        diagram.updateAllTargetBindings("viewPoint");
    };

    /**
    * 获取或设置是否处于繁忙状态
    *
    * @param value {Boolean} 繁忙状态标识
    * @return {Boolean} 繁忙状态标识
    */
    Object.defineProperty(TimeSequenceTool.prototype, "isBusy", {
        get: function () {
            return this._isBusy === true ? true : false;
        },
        set: function (value) {
            if (this._isBusy !== value) {
                this._isBusy = value;

                // 监听繁忙状态改变
                this.listenIsBusyChanged(this._isBusy);
            }
        }
    });

    //#endregion 时序图工具

    //#region 延时执行工具

    /**
    * 延时执行工具的构造函数
    */
    function TimeoutTool() {

    }

    /**
    * 延时执行函数
    *
    * @param caller {Object} 处理呼出元
    * @param func {String} 要延时执行的函数
    * @param delay {Number} 延时时间
    */
    TimeoutTool.doDelay = function (caller, func, delay) {
        if (!func) return;

        // 清除对应id的计时器，防止函数被高频调用
        clearTimeout(func.timerId);

        // 记录计时器id，延时执行函数
        func.timerId = setTimeout(function () {
            func.call(caller);
        }, delay);
    };

    //#endregion 延时执行工具

    //#region 模板管理器

    /**
    * 模板管理器的构造函数
    */
    function TemplateManager() {
        // 创建预定义模板资源
        this.createTemplates();
    };

    /**
    * 样式资源集合 {Object}
    */
    TemplateManager.prototype.styles = {
        // 部件样式_轴部件
        partStyle: {
            graduatedMin: 0,
            graduatedMax: 10,
            graduatedTickBase: 1514736000, // 刻度间隔参照标准(2018/01/01 00:00:00)/1000
            graduatedTickUnit: 1, //刻度间隔单元
            isInDocumentBounds: false,
            isLayoutPositioned: false,
            layerName: "Foreground",
            movable: false,
            //resizable: true,
            selectionAdorned: false,
        },
        // 图形样式_主轴
        shapeStyle: {
            height: 1, // 高度设为1.去除多余高度
            //stroke: "#519ABA",
            stroke: "#8d959f",
            strokeWidth: 2,
        },
        // 图形样式_刻度线
        shapeStyle2: {
            alignmentFocus: go.Spot.Bottom,
            //stroke: "#519ABA",
            stroke: "#8d959f",
        },
        // 文本样式_刻度文字
        textBlockStyle: {
            background: "transparent",
            font: "10pt sans-serif",
            stroke: "gray",
        },
    };

    /**
    * 用刻度转换刻度文字(日)
    *
    * @param data {Object} 绑定数据
    * @return {String}
    */
    TemplateManager.prototype.convertDTextByGraduated = function (data) {
        var date = new Date(data * 1000);
        //var day = date.getDate();
        //var text = day === 0 ? "" : day.toString() + "日";
        var text = date.toLocaleDateString();

        return text;
    };

    /**
    * 用时间转换刻度(时间线刻度)
    *
    * @param data {Object} 绑定数据
    * @return {Number}
    */
    TemplateManager.prototype.convertGraduatedByDateTime = function (data) {
        var milliseconds = data.getTime(); // 获取该时间的毫秒数
        var units = milliseconds / (1000); // 获取单元数

        return units;
    };

    /**
    * 用间隔宽度转换刻度(时)的时间间隔
    *
    * @param data {Object} 绑定数据
    * @return {Number}
    */
    TemplateManager.prototype.convertHShapeIntervalByIntervalWidth = function (data) {
        var standardInterval = 3600; // 小时的标准间隔(3600秒)
        var standardWidth = ts.Consts.STANDARD_WIDTH_H; // 小时的标准间隔宽度
        var width = data * standardInterval; // 当前每小时的间隔宽度

        if (standardWidth / 2 <= width) {
            interval = standardInterval;
        }
        else if (standardWidth / 4 <= width && width < standardWidth / 2) {
            interval = standardInterval * 3;
        }
        else if (standardWidth / 6 <= width && width < standardWidth / 4) {
            interval = standardInterval * 6;
        }
        else if (standardWidth / 8 <= width && width < standardWidth / 6) {
            interval = standardInterval * 12;
        }
        else {
            interval = standardInterval * 24;
        }

        return interval;
    };

    /**
    * 用刻度转换刻度(时)的显示状态
    *
    * @param data {Object} 绑定数据
    * @return {String}
    */
    TemplateManager.prototype.convertHShapeVisibleByGraduated = function (data) {
        var standardInterval = 3600; // 小时的标准间隔(3600秒)
        var standardWidth = ts.Consts.STANDARD_WIDTH_H; // 小时的标准间隔宽度
        var width = data * standardInterval; // 当前每小时的间隔宽度
        var visible = standardWidth / 16 < width ? true : false;

        return visible;
    };

    /**
    * 用刻度转换刻度文字(时)
    *
    * @param data {Object} 绑定数据
    * @return {String}
    */
    TemplateManager.prototype.convertHTextByGraduated = function (data) {
        var date = new Date(data * 1000);
        var hour = date.getHours();
        var minute = date.getMinutes();
        var minuteStr = minute < 10 ? "0" + minute.toString() : minute.toString();
        var text = hour.toString() + ":" + minuteStr;

        return text;
    };

    /**
    * 用间隔宽度转换刻度文字(时)的时间间隔
    *
    * @param data {Object} 绑定数据
    * @return {Number}
    */
    TemplateManager.prototype.convertHTextIntervalByIntervalWidth = function (data) {
        var standardInterval = 3600; // 小时的标准间隔(3600秒)
        var standardWidth = ts.Consts.STANDARD_WIDTH_H; // 小时的标准间隔宽度
        var width = data * standardInterval; // 当前每小时的间隔宽度

        if (standardWidth <= width) {
            interval = standardInterval;
        }
        else if (standardWidth / 1.25 <= width && width < standardWidth) {
            interval = standardInterval * 3;
        }
        else if (standardWidth / 2 <= width && width < standardWidth / 1.25) {
            interval = standardInterval * 6;
        }
        else if (standardWidth / 4 <= width && width < standardWidth / 2) {
            interval = standardInterval * 12;
        }
        else {
            interval = standardInterval * 24;
        }

        return interval;
    };

    /**
    * 用刻度转换刻度文字(时)的时间间隔
    *
    * @param data {Object} 绑定数据
    * @return {String}
    */
    TemplateManager.prototype.convertHTextVisibleByGraduated = function (data) {
        var standardInterval = 3600; // 小时的标准间隔(3600秒)
        var standardWidth = ts.Consts.STANDARD_WIDTH_H; // 小时的标准间隔宽度
        var width = data * standardInterval; // 当前每小时的间隔宽度
        var visible = standardWidth / 4 < width ? true : false;

        return visible;
    };

    /**
    * 用视野坐标转换轴线的位置
    *
    * @param data {Object} 绑定数据
    * @return {go.Point}
    */
    TemplateManager.prototype.convertLocationByViewPoint = function (data) {
        var bufferWidth = ts.Consts.BUFFER_WIDTH; // 获取缓冲宽度
        var bufferHeight = ts.Consts.BUFFER_HEIGHT; // 获取缓冲高度

        return new go.Point(bufferWidth, data.y + bufferHeight);
    };

    /**
    * 用模型数据转化链接文本
    *
    * @param data {Object} 绑定数据
    * @return {String}
    */
    TemplateManager.prototype.convertLTextByData = function (data) {
        var startDateTime = new Date(data.startDateTime);
        var endDateTime = new Date(data.endDateTime);
        var seconds = (endDateTime - startDateTime) / (1000); // 获取秒数
        var minute = parseInt(seconds / 60); // 获取分钟数
        var second = seconds % 60; // 获取秒数

        // 秒数小于10时，前面补0
        if (second < 10) {
            second = "0" + second;
        }

        return minute + ":" + second;
    };

    /**
    * 用间隔宽度转换刻度(分)的时间间隔
    *
    * @param data {Object} 绑定数据
    * @return {Number}
    */
    TemplateManager.prototype.convertMShapeIntervalByIntervalWidth = function (data) {
        var standardInterval = 60; // 分钟的标准间隔(60秒)
        var standardWidth = ts.Consts.STANDARD_WIDTH_M; // 分钟的标准间隔宽度
        var width = data * standardInterval; // 当前每分钟的间隔宽度

        if (standardWidth / 2 <= width) {
            interval = standardInterval;
        }
        else if (standardWidth / 4 <= width && width < standardWidth / 2) {
            interval = standardInterval * 5;
        }
        else if (standardWidth / 6 <= width && width < standardWidth / 4) {
            interval = standardInterval * 10;
        }
        else if (standardWidth / 8 <= width && width < standardWidth / 6) {
            interval = standardInterval * 30;
        }
        else {
            interval = standardInterval * 60;
        }

        return interval;
    };

    /**
    * 用刻度转换刻度(分)的显示状态
    *
    * @param data {Object} 绑定数据
    * @return {String}
    */
    TemplateManager.prototype.convertMShapeVisibleByGraduated = function (data) {
        var standardInterval = 60; // 分钟的标准间隔(60秒)
        var standardWidth = ts.Consts.STANDARD_WIDTH_M; // 分钟的间隔标准宽度
        var width = data * standardInterval; // 当前每分钟的间隔宽度
        var visible = standardWidth / 16 < width ? true : false;

        return visible;
    };

    /**
    * 用间隔宽度转换刻度文字(分)的时间间隔
    *
    * @param data {Object} 绑定数据
    * @return {Number}
    */
    TemplateManager.prototype.convertMTextIntervalByIntervalWidth = function (data) {
        var standardInterval = 60; // 分钟的标准间隔(60秒)
        var standardWidth = ts.Consts.STANDARD_WIDTH_M; // 分钟的标准间隔宽度
        var width = data * standardInterval; // 当前每分钟的间隔宽度

        if (standardWidth <= width) {
            interval = standardInterval;
        }
        else if (standardWidth / 2 <= width && width < standardWidth) {
            interval = standardInterval * 5;
        }
        else if (standardWidth / 4 <= width && width < standardWidth / 2) {
            interval = standardInterval * 10;
        }
        else if (standardWidth / 8 <= width && width < standardWidth / 4) {
            interval = standardInterval * 30;
        }
        else {
            interval = standardInterval * 60;
        }

        return interval;
    };

    /**
    * 用刻度转换刻度文字(分)
    *
    * @param data {Object} 绑定数据
    * @return {String}
    */
    TemplateManager.prototype.convertMTextByGraduated = function (data) {
        var date = new Date(data * 1000);
        var minute = date.getMinutes();
        var text = minute === 0 ? "" : minute.toString();

        return text;
    };

    /**
    * 用刻度转换刻度文字(分)的显示状态
    *
    * @param data {Object} 绑定数据
    * @return {String}
    */
    TemplateManager.prototype.convertMTextVisibleByGraduated = function (data) {
        var standardInterval = 60; // 分钟的标准间隔(60秒)
        var standardWidth = ts.Consts.STANDARD_WIDTH_M; // 分钟的间隔标准宽度
        var width = data * standardInterval; // 当前每分钟的间隔宽度
        var visible = standardWidth / 8 < width ? true : false;

        return visible;
    };

    /**
    * 用时间线宽度转化模型数据
    *
    * @param data {Object} 绑定数据
    * @param objectData {Object} 绑定数据所在的对象
    * @param model {go.GraphLinksModel} 数据模型
    * @return {String}
    */
    TemplateManager.prototype.convertModelDataByWidth = function (data, objectData, model) {
        var startDateTime = objectData.startDateTime;
        var endDateTime = objectData.endDateTime;
        var units = (endDateTime - startDateTime) / (1000); // 获取单元数
        var intervalWidth = data / units;

        model.setDataProperty(objectData, "intervalWidth", intervalWidth);

        return objectData;
    };

    /**
    * 用视野坐标转换节点的信息面板边距
    *
    * @param data {Object} 绑定数据
    * @return {go.Margin}
    */
    TemplateManager.prototype.convertNMarginByViewPoint = function (data) {
        return new go.Margin(0, 0, 0, data.x + 5);
    };

    /**
    * 用模型数据转化轴线宽度
    *
    * @param data {Object} 绑定数据
    * @return {String}
    */
    TemplateManager.prototype.convertWidthByModelData = function (data) {
        var startDateTime = data.startDateTime;
        var endDateTime = data.endDateTime;
        var intervalWidth = data.intervalWidth;
        var units = (endDateTime - startDateTime) / (1000); // 获取单元数(秒数)
        var width = units * intervalWidth; // 计算时间轴长度

        return width;
    };

    /**
    * 创建日期轴模板_标准
    *
    * return {go.Part} 日期轴模板
    */
    TemplateManager.prototype.createDatelineTemplate = function () {
        var template =
            // 日期轴
            $$(go.Part, "Graduated",
                this.styles.partStyle,
                {
                    background: "#e3efff",
                    locationObjectName: "MAIN_LINE",
                    name: "DATE_LINE",
                },
                new go.Binding("graduatedMax", "endDateTime", this.convertGraduatedByDateTime).ofModel(),
                new go.Binding("graduatedMin", "startDateTime", this.convertGraduatedByDateTime).ofModel(),
                new go.Binding("location", "viewPoint", this.convertLocationByViewPoint).ofModel(),
                // 日期线主轴
                $$(go.Shape, "LineH",
                    this.styles.shapeStyle,
                    {
                        name: "MAIN_LINE",
                    },
                    new go.Binding("width", "", this.convertWidthByModelData).ofModel()
                ),
                // 刻度线(日)
                $$(go.Shape,
                    this.styles.shapeStyle2,
                    {
                        geometryString: "M0 0 V35",
                        interval: 86400,
                        strokeWidth: 2.5,
                    }
                ),
                // 刻度文字(日)
                $$(go.TextBlock,
                    this.styles.textBlockStyle,
                    {
                        alignmentFocus: go.Spot.TopLeft,
                        font: "bold 10pt sans-serif",
                        graduatedFunction: this.convertDTextByGraduated,
                        interval: 86400,
                        segmentOffset: new go.Point(0, -55),
                        stroke: "black",
                    }
                )
            );

        return template;
    };

    /**
    * 创建组织模板_标准
    *
    * return {go.Group} 组织模板
    */
    TemplateManager.prototype.createGroupTemplate = function () {
        var template =
            $$(go.Group, "Auto",
                {
                    background: "transparent",
                    layout:
                        // 网格布局
                        $$(go.GridLayout,
                            {
                                wrappingColumn: 1
                            }
                        ),
                    location: new go.Point(0, ts.Consts.BUFFER_HEIGHT),
                    maxLocation: new go.Point(0, Infinity),
                    minLocation: new go.Point(0, -Infinity),
                    selectionAdorned: false,
                },
                $$(go.Placeholder)
            );

        return template;
    };

    /**
    * 创建装饰模板_标准
    *
    * return {go.Adornment} 装饰模板
    */
    TemplateManager.prototype.createAdornmentTemplate = function () {
        var template =
            // 装饰模板
            $$(go.Adornment, "Spot",
                // 信息文本(起始时间)
                $$(go.TextBlock,
                    {
                        alignmentFocus: go.Spot.Right,
                        background: "white",
                        font: "bold 6pt sans-serif",
                        margin: new go.Margin(0, 5),
                        name: "TEXT",
                        segmentIndex: 0,
                        segmentOffset: new go.Point(-8, 0),
                        stroke: "red",
                    },
                    new go.Binding("text", "startDateTime")
                ),
                // 信息文本(结束时间)
                $$(go.TextBlock,
                    {
                        alignmentFocus: go.Spot.Left,
                        background: "white",
                        font: "bold 6pt sans-serif",
                        name: "TEXT",
                        segmentIndex: -1,
                        segmentOffset: new go.Point(8, 0),
                        stroke: "red",
                    },
                    new go.Binding("text", "endDateTime")
                )
            );

        return template;
    };

    /**
    * 创建链接模板_标准
    *
    * return {go.Link} 链接模板
    */
    TemplateManager.prototype.createLinkTemplate = function () {
        var tempalte =
            // 链接模板
            $$(ts.CustomLink,
                {
                    cursor: "pointer",
                    routing: go.Link.Orthogonal,
                },
                // 链接的线
                $$(go.Shape,
                    {
                        stroke: "#606060",
                        strokeWidth: 1.5
                    }
                ),
                // 链接的起始箭头
                $$(go.Shape,
                    {
                        fill: "#909090",
                        stroke: "#909090",
                        strokeWidth: 0.5,
                        fromArrow: "Circle",
                    }
                ),
                // 链接的到达箭头
                $$(go.Shape,
                    {
                        fill: "#404040",
                        stroke: "#404040",
                        strokeWidth: 1.5,
                        toArrow: "BackwardCircleFork",
                    }
                ),
                // 信息面板
                $$(go.Panel, "Auto",
                    {
                        background: "gray",
                        alignment: go.Spot.Center
                    },
                    // 边框图形
                    $$(go.Shape, "RoundedRectangle",
                        {
                            name: "TEXT_PANEL_SHAPE",
                            fill: "aliceblue",
                            stroke: "darkgrey",
                            alignment: go.Spot.Center
                        }
                    ),
                    // 信息文本
                    $$(go.TextBlock,
                        {
                            background: "wheat",
                            font: "6pt sans-serif",
                            name: "TEXT",
                            stroke: "#606060",
                            textAlign: "center"
                        },
                        new go.Binding("text", "", this.convertLTextByData)
                    )
                )
            );

        return tempalte;
    };

    /**
    * 创建节点模板_标准
    *
    * return {go.Node} 节点模板
    */
    TemplateManager.prototype.createNodeTemplate = function () {
        var template =
            // 节点模板
            $$(go.Node, "Vertical",
                {
                    alignment: go.Spot.Left,
                    cursor: "pointer",
                    //locationObjectName: "INFO_PANEL",
                    maxLocation: new go.Point(0, Infinity),
                    minLocation: new go.Point(0, -Infinity),
                    selectionObjectName: "PICTURE",
                },
                // 主要信息面板
                $$(go.Panel, "Vertical",
                    {
                        alignment: go.Spot.Left,
                        //background: "white",
                        name: "INFO_PANEL",
                    },
                    new go.Binding("margin", "viewPoint", this.convertNMarginByViewPoint).ofModel(),
                    // 照片信息
                    $$(go.Picture,
                        {
                            desiredSize: new go.Size(30, 50),
                            imageStretch: go.GraphObject.UniformToFill,
                            name: "PICTURE",
                        },
                        new go.Binding("source", "iconName")
                    ),
                    // 文本信息
                    $$(go.TextBlock,
                        {
                            //background: "white",
                            font: "6pt sans-serif",
                            margin: new go.Margin(5, 0, 2, 0),
                            name: "TEXT",
                            stroke: "#606060",
                        },
                        new go.Binding("text", "phoneNum")
                    )
                ),
                // 链接轴
                $$(go.Shape, "LineH",
                    this.styles.shapeStyle,
                    {
                        alignment: go.Spot.Left,
                        margin: new go.Margin(-20, 0, 0, 0),
                        portId: "",
                        stroke: "#519aba",
                        strokeWidth: 1,
                    },
                    new go.Binding("width", "", this.convertWidthByModelData).ofModel()
                )
            );

        return template;
    };

    /**
    * 创建时间轴模板_标准
    *
    * return {go.Part} 时间轴模板
    */
    TemplateManager.prototype.createTimelineTemplate = function () {
        var template =
            // 时间轴
            $$(go.Part, "Graduated",
                this.styles.partStyle,
                {
                    locationObjectName: "MAIN_LINE",
                    name: "TIME_LINE",
                    //resizeAdornmentTemplate:
                    //    // 调整大小控件
                    //    $$(go.Adornment, "Spot",
                    //        $$(go.Placeholder),
                    //        $$(go.Shape,
                    //            {
                    //                alignment: go.Spot.Right,
                    //                cursor: "e-resize",
                    //                desiredSize: new go.Size(4, 16),
                    //                fill: "lightblue",
                    //                stroke: "deepskyblue"
                    //            }
                    //        )
                    //    ),
                    //resizeObjectName: "MAIN_LINE",
                },
                new go.Binding("graduatedMax", "endDateTime", this.convertGraduatedByDateTime).ofModel(),
                new go.Binding("graduatedMin", "startDateTime", this.convertGraduatedByDateTime).ofModel(),
                new go.Binding("location", "viewPoint", this.convertLocationByViewPoint).ofModel(),
                // 时间线主轴
                $$(go.Shape, "LineH",
                    this.styles.shapeStyle,
                    {
                        name: "MAIN_LINE",
                    },
                    new go.Binding("width", "", this.convertWidthByModelData).makeTwoWay(this.convertModelDataByWidth).ofModel()
                ),
                // 刻度线(分)
                $$(go.Shape,
                    this.styles.shapeStyle2,
                    {
                        geometryString: "M0 0 V5",
                        interval: 60,
                        strokeWidth: 1,
                    },
                    new go.Binding("interval", "intervalWidth", this.convertMShapeIntervalByIntervalWidth).ofModel(),
                    new go.Binding("visible", "intervalWidth", this.convertMShapeVisibleByGraduated).ofModel()
                ),
                // 刻度文字(分)
                $$(go.TextBlock,
                    this.styles.textBlockStyle,
                    {
                        graduatedFunction: this.convertMTextByGraduated,
                        interval: 60,
                        segmentOffset: new go.Point(0, -20),
                    },
                    new go.Binding("interval", "intervalWidth", this.convertMTextIntervalByIntervalWidth).ofModel(),
                    new go.Binding("visible", "intervalWidth", this.convertMTextVisibleByGraduated).ofModel()
                ),
                // 刻度线(时)
                $$(go.Shape,
                    this.styles.shapeStyle2,
                    {
                        geometryString: "M0 0 V15",
                        interval: 3600,
                        strokeWidth: 1.5,
                    },
                    new go.Binding("interval", "intervalWidth", this.convertHShapeIntervalByIntervalWidth).ofModel(),
                    new go.Binding("visible", "intervalWidth", this.convertHShapeVisibleByGraduated).ofModel()
                ),
                // 刻度文字(时)
                $$(go.TextBlock,
                    this.styles.textBlockStyle,
                    {
                        alignmentFocus: go.Spot.TopLeft,
                        graduatedFunction: this.convertHTextByGraduated,
                        interval: 3600,
                        segmentOffset: new go.Point(0, -35),
                    },
                    new go.Binding("interval", "intervalWidth", this.convertHTextIntervalByIntervalWidth).ofModel(),
                    new go.Binding("visible", "intervalWidth", this.convertHTextVisibleByGraduated).ofModel()
                )
            );

        return template;
    };

    /**
    * 创建预定义模板资源
    */
    TemplateManager.prototype.createTemplates = function () {
        this.dateLineTemplate = this.createDatelineTemplate();
        this.timeLineTemplate = this.createTimelineTemplate();

        this.groupTemplate = this.createGroupTemplate();
        this.linkTemplate = this.createLinkTemplate();
        this.linkTemplate.selectionAdornmentTemplate = this.createAdornmentTemplate();
        this.nodeTemplate = this.createNodeTemplate();
    };

    //#endregion 模板管理器

    //#region 自定义链接

    /**
    * 自定义链接的构造函数
    */
    function CustomLink() {
        go.Link.call(this);
    }
    // 自定义链接继承原型链接的所有属性和方法
    go.Diagram.inherit(CustomLink, go.Link);

    /**
    * 链接上起始端口的横坐标 {Number}
    */
    CustomLink.prototype.endPointX = null;

    /**
    * 链接上结束端口的横坐标 {Number}
    */
    CustomLink.prototype.startPointX = null;

    /**
    * 计算结束端口的横坐标
    *
    * @return {Number} 结束端口的横坐标
    */
    CustomLink.prototype.computeEndPointX = function () {
        var data = this.data; // 获取绑定数据
        var timeline = this.diagram.timeline; // 获取视图的时间轴组件
        var dateTime = new Date(data.endDateTime); // 获取结束日期时间
        var seconds = dateTime / 1000; // 获取秒数
        var relativePoint = timeline.graduatedPointForValue(seconds); // 获取相对位置

        this.endPointX = timeline.location.x + relativePoint.x; // 计算结束端口的横坐标

        return this.endPointX;
    };

    /**
    * 计算链接路由上的点集合(重写)
    *
    * @return {Boolean} 是否完成计算
    */
    CustomLink.prototype.computePoints = function () {
        // 过滤自反链接
        if (this.fromNode === this.toNode) return;

        return go.Link.prototype.computePoints.call(this);
    };

    /**
    * 计算起始端口的横坐标
    *
    * @return {Number} 起始端口的横坐标
    */
    CustomLink.prototype.computeStartPointX = function () {
        var data = this.data; // 获取绑定数据
        var timeline = this.diagram.timeline; // 获取视图的时间轴组件
        var dateTime = new Date(data.startDateTime); // 获取起始日期时间
        var seconds = dateTime / 1000; // 获取秒数
        var relativePoint = timeline.graduatedPointForValue(seconds); // 获取相对位置

        this.startPointX = timeline.location.x + relativePoint.x; // 计算起始端口的横坐标

        return this.startPointX;
    };

    /**
    * 获取链接点(重写)
    *
    * @param node {go.Node} 节点
    * @param port {go.GraphObject} 节点的端口对象
    * @param spot {go.Spot} 链接路由要连接的点
    * @param from {Boolean} 是否从连接点出发
    * @param ortho {Boolean} 是否应该有正交段
    * @param othernode {go.Node} 另一个节点
    * @param otherport {go.GraphObject} 另一个节点的端口对象
    * @return {go.Point} 链接点
    */
    CustomLink.prototype.getLinkPoint = function (node, port, spot, from, ortho, othernode, otherport) {
        var point = port.getDocumentPoint(go.Spot.Center); // 获取端口的相对位置
        var newPointX = null; // 端口的横坐标

        if (from) {
            // 端口为起始端口时，使用起始端口的横坐标
            newPointX = this.startPointX ? this.startPointX : this.computeStartPointX();
        }
        else {
            // 端口为结束端口时，使用结束端口的横坐标
            newPointX = this.endPointX ? this.endPointX : this.computeEndPointX();
        }

        var x = newPointX;
        var y = point.y; // 纵坐标保持不变

        return new go.Point(x, y);
    };

    //#endregion 自定义链接

    if (!window.ts) {
        window.ts = {};
    }

    window.ts = {
        Consts: Consts,
        CustomLink: CustomLink,
        TemplateManager: TemplateManager,
        TimeoutTool: TimeoutTool,
        TimeSequenceTool: TimeSequenceTool,
    };
})();