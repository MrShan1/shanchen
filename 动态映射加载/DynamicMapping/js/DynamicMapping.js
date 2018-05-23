/// <reference path="go-debug-1.8.7-test.js" />

var $ = go.GraphObject.make;
var diagram = null;
var wholeDiagram = null;
var loading = null;
var startTime = null;
var endTime = null;

function init() {
    createDiagram();

    createWholeDiagram();

    loading =
        $(go.Part,
            {
                location: new go.Point(0, 0)
            },
            $(go.TextBlock, "loading...",
                {
                    stroke: "red",
                    font: "20pt sans-serif"
                }
            )
        );
};

function load() {
    diagram.add(loading);

    diagram.delayInitialization(loadData)
};

function loadData() {
    //var model = new go.GraphLinksModel();
    //wholeDiagram.layout.model = model;

    var model = wholeDiagram.model;

    generateNodes(model, 3000, 3000);
    generateLinks(model, 5, 5);

    //wholeDiagram.layoutDiagram(true);

    diagram.remove(loading);

    layout();
};

function layout() {
    startTime = new Date();

    wholeDiagram.layoutDiagram(true);
    //wholeDiagram.layout.doLayout();
    //wholeDiagram.model.addNodeDataCollection(wholeDiagram.layout.model.nodeDataArray);
    //wholeDiagram.model.addLinkDataCollection(wholeDiagram.layout.model.linkDataArray);

    endTime = new Date();

    //console.log(endTime - startTime);
    alert(endTime - startTime);

    dynamicInsert();

    dynamicDelete();

    showCount();
};

function generateNodes(model, min, max) {
    if (isNaN(min) || min < 0) min = 2;
    if (isNaN(max) || max < min) max = min;
    var nodeArray = [];
    var numNodes = Math.floor(Math.random() * (max - min + 1)) + min;
    for (var i = 0; i < numNodes; i++) {
        var d = {
            key: i,
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

function createDiagram() {
    diagram =
        $(go.Diagram, "diagramDiv",
            {
                contentAlignment: go.Spot.Center,
                //layout:
                //    $(go.ForceDirectedLayout,
                //        {
                //            //isInitial: true,
                //            //isOngoing: false
                //        }
                //    ),
                "undoManager.isEnabled": false
            }
        );

    diagram.model = new go.GraphLinksModel();

    diagram.nodeTemplate =
        $(go.Node, "Auto",
            {
                //isLayoutPositioned: false,
                width: 70,
                height: 20
            },
            new go.Binding("position", "position", go.Point.parse).makeTwoWay(go.Point.stringify),
            //new go.Binding("position", "bounds", function (b) {
            //    return b.position;
            //}).makeTwoWay(function (p, d) {
            //    return new go.Rect(p.x, p.y, d.bounds.width, d.bounds.height);
            //}),
            $(go.Shape, "Rectangle",
                new go.Binding("fill", "color")
            ),
            $(go.TextBlock,
                {
                    margin: 2
                },
                new go.Binding("text", "color")
            )
        );

    diagram.linkTemplate =
        $(go.Link,
            {
                //isLayoutPositioned: false
            },
            $(go.Shape)
        );
};

function createWholeDiagram() {
    wholeDiagram =
        $(go.Diagram,
            //"wholeDiagramDiv",
            {
                //contentAlignment: go.Spot.Center,
                layout:
                    $(go.ForceDirectedLayout,
                        {
                            isInitial: false,
                            isOngoing: false
                        }
                    ),
                //layout:
                //    $(VirtualizedForceDirectedLayout,
                //        {
                //            isInitial: false,
                //            isOngoing: false
                //        }
                //    ),
                //layout:
                //    $(go.CircularLayout,
                //        {
                //            isInitial: false,
                //            isOngoing: false,
                //            sorting: go.CircularLayout.Forwards
                //        }
                //    ),
                //layout:
                //    $(go.LayeredDigraphLayout,
                //        {
                //            isInitial: false,
                //            isOngoing: false,
                //        }
                //    ),
                //layout:
                //    $(go.TreeLayout,
                //        {
                //            isInitial: false,
                //            isOngoing: false
                //        }
                //    ),
                //layout:
                //    $(go.GridLayout,
                //        {
                //            isInitial: false,
                //            isOngoing: false,
                //            wrappingColumn: 10
                //        }
                //    ),
                "undoManager.isEnabled": false,
                "animationManager.isEnabled": false
            }
        );

    //var div = document.createElement("div");
    //div.id = "tempDiv";
    //div.style.display = "none";
    //wholeDiagram.div = div;
    //document.body.appendChild(div);

    wholeDiagram.model = new go.GraphLinksModel();

    wholeDiagram.nodeTemplate =
        $(go.Node, "Auto",
            {
                width: 70,
                height: 20,
                //visible: false
            },
            new go.Binding("position", "position", go.Point.parse).makeTwoWay(go.Point.stringify),
             //new go.Binding("position", "bounds", function (b) {
             //    return b.position;
             //}).makeTwoWay(function (p, d) {
             //    return new go.Rect(p.x, p.y, d.bounds.width, d.bounds.height);
             //}),
            $(go.Shape, "Rectangle",
                {

                }
                ,
                new go.Binding("fill", "color")
            )
            ,
            $(go.TextBlock,
                {
                    margin: 2
                },
                new go.Binding("text", "color")
            )
        );

    wholeDiagram.linkTemplate =
        $(go.Link,
            {
                //visible: false
            },
            $(go.Shape)
        );
};

function dynamicInsert() {
    requestAnimationFrame(dynamicInsert);

    diagram.fixedBounds = wholeDiagram.documentBounds;

    var bounds = diagram.viewportBounds;
    var coll = wholeDiagram.findObjectsIn(bounds);
    var nodes = [];
    var links = [];

    coll.each(function (obj) {
        var part = obj.part;
        if (part.data) {
            if (part instanceof go.Node && !diagram.findNodeForData(part.data)) {
                nodes.push(part.data);
            }
            else if (part instanceof go.Link && !diagram.findLinkForData(part.data)) {
                links.push(part.data);
            }
        }

    });

    diagram.model.addNodeDataCollection(nodes);
    diagram.model.addLinkDataCollection(links);
};

function dynamicDelete() {
    requestAnimationFrame(dynamicDelete);

    var bounds = diagram.viewportBounds;
    var nodes = new go.Set();
    var links = new go.Set();

    diagram.nodes.each(function (node) {
        if (!node.actualBounds.intersectsRect(bounds)) {
            if (!node.linksConnected.any(function (otherNode) { return otherNode.actualBounds.intersectsRect(bounds); })) {
                nodes.add(node.data);
                node.linksConnected.each(function (link) {
                    links.add(link.data);
                });
            }
        }
    });

    diagram.model.removeNodeDataCollection(nodes.toArray());
    diagram.model.removeLinkDataCollection(links.toArray());
};

function isNodeIntersectsRect(node, rect) {
    var isIntersect = node.actualBounds.intersectsRect(rect);

    return isIntersect;
};

function isLinkIntersectsRect(link, rect) {
    var isIntersect = false;
    var unionRect = new go.Rect().set(link.fromNode.actualBounds).unionRect(link.toNode.actualBounds);
    isIntersect = unionRect.intersectsRect(rect);

    return isIntersect;
};

function showCount() {
    requestAnimationFrame(showCount);

    document.getElementById("nodesCount").innerHTML = diagram.nodes.count;
    document.getElementById("linksCount").innerHTML = diagram.links.count;
};

function doTreeLayout() {
    var layout = new go.TreeLayout();
    layout.isOngoing = false;
    layout.isInitial = false;

    wholeDiagram.layout = layout;
    wholeDiagram.layoutDiagram(true);
};

function doLayout() {
    wholeDiagram.layoutDiagram(true);
};

function computeDocumentBounds(model) {
    var b = new go.Rect();
    var ndata = model.nodeDataArray;
    for (var i = 0; i < ndata.length; i++) {
        var d = ndata[i];
        if (!d.bounds) continue;
        if (i === 0) {
            b.set(d.bounds);
        } else {
            b.unionRect(d.bounds);
        }
    }
    return b;
}

//#region VirtualizedForceDirected
// Here we try to replace the dependence of ForceDirectedLayout on Nodes
// with depending only on the data in the GraphLinksModel.
function VirtualizedForceDirectedLayout() {
    go.ForceDirectedLayout.call(this);
    this.isOngoing = false;
    this.model = null;  // add this property for holding the whole GraphLinksModel
}
go.Diagram.inherit(VirtualizedForceDirectedLayout, go.ForceDirectedLayout);

/** @override */
VirtualizedForceDirectedLayout.prototype.createNetwork = function () {
    return new VirtualizedForceDirectedNetwork();  // defined below
};

// ignore the argument, an (implicit) collection of Parts
/** @override */
VirtualizedForceDirectedLayout.prototype.makeNetwork = function (coll) {
    var net = this.createNetwork();
    net.addData(this.model);  // use the model data, not any actual Nodes and Links
    return net;
};

/** @override */
VirtualizedForceDirectedLayout.prototype.commitLayout = function () {
    go.ForceDirectedLayout.prototype.commitLayout.call(this);
    // can't depend on regular bounds computation that depends on all Nodes existing
    this.diagram.fixedBounds = computeDocumentBounds(this.model);
    // update the positions of any existing Nodes
    this.diagram.nodes.each(function (node) {
        node.updateTargetBindings();
    });
};
// end VirtualizedForceDirectedLayout class


function VirtualizedForceDirectedNetwork() {
    go.ForceDirectedNetwork.call(this);
}
go.Diagram.inherit(VirtualizedForceDirectedNetwork, go.ForceDirectedNetwork);

VirtualizedForceDirectedNetwork.prototype.addData = function (model) {
    if (model instanceof go.GraphLinksModel) {
        var dataVertexMap = new go.Map();
        // create a vertex for each node data
        var ndata = model.nodeDataArray;
        for (var i = 0; i < ndata.length; i++) {
            var d = ndata[i];
            var v = this.createVertex();
            v.data = d;  // associate this Vertex with data, not a Node
            dataVertexMap.add(model.getKeyForNodeData(d), v);
            this.addVertex(v);
        }
        // create an edge for each link data
        var ldata = model.linkDataArray;
        for (var i = 0; i < ldata.length; i++) {
            var d = ldata[i];
            // now find corresponding vertexes
            var from = dataVertexMap.getValue(model.getFromKeyForLinkData(d));
            var to = dataVertexMap.getValue(model.getToKeyForLinkData(d));
            if (from === null || to === null) continue;  // skip
            // create and add VirtualizedForceDirectedEdge
            var e = this.createEdge();
            e.data = d;  // associate this Edge with data, not a Link
            e.fromVertex = from;
            e.toVertex = to;
            this.addEdge(e);
        }
    } else {
        throw new Error("can only handle GraphLinksModel data");
    }
};

/** @override */
VirtualizedForceDirectedNetwork.prototype.deleteArtificialVertexes = function () { };
// end VirtualizedForceDirectedNetwork class

// end of VirtualizedForceDirected[Layout/Network] classes
//#endregion