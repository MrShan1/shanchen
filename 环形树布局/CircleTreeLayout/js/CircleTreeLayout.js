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
    this.splitMode = RadialTreeLayout.SplitByDirection;
};
go.Diagram.inherit(RadialTreeLayout, go.Layout);

/**
* 子树的划分模式之一
*
* @property {go.EnumValue} 划分模式_依据方向
*/
RadialTreeLayout.SplitByDirection = new go.EnumValue(RadialTreeLayout, "SplitByDirection", 10);

/**
* 子树的划分模式之一
*
* @property {go.EnumValue} 划分模式_依据根顶点
*/
RadialTreeLayout.SplitByRoot = new go.EnumValue(RadialTreeLayout, "SplitByRoot", 11);

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
    var coll = new go.List();

    if (this.network === null) return coll;

    var iterator = this.defaultRootNodes.iterator;
    while (iterator.next()) {
        var node = iterator.value;
        var vertex = this.network.findVertex(node);

        if (vertex && !vertexes.contains(vertex)) {
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

RadialTreeLayout.prototype.buildTreeRelation = function () {
    if (this.network === null) return;

    var iterator = this.network.vertexes.iterator;
    while (iterator.next()) {
        var vertex = iterator.value;

        vertex.setParent();
        vertex.setChildren();
    }
};

RadialTreeLayout.prototype.buildTreeRelationByRoots = function () {
    if (this.network === null) return;

    // 获取默认的根顶点集合
    var defaultRoots = this.getDefaultRootVertexes();

    var iterator = this.network.vertexes.iterator;
    while (iterator.next()) {
        var vertex = iterator.value;

        //vertex.setParent();
        vertex.setChildren();
    }
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

RadialTreeNetwork.prototype.findVertexByKey = function (key) {
    var iterator = this.vertexes.iterator;

    while (iterator.next()) {
        var vertex = iterator.value;

        if (vertex.data) {

        }
    }
};

//#endregion 径向树网络





//#region 径向树顶点

/**
* 径向树顶点的构造函数
*/
function RadialTreeVertex() {
    go.LayoutVertex.call(this);

    this._parent = null;
    this.children = new go.List();
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

//RadialTreeVertex.prototype.setParent = function () {
//    if (this.parent === null && this.sourceVertexes.count > 0) {
//        var first = this.sourceVertexes.first();

//        this.parent = first;
//        first.children.add(this);
//    }
//};

RadialTreeVertex.prototype.setChildren = function () {
    var iterator = this.destinationVertexes.iterator;

    while (iterator.next()) {
        var vertex = iterator.value;
        if (vertex !== this && vertex.parent === null) {
            vertex.parent = this;
        }
    }

};

Object.defineProperty(RadialTreeVertex.prototype, "parent", {
    get: function () {
        return this._parent;
    },
    set: function (value) {
        this._parent = value;

        if (value && !value.children.contains(this)) {
            value.children.add(this);
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
function RadialTree() {
    // 根顶点
    this.root = null;
    // 顶点集合
    this.vertexes = new go.List();
};

//#endregion 径向树




//#region 径向树层

/**
* 径向树层的构造函数
*/
function RadialTreeLayer() {

};

//#endregion 径向树层