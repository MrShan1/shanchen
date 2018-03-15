/// <reference path="go-debug-1.7-test.js" />

function ExpandLayout() {

};

ExpandLayout.prototype.doLayout = function (diagram, center, nodes) {
    if (!diagram || !center || !nodes) return;

    var diagramCenter = diagram.documentBounds.center;

};

ExpandLayout.prototype.getAngle = function (center,location) {

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

        var layout = new ExpandLayout();
        layout.doLayout(myDiagram, nodes, 20);
    }
}