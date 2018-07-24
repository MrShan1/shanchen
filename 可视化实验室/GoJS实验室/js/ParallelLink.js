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
* @property {Number} 平行线两端的合并为一条线的宽度
*/
ParallelLink.prototype.mergedLength = 5;

/**
* @property {Number} 平行线两端的从分叉到平行的宽度
*/
ParallelLink.prototype.divergentLength = 25;

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

        if (this.fromNode === this.toNode && this.pointsCount === 4) {
            // 获取起始拐角点的x轴坐标
            var fromX = this.getPoint(fromIndex + 1).x;
            // 获取起始拐角点的y轴坐标
            var fromY = this.getPoint(fromIndex).y;

            // 获取到达拐角点的x轴坐标
            var toX = this.getPoint(toIndex - 1).x;
            // 获取到达拐角点的y轴坐标
            var toY = this.getPoint(toIndex).y;

            // 添加起始拐角点
            this.insertPointAt(fromIndex + 1, fromX, fromY);
            // 添加到达拐角点
            this.insertPointAt(toIndex + 1, toX, toY);
        }
        else {
            var fromPoint = this.getPoint(fromIndex); // 获取起始端的点
            var toPoint = this.getPoint(toIndex); // 获取到达端的点
            var centerPoint = this.midPoint; // 获取路由中间点
            var dx = toPoint.x - fromPoint.x; // 获取两个端点在x轴上的距离
            var dy = toPoint.y - fromPoint.y; // 获取两个端点在y轴上的距离
            var ox = centerPoint.x - (fromPoint.x + dx * 0.5); // 获取中心点相对于端点路由的x轴偏移量
            var oy = centerPoint.y - (fromPoint.y + dy * 0.5); // 获取中心点相对于端点路由的y轴偏移量
            var mergedLength = this.mergedLength; // 获取合并长度
            var divergentLength = this.divergentLength; // 获取分叉长度
            var startPercent = 0; // 曲线起始点对应的线长比例
            var controlPercent = 0; // 曲线控制点对应的线长比例
            var endPercent = 0; // 曲线结束点对应的线长比例
            var distance = Math.sqrt((dx * dx) + (dy * dy));

            // 获取线长比例
            if (dx !== 0 || dy !== 0) {
                startPercent = mergedLength / distance;
                controlPercent = (mergedLength + divergentLength / 2) / distance;
                endPercent = (mergedLength + divergentLength) / distance;
            }

            // 获取起始端的曲线起始点的x轴坐标
            var fromX1 = fromPoint.x + dx * startPercent;
            // 获取起始端的曲线起始点的y轴坐标
            var fromY1 = fromPoint.y + dy * startPercent;
            // 获取起始端的曲线控制点1的x轴坐标
            var fromX2 = fromPoint.x + dx * controlPercent;
            // 获取起始端的曲线控制点1的y轴坐标
            var fromY2 = fromPoint.y + dy * controlPercent;
            // 获取起始端的曲线控制点2的x轴坐标
            var fromX3 = fromPoint.x + dx * controlPercent + ox;
            // 获取起始端的曲线控制点2的y轴坐标
            var fromY3 = fromPoint.y + dy * controlPercent + oy;
            // 获取起始端的曲线结束点的x轴坐标
            var fromX4 = fromPoint.x + dx * endPercent + ox;
            // 获取起始端的曲线结束点的y轴坐标
            var fromY4 = fromPoint.y + dy * endPercent + oy;

            // 获取到达端的曲线起始点的x轴坐标
            var toX1 = fromPoint.x + dx * (1 - endPercent) + ox;
            // 获取到达端的曲线起始点的y轴坐标
            var toY1 = fromPoint.y + dy * (1 - endPercent) + oy;
            // 获取到达端的曲线控制点1的x轴坐标
            var toX2 = fromPoint.x + dx * (1 - controlPercent) + ox;
            // 获取到达端的曲线控制点1的y轴坐标
            var toY2 = fromPoint.y + dy * (1 - controlPercent) + oy;
            // 获取到达端的曲线控制点2的x轴坐标
            var toX3 = fromPoint.x + dx * (1 - controlPercent);
            // 获取到达端的曲线控制点2的y轴坐标
            var toY3 = fromPoint.y + dy * (1 - controlPercent);
            // 获取到达端的曲线结束点的x轴坐标
            var toX4 = fromPoint.x + dx * (1 - startPercent);
            // 获取到达端的曲线结束点的y轴坐标
            var toY4 = fromPoint.y + dy * (1 - startPercent);

            // 添加起始端的的曲线起始点
            this.insertPointAt(fromIndex + 1, fromX1, fromY1);
            // 添加起始端的的曲线控制点1
            this.insertPointAt(fromIndex + 2, fromX2, fromY2);
            // 添加起始端的的曲线控制点2
            this.insertPointAt(fromIndex + 3, fromX3, fromY3);
            // 添加起始端的的曲线到达点
            this.insertPointAt(fromIndex + 4, fromX4, fromY4);

            // 添加到达端的的曲线起始点
            this.insertPointAt(toIndex + 4, toX1, toY1);
            // 添加到达端的的曲线控制点1
            this.insertPointAt(toIndex + 5, toX2, toY2);
            // 添加到达端的的曲线控制点2
            this.insertPointAt(toIndex + 6, toX3, toY3);
            // 添加到达端的的曲线到达点
            this.insertPointAt(toIndex + 7, toX4, toY4);
        }
    }

    return result;
};

//ParallelLink.prototype.getLinkPoint = function (node, port, spot, from, ortho, othernode, otherport) {
//    if (this.fromNode === this.toNode) {
//        var point = new go.Point(NaN, NaN);

//        if (from === true) {
//            var startPoint = this.fromNode.port.getDocumentPoint(go.Spot.Left);

//            point.set(startPoint);
//        }
//        else {
//            var endPoint = this.toNode.port.getDocumentPoint(go.Spot.Right);

//            point.set(endPoint);
//        }

//        return point;
//    }
//    else {
//        return go.Link.prototype.getLinkPoint.apply(this, arguments);
//    }
//};

ParallelLink.prototype.computeCurve = function () {
    if (this.fromNode === this.toNode) {
        return go.Link.Normal;
    }
    else {
        return go.Link.prototype.computeCurve.apply(this, arguments);
    }
};

ParallelLink.prototype.makeGeometry = function () {
    if (this.fromNode === this.toNode) {
        return go.Link.prototype.makeGeometry.apply(this, arguments);
    }
    else {
        if (this.pointsCount === 11) {
            var fromP0 = this.getPoint(0);
            var fromP1 = this.getPoint(1);
            var fromP2 = this.getPoint(2);
            var fromP3 = this.getPoint(3);
            var fromP4 = this.getPoint(4);
            var midP = this.getPoint(5);
            var toP0 = this.getPoint(6);
            var toP1 = this.getPoint(7);
            var toP2 = this.getPoint(8);
            var toP3 = this.getPoint(9);
            var toP4 = this.getPoint(10);

            var path = new go.PathFigure(fromP0.x, fromP0.y, false);
            path.add(new go.PathSegment(go.PathSegment.Line, fromP1.x, fromP1.y));
            path.add(new go.PathSegment(go.PathSegment.Bezier, fromP4.x, fromP4.y, fromP2.x, fromP2.y, fromP3.x, fromP3.y));
            path.add(new go.PathSegment(go.PathSegment.Line, midP.x, midP.y));
            path.add(new go.PathSegment(go.PathSegment.Line, toP0.x, toP0.y));
            path.add(new go.PathSegment(go.PathSegment.Bezier, toP3.x, toP3.y, toP1.x, toP1.y, toP2.x, toP2.y));
            path.add(new go.PathSegment(go.PathSegment.Line, toP4.x, toP4.y));

            var geo = new go.Geometry().add(path);
            geo.normalize();
        }
        else {
            var path = null;
            for (var i = 0, length = this.pointsCount; i < length; i++) {
                var p = this.getPoint(i);

                if (path === null) {
                    path = new go.PathFigure(p.x, p.y, false);
                }
                else {
                    path.add(new go.PathSegment(go.PathSegment.Line, p.x, p.y));
                }
            }

            var geo = new go.Geometry().add(path);
            geo.normalize();
        }


        return geo;
    }
};

ParallelLink.prototype.computeSpot = function (from, port) {
    if (this.fromNode === this.toNode) {
        return from === true ? go.Spot.Right : go.Spot.Left;
    }
    else {
        return go.Link.prototype.computeSpot.apply(this, arguments);
    }
};

ParallelLink.prototype.computeCurviness = function (from, port) {
    if (this.fromNode === this.toNode) {
        var links = this.fromNode.findLinksBetween(this.toNode);
        var index = 0;
        var iterator = links.iterator;

        while (iterator.next()) {
            var link = iterator.value;

            if (this === link) {
                break;
            }
            else {
                index++;
            }
        }

        var height = this.fromNode.actualBounds.height;

        return height / 2 + 10 + index * 15;
    }
    else {
        return go.Link.prototype.computeCurviness.apply(this, arguments);
    }
};

//#endregion 平行链接