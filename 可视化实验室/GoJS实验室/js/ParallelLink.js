/// <reference path="go-debug-1.8.7.js" />

//#region 平行链接

/**
* 链接的构造函数
*/
function ParallelLink() {
    go.Link.call(this);
}
go.Diagram.inherit(ParallelLink, go.Link);

ParallelLink.prototype.parallelShortLength = 20;

ParallelLink.prototype.computePoints = function () {
    var result = go.Link.prototype.computePoints.call(this);

    if (result === true && !this.isOrthogonal && this.curve !== go.Link.Bezier) {
        var fromIndex = 0;
        var toIndex = this.pointsCount - 1;
        var fromPoint = this.getPoint(fromIndex);
        var toPoint = this.getPoint(toIndex);
        var dx = toPoint.x - fromPoint.x;
        var dy = toPoint.y - fromPoint.y;
        var ox = this.midPoint.x - (fromPoint.x + dx * 0.5);
        var oy = this.midPoint.y - (fromPoint.y + dy * 0.5);
        var percent = 0;

        if (dx !== 0 && dy !== 0) {
            percent = this.parallelShortLength / Math.sqrt((dx * dx) + (dy * dy));
        }

        var fromX = fromPoint.x + dx * percent;
        var fromY = fromPoint.y + dy * percent;

        var toX = fromPoint.x + dx * (1 - percent);
        var toY = fromPoint.y + dy * (1 - percent);

        this.insertPointAt(fromIndex + 1, fromX, fromY);
        this.insertPointAt(fromIndex + 2, fromX + ox, fromY + oy);
        this.insertPointAt(toIndex + 2, toX + ox, toY + oy);
        this.insertPointAt(toIndex + 3, toX, toY);
    }

    return result;
};

//#endregion 平行链接