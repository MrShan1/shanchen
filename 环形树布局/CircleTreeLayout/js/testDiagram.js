/// <reference path="go-debug-1.8.7.js" />
/// <reference path="testDiagram.js" />

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
                allowDrop: true,
                mouseDrop: function (e) { finishDrop(e, null); },
                "commandHandler.archetypeGroupData": { text: "Group", isGroup: true, color: "blue" },
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
                mouseDrop: function (e, nod) { finishDrop(e, nod.containingGroup); },
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
                //routing: go.Link.Orthogonal,
                relinkableFrom: true,
                relinkableTo: true,
                routing: go.Link.Normal,
                //curve: go.Link.Bezier,
                //adjusting: go.Link.None
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

    diagram.groupTemplate =
        $(go.Group, "Auto",
            {
                background: "transparent",
                ungroupable: true,
                computesBoundsAfterDrag: true,
                mouseDragEnter: function (e, grp, prev) { highlightGroup(e, grp, true); },
                mouseDragLeave: function (e, grp, next) { highlightGroup(e, grp, false); },
                mouseDrop: finishDrop,
                handlesDragDropForMembers: true,
                layout:
                      $(RadialTreeLayout,
                          {
                              //isInitial: true,
                              //isOngoing: false,
                              //isDirected: false,
                              //treeSweepAngle: 180,
                              vertexSpacing: RadialTreeLayout.RootChildrenLoose,
                          }
                      ),
            },
            new go.Binding("background", "isHighlighted", function (h) {
                return h ? "rgba(255,0,0,0.2)" : "transparent";
            }).ofObject(),
            $(go.Shape, "Circle",
                {
                    fill: "#FFDD33",
                    stroke: "#FFDD33",
                    strokeWidth: 2
                }
            ),
            $(go.Panel, "Vertical",
                //$(go.Panel, "Horizontal",
                //    {
                //        stretch: go.GraphObject.Horizontal,
                //        background: "#FFDD33"
                //    },
                //    $("SubGraphExpanderButton",
                //        {
                //            alignment: go.Spot.Right,
                //            margin: 5
                //        }
                //    ),
                //    $(go.TextBlock,
                //        {
                //          alignment: go.Spot.Left,
                //          editable: true,
                //          margin: 5,
                //          font: "bold 16px sans-serif",
                //          opacity: 0.75,
                //          stroke: "#404040"
                //        },
                //        new go.Binding("text", "text").makeTwoWay()
                //    )
                //),
                $(go.Placeholder,
                    {
                        padding: 5,
                        alignment: go.Spot.TopLeft
                    }
                )
            )
        );
};

function createLayout() {
    var layout =
        $(RadialTreeLayout,
            {
                //isInitial: true,
                //isOngoing: false,
                isDirected: false,
                //treeSweepAngle: 180,
                //treeLeafLayer: RadialTreeLayout.OutermostLayer,
                //vertexSpacing: RadialTreeLayout.RootChildrenLoose,
            }
        );

    return layout;
};

function loadData() {
    var model = diagram.model;

    generateNodes(model, 300, 300);
    generateLinks(model, 1, 5);

    diagram.nodes.each(function (node) {
        computeNodeWeight(node);
    });

    diagram.nodes.each(function (node) {
        var weight = node.totalWeight;
        var importance = 1;
        //var p = 5;
        var p = 1;

        if (weight < 100) {
            importance = 1 + Math.floor(weight * 100 / p) / 100 * 0.2;
        }
        else {
            importance = 1 + Math.floor(weight * 100 / p) / 100 * 0.1;
        }

        diagram.model.setDataProperty(node.data, "importance", importance);
    });

    //diagram.nodes.each(function (node) {
    //    var count = node.findTreeParts().count;
    //    //var count = node.findLinksOutOf().count;
    //    var importance = 1;

    //    if (count < 100) {
    //        importance = 1 + Math.floor(count * 100 / 5) / 100 * 0.2;
    //    }
    //    else {
    //        importance = 1 + Math.floor(count * 100 / 5) / 100 * 0.1;
    //    }

    //    diagram.model.setDataProperty(node.data, "importance", importance);
    //});

    diagram.layoutDiagram(true);
};

function computeNodeWeight(node) {
    var weightFunction = "findNodesConnected";
    //var weightFunction = "findTreeParts";

    if (node.totalWeight === undefined) node.totalWeight = 0;

    var neiborNodes = node[weightFunction]();

    if (node.selfWeight === undefined && neiborNodes.count > 0) {
        var weight = neiborNodes.count;

        //var level = node.findTreeLevel() + 1;
        //weight += 10 / (level * level);

        node.selfWeight = weight;
        node.totalWeight += node.selfWeight;
    }

    var standbyNodes = new go.List();
    var finishedNodes = new go.List();
    var weight = node.selfWeight - 1;

    standbyNodes.add(node);

    while (weight >= 1 && standbyNodes.count > 0) {
        var wholeNeighborNodes = new go.Set();

        standbyNodes.each(function (stanby) {
            finishedNodes.add(stanby);

            if (stanby.neighborWeight === undefined) stanby.neighborWeight = 0;
            if (stanby.totalWeight === undefined) stanby.totalWeight = 0;

            stanby.neighborWeight += weight;
            stanby.totalWeight += weight;

            var neighborNodes = stanby.findNodesConnected();
            neighborNodes.each(function (neighbor) {
                if (!standbyNodes.contains(neighbor) && !finishedNodes.contains(neighbor)) {
                    wholeNeighborNodes.add(neighbor);
                }
            });
        });

        weight -= 1;

        standbyNodes.clear();
        standbyNodes.addAll(wholeNeighborNodes);
    }

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

function highlightGroup(e, grp, show) {
    if (!grp) return;
    e.handled = true;
    if (show) {
        // cannot depend on the grp.diagram.selection in the case of external drag-and-drops;
        // instead depend on the DraggingTool.draggedParts or .copiedParts
        var tool = grp.diagram.toolManager.draggingTool;
        var map = tool.draggedParts || tool.copiedParts;  // this is a Map
        // now we can check to see if the Group will accept membership of the dragged Parts
        if (grp.canAddMembers(map.toKeySet())) {
            grp.isHighlighted = true;
            return;
        }
    }
    grp.isHighlighted = false;
};

function finishDrop(e, grp) {
    var ok = (grp !== null
              ? grp.addMembers(grp.diagram.selection, true)
              : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
    if (!ok) e.diagram.currentTool.doCancel();
};