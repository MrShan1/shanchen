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
        var centerPoint = this.midPoint; // 获取路由中间点
        var dx = toPoint.x - fromPoint.x; // 获取两个端点在x轴上的距离
        var dy = toPoint.y - fromPoint.y; // 获取两个端点在y轴上的距离
        var ox = centerPoint.x - (fromPoint.x + dx * 0.5); // 获取中心点相对于端点路由的x轴偏移量
        var oy = centerPoint.y - (fromPoint.y + dy * 0.5); // 获取中心点相对于端点路由的y轴偏移量
        var percent = 0;

        // 获取保留长度与端点路由长度的比例
        if (dx !== 0 || dy !== 0) {
            percent = this.parallelShortLength / Math.sqrt((dx * dx) + (dy * dy));
        }

        var fromNode = this.fromNode;
        var toNode = this.toNode;
        if (fromNode === toNode && this.pointsCount === 4) {
            // 获取起始拐角点的x轴坐标
            var fromX = this.getPoint(1).x;
            // 获取起始拐角点的y轴坐标
            var fromY = this.getPoint(0).y;

            // 获取到达拐角点的x轴坐标
            var toX = this.getPoint(2).x;
            // 获取到达拐角点的y轴坐标
            var toY = this.getPoint(3).y;

            //this.clearPoints();

            //this.addPoint(new go.Point(fromPoint.x, fromPoint.y));
            //this.addPoint(new go.Point(centerPoint.x, centerPoint.y));
            //this.addPoint(new go.Point(toPoint.x, toPoint.y));

            //oy = centerPoint.y - fromPoint.y; // 获取中心点相对于端点路由的y轴偏移量

            // 添加起始拐角点
            this.insertPointAt(1, fromX, fromY);
            // 添加平行线起始点
            //this.insertPointAt(2, fromX + ox, fromY + oy);
            // 添加平行线到达点
            this.insertPointAt(4, toX, toY);
            // 添加到达拐角点
            //this.insertPointAt(5, toX, toY);
        }
        else {
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
        return new go.Geometry()
            .add(new go.PathFigure(p.x, p.y)
            .add(new go.PathSegment(go.PathSegment.Arc, -sweep / 2, sweep, 0, 0, radius + layerThickness, radius + layerThickness))
            .add(new go.PathSegment(go.PathSegment.Line, q.x, q.y))
            .add(new go.PathSegment(go.PathSegment.Arc, sweep / 2, -sweep, 0, 0, radius, radius).close()));
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