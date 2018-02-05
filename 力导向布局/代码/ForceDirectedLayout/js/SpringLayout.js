/// <reference path="go-debug-1.7-test.js" />

function SpringLayout() {

};

SpringLayout.prototype.spring = 0.1;

SpringLayout.prototype.friction = 0.8;

SpringLayout.prototype.gravity = 0;

SpringLayout.prototype.charge = 0;

SpringLayout.prototype.wind = 0;

SpringLayout.prototype.minLength = 0;

SpringLayout.prototype.e = 0;

SpringLayout.prototype.interactions = [];

SpringLayout.prototype.timer = null;

SpringLayout.prototype.isPause = !1;

SpringLayout.prototype.diagram = null;

SpringLayout.prototype.fixedParts = new go.Set(go.Part);

SpringLayout.prototype.doLayout = function (diagram) {
    if (!diagram) return;

    this.diagram = diagram;

    //this.spring = this.spring || .1;
    //this.friction = this.friction || .8,
    //this.gravity = this.gravity || 0,
    this.e = (this.wind || 0, this.minLength || 0);

    this.createInteractions(diagram.nodes);

    this.doPrefixLayout(diagram);

    this.play();
};

SpringLayout.prototype.createInteractions = function (nodes) {
    if (!nodes) return;

    while (nodes.next()) {
        var node = nodes.value;

        if (this.fixedParts.contains(node)) continue;

        var nodesConnected = node.findNodesInto();
        while (nodesConnected.next()) {
            var nodeConnected = nodesConnected.value;
            this.addNode(node, nodeConnected);
        }
    }
};

SpringLayout.prototype.addNode = function (node, targetNode) {
    var c = {
        node: node,
        target: targetNode,
        vx: 0,
        vy: 0
    };
    return this.interactions.push(c), this;
};

SpringLayout.prototype.doPrefixLayout = function (diagram) {
    var layout = new go.CircularLayout();
    layout.spacing = 300;
    layout.radius = 400;
    layout.arrangement = go.CircularLayout.ConstantDistance;

    layout.doLayout(this.fixedParts);
};

SpringLayout.prototype.play = function (a) {
    //var d = 1e3 / 24;
    //var d = 1e3 / 50;
    var d = 1e3 / 100;
    this.stop(), a = null == a ? d : a;
    var b = this;
    this.timer = setInterval(function () {
        b.nextFrame()
    }, a)
};

SpringLayout.prototype.stop = function () {
    null != this.timer && window.clearInterval(this.timer)
};

SpringLayout.prototype.nextFrame = function () {
    //this.diagram.startTransaction("SpringLayout");

    for (var a = 0; a < this.interactions.length; a++) {
        var f = this.interactions[a],
            g = f.node,
            h = f.target,
            i = f.vx,
            j = f.vy,
            k = h.location.x - g.location.x,
            l = h.location.y - g.location.y,
            m = Math.atan2(l, k);

        if (this.diagram.toolManager.draggingTool.draggedParts && this.diagram.toolManager.draggingTool.draggedParts.contains(g)) {
            continue;
        }

        // 计算节点之间的斥力
        var param = 50;
        var nodes = this.diagram.nodes;
        var fixedParts = this.fixedParts;
        nodes.each(function (node) {
            if (g !== node && !fixedParts.contains(node)) {
                var distX = node.location.x - g.location.x;
                var distY = node.location.y - g.location.y;
                var dist = Math.sqrt(distX * distX + distY * distY);

                if (dist < 100) {
                    var moveX = distX / dist * param * param / dist * 2;
                    var moveY = distY / dist * param * param / dist * 2;

                    node.moveTo(node.location.x + moveX, node.location.y + moveY);
                }
            }
        });


        if (0 != this.e) {
            var n = h.location.x - Math.cos(m) * this.e;
            var o = h.location.y - Math.sin(m) * this.e;

            i += (n - g.location.x) * this.spring;
            j += (o - g.location.y) * this.spring;
        }
        else {
            i += k * this.spring;
            j += l * this.spring;
        }

        i *= this.friction;
        j *= this.friction;
        j += this.gravity; // 重力垂直向下
        //g.location.x += i;
        //g.location.y += j;
        g.moveTo(g.location.x + i, g.location.y + j);
        f.vx = i;
        f.vy = j;
    }

    //this.diagram.commitTransaction("SpringLayout");
};