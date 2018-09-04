/*
* VisualizationTool v1.0.0
*/

/// <reference path="go.js" />

(function (window) {
    var $$ = go.GraphObject.make; // 简化定义模板，避免使用$（与jQuery冲突）

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 可视化工具

    /**
    * 可视化工具的构造函数
    * @param divId {String} 可视化视图的div容器的id
    */
    function VisualizationTool(diagramDivId) {
        if (!document.getElementById(diagramDivId)) return;

        // 创建可视化视图
        this.createDiagram(diagramDivId);

        // 创建视图的定时执行工具
        this.createIntervalTools();

        // 为视图中的节点创建双击事件监听器，触发时选中直接关系
        this.addEventListenerForParts("doubleClick",
            function (e, obj) {
                obj.findLinksConnected().each(function (link) {
                    if (!link.visible) return;

                    if (!link.isSelected) link.isSelected = true;

                    var node = link.getOtherNode(obj);
                    if (node && !node.isSelected) {
                        node.isSelected = true;
                    }
                });
            }, null, false);

        // 为视图中的链接创建双击事件监听器，触发时选中两端节点
        this.addEventListenerForParts("doubleClick",
            function (e, obj) {
                obj.fromNode.isSelected = true;
                obj.toNode.isSelected = true;
            }, null, true);
    };

    /**
    * 主视图 {go.Diagram}
    */
    VisualizationTool.prototype.diagram = null;

    /**
    * 全景视图工具 {go.Overview}
    */
    VisualizationTool.prototype.overviewTool = null;

    /**
    * 放大镜工具 {go.Overview}
    */
    VisualizationTool.prototype.magnifierTool = null;

    /**
    * 节点筛选面板 {HTMLElement}
    */
    VisualizationTool.prototype.nodeFilterTool = null;

    /**
    * 链接筛选面板 {HTMLElement}
    */
    VisualizationTool.prototype.linkFilterTool = null;

    /**
    * 属性信息面板 {HTMLElement}
    */
    VisualizationTool.prototype.propertyInfoTool = null;

    /**
    * 实体类型集合 {go.Map}
    */
    VisualizationTool.prototype.entityTypes = new go.Map("string", "object");

    /**
    * 链接类型集合 {go.Map}
    */
    VisualizationTool.prototype.linkTypes = new go.Map("string", "object");

    /**
    * 模板管理器 {TemplateManager}
    */
    VisualizationTool.prototype.templateManager = null;

    /**
    * 工具栏管理器 {ToolbarManager}
    */
    VisualizationTool.prototype.toolbarManager = null;

    /**
    * 新增节点集合 {Array}
    */
    VisualizationTool.prototype.newNodeDataCollection = [];

    /**
    * 新增链接集合 {Array}
    */
    VisualizationTool.prototype.newLinkDataCollection = [];

    /**
    * 视图的新增节点是否初始为选中状态 {Boolean}
    */
    VisualizationTool.prototype.isNewNodeSelected = false;

    /**
    * 视图的新增链接是否初始为选中状态 {Boolean}
    */
    VisualizationTool.prototype.isNewLinkSelected = false;

    /**
    * 是否允许随视图缩放比例的改变而切换节点（链接）模板 {Boolean}
    */
    VisualizationTool.prototype.allowChangeTemplateForScale = true;

    /**
    * 页面元素绑定集合 {Array}
    */
    VisualizationTool.prototype.bindings = [];

    /**
    * 节点监听器集合 {Array}
    */
    VisualizationTool.prototype.nodeListeners = [];

    /**
    * 链接监听器集合 {Array}
    */
    VisualizationTool.prototype.linkListeners = [];

    /**
    * 虚拟化布局更新视图内容的处理延迟时间（毫秒） {Number}
    */
    VisualizationTool.prototype.updateDelay = 200;

    /**
    * 移除视区之外的视图元素的处理延迟时间（毫秒） {Number}
    */
    VisualizationTool.prototype.removeDelay = 3000;

    /**
    * 更新节点或链接的子元素显示状态处理的延迟时间（毫秒） {Number}
    */
    VisualizationTool.prototype.updateVisibilityDelay = 500;

    /**
    * 视图是否完成初始化 {Boolean}
    */
    VisualizationTool.prototype.isInitialized = false;

    /**
    * 进行虚拟化布局的最小节点数据 {Number}
    */
    VisualizationTool.prototype.minNodeCountForVirtualized = 200;

    /**
    * 是否允许初始化布局 {Boolean}
    */
    VisualizationTool.prototype.allowInitializeLayout = true;

    /**
    * 创建可视化视图
    * @param divId {String} 可视化视图的div容器的id
    */
    VisualizationTool.prototype.createDiagram = function (divId) {
        if (!divId || !document.getElementById(divId)) return;

        // 创建视图
        this.diagram = new go.Diagram(divId);

        // 将可视化工具附在视图上
        this.diagram.visualizationTool = this;

        // 配置视图的基本设置
        this.configDiagramSetting(this.diagram);

        // 配置视图的数据模型
        this.configDiagramModel(this.diagram);

        // 添加视图变化监听事件
        this.diagram.addChangedListener(this.listenChanged);

        // 添加数据模型变化监听事件
        //this.diagram.addModelChangedListener(this.listenModelChanged);

        // 添加布局完成监听事件
        this.diagram.addDiagramListener("LayoutCompleted", this.listenLayoutCompleted);

        // 添加视图视区改变监听事件
        this.diagram.addDiagramListener("ViewportBoundsChanged", this.listenViewportBoundsChanged);

        // 添加鼠标左键单击监听事件
        //this.diagram.addDiagramListener("ObjectSingleClick", this.listenObjectSingleClick);

        // 添加鼠标左键双击监听事件
        //this.diagram.addDiagramListener("ObjectDoubleClick", this.listenObjectDoubleClick);

        // 添加鼠标右键单击监听事件
        //this.diagram.addDiagramListener("ObjectContextClick", this.listenObjectContextClick);

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
    };

    /**
    * 创建视图的定时执行工具
    */
    VisualizationTool.prototype.createIntervalTools = function () {
        // 定时更新视图元素数量
        IntervalTool.doInterval(this, this.updatePartsCount, 1000);

        // 定时更新视图元素显示状态
        IntervalTool.doInterval(this, this.updateSubPartsVisibility, 1000);
    };

    /**
    * 为视图加载数据
    *
    * @param modelData {Object} 需要在视图中展示的json数据
    */
    VisualizationTool.prototype.loadData = function (modelData) {
        if (!modelData || !modelData.entityTypes || !modelData.linkTypes || !modelData.entities || !modelData.links) return;

        console.log("loadData:" + Date.now().toString());

        this.isBusy = true;

        var model = this.diagram.currentModel; // 获取当前数据模型

        // 清理视图中元素的选中状态
        this.diagram.clearSelection();

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
        model.addNodeDataCollection(entities);

        // 向视图中添加实体关系信息
        model.addLinkDataCollection(links);

        // 获取新增节点集合
        this.newNodeDataCollection = entities;

        // 获取新增链接集合
        this.newLinkDataCollection = links;

        console.log("layout:" + Date.now().toString());

        // 为虚拟化布局更新视图内容
        //if (visTool.allowVirtualize) {
        //    visTool.updateDiagramParts();
        //}

        // 初始化布局
        if (this.allowInitializeLayout) {
            this.diagram.layoutDiagram(true);
        }

        console.log("other:" + Date.now().toString());

        // 加载节点筛选元素
        if (this.nodeFilterTool) {
            this.nodeFilterTool.loadFilterData(this.entityTypes);
        }

        // 加载链接筛选元素
        if (this.linkFilterTool) {
            this.linkFilterTool.loadFilterData(this.linkTypes);
        }

        this.isBusy = false;

        console.log("end:" + Date.now().toString());
    };

    /**
    * 配置视图的基本设置
    * @param diagram {go.Diagram} 主视图
    */
    VisualizationTool.prototype.configDiagramSetting = function () {
        this.diagram.initialScale = 0.8; // 初始缩放比例为80%
        this.diagram.initialContentAlignment = go.Spot.Center; // 初始内容对齐方式为居中
        this.diagram.contentAlignment = go.Spot.Center; // 内容对齐方式为居中
        this.diagram.allowCopy = false; // 禁止复制功能
        this.diagram.allowDelete = true; // 允许删除功能
        this.diagram.minScale = 0.05; // 视图最小比例为5%
        this.diagram.maxScale = 4; // 视图最大比例为400%
        this.diagram.undoManager.isEnabled = true; // 允许撤销\恢复操作记录
        this.diagram.animationManager.isEnabled = false; // 禁止动画效果
    };

    /**
    * 配置视图模型
    * @return {go.GraphLinksModel} 视图的数据模型
    */
    VisualizationTool.prototype.configDiagramModel = function () {
        var model = new go.GraphLinksModel(); // 创建视图的数据模型
        model.nodeKeyProperty = "id"; // 设置节点的主键标识为“id”
        model.linkKeyProperty = "id"; // 设置链接的主键标识为“id”
        model.linkFromKeyProperty = "fromEntityId"; // 设置链接起始节点的主键标识为“fromEntityId”
        model.linkToKeyProperty = "toEntityId"; // 设置链接到达节点的主键标识为“toEntityId”
        this.diagram.model = model;

        var virtualizedModel = new VirtualizedModel(); // 创建视图的虚拟化数据模型
        virtualizedModel.nodeKeyProperty = "id"; // 设置节点的主键标识为“id”
        virtualizedModel.linkKeyProperty = "id"; // 设置链接的主键标识为“id”
        virtualizedModel.linkFromKeyProperty = "fromEntityId"; // 设置链接起始节点的主键标识为“fromEntityId”
        virtualizedModel.linkToKeyProperty = "toEntityId"; // 设置链接到达节点的主键标识为“toEntityId”
        virtualizedModel.diagramModel = model;
        this.diagram.virtualizedModel = virtualizedModel;
    };

    /**
    * 监听视图变化
    * @param event {go.ChangedEvent} 变化事件
    */
    VisualizationTool.prototype.listenChanged = function (event) {
        if (!event || !event.diagram || !event.change) return;

        // 获取视图
        var diagram = event.diagram;

        // 延时更新视图边界
        TimeoutTool.doDelay(null, function () {
            // 虚拟化布局时，手动计算视图边界
            if (diagram.layout.isVirtualized) {
                diagram.computeFixedBounds();
            }
        }, 1000);

        // 延迟更新视图元素显示状态
        //TimeoutTool.doDelay(this, this.updateSubPartsVisibility, 1000);
    };

    /**
    * 监听数据模型变化
    * @param event {go.ChangedEvent} 变化事件
    */
    VisualizationTool.prototype.listenModelChanged = function (event) {
        if (!event || !event.change) return;

        if (event.change === go.ChangedEvent.Transaction) {
            // 撤销事务或恢复事务时，需要更新节点数和链接数
            if (event.propertyName === "FinishedUndo" || event.propertyName === "FinishedRedo") {
                event.object.changes.each(function (changeEvent) {
                    if (!changeEvent.diagram) return;

                    // 获取可视化工具对象
                    var visTool = changeEvent.diagram.visualizationTool;
                    // 更新节点数和链接数
                    visTool.updatePartInfo(changeEvent);
                });
            }
        }
    };

    /**
    * 监听布局初始化完成
    * @param event {go.DiagramEvent} 视图事件
    */
    VisualizationTool.prototype.listenLayoutCompleted = function (event) {
        if (!event || !event.diagram) return;

        var diagram = event.diagram;
        var visualizationTool = event.diagram.visualizationTool;
        var model = diagram.virtualizedModel;
        var nArray = model.nodeDataArray;

        // 初始化居中的节点数据，默认设置为第一个节点数据
        var centerNodeData = nArray[0];

        // 遍历节点数据集合，如果有关键节点数据，则把第一个关键节点数据设为居中的节点数据
        var length = nArray.length;
        for (var i = 0; i < length; i++) {
            var data = nArray[i];

            if (data.isMain) {
                centerNodeData = data;
                break;
            }
        }

        // 居中节点数据
        if (centerNodeData && centerNodeData.bounds) {
            diagram.centerRect(centerNodeData.bounds);
        }

        // 初始化视图状态
        if (visualizationTool.isInitialized === false) {
            // 视图设为未编辑状态
            diagram.isModified = false;
            // 视图完成初始化
            visualizationTool.isInitialized = true;
        }
    };

    /**
    * 监听视图区域变化
    * @param event {go.DiagramEvent} 视图事件
    */
    VisualizationTool.prototype.listenViewportBoundsChanged = function (event) {
        if (!event || !event.diagram) return;

        var diagram = event.diagram;
        var visTool = diagram.visualizationTool;

        // 为虚拟化布局更新视图内容
        if (visTool.allowVirtualize) {
            // 禁止更新视图元素显示状态
            visTool.allowChangeTemplateForScale = false;

            // 延时更新视图元素
            TimeoutTool.doDelay(visTool, visTool.updateDiagramParts, visTool.updateDelay);
            // 延迟移除视区之外的视图元素
            TimeoutTool.doDelay(visTool, visTool.removePartsOutOfView, visTool.removeDelay);
        }

        // 视图缩放比例发生变化时
        if (visTool.diagramScale !== diagram.scale) {
            // 更新视图缩放比例
            visTool.diagramScale = diagram.scale;
        }
    };

    /**
    * 更新视图元素的相关信息（新增、删除或改变显示状态时）
    * @param e {go.ChangedEvent} 变化事件
    */
    VisualizationTool.prototype.updatePartInfo = function (event) {
        if (!event) return;

        var object = null; // 事件改变的对象

        // 新增元素事件时
        if (event.change === go.ChangedEvent.Insert) {
            object = event.newValue;
        }
            // 删除元素事件时
        else if (event.change === go.ChangedEvent.Remove) {
            object = event.oldValue;
        }
            // 改变元素可见状态事件时
        else if (event.change === go.ChangedEvent.Property && event.propertyName === "visible") {
            object = event.object;
        }
        else {
            return;
        }

        if (object) {
            // 更新视图的节点数
            //this.updateNodesCount();

            // 更新视图的链接数
            //this.updateLinksCount();

            // 更新受到事件牵连的节点的链接数
            if (object instanceof go.Node) {
                // 更新节点的链接数
                object.computeLinksCount();

                // 更新关联节点的链接数
                object.findNodesConnected().each(function (obj) {
                    obj.computeLinksCount();
                });

                // 新增元素时
                if (event.change === go.ChangedEvent.Insert) {
                    // 编辑新增节点
                    //this.editNewNode(object);

                    // 初始化子元素显示状态
                    object.setSubPartsVisibility();
                }
            }
            else if (object instanceof go.Link) {
                // 更新起始节点的链接数
                if (object.fromNode) object.fromNode.computeLinksCount();

                // 更新到达节点的链接数
                if (object.toNode) object.toNode.computeLinksCount();

                // 新增元素时
                if (event.change === go.ChangedEvent.Insert) {
                    // 编辑新增链接
                    //this.editNewLink(object);

                    // 初始化子元素显示状态
                    object.setSubPartsVisibility();
                }
            }
        }
    };

    /**
    * 更新视图的节点数和链接数
    */
    VisualizationTool.prototype.updatePartsCount = function () {
        // 更新节点数量
        this.updateNodesCount();
        // 更新链接数量
        this.updateLinksCount();
    };

    /**
    * 更新节点数量
    */
    VisualizationTool.prototype.updateNodesCount = function () {
        var count = 0;
        this.diagram.nodes.each(function (obj) {
            if (obj.isVisible() && !(obj instanceof go.Group)) {
                count++;

                // 更新节点的链接数
                obj.computeLinksCount && obj.computeLinksCount();
            }
        });

        if (this.nodesCount !== count) {
            this.nodesCount = count;
        }

        return count;
    };

    /**
    * 更新链接数量
    */
    VisualizationTool.prototype.updateLinksCount = function () {
        var count = 0;
        this.diagram.links.each(function (obj) {
            if (obj.isVisible()) {
                count++;
            }
        });

        if (this.linksCount !== count) {
            this.linksCount = count;
        }

        return count;
    };

    /**
    * 为虚拟化布局更新视图内容
    */
    VisualizationTool.prototype.updateDiagramParts = function () {
        var diagram = this.diagram;
        var viewportBounds = diagram.viewportBounds;
        var model = diagram.model;
        var virModel = diagram.virtualizedModel;
        var layout = diagram.layout;
        var dataCount = model.nodeDataArray.length + model.linkDataArray.length;

        //if (diagram.model.nodeDataArray.length === diagram.virtualizedModel.nodeDataArray.length) return;

        //console.log("update_start:" + Date.now().toString());

        var oldskips = diagram.skipsUndoManager;
        diagram.skipsUndoManager = true; // 临时停止操作记录功能，不在操作历史中记录该处理过程

        // 节点数据的数量超过最小值时，动态向视图添加数据，否则直接向视图添加全部数据
        if (layout.isVirtualized && this.minNodeCountForVirtualized <= virModel.nodeDataArray.length) {
            // 向视图中添加链接数据以及和链接相关的节点数据
            var lArray = virModel.linkDataArray;
            var lLength = lArray.length;
            for (var i = 0; i < lLength; i++) {
                if (model.nodeDataArray.length + model.linkDataArray.length - dataCount > 100) break;

                var lData = lArray[i];

                // 获取起始节点数据
                var from = virModel.findNodeDataForKey(lData.fromEntityId);
                if (from === null || !from.bounds) continue;

                // 获取到达节点数据
                var to = virModel.findNodeDataForKey(lData.toEntityId);
                if (to === null || !to.bounds) continue;

                // 获取链接所处关系的边界
                var bounds = new go.Rect();
                bounds.set(from.bounds);
                bounds.unionRect(to.bounds);

                // 链接所处关系的边界与视区边界相交中，将关系中的链接和节点都加进视图的数据模型中
                if (bounds.intersectsRect(viewportBounds)) {
                    model.addNodeData(from);
                    model.addNodeData(to);
                    model.addLinkData(lData);

                    // 更新链接所在关系中的链接路由和节点边界，确保视图没有偏差
                    var link = diagram.findLinkForData(lData);
                    if (link) {
                        this.editNewLink(link);
                        if (link.isVisible()) link.updateRoute();

                        if (link.fromNode) {
                            this.editNewNode(link.fromNode);
                            link.fromNode.ensureBounds();
                        }

                        if (link.toNode) {
                            this.editNewNode(link.toNode);
                            link.toNode.ensureBounds();
                        }
                    }
                }
            }

            // 向视图中添加节点数据
            var nArray = virModel.nodeDataArray;
            var nLength = nArray.length;
            for (var i = 0; i < nLength; i++) {
                if (model.nodeDataArray.length + model.linkDataArray.length - dataCount > 100) break;

                var nData = nArray[i];
                if (!nData.bounds) continue;

                // 节点边界与视图的视区边界相交时，将节点数据添加进视图的数据模型中
                if (nData.bounds.intersectsRect(viewportBounds)) {
                    // 添加节点数据
                    model.addNodeData(nData);

                    // 编辑新增节点
                    var node = diagram.findNodeForData(nData);
                    if (node) this.editNewNode(node);
                }
            }

            if (model.nodeDataArray.length + model.linkDataArray.length - dataCount > 100) {
                // 延迟移除视区之外的视图元素
                //TimeoutTool.doDelay(this, this.removePartsOutOfView, this.removeDelay);
                // 延时更新视图元素
                TimeoutTool.doDelay(this, this.updateDiagramParts, 200);
            } else {
                // 延迟移除视区之外的视图元素
                //TimeoutTool.doDelay(this, this.removePartsOutOfView, this.removeDelay);

                // 允许更新视图元素显示状态
                this.allowChangeTemplateForScale = true;
                // 更新视图元素显示状态
                this.updateSubPartsVisibility();
            }
        }
        else {
            // 向视图中添加所有节点数据（自带重复过滤）
            var nArray = virModel.nodeDataArray;
            var nLength = nArray.length;
            for (var i = 0; i < nLength; i++) {
                var nData = nArray[i];
                if (!nData.bounds) continue;

                model.addNodeData(nData);

                var node = diagram.findNodeForData(nData);
                if (node) {
                    this.editNewNode(node);
                }
            }

            // 向视图中添加所有链接数据（自带重复过滤）
            var lArray = virModel.linkDataArray;
            var lLength = lArray.length;
            for (var i = 0; i < lLength; i++) {
                var lData = lArray[i];

                // 获取起始节点数据
                var from = virModel.findNodeDataForKey(lData.fromEntityId);
                if (from === null || !from.bounds) continue;

                // 获取到达节点数据
                var to = virModel.findNodeDataForKey(lData.toEntityId);
                if (to === null || !to.bounds) continue;

                model.addNodeData(from);
                model.addNodeData(to);
                model.addLinkData(lData);

                // 更新链接所在关系中的链接路由和节点边界，确保视图没有偏差
                var link = diagram.findLinkForData(lData);
                if (link !== null) {
                    this.editNewLink(link);
                    if (link.isVisible()) link.updateRoute();

                    if (link.fromNode) {
                        this.editNewNode(link.fromNode);
                        link.fromNode.ensureBounds();
                    }

                    if (link.toNode) {
                        this.editNewNode(link.toNode);
                        link.toNode.ensureBounds();
                    }
                }
            }

            // 允许更新视图元素显示状态
            this.allowChangeTemplateForScale = true;
            // 更新视图元素显示状态
            this.updateSubPartsVisibility();
        }

        diagram.skipsUndoManager = oldskips; // 恢复操作记录功能

        //console.log("update_node:" + model.nodeDataArray.length);
        //console.log("update_link:" + model.linkDataArray.length);
        //console.log("update_end:" + Date.now().toString());
    };

    /**
    * 移除视区外的视图元素
    */
    VisualizationTool.prototype.removePartsOutOfView = function () {
        var diagram = this.diagram;
        var viewportBounds = diagram.viewportBounds;
        var model = diagram.model;
        var removeNodes = [];  // 要移除的节点数据集合
        var removeLinks = [];  // 要移除的链接数据集合

        var iterator = diagram.nodes;
        while (iterator.next()) {
            if (removeNodes.length + removeLinks.length > 250) break;

            var node = iterator.value;
            var nodeData = node.data;

            // 该节点未被高亮、且非主节点、且不在视区范围内时
            if (!node.isSelected && !node.isHighlighted && !nodeData.isMain
                && !node.actualBounds.intersectsRect(viewportBounds)) {
                // 检查该节点是否存在被选中、被高亮或与视区相交的链接
                var hasLinkIntersectView = node.linksConnected.any(function (link) {
                    if (link.isSelected || link.isHighlighted || link.actualBounds.intersectsRect(viewportBounds)) {
                        return true;
                    } else {
                        return false;
                    }
                })

                // 不存在与视区相交的链接时，添加移除数据
                if (!hasLinkIntersectView) {
                    // 向移除节点数据集合添加节点数据
                    removeNodes.push(nodeData);

                    // 向移除链接数据集合添加节点的关联链接数据
                    node.linksConnected.each(function (obj) {
                        removeLinks.push(obj.data);
                    });
                }
            }
        }

        if (removeNodes.length > 0) {
            var oldskips = diagram.skipsUndoManager;
            diagram.skipsUndoManager = true; // 临时停止操作记录功能，不在操作历史中记录该处理过程

            // 移除节点数据集合
            model.removeNodeDataCollection(removeNodes);
            // 移除链接数据集合
            model.removeLinkDataCollection(removeLinks);

            // 设置节点状态为虚拟状态
            removeNodes.forEach(function (data) {
                data.isVirtual = true;
            });
            // 设置链接状态为非虚拟状态
            removeNodes.forEach(function (data) {
                data.isVirtual = true;
            });


            diagram.skipsUndoManager = oldskips; // 恢复操作记录功能
        }

        if (removeNodes.length + removeLinks.length > 250) {
            // 延时更新视图元素
            //TimeoutTool.doDelay(this, this.updateDiagramParts, this.updateDelay);
            // 延迟移除视区之外的视图元素
            TimeoutTool.doDelay(this, this.removePartsOutOfView, 500);
        } else {
            // 延时更新视图元素
            //TimeoutTool.doDelay(this, this.updateDiagramParts, this.updateDelay);
        }
    };

    /**
    * 更新节点或链接的子元素显示状态
    */
    VisualizationTool.prototype.updateSubPartsVisibility = function () {
        if (!this.allowChangeTemplateForScale) return;

        var diagram = this.diagram;

        var oldskips = diagram.skipsUndoManager;
        diagram.skipsUndoManager = true; // 临时停止操作记录功能，不记录模板改变

        // 设置节点的子元素显示状态
        diagram.nodes.each(function (obj) {
            if (obj instanceof go.Group) return;

            obj.setSubPartsVisibility();
        });

        // 设置链接的子元素显示状态
        diagram.links.each(function (obj) {
            obj.setSubPartsVisibility();
        });

        diagram.skipsUndoManager = oldskips; // 恢复操作记录功能
    };

    /**
    * 将类型集合添加进对应的类型Map中
    * @param array {Array} 要添加的数据集合
    * @param map {go.Map} 数据集合对应的Map
    * @param isEntityType {Boolean} 数据是否为实体类型
    */
    VisualizationTool.prototype.addTypeArrayToTypeMap = function (array, map, isEntityType) {
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
    * 编辑实体类型信息
    * @param dataType {Object} 数据类型
    */
    VisualizationTool.prototype.editEntityType = function (dataType) {
        if (!dataType) return;
    };

    /**
    * 编辑链接类型信息
    * @param dataType {Object} 数据类型
    */
    VisualizationTool.prototype.editLinkType = function (dataType) {
        if (!dataType) return;

        // 设置颜色
        dataType.color = go.Brush.randomColor(64, 192);
        // 设置线的宽度
        dataType.strokeWidth = 2.5;
    };

    /**
    * 过滤实体数据
    * 若数据已在视图模型中存在，则将其过滤掉。
    * @param array {Array} 需要过滤的实体数据集合
    * @param model {go.GraphLinksModel} 视图模型
    * @return {Array} 过滤后的实体数据集合
    */
    VisualizationTool.prototype.filterEntities = function (array, model) {
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
    * 过滤链接数据
    * 若数据已在视图模型中存在，则将其过滤掉。
    * @param array {Array} 需要过滤的链接数据集合
    * @param model {go.GraphLinksModel} 视图模型
    * @return {Array} 过滤后的链接数据集合
    */
    VisualizationTool.prototype.filterLinks = function (array, model) {
        if (!array || !model) {
            return;
        }

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
    * 根据数据类型扩展数据信息
    * @param dataTypes {go.Map} 数据类型集合
    * @param datas {Array} 数据集合
    * @param isEntityData {Boolean} true：实体数据，false：链接数据
    */
    VisualizationTool.prototype.extendDataByDataType = function (dataTypes, datas, isEntityData) {
        if (!dataTypes || !datas) {
            return;
        }

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
    * 编辑实体数据的主要属性
    * @param dataType {Object} 数据类型
    * @param data {Object} 数据
    */
    VisualizationTool.prototype.editMainEntityProperty = function (dataType, data) {
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
        // 初始化节点的图形边界值(参考值：（0, 0, 225, 145）)
        data.bounds = data.bounds ?
            new go.Rect(data.bounds.J, data.bounds.K, data.bounds.Ea, data.bounds.Fa) : new go.Rect(0, 0, 230, 150);
        // 初始化是否为虚拟状态标识（是否在视图中）
        data.isVirtual = true;
    };

    /**
    * 编辑链接数据的主要属性
    * @param dataType {Object} 数据类型
    * @param data {Object} 数据
    */
    VisualizationTool.prototype.editMainLinkProperty = function (dataType, data) {
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
        // 初始化是否为虚拟状态标识（是否在视图中）
        data.isVirtual = true;
    };

    /**
    * 组合属性信息
    * 将属性与属性值进行匹配，匹配时将属性信息合并至属性值中。
    * @param properties {Array} 属性集合
    * @param propertyValues {Array} 属性值集合
    */
    VisualizationTool.prototype.combinePropertyInfo = function (properties, propertyValues) {
        if (!properties || !propertyValues) return;

        var proLength = properties.length;
        var proValLength = propertyValues.length;

        for (var i = 0; i < proValLength; i++) {
            var propertyValue = propertyValues[i];

            for (var j = 0; j < proLength; j++) {
                var property = properties[j];

                // 数据id匹配时，组合属性信息
                if (propertyValue.id === property.id) {
                    // 使用jQuery.extend()方法组合属性信息
                    jQuery.extend(propertyValue, property);
                    break;
                }
            }
        }
    };

    /**
    * 通过数据集合找节点集合
    * @param array {Array} 节点数据集合
    * @return {go.Set} 节点集合
    */
    VisualizationTool.prototype.findNodesForDataArray = function (array) {
        if (!array) return;

        var nodes = new go.Set(go.Node);
        var length = array.length;

        for (var i = 0; i < length; i++) {
            var data = array[i];
            // 通过数据找节点
            var obj = this.diagram.findNodeForData(data);
            // 将节点添加至集合中
            if (obj) {
                nodes.add(obj);
            }
        }

        return nodes;
    };

    /**
    * 通过数据集合找链接集合
    * @param array {Array} 链接数据集合
    * @return {go.Set} 链接集合
    */
    VisualizationTool.prototype.findLinksForDataArray = function (array) {
        if (!array) return;

        var links = new go.Set(go.Link);
        var length = array.length;

        for (var i = 0; i < length; i++) {
            var data = array[i];
            // 通过数据找链接
            var obj = this.diagram.findLinkForData(data);
            // 将链接添加至集合中
            if (obj) {
                links.add(obj);
            }
        }

        return links;
    };

    /**
    * 编辑新增节点
    * @param node {go.Node} 新增节点
    */
    VisualizationTool.prototype.editNewNode = function (node) {
        if (!node || !node.data.isVirtual || !node instanceof go.Node || node instanceof go.Group) return;

        // 设置节点状态为非虚拟状态
        this.diagram.currentModel.setDataProperty(node.data, "isVirtual", false);

        // 属性信息面板存在时, 添加查看属性功能
        if (this.propertyInfoTool) {
            if (!node.contextMenu) {
                node.contextMenu = this.templateManager.createContextMenu();

                // 创建设为关键节点按钮
                var contextMenuButton = this.templateManager.createContextMenuButton("查看属性", function (e, obj) {
                    if (!obj.diagram.visualizationTool || !obj.diagram.visualizationTool.propertyInfoTool) return;

                    // 获取属性信息工具
                    var propertyInfoTool = obj.diagram.visualizationTool.propertyInfoTool;
                    // 加载属性信息
                    propertyInfoTool.loadPropertyInfo(obj.part.data);
                });

                // 为右键菜单添加按钮
                node.contextMenu.add(contextMenuButton);
            }
        }

        // 遍历节点监听器集合，为新节点添加监听器
        this.nodeListeners.forEach(function (listener) {
            node.addEventListener(listener.eventType, listener.func, listener.caller);
        });
    };

    /**
    * 编辑新增链接
    * @param template {go.Link} 新增链接
    */
    VisualizationTool.prototype.editNewLink = function (link) {
        if (!link || !link.data.isVirtual || !link instanceof go.Link) return;

        // 设置链接状态为非虚拟状态
        this.diagram.currentModel.setDataProperty(link.data, "isVirtual", false);

        // 属性信息面板存在时, 添加查看属性功能
        if (this.propertyInfoTool) {
            if (!link.contextMenu) {
                link.contextMenu = this.templateManager.createContextMenu();

                // 创建设为关键节点按钮
                var contextMenuButton = this.templateManager.createContextMenuButton("查看属性", function (e, obj) {
                    if (!obj.diagram.visualizationTool || !obj.diagram.visualizationTool.propertyInfoTool) return;

                    // 获取属性信息工具
                    var propertyInfoTool = obj.diagram.visualizationTool.propertyInfoTool;
                    // 加载属性信息
                    propertyInfoTool.loadPropertyInfo(obj.part.data);
                });

                // 为右键菜单添加按钮
                link.contextMenu.add(contextMenuButton);
            }
        }

        // 遍历链接监听器集合，为新链接添加监听器
        this.linkListeners.forEach(function (listener) {
            link.addEventListener(listener.eventType, listener.func, listener.caller);
        });
    };

    /**
    * 保存视图数据至json对象中
    *
    * @return {Object} 数据数据
    */
    VisualizationTool.prototype.saveDataToJson = function () {
        var entityTypes = []; // 节点数据类型集合
        var linkTypes = []; // 链接数据类型集合
        var entities = this.diagram.currentModel.nodeDataArray; // 节点集合
        var links = this.diagram.currentModel.linkDataArray; // 链接集合
        var resultData = {}; // 返回的数据集
        var jsonData = null; // 转化后的json数据

        // 获取节点数据类型集合
        this.entityTypes.each(function (obj) {
            entityTypes.push(obj.value);
        });

        // 获取链接数据类型集合
        this.linkTypes.each(function (obj) {
            linkTypes.push(obj.value);
        })

        // 设置返回数据集的属性
        resultData = {
            entityTypes: entityTypes, // 节点数据类型集合
            linkTypes: linkTypes, // 链接数据类型集合
            entities: entities, // 节点集合
            links: links // 链接集合
        };

        // 转化为json数据
        jsonData = JSON.stringify(resultData);

        return jsonData;
    };

    /**
    * 属性绑定页面元素
    * @param targetPro {String} 要进行绑定的可视化工具中的属性
    * @param elementId {String} 页面元素id
    * @param elementPro {String} 页面元素属性
    * @param converter {Function} 数据转换函数
    */
    VisualizationTool.prototype.bindHtmlElement = function (targetPro, elementId, elementPro, converter) {
        if (!targetPro || !elementId || !elementPro || !VisualizationTool.prototype.hasOwnProperty(targetPro)) return;

        // 创建绑定对象
        var binding = {
            targetPro: targetPro,
            elementId: elementId,
            elementPro: elementPro,
            converter: converter,
        };

        // 判定绑定是否合法
        var isBindingValid = this.isBindingValid(binding);
        if (!isBindingValid) return;

        // 将绑定对象添加至集合中
        this.bindings.push(binding);
    };

    /**
    * 判定绑定是否合法
    * @param binding {Object} 需要判定的绑定对象
    * @return {Boolean} true：合法；false：非法
    */
    VisualizationTool.prototype.isBindingValid = function (binding) {
        if (!binding) return false;

        // 页面元素不存在时，非法
        var elementId = binding.elementId;
        var element = document.getElementById(elementId);
        if (!element) return false;

        // 页面元素属性不存在时，非法
        if (!binding.elementPro in element) return false;

        // 可视化工具属性不存在时，非法
        if (!binding.targetPro in this) return false;

        // 页面元素已经存在于其他绑定对象中时，非法
        var length = this.bindings.length;
        for (var i = 0; i < length; i++) {
            if (elementId === this.bindings[i].elementId) return false;
        }

        return true;
    };

    /**
    * 更新目标属性绑定的页面元素的属性
    * @param targetPro {Object} 目标属性
    */
    VisualizationTool.prototype.updateElementProperty = function (targetPro) {
        if (!targetPro || !VisualizationTool.prototype.hasOwnProperty(targetPro)) return;

        var length = this.bindings.length;
        for (var i = 0; i < length; i++) {
            var binding = this.bindings[i];

            // 更新目标属性绑定的对应页面元素的属性
            if (binding.targetPro === targetPro) {
                var element = document.getElementById(binding.elementId);
                var property = binding.elementPro;
                var converter = binding.converter;
                var value = this[targetPro];

                // 存在转换函数时，执行转换函数后赋值，否则直接赋值
                if (converter) {
                    element[property] = converter(value);
                }
                else {
                    element[property] = value;
                }
            }
        }
    };

    /**
    * 为视图元素添加事件监听器
    * @param eventType {String} 监听事件类型
    * @param func {Function|String} 事件触发时要执行的处理，caller不存在时此参数为具体函数，caller存在时此参数为caller的某函数名称
    * @param caller {Object} 处理呼出元
    * @param isLinkListener {Boolean} 是否为链接监听器 true：链接监听器；false：节点监听器
    */
    VisualizationTool.prototype.addEventListenerForParts = function (eventType, func, caller, isLinkListener) {
        if (!eventType || !func) return;

        //初始化处理
        if (!caller) caller = null;
        if (!isLinkListener) isLinkListener = false;

        // 创建一个新的监听器对象
        var listener = {
            eventType: eventType,
            func: func,
            caller: caller
        };

        // 判断是否为链接监听器
        if (isLinkListener) {
            // 向链接监听器集合中添加监听器
            this.linkListeners.push(listener);

            // 遍历已有链接，为每个链接添加新的监听器
            this.diagram.links.each(function (obj) {
                obj.addEventListener(listener.eventType, listener.func, listener.caller);
            });
        }
        else {
            // 向节点监听器集合中添加监听器
            this.nodeListeners.push(listener);

            // 遍历已有节点，为每个节点添加新的监听器
            this.diagram.nodes.each(function (obj) {
                obj.addEventListener(listener.eventType, listener.func, listener.caller);
            });
        }
    };

    /**
    * 添加节点模板
    * @param template {go.Node} 节点模板
    */
    VisualizationTool.prototype.addNodeTemplate = function (template) {
        if (!template) return;

        // 将节点模板添加进视图中
        this.diagram.nodeTemplateMap.add(template.name, template);

        // 编辑新增节点模板
        this.editNewNodeTemplate(template);
    };

    /**
    * 添加链接模板
    * @param template {go.Link} 链接模板
    */
    VisualizationTool.prototype.addLinkTemplate = function (template) {
        if (!template) return;

        // 将链接模板添加进视图中
        this.diagram.linkTemplateMap.add(template.name, template);

        // 编辑新增链接模板
        this.editNewLinkTemplate(template);
    };

    /**
    * 清空视图信息
    */
    VisualizationTool.prototype.clearDiagram = function () {
        this.diagram.clear();
        this.diagram.virtualizedModel.clear();
        this.entityTypes.clear();
        this.linkTypes.clear();
    };

    /**
    * 监听繁忙状态改变
    *
    * @param isBusy {Boolean} 繁忙状态
    */
    VisualizationTool.prototype.listenIsBusyChanged = function (isBusy) {

    };

    /**
    * 获取或设置节点数
    * @param value {Number} 节点数
    * @return {Number} 节点数
    */
    Object.defineProperty(VisualizationTool.prototype, "nodesCount", {
        get: function () {
            return this._nodesCount;
        },
        set: function (value) {
            if (this._nodesCount !== value) {
                this._nodesCount = value;

                // 更新目标属性绑定的页面元素的属性
                this.updateElementProperty("nodesCount");
            }
        }
    });

    /**
    * 获取或设置链接数
    * @param value {Number} 链接数
    * @return {Number} 链接数
    */
    Object.defineProperty(VisualizationTool.prototype, "linksCount", {
        get: function () {
            return this._linksCount;
        },
        set: function (value) {
            if (this._linksCount !== value) {
                this._linksCount = value;

                // 更新目标属性绑定的页面元素的属性
                this.updateElementProperty("linksCount");
            }
        }
    });

    /**
    * 获取或设置视图缩放比例
    * @param value {Number} 视图缩放比例
    * @return {Number} 视图缩放比例
    */
    Object.defineProperty(VisualizationTool.prototype, "diagramScale", {
        get: function () {
            return this._diagramScale;
        },
        set: function (value) {
            if (this._diagramScale !== value) {
                this._diagramScale = value;

                // 更新目标属性绑定的页面元素的属性
                this.updateElementProperty("diagramScale");
            }
        }
    });

    /**
    * 获取或设置是否允许进行虚拟化布局
    * @param value {Boolean} 允许虚拟化标识
    * @return {Boolean} 允许虚拟化标识
    */
    Object.defineProperty(VisualizationTool.prototype, "allowVirtualize", {
        get: function () {
            return this._allowVirtualize === true ? true : false;
        },
        set: function (value) {
            if (this._allowVirtualize !== value) {
                this._allowVirtualize = value;
            }
        }
    });

    /**
    * 获取或设置是否处于繁忙状态
    *
    * @param value {Boolean} 繁忙状态标识
    * @return {Boolean} 繁忙状态标识
    */
    Object.defineProperty(VisualizationTool.prototype, "isBusy", {
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

    //#endregion 可视化工具

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 延时执行工具

    /**
    * 延时执行工具的构造函数
    */
    function TimeoutTool() {

    }

    /**
    * 延时执行函数
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

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 定时执行工具

    /**
    * 定时执行工具的构造函数
    */
    function IntervalTool() {

    }

    /**
    * 定时执行函数
    * @param caller {Object} 处理呼出元
    * @param func {String} 要定时执行的函数
    * @param interval {Number} 间隔时间
    */
    IntervalTool.doInterval = function (caller, func, interval) {
        if (!func) return;

        // 记录计时器id，定时执行函数
        func.timerId = setInterval(function () {
            func.call(caller);
        }, interval);
    };

    //#endregion 定时执行工具

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 节点筛选工具

    /**
    * 节点筛选工具的构造函数
    * @param containerId {String} 节点筛选工具的div容器的id
    * @param diagram {go.Diagram} 要进行筛选的视图对象
    */
    function NodeFilterTool(containerId, diagram) {
        if (!containerId || !document.getElementById(containerId) || !diagram) return;

        // 获取节点筛选工具的容器
        this.container = document.getElementById(containerId);

        // 获取要筛选的视图对象
        this.diagram = diagram;
    };

    /**
    * 节点筛选工具的容器 {HTMLElement}
    */
    NodeFilterTool.prototype.container = null;

    /**
    * 要进行筛选的视图对象 {go.Diagram}
    */
    NodeFilterTool.prototype.diagram = null;

    /**
    * 加载筛选数据
    * @param entityTypes {go.Map} 节点类型集合
    */
    NodeFilterTool.prototype.loadFilterData = function (entityTypes) {
        if (!this.container || !entityTypes) return;

        // 获取筛选方法
        var filterFunction = this.filterEntitiesByType;
        // 获取主视图
        var diagram = this.diagram;

        // 清空节点筛选面板
        this.container.innerHTML = null;

        var iterator = entityTypes.iterator;
        while (iterator.next()) {
            // 创建筛选元素
            var filterItem = this.createFilterItem(iterator.value, filterFunction, diagram);
            // 向面板中添加筛选元素
            this.container.appendChild(filterItem);
        }
    };

    /**
    * 创建节点筛选元素
    * @param entityType {Object} 节点类型
    * @param filterFunction {Function} 筛选方法
    */
    NodeFilterTool.prototype.createFilterItem = function (entityType, filterFunction) {
        if (!entityType || !filterFunction || !this.diagram) return;

        var model = this.diagram.currentModel;
        var item = document.createElement("a");
        item.classList.add("selected");
        item.selected = true;
        item.typeId = entityType.id;

        var img = document.createElement("img");
        img.src = entityType.iconName;
        item.appendChild(img);

        // 添加点击事件
        $(item).click(function () {
            // 切换选中样式
            $(this).toggleClass('selected');
            // 切换选中状态
            this.selected = !this.selected;
            // 筛选数据
            filterFunction(model, this.typeId, this.selected);
        });

        return item;
    };

    /**
    * 筛选指定类型的节点
    * @param model {go.GraphLinksModel} 数据模型
    * @param entityTypeId {String} 节点类型ID
    * @param isVisible {Boolean} 是否显示
    */
    NodeFilterTool.prototype.filterEntitiesByType = function (model, entityTypeId, isVisible) {
        if (!model || !entityTypeId) return;

        model.eachNode(function (data) {
            if (entityTypeId === data.typeId) {
                // 改变节点的显示状态
                model.setDataProperty(data, "isVisible", isVisible);
            }
        });
    };

    //#endregion 节点筛选工具

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 链接筛选工具

    /**
    * 链接筛选工具的构造函数
    * @param containerId {String} 链接筛选工具的div容器的id
    * @param diagram {go.Diagram} 要进行筛选的视图对象
    */
    function LinkFilterTool(containerId, diagram) {
        if (!containerId || !document.getElementById(containerId) || !diagram) return;

        // 获取链接筛选工具的容器
        this.container = document.getElementById(containerId);

        // 获取要筛选的视图对象
        this.diagram = diagram;
    };

    /**
    * 链接筛选工具的容器 {HTMLElement}
    */
    LinkFilterTool.prototype.container = null;

    /**
    * 要进行筛选的视图对象 {go.Diagram}
    */
    LinkFilterTool.prototype.diagram = null;

    /**
    * 加载筛选数据
    * @param linkTypes {go.Map} 链接类型集合
    */
    LinkFilterTool.prototype.loadFilterData = function (linkTypes) {
        if (!this.container || !linkTypes) return;

        // 获取筛选方法
        var filterFunction = this.filterLinksByType;
        // 获取主视图
        var diagram = this.diagram;

        // 清空节点筛选面板
        this.container.innerHTML = null;

        var iterator = linkTypes.iterator;
        while (iterator.next()) {
            // 创建筛选元素
            var filterItem = this.createFilterItem(iterator.value, filterFunction, diagram);
            // 向面板中添加筛选元素
            this.container.appendChild(filterItem);
        }
    };

    /**
    * 创建链接筛选元素
    * @param linkType {Object} 链接类型
    * @param filterFunction {Function} 筛选方法
    */
    LinkFilterTool.prototype.createFilterItem = function (linkType, filterFunction) {
        if (!linkType || !filterFunction || !this.diagram) return;

        var model = this.diagram.currentModel;
        var item = document.createElement("a");
        item.classList.add("selected");
        item.selected = true;
        item.typeId = linkType.id;
        item.style.color = linkType.color;
        item.innerHTML = linkType.name;

        // 添加点击事件
        $(item).click(function () {
            // 切换选中样式
            $(this).toggleClass('selected');
            // 切换选中状态
            this.selected = !this.selected;
            // 筛选数据
            filterFunction(model, this.typeId, this.selected);
        });

        return item;
    };

    /**
    * 筛选指定类型的链接
    * @param model {go.GraphLinksModel} 数据模型
    * @param linkTypeId {String} 节点类型ID
    * @param isVisible {Boolean} 是否显示
    */
    LinkFilterTool.prototype.filterLinksByType = function (model, linkTypeId, isVisible) {
        if (!model || !linkTypeId) return;

        model.eachLink(function (data) {
            if (linkTypeId === data.typeId) {
                // 改变链接的显示状态
                model.setDataProperty(data, "isVisible", isVisible);
            }
        });
    };

    //#endregion 链接筛选工具

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 属性信息工具

    /**
    * 属性信息工具的构造函数
    * @param containerId {String} 属性信息工具的div容器的id
    */
    function PropertyInfoTool(containerId) {
        if (!containerId || !document.getElementById(containerId)) return;

        // 获取属性信息工具的容器
        this.container = document.getElementById(containerId);
    };

    /**
    * 属性信息工具的容器 {HTMLElement}
    */
    PropertyInfoTool.prototype.container = null;

    /**
    * 加载属性信息
    * @param partData {Object} 元素数据
    */
    PropertyInfoTool.prototype.loadPropertyInfo = function (partData) {
        if (!this.container || !partData) return;

        // 获取属性信息集合
        var propertyValues = partData.propertyValues;
        // 获取集合长度
        var length = propertyValues.length;

        // 清空属性信息面板
        this.container.innerHTML = null;

        for (var i = 0; i < length; i++) {
            // 创建属性信息元素
            var propertyItem = this.createPropertyItem(propertyValues[i]);
            // 向面板中添加属性信息元素
            this.container.appendChild(propertyItem);
        }
    };

    /**
    * 创建属性信息元素
    * @param propertyValue {Object} 属性信息
    */
    PropertyInfoTool.prototype.createPropertyItem = function (propertyValue) {
        if (!propertyValue) return;

        var item = document.createElement("span");

        var textName = document.createElement("input");
        textName.type = "text";
        textName.value = propertyValue.name;
        textName.disabled = true;
        textName.style.width = "40%";
        item.appendChild(textName);

        var textValue = document.createElement("input");
        textValue.type = "text";
        textValue.value = propertyValue.value;
        textValue.disabled = true;
        textValue.style.width = "60%";
        item.appendChild(textValue);

        return item;
    };

    //#endregion 属性信息工具

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 全景视图工具

    /**
    * 全景视图工具的构造函数
    * @param containerId {String} 全景视图的div容器的id
    * @param diagram {go.Diagram} （可选参数）要监视的视图对象
    */
    function OverviewTool(containerId, diagram) {
        if (!containerId || !document.getElementById(containerId)) return;

        // 获取全景视图的容器
        this.container = document.getElementById(containerId);

        // 创建全景视图
        this.overview = this.createOverview(containerId);

        // 获取监视对象
        this.diagram = diagram ? diagram : null;

        // 初始状态为不显示
        this.visible = false;
    }

    /**
    * 全景视图的容器 {HTMLElement}
    */
    OverviewTool.prototype.container = null;

    /**
    * 全景视图 {go.Overview}
    */
    OverviewTool.prototype.overview = null;

    /**
    * 创建全景视图
    * @param containerId {String} 全景视图的div容器的id
    * @return {go.Overview} 全景视图
    */
    OverviewTool.prototype.createOverview = function (containerId) {
        if (!containerId || !document.getElementById(containerId)) return;

        // 创建全景视图
        var overview = $$(go.Overview, containerId, {
            contentAlignment: go.Spot.Center
        });

        return overview;
    };

    /**
    * 更新或设置显示状态
    * @param value {Boolean} 显示状态
    * @return {Boolean} 显示状态
    */
    Object.defineProperty(OverviewTool.prototype, "visible", {
        enumerable: true,
        get: function () {
            return this._visible;
        },
        set: function (value) {
            if (this._visible !== value) {
                this._visible = value;

                if (this.container) {
                    // 切换容器显示状态
                    this.container.style.display = this._visible ? "inline" : "none";
                }
            }
        }
    });

    /**
    * 更新或设置要监视的视图对象
    * @param value {go.Diagram} 视图对象
    * @return {go.Diagram} 视图对象
    */
    Object.defineProperty(OverviewTool.prototype, "diagram", {
        enumerable: true,
        get: function () {
            return this._diagram;
        },
        set: function (value) {
            if (this._diagram !== value) {
                this._diagram = value;

                if (this.overview) {
                    // 设置监视对象
                    this.overview.observed = this._diagram;
                }
            }
        }
    });

    //#endregion 全景视图工具

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 放大镜工具

    /**
    * 放大镜工具的构造函数
    * @param containerId {String} 放大镜的div容器的id
    * @param diagram {go.Diagram} （可选参数）要监视的视图对象
    */
    function MagnifierTool(containerId, diagram) {
        if (!containerId || !document.getElementById(containerId)) return;

        // 获取放大镜的容器
        this.container = document.getElementById(containerId);

        // 创建放大镜
        this.magnifier = this.createMagnifier(containerId);

        // 获取监视对象
        this.diagram = diagram ? diagram : null;

        // 初始状态为不显示
        this.visible = false;
    }

    /**
    * 放大镜的容器 {HTMLElement}
    */
    MagnifierTool.prototype.container = null;

    /**
    * 放大镜 {go.Overview}
    */
    MagnifierTool.prototype.magnifier = null;

    /**
    * 是否激活 {Boolean}
    */
    MagnifierTool.prototype.isActive = false;

    /**
    * 放大镜的容器相对于鼠标的偏移量 {Number}
    */
    MagnifierTool.prototype.containerOffset = 15;

    /**
    * 更新节点或链接的子元素显示状态处理的延迟时间（毫秒） {Number}
    */
    MagnifierTool.prototype.updateVisibilityDelay = 200;

    /**
    * 创建放大镜
    * @param containerId {String} 放大镜的div容器的id
    * @return {go.Overview} 放大镜
    */
    MagnifierTool.prototype.createMagnifier = function (containerId) {
        if (!containerId || !document.getElementById(containerId)) return;

        // 创建放大镜
        var magnifier = $$(go.Overview, containerId, {
            initialScale: 0.8,
            autoScale: go.Diagram.None,
            hasHorizontalScrollbar: false,
            hasVerticalScrollbar: false
        });

        // 将放大镜与放大镜工具关联
        magnifier.magnifierTool = this;

        // 鼠标移动事件
        magnifier.doMouseMove = function () {
            if (!this.magnifierTool) return;

            // 鼠标进入放大镜的范围时，放大镜工具设置为不可见，避免卡顿现象，
            this.magnifierTool.visible = false;
        };

        // 使所有鼠标按下功能非活性化
        magnifier.toolManager.mouseDownTools.each(function (tool) {
            tool.isEnabled = false;
        });

        return magnifier;
    };

    /**
    * 监听视图的鼠标移动事件
    * @param diagram {go.Diagram} 可视化视图
    */
    MagnifierTool.prototype.listenDiagramMouseMove = function (diagram) {
        if (!diagram) return;

        var visualizationTool = diagram.visualizationTool;
        if (!visualizationTool || !visualizationTool.magnifierTool || !visualizationTool.magnifierTool.isActive) return;

        var magnifierTool = visualizationTool.magnifierTool;
        var magnifier = magnifierTool.magnifier;
        var documentPoint = diagram.lastInput.documentPoint; // 鼠标所在的视图位置（相对于整个视图，原点坐标在视图中心）

        // 设定放大镜的显示区域为鼠标所在位置（要使鼠标位置在放大镜中间，需要向左上平移一定距离（放大镜尺寸的一半大小））
        var newPointX = documentPoint.x - magnifier.viewportBounds.size.width / 2;
        var newPointY = documentPoint.y - magnifier.viewportBounds.size.height / 2;
        magnifier.position = new go.Point(newPointX, newPointY);

        // 鼠标位置在视图的图形边界内时放大镜显示，否则不显示
        if (!diagram.documentBounds.containsPoint(documentPoint) || !diagram.viewportBounds.containsPoint(documentPoint)) {
            magnifierTool.visible = false;
            return;
        }
        else {
            magnifierTool.visible = true;
        }

        var container = magnifierTool.container;
        var containerOffset = magnifierTool.containerOffset; // 放大镜容器相对于鼠标的偏移量
        var actualContentWidth = diagram.viewportBounds.width * diagram.scale; // 视图的实际宽度（HTML宽度）
        var actualContentHeight = diagram.viewportBounds.height * diagram.scale; // 视图的实际高度（HTML高度）
        var containerWidth = container.scrollWidth; // 放大镜容器的实际宽度
        var containerHeight = container.scrollHeight; // 放大镜容器的实际高度
        var viewPoint = diagram.lastInput.viewPoint; // 鼠标所在的视野位置（相对于视图所在的div容器，原点坐标在视图可视范围的左上角）
        var maxPointX = viewPoint.x + containerWidth + containerOffset; // 放大镜容器的所能到达的最大x轴位置（放大镜容器右下角顶点的x轴位置）
        var maxPointY = viewPoint.y + containerHeight + containerOffset; // 放大镜容器的所能到达的最大y轴位置（放大镜容器右下角顶点的y轴位置）
        var bufferSpace = 10; // 缓冲距离，防止放大镜超出视图范围
        var left = 0;
        var top = 0;

        // 控制放大镜的x轴位置
        if (maxPointX < actualContentWidth - bufferSpace) {
            left = viewPoint.x + containerOffset;
        } else {
            left = viewPoint.x - containerOffset - containerWidth;
        }

        // 控制放大镜的Y轴位置
        if (maxPointY < actualContentHeight - bufferSpace) {
            top = viewPoint.y + containerOffset;
        } else {
            top = viewPoint.y - containerOffset - containerHeight;
        }

        // 设置放大镜位置
        container.style.left = left.toString() + "px";
        container.style.top = top.toString() + "px";

        // 延时更新视图中节点和链接的子元素显示状态
        TimeoutTool.doDelay(magnifierTool, magnifierTool.updateDetailsVisibility, magnifierTool.updateVisibilityDelay);
    };

    /**
    * 更新鼠标位置的节点和链接的子元素显示状态
    */
    MagnifierTool.prototype.updateDetailsVisibility = function () {
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
            }
            else if (part instanceof go.Link) {
                model.setDataProperty(part.data, "showTextList", true);
            }
        });
    };

    /**
    * 更新或设置显示状态
    * @param value {Boolean} 显示状态
    * @return {Boolean} 显示状态
    */
    Object.defineProperty(MagnifierTool.prototype, "visible", {
        enumerable: true,
        get: function () {
            return this._visible;
        },
        set: function (value) {
            if (this._visible !== value) {
                this._visible = value;

                if (this.container) {
                    // 切换容器显示状态
                    this.container.style.display = this._visible ? "inline" : "none";
                }
            }
        }
    });

    /**
    * 更新或设置要监视的视图对象
    * @param value {go.Diagram} 视图对象
    * @return {go.Diagram} 视图对象
    */
    Object.defineProperty(MagnifierTool.prototype, "diagram", {
        enumerable: true,
        get: function () {
            return this._diagram;
        },
        set: function (value) {
            if (this._diagram !== value) {
                this._diagram = value;

                if (this.magnifier) {
                    // 设置监视对象
                    this.magnifier.observed = this._diagram;

                    if (this._diagram) {
                        var magnifierTool = this;

                        // 添加视图的鼠标移动事件
                        this._diagram.toolManager.doMouseMove = function () {
                            go.ToolManager.prototype.doMouseMove.call(this);

                            magnifierTool.listenDiagramMouseMove(this.diagram);
                        };

                        //this._diagram.toolManager.draggingTool.doMouseMove = function () {
                        //    go.DraggingTool.prototype.doMouseMove.call(this);

                        //    magnifierTool.listenDiagramMouseMove(this.diagram);
                        //};
                    }
                }
            }
        }
    });

    //#endregion 全景视图工具

    // ----------------------------------------------------------------------------------------------------------------------

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
        // 面板样式_标准
        panelStyle: {
            background: "#c0c3c4",
            alignment: go.Spot.Center
        },
        // 面板样式_有鼠标事件
        panelStyle2: {
            background: "#c0c3c4",
            alignment: go.Spot.Center,
            cursor: "pointer",
            mouseEnter: function (e, object) {
                var text = object.findObject("TEXT");
                if (text) {
                    text.stroke = "#1E90FF";
                    text.font = "bold 24px sans-serif";
                }
            },
            mouseLeave: function (e, object) {
                var text = object.findObject("TEXT");
                if (text) {
                    text.stroke = "#333333";
                    text.font = "bold 18px sans-serif";
                }
            }
        },
        // 面板样式_浅色
        panelStyle3: {
            background: "transparent",
            alignment: go.Spot.Center
        },
        // 文本框样式_标准
        textBlockStyle: {
            stroke: "#333333",
            textAlign: "center",
            font: "bold 18px sans-serif",
            minSize: new go.Size(10, 15),
            maxSize: new go.Size(250, 25),
            margin: new go.Margin(0, 5, 0, 5),
            wrap: go.TextBlock.None,
            overflow: go.TextBlock.OverflowEllipsis,
        },
        // 节点样式_标准
        nodeStyle: {
            cursor: "pointer",
            selectionAdorned: false
        },
        // 链接样式_标准
        linkStyle: {
            curve: go.Link.None,
            routing: go.Link.Normal,
            adjusting: go.Link.None,
            cursor: "pointer",
            selectionAdorned: false
        },
        // 图形样式_链接线
        shapeStyle: {
            scale: 1,
            stroke: "black",
            strokeWidth: 1.5,
            strokeCap: "square"
        },
        // 图形样式_链接箭头
        shapeStyle2: {
            scale: 1.25,
            stroke: "black",
            strokeWidth: 1.5,
            strokeCap: "square"
        }
    };

    //#region 属性转换器

    /**
    * 用高亮状态转换笔画颜色（节点的图片边框色）
    * return {String}
    */
    TemplateManager.prototype.convertStrokeByIsHighlighted = function (data, obj) {
        var color = "#f7f7f7";

        if (obj.part.isSelected) color = "dodgerblue";
        else if (obj.part.isHighlighted) color = "red";

        // 优先级顺序：选中色（dodgerblue）>高亮色（red）>默认色（#f7f7f7）
        return color;
    };

    /**
    * 用高亮状态转换笔画颜色2（链接的线颜色）
    * return {String}
    */
    TemplateManager.prototype.convertStrokeByIsHighlighted2 = function (data, obj) {
        var color = obj.part.data.color ? obj.part.data.color : "black";

        if (obj.part.isSelected) color = "dodgerblue";
        else if (obj.part.isHighlighted) color = "red";

        // 优先级顺序：选中色（dodgerblue）>高亮色（red）>数据模型颜色（data.color）>默认色（black）
        return color;
    };

    /**
    * 用高亮状态转换笔画宽度（链接的线宽度）
    * return {Number}
    */
    TemplateManager.prototype.convertStrokeWidthByIsHighlighted = function (data, obj) {
        var strokeWidth = obj.part.data.strokeWidth ? obj.part.data.strokeWidth : 1.5;

        if (obj.part.isSelected) strokeWidth = strokeWidth + 2;
        else if (obj.part.isHighlighted) strokeWidth = strokeWidth + 1.5;

        // 优先级顺序：选中笔画宽度>高亮笔画宽度>数据模型笔画宽度（data.strokeWidth）>默认笔画宽度（1.5）
        return strokeWidth;
    };

    /**
    * 用高亮状态转换堆叠顺序（节点或链接的显示层级）
    * return {Number}
    */
    TemplateManager.prototype.convertZOrderByIsHighlighted = function (data, obj) {
        var zOrder = 0;

        if (obj instanceof go.Node) {
            zOrder = data ? 20 : 10;
        }
        else {
            zOrder = data ? 15 : 5;
        }

        return zOrder;
    };

    /**
    * 用高亮状态转换期望尺寸（节点的图片大小）
    * return {go.Size}
    */
    TemplateManager.prototype.convertDesiredSizeByIsHighlighted = function (data, obj) {
        var size = obj.part.data.isMain ? 100 : 60;

        return data ? new go.Size(size + 20, size + 20) : new go.Size(size, size);
    };

    /**
    * 用隐藏状态转换可见状态（单条属性信息的可见状态）
    * return {Boolean}
    */
    TemplateManager.prototype.convertVisibleByIsHidden = function (data) {
        return !data ? true : false;
    };

    /**
    * 用双向状态转换可见状态（链接箭头的可见状态）
    * return {Boolean}
    */
    TemplateManager.prototype.convertVisibleByIsTwoWay = function (data) {
        return !data ? true : false;
    };

    /**
    * 用选中状态转换笔画颜色（节点的图片边框色）
    * return {String}
    */
    TemplateManager.prototype.convertStrokeByIsSelected = function (data, obj) {
        var color = "#f7f7f7";

        if (obj.part.isSelected) color = "dodgerblue";
        else if (obj.part.isHighlighted) color = "red";

        // 优先级顺序：选中色（dodgerblue）>高亮色（red）>默认色（#f7f7f7）
        return color;
    };

    /**
    * 用选中状态转换笔画颜色2（链接的线颜色）
    * return {String}
    */
    TemplateManager.prototype.convertStrokeByIsSelected2 = function (data, obj) {
        var color = obj.part.data.color ? obj.part.data.color : "black";

        if (obj.part.isSelected) color = "dodgerblue";
        else if (obj.part.isHighlighted) color = "red";

        // 优先级顺序：选中色（dodgerblue）>高亮色（red）>数据模型颜色（data.color）>默认色（black）
        return color;
    };

    /**
    * 用选中状态转换笔画宽度（链接的线宽度）
    * return {String}
    */
    TemplateManager.prototype.convertStrokeWidthByIsSelected = function (data, obj) {
        var strokeWidth = obj.part.data.strokeWidth ? obj.part.data.strokeWidth : 1.5;

        if (obj.part.isSelected) strokeWidth = strokeWidth + 2;
        else if (obj.part.isHighlighted) strokeWidth = strokeWidth + 1.5;

        // 优先级顺序：选中笔画宽度>高亮笔画宽度>数据模型笔画宽度（data.strokeWidth）>默认笔画宽度（1.5）
        return strokeWidth;
    };

    /**
    * 用选中状态转换堆叠顺序（节点或链接的显示层级）
    * return {String}
    */
    TemplateManager.prototype.convertZOrderByIsSelected = function (data, obj) {
        var zOrder = 0;

        if (obj instanceof go.Node) {
            zOrder = data ? 20 : 10;
        }
        else {
            zOrder = data ? 15 : 5;
        }

        return zOrder;
    };

    /**
    * 用关键节点状态转换填充色（节点的图片背景色）
    * return {String}
    */
    TemplateManager.prototype.convertFillByIsMain = function (data) {
        var isMainColor = $$(go.Brush, "Radial",
            {
                0: "white",
                0.5: "#e0c7b5",
                0.9: "#ed8c2d",
                1: "brown"
            })

        return data ? isMainColor : "#f7f7f7";
    };

    /**
    * 用关键节点状态转换缩放比例（图片边框缩放比例）
    * return {String}
    */
    TemplateManager.prototype.convertScaleByIsMain = function (data) {
        return data ? 1.25 : 1;
    };

    /**
    * 用属性信息集转换可见状态（文本列表的显示状态）
    * return {String}
    */
    TemplateManager.prototype.convertVisibleByPropertyValues = function (data) {
        return (data.length > 0) ? true : false;
    };

    /**
    * 用颜色转换填充色（节点的图片背景色）
    * return {String}
    */
    TemplateManager.prototype.convertFillByColor = function (data) {
        var color = data ? data : "transparent";

        if (data === "gradient") {
            color = $$(go.Brush, "Radial",
            {
                0: "white",
                0.5: "#e0c7b5",
                0.9: "#ed8c2d",
                1: "brown"
            });
        }

        return color;
    };

    /**
    * 用图形边界值转换位置（节点位置）
    * return {go.Position}
    */
    TemplateManager.prototype.convertPositionByBounds = function (data) {
        return data.position;
    };

    /**
    * 用位置转换边界值（节点图形边界值）
    * return {go.Rect}
    */
    TemplateManager.prototype.convertBoundsByPosition = function (data, objectData) {
        objectData.bounds.position = data;

        return objectData.bounds;
    };

    /**
    * 用是否显示文本列表转换透明度（文本列表透明度）
    * return {Number}
    */
    TemplateManager.prototype.convertOpacityByShowTextList = function (data, obj) {
        return data ? 1 : 0;
    };

    //#endregion 属性转换器

    //#region 自定义控件

    /**
    * 创建图形控件（图片控件_标准）
    * return {go.Panel} 图形控件
    */
    TemplateManager.prototype.createShapePanel = function () {
        var shapePanel =
            // 图形面板
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
                    new go.Binding("fill", "color", this.convertFillByColor),
                    new go.Binding("figure", "shape"),
                    new go.Binding("stroke", "isHighlighted", this.convertStrokeByIsHighlighted).ofObject(),
                    new go.Binding("stroke", "isSelected", this.convertStrokeByIsSelected).ofObject()
                )
            );

        return shapePanel;
    };

    /**
    * 创建图片控件（图片控件_标准）
    * return {go.Panel} 图片控件
    */
    TemplateManager.prototype.createPicturePanel = function () {
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
                    new go.Binding("fill", "color", this.convertFillByColor).makeTwoWay(),
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
    * 创建文本列表控件（文本列表控件_标准）
    * @param itemTemplate {go.Panel} 文本元素模板
    * return {go.Panel} 文本列表控件
    */
    TemplateManager.prototype.createTextListPanel = function (itemTemplate) {
        if (!itemTemplate) itemTemplate = null;

        var textListPanel =
            // 信息面板
            $$(go.Panel, "Auto",
                {
                    name: "TEXT_LIST_PANEL",
                    alignment: go.Spot.Center,
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
                    new go.Binding("stroke", "isHighlighted", this.convertStrokeByIsHighlighted).ofObject(),
                    new go.Binding("stroke", "isSelected", this.convertStrokeByIsSelected).ofObject()
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

        return textListPanel;
    };

    /**
    * 创建右键菜单
    * return {go.Adornment} 右键菜单
    */
    TemplateManager.prototype.createContextMenu = function () {
        var contextMenu =
            // 右键菜单面板
            $$(go.Adornment, "Vertical",
                 {
                     name: "CONTEXT_MENU",
                     alignment: go.Spot.Center
                 }
            );

        return contextMenu;
    };

    /**
    * 创建右键菜单按钮（右键菜单按钮_标准）
    * @param name {String} 按钮名称
    * @param event {Function} 触发事件
    * return {ContextMenuButton} 右键菜单按钮
    */
    TemplateManager.prototype.createContextMenuButton = function (name, event) {
        var contextMenuButton =
            // 右键菜单按钮
            $$("ContextMenuButton",
                {
                    height: 27,
                    alignment: go.Spot.Center,
                    "ButtonBorder.stroke": "#f7f7f7",
                    "ButtonBorder.fill": "#2786de",
                    "ButtonBorder.figure": "RoundedRectangle",
                    mouseEnter: function (e, obj) {
                        var border = contextMenuButton.findObject("ButtonBorder");
                        border.fill = $$(go.Brush, "Linear", { 0: "#2786de", 1: "#92a6d0" });
                    },
                    mouseLeave: function (e, obj) {
                        var border = contextMenuButton.findObject("ButtonBorder");
                        border.fill = "#2786de";
                    },
                    click: event
                },
                // 按钮文本
                $$(go.TextBlock,
                    {
                        name: "BUTTON_TEXT",
                        stroke: "#fff",
                        font: "normal 14px sans-serif",
                        textAlign: "center",
                        margin: new go.Margin(0, 20, 0, 20),
                        text: name
                    }
                )
            );

        return contextMenuButton;
    };

    /**
    * 创建链接的线或箭头或链接文本框的图形
    * @param initializers {...*} 零个、一个或多个属性对象(或绑定),实际上从arguments中取得
    * return {go.Shape} 图形
    */
    TemplateManager.prototype.createLinkShape = function (initializers) {
        var shape =
            $$(go.Shape,
                new go.Binding("stroke", "isHighlighted", this.convertStrokeByIsHighlighted2).ofObject(),
                new go.Binding("stroke", "isSelected", this.convertStrokeByIsSelected2).ofObject(),
                new go.Binding("strokeWidth", "isHighlighted", this.convertStrokeWidthByIsHighlighted).ofObject(),
                new go.Binding("strokeWidth", "isSelected", this.convertStrokeWidthByIsSelected).ofObject()
            );

        if (arguments) {
            for (var i = 0; i < arguments.length; i++) {
                var argument = arguments[i];
                if (argument) {
                    if (argument instanceof go.Binding) {
                        // 为图形设置绑定
                        shape.bind(argument);
                    }
                    else if (argument instanceof Object) {
                        // 为图形设置属性
                        shape.setProperties(argument);
                    }
                }
            }
        }

        return shape;
    };

    /**
    * 创建提示框
    * @param textListPanel {go.Panel} 文本列表控件
    * return {go.Adornment} 提示框
    */
    TemplateManager.prototype.createToolTip = function (textListPanel) {
        var tooltip =
            // 提示信息面板
            $$(go.Adornment, "Auto",
                {
                    name: "TOOL_TIP",
                    alignment: go.Spot.Center
                }
            );

        // 添加文本列表控件
        if (textListPanel) {
            tooltip.add(textListPanel);
        }

        return tooltip;
    };

    //#endregion 自定义控件

    //#region 模板资源

    /**
    * 创建子元素模板_标准
    * return {go.Panel} 子元素模板
    */
    TemplateManager.prototype.createItemTemplate = function () {
        var template =
            // 信息面板
            $$(go.Panel, "Auto",
                this.styles.panelStyle3,
                {
                    name: "ITEM_TEMPLATE"
                },
                new go.Binding("visible", "isHidden", this.convertVisibleByIsHidden),
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
                        name: "TEXT",
                    },
                    new go.Binding("text", "value")
                )
            );

        return template;
    };

    /**
    * 创建子元素模板_无边框
    * return {go.Panel} 子元素模板
    */
    TemplateManager.prototype.createItemTemplate_Simple = function () {
        var template =
            // 信息面板
            $$(go.Panel, "Auto",
                this.styles.panelStyle3,
                {
                    name: "ITEM_TEMPLATE"
                },
                new go.Binding("visible", "isHidden", this.convertVisibleByIsHidden),
                // 信息文本
                $$(go.TextBlock,
                    this.styles.textBlockStyle,
                    {
                        name: "TEXT",
                    },
                    new go.Binding("text", "value")
                )
            );

        return template;
    };

    /**
    * 创建节点模板
    * @param templateName {String} 模板名称
    * @param picturePanel {go.Panel} 图片控件
    * @param textListPanel {go.Panel} 文本列表控件
    * return {go.Node} 节点模板
    */
    TemplateManager.prototype.createNodeTemplate = function (templateName, picturePanel, textListPanel) {
        if (!templateName) return;

        var template =
            // 节点
            $$(CustomNode, "Auto",
                this.styles.nodeStyle,
                {
                    name: templateName
                },
                new go.Binding("visible", "isVisible").makeTwoWay(),
                new go.Binding("isSelected", "isSelected").makeTwoWay(),
                new go.Binding("isHighlighted", "isHighlighted"),
                new go.Binding("position", "bounds", this.convertPositionByBounds).makeTwoWay(this.convertBoundsByPosition),
                new go.Binding("zOrder", "isHighlighted", this.convertZOrderByIsHighlighted).ofObject(),
                new go.Binding("zOrder", "isSelected", this.convertZOrderByIsSelected).ofObject()
            );

        var informationPanel = null;

        // 添加信息面板
        if (picturePanel && textListPanel) {
            var informationPanel =
                // 信息面板
                $$(go.Panel, "Vertical",
                    {
                        name: "INFORMATION_PANEL",
                        alignment: go.Spot.Center
                    }
                );

            template.add(informationPanel);
        }

        // 添加图片控件
        if (picturePanel) {
            informationPanel ? informationPanel.add(picturePanel) : template.add(picturePanel);
        }
        // 添加文本列表控件
        if (textListPanel) {
            informationPanel ? informationPanel.add(textListPanel) : template.add(textListPanel);
        }

        return template;
    };

    /**
    * 创建节点模板_标准
    * return {go.Node} 节点模板
    */
    TemplateManager.prototype.createNodeTemplate_Normal = function () {
        var picturePanel = this.createPicturePanel();
        var itemTemplate = this.createItemTemplate_Simple();
        var textListPanel = this.createTextListPanel(itemTemplate);

        // 节点模板（图片+文本）
        return this.createNodeTemplate("NODE_TEMPLATE_NORMAL", picturePanel, textListPanel);
    };

    /**
    * 创建节点模板_微小
    * return {go.Node} 节点模板
    */
    TemplateManager.prototype.createNodeTemplate_Small = function () {
        var picturePanel = this.createPicturePanel();

        // 节点模板（仅图片）
        return this.createNodeTemplate("NODE_TEMPLATE_SMALL", picturePanel);
    };

    /**
    * 创建节点模板_极小
    * return {go.Node} 节点模板
    */
    TemplateManager.prototype.createNodeTemplate_Tiny = function () {
        var shapePanel = this.createShapePanel();

        // 节点模板（仅图形）
        return this.createNodeTemplate("NODE_TEMPLATE_TINY", shapePanel);
    };

    /**
    * 创建节点模板_单文本（图片选中装饰_叶节点状态_单文本列表, 仅自定义模型功能使用）
    * return {go.Node} 节点模板
    */
    TemplateManager.prototype.createNodeTemplate_SingleText = function () {
        var picturePanel = this.createPicturePanel(true);
        var textPanel =
            // 文本列表控件
            $$(go.Panel, "Auto",
                {
                    name: "TEXT_LIST_PANEL",
                    alignment: go.Spot.Center,
                },
                // 边框图形
                $$(go.Shape, "RoundedRectangle",
                    {
                        name: "TEXT_LIST_PANEL_SHAPE",
                        fill: "#f7f7f7",
                        stroke: null,
                        strokeWidth: 1.5
                    },
                    new go.Binding("stroke", "isHighlighted", this.convertStrokeByIsHighlighted).ofObject(),
                    new go.Binding("stroke", "isSelected", this.convertStrokeByIsSelected).ofObject()
                ),
                // 节点类型名称
                $$(go.TextBlock,
                    this.styles.textBlockStyle,
                    new go.Binding("text", "typeName")
                )
            );

        var template =
            // 节点模板
            $$(CustomNode, "Auto",
            {
                name: "NODE_TEMPLATE_SINGLE_TEXT",
                selectionAdorned: false
            },
            new go.Binding("visible", "isVisible").makeTwoWay(),
            new go.Binding("isSelected", "isSelected").makeTwoWay(),
            new go.Binding("isHighlighted", "isHighlighted"),
            new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("deletable", "isTreeLeaf").ofObject(),
            new go.Binding("zOrder", "isHighlighted", this.convertZOrderByIsHighlighted).ofObject(),
            new go.Binding("zOrder", "isSelected", this.convertZOrderByIsSelected).ofObject(),
            // 信息面板
            $$(go.Panel, "Vertical",
                {
                    name: "INFORMATION_PANEL",
                    alignment: go.Spot.Center
                },
                // 图片控件
                picturePanel,
                // 文本列表控件
                textPanel
            )
        );

        return template;
    };

    /**
    * 创建链接模板
    * @param templateName {String} 模板名称
    * @param textListPanel {go.Panel} 文本列表控件
    * return {go.Link}
    */
    TemplateManager.prototype.createLinkTemplate = function (templateName, textListPanel) {
        if (!templateName) return;

        var template =
            // 链接
            $$(go.Link,
                this.styles.linkStyle,
                {
                    name: templateName
                },
                new go.Binding("visible", "isVisible").makeTwoWay(),
                new go.Binding("isSelected", "isSelected").makeTwoWay(),
                new go.Binding("isHighlighted", "isHighlighted"),
                new go.Binding("zOrder", "isHighlighted", this.convertZOrderByIsHighlighted).ofObject(),
                new go.Binding("zOrder", "isSelected", this.convertZOrderByIsSelected).ofObject(),
                // 链接的线
                this.createLinkShape(this.styles.shapeStyle),
                // 链接的结束箭头
                this.createLinkShape(
                    this.styles.shapeStyle2,
                    {
                        toArrow: "OpenTriangle",
                    },
                    new go.Binding("visible", "isTwoWay", this.convertVisibleByIsTwoWay))
                // 信息面板
                //$$(go.Panel, "Auto",
                //    {
                //        name: "INFORMATION_PANEL",
                //        //segmentOffset: new go.Point(0, 0),
                //        //segmentOrientation: go.Link.OrientUpright
                //    },
                //    new go.Binding("visible", "propertyValues", this.convertVisibleByPropertyValues))
            );

        //var informationPanel = template.findObject("INFORMATION_PANEL");
        // 添加文本列表控件
        if (textListPanel) {
            template.add(textListPanel);
        }

        return template;
    };

    /**
    * 创建链接模板_标准
    * return {go.Node} 节点模板
    */
    TemplateManager.prototype.createLinkTemplate_Normal = function () {
        var itemTemplate = this.createItemTemplate_Simple();
        var textListPanel = this.createTextListPanel(itemTemplate);

        // 链接模板（有文本）
        return this.createLinkTemplate("LINK_TEMPLATE_NORMAL", textListPanel);
    };

    /**
    * 创建链接模板_微小
    * return {go.Node} 节点模板
    */
    TemplateManager.prototype.createLinkTemplate_Small = function () {
        // 链接模板（无文本）
        return this.createLinkTemplate("LINK_TEMPLATE_SMALL");
    };

    /**
    * 创建并行线链接模板
    * @param templateName {String} 模板名称
    * @param textListPanel {go.Panel} 文本列表控件
    * return {go.Link}
    */
    TemplateManager.prototype.createParallelLinkTemplate = function (templateName, textListPanel) {
        if (!templateName) return;

        var template =
            // 链接
            $$(ParallelLink,
                this.styles.linkStyle,
                {
                    name: templateName
                },
                new go.Binding("visible", "isVisible").makeTwoWay(),
                new go.Binding("isSelected", "isSelected").makeTwoWay(),
                new go.Binding("isHighlighted", "isHighlighted"),
                new go.Binding("zOrder", "isHighlighted", this.convertZOrderByIsHighlighted).ofObject(),
                new go.Binding("zOrder", "isSelected", this.convertZOrderByIsSelected).ofObject(),
                // 链接的线
                this.createLinkShape(this.styles.shapeStyle),
                // 链接的起始箭头
                this.createLinkShape(
                    this.styles.shapeStyle,
                    {
                        name: "FROM_ARROR",
                        segmentIndex: 0,
                        segmentOrientation: go.Link.OrientAlong
                    }),
                // 链接的结束箭头
                this.createLinkShape(
                    this.styles.shapeStyle,
                    {
                        name: "TO_ARROR",
                        segmentIndex: -1,
                        segmentOrientation: go.Link.OrientAlong
                    }),
                // 链接的装饰箭头
                this.createLinkShape(
                    this.styles.shapeStyle2,
                    {
                        name: "ADORNED_ARROR",
                        segmentIndex: -1,
                        segmentOrientation: go.Link.OrientAlong,
                        //segmentOffset: new go.Point(-30, 0),
                        geometryString: "m 0,0 l 8,4 -8,4",
                    },
                    new go.Binding("visible", "isTwoWay", this.convertVisibleByIsTwoWay))
            );

        // 添加文本列表控件
        if (textListPanel) {
            template.add(textListPanel);
        }

        return template;
    };

    /**
    * 创建并行线链接模板_标准
    * return {go.Node} 节点模板
    */
    TemplateManager.prototype.createParallelLinkTemplate_Normal = function () {
        var itemTemplate = this.createItemTemplate_Simple();
        var textListPanel = this.createTextListPanel(itemTemplate);

        // 并行线链接模板（有文本）
        return this.createParallelLinkTemplate("PARALLE_LINK_TEMPLATE_NORMAL", textListPanel);
    };

    /**
    * 创建并行线链接模板_微小
    * return {go.Node} 节点模板
    */
    TemplateManager.prototype.createParallelLinkTemplate_Small = function () {
        // 并行线链接模板（无文本）
        return this.createParallelLinkTemplate("PARALLE_LINK_TEMPLATE_SMALL");
    };

    //#endregion 模板资源

    /**
    * 创建预定义模板资源
    * return {go.Panel}
    */
    TemplateManager.prototype.createTemplates = function () {
        // 节点模板_标准
        this.nodeTemplate_Normal = this.createNodeTemplate_Normal();
        // 节点模板_微小
        this.nodeTemplate_Small = this.createNodeTemplate_Small();
        // 节点模板_极小
        this.nodeTemplate_Tiny = this.createNodeTemplate_Tiny();
        // 节点模板_单节点
        this.nodeTemplate_SingleText = this.createNodeTemplate_SingleText();
        // 链接模板_标准
        this.linkTemplate_Normal = this.createLinkTemplate_Normal();
        // 链接模板_微小
        this.linkTemplate_Small = this.createLinkTemplate_Small();
        // 并行线链接模板_标准
        this.linkTemplate_ParallelNormal = this.createParallelLinkTemplate_Normal();
        // 并行线链接模板_微小
        this.linkTemplate_ParallelSmall = this.createParallelLinkTemplate_Small();
    };

    //#endregion 模板资源

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 虚拟化树形布局

    /**
    * 虚拟化树形布局的构造函数
    */
    function VirtualizedTreeLayout() {
        // 继承树形布局的构造函数
        go.TreeLayout.call(this);

        this.isVirtualized = true; // 设置虚拟化标识
    };

    // 虚拟化树形布局继承树形布局的所有属性和方法
    go.Diagram.inherit(VirtualizedTreeLayout, go.TreeLayout);

    /**
    * 创建网络（override）
    */
    VirtualizedTreeLayout.prototype.createNetwork = function () {
        // 创建一个新的虚拟化树形网络
        return new VirtualizedTreeNetwork();
    };

    /**
    * 制作网络（override）
    * @param coll {go.Diagram|go.Group|go.Iterable} 要进行网络制作的视图组件（集合），在此布局中无用
    */
    VirtualizedTreeLayout.prototype.makeNetwork = function (coll) {
        // 创建网络
        var network = this.createNetwork();
        // 添加虚拟模型数据
        network.addVirtualizedModel(this.diagram.virtualizedModel);

        return network;
    };

    /**
    * 提交布局（override）
    */
    VirtualizedTreeLayout.prototype.commitLayout = function () {
        go.TreeLayout.prototype.commitLayout.call(this);

        // 手动计算视图边界
        this.diagram.computeFixedBounds();

        // 更新视图上的所有节点的位置
        this.diagram.nodes.each(function (obj) {
            obj.updateTargetBindings();
        });
    };

    //#endregion 虚拟化树形布局

    //#region 虚拟化树形网络

    /**
    * 虚拟化树形网络的构造函数
    */
    function VirtualizedTreeNetwork() {
        // 继承树形网络的构造函数
        go.TreeNetwork.call(this);
    }

    // 虚拟化树形网络继承树形网络的所有属性和方法
    go.Diagram.inherit(VirtualizedTreeNetwork, go.TreeNetwork);

    /**
    * 删除人工顶点（override），人工顶点即没有所属组件（节点）的顶点，虚拟化布局中此方法制空
    */
    VirtualizedTreeNetwork.prototype.deleteArtificialVertexes = function () {

    };

    //#endregion 虚拟化树形网络

    //#region 虚拟化环形布局

    /**
    * 虚拟化环形布局的构造函数
    */
    function VirtualizedCircularLayout() {
        // 继承环形布局的构造函数
        go.CircularLayout.call(this);

        this.isVirtualized = true; // 设置虚拟化标识
    };

    // 虚拟化环形布局继承环形布局的所有属性和方法
    go.Diagram.inherit(VirtualizedCircularLayout, go.CircularLayout);

    /**
    * 创建网络（override）
    */
    VirtualizedCircularLayout.prototype.createNetwork = function () {
        // 创建一个新的虚拟化环形网络
        return new VirtualizedCircularNetwork();
    };

    /**
    * 制作网络（override）
    * @param coll {go.Diagram|go.Group|go.Iterable} 要进行网络制作的视图组件（集合），在此布局中无用
    */
    VirtualizedCircularLayout.prototype.makeNetwork = function (coll) {
        // 创建网络
        var network = this.createNetwork();
        // 添加虚拟模型数据
        network.addVirtualizedModel(this.diagram.virtualizedModel);

        return network;
    };

    /**
    * 提交布局（override）
    */
    VirtualizedCircularLayout.prototype.commitLayout = function () {
        go.CircularLayout.prototype.commitLayout.call(this);

        // 手动计算视图边界
        this.diagram.computeFixedBounds();

        // 更新视图上的所有节点的位置
        this.diagram.nodes.each(function (obj) {
            obj.updateTargetBindings();
        });
    };

    //#endregion 虚拟化环形布局

    //#region 虚拟化环形网络

    /**
    * 虚拟化环形网络的构造函数
    */
    function VirtualizedCircularNetwork() {
        // 继承环形网络的构造函数
        go.CircularNetwork.call(this);
    }

    // 虚拟化环形网络继承环形网络的所有属性和方法
    go.Diagram.inherit(VirtualizedCircularNetwork, go.CircularNetwork);

    /**
    * 删除人工顶点（override），人工顶点即没有所属组件（节点）的顶点，虚拟化布局中此方法制空
    */
    VirtualizedCircularNetwork.prototype.deleteArtificialVertexes = function () {

    };

    //#endregion 虚拟化环形网络

    //#region 虚拟化力导向布局

    /**
    * 虚拟化力导向布局的构造函数
    */
    function VirtualizedForceDirectedLayout() {
        // 继承力导向布局的构造函数
        go.ForceDirectedLayout.call(this);

        this.isVirtualized = true; // 设置虚拟化标识
    };

    // 虚拟化力导向布局继承力导向布局的所有属性和方法
    go.Diagram.inherit(VirtualizedForceDirectedLayout, go.ForceDirectedLayout);

    /**
    * 创建网络（override）
    */
    VirtualizedForceDirectedLayout.prototype.createNetwork = function () {
        // 创建一个新的虚拟化力导向网络
        return new VirtualizedForceDirectedNetwork();
    };

    /**
    * 制作网络（override）
    * @param coll {go.Diagram|go.Group|go.Iterable} 要进行网络制作的视图组件（集合），在此布局中无用
    */
    VirtualizedForceDirectedLayout.prototype.makeNetwork = function (coll) {
        // 创建网络
        var network = this.createNetwork();
        // 添加虚拟模型数据
        network.addVirtualizedModel(this.diagram.virtualizedModel);

        return network;
    };

    /**
    * 提交布局（override）
    */
    VirtualizedForceDirectedLayout.prototype.commitLayout = function () {
        go.ForceDirectedLayout.prototype.commitLayout.call(this);

        // 手动计算视图边界
        this.diagram.computeFixedBounds();

        // 更新视图上的所有节点的位置
        this.diagram.nodes.each(function (obj) {
            obj.updateTargetBindings();
        });
    };

    //#endregion 虚拟化力导向布局

    //#region 虚拟化力导向网络

    /**
    * 虚拟化力导向网络的构造函数
    */
    function VirtualizedForceDirectedNetwork() {
        // 继承力导向网络的构造函数
        go.ForceDirectedNetwork.call(this);
    }

    // 虚拟化力导向网络继承力导向网络的所有属性和方法
    go.Diagram.inherit(VirtualizedForceDirectedNetwork, go.ForceDirectedNetwork);

    /**
    * 删除人工顶点（override），人工顶点即没有所属组件（节点）的顶点，虚拟化布局中此方法制空
    */
    VirtualizedForceDirectedNetwork.prototype.deleteArtificialVertexes = function () {

    };

    //#endregion 虚拟化力导向网络

    //#region 虚拟化分层有向布局（暂不可用，等待官方Demo）

    /**
    * 虚拟化分层有向布局的构造函数
    */
    function VirtualizedLayeredDigraphLayout() {
        // 继承分层有向布局的构造函数
        go.LayeredDigraphLayout.call(this);

        this.isVirtualized = true; // 设置虚拟化标识
    };

    // 虚拟化分层有向布局继承分层有向布局的所有属性和方法
    go.Diagram.inherit(VirtualizedLayeredDigraphLayout, go.LayeredDigraphLayout);

    /**
    * 创建网络（override）
    */
    VirtualizedLayeredDigraphLayout.prototype.createNetwork = function () {
        // 创建一个新的虚拟化分层有向网络
        return new VirtualizedLayeredDigraphNetwork();
    };

    /**
    * 制作网络（override）
    * @param coll {go.Diagram|go.Group|go.Iterable} 要进行网络制作的视图组件（集合），在此布局中无用
    */
    VirtualizedLayeredDigraphLayout.prototype.makeNetwork = function (coll) {
        // 创建网络
        var network = this.createNetwork();
        // 添加虚拟模型数据
        network.addVirtualizedModel(this.diagram.virtualizedModel);

        return network;
    };

    /**
    * 提交布局（override）
    */
    VirtualizedLayeredDigraphLayout.prototype.commitLayout = function () {
        go.LayeredDigraphLayout.prototype.commitLayout.call(this);

        // 手动计算视图边界
        this.diagram.computeFixedBounds();

        // 更新视图上的所有节点的位置
        this.diagram.nodes.each(function (obj) {
            obj.updateTargetBindings();
        });
    };

    //#endregion 虚拟化分层有向布局

    //#region 虚拟化分层有向网络（暂不可用，等待官方Demo）

    /**
    * 虚拟化分层有向网络的构造函数
    */
    function VirtualizedLayeredDigraphNetwork() {
        // 继承分层有向网络的构造函数
        go.LayeredDigraphNetwork.call(this);
    }

    // 虚拟化分层有向网络继承分层有向网络的所有属性和方法
    go.Diagram.inherit(VirtualizedLayeredDigraphNetwork, go.LayeredDigraphNetwork);

    /**
    * 删除人工顶点（override），人工顶点即没有所属组件（节点）的顶点，虚拟化布局中此方法制空
    */
    VirtualizedLayeredDigraphNetwork.prototype.deleteArtificialVertexes = function () {

    };

    //#endregion 虚拟化分层有向网络

    //#region 虚拟化网格布局

    /**
    * 虚拟化网格布局的构造函数
    */
    function VirtualizedGridLayout() {
        // 继承网格布局的构造函数
        go.GridLayout.call(this);

        this.isVirtualized = true; // 设置虚拟化标识
    };

    // 虚拟化网格布局继承网格布局的所有属性和方法
    go.Diagram.inherit(VirtualizedGridLayout, go.GridLayout);

    /**
    * 创建网络（override）
    */
    VirtualizedGridLayout.prototype.createNetwork = function () {
        // 创建一个新的虚拟化网格网络
        return new VirtualizedGridNetwork();
    };

    /**
    * 制作网络（override）
    * @param coll {go.Diagram|go.Group|go.Iterable} 要进行网络制作的视图组件（集合），在此布局中无用
    */
    VirtualizedGridLayout.prototype.makeNetwork = function (coll) {
        // 创建网络
        var network = this.createNetwork();
        // 添加虚拟模型数据
        network.addVirtualizedModel(this.diagram.virtualizedModel);

        return network;
    };

    /**
    * 提交布局（override）
    */
    VirtualizedGridLayout.prototype.commitLayout = function () {
        go.GridLayout.prototype.commitLayout.call(this);

        // 手动计算视图边界
        this.diagram.computeFixedBounds();

        // 更新视图上的所有节点的位置
        this.diagram.nodes.each(function (obj) {
            obj.updateTargetBindings();
        });
    };

    //#endregion 虚拟化网格布局

    //#region 虚拟化网格网络

    /**
    * 虚拟化网格网络的构造函数
    */
    function VirtualizedGridNetwork() {
        // 继承基本网络的构造函数
        go.LayoutNetwork.call(this);
    }

    // 虚拟化网格网络继承基本网络的所有属性和方法
    go.Diagram.inherit(VirtualizedGridNetwork, go.LayoutNetwork);

    /**
    * 删除人工顶点（override），人工顶点即没有所属组件（节点）的顶点，虚拟化布局中此方法制空
    */
    VirtualizedGridNetwork.prototype.deleteArtificialVertexes = function () {

    };

    //#endregion 虚拟化网格网络

    //#region 布局管理器

    /**
    * 布局管理器的构造函数
    */
    function LayoutManager() {

    };

    /**
    * 树形布局 {go.TreeLayout}
    */
    LayoutManager.TreeLayout =
        $$(go.TreeLayout, {
            nodeSpacing: 50,
            layerSpacing: 100,
            angle: 90,
            isOngoing: false
        });

    /**
    * 环形布局 {go.CircularLayout}
    */
    LayoutManager.CircularLayout =
        $$(go.CircularLayout, {
            spacing: 100,
            radius: 200,
            //arrangement: go.CircularLayout.ConstantDistance,
            isOngoing: false
        });

    /**
    * 力导向布局 {go.ForceDirectedLayout}
    */
    LayoutManager.ForceDirectedLayout =
        $$(go.ForceDirectedLayout, {
            maxIterations: 300,
            defaultElectricalCharge: 100,
            defaultSpringLength: 100,
            defaultGravitationalMass: 1000,
            isOngoing: false
        });

    /**
    * 分层有向布局 {go.LayeredDigraphLayout}
    */
    LayoutManager.LayeredDigraphLayout =
        $$(go.LayeredDigraphLayout, {
            layerSpacing: 200,
            columnSpacing: 20,
            setsPortSpots: false,
            isRouting: false,
            angle: 0,
            isOngoing: false
        });

    /**
    * 网格布局 {go.GridLayout}
    */
    LayoutManager.GridLayout =
        $$(go.GridLayout, {
            wrappingColumn: 10,
            spacing: new go.Size(50, 50),
            alignment: go.GridLayout.Location,
            isOngoing: false
        });

    /**
    * 虚拟化树形布局 {VirtualizedTreeLayout}
    */
    LayoutManager.VirtualizedTreeLayout =
        $$(VirtualizedTreeLayout, {
            nodeSpacing: 50,
            layerSpacing: 100,
            angle: 90,
            isOngoing: false
        });

    /**
    * 虚拟化环形布局 {VirtualizedCircularLayout}
    */
    LayoutManager.VirtualizedCircularLayout =
        $$(VirtualizedCircularLayout, {
            spacing: 100,
            radius: 200,
            //arrangement: go.CircularLayout.ConstantDistance,
            isOngoing: false
        });

    /**
    * 虚拟化力导向布局 {VirtualizedForceDirectedLayout}
    */
    LayoutManager.VirtualizedForceDirectedLayout =
        $$(VirtualizedForceDirectedLayout, {
            //maxIterations: 300,
            maxIterations: 100,
            defaultElectricalCharge: 100,
            defaultSpringLength: 100,
            defaultGravitationalMass: 1000,
            isOngoing: false
        });

    /**
    * 虚拟化分层有向布局 {VirtualizedLayeredDigraphLayout} （暂不可用，等待官方Demo）
    */
    LayoutManager.VirtualizedLayeredDigraphLayout =
        $$(VirtualizedLayeredDigraphLayout, {
            layerSpacing: 200,
            columnSpacing: 20,
            setsPortSpots: false,
            isRouting: false,
            angle: 0,
            isOngoing: false
        });

    /**
    * 虚拟化网格布局 {VirtualizedGridLayout}
    */
    LayoutManager.VirtualizedGridLayout =
        $$(VirtualizedGridLayout, {
            wrappingColumn: 10,
            spacing: new go.Size(50, 50),
            alignment: go.GridLayout.Location,
            isOngoing: false
        });

    //#endregion 布局管理器

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 工具栏管理器

    /**
    * 工具栏管理器的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function ToolbarManager(visualizationTool) {
        //visualizationTool.toolbarManager = this;
        this.visualizationTool = visualizationTool;
        this.diagram = visualizationTool.diagram;

        this.addTool("colorConfigTool", new ColorConfigTool(visualizationTool));
        this.addTool("shapeConfigTool", new ShapeConfigTool(visualizationTool));
        this.addTool("layoutConfigTool", new LayoutConfigTool(visualizationTool));
        this.addTool("selectionConfigTool", new SelectionConfigTool(visualizationTool));
        this.addTool("undoOperationTool", new UndoOperationTool(visualizationTool));
        this.addTool("redoOperationTool", new RedoOperationTool(visualizationTool));
        this.addTool("hideSelectedPartsTool", new HideSelectedPartsTool(visualizationTool));
        this.addTool("hideUnselectedPartsTool", new HideUnselectedPartsTool(visualizationTool));
        this.addTool("showHiddenPartsTool", new ShowHiddenPartsTool(visualizationTool));
        this.addTool("uniformScaleTool", new UniformScaleTool(visualizationTool));
        this.addTool("initializeScaleTool", new InitializeScaleTool(visualizationTool));
        this.addTool("centerSelectionTool", new CenterSelectionTool(visualizationTool));
        this.addTool("analysisSelectionTool", new AnalysisSelectionTool(visualizationTool));
        this.addTool("initializeLayoutTool", new InitializeLayoutTool(visualizationTool));
        this.addTool("showOverviewTool", new ShowOverviewTool(visualizationTool, visualizationTool.overviewTool));
        this.addTool("showMagnifierTool", new ShowMagnifierTool(visualizationTool, visualizationTool.magnifierTool));
        this.addTool("showGridLineTool", new ShowGridLineTool(visualizationTool));
        this.addTool("showImportanceTool", new ShowImportanceTool(visualizationTool));
        this.addTool("boxZoomTool", new BoxZoomTool(visualizationTool));
        this.addTool("highlightRelationTool", new HighlightRelationTool(visualizationTool));
        this.addTool("analysisPathTool", new AnalysisPathTool(visualizationTool));
        this.addTool("changeScaleTool", new ChangeScaleTool(visualizationTool));
        this.addTool("searchTextTool", new SearchTextTool(visualizationTool));

        //this.showMagnifierTool.group = "EXCUTE_ONLY";
        this.highlightRelationTool.group = "EXCUTE_ONLY";
        //this.boxZoomTool.group = "EXCUTE_ONLY";
        this.analysisPathTool.group = "EXCUTE_ONLY";
    };

    /**
    * 可视化工具 {VisualizationTool}
    */
    ToolbarManager.prototype.visualizationTool = null;

    /**
    * 主视图 {go.Diagram}
    */
    ToolbarManager.prototype.diagram = null;

    /**
    * 一般工具集合 {Array}
    */
    ToolbarManager.prototype.generalTools = [];

    /**
    * 开关工具集合 {Array}
    */
    ToolbarManager.prototype.switchTools = [];

    /**
    * 工具控制器集合 {Array}
    */
    ToolbarManager.prototype.controllers = [];

    /**
    * 向工具栏管理器中添加工具
    * @param toolName {String} 工具名称
    * @param tool {GeneralTool|SwitchTool} 工具对象
    */
    ToolbarManager.prototype.addTool = function (toolName, tool) {
        if (!toolName || !tool) return;

        this[toolName] = tool; // 创建工具对象
        this[toolName].parent = this; // 指定工具栏管理器为父级

        // 将工具对象划分进对应的工具集合中
        if (tool instanceof SwitchTool) {
            this.switchTools.push(tool);
        }
        else {
            this.generalTools.push(tool);
        }
    };

    /**
    * 为工具绑定页面元素（控制器）
    * @param targetTool {String} 要进行绑定的可视化工具中的属性
    * @param elementId {String} 页面元素id
    * @param elementEvent {String} 作为触发器的页面元素事件
    * @param param {String} 输入参数，可能为固定值，也可能为对应页面元素的属性，需要时设置
    * @param isParamProperty {Boolean} 输入参数是否为页面元素的属性，需要时设置
    * @param converter {Function} 数据转换函数，用于转换输入参数，需要时设置
    * @param callBack {Function} 回调函数，功能处理完毕的回调方法，需要时设置
    */
    ToolbarManager.prototype.bindHtmlController = function (targetTool, elementId, elementEvent, param,
        isParamProperty, converter, callBack) {
        if (!targetTool || !elementId || !elementEvent) return;

        // 创建控制器对象
        var controller = {
            targetTool: targetTool,
            elementId: elementId,
            elementEvent: elementEvent,
            param: param,
            isParamProperty: isParamProperty,
            converter: converter,
            callBack: callBack,
        };

        // 判定控制器是否合法
        var isControllerValid = this.isControllerValid(controller);
        if (!isControllerValid) return;

        // 为目标工具添加控制器
        var tool = this[controller.targetTool];
        this.addControllerForTool(controller, tool);

        // 将控制器对象添加至集合中
        this.controllers.push(controller);
    };

    /**
    * 判定控制器是否合法
    * @param controller {Object} 需要判定的控制器对象
    * @return {Boolean} true：合法；false：非法
    */
    ToolbarManager.prototype.isControllerValid = function (controller) {
        if (!controller) return false;

        // 页面元素不存在时，非法
        var elementId = controller.elementId;
        var element = document.getElementById(elementId);
        if (!element) return false;

        // 目标工具不存在时，非法
        var tool = this[controller.targetTool];
        if (!tool) return false;

        // 页面元素属性不存在时，非法
        if (controller.isParamProperty && !controller.param in element) return false;

        // 页面元素已经存在于其他控制器对象中时，非法
        var length = this.controllers.length;
        for (var i = 0; i < length; i++) {
            if (elementId === this.controllers[i].elementId) return false;
        }

        return true;
    };

    /**
    * 为工具栏工具添加控制器
    * @param controller {Object} 控制器对象
    * @param targetTool {GeneralTool|SwitchTool} 目标工具对象
    */
    ToolbarManager.prototype.addControllerForTool = function (controller, targetTool) {
        if (!controller || !targetTool) return;

        var elementEvent = controller.elementEvent;
        var element = document.getElementById(controller.elementId); // 获取功能对应的页面元素
        var eventListener = null; //页面元素对应的事件监听器

        eventListener = (function (controller) {
            return function () {
                var elementId = controller.elementId;
                var elementEvent = controller.elementEvent;
                var param = controller.param;
                var isParamProperty = controller.isParamProperty;
                var converter = controller.converter;
                var callBack = controller.callBack;

                // 获取功能对应的页面元素
                var element = document.getElementById(elementId);

                // 获取数据转换函数的参数
                var listenerParam = isParamProperty ? element[param] : param;

                // 执行数据转换函数，获取结果，若转换函数不存在，则直接返回参数
                var value = converter ? converter(listenerParam) : listenerParam;

                // 可视化工具设置为繁忙状态
                targetTool.parent.visualizationTool.isBusy = true;

                // 工具启动执行
                targetTool.doExcute(value);

                // 可视化工具取消繁忙状态
                targetTool.parent.visualizationTool.isBusy = false;

                // 执行回调函数
                callBack && callBack(targetTool);
            }
        })(controller);

        // 为页面元素的事件添加对应的事件监听器，当事件触发时，工具启动执行
        element.addEventListener(elementEvent, eventListener);
    };

    //#endregion 工具栏管理器

    //#region 一般工具

    /**
    * 一般工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function GeneralTool(visualizationTool) {
        if (!visualizationTool) return;

        this.visualizationTool = visualizationTool;
        this.diagram = visualizationTool.diagram;
    };

    /**
    * 可视化工具 {VisualizationTool}
    */
    GeneralTool.prototype.visualizationTool = null;

    /**
    * 主视图 {go.Diagram}
    */
    GeneralTool.prototype.diagram = null;

    /**
    * 父级元素 {ToolbarManager}
    */
    GeneralTool.prototype.parent = null;

    /**
    * 工具是否可用 {Boolean}
    */
    GeneralTool.prototype.isEnabled = true;

    /**
    * 工具启动执行
    */
    GeneralTool.prototype.doExcute = function () {
        if (!this.isEnabled) return;
    };

    //#endregion 一般工具

    //#region 开关工具

    /**
    * 开关工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function SwitchTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 开关工具继承一般工具的所有属性和方法
    go.Diagram.inherit(SwitchTool, GeneralTool);

    /**
    * 工具是否激活 {Boolean}
    */
    GeneralTool.prototype.isActive = false;

    /**
    * 工具所属组织 {String}
    */
    SwitchTool.prototype.group = null;

    /**
    * 工具启动执行（override），执行相关的工具激活处理或工具失效处理
    */
    SwitchTool.prototype.doExcute = function () {
        if (!this.isEnabled) return;

        // 改变激活状态
        this.isActive = !this.isActive;

        if (this.isActive) {
            // 使同组其他工具失效
            this.disableOtherToolsInGroup();
            // 执行工具激活处理
            this.doActivate();
        }
        else {
            // 执行工具失效处理
            this.doDeactivate();
        }
    };

    /**
    * 手动使工具激活，执行相关的工具激活处理
    */
    SwitchTool.prototype.doSwitchOn = function () {
        if (!this.isEnabled) return;

        this.isActive = true;
        this.disableOtherToolsInGroup();
        this.doActivate();
    };

    /**
    * 手动使工具失效，执行相关的工具失效处理
    */
    SwitchTool.prototype.doSwitchOff = function () {
        if (!this.isEnabled) return;

        this.isActive = false;
        this.doDeactivate();
    };

    /**
    * 工具激活处理
    */
    SwitchTool.prototype.doActivate = function () {

    };

    /**
    * 工具失效处理
    */
    SwitchTool.prototype.doDeactivate = function () {

    };

    /**
    * 使同组其他工具失效
    */
    SwitchTool.prototype.disableOtherToolsInGroup = function () {
        if (!this.parent || !this.group) return;

        var toolbarManager = this.parent;
        var switchTools = toolbarManager.switchTools;
        var currentGroup = this.group;
        var currentToolName = this.constructor.name;
        var length = switchTools.length;

        for (var i = 0; i < length; i++) {
            var tool = switchTools[i];
            var toolName = tool.constructor.name;

            // 当某一个开关工具处于激活状态，且与当前工具同组，且非当前工具本身时，手动使该工具失效
            if (tool.isActive === true && currentGroup === tool.group && currentToolName !== toolName) {
                tool.doSwitchOff();
            }
        }
    };

    //#endregion 开关工具

    //#region 颜色配置工具

    /**
    * 颜色配置工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function ColorConfigTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 颜色配置工具继承一般工具的所有属性和方法
    go.Diagram.inherit(ColorConfigTool, GeneralTool);

    ColorConfigTool.Green = "green"; // 绿色
    ColorConfigTool.Royalblue = "royalblue"; // 蓝色
    ColorConfigTool.Plum = "plum"; // 紫色
    ColorConfigTool.Orange = "orange"; // 橙色
    ColorConfigTool.Burlywood = "burlywood"; // 棕色
    ColorConfigTool.Gradient = "gradient"; // 渐变色
    ColorConfigTool.Transparent = "transparent" // 透明色
    ColorConfigTool.White = "white" // 白色

    /**
    * 工具启动执行（override）
    * @param color {String} 所选颜色
    */
    ColorConfigTool.prototype.doExcute = function (color) {
        if (!this.isEnabled) return;

        var model = this.diagram.currentModel;

        this.diagram.startTransaction("ColorConfigTool");

        model.eachNode(function (data) {
            if (data.isSelected) {
                model.setDataProperty(data, "color", color);
            }
        });

        this.diagram.commitTransaction("ColorConfigTool");
    };

    //#endregion 颜色配置工具

    //#region 图形配置工具

    /**
    * 图形配置工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function ShapeConfigTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 图形配置工具继承一般工具的所有属性和方法
    go.Diagram.inherit(ShapeConfigTool, GeneralTool);

    ShapeConfigTool.Rectangle = "Rectangle"; // 矩形
    ShapeConfigTool.Ellipse = "Ellipse"; // 椭圆形
    ShapeConfigTool.Pentagon = "Pentagon"; // 五角形
    ShapeConfigTool.Cloud = "Cloud"; // 云型

    /**
    * 工具启动执行（override）
    * @param shape {String} 所选图形
    */
    ShapeConfigTool.prototype.doExcute = function (shape) {
        if (!this.isEnabled) return;

        var model = this.diagram.currentModel;

        this.diagram.startTransaction("ShapeConfigTool");

        model.eachNode(function (data) {
            if (data.isSelected) {
                model.setDataProperty(data, "shape", shape);
            }
        });

        this.diagram.commitTransaction("ShapeConfigTool");
    };

    //#endregion 图形配置工具

    //#region 布局配置工具

    /**
    * 布局配置工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function LayoutConfigTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 布局配置工具继承一般工具的所有属性和方法
    go.Diagram.inherit(LayoutConfigTool, GeneralTool);

    LayoutConfigTool.Tree = "TreeLayout"; // 树形布局
    LayoutConfigTool.Circular = "CircularLayout"; // 环形布局
    LayoutConfigTool.ForceDirected = "ForceDirectedLayout"; // 力导向布局
    LayoutConfigTool.LayeredDigraph = "LayeredDigraphLayout"; // 分层有向布局
    LayoutConfigTool.Grid = "GridLayout"; // 网格布局

    /**
    * 工具启动执行（override）
    */
    LayoutConfigTool.prototype.doExcute = function (layoutName) {
        if (!this.isEnabled) return;

        this.diagram.startTransaction("LayoutConfigTool");

        var currentLayout = null;
        var allowVirtualize = this.visualizationTool.allowVirtualize;

        switch (layoutName) {
            case LayoutConfigTool.Tree:
                // 树形布局
                currentLayout = allowVirtualize ? LayoutManager.VirtualizedTreeLayout : LayoutManager.TreeLayout;
                break;
            case LayoutConfigTool.Circular:
                // 环形布局
                currentLayout = allowVirtualize ? LayoutManager.VirtualizedCircularLayout : LayoutManager.CircularLayout;
                break;
            case LayoutConfigTool.ForceDirected:
                // 力导向布局
                currentLayout =
                    allowVirtualize ? LayoutManager.VirtualizedForceDirectedLayout : LayoutManager.ForceDirectedLayout;
                break;
            case LayoutConfigTool.LayeredDigraph:
                // 分层有向布局（无虚拟布局）
                currentLayout = LayoutManager.LayeredDigraphLayout;
                break;
            case LayoutConfigTool.Grid:
                // 网格布局
                currentLayout = allowVirtualize ? LayoutManager.VirtualizedGridLayout : LayoutManager.GridLayout;
                break;
            default:
                break;
        }

        if (currentLayout) {
            //currentLayout.isInitial = true; // 布局进行初始化
            //currentLayout.isOngoing = false; // 布局打乱时不自动恢复

            this.diagram.layout = currentLayout; // 设置视图布局

            // 为虚拟化布局更新视图内容
            if (visTool.allowVirtualize) {
                visTool.updateDiagramParts();
            }

            //this.diagram.rebuildParts();

            // 分层有向布局无虚拟布局，不使用固定边界
            if (currentLayout instanceof go.LayeredDigraphLayout) {
                this.diagram.fixedBounds = new go.Rect(NaN, NaN, NaN, NaN);
            }

            this.diagram.layoutDiagram(true); // 手动触发布局
        }

        this.diagram.commitTransaction("LayoutConfigTool");
    };

    //#endregion 布局配置工具

    //#region 选择配置工具

    /**
    * 选择配置工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function SelectionConfigTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 选择配置工具继承一般工具的所有属性和方法
    go.Diagram.inherit(SelectionConfigTool, GeneralTool);

    SelectionConfigTool.AllNodes = "AllNodes"; // 选择全部节点
    SelectionConfigTool.AllLinks = "AllLinks"; // 选择全部链接
    SelectionConfigTool.SameTypeNodes = "SameTypeNodes"; // 选择同类型节点
    SelectionConfigTool.SameTypeLinks = "SameTypeLinks"; // 选择同类型链接
    SelectionConfigTool.NodeRelations = "NodeRelations"; // 选择节点直接关系
    SelectionConfigTool.LinkRelations = "LinkRelations"; // 选择链接直接关系
    SelectionConfigTool.All = "All"; // 全部选择
    SelectionConfigTool.UnselectedNodes = "UnselectedNodes"; // 反向选择节点
    SelectionConfigTool.UnselectedLinks = "UnselectedLinks"; // 反向选择链接
    SelectionConfigTool.Unselected = "Unselected"; // 反向选择

    /**
    * 工具启动执行（override）
    */
    SelectionConfigTool.prototype.doExcute = function (selectWay) {
        if (!this.isEnabled) return;

        var model = this.diagram.currentModel;

        this.diagram.startTransaction("SelectionConfigTool");

        // 根据选择方式选择视图内容
        switch (selectWay) {
            // 选择全部节点
            case SelectionConfigTool.AllNodes:
                model.eachNode(function (data) {
                    if (data.isVisible && data.isNode) {
                        model.setDataProperty(data, "isSelected", true);
                    }
                });

                break;

                // 选择全部链接
            case SelectionConfigTool.AllLinks:
                model.eachLink(function (data) {
                    if (data.isVisible) {
                        model.setDataProperty(data, "isSelected", true);
                    }
                });

                break;

                // 选择同类型节点
            case SelectionConfigTool.SameTypeNodes:
                var types = new go.Set("string");

                model.eachNode(function (data) {
                    if (data.isVisible && data.isSelected && data.isNode) {
                        types.add(data.typeId);
                    }
                });

                model.eachNode(function (data) {
                    if (data.isVisible && data.isNode && types.contains(data.typeId)) {
                        model.setDataProperty(data, "isSelected", true);
                    }
                });

                break;

                // 选择同类型链接
            case SelectionConfigTool.SameTypeLinks:
                var types = new go.Set("string");

                model.eachLink(function (data) {
                    if (data.isVisible && data.isSelected) {
                        types.add(data.typeId);
                    }
                });

                model.eachLink(function (data) {
                    if (data.isVisible && types.contains(data.typeId)) {
                        model.setDataProperty(data, "isSelected", true);
                    }
                });

                break;

                // 选择节点直接关系
            case SelectionConfigTool.NodeRelations:
                var selection = new go.List("object");

                model.eachNode(function (data) {
                    if (data.isVisible && data.isSelected && data.isNode) {
                        selection.add(data);
                    }
                });

                selection.each(function (node) {
                    var links = model.findLinksConnected(node);

                    links.each(function (link) {
                        // 选中链接
                        model.setDataProperty(link, "isSelected", true);

                        // 选中链接的另一端节点
                        var otherNode = model.getOtherNode(link, node);
                        model.setDataProperty(otherNode, "isSelected", true);
                    });
                });

                break;

                // 选择链接直接关系
            case SelectionConfigTool.LinkRelations:
                model.eachLink(function (data) {
                    if (data.isVisible && data.isSelected) {
                        var from = model.findNodeDataForKey(data.fromEntityId);
                        model.setDataProperty(from, "isSelected", true);

                        var to = model.findNodeDataForKey(data.toEntityId);
                        model.setDataProperty(to, "isSelected", true);
                    }
                });

                break;

                // 反向选择节点
            case SelectionConfigTool.UnselectedNodes:
                model.eachNode(function (data) {
                    if (data.isVisible && data.isNode) {
                        model.setDataProperty(data, "isSelected", !data.isSelected);
                    }
                });

                break;

                // 反向选择链接
            case SelectionConfigTool.UnselectedLinks:
                model.eachLink(function (data) {
                    if (data.isVisible) {
                        model.setDataProperty(data, "isSelected", !data.isSelected);
                    }
                });

                break;

                // 选择全部节点和链接
            case SelectionConfigTool.All:
                model.eachNode(function (data) {
                    if (data.isVisible && data.isNode) {
                        model.setDataProperty(data, "isSelected", true);
                    }
                });

                model.eachLink(function (data) {
                    if (data.isVisible) {
                        model.setDataProperty(data, "isSelected", true);
                    }
                });

                break;

                // 反向选择节点和链接
            case SelectionConfigTool.Unselected:
                model.eachNode(function (data) {
                    if (data.isVisible && data.isNode) {
                        model.setDataProperty(data, "isSelected", !data.isSelected);
                    }
                });

                model.eachLink(function (data) {
                    if (data.isVisible) {
                        model.setDataProperty(data, "isSelected", !data.isSelected);
                    }
                });

                break;

                // 其他
            default:
                break;
        }

        // 使视图获取焦点
        this.diagram.focus();

        this.diagram.commitTransaction("SelectionConfigTool");
    };

    //#endregion 选择配置工具

    //#region 撤销操作工具

    /**
    * 撤销操作工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function UndoOperationTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 撤销操作工具继承一般工具的所有属性和方法
    go.Diagram.inherit(UndoOperationTool, GeneralTool);

    /**
    * 工具启动执行（override）
    */
    UndoOperationTool.prototype.doExcute = function () {
        if (!this.isEnabled) return;

        // 执行撤销操作，使视图恢复到上一个操作之前的状态
        this.diagram.undoManager.undo();
    };

    //#endregion 撤销操作工具

    //#region 恢复操作工具

    /**
    * 撤销操作工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function RedoOperationTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 恢复操作工具继承一般工具的所有属性和方法
    go.Diagram.inherit(RedoOperationTool, GeneralTool);

    /**
    * 工具启动执行（override）
    */
    RedoOperationTool.prototype.doExcute = function () {
        // 继承一般工具的构造函数
        if (!this.isEnabled) return;

        // 执行恢复操作，使视图恢复到下一个操作之后的状态
        this.diagram.undoManager.redo();
    };

    //#endregion 恢复操作工具

    //#region 隐藏选中部分工具

    /**
    * 隐藏选中部分工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function HideSelectedPartsTool(visualizationTool) {
        GeneralTool.apply(this, arguments);
    };

    // 隐藏选中部分工具继承一般工具的所有属性和方法
    go.Diagram.inherit(HideSelectedPartsTool, GeneralTool);

    /**
    * 工具启动执行（override）
    */
    HideSelectedPartsTool.prototype.doExcute = function () {
        if (!this.isEnabled) return;

        var model = this.diagram.currentModel;
        var map = new go.Map("string", "number"); // 组织数据集合，记录组织内的可见节点数据

        this.diagram.startTransaction("HideSelectedPartsTool");

        // 隐藏选中部分
        model.each(function (data) {
            if (data.isSelected) {
                model.setDataProperty(data, "isVisible", false);
                model.setDataProperty(data, "isSelected", false);
            }
            else {
                var groupId = data.isNode ? data.group : data.id;
                var count = data.isNode ? 1 : 0;

                if (!groupId) return;

                // 记录组织内的没有被隐藏的节点数据个数
                if (!map.contains(groupId)) {
                    map.add(groupId, count);
                }
                else {
                    map.set(groupId, map.getValue(groupId) + count);
                }
            }
        });

        // 隐藏内部可见节点数据为0的组织数据
        map.each(function (map) {
            var key = map.key;
            var value = map.value;

            if (value === 0) {
                var groupData = model.findNodeDataForKey(key);
                if (groupData && !groupData.isSelected) {
                    model.setDataProperty(groupData, "isVisible", false);
                }
            }
        });

        this.diagram.commitTransaction("HideSelectedPartsTool");
    };

    //#endregion 隐藏选中部分工具

    //#region 隐藏非选中部分工具

    /**
    * 隐藏非选中部分工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function HideUnselectedPartsTool(visualizationTool) {
        GeneralTool.apply(this, arguments);
    };

    // 隐藏非选中部分工具继承一般工具的所有属性和方法
    go.Diagram.inherit(HideUnselectedPartsTool, GeneralTool);

    /**
    * 工具启动执行（override）
    */
    HideUnselectedPartsTool.prototype.doExcute = function () {
        if (!this.isEnabled) return;

        var model = this.diagram.currentModel;
        var map = new go.Map("string", "number"); // 组织数据集合，记录组织内的可见节点数据

        this.diagram.startTransaction("HideUnselectedPartsTool");

        // 隐藏非选中部分
        model.each(function (data) {
            if (!data.isSelected && !data.isGroup) {
                model.setDataProperty(data, "isVisible", false);
                model.setDataProperty(data, "isSelected", false);
            }
            else {
                var groupId = data.isNode ? data.group : data.id;
                var count = data.isNode ? 1 : 0;

                if (!groupId) return;

                // 记录组织内的没有被隐藏的节点数据个数
                if (!map.contains(groupId)) {
                    map.add(groupId, count);
                }
                else {
                    map.set(groupId, map.getValue(groupId) + count);
                }
            }
        });

        // 隐藏内部可见节点数据为0的组织数据
        map.each(function (map) {
            var key = map.key;
            var value = map.value;

            if (value === 0) {
                var groupData = model.findNodeDataForKey(key);
                if (groupData && !groupData.isSelected) {
                    model.setDataProperty(groupData, "isVisible", false);
                }
            }
        });

        this.diagram.commitTransaction("HideUnselectedPartsTool");
    };

    //#endregion 隐藏非选中部分工具

    //#region 显示隐藏部分工具

    /**
    * 显示隐藏部分工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function ShowHiddenPartsTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 显示隐藏部分工具继承一般工具的所有属性和方法
    go.Diagram.inherit(ShowHiddenPartsTool, GeneralTool);

    /**
    * 工具启动执行（override）
    */
    ShowHiddenPartsTool.prototype.doExcute = function () {
        if (!this.isEnabled) return;

        var model = this.diagram.currentModel;

        this.diagram.startTransaction("ShowHiddenPartsTool");

        // 显示所有节点和链接
        model.each(function (data) {
            model.setDataProperty(data, "isVisible", true);
        });

        this.diagram.commitTransaction("ShowHiddenPartsTool");
    };

    //#endregion 显示隐藏部分工具

    //#region 视图适应视野工具

    /**
    * 视图适应视野工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function UniformScaleTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 视图适应视野工具继承一般工具的所有属性和方法
    go.Diagram.inherit(UniformScaleTool, GeneralTool);

    /**
    * 工具启动执行（override）
    */
    UniformScaleTool.prototype.doExcute = function () {
        if (!this.isEnabled) return;

        this.diagram.startTransaction("UniformScaleTool");

        // 视图适应视野
        this.diagram.zoomToFit();

        this.diagram.commitTransaction("UniformScaleTool");
    };

    //#endregion 视图适应视野工具

    //#region 初始化视图大小工具

    /**
    * 初始化视图大小工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function InitializeScaleTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 初始化视图大小工具继承一般工具的所有属性和方法
    go.Diagram.inherit(InitializeScaleTool, GeneralTool);

    /**
    * 工具启动执行（override）
    */
    InitializeScaleTool.prototype.doExcute = function () {
        if (!this.isEnabled) return;

        this.diagram.startTransaction("InitializeScaleTool");

        // 调整至合适大小
        this.diagram.scale = 0.7;

        this.diagram.commitTransaction("InitializeScaleTool");
    };

    //#endregion 初始化视图大小工具

    //#region 居中选择部分工具

    /**
    * 居中选择部分工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function CenterSelectionTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 居中选择部分工具继承一般工具的所有属性和方法
    go.Diagram.inherit(CenterSelectionTool, GeneralTool);

    /**
    * 工具启动执行（override）
    */
    CenterSelectionTool.prototype.doExcute = function () {
        if (!this.isEnabled) return;

        this.diagram.startTransaction("InitializeScaleTool");

        var model = this.diagram.currentModel;
        var selection = model.filter(function (data) {
            return data.isSelected;
        });

        if (selection.count > 0) {
            var data = selection.first();
            var rect = null;

            if (data.bounds) {
                rect = data.bounds;
            }
            else {
                var fromEntity = model.findNodeDataForKey(data.fromEntityId);
                var toEntity = model.findNodeDataForKey(data.toEntityId);
                var fromEntityBounds = fromEntity.bounds;
                var toEntityBounds = toEntity.bounds;

                rect = fromEntityBounds.intersectRect(toEntityBounds);
            }

            // 调整至合适大小
            this.diagram.scale = 0.7;
            // 使目标对象居中
            this.diagram.centerRect(rect);

            //this.diagram.commandHandler.scrollToPart(this.diagram.selection.first());
            //this.diagram.zoomToRect(this.diagram.selection.first().actualBounds);
        }
        //else if (selection.count > 1) {
        //    var bounds = new go.Rect();
        //    selection.each(function (data) {
        //        bounds.unionRect(data.bounds);
        //    });

        //    this.diagram.zoomToRect(bounds);
        //    this.diagram.centerRect(bounds);
        //}

        this.diagram.commitTransaction("InitializeScaleTool");
    };

    //#endregion 居中选择部分工具

    //#region 集中分析选择部分工具

    /**
    * 集中分析选择部分工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function AnalysisSelectionTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 集中分析选择部分工具继承一般工具的所有属性和方法
    go.Diagram.inherit(AnalysisSelectionTool, GeneralTool);

    /**
    * 工具启动执行（override）
    */
    AnalysisSelectionTool.prototype.doExcute = function () {
        if (!this.isEnabled) return;

        this.diagram.startTransaction("AnalysisSelectionTool");

        // 获取所有选中节点
        var selectedNodes = new go.Set();
        this.diagram.selection.each(function (obj) {
            if (obj instanceof go.Node) {
                selectedNodes.add(obj);
            }
        });

        if (selectedNodes.count === 0) return;

        // 获取选中节点所在关系树中的所有节点
        var nodesInTree = new go.List(go.Node);
        var iterator = selectedNodes.iterator;
        while (iterator.next()) {
            var node = iterator.value;
            // 寻找选中节点所在关系树中的所有节点
            this.findNodesInTree(node, nodesInTree);
        }

        if (nodesInTree.count === 0) return;

        // 遍历整个视图的节点，显示关联节点，隐藏非关联节点
        this.diagram.nodes.each(function (node) {
            if (nodesInTree.contains(node)) {
                node.visible = true;
            } else {
                node.visible = false;
            }
        });

        this.diagram.commitTransaction("AnalysisSelectionTool");
    };

    /**
    * 寻找在关系树中的所有节点
    * @param node {String} 原始节点
    * @param nodesInTree {GeneralTool|SwitchTool} 关系树中的节点集合
    */
    AnalysisSelectionTool.prototype.findNodesInTree = function (node, nodesInTree) {
        if (!node || !nodesInTree) return;

        // 将原始节点加入关系树节点集合
        nodesInTree.add(node);

        // 获取与原始节点相关联的所有节点
        var nodesConnected = node.findNodesConnected();

        // 遍历关联节点集合，递归法寻找下一层关系中节点
        var iterator = nodesConnected.iterator;
        while (iterator.next()) {
            var connectedNode = iterator.value;
            if (!nodesInTree.contains(connectedNode)) {
                // 寻找在关系树中的所有节点
                this.findNodesInTree(connectedNode, nodesInTree);
            }
        }
    };

    //#endregion 集中分析选择部分工具

    //#region 改变视图缩放比例工具

    /**
    * 改变视图缩放比例工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function ChangeScaleTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 改变视图缩放比例工具继承一般工具的所有属性和方法
    go.Diagram.inherit(ChangeScaleTool, GeneralTool);

    /**
    * 工具启动执行（override）
    */
    ChangeScaleTool.prototype.doExcute = function (scale) {
        if (!this.isEnabled) return;

        // 设置视图缩放比例
        this.diagram.scale = scale;
    };

    //#endregion 改变视图缩放比例工具

    //#region 恢复视图当前布局工具

    /**
    * 恢复视图当前布局工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function InitializeLayoutTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 恢复视图当前布局工具继承一般工具的所有属性和方法
    go.Diagram.inherit(InitializeLayoutTool, GeneralTool);

    /**
    * 工具启动执行（override）
    */
    InitializeLayoutTool.prototype.doExcute = function () {
        if (!this.isEnabled) return;

        this.diagram.startTransaction("InitializeLayoutTool");

        // 为虚拟化布局更新视图内容
        if (visTool.allowVirtualize) {
            visTool.updateDiagramParts();
        }

        //this.diagram.rebuildParts();

        // 按当前布局类型重新对视图进行布局
        this.diagram.layoutDiagram(true);

        // 虚拟化布局时，手动计算视图边界
        //if (this.diagram.layout.isVirtualized) {
        //    this.diagram.computeFixedBounds();
        //}

        this.diagram.commitTransaction("InitializeLayoutTool");
    };

    //#endregion 恢复视图当前布局工具

    //#region 文本检索工具

    /**
    * 文本检索工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function SearchTextTool(visualizationTool) {
        // 继承一般工具的构造函数
        GeneralTool.apply(this, arguments);
    };

    // 文本检索工具继承一般工具的所有属性和方法
    go.Diagram.inherit(SearchTextTool, GeneralTool);

    /**
    * 当前检索文本 {String}
    */
    SearchTextTool.prototype.currentText = null;

    /**
    * 检索结果集合 {Array}
    */
    SearchTextTool.prototype.searchResults = [];

    /**
    * 检索索引 {Array} 用于显示检索结果集合中对应索引的元素
    */
    SearchTextTool.prototype.searchIndex = 0;

    /**
    * 工具启动执行（override）
    * @param text {String} 检索用文本
    */
    SearchTextTool.prototype.doExcute = function (text) {
        if (!this.isEnabled) return;

        // 检索内容为空时，初始化参数
        if (!text) {
            this.currentText = null;
            this.searchResults = [];
            this.searchIndex = -1;
        }
            // 检索内容改变时，重新检索
        else if (this.currentText !== text) {
            this.currentText = text;
            this.searchResults = [];
            this.searchIndex = 0;

            // 遍历节点数据，获取匹配数据
            var nodeDataArray = this.diagram.currentModel.nodeDataArray;
            var nodeDataArrayLength = nodeDataArray.length;
            for (var i = 0; i < nodeDataArrayLength; i++) {
                var data = nodeDataArray[i];
                if (!data.isVisible || !data.propertyValues) continue;

                var propertyValues = data.propertyValues;

                for (var j = 0; j < propertyValues.length; j++) {
                    var property = propertyValues[j];

                    // 属性显示，且属性值包含检索文本时，将该数据放进检索结果集合中
                    if (!property.isHidden && property.value.indexOf(this.currentText) >= 0) {
                        this.searchResults.push(data);
                        break;
                    }
                }
            }

            // 遍历链接数据，获取匹配数据
            var linkDataArray = this.diagram.currentModel.linkDataArray;
            var linkDataArrayLength = linkDataArray.length;
            for (var i = 0; i < linkDataArrayLength; i++) {
                var data = linkDataArray[i];
                if (!data.isVisible || !data.propertyValues) continue;

                var propertyValues = data.propertyValues;

                for (var j = 0; j < propertyValues.length; j++) {
                    var property = propertyValues[j];

                    // 属性显示，且属性值包含检索文本时，将该数据放进检索结果集合中
                    if (!property.isHidden && property.value.indexOf(this.currentText) >= 0) {
                        this.searchResults.push(data);
                        break;
                    }
                }
            }

            // 无检索结果时，初始化检索索引
            if (this.searchResults.length === 0) {
                this.searchIndex = -1;
            }
        }
            // 检索内容未改变时，显示下一个检索结果内容
        else if (this.searchIndex >= 0) {
            this.searchIndex++;
        }

        // 清空视图选中项
        this.diagram.currentModel.clearSelection();

        if (this.searchResults.length > 0) {
            // 索引位置为最后一个时，索引位置设置为第一个
            if (this.searchResults.length <= this.searchIndex) {
                this.searchIndex = 0;
            }

            // 获取检索索引对应的数据
            var data = this.searchResults[this.searchIndex];

            // 选中检索数据
            this.diagram.currentModel.select(data);

            // 在视图中居中选中项
            this.diagram.visualizationTool.toolbarManager.centerSelectionTool.doExcute();
        }
    };

    //#endregion 文本检索工具

    //#region 显示全景视图工具

    /**
    * 显示全景视图工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    * @param overviewTool {OverviewTool} 全景视图工具
    */
    function ShowOverviewTool(visualizationTool, overviewTool) {
        if (!visualizationTool || !overviewTool) return;

        // 继承开关工具的构造函数
        SwitchTool.call(this, visualizationTool);

        // 获取全景视图工具
        this.overviewTool = overviewTool;
        // 设置全景视图工具的显示状态为不显示
        this.overviewTool.visible = false;
    };

    // 显示全景视图工具继承开关工具的所有属性和方法
    go.Diagram.inherit(ShowOverviewTool, SwitchTool);

    /**
    * 全景视图工具 {OverviewTool}
    */
    ShowOverviewTool.prototype.overviewTool = null;

    /**
    * 工具激活处理（override）
    */
    ShowOverviewTool.prototype.doActivate = function () {
        if (!this.overviewTool) return;

        // 指定全景视图的监视视图
        if (!this.overviewTool.diagram) {
            this.overviewTool.diagram = this.diagram;
        }

        // 显示全景视图
        this.overviewTool.visible = true;
        // 刷新全景视图（防止第一次显示时的空白现象）
        this.overviewTool.overview.rebuildParts();
    };

    /**
    * 工具失效处理（override）
    */
    ShowOverviewTool.prototype.doDeactivate = function () {
        if (!this.overviewTool) return;

        // 隐藏全景视图
        this.overviewTool.visible = false;
        // 停止监视视图
        this.overviewTool.diagram = null;
    };

    //#endregion 显示全景视图工具

    //#region 显示放大镜工具

    /**
    * 显示放大镜工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    * @param magnifierTool {MagnifierTool} 放大镜工具
    */
    function ShowMagnifierTool(visualizationTool, magnifierTool) {
        if (!visualizationTool || !magnifierTool) return;

        // 继承开关工具的构造函数
        SwitchTool.call(this, visualizationTool);

        this.magnifierTool = magnifierTool;
        this.magnifierTool.visible = false;
        this.magnifierTool.isActive = false;
    };

    // 显示放大镜工具继承开关工具的所有属性和方法
    go.Diagram.inherit(ShowMagnifierTool, SwitchTool);

    /**
    * 放大镜工具 {MagnifierTool}
    */
    ShowMagnifierTool.prototype.magnifierTool = null

    /**
    * 工具激活处理（override）
    */
    ShowMagnifierTool.prototype.doActivate = function () {
        if (!this.magnifierTool) return;

        // 指定放大镜的监视视图
        if (!this.magnifierTool.diagram) {
            this.magnifierTool.diagram = this.diagram;
        }

        // 激活全景视图
        this.magnifierTool.isActive = true;
    };

    /**
    * 工具失效处理（override）
    */
    ShowMagnifierTool.prototype.doDeactivate = function () {
        if (!this.magnifierTool) return;

        // 使全景视图失效
        this.magnifierTool.isActive = false;
        // 隐藏全景视图
        this.magnifierTool.visible = false;

        // 允许更新视图元素显示状态
        this.visualizationTool.allowChangeTemplateForScale = true;
        // 更新视图上的节点和链接的子元素显示状态
        this.visualizationTool.updateSubPartsVisibility();
    };

    //#endregion 显示放大镜工具

    //#region 显示网格工具

    /**
    * 显示网格工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function ShowGridLineTool(visualizationTool) {
        // 继承开关工具的构造函数
        SwitchTool.call(this, visualizationTool);
    };

    // 显示网格工具继承开关工具的所有属性和方法
    go.Diagram.inherit(ShowGridLineTool, SwitchTool);

    /**
    * 工具激活处理（override）
    */
    ShowGridLineTool.prototype.doActivate = function () {
        // 显示网格
        this.diagram.grid.visible = true;
        // 使节点以网格为单位移动
        this.diagram.toolManager.draggingTool.isGridSnapEnabled = true;
    };

    /**
    * 工具失效处理（override）
    */
    ShowGridLineTool.prototype.doDeactivate = function () {
        // 隐藏网格
        this.diagram.grid.visible = false;
        // 使节点平滑移动
        this.diagram.toolManager.draggingTool.isGridSnapEnabled = false;
    };

    //#endregion 显示网格工具

    //#region 显示节点重要度工具

    /**
    * 显示节点重要度工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function ShowImportanceTool(visualizationTool) {
        // 继承开关工具的构造函数
        SwitchTool.call(this, visualizationTool);
    };

    // 显示节点重要度工具继承开关工具的所有属性和方法
    go.Diagram.inherit(ShowImportanceTool, SwitchTool);

    /**
    * 工具激活处理（override）
    */
    ShowImportanceTool.prototype.doActivate = function () {
        // 允许改变节点缩放比例
        CustomNode.prototype.rescalable = true;

        // 更新节点的缩放比例
        this.diagram.nodes.each(function (obj) {
            obj.computeScale();
        });
    };

    /**
    * 工具失效处理（override）
    */
    ShowImportanceTool.prototype.doDeactivate = function () {
        // 不允许改变节点缩放比例
        CustomNode.prototype.rescalable = false;

        // 更新节点的缩放比例
        this.diagram.nodes.each(function (obj) {
            obj.computeScale();
        });
    };

    //#endregion 显示节点重要度工具

    //#region 框选缩放工具

    /**
    * 框选缩放工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function BoxZoomTool(visualizationTool) {
        // 继承开关工具的构造函数
        SwitchTool.call(this, visualizationTool);

        // 创建拖拽缩放工具
        this.dragZoomingTool = this.createBoxZoomTool();
    };

    // 框选缩放工具继承开关工具的所有属性和方法
    go.Diagram.inherit(BoxZoomTool, SwitchTool);

    /**
    * 拖拽缩放工具 {DragZoomingTool}
    */
    SwitchTool.prototype.dragZoomingTool = null;

    /**
    * 创建拖拽缩放工具
    * @return {DragZoomingTool} 拖拽缩放工具
    */
    BoxZoomTool.prototype.createBoxZoomTool = function () {
        var dragZoomingTool = new DragZoomingTool(); // 创建拖拽缩放工具

        // 启用拖拽缩放工具
        dragZoomingTool.isEnabled = false;
        // 将拖拽缩放工具添加至视图的鼠标移动工具集合中
        this.diagram.toolManager.mouseMoveTools.insertAt(2, dragZoomingTool);

        return dragZoomingTool;
    };

    /**
    * 工具激活处理（override）
    */
    BoxZoomTool.prototype.doActivate = function () {
        // 启用拖拽缩放工具
        this.dragZoomingTool.isEnabled = true;
    };

    /**
    * 工具失效处理（override）
    */
    BoxZoomTool.prototype.doDeactivate = function () {
        // 停用拖拽缩放工具
        this.dragZoomingTool.isEnabled = false;
    };

    //#endregion 框选缩放工具

    //#region 高亮直接关系工具

    /**
    * 高亮直接关系工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function HighlightRelationTool(visualizationTool) {
        // 继承开关工具的构造函数
        SwitchTool.call(this, visualizationTool);

        // 为视图元素添加监听器
        this.addEventListener();
    };

    // 高亮直接关系工具继承开关工具的所有属性和方法
    go.Diagram.inherit(HighlightRelationTool, SwitchTool);

    /**
    * 为视图元素添加监听器
    */
    HighlightRelationTool.prototype.addEventListener = function () {
        // 为节点添加鼠标进入事件的监听器，用于高亮直接关系
        this.visualizationTool.addEventListenerForParts("mouseEnter", "highlightRelations", this);
        // 为节点添加鼠标离开事件的监听器，用于取消高亮
        this.visualizationTool.addEventListenerForParts("mouseLeave", "cancelHighlights", this);
    };

    /**
    * 工具激活处理（override）
    */
    HighlightRelationTool.prototype.doActivate = function () {
        // 清空视图中的所有高亮元素
        this.diagram.clearHighlighteds();
        // 清空视图中的所有选中状态
        this.diagram.clearSelection();
    };

    /**
    * 工具失效处理（override）
    */
    HighlightRelationTool.prototype.doDeactivate = function () {
        // 清空视图中的所有高亮元素
        this.diagram.clearHighlighteds();

        // 所有节点文本恢复显示
        var iterator = this.diagram.nodes.iterator;
        while (iterator.next()) {
            var part = iterator.value;
            this.setTextVisibility(part, true);
        }

        // 所有链接文本恢复显示
        var iterator = this.diagram.links.iterator;
        while (iterator.next()) {
            var part = iterator.value;
            this.setTextVisibility(part, true);
        }
    };

    /**
    * 高亮节点的直接关系
    * @param event {go.InputEvent} 输入事件
    * @param node {go.Node} 目标节点
    */
    HighlightRelationTool.prototype.highlightRelations = function (event, node) {
        if (!this.isEnabled || !this.isActive || !node.diagram || node instanceof go.Group) return;

        // 清空视图中的所有高亮元素
        this.diagram.clearHighlighteds();

        // 隐藏视图中的所有节点文本
        var iterator = this.diagram.nodes.iterator;
        while (iterator.next()) {
            var part = iterator.value;
            this.setTextVisibility(part, false);
        }

        // 隐藏视图中的所有链接文本
        var iterator = this.diagram.links.iterator;
        while (iterator.next()) {
            var part = iterator.value;
            this.setTextVisibility(part, false);
        }

        // 高亮节点本身
        node.isHighlighted = true;
        // 显示节点的文本
        this.setTextVisibility(node, true);

        // 高亮节点的直接关系
        var iterator = node.linksConnected.iterator;
        while (iterator.next()) {
            var link = iterator.value;
            if (link.isVisible()) {
                // 高亮与节点有关的链接关系
                this.highlightLinkRelation(link, true);

                // 显示与节点有关的链接文本
                this.setTextVisibility(link, true);

                // 获取另一端的节点
                var otherNode = link.getOtherNode(node);
                // 显示链接的另一端节点的文本
                this.setTextVisibility(otherNode, true);
            }
        }
    };

    /**
    * 设置文本的显示状态
    *
    * @param part {go.Node||go.Link} 目标节点或链接
    * @param isVisible {Boolean} 文本是否显示
    */
    HighlightRelationTool.prototype.setTextVisibility = function (part, isVisible) {
        if (!part || part instanceof go.Group) return;

        // 改变节点或链接的透明度
        part.opacity = isVisible ? 1 : 0.2;
        // 获取文本面板
        textPanel = part.findObject("TEXT_LIST_PANEL");
        // 改变文本面板的显示状态状态
        if (textPanel) {
            textPanel.opacity = isVisible ? 1 : 0;
        }
    };

    /**
    * 设置链接以及链接两端节点的高亮状态
    * @param link {go.Link} 目标链接
    * @param isHighlighted {Boolean} 链接是否高亮
    */
    HighlightRelationTool.prototype.highlightLinkRelation = function (link, isHighlighted) {
        if (!link) return;

        // 设置链接的高亮状态
        link.isHighlighted = isHighlighted;
        // 设置链接起始节点的高亮状态
        link.fromNode.isHighlighted = isHighlighted;
        // 设置链接到达节点的高亮状态
        link.toNode.isHighlighted = isHighlighted;
    };

    /**
    * 取消节点直接关系的高亮状态，所有链接文本恢复显示
    * @param event {go.InputEvent} 输入事件
    * @param node {go.Node} 目标节点
    */
    HighlightRelationTool.prototype.cancelHighlights = function (event, node) {
        if (!this.isEnabled || !this.isActive) return;

        // 清空视图中的所有高亮元素
        this.diagram.clearHighlighteds();

        // 所有节点文本恢复显示
        var iterator = this.diagram.nodes.iterator;
        while (iterator.next()) {
            var part = iterator.value;
            this.setTextVisibility(part, true);
        }

        // 所有链接文本恢复显示
        var iterator = node.diagram.links.iterator;
        while (iterator.next()) {
            var part = iterator.value;
            this.setTextVisibility(part, true);
        }
    };

    //#endregion 高亮直接关系工具

    //#region 路径分析工具

    /**
    * 路径分析工具的构造函数
    * @param visualizationTool {VisualizationTool} 可视化工具
    */
    function AnalysisPathTool(visualizationTool) {
        // 继承开关工具的构造函数
        SwitchTool.call(this, visualizationTool);

        // 为视图元素添加监听器
        this.addEventListener();
    };

    // 路径分析工具继承开关工具的所有属性和方法
    go.Diagram.inherit(AnalysisPathTool, SwitchTool);

    /**
    * 最短路径集合 {go.List}
    */
    AnalysisPathTool.prototype.paths = null;

    /**
    * 起始节点数据 {Object}
    */
    AnalysisPathTool.prototype.startNodeData = null;

    /**
    * 到达节点数据 {Object}
    */
    AnalysisPathTool.prototype.endNodeData = null;

    /**
    * 是否在分析中 {Boolean}
    */
    AnalysisPathTool.prototype.isInAnalysis = false;

    /**
    * 为视图元素添加监听器
    */
    AnalysisPathTool.prototype.addEventListener = function () {
        // 为节点添加选择改变事件的监听器，用于路径分析功能
        this.visualizationTool.addEventListenerForParts("selectionChanged", "analysisPath", this);
    };

    /**
    * 工具激活处理（override）
    */
    AnalysisPathTool.prototype.doActivate = function () {
        this.diagram.startTransaction("AnalysisPathTool");

        // 清空视图中的所有高亮状态
        this.diagram.currentModel.clearHighlighteds();
        // 清空视图中的所有选中状态
        this.diagram.currentModel.clearSelection();

        // 监听鼠标选择事件（注意该事件触发时，鼠标所在的视图部分尚未被选中）
        this.diagram.toolManager.clickSelectingTool.standardMouseSelect = function () {
            var diagram = this.diagram;
            if (diagram === null || !diagram.allowSelect) return;

            var e = diagram.lastInput;
            var count = diagram.currentModel.getSelection().count;
            var object = diagram.findPartAt(e.documentPoint, false); // 获取鼠标位置的视图元素
            var analysisPathTool = diagram.visualizationTool.toolbarManager.analysisPathTool;

            this.diagram.startTransaction("standardMouseSelect");

            // 视图元素存在时
            if (object !== null) {
                // 选中项小于2且选中项为节点时，该视图元素设置为选中状态
                if (count < 2 && object instanceof go.Node) {
                    if (!object.isSelected) {
                        if (!analysisPathTool.startNodeData) {
                            analysisPathTool.startNodeData = object.data;
                        }
                        else {
                            analysisPathTool.endNodeData = object.data;
                        }

                        object.isSelected = true;
                    }
                }
                    // 其他情况，只选中该视图元素（清除其他已选中项）
                else {
                    if (!object.isSelected) {
                        analysisPathTool.startNodeData = object.data;
                        analysisPathTool.endNodeData = null;

                        // 只选中该视图元素
                        diagram.currentModel.select(object.data);
                    }
                }
                // 鼠标点击处不存在视图元素时
            }
            else if (e.left && !(e.control || e.meta) && !e.shift) {
                analysisPathTool.startNodeData = null;
                analysisPathTool.endNodeData = null;

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
    AnalysisPathTool.prototype.doDeactivate = function () {
        this.diagram.startTransaction("AnalysisPathTool");

        this.startNodeData = null;
        this.endNodeData = null;

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
    * 以起始节点为原点，获取所有节点的相对距离
    * @param node {go.Node} 当前改变选中状态的节点
    */
    AnalysisPathTool.prototype.analysisPath = function () {
        if (!this.isEnabled || !this.isActive) return;

        this.diagram.startTransaction("AnalysisPathTool");

        var startNode = this.startNodeData; // 获取起始节点
        var endNode = this.endNodeData; // 获取结束节点

        if (startNode && endNode && !this.isInAnalysis) {
            this.visualizationTool.isBusy = true;
            this.isInAnalysis = true; // 开始分析

            // 清空视图中的所有选中状态
            this.diagram.currentModel.clearSelection();

            // 获取所有节点的相对距离
            var distances = this.getAllDistances(startNode);
            // 获取所有路径
            this.getAllPaths(startNode, endNode, distances);

            // 高亮所有的最短路径
            if (this.paths.count > 0) {
                var iterator = this.paths.iterator;
                while (iterator.next()) {
                    var path = iterator.value;

                    // 高亮路径(现阶段只显示路径集合中的最后一条)
                    this.highlightPath(path);
                }
            }

            this.isInAnalysis = false; // 结束分析
            this.visualizationTool.isBusy = false;
        }

        this.diagram.commitTransaction("AnalysisPathTool");
    };

    /**
    * 以起始节点为原点，获取所有节点的相对距离
    * @param startNode {go.Node} 起始节点
    * @return {go.Map} 节点距离集合
    */
    AnalysisPathTool.prototype.getAllDistances = function (startNode) {
        if (!startNode) return;

        var model = this.diagram.currentModel; // 获取主视图
        var distances = new go.Map("object", "number"); // 创建距离集合
        var standbyNodes = new go.Set("object"); // 待分析（已知距离，但尚未开始分析节点的下一层）节点集合
        var finishedNodes = new go.Set("object"); // 分析完成（开始或完成分析节点的下一层）节点集合

        // 所有节点的距离初始化为无限大
        model.eachNode(function (nodeData) {
            distances.add(nodeData, Infinity);
        });

        // 起始节点的距离设为0
        distances.add(startNode, 0);
        // 将起始节点放进待分析节点集合
        standbyNodes.add(startNode);

        // 分析待分析节点集合中的节点，直至该集合为空
        while (standbyNodes.count > 0) {
            var currentNode = this.getLeastDistanceNode(standbyNodes, distances); // 获取集合中距离最近的节点, 作为当前分析节点
            var currentDistance = distances.getValue(currentNode); // 获取当前分析节点的距离
            var nextDistance = currentDistance + 1; // 获取下一层节点所对应的距离

            // 从待分析节点集合中移除距离最近的节点
            standbyNodes.remove(currentNode);
            // 将距离最近节点加入分析完成节点集合中
            finishedNodes.add(currentNode);

            // 开始分析距离最近节点的下一层关系
            var links = model.findLinksConnected(currentNode).iterator;
            while (links.next()) {
                var link = links.value;
                if (!link.isVisible) continue;

                // 获取当前关系的邻节点
                var neighborNode = model.getOtherNode(link, currentNode);
                // 若邻节点已被分析，则跳过
                if (finishedNodes.contains(neighborNode)) continue;

                // 获取当前关系的邻节点距离
                var neighborDistance = distances.getValue(neighborNode);

                // 下一层距离小于邻节点距离时，重新设置邻节点距离
                if (nextDistance < neighborDistance) {
                    distances.add(neighborNode, nextDistance);

                    // 邻节点距离为无限大（不在待分析节点集合中）时，则加入待分析节点集合
                    if (neighborDistance === Infinity) {
                        standbyNodes.add(neighborNode);
                    }
                }
            }
        }

        return distances;
    };

    /**
    * 获取距离最近的节点
    * @param collection {go.Set} 待分析节点集合
    * @param distances {go.Map} 距离集合
    */
    AnalysisPathTool.prototype.getLeastDistanceNode = function (collection, distances) {
        if (!collection || !distances) return;

        var bestDistance = Infinity; // 最近距离初始化为无限大
        var bestNode = null; // 距离最近的节点

        // 获取距离最近的节点
        var iterator = collection.iterator;
        while (iterator.next()) {
            var node = iterator.value;
            var distance = distances.getValue(node);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestNode = node;
            }
        }

        return bestNode;
    };

    /**
    * 获取所有路径
    * @param startNode {go.Node} 起始节点
    * @param endNode {go.Node} 结束节点
    * @param distances {go.Map} 节点距离集合
    */
    AnalysisPathTool.prototype.getAllPaths = function (startNode, endNode, distances) {
        if (!startNode || !endNode || !distances) return;

        var stack = new go.List("object"); // 创建路径堆栈

        // 初始化最短路径集合
        this.paths = new go.List(go.List);
        // 将起始节点作为路径的起点
        stack.add(startNode);
        // 开始寻找路径
        this.findPath(startNode, endNode, distances, stack);
    };

    /**
    * 寻找路径
    * @param startNode {go.Node} 起始节点
    * @param endNode {go.Node} 结束节点
    * @param distances {go.Map} 节点距离集合
    * @param stack {go.List} 路径堆栈
    */
    AnalysisPathTool.prototype.findPath = function (startNode, endNode, distances, stack) {
        if (!startNode || !endNode || !distances || !stack) return;

        var startDistance = distances.getValue(startNode); // 获取起始节点距离
        var endDistance = distances.getValue(endNode); // 获取结束节点距离

        var iterator = this.diagram.currentModel.findNodesConnected(startNode).iterator;
        while (iterator.next()) {
            var neighborNode = iterator.value; // 获取邻节点
            var neighborDistance = distances.getValue(neighborNode); // 获取邻节点距离

            // 若邻节点为起始节点的下一层，则继续寻找路径，否则跳过
            if (neighborDistance === startDistance + 1) {
                // 若邻节点是结束节点,则生成路径
                if (neighborNode.id === endNode.id) {
                    var path = stack; // 获取路径

                    // 若路径长度与层数相符，则认为是最短路径，将其加入路经集合，否则跳过
                    if (path.count == endDistance) {
                        // 将结束节点放进路径
                        path.add(endNode);
                        // 将该路径添加进路径集合中
                        this.paths.add(path);
                    }
                    // 若邻节点不是结束节点,则继续寻找路径
                } else {
                    // 生成新的路径堆栈
                    var newStack = stack.copy()
                    // 将邻节点放进新生成的路径堆栈
                    newStack.add(neighborNode);
                    // 向下一层寻找路径
                    this.findPath(neighborNode, endNode, distances, newStack);
                }
            }
        }
    };

    /**
    * 高亮路径
    * @param path {go.List} 路径（节点集合）
    */
    AnalysisPathTool.prototype.highlightPath = function (path) {
        if (!path) return;

        var model = this.diagram.currentModel;

        for (i = 0; i < path.count - 1; i++) {
            var node = path.elt(i);  // 获取当前节点
            var nextNode = path.elt(i + 1); // 获取下一个节点

            //// 高亮当前节点
            //model.setDataProperty(node, "isHighlighted", true);
            //// 高亮下一个节点
            //model.setDataProperty(nextNode, "isHighlighted", true);
            //// 高亮两个节点之间的链接
            //model.findLinksBetween(node, nextNode).each(function (link) {
            //    model.setDataProperty(link, "isHighlighted", true);
            //});

            // 选中当前节点
            model.setDataProperty(node, "isSelected", true);
            // 选中下一个节点
            model.setDataProperty(nextNode, "isSelected", true);
            // 选中两个节点之间的链接
            model.findLinksBetween(node, nextNode).each(function (link) {
                model.setDataProperty(link, "isSelected", true);
            });
        }
    };

    //#endregion 路径分析工具

    // ----------------------------------------------------------------------------------------------------------------------

    String.prototype.format = function (args) {
        var result = this;
        if (arguments.length > 0) {
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    if (args[key] != undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        var reg = new RegExp("({[" + i + "]})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
    };

    // ----------------------------------------------------------------------------------------------------------------------

    /**
    * 视图对象所在的可视化工具 {VisualizationTool}
    */
    go.Diagram.prototype.visualizationTool = null;

    /**
    * 视图对象的虚拟数据模型，包含着所有的看到和看不到的数据 {go.GraphLinksModel}
    */
    go.Diagram.prototype.virtualizedModel = null;

    /**
    * 计算视图的固定边界
    * @return {go.Rect} 视图边界矩形
    */
    go.Diagram.prototype.computeFixedBounds = function () {
        var model = this.currentModel;
        var visibleNodes = new go.List(go.Node);
        var bounds = null;

        // 获取可见节点集合
        this.nodes.each(function (obj) {
            if (obj.isVisible()) {
                visibleNodes.add(obj);
            }
        });

        // 获取可见节点的边界范围
        if (visibleNodes.count>0) {
            bounds = this.computePartsBounds(visibleNodes);
        }

        // 计算所有节点的所在的边界范围，从而得到整个视图的边界值
        model.eachNode(function (node) {
            if (!node.isVisible || !node.bounds || node.isGroup) return;

            var unionBounds = null;

            if (node.group) {
                var groupData = model.findNodeDataForKey(node.group);

                if (!groupData || (groupData && groupData.isVisible)) {
                    unionBounds = node.bounds;
                }
            } else {
                unionBounds = node.bounds;
            }

            if (!unionBounds) return;

            if (!bounds) {
                bounds = new go.Rect();
                bounds.set(unionBounds);
            }
            else {
                bounds.unionRect(unionBounds)
            }
        });

        // 设置视图的固定边界
        this.fixedBounds = bounds || new go.Rect();

        return bounds;
    };

    /**
    * 获取或设置是否允许进行虚拟化布局
    * @param value {Boolean} 允许虚拟化标识
    * @return {Boolean} 允许虚拟化标识
    */
    Object.defineProperty(go.Diagram.prototype, "allowVirtualize", {
        get: function () {
            // 虚拟化标识与可视化工具的虚拟化标识保持一致
            return this.visualizationTool.allowVirtualize;
        }
    });

    /**
    * 获取当前数据模型
    * @return {go.GraphLinksModel} 数据模型
    */
    Object.defineProperty(go.Diagram.prototype, "currentModel", {
        enumerable: true,
        get: function () {
            return this.allowVirtualize ? this.virtualizedModel : this.model;
        }
    });

    // ----------------------------------------------------------------------------------------------------------------------

    /**
    * 布局是否为虚拟化 {Boolean}
    */
    go.Layout.prototype.isVirtualized = false;

    // ----------------------------------------------------------------------------------------------------------------------

    /**
    * 添加虚拟模型数据
    * @param model {go.GraphLinksModel} 模型数据
    */
    go.LayoutNetwork.prototype.addVirtualizedModel = function (model) {
        if (!model) return;

        var dataVertexMap = new go.Map(); // 创建顶点集合

        // 遍历节点数据，创建对应的顶点
        var nodeDataArray = model.nodeDataArray;
        var nodeLength = nodeDataArray.length;
        for (var i = 0; i < nodeLength; i++) {
            var nodeData = nodeDataArray[i];

            // 数据不可见时，跳过
            if (!nodeData.isVisible) continue;

            // 创建顶点
            var vertex = this.createVertex();
            // 指定顶点数据（不使用节点）
            vertex.data = nodeData;

            // 将顶点添加进顶点集合
            dataVertexMap.add(nodeData.id, vertex);

            // 将顶点添加进当前布局网络中
            this.addVertex(vertex);
        }

        // 遍历链接数据，创建对应的边缘
        var linkDataArray = model.linkDataArray;
        var linkLength = linkDataArray.length;
        for (var i = 0; i < linkLength; i++) {
            var linkData = linkDataArray[i];

            // 数据不可见时，跳过
            if (!linkData.isVisible) continue;

            // 获取起始顶点
            var fromVertex = dataVertexMap.getValue(linkData.fromEntityId);
            // 获取到达顶点
            var toVertex = dataVertexMap.getValue(linkData.toEntityId);

            // 两端节点不存在或不可见时，跳过
            if (fromVertex === null || !fromVertex.data.isVisible || toVertex === null || !toVertex.data.isVisible) continue;

            // 创建边缘
            var edge = this.createEdge();
            // 指定边缘数据（不使用链接）
            edge.data = linkData;
            // 指定边缘的起始顶点
            edge.fromVertex = fromVertex;
            // 指定边缘的到达顶点
            edge.toVertex = toVertex;

            // 将边缘添加进当前布局网络中
            this.addEdge(edge);
        }
    };

    // ----------------------------------------------------------------------------------------------------------------------

    /**
    * 监听器集合
    */
    go.Node.prototype.listeners = null;

    /**
    * 添加监听器
    * @param eventType {String} 监听事件类型
    * @param func {Function|String} 事件触发时要执行的处理，caller不存在时此参数为具体函数，caller存在时此参数为caller的某函数名称
    * @param caller {Object} 处理呼叫元
    */
    go.Node.prototype.addEventListener = function (eventType, func, caller) {
        if (!eventType || !func) return;
        if (!eventType in this) return;
        if (caller && !(func in caller)) return;

        // 初始化处理
        if (!caller) caller = null;
        if (!this.listeners) this.listeners = [];

        // 创建一个新的监听器对象
        var listener = {
            eventType: eventType,
            func: func,
            caller: caller
        };

        // 绑定监听器对象
        this.bindEventListener(listener);

        // 将监听器对象添加进监听器集合中
        this.listeners.push(listener);
    };

    /**
    * 绑定监听器
    * @param listener {Object} 监听器
    */
    go.Node.prototype.bindEventListener = function (listener) {
        if (!listener) return;

        var type = listener.eventType; // 获取监听事件类型

        if (this[type] === null) {
            // 为事件绑定监听处理
            this[type] = (function (type) {
                return function () {
                    var obj = null; // 节点对象

                    // 获取节点对象，注意节点对象的对应参数位置与事件类型有关
                    obj = type === "selectionChanged" ? arguments[0] : arguments[1];
                    if (!obj) return;

                    var listeners = obj.listeners;
                    var length = listeners.length;

                    for (var i = 0; i < length; i++) {
                        var listener = listeners[i];
                        var eventType = listener.eventType;
                        var func = listener.func;
                        var caller = listener.caller;

                        if (type === eventType) {
                            // 处理呼叫元存在时，执行呼叫元中对应的处理，否则直接执行处理
                            caller ? caller[func].apply(caller, arguments) : func.apply(null, arguments);
                        }
                    }
                };
            })(type);
        }
    };

    /**
    * 设置子元素显示状态
    */
    go.Node.prototype.setSubPartsVisibility = function () {
        var diagram = this.diagram; // 获取视图
        var actualScale = this.scale * diagram.scale; // 获取实际缩放比例
        var data = this.data // 获取元素数据

        // 图片在缩放比例不小于0.2时显示
        if (0.2 <= actualScale) {
            diagram.model.setDataProperty(data, "showPicture", true);
        }
            // 图片在缩放比例小于0.2时不显示
        else if (actualScale < 0.2) {
            diagram.model.setDataProperty(data, "showPicture", false);
        }

        // 文本列表在缩放比例不小于0.4时显示
        if (0.4 <= actualScale) {
            diagram.model.setDataProperty(data, "showTextList", true);
        }
            // 文本列表在缩放比例小于0.4时不显示
        else if (actualScale < 0.4) {
            diagram.model.setDataProperty(data, "showTextList", false);
        }
    };

    // ----------------------------------------------------------------------------------------------------------------------

    /**
    * 监听器集合
    */
    go.Link.prototype.listeners = null;

    /**
    * 添加监听器
    * @param eventType {String} 监听事件类型
    * @param func {Function|String} 事件触发时要执行的处理，caller不存在时此参数为具体函数，caller存在时此参数为caller的某函数名称
    * @param caller {Object} 处理呼叫元
    */
    go.Link.prototype.addEventListener = function (eventType, func, caller) {
        if (!eventType || !func) return;
        if (!eventType in this) return;
        if (caller && !(func in caller)) return;

        // 初始化处理
        if (!caller) caller = null;
        if (!this.listeners) this.listeners = [];

        // 创建一个新的监听器对象
        var listener = {
            eventType: eventType,
            func: func,
            caller: caller
        };

        // 绑定监听器对象
        this.bindEventListener(listener);

        // 将监听器对象添加进监听器集合中
        this.listeners.push(listener);
    };

    /**
    * 绑定监听器
    * @param listener {Object} 监听器
    */
    go.Link.prototype.bindEventListener = function (listener) {
        if (!listener) return;

        var type = listener.eventType; // 获取监听事件类型

        if (this[type] === null) {
            // 为事件绑定监听处理
            this[type] = (function (type) {
                return function () {
                    var obj = null; // 节点对象

                    // 获取链接对象，注意链接对象的对应参数位置与事件类型有关
                    obj = type === "selectionChanged" ? arguments[0] : arguments[1];
                    if (!obj) return;

                    var listeners = obj.listeners;
                    var length = listeners.length;

                    for (var i = 0; i < length; i++) {
                        var listener = listeners[i];
                        var eventType = listener.eventType;
                        var func = listener.func;
                        var caller = listener.caller;

                        if (type === eventType) {
                            // 处理呼叫元存在时，执行呼叫元中对应的处理，否则直接执行处理
                            caller ? caller[func].apply(caller, arguments) : func.apply(null, arguments);
                        }
                    }
                };
            })(type);
        }
    };

    /**
    * 设置子元素显示状态
    */
    go.Link.prototype.setSubPartsVisibility = function () {
        var diagram = this.diagram; // 获取视图
        var actualScale = this.scale * diagram.scale; // 获取实际缩放比例
        var data = this.data // 获取元素数据

        // 文本列表在缩放比例不小于0.4时显示
        if (0.4 <= actualScale) {
            diagram.model.setDataProperty(data, "showTextList", true);
        }
            // 文本列表在缩放比例小于0.4时不显示
        else if (actualScale < 0.4) {
            diagram.model.setDataProperty(data, "showTextList", false);
        }
    };

    // ----------------------------------------------------------------------------------------------------------------------

    /**
    * 清空高亮状态
    */
    go.GraphLinksModel.prototype.clearHighlighteds = function () {
        var model = this;

        this.each(function (data) {
            model.setDataProperty(data, "isHighlighted", false);
        });
    };

    /**
    * 清空选中状态
    */
    go.GraphLinksModel.prototype.clearSelection = function () {
        var model = this;

        this.each(function (data) {
            model.setDataProperty(data, "isSelected", false);
        });
    };

    /**
    * 遍历节点和链接数据
    * @param func {Function} 对遍历的每个数据要执行的处理
    */
    go.GraphLinksModel.prototype.each = function (func) {
        if (!func) return;

        // 遍历节点数据
        this.eachNode(func);
        // 遍历链接数据
        this.eachLink(func);
    };

    /**
    * 遍历链接数据
    * @param func {Function} 对遍历的每个数据要执行的处理
    */
    go.GraphLinksModel.prototype.eachLink = function (func) {
        if (!func) return;

        var array = this.linkDataArray;

        for (var i = 0, length = array.length; i < length; i++) {
            func(array[i]);
        }
    };

    /**
    * 遍历节点数据
    * @param func {Function} 对遍历的每个数据要执行的处理
    */
    go.GraphLinksModel.prototype.eachNode = function (func) {
        if (!func) return;

        var array = this.nodeDataArray;

        for (var i = 0, length = array.length; i < length; i++) {
            func(array[i]);
        }
    };

    /**
    * 筛选节点数据和链接数据
    * @param func {Function} 对遍历的每个数据要执行的处理
    * @return {go.List} 筛选结果集合
    */
    go.GraphLinksModel.prototype.filter = function (func) {
        if (!func) return;

        // 筛选节点数据
        var nodeList = this.filterLink(func);
        // 筛选链接数据
        var linkList = this.filterNode(func);

        return nodeList.addAll(linkList);
    };

    /**
    * 筛选链接数据
    * @param func {Function} 筛选函数
    * @return {go.List} 筛选结果集合
    */
    go.GraphLinksModel.prototype.filterLink = function (func) {
        if (!func) return;

        var list = new go.List("object");
        var array = this.linkDataArray;

        for (var i = 0, length = array.length; i < length; i++) {
            var data = array[i];

            func(data) === true && list.push(data);
        }

        return list;
    };

    /**
    * 筛选节点数据
    * @param func {Function} 筛选函数
    * @return {go.List} 筛选结果集合
    */
    go.GraphLinksModel.prototype.filterNode = function (func) {
        if (!func) return;

        var list = new go.List("object");
        var array = this.nodeDataArray;

        for (var i = 0, length = array.length; i < length; i++) {
            var data = array[i];

            func(data) && list.push(data);
        }

        return list;
    };

    /**
    * 寻找两个节点数据之间的链接数据集合
    * @param nodeDataA {Object} 节点数据A
    * @param nodeDataB {Object} 节点数据B
    * @return {go.List} 链接数据集合
    */
    go.GraphLinksModel.prototype.findLinksBetween = function (nodeDataA, nodeDataB) {
        if (!nodeDataA || !nodeDataB) return;

        var list = this.filterLink(function (data) {
            if (!data.isVisible) return false;

            return (nodeDataA.id === data.fromEntityId && nodeDataB.id === data.toEntityId)
                || (nodeDataA.id === data.toEntityId && nodeDataB.id === data.fromEntityId);
        });

        return list;
    };

    /**
    * 寻找与节点数据关联的链接数据集合
    * @param nodeData {Object} 节点数据
    * @return {go.List} 链接数据集合
    */
    go.GraphLinksModel.prototype.findLinksConnected = function (nodeData) {
        if (!nodeData) return;

        var list = this.filterLink(function (data) {
            if (!data.isVisible) return false;

            return (nodeData.id === data.fromEntityId || nodeData.id === data.toEntityId);
        });

        return list;
    };

    /**
    * 寻找指向该节点数据的链接数据集合
    * @param nodeData {Object} 节点数据
    * @return {go.List} 链接数据集合
    */
    go.GraphLinksModel.prototype.findLinksInto = function (nodeData) {
        if (!nodeData) return;

        var list = this.filterLink(function (data) {
            if (!data.isVisible) return false;

            return nodeData.id === data.toEntityId;
        });

        return list;
    };

    /**
    * 寻找从该节点数据发出的链接数据集合
    * @param nodeData {Object} 节点数据
    * @return {go.List} 链接数据集合
    */
    go.GraphLinksModel.prototype.findLinksOutOf = function (nodeData) {
        if (!nodeData) return;

        var list = this.filterLink(function (data) {
            if (!data.isVisible) return false;

            return nodeData.id === data.fromEntityId;
        });

        return list;
    };

    /**
    * 寻找与节点数据关联的节点数据集合
    * @param nodeData {Object} 节点数据
    * @return {go.List} 节点数据集合
    */
    go.GraphLinksModel.prototype.findNodesConnected = function (nodeData) {
        if (!nodeData) return;

        var model = this;
        var list = new go.List("object");

        this.eachLink(function (linkData) {
            if (!linkData.isVisible) return false;

            var otherNode = model.getOtherNode(linkData, nodeData);
            if (otherNode && otherNode.isVisible) {
                list.add(otherNode);
            }
        });

        return list;
    };

    /**
    * 获取高亮的节点数据和链接数据的集合
    *
    * @return {go.List} 高亮数据集合
    */
    go.GraphLinksModel.prototype.getHighlighteds = function () {
        var list = this.filter(function (data) {
            return data.isVisible && data.isHighlighted;
        });

        return list;
    };

    /**
    * 根据一端的节点数据，寻找链接数据另一端的节点数据
    *
    * @param linkData {Object} 链接数据
    * @param nodeData {Object} 节点数据
    * @return {Object} 另一端的节点数据
    */
    go.GraphLinksModel.prototype.getOtherNode = function (linkData, nodeData) {
        if (!linkData || !nodeData) return;

        var otherNodeData = null;

        if (nodeData.id === linkData.fromEntityId) {
            otherNodeData = this.findNodeDataForKey(linkData.toEntityId);
        }
        else if (nodeData.id === linkData.toEntityId) {
            otherNodeData = this.findNodeDataForKey(linkData.fromEntityId);
        }

        return otherNodeData;
    };

    /**
    * 获取选中的节点数据和链接数据的集合
    *
    * @return {go.List} 选中数据集合
    */
    go.GraphLinksModel.prototype.getSelection = function () {
        var list = this.filter(function (data) {
            return data.isVisible && data.isSelected;
        });

        return list;
    };

    /**
    * 只高亮指定数据
    */
    go.GraphLinksModel.prototype.highlight = function (data) {
        if (!data) return;

        // 清空高亮状态
        this.clearHighlighteds();

        // 选中指定数据
        this.setDataProperty(data, "isHighlighted", true);
    };

    /**
    * 只选中指定数据
    */
    go.GraphLinksModel.prototype.select = function (data) {
        if (!data) return;

        // 清空选中状态
        this.clearSelection();

        // 选中指定数据
        this.setDataProperty(data, "isSelected", true);
    };

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 虚拟化数据模型

    /**
    * 虚拟化数据模型的构造函数
    * @param nodeDataArray {Array} 节点数据数组
    * @param linkDataArray {Array} 链接数据数组
    */
    function VirtualizedModel(nodeDataArray, linkDataArray) {
        go.GraphLinksModel.apply(this, arguments);
    };

    // 虚拟化数据模型继承图形链接数据模型的所有属性和方法
    go.Diagram.inherit(VirtualizedModel, go.GraphLinksModel);

    /**
    * 视图的数据模型 {go.GraphLinksModel}
    */
    VirtualizedModel.prototype.diagramModel = null;

    /**
    * 设置对象属性值（override）
    * @param data {Object} 目标对象
    * @param propertyName {String} 属性名
    * @param value {Object} 新值
    */
    VirtualizedModel.prototype.setDataProperty = function (data, propertyName, value) {
        var diagramData = this.diagramModel.findNodeDataForKey(data.id);
        if (!diagramData) diagramData = this.diagramModel.findLinkDataForKey(data.id);

        // 数据在视图中时，则设置视图数据模型，否则设置虚拟数据模型
        if (diagramData) {
            go.GraphLinksModel.prototype.setDataProperty.apply(this.diagramModel, arguments);
        }
        else {
            go.GraphLinksModel.prototype.setDataProperty.apply(this, arguments);
        }
    }

    //#endregion 虚拟化数据模型

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 自定义节点

    function CustomNode() {
        go.Node.call(this);
    }

    go.Diagram.inherit(CustomNode, go.Node);

    /**
    * 是否可重缩放 {Boolean}
    */
    CustomNode.prototype.rescalable = false;

    /**
    * 是否可重缩放 {Boolean}
    */
    CustomNode.prototype.linksCount = 0;

    /**
    * 计算链接数（真正可见的链接数）
    */
    CustomNode.prototype.computeLinksCount = function () {
        var linksCount = 0;
        this.linksConnected.each(function (link) {
            if (link.isVisible()) {
                linksCount++;
            }
        });

        this.linksCount = linksCount;
        this.computeScale();
    };

    /**
    * 计算缩放比例
    */
    CustomNode.prototype.computeScale = function () {
        if (this.rescalable) {
            var increment = this.linksCount > 40 ? 2 : this.linksCount * 0.05;
            this.scale = 1 + increment;
        } else {
            this.scale = 1;
        }
    };


    //#endregion 自定义节点

    // ----------------------------------------------------------------------------------------------------------------------

    //#region 并行线链接

    function ParallelLink() {
        go.Link.call(this);
    }

    go.Diagram.inherit(ParallelLink, go.Link);

    ParallelLink.prototype.lastCurviness = null;

    ParallelLink.prototype.linkSpacing = 30;

    ParallelLink.prototype.arrowPrefixLength = 2;

    ParallelLink.prototype.arrowLength = 20;

    ParallelLink.prototype.arrowSmoothness = 0.75;

    ParallelLink.prototype.computeSpacing = function () {
        var space = go.Link.prototype.computeSpacing.call(this);
        var realSpace = space === 0 ? space : this.linkSpacing;

        return realSpace;
    };

    ParallelLink.prototype.computePoints = function () {
        var result = go.Link.prototype.computePoints.call(this);

        if (!this.isOrthogonal && this.adjusting === go.Link.None && this.pointsCount !== 0) {

            var fromNode = this.fromNode;
            var toNode = this.toNode;
            var links = fromNode.findLinksBetween(toNode);
            var count = 0;
            var curviness = this.computeCurviness();

            // 计算两节点之间可见的链接数
            links.each(function (obj) {
                if (obj.isVisible()) {
                    count++;
                }
            });

            if (count === 1) {
                var num = this.pointsCount;
                var fromPoint = this.getPoint(0);
                var toPoint = this.getPoint(num - 1);
                var middlePoint = this.midPoint;
                var mx = (fromPoint.x + toPoint.x) / 2;
                var my = (fromPoint.y + toPoint.y) / 2;
                middlePoint.setTo(mx, my);
            }
            else {
                if (curviness !== 0) {
                    var num = this.pointsCount;
                    var fromPoint = this.getPoint(0);
                    var toPoint = this.getPoint(num - 1);
                    var mx = (fromPoint.x + toPoint.x) / 2;
                    var my = (fromPoint.y + toPoint.y) / 2;
                    //var middlePointInLine = new go.Point(mx, my);
                    var middlePoint = this.midPoint;
                    var offsetdx = middlePoint.x - mx;
                    var offsetdy = middlePoint.y - my;

                    fromPoint.offset(offsetdx, offsetdy);
                    toPoint.offset(offsetdx, offsetdy);
                }
            }

            if (curviness !== this.lastCurviness) {
                this.lastCurviness = curviness;
                this.computeArrowShape(count, curviness);
            }
        }
        return result;
    };

    ParallelLink.prototype.computeArrowShape = function (linksCount, curviness) {
        var length = this.arrowLength;
        var prefixLength = this.arrowPrefixLength;
        var totalLength = length + prefixLength;
        var smoothness = this.arrowSmoothness;

        var fromArror = this.findObject("FROM_ARROR");
        if (fromArror) {
            var geometryString = null;
            var segmentOffset = null;
            var offsetX = totalLength / 2;
            this.fromShortLength = totalLength;

            if (linksCount === 1 || curviness === 0) {
                var px0 = totalLength;
                var py0 = 0;

                var l = "l {0} {1}".format(px0, py0);
                geometryString = "M 0 0 {0}".format(l);

                segmentOffset = new go.Point(offsetX, 0);
            }
            else {
                var px0 = prefixLength;
                var py0 = 0;
                var length1 = length * smoothness / 2;
                var length2 = length * (1 - smoothness);
                var px1 = length1;
                var py1 = 0;
                var px2 = length / 2;
                var py2 = -curviness / 2;
                var px3 = length2 / 2;
                var py3 = -curviness / 2;
                var px4 = length / 2;
                var py4 = -curviness / 2;
                var offsetY = curviness / 2;

                var l = "l {0} {1}".format(px0, py0);
                var q1 = "q {0} {1} {2} {3}".format(px1, py1, px2, py2);
                var q2 = "q {0} {1} {2} {3}".format(px3, py3, px4, py4);
                geometryString = "M 0 0 {0} {1} {2}".format(l, q1, q2);

                segmentOffset = new go.Point(offsetX, offsetY);
            }

            fromArror.geometryString = geometryString;
            fromArror.segmentOffset = segmentOffset;
        }

        var toArror = this.findObject("TO_ARROR");
        if (toArror) {
            var geometryString = null;
            var segmentOffset = null;
            var offsetX = -totalLength / 2;
            this.toShortLength = totalLength;

            if (linksCount === 1 || curviness === 0) {
                var px0 = -totalLength;
                var py0 = 0;

                var l = "l {0} {1}".format(px0, py0);
                geometryString = "M 0 0 {0}".format(l);

                segmentOffset = new go.Point(offsetX, 0);
            }
            else {
                var px0 = -prefixLength;
                var py0 = 0;
                var length1 = length * smoothness / 2;
                var length2 = length * (1 - smoothness);
                var px1 = -length1;
                var py1 = 0;
                var px2 = -length / 2;
                var py2 = -curviness / 2;
                var px3 = -length2 / 2;
                var py3 = -curviness / 2;
                var px4 = -length / 2;
                var py4 = -curviness / 2;
                var offsetY = curviness / 2;

                var l = "l {0} {1}".format(px0, py0);
                var q1 = "q {0} {1} {2} {3}".format(px1, py1, px2, py2);
                var q2 = "q {0} {1} {2} {3}".format(px3, py3, px4, py4);
                geometryString = "M 0 0 {0} {1} {2}".format(l, q1, q2);

                segmentOffset = new go.Point(offsetX, offsetY);
            }

            toArror.geometryString = geometryString;
            toArror.segmentOffset = segmentOffset;
        }

        var adornedArror = this.findObject("ADORNED_ARROR");
        if (adornedArror) {
            if (linksCount === 1) {
                adornedArror.segmentOffset = new go.Point(-3, 0);
            }
            else {
                adornedArror.segmentOffset = new go.Point(-30, 0);
            }
        }
    };

    //#endregion 并行线链接

    // ----------------------------------------------------------------------------------------------------------------------

    var vis = {
        VisualizationTool: VisualizationTool,
        NodeFilterTool: NodeFilterTool,
        LinkFilterTool: LinkFilterTool,
        PropertyInfoTool: PropertyInfoTool,
        OverviewTool: OverviewTool,
        MagnifierTool: MagnifierTool,
        LayoutManager: LayoutManager,
        TemplateManager: TemplateManager,
        ToolbarManager: ToolbarManager,
        ColorConfigTool: ColorConfigTool,
        ShapeConfigTool: ShapeConfigTool,
        LayoutConfigTool: LayoutConfigTool,
        SelectionConfigTool: SelectionConfigTool,
        ShowMagnifierTool: ShowMagnifierTool,
        AnalysisPathTool: AnalysisPathTool,
        CustomNode: CustomNode,
        ParallelLink: ParallelLink
    };
    window.vis = vis;

})(window);