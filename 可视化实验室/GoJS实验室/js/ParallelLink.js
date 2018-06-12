/// <reference path="go-debug-1.8.7.js" />

//#region 平行链接

/**
* 链接的构造函数
*/
function ParallelLink() {
    go.Link.call(this);
}
go.Diagram.inherit(ParallelLink, go.Link);

/**
* @property {Number} 平行线两端的用于收缩的保留长度
*/
ParallelLink.prototype.parallelShortLength = 20;

/**
* 计算链接路由上的点
*
* @return {Boolean} 是否计算了路由上的点
* @override
*/
ParallelLink.prototype.computePoints = function () {
    var result = go.Link.prototype.computePoints.call(this);

    if (result === true && !this.isOrthogonal && this.curve !== go.Link.Bezier) {
        var fromIndex = 0;
        var toIndex = this.pointsCount - 1;
        var fromPoint = this.getPoint(fromIndex); // 获取起始端的点
        var toPoint = this.getPoint(toIndex); // 获取到达端的点
        var dx = toPoint.x - fromPoint.x; // 获取两个端点在x轴上的距离
        var dy = toPoint.y - fromPoint.y; // 获取两个端点在y轴上的距离
        var ox = this.midPoint.x - (fromPoint.x + dx * 0.5); // 获取中心点相对于端点路由的x轴偏移量
        var oy = this.midPoint.y - (fromPoint.y + dy * 0.5); //  获取中心点相对于端点路由的y轴偏移量
        var percent = 0;

        // 获取保留长度与端点路由长度的比例
        if (dx !== 0 && dy !== 0) {
            percent = this.parallelShortLength / Math.sqrt((dx * dx) + (dy * dy));
        }

        // 获取起始拐角点的x轴坐标
        var fromX = fromPoint.x + dx * percent;
        // 获取起始拐角点的y轴坐标
        var fromY = fromPoint.y + dy * percent;

        // 获取到达拐角点的x轴坐标
        var toX = fromPoint.x + dx * (1 - percent);
        // 获取到达拐角点的y轴坐标
        var toY = fromPoint.y + dy * (1 - percent);

        // 添加起始拐角点
        this.insertPointAt(fromIndex + 1, fromX, fromY);
        // 添加平行线起始点
        this.insertPointAt(fromIndex + 2, fromX + ox, fromY + oy);
        // 添加平行线到达点
        this.insertPointAt(toIndex + 2, toX + ox, toY + oy);
        // 添加到达拐角点
        this.insertPointAt(toIndex + 3, toX, toY);
    }

    return result;
};

//#endregion 平行链接