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

    if (this.splitMode === RadialTreeLayout.SplitByRoot) {

    }
    else {

    }
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
        if (vertex.parent !== null || vertex.layerIndex !== Infinity) return;

        // 为顶点创建径向树
        network.buildTreeForVertex(vertex, isRelateChildrenOnly);

    });

    // 为网络中的所有顶点创建关系树
    network.vertexes.each(function (vertex) {
        if (vertex.parent !== null || vertex.layerIndex !== Infinity) return;

        // 为顶点创建径向树
        network.buildTreeForVertex(vertex, isRelateChildrenOnly);
    });
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
    // 初始化树层层级为0（临时用）
    vertex.layerIndex = 0;

    // 为目标顶点创建树形关系
    var treeVertexes = network.bulidTreeRelationForVertex(vertex, isRelateChildrenOnly);

    // 创建径向树
    var tree = new RadialTree(treeVertexes);

    // 将径向树添加进子树集合中
    this.trees.add(tree);
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

    while (iterator.next()) {
        var source = iterator.value;

        // 将第一个尚未建立关系的来源顶点，作为该顶点的父顶点
        if (source.layerIndex === Infinity) {
            vertex.parent = source;
            source.layerIndex = this.layerIndex - 1;

            return source;
        }
    }
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

    // 有向树时，使用目标顶点集合作为子节点来源
    if (this.layout.treeStyle === RadialTreeLayout.Directed) {
        iterator = vertex.destinationVertexes.iterator;
    }
        // 其他情况，使用关联顶点集合作为子节点来源
    else {
        iterator = vertex.vertexes.iterator;
    }

    while (iterator.next()) {
        var destination = iterator.value;

        // 将所有尚未建立关系、且非该顶点本身的顶点，添加进子顶点集合中
        if (destination.parent === null && destination !== this) {
            vertex.addChild(destination);
            destination.layerIndex = this.layerIndex + 1;

            coll.add(destination);
        }
    }

    return coll;

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
    // 所属树层的索引
    this.layerIndex = Infinity;
    // 自身所占区域的外接圆半径
    this.radius = NaN;
};
go.Diagram.inherit(RadialTreeVertex, go.LayoutVertex);

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
    if (!vertex || vertex === this) return;

    // 将目标顶点添加子顶点集合中
    this.children.add(vertex);
    // 将当前顶点作为目标顶点的父顶点
    vertex.parent = this;
};

/**
* @property {RadialTreeVertex} 父顶点
*/
Object.defineProperty(RadialTreeVertex.prototype, "parent", {
    get: function () {
        return this._parent;
    },
    set: function (value) {
        if (this._parent === value) return;

        this._parent = value;

        // 设置父顶点时，自动为父顶点添加子顶点
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
    // 根顶点
    this.root = this.getRootVertex();
    // 树层集合
    this.layers = new go.Map();
    // 从根顶点开始，分配每个顶点至各个树层
    this.splitVertexIntoLayer(this.root, 0);
};

/**
* @property {Number} 层级之间的间距
*/
RadialTree.prototype.layerDistance = 10;

/**
* @property {Number} 同层顶点之间的间距
*/
RadialTree.prototype.vertexDistance = 5;

/**
* 为顶点分配径向树层
*
* 将树中所有的顶点分配到对应的树层中
*
* @param {RadialTreeVertex} vertex 径向树顶点
* @param {Number} layerIndex 树层索引
*/
RadialTree.prototype.splitVertexIntoLayer = function (vertex, layerIndex) {
    var layer = this.getLayer(layerIndex);
    if (layer === null) {
        layer = new RadialTreeLayer(layerIndex);
        this.layers.add(layerIndex, layer);
    }

    // 为目标顶点分配径向树层
    layer.add(vertex);

    var iterator = vertex.children.iterator;
    while (iterator.next()) {
        var child = iterator.value;

        // 为子顶点分配径向树层
        this.splitVertexIntoLayer(child, layerIndex + 1);
    }
};

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
};

/**
* 将目标顶点添加到树层中
*
* @param {RadialTreeVertex} vertex 径向树顶点
*/
RadialTreeLayer.prototype.addVertex = function (vertex) {
    this.vertexes.add(vertex);
    vertex.layerIndex = this.index;
};

//#endregion 径向树层