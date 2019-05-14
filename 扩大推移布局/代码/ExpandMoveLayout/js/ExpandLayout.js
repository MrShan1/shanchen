/// <reference path="go-debug-1.7-test.js" />

function ExpandLayout() {

};

ExpandLayout.prototype.centerBounds = null;

ExpandLayout.prototype.centerNodes = null;

ExpandLayout.prototype.centerPoint = null;

ExpandLayout.prototype.diagram = null;

ExpandLayout.prototype.movedNodes = null;

ExpandLayout.prototype.space = null;

ExpandLayout.prototype.nodeIndex = 0;

ExpandLayout.prototype.spaceIndex = 0;

ExpandLayout.prototype.doLayout = function (diagram, nodes, space) {
    this.diagram = diagram;
    var centerNodes = nodes;
    var centerBounds = diagram.computePartsBounds(nodes);
    var centerPoint = centerBounds.center;
    var max = 20000;

    // 获取需要移动的节点集合
    var movedNodes = this.getMovedNodes(diagram.nodes, nodes);

    // 获取周围关系集合
    var nearRelationList = this.getNearRelations(movedNodes, nodes);

    this.space = space;
    this.movedNodes = movedNodes;
    this.centerPoint = centerPoint;
    this.centerBounds = centerBounds;
    this.nearRelationList = nearRelationList;

    // 扩散布局
    var a = 1e3 / 10;
    var b = this;
    this.timer = setInterval(function () {
        b.nextFrame()
    }, 1)
};

ExpandLayout.prototype.getMovedNodes = function (nodes, centerNodes) {
    var list = new go.List().addAll(nodes);

    centerNodes.each(function (obj) {
        if (list.contains(obj)) {
            list.remove(obj);
        }
    });

    return list;
};

ExpandLayout.prototype.getNearRelations = function (nodes, centerNodes) {
    var relationList = [];

    var iterator = nodes.iterator;
    while (iterator.next()) {
        var node = iterator.value;
        var toNodes = this.getToNodes(node, centerNodes);

        var subRelationList = [];
        toNodes.each(function (obj) {
            var subRelation = {};
            subRelation.node = obj;
            subRelation.spaceX = obj.position.x - node.position.x;
            subRelation.spaceY = obj.position.y - node.position.y;
            subRelationList.push(subRelation);
        });

        var relation = {};
        relation.node = node;
        relation.subRelationList = subRelationList;

        relationList.push(relation);
    }

    return relationList;
};

ExpandLayout.prototype.getToNodes = function (node, centerNodes) {
    var coll = node.findNodesOutOf();
    var list = new go.List();

    coll.each(function (obj) {
        if (!centerNodes.contains(obj)) {
            list.add(obj);
        }
    });

    return list;
};

ExpandLayout.prototype.moveNodes = function (nodes, orientation, centerPoint, space) {
    var iterator = nodes.iterator;
    while (iterator.next()) {
        var node = iterator.value;

        switch (orientation) {
            case go.Spot.Left:
                node.position = new go.Point(node.position.x - space, node.position.y);
                break;
            case go.Spot.TopLeft:
                node.position = new go.Point(node.position.x - space, node.position.y - space);
                break;
            case go.Spot.BottomLeft:
                node.position = new go.Point(node.position.x - space, node.position.y + space);
                break;
            case go.Spot.Right:
                node.position = new go.Point(node.position.x + space, node.position.y);
                break;
            case go.Spot.TopRight:
                node.position = new go.Point(node.position.x + space, node.position.y - space);
                break;
            case go.Spot.BottomRight:
                node.position = new go.Point(node.position.x + space, node.position.y + space);
                break;
            case go.Spot.Top:
                node.position = new go.Point(node.position.x, node.position.y - space);
                break;
            case go.Spot.Bottom:
                node.position = new go.Point(node.position.x, node.position.y + space);
                break;
            default:
                node.position = centerPoint;
                break;
        }

    }
};

ExpandLayout.prototype.getOrientation = function (position, point) {
    if (position.x === point.x && position.y === point.y) {
        return go.Spot.Center;
    }
    else if (position.x < point.x && position.y === point.y) {
        return go.Spot.Left;
    }
    else if (position.x < point.x && position.y < point.y) {
        return go.Spot.BottomLeft;
    }
    else if (position.x < point.x && position.y > point.y) {
        return go.Spot.TopLeft;
    }
    else if (position.x > point.x && position.y === point.y) {
        return go.Spot.Right;
    }
    else if (position.x > point.x && position.y < point.y) {
        return go.Spot.TopRight;
    }
    else if (position.x > point.x && position.y > point.y) {
        return go.Spot.BottomRight;
    }
    else if (position.x === point.x && position.y < point.y) {
        return go.Spot.Top;
    }
    else if (position.x === point.x && position.y > point.y) {
        return go.Spot.Bottom;
    }

    return go.Spot.Center;
};

ExpandLayout.prototype.resumeRelations = function (nearRelationList) {
    nearRelationList.forEach(function (relation) {
        var node = relation.node;
        var subRelationList = relation.subRelationList;

        subRelationList.forEach(function (sub) {
            var toNode = sub.node;

            toNode.position = new go.Point(toNode.position.x + sub.spaceX, toNode.position.y + sub.spaceY);
        });
    });
};

ExpandLayout.prototype.nextFrame = function (nodeIndex, spaceIndex) {
    var centerBounds = this.centerBounds;
    var movedNodes = this.movedNodes;
    var centerPoint = this.centerPoint;
    var nearRelationList = this.nearRelationList;
    var space = this.space;

    if (this.nodeIndex >= movedNodes.count - 1) {
        this.stop();
        return;
    }

    var node = movedNodes.get(this.nodeIndex);

    if (centerBounds.intersectsRect(node.actualBounds)) {
        var orientation = this.getOrientation(node.position, centerPoint)
        // 移动节点
        this.moveNodes(movedNodes, orientation, centerPoint, space * (this.spaceIndex + 1));
        // 恢复周围节点
        //this.resumeRelations(nearRelationList);

        if (centerBounds.intersectsRect(node.actualBounds)) {
            this.spaceIndex++;
        }
        else {
            this.nodeIndex++;
        }
    }
    else {
        this.nodeIndex++;
    }
};

ExpandLayout.prototype.stop = function () {
    null != this.timer && window.clearInterval(this.timer)
};

function test() {
    var selection = myDiagram.selection;
    var nodes = new go.List();

    selection.each(function (obj) {
        if (obj instanceof go.Node) {
            nodes.add(obj);
        }
    });

    if (nodes.count > 0) {
        var layout = new ExpandLayout();
        layout.doLayout(myDiagram, nodes, 5);
    }
}