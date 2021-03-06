﻿/// <reference path="go-debug-1.8.7.js" />

var $ = go.GraphObject.make;
var diagram = null;

function init() {
    createDiagram();

    createLayout();

    loadData();
};

function createDiagram() {
    diagram =
        $(go.Diagram, "diagramDiv",
            {
                initialAutoScale: go.Diagram.Uniform,
                contentAlignment: go.Spot.Center,
                "undoManager.isEnabled": false,
                "animationManager.isEnabled": true,
                //isTreePathToChildren: false,
            }
        );

    diagram.layout = createLayout();

    diagram.model = new go.GraphLinksModel();

    diagram.nodeTemplate =
        $(go.Node, "Auto",
            {
                //isLayoutPositioned: false,
                width: 50,
                height: 50,
                locationSpot: go.Spot.Center,
            },
            //new go.Binding("position", "position", go.Point.parse).makeTwoWay(go.Point.stringify),
            //new go.Binding("position", "bounds", function (b) {
            //    return b.position;
            //}).makeTwoWay(function (p, d) {
            //    return new go.Rect(p.x, p.y, d.bounds.width, d.bounds.height);
            //}),
            new go.Binding("width", "importance", function (data, obj) {
                return obj.width * data;
            }),
            new go.Binding("height", "importance", function (data, obj) {
                return obj.height * data;
            }),
            $(go.Shape, "Circle",
                {
                    portId: "",
                    fromLinkable: true,
                    fromLinkableDuplicates: true,
                    toLinkable: true,
                    toLinkableDuplicates: true,
                    fromLinkableSelfNode: true,
                    toLinkableSelfNode: true,
                },
                new go.Binding("fill", "color")
            ),
            $(go.TextBlock,
                {
                    margin: 2
                },
                new go.Binding("text", "key"),
                new go.Binding("scale", "importance", function (data, obj) {
                    return 1 * data;
                })
            )
        );

    diagram.linkTemplate =
        $(go.Link,
            {
                //isLayoutPositioned: false
                relinkableFrom: true,
                relinkableTo: true,
                //routing: go.Link.Orthogonal,
                routing: go.Link.Normal,
                //curve: go.Link.Bezier,
            },
            $(go.Shape),
            $(go.Shape,
                  {
                      toArrow: "Standard",
                      //stroke: "black",
                      fill: "black",
                      //strokeWidth: 2
                  }
            )
        );
};

function createLayout() {
    var layout =
        $(AdvancedTreeLayout,
            {
                //isInitial: true,
                //isOngoing: false,
                isRouting: false,
                setsChildPortSpot: false,
                setsPortSpot: false,
                isDirected: false,
            }
        );

    return layout;
};

function loadData() {
    var model = diagram.model;

    generateNodes(model, 20, 20);
    generateLinks(model, 1, 5);

    diagram.nodes.each(function (node) {
        var count = node.findTreeParts().count;
        //var count = node.findLinksOutOf().count;
        var importance = 1;

        if (count < 100) {
            importance = 1 + Math.floor(count * 100 / 5) / 100 * 0.2;
        }
        else {
            importance = 1 + Math.floor(count * 100 / 5) / 100 * 0.1;
        }

        diagram.model.setDataProperty(node.data, "importance", importance);
    });

    diagram.layoutDiagram(true);
};

function generateNodes(model, min, max) {
    if (isNaN(min) || min < 0) min = 2;
    if (isNaN(max) || max < min) max = min;
    var nodeArray = [];
    var numNodes = Math.floor(Math.random() * (max - min + 1)) + min;
    for (var i = 0; i < numNodes; i++) {
        var d = {
            key: i.toString(),
            color: go.Brush.randomColor()  // the node's color
        };
        //!!!???@@@ this needs to be customized to account for your chosen Node template
        d.bounds = new go.Rect(0, 0, 70, 20);
        nodeArray.push(d);
    }

    model.nodeDataArray = nodeArray;
    //model.addNodeDataCollection(nodeArray);
};

function generateLinks(model, min, max) {
    if (model.nodeDataArray.length < 2) return;
    if (isNaN(min) || min < 1) min = 1;
    if (isNaN(max) || max < min) max = min;
    var linkArray = [];
    // make two Lists of nodes to keep track of where links already exist
    var nodes = new go.List();
    nodes.addAll(model.nodeDataArray);
    var available = new go.List();
    available.addAll(nodes);
    for (var i = 0; i < nodes.length; i++) {
        var next = nodes.elt(i);
        available.remove(next)
        var children = Math.floor(Math.random() * (max - min + 1)) + min;
        for (var j = 1; j <= children; j++) {
            if (available.length === 0) break;
            var to = available.elt(0);
            available.remove(to);
            linkArray.push({
                from: next.key,
                to: to.key
            });
        }
    }

    model.linkDataArray = linkArray;
    //model.addLinkDataCollection(linkArray);
};