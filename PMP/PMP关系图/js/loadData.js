/// <reference path="go.js" />

function init() {
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
      $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
        {
            initialContentAlignment: go.Spot.Center,
            allowDrop: true,  // must be true to accept drops from the Palette
            "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
            "LinkRelinked": showLinkLabel,
            "animationManager.duration": 800, // slightly longer than default (600ms) animation
            "undoManager.isEnabled": true,  // enable undo & redo
            "grid.visible": false,
            //layout: $(go.ForceDirectedLayout, {

            //}),
            grid:
                $(go.Panel, "Grid",
                    {
                        gridCellSize: new go.Size(20, 20)
                    }
                    //$(go.Shape, "LineH",
                    //{
                    //    stroke: "lightgray"
                    //}),
                    //$(go.Shape, "LineV",
                    //{
                    //    stroke: "lightgray"
                    //})
            ),
            "draggingTool.isGridSnapEnabled": true,
            "draggingTool.gridSnapCellSpot": go.Spot.Left,
            "commandHandler.archetypeGroupData": {
                zOrder: 0,
                text: "Group",
                isGroup: true,
                color: "blue",
                editable: true,
                background: "red"
            }
        });// end Group and call to add to template Map


    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function (e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
            if (idx < 0) document.title += "*";
        } else {
            if (idx >= 0) document.title = document.title.substr(0, idx);
        }
    });

    // helper definitions for node templates

    function nodeStyle() {
        return [
          // The Node.location comes from the "loc" property of the node data,
          // converted by the Point.parse static method.
          // If the Node.location is changed, it updates the "loc" property of the node data,
          // converting back using the Point.stringify static method.
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          {
              // the Node.location is at the center of each node
              locationSpot: go.Spot.Center,
              zOrder: 10,
              //isShadowed: true,
              //shadowColor: "#888",
              // handle mouse enter/leave events to show/hide the ports
              mouseEnter: function (e, obj) { showPorts(obj.part, true); },
              mouseLeave: function (e, obj) { showPorts(obj.part, false); },
              selectionChanged: function (node) {
                  var diagram = node.diagram;
                  var scale = 1 / diagram.scale;
                  var nodeDataArray = [];
                  var linkDataArray = [];

                  diagram.clearHighlighteds();

                  diagram.nodes.each(function (obj) {
                      obj.opacity = 0.2;
                  });

                  diagram.links.each(function (obj) {
                      obj.opacity = 0;
                  });

                  var isHighlighted = node.isSelected;
                  //node.data.isInput = true;
                  node.data.isMain = isHighlighted;
                  node.isHighlighted = isHighlighted;
                  node.opacity = 1;
                  node.scale = scale;

                  nodeDataArray.push(node.data);

                  node.findLinksInto().each(function (link) {
                      link.data.isInput = true;
                      link.isHighlighted = isHighlighted;
                      link.opacity = 1;

                      var otherNode = link.getOtherNode(node);
                      otherNode.data.isInput = true;
                      otherNode.isHighlighted = isHighlighted;
                      otherNode.opacity = 1;
                      otherNode.scale = scale;

                      linkDataArray.push(link.data);
                      nodeDataArray.push(otherNode.data);
                  });

                  node.findLinksOutOf().each(function (link) {
                      link.data.isInput = false;
                      link.isHighlighted = isHighlighted;
                      link.opacity = 1;

                      var otherNode = link.getOtherNode(node);
                      otherNode.data.isInput = false;
                      otherNode.isHighlighted = isHighlighted;
                      otherNode.opacity = 1;
                      otherNode.scale = scale;

                      linkDataArray.push(link.data);
                      nodeDataArray.push(otherNode.data);
                  });

                  if (!isHighlighted) {
                      diagram.nodes.each(function (obj) {
                          obj.opacity = 1;
                          obj.scale = 1;
                      });

                      diagram.links.each(function (obj) {
                          obj.opacity = 1;
                      });
                  }

                  myDiagramSmall.clear();
                  myDiagramSmall.model.addNodeDataCollection(nodeDataArray);
                  myDiagramSmall.model.addLinkDataCollection(linkDataArray);
              },
          }
        ];
    }

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
    function makePort(name, spot, output, input) {
        // the port is basically just a small circle that has a white stroke when it is made visible
        return $(go.Shape, "Circle",
                 {
                     fill: "transparent",
                     stroke: null,  // this is changed to "white" in the showPorts function
                     desiredSize: new go.Size(8, 8),
                     alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                     portId: name,  // declare this object to be a "port"
                     fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                     fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                     cursor: "pointer"  // show a different cursor to indicate potential link point
                 });
    }

    // define the Node templates for regular nodes

    var lightText = 'whitesmoke';

    myDiagram.nodeTemplateMap.add("",  // the default category
      $(go.Node, "Spot", nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        $(go.Panel, "Auto",
          $(go.Shape, "Rectangle",
            {
                fill: "#00A9C9",
                stroke: null,
                strokeWidth: 2
            },
            new go.Binding("figure", "figure"),
            new go.Binding("stroke", "isHighlighted", function (data, obj) {
                var color = obj.part.data.isInput ? "red" : "green";
                if (obj.part.data.isMain) {
                    color = "yellow";
                }

                return data ? color : "whitesmoke";
            }).ofObject(),
            new go.Binding("fill", "color").makeTwoWay()),
          $(go.TextBlock,
            {
                name: "TEXTBLOCK",
                font: "bold 11pt Helvetica, Arial, sans-serif",
                stroke: "#000",
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
            },
            new go.Binding("text").makeTwoWay())
        ),
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, false)
      ));

    myDiagram.nodeTemplateMap.add("Start",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }),
          $(go.TextBlock, "Start",
            {
                editable: true,
                font: "bold 11pt Helvetica, Arial, sans-serif",
                stroke: lightText
            },
            new go.Binding("text"))
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("L", go.Spot.Left, true, false),
        makePort("R", go.Spot.Right, true, false),
        makePort("B", go.Spot.Bottom, true, false)
      ));

    myDiagram.nodeTemplateMap.add("End",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null }),
          $(go.TextBlock, "End",
            {
                editable: true,
                font: "bold 11pt Helvetica, Arial, sans-serif",
                stroke: lightText
            },
            new go.Binding("text"))
        ),
        // three named ports, one on each side except the bottom, all input only:
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, false, true),
        makePort("R", go.Spot.Right, false, true)
      ));

    myDiagram.nodeTemplateMap.add("Comment",
      $(go.Node, "Auto", nodeStyle(),
        $(go.Shape, "File",
          { fill: "#EFFAB4", stroke: null }),
        $(go.TextBlock,
          {
              margin: 5,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: true,
              font: "bold 12pt Helvetica, Arial, sans-serif",
              stroke: '#454545'
          },
          new go.Binding("text").makeTwoWay())
        // no ports, because no links are allowed to connect with a comment
      ));


    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {
            routing: go.Link.Orthogonal,
            curve: go.Link.None,
            corner: 5, toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            zOrder: 5,
            // mouse-overs subtly highlight links:
            mouseEnter: function (e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
            mouseLeave: function (e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
        },
        new go.Binding("points").makeTwoWay(),
        $(go.Shape,  // the highlight shape, normally transparent
          { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
        $(go.Shape,  // the link path shape
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
          new go.Binding("stroke", "isHighlighted", function (data, obj) {
              var color = obj.part.data.isInput ? "red" : "green";

              return data ? color : "whiteSmoke";
          }).ofObject()
          ),
        $(go.Shape,  // the arrowhead
          { toArrow: "standard", stroke: null, fill: "gray" },
          new go.Binding("stroke", "isHighlighted", function (data, obj) {
              var color = obj.part.data.isInput ? "red" : "green";

              return data ? color : "gray";
          }).ofObject()),
        $(go.Panel, "Auto",  // the link label, normally not visible
          { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
          new go.Binding("visible", "visible").makeTwoWay(),
          $(go.Shape, "RoundedRectangle",  // the label shape
            { fill: "#F8F8F8", stroke: null }),
          $(go.TextBlock, "Yes",  // the label
            {
                textAlign: "center",
                font: "10pt helvetica, arial, sans-serif",
                stroke: "#333333",
                editable: true
            },
            new go.Binding("text").makeTwoWay())
        )
      );

    // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
    function showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
    }

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

    //load();  // load an initial diagram from some JSON text

    // initialize the Palette that is on the left side of the page
    myPalette =
      $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
        {
            "animationManager.duration": 800, // slightly longer than default (600ms) animation
            nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
            model: new go.GraphLinksModel([  // specify the contents of the Palette
              { category: "Start", text: "Start" },
              { text: "Step" },
              { text: "???", figure: "Diamond" },
              { category: "End", text: "End" },
              { category: "Comment", text: "Comment" }
            ])
        });

    myDiagramSmall =
     $(go.Diagram, "myDiagramDivSmall",  // must name or refer to the DIV HTML element
       {
           contentAlignment: go.Spot.Center,
           allowDrop: true,  // must be true to accept drops from the Palette
           "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
           "LinkRelinked": showLinkLabel,
           "animationManager.duration": 800, // slightly longer than default (600ms) animation
           "undoManager.isEnabled": true,  // enable undo & redo
           "grid.visible": false,
           layout: $(go.LayeredDigraphLayout, {

           }),
       });

    myDiagramSmall.nodeTemplate =
        $(go.Node, "Spot",
            {
                doubleClick: function (e, obj) {
                    myDiagram.clearSelection();
                    var node = myDiagram.findNodeForData(obj.data);
                    myDiagram.select(node);
                }
            },
            $(go.TextBlock,
                {
                    name: "TEXTBLOCK",
                    font: "bold 11pt Helvetica, Arial, sans-serif",
                    stroke: "#000",
                    margin: 8,
                    maxSize: new go.Size(160, NaN),
                    wrap: go.TextBlock.WrapFit,
                    //editable: true
                },
                new go.Binding("text"),
                new go.Binding("stroke", "color")
            )
        )


    myDiagramSmall.model = new go.GraphLinksModel();

    jQuery.getJSON("json/PMPData.js", load);
}

// Make all ports on a node visible when the mouse is over the node
function showPorts(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function (port) {
        port.stroke = (show ? "white" : null);
    });
}

// Show the diagram's model in JSON format that the user may edit
function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
}

// load data
function load(data) {
    //myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    myDiagram.model = go.Model.fromJson(data)
}

// add an SVG rendering of the diagram at the end of this page
function makeSVG() {
    var svg = myDiagram.makeSvg({
        scale: 0.5
    });
    svg.style.border = "1px solid black";
    obj = document.getElementById("SVGArea");
    obj.appendChild(svg);
    if (obj.children.length > 0) {
        obj.replaceChild(svg, obj.children[0]);
    }
}

var index = -1;
var count = 0;
var searchText = null;
var nodeDatas = [];
// search
function search() {
    if (!myDiagram) return;

    var text = jQuery("#searchText").val().trim();
    if (!text) {
        searchText = null;
        nodeDatas = [];

        index = 0;
        count = 0;

        jQuery("#index").html(index);
        jQuery("#count").html(count);

        myDiagram.clearSelection();

        return;
    }

    if (text !== searchText) {
        searchText = text;
        nodeDatas = [];

        var nodeDataArray = myDiagram.model.nodeDataArray;
        var length = nodeDataArray.length;

        for (var i = 0; i < length; i++) {
            var data = nodeDataArray[i];

            if (!data.isGroup && data.text.indexOf(searchText) >= 0) {
                nodeDatas.push(data);
            }
        }

        if (nodeDatas.length === 0) {
            searchText = null;
            nodeDatas = [];

            index = 0;
            count = 0;

            jQuery("#index").html(index);
            jQuery("#count").html(count);

            myDiagram.clearSelection();

            return;
        }

        count = nodeDatas.length;
        index = 0;
    }
    else {
        index++;

        if (count === index) {
            index = 0;
        }
    }

    jQuery("#index").html(index + 1);
    jQuery("#count").html(count);

    if (index >= 0) {
        var currentData = nodeDatas[index];
        var node = myDiagram.findNodeForData(currentData);
        myDiagram.select(node);
        myDiagram.commandHandler.scrollToPart(node);
    }
}

// 按回车检索
window.onkeydown = function () {
    if (event.keyCode == 13) {
        search();
    }
};