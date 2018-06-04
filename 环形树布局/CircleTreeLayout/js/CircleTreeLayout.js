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

RadialTreeLayout.prototype.getTrees = function (network) {
    var vertexes = new go.List().addAll(network.vertexes);

    while (vertexes.count > 0) {
        var first = vertexes.first();
        var tree = new RadialTree();

    }
};

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

        network.buildTreeForVertex(vertex, isRelateChildrenOnly);

    });

    // 为网络中的所有顶点创建关系树
    network.vertexes.each(function (vertex) {
        if (vertex.parent !== null || vertex.layerIndex !== Infinity) return;

        network.buildTreeForVertex(vertex, isRelateChildrenOnly);
    });

    var roots = this.getRootVertexes();
};

//#endregion 径向树布局





//#region 径向树网络

/**
* 径向树网络的构造函数
*/
function RadialTreeNetwork() {
    go.LayoutNetwork.call(this);
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

RadialTreeNetwork.prototype.buildTreeForVertex = function (vertex, isRelateChildrenOnly) {
    // 初始化树层层级为0
    vertex.layerIndex = 0;

    // 为目标顶点创建树形关系
    var treeVertexes = network.bulidTreeRelationForVertex(vertex, isRelateChildrenOnly);

    // 创建径向树
    var tree = new RadialTree(treeVertexes);

    //

};

/**
* 为顶点构建树形关系
*
* 目标顶点为根顶点时，只关联子代；中间顶点时，则需要关联父代和子代。
* 目标顶点的父顶点需要关联父代和子代，目标顶点的子顶点只需要关联后代。
*
* @param {RadialTreeVertex} 径向树顶点
* @param {Boolean} 是否只关联后代
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
* @param {RadialTreeVertex} 径向树顶点
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
* @param {RadialTreeVertex} 径向树顶点
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

    this._parent = null;
    this.children = new go.Set();
    this.layerIndex = Infinity;
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
* @param {RadialTreeVertex} 目标顶点
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
    // 根顶点
    this.root = null;
    // 顶点集合
    this.vertexes = vertexes;

    this.layers = new go.Map("number", RadialTree);
};

RadialTree.prototype.buildTreeRelation = function (vertex) {
    var index = vertex.layerIndex + 1;
    var iterator = vertex.children.iterator;

    var layer = this.getLayer(index);
    if (layer === null) {
        layer = new RadialTreeLayer(index);
    }

    while (iterator.next()) {
        var child = iterator.value;

        this.addVertexToLayer(child, layer);
        this.buildTreeRelation(child);
    }
};

RadialTree.prototype.arrangeLayers = function () {
    var rootVertex = null;
};

RadialTree.prototype.addVertexToLayer = function (vertex, layer) {
    vertex.layer = layer;
    vertex.layerIndex = layerIndex;
    layer.addVertex(vertex);
};

RadialTree.prototype.getLayer = function (index) {
    return this.layers.get(index);
};

//#endregion 径向树




//#region 径向树层

/**
* 径向树层的构造函数
*/
function RadialTreeLayer(index) {
    this.index = index;
    this.vertexes = new go.List();
};

RadialTreeLayer.prototype.addVertex = function (vertex) {
    this.vertexes.add(vertex);
};

//#endregion 径向树层