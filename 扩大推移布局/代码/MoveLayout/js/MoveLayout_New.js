﻿/// <reference path="go-debug-1.7-test.js" />

function ExpandLayout() {

};

ExpandLayout.prototype.sweep = 180;

ExpandLayout.prototype.doLayout = function (diagram, location, nodes) {
    if (!diagram || !location || !nodes || nodes.count === 0) return;

    var center = diagram.documentBounds.center;

    var mainNodes = this.getMainNodes(diagram, nodes);

    var distance = this.getDistance(nodes);

    var rect = this.getRect(diagram, nodes, distance);

    var startAngle = this.getAngle(center, location);

    var startRadius = this.hasNodeAtPoint(diagram, location) ? this.getStartDistance(rect) : 100;

    var newLocation = this.getLocation2(mainNodes, location, rect, distance, startAngle, startRadius);

    this.moveNodes(nodes, rect.center, newLocation);
};

ExpandLayout.prototype.getAngle = function (center, location) {
    if (!center || !location) return;

    //var x = location.x - center.x;
    //var y = location.y - center.y;
    //var angle = -Math.atan(x / y) / Math.PI * 180;
    var angle = center.directionPoint(location);

    return angle;
};

ExpandLayout.prototype.getDistance = function (nodes) {
    if (!nodes) return;

    var distance = Infinity;

    nodes.each(function (node) {
        var width = node.width;
        var height = node.height;

        if (distance > width) {
            distance = width;
        }

        if (distance > height) {
            distance = height;
        }
    });

    return distance;
};

ExpandLayout.prototype.getLocation = function (mainNodes, location, rect, distance, startAngle, startRadius) {
    if (!mainNodes || !location || !rect) return;

    var i = 0;
    var newLocation = null;

    while (!newLocation) {
        var r = startRadius + i * distance;
        var rotation = distance / (2 * Math.PI * r) * 360;
        var sweep = this.sweep;

        for (var angle = startAngle; angle < startAngle + sweep; angle = angle + rotation) {
            var x = location.x + r * Math.cos(angle / 180 * Math.PI);
            var y = location.y + r * Math.sin(angle / 180 * Math.PI);
            var rect = new go.Rect(x - (rect.width / 2), y - (rect.height / 2), rect.width, rect.height);

            if (!this.isHit(rect, mainNodes)) {
                newLocation = new go.Point(x, y);
                break;
            }
        }

        i++;
    }

    return newLocation;
};

ExpandLayout.prototype.getLocation2 = function (mainNodes, location, rect, distance, startAngle, startRadius) {
    if (!mainNodes || !location || !rect) return;

    var i = 0;
    var newLocation = null;

    while (!newLocation) {
        var r = startRadius + i * distance;
        var rotation = distance / (2 * Math.PI * r) * 360;
        var sweep = this.sweep / 2;

        for (var angle = 0; angle < sweep; angle = angle + rotation) {
            var currentAngle = startAngle + angle;
            var x = location.x + r * Math.cos(currentAngle / 180 * Math.PI);
            var y = location.y + r * Math.sin(currentAngle / 180 * Math.PI);
            var rect = new go.Rect(x - (rect.width / 2), y - (rect.height / 2), rect.width, rect.height);
            if (!this.isHit(rect, mainNodes)) {
                newLocation = new go.Point(x, y);
                break;
            }

            var currentAngle = startAngle - angle;
            var x = location.x + r * Math.cos(currentAngle / 180 * Math.PI);
            var y = location.y + r * Math.sin(currentAngle / 180 * Math.PI);
            var rect = new go.Rect(x - (rect.width / 2), y - (rect.height / 2), rect.width, rect.height);
            if (!this.isHit(rect, mainNodes)) {
                newLocation = new go.Point(x, y);
                break;
            }
        }

        i++;
    }

    return newLocation;
};

ExpandLayout.prototype.getMainNodes = function (diagram, nodes) {
    if (!diagram || !nodes) return;

    var list = new go.List();

    diagram.nodes.each(function (node) {
        if (!nodes.contains(node)) {
            list.add(node);
        }
    });

    return list;
};

ExpandLayout.prototype.getRect = function (diagram, nodes, distance) {
    if (!diagram || !nodes || !distance) return;

    var rect = diagram.computePartsBounds(nodes);
    var d = distance;

    rect.x = rect.x - d;
    rect.y = rect.y - d;
    rect.width = rect.width + d * 2;
    rect.height = rect.height + d * 2;

    return rect;
};

ExpandLayout.prototype.getStartDistance = function (rect) {
    if (!rect) return;

    var w = rect.width;
    var h = rect.height;
    //var distance = rect.width < rect.height ? rect.height / 2 : rect.width / 2;
    var distance = Math.sqrt(w * w + h * h) / 2;

    return distance;
};

ExpandLayout.prototype.hasNodeAtPoint = function (diagram, location) {
    if (!diagram || !location) return;

    var node = diagram.findObjectAt(
        location,
        function (obj) {
            return obj.part;
        },
        function (obj) {
            return obj instanceof go.Node;
        });

    var result = node ? true : false;

    return result;
};

ExpandLayout.prototype.isHit = function (rect, mainNodes) {
    if (!rect || !mainNodes) return;

    var isHit = false;
    var iterator = mainNodes.iterator;

    while (iterator.next()) {
        var node = iterator.value;
        if (rect.intersects(node.location.x, node.location.y, node.width, node.height)) {
            isHit = true;
            break;
        }
    }

    return isHit;
};

ExpandLayout.prototype.moveNodes = function (nodes, from, to) {
    if (!nodes || !from || !to) return;

    var dx = to.x - from.x;
    var dy = to.y - from.y;

    nodes.each(function (node) {
        var location = node.location;

        node.moveTo(location.x + dx, location.y + dy);
    });
};

function move() {
    var selection = myDiagram.selection;
    var nodes = new go.List();

    selection.each(function (obj) {
        if (obj instanceof go.Node) {
            nodes.add(obj);
        }
    });

    if (nodes.count > 0) {
        //var preLayout = new go.CircularLayout();
        //preLayout.doLayout(nodes);

        var rect = myDiagram.computePartsBounds(nodes);
        var center = rect.center;

        var layout = new ExpandLayout();
        layout.doLayout(myDiagram, center, nodes);
    }
};

function expandRelation(e, obj) {
    var currentNode = obj.part;
    var data = currentNode.data;

    var nodeArray = [];
    var linkArray = [];
    var numNodes = 5;

    for (var i = 0; i < numNodes; i++) {
        var d = {
            //key: data.key + "_" + i,
            key: go.Brush.randomColor(),
            color: go.Brush.randomColor()  // the node's color
        };
        //!!!???@@@ this needs to be customized to account for your chosen Node template
        d.bounds = new go.Rect(0, 0, 70, 20);
        nodeArray.push(d);

        var l = {
            from: data.key,
            to: d.key
        }
        linkArray.push(l);
    }

    myDiagram.model.addNodeDataCollection(nodeArray);
    myDiagram.model.addLinkDataCollection(linkArray);

    var nodes = new go.List();
    nodeArray.forEach(function (data) {
        var node = myDiagram.findNodeForData(data);
        if (node) {
            nodes.add(node);
        }
    });

    //var layout = new go.CircularLayout();
    //var layout = new go.ForceDirectedLayout();
    //var layout = new go.GridLayout();
    var layout = new go.TreeLayout();
    layout.doLayout(nodes);

    var center = currentNode.getDocumentPoint(go.Spot.Center);

    var layout = new ExpandLayout();
    layout.doLayout(myDiagram, center, nodes);
};