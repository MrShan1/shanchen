/// <reference path="go-debug-1.8.7.js" />

//#region 高级树布局

/**
* 高级树布局的构造函数
*/
function AdvancedTreeLayout() {
    go.TreeLayout.call(this);

    // 预定义根顶点对应的节点集合
    this.defaultRootNodes = new go.Set();
    // 是否允许有无向树标识
    this.allowUndirectedTree = false;
};
go.Diagram.inherit(AdvancedTreeLayout, go.TreeLayout);

/**
* 生成布局网络对象
*
* @return {AdvancedTreeNetwork} 高级树网络
* @override
*/
AdvancedTreeLayout.prototype.createNetwork = function () {
    return new AdvancedTreeNetwork();
};

/**
* 制作布局网络
*
* @param {Diagram|Group|Iterable.} coll 目标视图对象集合
* @return {AdvancedTreeNetwork} 高级树网络
* @override
*/
AdvancedTreeLayout.prototype.makeNetwork = function (coll) {
    var network = go.TreeLayout.prototype.makeNetwork.apply(this, arguments);

    // 允许有无向树时,根据默认根顶点控制边线方向
    if (this.allowUndirectedTree === true) {
        var standbyVertexes = new go.List().addAll(network.vertexes); // 等待处理的顶点集合
        var standbyEdges = new go.List().addAll(network.edges); // 等待处理的边线集合
        var iterator = this.defaultRootNodes.iterator; // 默认根顶点集合

        // 遍历根顶点,重新设定边线的方向
        while (iterator.next()) {
            var node = iterator.value;
            var vertex = network.findVertex(node);

            if (vertex && standbyVertexes.contains(vertex)) {
                // 控制顶点的所有边线方向
                this.controlEdgeGoging(vertex, network, standbyVertexes, standbyEdges);
            }
        }
    }

    return network;
};

/**
* 控制目标顶点的所有边线方向
*
* 使目标顶点的所有边线都是从目标顶点触发
*
* @param {AdvancedTreeVertex} vertex 目标顶点
* @param {AdvancedTreeNetwork} network 目标顶点
* @param {go.List} standbyVertexes 等待处理的顶点集合
* @param {go.List} standbyEdges 等待处理的边线集合
*/
AdvancedTreeLayout.prototype.controlEdgeGoging = function (vertex, network, standbyVertexes, standbyEdges) {
    var iterator = vertex.edges.iterator;

    // 目标顶点视为已处理,从等待顶点集合中移除该顶点
    standbyVertexes.remove(vertex);

    // 遍历目标顶点的边线,修改边线的方向
    while (iterator.next()) {
        var edge = iterator.value;

        if (standbyEdges.contains(edge)) {
            if (edge.fromVertex !== vertex) {
                // 逆转边线方向
                network.reverseEdge(edge);
            }

            // 从等待边线集合中移除该边线
            standbyEdges.remove(edge);

            if (standbyVertexes.contains(edge.toVertex)) {
                // 递归循环，控制到达顶点的所有边线方向
                this.controlEdgeGoging(edge.toVertex, network, standbyVertexes, standbyEdges);
            }
        }
    }
};

//#endregion 高级树布局

//#region 高级树网络

/**
* 高级树网络的构造函数
*/
function AdvancedTreeNetwork() {
    go.TreeNetwork.call(this);
};
go.Diagram.inherit(AdvancedTreeNetwork, go.TreeNetwork);

/**
* 生成网络的边线
*
* @return {AdvancedTreeEdge} 高级树边线
* @override
*/
AdvancedTreeNetwork.prototype.createEdge = function () {
    return new AdvancedTreeEdge();
};

/**
* 生成网络的顶点
*
* @return {AdvancedTreeVertex} 高级树顶点
* @override
*/
AdvancedTreeNetwork.prototype.createVertex = function () {
    return new AdvancedTreeVertex();
};

//#endregion 高级树网络

//#region 高级树顶点

/**
* 高级树顶点的构造函数
*/
function AdvancedTreeVertex() {
    go.TreeVertex.call(this);
};
go.Diagram.inherit(AdvancedTreeVertex, go.TreeVertex);

//#endregion 高级树顶点

//#region 高级树边线

/**
* 高级树边线的构造函数
*/
function AdvancedTreeEdge() {
    go.TreeEdge.call(this);
};
go.Diagram.inherit(AdvancedTreeEdge, go.TreeEdge);

//#endregion 高级树边线