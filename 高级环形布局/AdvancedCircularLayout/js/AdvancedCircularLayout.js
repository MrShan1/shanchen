/// <reference path="go-debug-1.8.7.js" />

//#region 高级环布局

/**
* 高级环布局的构造函数
*/
function AdvancedCirlcularLayout() {
    go.CircularLayout.call(this);
};
go.Diagram.inherit(AdvancedCirlcularLayout, go.CircularLayout);

/**
* 生成布局网络对象
*
* @return {AdvancedCirlcularNetwork} 高级环网络
* @override
*/
AdvancedCirlcularLayout.prototype.createNetwork = function () {
    return new AdvancedCirlcularNetwork();
};

AdvancedCirlcularLayout.prototype.commitLayout = function () {
    var centerPoint = this.actualCenter;
    var diameter = this.actualXRadius * 2;

    this.network.edges.each(function (edge) {
        var link = edge.link;
        if (link) {
            var from = edge.fromVertex.bounds.center;
            var to = edge.toVertex.bounds.center;
            var midPointX = (from.x + to.x) / 2;
            var midPointY = (from.y + to.y) / 2;
            var dx = midPointX - centerPoint.x;
            var dy = midPointY - centerPoint.y;
            var d = Math.sqrt(dx * dx + dy * dy);
            var sx = to.x - from.x;
            var sy = to.y - from.y;
            var s = Math.sqrt(sx * sx + sy * sy);
            var curviness = 0;

            if ((dy < 0 && from.x < to.x)
                || (dy > 0 && from.x > to.x)) {
                curviness = -d;
            }
            else {
                curviness = d;
            }

            var percent = (s + 50) / diameter;
            percent = percent < 0.8 ? percent : 0.8;

            link.curviness = curviness * percent;
            link.curve = go.Link.Bezier;
        }
    });

    go.CircularLayout.prototype.commitLayout.call(this);
};

//#endregion 高级环布局

//#region 高级环网络

/**
* 高级环网络的构造函数
*/
function AdvancedCirlcularNetwork() {
    go.CircularNetwork.call(this);
};
go.Diagram.inherit(AdvancedCirlcularNetwork, go.CircularNetwork);

/**
* 生成网络的边线
*
* @return {AdvancedCirlcularEdge} 高级环边线
* @override
*/
AdvancedCirlcularNetwork.prototype.createEdge = function () {
    return new AdvancedCirlcularEdge();
};

/**
* 生成网络的顶点
*
* @return {AdvancedCirlcularVertex} 高级环顶点
* @override
*/
AdvancedCirlcularNetwork.prototype.createVertex = function () {
    return new AdvancedCirlcularVertex();
};

//#endregion 高级环网络

//#region 高级环顶点

/**
* 高级环顶点的构造函数
*/
function AdvancedCirlcularVertex() {
    go.CircularVertex.call(this);
};
go.Diagram.inherit(AdvancedCirlcularVertex, go.CircularVertex);

//#endregion 高级环顶点

//#region 高级环边线

/**
* 高级环边线的构造函数
*/
function AdvancedCirlcularEdge() {
    go.CircularEdge.call(this);
};
go.Diagram.inherit(AdvancedCirlcularEdge, go.CircularEdge);

//#endregion 高级环边线