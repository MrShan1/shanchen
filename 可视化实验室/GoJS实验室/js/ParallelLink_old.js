/// <reference path="go-debug-1.8.7.js" />

function ParallelLink() {
    go.Link.call(this);
}

go.Diagram.inherit(ParallelLink, go.Link);

ParallelLink.prototype.lastCurviness = null;

ParallelLink.prototype.linkSpacing = 30;

ParallelLink.prototype.arrowPrefixLength = 2;

ParallelLink.prototype.arrowLength = 20;

ParallelLink.prototype.arrowSmoothness = 0.75;

ParallelLink.prototype.computeSpacing = function () {
    var space = go.Link.prototype.computeSpacing.call(this);
    var realSpace = space === 0 ? space : this.linkSpacing;

    return realSpace;
};

ParallelLink.prototype.computePoints = function () {
    var result = go.Link.prototype.computePoints.call(this);

    if (!this.isOrthogonal && this.adjusting === go.Link.None && this.pointsCount !== 0) {

        var fromNode = this.fromNode;
        var toNode = this.toNode;
        var links = fromNode.findLinksBetween(toNode);
        var count = 0;
        var curviness = this.computeCurviness();

        // 计算两节点之间可见的链接数
        links.each(function (obj) {
            if (obj.isVisible()) {
                count++;
            }
        });

        if (count === 1) {
            var num = this.pointsCount;
            var fromPoint = this.getPoint(0);
            var toPoint = this.getPoint(num - 1);
            var middlePoint = this.midPoint;
            var mx = (fromPoint.x + toPoint.x) / 2;
            var my = (fromPoint.y + toPoint.y) / 2;
            middlePoint.setTo(mx, my);
        }
        else {
            if (curviness !== 0) {
                var num = this.pointsCount;
                var fromPoint = this.getPoint(0);
                var toPoint = this.getPoint(num - 1);
                var mx = (fromPoint.x + toPoint.x) / 2;
                var my = (fromPoint.y + toPoint.y) / 2;
                //var middlePointInLine = new go.Point(mx, my);
                var middlePoint = this.midPoint;
                var offsetdx = middlePoint.x - mx;
                var offsetdy = middlePoint.y - my;

                fromPoint.offset(offsetdx, offsetdy);
                toPoint.offset(offsetdx, offsetdy);
            }
        }

        if (curviness !== this.lastCurviness) {
            this.lastCurviness = curviness;
            this.computeArrowShape(count, curviness);
        }
    }
    return result;
};

ParallelLink.prototype.computeArrowShape = function (linksCount, curviness) {
    var length = this.arrowLength;
    var prefixLength = this.arrowPrefixLength;
    var totalLength = length + prefixLength;
    var smoothness = this.arrowSmoothness;

    var fromArror = this.findObject("FROM_ARROR");
    if (fromArror) {
        var geometryString = null;
        var segmentOffset = null;
        var offsetX = totalLength / 2;
        this.fromShortLength = totalLength;

        if (linksCount === 1 || curviness === 0) {
            var px0 = totalLength;
            var py0 = 0;

            var l = "l {0} {1}".format(px0, py0);
            geometryString = "M 0 0 {0}".format(l);

            segmentOffset = new go.Point(offsetX, 0);
        }
        else {
            var px0 = prefixLength;
            var py0 = 0;
            var length1 = length * smoothness / 2;
            var length2 = length * (1 - smoothness);
            var px1 = length1;
            var py1 = 0;
            var px2 = length / 2;
            var py2 = -curviness / 2;
            var px3 = length2 / 2;
            var py3 = -curviness / 2;
            var px4 = length / 2;
            var py4 = -curviness / 2;
            var offsetY = curviness / 2;

            var l = "l {0} {1}".format(px0, py0);
            var q1 = "q {0} {1} {2} {3}".format(px1, py1, px2, py2);
            var q2 = "q {0} {1} {2} {3}".format(px3, py3, px4, py4);
            geometryString = "M 0 0 {0} {1} {2}".format(l, q1, q2);

            segmentOffset = new go.Point(offsetX, offsetY);
        }

        fromArror.geometryString = geometryString;
        fromArror.segmentOffset = segmentOffset;
    }

    var toArror = this.findObject("TO_ARROR");
    if (toArror) {
        var geometryString = null;
        var segmentOffset = null;
        var offsetX = -totalLength / 2;
        this.toShortLength = totalLength;

        if (linksCount === 1 || curviness === 0) {
            var px0 = -totalLength;
            var py0 = 0;

            var l = "l {0} {1}".format(px0, py0);
            geometryString = "M 0 0 {0}".format(l);

            segmentOffset = new go.Point(offsetX, 0);
        }
        else {
            var px0 = -prefixLength;
            var py0 = 0;
            var length1 = length * smoothness / 2;
            var length2 = length * (1 - smoothness);
            var px1 = -length1;
            var py1 = 0;
            var px2 = -length / 2;
            var py2 = -curviness / 2;
            var px3 = -length2 / 2;
            var py3 = -curviness / 2;
            var px4 = -length / 2;
            var py4 = -curviness / 2;
            var offsetY = curviness / 2;

            var l = "l {0} {1}".format(px0, py0);
            var q1 = "q {0} {1} {2} {3}".format(px1, py1, px2, py2);
            var q2 = "q {0} {1} {2} {3}".format(px3, py3, px4, py4);
            geometryString = "M 0 0 {0} {1} {2}".format(l, q1, q2);

            segmentOffset = new go.Point(offsetX, offsetY);
        }

        toArror.geometryString = geometryString;
        toArror.segmentOffset = segmentOffset;
    }

    var adornedArror = this.findObject("ADORNED_ARROR");
    if (adornedArror) {
        if (linksCount === 1) {
            adornedArror.segmentOffset = new go.Point(-3, 0);
        }
        else {
            adornedArror.segmentOffset = new go.Point(-30, 0);
        }
    }
};