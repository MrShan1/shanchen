/// <reference path="go-debug-1.8.7.js" />

//#region 平行链接

/**
* 平行链接的构造函数
*/
function ParallelLink() {
    go.Link.call(this);

    // 链接起始端的曲线控制点1
    this.fromDivergenceControlPoint1 = null;
    // 链接起始端的曲线控制点2
    this.fromDivergenceControlPoint2 = null;
    // 链接到达端的曲线控制点1
    this.toDivergenceControlPoint1 = null;
    // 链接到达端的曲线控制点2
    this.toDivergenceControlPoint2 = null;
}
go.Diagram.inherit(ParallelLink, go.Link);

/**
* @property {Number} 平行线两端的从分叉到平行的宽度
*/
ParallelLink.prototype.divergenceLength = 15;

/**
* @property {Boolean} 分叉为曲线表示
*
* true表示曲线,false表示直线
*/
ParallelLink.prototype.isDivergenceBezier = true;

/**
* @property {Number} 平行线两端的合并为一条线的宽度
*/
ParallelLink.prototype.mergedLength = 5;

/**
* @property {Number} 自反链接的间距
*/
ParallelLink.prototype.reflexiveLinkSpace = 20;

/**
* 复制链接
*
* @param {ParallelLink} copy 要进行复制的链接
* @override
*/
ParallelLink.prototype.cloneProtected = function (copy) {
    go.Link.prototype.cloneProtected.apply(this, arguments);

    copy.divergenceLength = this.divergenceLength;
    copy.isDivergenceBezier = this.isDivergenceBezier;
    copy.mergedLength = this.mergedLength;
    copy.reflexiveLinkSpace = this.reflexiveLinkSpace;
};

/**
* 计算设置链接路由点的方式
*
* @return {go.EnumValue} 链接线类型
* @override
*/
ParallelLink.prototype.computeCurve = function () {
    // 自反链接时,强行改为折线模式
    if (this.fromNode === this.toNode) {
        return go.Link.None;
    }
    else {
        return go.Link.prototype.computeCurve.apply(this, arguments);
    }
};

/**
* 计算链接的偏移量
*
* @param {Boolean} from 起始端标识
* @param {go.GraphObject} port 作为端口的对象
* @return {go.Spot} 端点
* @override
*/
ParallelLink.prototype.computeCurviness = function (from, port) {
    // 自反链接时,需要手动计算偏移量
    if (this.fromNode === this.toNode) {
        var links = this.fromNode.findLinksBetween(this.toNode);
        var height = this.fromNode.actualBounds.height;
        var space = this.reflexiveLinkSpace;
        var index = 0;
        var iterator = links.iterator;
        var curviness = 0;

        // 多个自反链接时,需要获取当前自反链接的排位
        while (iterator.next()) {
            var link = iterator.value;

            if (this === link) {
                break;
            }
            else {
                index++;
            }
        }

        // 计算偏移量
        curviness = height / 2 + 15 + index * space;

        return curviness;
    }
    else {
        return go.Link.prototype.computeCurviness.apply(this, arguments);
    }
};

/**
* 计算链接路由上的点
*
* @return {Boolean} 是否完成路由点的计算
* @override
*/
ParallelLink.prototype.computePoints = function () {
    var result = go.Link.prototype.computePoints.call(this);

    // 只有go.Link.Normal时,才绘制平行线
    if (result === true && !this.isOrthogonal && this.curve !== go.Link.Bezier) {
        var fromIndex = 0;
        var toIndex = this.pointsCount - 1;

        // 自反链接时,单独处理
        if (this.fromNode === this.toNode) {
            // 获取链接起始端拐角点的x轴坐标
            var fromX = this.getPoint(fromIndex + 1).x;
            // 获取链接起始端拐角点的y轴坐标
            var fromY = this.getPoint(fromIndex).y;

            // 获取链接到达端拐角点的x轴坐标
            var toX = this.getPoint(toIndex - 1).x;
            // 获取链接到达端拐角点的y轴坐标
            var toY = this.getPoint(toIndex).y;

            // 添加链接路由点
            this.insertPointAt(fromIndex + 1, fromX, fromY);
            this.insertPointAt(toIndex + 1, toX, toY);
        }
        else {
            var fromP = this.getPoint(fromIndex); // 获取起始端的点
            var toP = this.getPoint(toIndex); // 获取到达端的点
            var centerP = this.midPoint; // 获取路由中间点
            var dx = toP.x - fromP.x; // 获取两个端点在x轴上的距离
            var dy = toP.y - fromP.y; // 获取两个端点在y轴上的距离
            var ox = centerP.x - (fromP.x + dx * 0.5); // 获取中心点相对于端点路由的x轴偏移量
            var oy = centerP.y - (fromP.y + dy * 0.5); // 获取中心点相对于端点路由的y轴偏移量
            var mergedLength = this.mergedLength; // 获取合并长度
            var divergenceLength = this.divergenceLength; // 获取分叉长度
            var startPercent = 0; // 曲线起始点对应的线长比例
            var controlPercent = 0; // 曲线控制点对应的线长比例
            var endPercent = 0; // 曲线结束点对应的线长比例
            var distance = Math.sqrt((dx * dx) + (dy * dy)); // 起始点与结束点的间距长度

            // 获取线长比例
            if (dx !== 0 || dy !== 0) {
                startPercent = mergedLength / distance;
                controlPercent = (mergedLength + divergenceLength / 2) / distance;
                endPercent = (mergedLength + divergenceLength) / distance;
            }

            // 获取链接起始端的曲线起始点的x轴坐标
            var fromSPX = fromP.x + dx * startPercent;
            // 获取链接起始端的曲线起始点的y轴坐标
            var fromSPY = fromP.y + dy * startPercent;
            // 获取链接起始端的曲线结束点的x轴坐标
            var fromEPX = fromP.x + dx * endPercent + ox;
            // 获取链接起始端的曲线结束点的y轴坐标
            var fromEPY = fromP.y + dy * endPercent + oy;

            // 获取链接到达端的曲线起始点的x轴坐标
            var toSPX = fromP.x + dx * (1 - endPercent) + ox;
            // 获取链接到达端的曲线起始点的y轴坐标
            var toSPY = fromP.y + dy * (1 - endPercent) + oy;
            // 获取链接到达端的曲线结束点的x轴坐标
            var toEPX = fromP.x + dx * (1 - startPercent);
            // 获取链接到达端的曲线结束点的y轴坐标
            var toEPY = fromP.y + dy * (1 - startPercent);

            // 添加链接路由点
            this.insertPointAt(fromIndex + 1, fromSPX, fromSPY);
            this.insertPointAt(fromIndex + 2, fromEPX, fromEPY);
            this.insertPointAt(toIndex + 2, toSPX, toSPY);
            this.insertPointAt(toIndex + 3, toEPX, toEPY);

            // 分叉为曲线时，需要设置曲线控制点
            if (this.isDivergenceBezier === true) {
                // 获取起始端的曲线控制点1的x轴坐标
                var fromCP1X = fromP.x + dx * controlPercent;
                // 获取起始端的曲线控制点1的y轴坐标
                var fromCP1Y = fromP.y + dy * controlPercent;
                // 获取起始端的曲线控制点2的x轴坐标
                var fromCP2X = fromP.x + dx * controlPercent + ox;
                // 获取起始端的曲线控制点2的y轴坐标
                var fromCP2Y = fromP.y + dy * controlPercent + oy;

                // 获取到达端的曲线控制点1的x轴坐标
                var toCP1X = fromP.x + dx * (1 - controlPercent) + ox;
                // 获取到达端的曲线控制点1的y轴坐标
                var toCP1Y = fromP.y + dy * (1 - controlPercent) + oy;
                // 获取到达端的曲线控制点2的x轴坐标
                var toCP2X = fromP.x + dx * (1 - controlPercent);
                // 获取到达端的曲线控制点2的y轴坐标
                var toCP2Y = fromP.y + dy * (1 - controlPercent);

                // 设置控制点
                this.fromDivergenceControlPoint1 = new go.Point(fromCP1X, fromCP1Y);
                this.fromDivergenceControlPoint2 = new go.Point(fromCP2X, fromCP2Y);
                this.toDivergenceControlPoint1 = new go.Point(toCP1X, toCP1Y);
                this.toDivergenceControlPoint2 = new go.Point(toCP2X, toCP2Y);
            }
        }
    }

    return result;
};

/**
* 计算链接两端的端点
*
* @param {Boolean} from 起始端标识
* @param {go.GraphObject} port 作为端口的对象
* @return {go.Spot} 端点
* @override
*/
ParallelLink.prototype.computeSpot = function (from, port) {
    if (this.fromNode === this.toNode) {
        return from === true ? go.Spot.Right : go.Spot.Left;
    }
    else {
        return go.Link.prototype.computeSpot.apply(this, arguments);
    }
};

/**
* 绘制链接图形
*
* @return {go.Geometry} 链接图形
* @override
*/
ParallelLink.prototype.makeGeometry = function () {
    if (this.fromNode === this.toNode) {
        return go.Link.prototype.makeGeometry.apply(this, arguments);
    }
    else {
        var fromIndex = 0;
        var toIndex = this.pointsCount - 1;
        var geo = new go.Geometry();

        if (this.pointsCount === 7 && this.isDivergenceBezier === true) {
            var fromCP1 = this.fromDivergenceControlPoint1; // 获取链接起始端的曲线控制点1
            var fromCP2 = this.fromDivergenceControlPoint2; // 获取链接起始端的曲线控制点2
            var toCP1 = this.toDivergenceControlPoint1;// 获取链接到达端的曲线控制点1
            var toCP2 = this.toDivergenceControlPoint2;// 获取链接到达端的曲线控制点2

            // 获取路由上的点
            var fromP = this.getPoint(fromIndex);
            var fromSP = this.getPoint(fromIndex + 1);
            var fromEP = this.getPoint(fromIndex + 2);
            var midP = this.getPoint(fromIndex + 3);
            var toSP = this.getPoint(toIndex - 2);
            var toEP = this.getPoint(toIndex - 1);
            var toP = this.getPoint(toIndex);

            // 创建链接线(平滑曲线)
            var path = new go.PathFigure(fromP.x, fromP.y, false);
            path.add(new go.PathSegment(go.PathSegment.Line, fromSP.x, fromSP.y));
            path.add(new go.PathSegment(go.PathSegment.Bezier, fromEP.x, fromEP.y, fromCP1.x, fromCP1.y, fromCP2.x, fromCP2.y));
            path.add(new go.PathSegment(go.PathSegment.Line, midP.x, midP.y));
            path.add(new go.PathSegment(go.PathSegment.Line, toSP.x, toSP.y));
            path.add(new go.PathSegment(go.PathSegment.Bezier, toEP.x, toEP.y, toCP1.x, toCP1.y, toCP2.x, toCP2.y));
            path.add(new go.PathSegment(go.PathSegment.Line, toP.x, toP.y));

            // 绘制链接的几何图形
            geo.add(path);
            geo.normalize();

            // 清空控制点
            this.fromDivergenceControlPoint1 = null;
            this.fromDivergenceControlPoint2 = null;
            this.toDivergenceControlPoint1 = null;
            this.toDivergenceControlPoint2 = null;
        }
        else {
            var path = null;

            // 创建链接线(折线)
            for (var i = fromIndex; i <= toIndex; i++) {
                var p = this.getPoint(i);

                if (path === null) {
                    path = new go.PathFigure(p.x, p.y, false);
                }
                else {
                    path.add(new go.PathSegment(go.PathSegment.Line, p.x, p.y));
                }
            }

            // 绘制链接的几何图形
            geo.add(path);
            geo.normalize();
        }

        return geo;
    }
};

//#endregion 平行链接