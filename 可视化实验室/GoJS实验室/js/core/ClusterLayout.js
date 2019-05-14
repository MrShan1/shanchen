/// <reference path="../3rd/go-debug-1.8.7.js" />

//#region 群集布局

/**
 * 群集布局的构造函数
 */
function ClusterLayout() {
    go.ForceDirectedLayout.call(this);
};
go.Diagram.inherit(ClusterLayout, go.ForceDirectedLayout);

/**
 * 生成布局网络
 *
 * @return {ClusterNetwork} 群集布局网络
 * @override
 */
ClusterLayout.prototype.createNetwork = function () {
    return new ClusterNetwork();
};

//#endregion 群集布局

//#region 群集布局网络

/**
 * 群集布局网络的构造函数
 */
function ClusterNetwork() {
    go.ForceDirectedLayout.call(this);
};
go.Diagram.inherit(ClusterNetwork, go.ForceDirectedEdge);

/**
 * 生成布局网络的边线
 *
 * @return {ClusterEdge} 群集边线
 * @override
 */
ClusterNetwork.prototype.createEdge = function () {
    return new ClusterEdge();
};

/**
 * 生成布局网络的顶点
 *
 * @return {ClusterVertex} 群集顶点
 * @override
 */
ClusterNetwork.prototype.createVertex = function () {
    return new ClusterVertex();
};

//#endregion 群集布局网络

//#region 群集顶点

/**
 * 群集顶点的构造函数
 */
function ClusterVertex() {
    go.ForceDirectedVertex.call(this);
};
go.Diagram.inherit(ClusterVertex, go.ForceDirectedVertex);

//#endregion 群集顶点

//#region 群集边线

/**
 * 群集边线的构造函数
 */
function ClusterEdge() {
    go.ForceDirectedEdge.call(this);
};
go.Diagram.inherit(ClusterEdge, go.ForceDirectedEdge);

//#endregion 群集边线