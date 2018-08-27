/// <reference path="go-debug-1.8.7.js" />

//#region 高级树布局

/**
* 高级树布局的构造函数
*/
function AdvancedTreeLayout() {
    go.TreeLayout.call(this);

    // 预定义根顶点对应的节点集合
    this.defaultRootNodes = new go.Set();
    // 是否为有向树标识
    this.isDirected = true;
};
go.Diagram.inherit(AdvancedTreeLayout, go.TreeLayout);

/**
* 控制目标顶点的所有关联边线方向
*
* 使目标顶点的所有直接关联或间接关联的边线都是从目标顶点的方向出发
*
* @param {AdvancedTreeVertex} vertex 目标顶点
* @param {go.List} finishedVertexes 完成处理的顶点集合
* @param {go.List} finishedEdges 完成处理的边线集合
*/
AdvancedTreeLayout.prototype.controlEdgesDirection = function (vertex, finishedVertexes, finishedEdges) {
    var network = vertex.network; // 顶点所在的网络
    var standbyVertexes = new go.List(); // 等待处理的顶点集合

    // 将目标顶点添加至等待处理的顶点集合
    standbyVertexes.add(vertex);

    // 循环处理目标顶点的关系网络中的边线，直至再无等待处理的顶点
    while (standbyVertexes.count > 0) {
        // 取第一个待处理顶点(取到的点将会被移除,因此后续的顶点将逐个成为第一个顶点)
        var currentVertex = standbyVertexes.first();

        // 从等待处理的顶点集合中移除目标顶点
        standbyVertexes.remove(currentVertex);
        // 将目标顶点添加至完成处理的顶点集合
        finishedVertexes.add(currentVertex);

        // 遍历目标顶点的边线,逐个修正方向
        var iterator = currentVertex.edges.iterator;
        while (iterator.next()) {
            var edge = iterator.value;

            if (!finishedEdges.contains(edge)) {
                if (edge.fromVertex !== currentVertex) {
                    // 逆转边线方向
                    network.reverseEdge(edge);
                }

                // 将边线添加至完成处理的顶点集合
                finishedEdges.add(edge);

                // 将到达顶点添加至等待处理的顶点集合
                if (!finishedVertexes.contains(edge.toVertex)) {
                    standbyVertexes.add(edge.toVertex);
                }
            }
        }
    }
};

/**
* 寻找所有的根顶点
* 找到所有的根顶点之后，删除与树结构无关的边线
*
* @override
*/
AdvancedTreeLayout.prototype.findRoots = function () {
    // 执行既有的寻找根顶点处理,获取所有的根顶点
    go.TreeLayout.prototype.findRoots.call(this);

    var roots = this.roots; // 根顶点集合
    var standbyVertexes = new go.Set().addAll(roots); // 等待处理的顶点集合
    var finishedVertexes = new go.Set(); // 完成处理的顶点集合
    var finishedEdges = new go.Set(); // 完成处理的边线集合
    var removedEdges = new go.Set(); // 需要删除的无关边线集合

    // 遍历等待处理的顶点集合,逐个分析父子关系
    while (standbyVertexes.count > 0) {
        var vertex = standbyVertexes.first(); // 每次取第一个进行处理

        standbyVertexes.remove(vertex);
        finishedVertexes.add(vertex);

        var edges = this.isDirected ? vertex.destinationEdges : vertex.edges; // 获取所有可能的子关系边线

        // 遍历可能的子关系边线,记录无关边线
        edges.each(function (edge) {
            if (!finishedEdges.contains(edge) && !removedEdges.contains(edge)) {
                var otherVertex = edge.getOtherVertex(vertex); // 获取可能的子顶点

                // 如果边线所对应的顶点,已经属于等待处理或者已完成处理的顶点,则视为该边线与树结构无关,应该删除
                if (standbyVertexes.contains(otherVertex) || finishedVertexes.contains(otherVertex)) {
                    removedEdges.add(edge);
                }
                    // 其他情况，视为该边线与树结构有关
                else {
                    otherVertex.parent = vertex; // 设置父顶点
                    otherVertex.level = vertex.level + 1; // 设置所在层级

                    finishedEdges.add(edge);
                    standbyVertexes.add(otherVertex);
                }
            }
        });
    }

    // 删除所有的无关边线
    removedEdges.each(function (edge) {
        edge.fromVertex.deleteDestinationEdge(edge);
        edge.toVertex.deleteSourceEdge(edge);
    });
};

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
* 获取默认的根顶点集合
*
* @param {AdvancedTreeNetwork} network 高级树网络
* @return {go.List} 根顶点集合
*/
AdvancedTreeLayout.prototype.getDefaultRootVertexes = function (network) {
    if (network === null) return new go.List();

    var coll = new go.List();

    // 获取默认的根顶点集合
    var iterator = this.defaultRootNodes.iterator;
    while (iterator.next()) {
        var node = iterator.value;
        var vertex = network.findVertex(node);

        if (vertex) {
            coll.add(vertex);
        }
    }

    return coll;
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

    // 无向树时,根据默认根顶点控制边线方向
    if (this.isDirected === false) {
        var finishedVertexes = new go.List(); // 完成处理的顶点集合
        var finishedEdges = new go.List(); // 完成处理的边线集合
        var rootVertexes = this.getDefaultRootVertexes(network); // 默认根顶点集合

        // 遍历根顶点,重新设定边线的方向
        var iterator = rootVertexes.iterator;
        while (iterator.next()) {
            var vertex = iterator.value;

            if (vertex && !finishedVertexes.contains(vertex)) {
                // 控制顶点的所有边线方向
                this.controlEdgesDirection(vertex, finishedVertexes, finishedEdges);
            }
        }
    }

    return network;
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