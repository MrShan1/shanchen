/// <reference path="go-debug-1.8.7.js" />

//#region 径向树布局

/**
* 径向树布局的构造函数
*/
function RadialTreeLayout() {
    go.Layout.call(this);

    this._rootKey = null;
};

// 径向树布局继承基类布局的所有属性和方法
go.Diagram.inherit(RadialTreeLayout, go.Layout);

/**
* 生成布局网络
*
* @return {RadialTreeNetwork} 径向树网络
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
    if (this.network === null) {
        this.network = this.makeNetwork(coll);
    }

    if (this.rootKey === null) {

    }
};

/**
* 获取或设置节点数
*
* @param value {String} 根节点主键
* @return {String} 根节点主键
*/
Object.defineProperty(RadialTreeLayout.prototype, "rootKey", {
    get: function () { return this._rootKey; },
    set: function (value) {
        if (this._rootKey !== value) {
            this._rootKey = value;
            this.invalidateLayout();
        }
    }
});

//#endregion 径向树布局





//#region 径向树网络

/**
* 径向树网络的构造函数
*/
function RadialTreeNetwork() {
    go.LayoutNetwork.call(this);
};

// 径向树网络继承基类布局网络的所有属性和方法
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

//#endregion 径向树网络





//#region 径向树顶点

/**
* 径向树顶点的构造函数
*/
function RadialTreeVertex() {
    go.LayoutVertex.call(this);
};

// 径向树顶点继承基类布局顶点的所有属性和方法
go.Diagram.inherit(RadialTreeVertex, go.LayoutVertex);

//#endregion 径向树顶点





//#region 径向树边线

/**
* 径向树边线的构造函数
*/
function RadialTreeEdge() {
    go.LayoutEdge.call(this);
};

// 径向树边线继承基类布局边线的所有属性和方法
go.Diagram.inherit(RadialTreeEdge, go.LayoutEdge);

//#endregion 径向树边线





//#region 径向树层

/**
* 径向树层的构造函数
*/
function RadialTreeLayer() {

};

//#endregion 径向树层