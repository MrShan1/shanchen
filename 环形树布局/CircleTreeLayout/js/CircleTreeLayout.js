/// <reference path="go-debug-1.8.7.js" />

//#region 径向树布局

/**
* 径向树布局的构造函数
*/
function RadialTreeLayout() {
    go.Layout.call(this);

    // 预定义根顶点对应的节点集合
    this.defaultRootNodes = new go.List();
    // 根顶点集合
    this.rootVertexes = new go.List();
    // 子树的划分模式,默认依据方向划分
    this.treeStyle = RadialTreeLayout.Directed;
};
go.Diagram.inherit(RadialTreeLayout, go.Layout);

/**
* 树类型之一
*
* @property {go.EnumValue} 树类型_有向树
*/
RadialTreeLayout.Directed = new go.EnumValue(RadialTreeLayout, "Directed", 10);

/**
* 树类型之一
*
* @property {go.EnumValue} 树类型_无向树
*/
RadialTreeLayout.Undirected = new go.EnumValue(RadialTreeLayout, "Undirected", 11);

/**
* 生成布局网络
*
* @return {RadialTreeNetwork} 径向树网络
* @override
*/
RadialTreeLayout.prototype.createNetwork = function () {
    return new RadialTreeNetwork();
};

/**
* 执行布局
*
* @param {Diagram|Group|Iterable} coll 要进行布局的数据集合
* @override
*/
RadialTreeLayout.prototype.doLayout = function (coll) {
    // 创建网络
    if (this.network === null) {
        this.network = this.makeNetwork(coll);
    }

    // 获取默认的根顶点集合
    var defaultRoots = this.getDefaultRootVertexes();

    // 创建布局网络的所有子树
    this.buildTrees(defaultRoots);

    this.updateParts();
    this.network = null;
};

/**
* 获取默认的根顶点集合
*
* @return {go.List} 根顶点集合
*/
RadialTreeLayout.prototype.getDefaultRootVertexes = function () {
    if (this.network === null) return new go.Set();

    var coll = new go.Set();

    var iterator = this.defaultRootNodes.iterator;
    while (iterator.next()) {
        var node = iterator.value;
        var vertex = this.network.findVertex(node);

        if (vertex) {
            coll.add(vertex);
        }
    }

    return coll;
};

/**
* 创建布局网络的所有子树
*
* 根据默认的根顶点集合，将所有顶点分配到对应的子树中
*
* @param {go.List} defaultRoots 根顶点集合
*/
RadialTreeLayout.prototype.buildTrees = function (defaultRoots) {
    var network = this.network;
    var isRelateChildrenOnly = false;

    // 有向树时，所有目标顶点均视为中间顶点，关联父代和子代关系
    if (this.treeStyle === RadialTreeLayout.Directed) {
        isRelateChildrenOnly = false;
    }
        // 无向树时，所有目标顶点均视为根顶点，只关联子代关系
    else {
        isRelateChildrenOnly = true;
    }

    // 优先为预设定顶点创建关系树
    defaultRoots.each(function (vertex) {
        if (vertex.isInTreeRelation === true) return;

        // 为顶点创建径向树
        network.buildTreeForVertex(vertex, isRelateChildrenOnly);

    });

    // 为网络中的所有顶点创建关系树
    network.vertexes.each(function (vertex) {
        if (vertex.isInTreeRelation === true) return;

        // 为顶点创建径向树
        network.buildTreeForVertex(vertex, isRelateChildrenOnly);
    });

    // 给网络中的树分配位置
    network.arrangeTrees();
};

//#endregion 径向树布局

//#region 径向树网络

/**
* 径向树网络的构造函数
*/
function RadialTreeNetwork() {
    go.LayoutNetwork.call(this);

    // 径向树集合
    this.trees = new go.List();
};
go.Diagram.inherit(RadialTreeNetwork, go.LayoutNetwork);

/**
* @property {Number} 树之间的间距
*/
RadialTreeNetwork.prototype.treeSpacing = 10;

/**
* 生成网络的边线
*
* @return {RadialTreeEdge} 径向树边线
* @override
*/
RadialTreeNetwork.prototype.createEdge = function () {
    return new RadialTreeEdge();
};

/**
* 生成网络的顶点
*
* @return {RadialTreeVertex} 径向树顶点
* @override
*/
RadialTreeNetwork.prototype.createVertex = function () {
    return new RadialTreeVertex();
};

/**
* 为顶点创建径向树
*
* @param {RadialTreeVertex} vertex 径向树顶点
* @param {Boolean} isRelateChildrenOnly 是否只关联后代
*/
RadialTreeNetwork.prototype.buildTreeForVertex = function (vertex, isRelateChildrenOnly) {
    // 为目标顶点创建树形关系
    var treeVertexes = this.bulidTreeRelationForVertex(vertex, isRelateChildrenOnly);

    // 创建径向树
    var tree = new RadialTree(treeVertexes);

    // 初始化径向树
    tree.initialize();

    // 将径向树添加进子树集合中
    this.addTree(tree);
};

/**
* 为顶点构建树形关系
*
* 目标顶点为根顶点时，只关联子代；中间顶点时，则需要关联父代和子代。
* 目标顶点的父顶点需要关联父代和子代，目标顶点的子顶点只需要关联后代。
*
* @param {RadialTreeVertex} vertex 径向树顶点
* @param {Boolean} isRelateChildrenOnly 是否只关联后代
* @return {go.List} 目标顶点的树形关系所包含的顶点集合
*/
RadialTreeNetwork.prototype.bulidTreeRelationForVertex = function (vertex, isRelateChildrenOnly) {
    var coll = new go.List(); // 目标顶点的树形关系所包含的顶点集合

    // 目标顶点已在树形关系中
    vertex.isInTreeRelation = true;

    // 将目标顶点添加进集合中
    coll.add(vertex);

    // 需要关联父代关系
    if (!isRelateChildrenOnly) {
        // 设置父顶点
        var parent = this.setParentForVertex(vertex);

        if (parent !== null) {
            // 为父顶点构建树形关系
            var treeVertexes = this.bulidTreeRelationForVertex(parent, false);
            // 将父顶点的树形关系集合添加进集合中
            coll.addAll(treeVertexes);
        }
    }

    // 设置子顶点集合
    var children = this.setChildrenForVertex(vertex);

    // 为每个子顶点设置树形关系
    var iterator = children.iterator;
    while (iterator.next()) {
        var child = iterator.value;

        // 为子顶点设置树形关系
        var treeVertexes = this.bulidTreeRelationForVertex(child, true);
        // 将子顶点的树形关系集合添加进集合中
        coll.addAll(treeVertexes);
    }

    return coll;
};

/**
* 为顶点设置父顶点
*
* @param {RadialTreeVertex} vertex 径向树顶点
* @return {RadialTreeVertex} 父顶点
*/
RadialTreeNetwork.prototype.setParentForVertex = function (vertex) {
    if (vertex.parent !== null) return null;

    // 获取顶点的来源顶点集合
    var iterator = vertex.sourceVertexes.iterator;
    var parent = null;

    while (iterator.next()) {
        parent = iterator.value;

        // 将第一个尚未建立树形关系的来源顶点，作为该顶点的父顶点
        if (parent.isInTreeRelation === false) {
            // 设置父顶点
            vertex.parent = parent;

            break;
        }
    }

    return parent;
};

/**
* 为顶点设置子顶点集合
*
* @param {RadialTreeVertex} vertex 径向树顶点
* @return {go.List} 子顶点集合
*/
RadialTreeNetwork.prototype.setChildrenForVertex = function (vertex) {
    var coll = new go.List();
    var iterator = null; // 子节点来源

    // 有向树时，使用到达顶点集合作为子节点来源
    if (this.layout.treeStyle === RadialTreeLayout.Directed) {
        iterator = vertex.destinationVertexes.iterator;
    }
        // 其他情况，使用关联顶点集合作为子节点来源
    else {
        iterator = vertex.vertexes.iterator;
    }

    while (iterator.next()) {
        var child = iterator.value;

        // 将所有尚未建立树形关系的顶点添加进子顶点集合中
        if (child.isInTreeRelation === false) {
            // 添加子顶点
            vertex.addChild(child);

            coll.add(child);
        }
    }

    return coll;

};

/**
* 添加子树
*
* @param {RadialTree} tree 目标树
*/
RadialTreeNetwork.prototype.addTree = function (tree) {
    // 将目标树添加子树集合中
    this.trees.add(tree);

    // 指定目标树的所属网络
    tree.network = this;
};

/**
* 给网络中的树分配位置
*
* 默认横向排列
*/
RadialTreeNetwork.prototype.arrangeTrees = function () {
    var trees = this.trees;
    var treeCount = trees.count;
    var index = 0;
    var offsetX = 0;
    var offsetY = 0;

    while (index < treeCount - 1) {
        var tree = trees.get(index);
        var nextTree = trees.get(index + 1);

        // 树的X轴中心位置向右偏移
        offsetX += tree.bounds.width / 2 + this.treeSpacing + nextTree.bounds.width / 2;
        // 树的Y轴中心位置不变
        offsetY = offsetY;

        // 移动树中所有顶点位置
        nextTree.moveAllVertexes(offsetX, offsetY);
    }
};

//#endregion 径向树网络

//#region 径向树顶点

/**
* 径向树顶点的构造函数
*/
function RadialTreeVertex() {
    go.LayoutVertex.call(this);

    // 父顶点
    this._parent = null;
    // 子顶点集合
    this.children = new go.Set();
    // 是否在树形关系中
    this.isInTreeRelation = false;
    // 所属树层
    this.layer = null;
    // 所属树层的索引
    this.layerIndex = NaN;
    // 自身所占区域的外接圆直径
    this.diameter = NaN;
    // 子顶点弧长总和
    this.childrenArcLength = NaN;
    // 所占弧长
    this.arcLength = NaN;
    // 所占弧的扫描角度
    this.sweepAngle = NaN;
    // 所占弧的起始角度
    this.startAngle = NaN;
};
go.Diagram.inherit(RadialTreeVertex, go.LayoutVertex);

/**
* @property {Number} 同层顶点之间的间距
*/
RadialTreeVertex.prototype.vertexSpacing = 10;

/**
* 获取相关顶点集合
*
* 相关顶点是指与当前顶点在同一关系网络中的其他顶点.
*
* @return {go.Set} 相关顶点集合
*/
RadialTreeVertex.prototype.getRelativeVertexes = function () {
    var coll = new go.Set();
    var iterator = this.vertexes.iterator; // 直接关联的顶点集合

    while (iterator.next()) {
        var vertex = iterator.value;

        // 将该顶点添加至结果集合
        coll.add(vertex);
        // 将该的相关顶点集合添加至结果集中
        coll.addAll(vertex.getRelativeVertexes());
    }

    return coll;
};

/**
* 添加子顶点
*
* @param {RadialTreeVertex} vertex 目标顶点
*/
RadialTreeVertex.prototype.addChild = function (vertex) {
    if (vertex.parent !== null || vertex === this) return;

    // 将目标顶点添加子顶点集合中
    this.children.add(vertex);

    // 将当前顶点作为目标顶点的父顶点
    vertex._parent = this;
};

/**
* 删除子顶点
*
* @param {RadialTreeVertex} vertex 目标顶点
*/
RadialTreeVertex.prototype.deleteChild = function (vertex) {
    if (vertex.parent === this) return;

    // 从子顶点集合中删除目标顶点
    this.children.remove(vertex);

    // 将当前顶点作为目标顶点的父顶点
    vertex._parent = null;
};

/**
* 计算顶点的直径
*
* 并非精确的直径，假设顶点外观为圆形，使用简单的模糊计算，效率高。
*
* @return {Number} 顶点直径
*/
RadialTreeVertex.prototype.computeDiameter = function () {
    // 计算顶点直径
    var diameter = this.width > this.height ? this.width : this.height;

    // 设置顶点直径
    this.diameter = diameter;

    return diameter;
};

/**
* 计算顶点的子顶点弧长总和
*
* @return {Number} 子顶点弧长总和
*/
RadialTreeVertex.prototype.computeChildrenArcLength = function () {
    // 子顶点弧长总和
    var childrenArcLength = 0;

    // 计算子顶点弧长总和
    this.children.each(function (child) {
        childrenArcLength += child.arcLength;
    });

    // 设置子顶点弧长总和
    this.childrenArcLength = childrenArcLength;

    return childrenArcLength;
};

/**
* 计算顶点的所占弧长
*
* @return {Number} 顶点所占弧长
*/
RadialTreeVertex.prototype.computeArcLength = function () {
    // 子顶点弧长总和
    var childrenArcLength = this.computeChildrenArcLength();
    // 顶点自身弧长
    var selfArcLength = this.diameter + this.vertexSpacing;
    // 顶点所占弧长
    var arcLength = 0;

    // 取较大的值作为顶点所占弧长
    arcLength = childrenArcLength > selfArcLength ? childrenArcLength : selfArcLength;

    // 设置顶点所占弧长
    this.arcLength = arcLength;

    return arcLength;
};

/**
* @property {RadialTreeVertex} 父顶点
*/
Object.defineProperty(RadialTreeVertex.prototype, "parent", {
    get: function () {
        return this._parent;
    },
    set: function (value) {
        // 值未变化，则直接跳过
        if (this._parent === value) return;

        // 从旧父顶点的子顶点集合中删除当前顶点
        if (this._parent) {
            this._parent.deleteChild(this);
        }

        // 将当前顶点添加进新父顶点的子顶点集合中
        if (value) {
            value.addChild(this);
        }
    }
});

//#endregion 径向树顶点

//#region 径向树边线

/**
* 径向树边线的构造函数
*/
function RadialTreeEdge() {
    go.LayoutEdge.call(this);
};
go.Diagram.inherit(RadialTreeEdge, go.LayoutEdge);

//#endregion 径向树边线

//#region 径向树

/**
* 径向树的构造函数
*/
function RadialTree(vertexes) {
    // 顶点集合
    this.vertexes = vertexes;
    // 所属网络
    this.network = null;
    // 根顶点
    this.root = null;
    // 树层集合
    this.layers = new go.Map();
    // 树边界
    this.bounds = new go.Rect(NaN, NaN, NaN, NaN);
};

/**
* @property {Number} 层级之间的间距
*/
RadialTree.prototype.layerSpacing = 10;

/**
* @property {Number} 树的扫描角度
*/
RadialTree.prototype.sweepAngle = 360;

/**
* @property {Number} 树的起始角度
*/
RadialTree.prototype.startAngle = 0;

/**
* 为顶点分配径向树层
*
* 将树中所有的顶点分配到对应的树层中
*
* @param {RadialTreeVertex} vertex 径向树顶点
* @param {Number} layerIndex 树层索引
*/
RadialTree.prototype.splitVertexIntoLayer = function (vertex, layerIndex) {
    // 获取树层
    var layer = this.getLayer(layerIndex);

    if (layer === null) {
        // 生成新的树层
        layer = new RadialTreeLayer(layerIndex);

        // 为树添加树层
        this.addLayer(layer);
    }

    // 为目标顶点分配径向树层
    layer.addVertex(vertex);

    var iterator = vertex.children.iterator;
    while (iterator.next()) {
        var child = iterator.value;

        // 为子顶点分配径向树层
        this.splitVertexIntoLayer(child, layerIndex + 1);
    }
};

/**
* 为树添加树层
*
* @param {RadialTreeLayer} layer 树层
*/
RadialTree.prototype.addLayer = function (layer) {
    // 将树层添加集合中
    this.layers.add(layer.index, layer);

    // 指定目标树层的所属树
    layer.tree = this;
}

/**
* 获取索引对应的树层
*
* @param {Number} layerIndex 树层索引
* @return {RadialTreeLayer} 径向树层
*/
RadialTree.prototype.getLayer = function (layerIndex) {
    return this.layers.get(layerIndex);
};

/**
* 获取树的根顶点
*
* @return {RadialTreeLayer} 径向树的根顶点
*/
RadialTree.prototype.getRootVertex = function () {
    var rootVertex = null;
    var iterator = this.vertexes.iterator;

    while (iterator.next()) {
        var vertex = iterator.value;

        // 第一个无父顶点的顶点，即为根顶点
        if (vertex.parent === null) {
            rootVertex = vertex;
            break;
        }
    }

    return rootVertex;
};

/**
* 初始化径向树
*/
RadialTree.prototype.initialize = function () {
    // 获取根顶点
    this.root = this.getRootVertex();

    // 从根顶点开始，分配每个顶点至各个树层
    this.splitVertexIntoLayer(this.root, 0);

    // 从最外层开始，计算相关数值
    var layerCount = this.layers.count;
    while (layerCount > 0) {
        var layer = this.getLayer(layerCount - 1);
        var thickness = 0;
        var vertexesArcLength = 0;

        layer.vertexes.each(function (vertex) {
            // 计算顶点直径
            var diameter = vertex.computeDiameter();

            // 计算树层厚度
            thickness = thickness > diameter ? thickness : diameter;

            // 计算顶点弧长
            var arcLength = vertex.computeArcLength();

            // 计算树层弧长
            vertexesArcLength += arcLength;
        });

        // 设定树层厚度
        layer.thickness = thickness;

        // 设定树层弧长
        layer.vertexesArcLength = vertexesArcLength;

        layerCount--;
    }

    // 计算各层的半径
    for (var i = 0; i < this.layers.count; i++) {
        this.computeLayerRadius(i);
    }

    // 初始化根顶点相关信息
    this.root.centerX = 0;
    this.root.centerY = 0;
    this.root.startAngle = this.startAngle;
    this.root.sweepAngle = this.sweepAngle;

    // 从根顶点开始，通过递归，计算树中所有顶点位置
    this.locateVertexChildren(this.root);

    // 计算树边界
    this.computeBounds();
};

/**
* 计算层半径
*
* @param {Number} layerIndex 树层索引
*/
RadialTree.prototype.computeLayerRadius = function (layerIndex) {
    // 获取索引对应的树层
    var layer = this.getLayer(layerIndex);

    // 获取第0层的半径
    if (layerIndex === 0) {
        // 根据根顶点半径计算树层半径1
        var layerRadius1 = this.layerSpacing + layer.thickness / 2;
        // 根据树层弧长计算树层半径2
        var layerRadius2 = layer.vertexesArcLength / (this.sweepAngle * Math.PI / 180);

        // 取较大值作为树层半径
        layer.radius = layerRadius1 > layerRadius2 ? layerRadius1 : layerRadius2;
    }
        // 获取其他层的半径
    else {
        // 获取相邻的内层树层
        var innerlayer = this.getLayer(layerIndex - 1);

        // 计算树层的半径
        layer.radius = innerlayer.radius + this.layerSpacing + layer.thickness / 2;
    }
};

/**
* 计算顶点的子顶点位置
*
* @param {RadialTreeVertex} vertex 顶点
*/
RadialTree.prototype.locateVertexChildren = function (vertex) {
    var startAngle = vertex.startAngle;
    var sweepAngle = vertex.sweepAngle;
    var iterator = vertex.children.iterator;
    var preAngle = 0;

    while (iterator.next()) {
        var child = iterator.value;

        // 设置起始角度
        child.startAngle = startAngle + preAngle;
        // 设置扫描角度
        child.sweepAngle = sweepAngle * child.arcLength / vertex.childrenArcLength;

        // 获取中心点角度
        var centerAngle = child.startAngle + child.sweepAngle / 2;
        // 获取所在层半径
        var radius = child.layer.radius;
        // 计算顶点的中心点位置
        child.centerX = radius * Math.cos(centerAngle * Math.PI / 180);
        child.centerY = radius * Math.sin(centerAngle * Math.PI / 180);

        // 向下递归，计算子顶点位置
        this.locateVertexChildren(child);

        preAngle += child.sweepAngle;
    }
};

/**
* 计算树边界
*/
RadialTree.prototype.computeBounds = function () {
    var bounds = null;

    // 计算树中所有顶点的总边界
    this.vertexes.each(function (vertex) {
        if (bounds === null) {
            bounds = new go.Rect();
            bounds.set(vertex.bounds);
        }
        else {
            bounds.unionRect(vertex.bounds);
        }
    });

    // 设置树边界
    this.bounds = bounds;
};

/**
* 移动树中所有顶点
*/
RadialTree.prototype.moveAllVertexes = function (offsetX, offsetY) {
    // 移动树中所有顶点
    this.vertexes.each(function (vertex) {
        vertex.centerX += offsetX;
        vertex.centerY += offsetY;
    });
};

//#endregion 径向树

//#region 径向树层

/**
* 径向树层的构造函数
*/
function RadialTreeLayer(index) {
    // 树层索引
    this.index = index;
    // 树层包含的顶点集合
    this.vertexes = new go.List();
    // 树层半径
    this.radius = NaN;
    // 树层厚度
    this.thickness = NaN;
    // 树层所属树
    this.tree = null;
    // 树层的顶点弧长总和
    this.vertexesArcLength = NaN;
};

/**
* 将目标顶点添加到树层中
*
* @param {RadialTreeVertex} vertex 径向树顶点
*/
RadialTreeLayer.prototype.addVertex = function (vertex) {
    // 将目标顶点添加到树层中
    this.vertexes.add(vertex);
    // 设置顶点的所属树层
    vertex.layer = this;
    // 设置顶点的所属树层索引
    vertex.layerIndex = this.index;
};

//#endregion 径向树层