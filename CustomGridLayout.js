/// <reference path="go-debug-1.8.7-test.js" />

function CustomGridLayout() {
    go.Layout.call(this);
};

go.Diagram.inherit(CustomGridLayout, go.GridLayout);

CustomGridLayout.prototype.isBalanced = true;

CustomGridLayout.prototype.doLayout = function (coll) {
    if (!coll) return;

    if (!this.isBalanced) {
        go.GridLayout.prototype.doLayout.apply(this, arguments);
    }

    var parts = this.collectParts(coll);
    var nodes = new go.List();
    var startPointX = Infinity;
    var startPointY = Infinity;
    var spaceW = this.spacing.width;
    var spaceH = this.spacing.height;

    parts.each(function (part) {
        if (part.isNode && part.bounds && part.isVisible) {

            var rect = part.bounds;

            if (rect.x < startPointX) startPointX = rect.x;
            if (rect.y < startPointY) startPointY = rect.y;
            if (spaceW < rect.width) spaceW = rect.width;
            if (spaceH < rect.height) spaceH = rect.height;

            nodes.add(part);
        }
    });

    if (nodes.count === 0) return;

    var count = nodes.count;
    var wrappingColumn = Math.ceil(Math.sqrt(nodes.count));

    for (var i = 0; i < count; i++) {
        var nodeData = nodes.get(i);
        var col = i % wrappingColumn;
        var row = Math.floor(i / wrappingColumn);
        var x = startPointX + spaceW * i;
        var y = startPointY + spaceH * i;

        if (this.alignment === go.GridLayout.Location) {
            x = x - nodeData.bounds.width / 2;
            y = y - nodeData.bounds.height / 2;
        }
        

        nodeData.bounds.setPoint(new go.Point(x, y));
    }
};