/// <reference path="go-debug-1.8.7.js" />

//#region 径向树布局

/**
* 径向树布局的构造函数
*/
function RadialTreeLayout() {
    go.Layout.call(this);

    // 预定义根顶点对应的节点集合
    this.defaultRootNodes = new go.List();
    // 根顶点集合
    this.rootVertexes = new go.List();
    // 是否为有向树标识
    this._isDirected = true;
    // 叶顶点所在层
    this._treeLeafLayer = RadialTreeLayout.DefaultLayer;
    // 叶顶点所在层
    this._vertexSpacing = RadialTreeLayout.Compact;
    // 径向树集合
    this.trees = new go.List();
};
go.Diagram.inherit(RadialTreeLayout, go.Layout);

/**
* 叶顶点所在层之一
*
* @property {go.EnumValue} 叶顶点所在层_默认层
*/
RadialTreeLayout.DefaultLayer = new go.EnumValue(RadialTreeLayout, "DefaultLayer", 10);

/**
* 叶顶点所在层之一
*
* @property {go.EnumValue} 叶顶点所在层_最外层
*/
RadialTreeLayout.OutermostLayer = new go.EnumValue(RadialTreeLayout, "OutermostLayer", 11);

/**
* 同层顶点间距之一
*
* @property {go.EnumValue} 同层顶点间距_紧密
*/
RadialTreeLayout.Compact = new go.EnumValue(RadialTreeLayout, "Compact", 20);

/**
* 同层顶点间距之一
*
* @property {go.EnumValue} 同层顶点间距_松散
*/
RadialTreeLayout.Loose = new go.EnumValue(RadialTreeLayout, "Loose", 21);

/**
* 同层顶点间距之一
*
* @property {go.EnumValue} 同层顶点间距_仅叶顶点紧密
*/
RadialTreeLayout.TreeLeafCompact = new go.EnumValue(RadialTreeLayout, "TreeLeafCompact", 22);

/**
* 同层顶点间距之一
*
* @property {go.EnumValue} 同层顶点间距_仅根顶点的子顶点松散
*/
RadialTreeLayout.RootChildrenLoose = new go.EnumValue(RadialTreeLayout, "RootChildrenLoose", 33);

/**
* @property {Number} 层级之间的增量间距
*/
RadialTreeLayout.prototype.incrementLayerSpacing = 5;

/**
* @property {Number} 层级之间的间距
*/
RadialTreeLayout.prototype.layerSpacing = 100;

/**
* @property {Number} 同层顶点之间的最小间距
*/
RadialTreeLayout.prototype.minVertexSpacing = 20;

/**
* @property {Number} 树的起始角度
*/
RadialTreeLayout.prototype.treeStartAngle = -180;

/**
* @property {Number} 树之间的间距
*/
RadialTreeLayout.prototype.treeSpacing = 100;

/**
* @property {Number} 树的扫描角度
*/
RadialTreeLayout.prototype.treeSweepAngle = 360;

/**
* 添加子树
*
* @param {RadialTree} tree 目标树
*/
RadialTreeLayout.prototype.addTree = function (tree) {
    // 将目标树添加子树集合中
    this.trees.add(tree);

    // 指定目标树的所属网络
    tree.layout = this;
};

/**
* 给网络中的树分配位置
*
* 默认横向排列
*/
RadialTreeLayout.prototype.arrangeTrees = function () {
    if (this.trees.count === 0) return;

    var trees = this.trees;
    var treeCount = trees.count;
    var firstX = trees.first().bounds.center.x;
    var firstY = trees.first().bounds.center.y;
    var index = 1;
    var distanceX = 0;
    var distanceY = 0;

    while (index < treeCount) {
        var beforeTree = trees.get(index - 1);
        var tree = trees.get(index);

        // 计算当前树中心与第一个树中心的x轴距离
        distanceX += beforeTree.bounds.width / 2 + this.treeSpacing + tree.bounds.width / 2;
        // 计算当前树中心与第一个树中心的y轴距离
        distanceY = distanceY;

        // 计算当前树相对于起始位置的x轴偏移量
        var offsetX = firstX + distanceX - tree.bounds.center.x;
        // 计算当前树相对于起始位置的y轴偏移量
        var offsetY = firstY + distanceY - tree.bounds.center.y;

        // 移动树中所有顶点位置
        tree.moveAllVertexes(offsetX, offsetY);

        index++;
    }
};

/**
* 为顶点创建径向树
*
* @param {RadialTreeVertex} vertex 径向树顶点
* @param {Boolean} isRelateChildrenOnly 是否只关联后代
*/
RadialTreeLayout.prototype.buildTreeForVertex = function (vertex, isRelateChildrenOnly) {
    // 为目标顶点创建树形关系
    var treeVertexes = this.bulidTreeRelationForVertex(vertex, isRelateChildrenOnly);

    // 创建径向树
    var tree = new RadialTree(treeVertexes);

    // 将径向树添加进子树集合中
    this.addTree(tree);

    // 初始化径向树
    tree.initialize();
};

/**
* 为顶点构建树形关系
*
* 目标顶点为根顶点时，只关联子代；中间顶点时，则需要关联父代和子代。
* 目标顶点的父顶点需要关联父代和子代，目标顶点的子顶点只需要关联后代。
*
* @param {RadialTreeVertex} vertex 径向树顶点
* @param {Boolean} isRelateChildrenOnly 是否只关联后代
* @return {go.List} 目标顶点的树形关系所包含的顶点集合
*/
RadialTreeLayout.prototype.bulidTreeRelationForVertex = function (vertex, isRelateChildrenOnly) {
    var coll = new go.List(); // 目标顶点的树形关系所包含的顶点集合

    // 目标顶点已在树形关系中
    vertex.isInTreeRelation = true;

    // 将目标顶点添加进集合中
    coll.add(vertex);

    // 需要关联父代关系
    if (!isRelateChildrenOnly) {
        // 设置父顶点
        var parent = this.setParentForVertex(vertex);

        if (parent !== null) {
            // 为父顶点构建树形关系
            var treeVertexes = this.bulidTreeRelationForVertex(parent, false);
            // 将父顶点的树形关系集合添加进集合中
            coll.addAll(treeVertexes);
        }
    }

    // 设置子顶点集合
    var children = this.setChildrenForVertex(vertex);

    // 为每个子顶点设置树形关系
    var iterator = children.iterator;
    while (iterator.next()) {
        var child = iterator.value;

        // 为子顶点设置树形关系
        var treeVertexes = this.bulidTreeRelationForVertex(child, true);
        // 将子顶点的树形关系集合添加进集合中
        coll.addAll(treeVertexes);
    }

    return coll;
};

/**
* 创建布局网络的所有子树
*
* 根据默认的根顶点集合，将所有顶点分配到对应的子树中
*
* @param {go.List} defaultRoots 根顶点集合
*/
RadialTreeLayout.prototype.buildTrees = function (defaultRoots) {
    var layout = this;
    var network = this.network;
    var isRelateChildrenOnly = false;

    // 有向树时，所有目标顶点均视为中间顶点，关联父代和子代关系
    if (this.isDirected === true) {
        isRelateChildrenOnly = false;
    }
        // 无向树时，所有目标顶点均视为根顶点，只关联子代关系
    else {
        isRelateChildrenOnly = true;
    }

    // 优先为预设定顶点创建关系树
    defaultRoots.each(function (vertex) {
        if (vertex.isInTreeRelation === true) return;

        // 为顶点创建径向树
        layout.buildTreeForVertex(vertex, isRelateChildrenOnly);

    });

    // 为网络中的所有顶点创建关系树
    network.vertexes.each(function (vertex) {
        if (vertex.isInTreeRelation === true) return;

        // 为顶点创建径向树
        layout.buildTreeForVertex(vertex, isRelateChildrenOnly);
    });
};

/**
* 复制布局模板
*
* @param {RadialTreeLayout} copy 要进行复制的布局
* @override
*/
RadialTreeLayout.prototype.cloneProtected = function (copy) {
    go.Layout.prototype.cloneProtected.apply(this, arguments);

    copy._isDirected = this._isDirected;
    copy._treeLeafLayer = this._treeLeafLayer;
    copy._vertexSpacing = this._vertexSpacing;
};

/**
* 生成布局网络
*
* @return {RadialTreeNetwork} 径向树网络
* @override
*/
RadialTreeLayout.prototype.createNetwork = function () {
    return new RadialTreeNetwork();
};

/**
* 执行布局
*
* @param {Diagram|Group|Iterable} coll 要进行布局的数据集合
* @override
*/
RadialTreeLayout.prototype.doLayout = function (coll) {
    // 创建网络
    if (this.network === null) {
        this.network = this.makeNetwork(coll);
    }

    // 获取默认的根顶点集合
    var defaultRoots = this.getDefaultRootVertexes();

    // 创建布局网络的所有子树
    this.buildTrees(defaultRoots);

    // 给所有树分配位置
    this.arrangeTrees();

    // 清空默认根节点
    this.defaultRootNodes.clear();

    // 清空树集合
    this.trees.clear();

    this.updateParts();
    this.network = null;
};

/**
* 获取默认的根顶点集合
*
* @return {go.List} 根顶点集合
*/
RadialTreeLayout.prototype.getDefaultRootVertexes = function () {
    if (this.network === null) return new go.Set();

    var coll = new go.Set();

    var iterator = this.defaultRootNodes.iterator;
    while (iterator.next()) {
        var node = iterator.value;
        var vertex = this.network.findVertex(node);

        if (vertex) {
            coll.add(vertex);
        }
    }

    return coll;
};

/**
* 为顶点设置父顶点
*
* @param {RadialTreeVertex} vertex 目标顶点
* @return {RadialTreeVertex} 父顶点
*/
RadialTreeLayout.prototype.setParentForVertex = function (vertex) {
    if (vertex.parent !== null) return null;

    // 获取顶点的来源顶点集合
    var iterator = vertex.sourceVertexes.iterator;
    var parent = null;

    while (iterator.next()) {
        parent = iterator.value;

        // 将第一个尚未建立树形关系的来源顶点，作为该顶点的父顶点
        if (parent.isInTreeRelation === false) {
            // 设置父顶点
            vertex.parent = parent;

            break;
        }
    }

    return parent;
};

/**
* 为顶点设置子顶点集合
*
* @param {RadialTreeVertex} vertex 目标顶点
* @return {go.List} 子顶点集合
*/
RadialTreeLayout.prototype.setChildrenForVertex = function (vertex) {
    var coll = new go.List();
    var iterator = null; // 子节点来源

    // 有向树时，使用到达顶点集合作为子节点来源
    if (this.isDirected === true) {
        iterator = vertex.destinationVertexes.iterator;
    }
        // 其他情况，使用关联顶点集合作为子节点来源
    else {
        iterator = vertex.vertexes.iterator;
    }

    while (iterator.next()) {
        var child = iterator.value;

        // 将所有尚未建立树形关系的顶点添加进子顶点集合中
        if (child.isInTreeRelation === false) {
            // 添加子顶点
            vertex.addChild(child);

            coll.add(child);
        }
    }

    return coll;

};

/**
* @property {Boolean} 是否为有向树
*/
Object.defineProperty(RadialTreeLayout.prototype, "isDirected", {
    get: function () {
        return this._isDirected;
    },
    set: function (value) {
        // 值未变化，则直接跳过
        //if (this._isDirected === value) return;

        this._isDirected = value;

        // 触发重新布局
        this.invalidateLayout();
    }
});

/**
* @property {go.EnumValue} 叶顶点所在层
*/
Object.defineProperty(RadialTreeLayout.prototype, "treeLeafLayer", {
    get: function () {
        return this._treeLeafLayer;
    },
    set: function (value) {
        // 值未变化，则直接跳过
        //if (this._treeLeafLayer === value) return;

        this._treeLeafLayer = value;

        // 触发重新布局
        this.invalidateLayout();
    }
});

/**
* @property {go.EnumValue} 同层顶点间距
*/
Object.defineProperty(RadialTreeLayout.prototype, "vertexSpacing", {
    get: function () {
        return this._vertexSpacing;
    },
    set: function (value) {
        // 值未变化，则直接跳过
        //if (this._vertexSpacing === value) return;

        this._vertexSpacing = value;

        // 触发重新布局
        this.invalidateLayout();
    }
});

//#endregion 径向树布局

//#region 径向树网络

/**
* 径向树网络的构造函数
*/
function RadialTreeNetwork() {
    go.LayoutNetwork.call(this);
};
go.Diagram.inherit(RadialTreeNetwork, go.LayoutNetwork);

/**
* 生成网络的边线
*
* @return {RadialTreeEdge} 径向树边线
* @override
*/
RadialTreeNetwork.prototype.createEdge = function () {
    return new RadialTreeEdge();
};

/**
* 生成网络的顶点
*
* @return {RadialTreeVertex} 径向树顶点
* @override
*/
RadialTreeNetwork.prototype.createVertex = function () {
    return new RadialTreeVertex();
};

//#endregion 径向树网络

//#region 径向树

/**
* 径向树的构造函数
*/
function RadialTree(vertexes) {
    // 顶点集合
    this.vertexes = vertexes;
    // 所属布局
    this.layout = null;
    // 根顶点
    this.root = null;
    // 树层集合
    this.layers = new go.Map();
    // 树边界
    this.bounds = new go.Rect(NaN, NaN, NaN, NaN);
};

/**
* 为树添加树层
*
* @param {RadialTreeLayer} layer 目标树层
*/
RadialTree.prototype.addLayer = function (layer) {
    if (layer._tree === this) return;

    // 将树层添加集合中
    this.layers.add(layer.index, layer);

    // 指定目标树层的所属树
    layer._tree = this;
};

/**
* 计算树边界
*/
RadialTree.prototype.computeBounds = function () {
    var bounds = null;

    // 计算树中所有顶点的总边界
    this.vertexes.each(function (vertex) {
        if (bounds === null) {
            bounds = new go.Rect();
            bounds.set(vertex.bounds);
        }
        else {
            bounds.unionRect(vertex.bounds);
        }
    });

    // 设置树边界
    this.bounds = bounds;
};

/**
* 计算层半径
*
* @param {Number} layerIndex 树层索引
*/
RadialTree.prototype.computeLayerRadius = function (layerIndex) {
    // 获取索引对应的树层
    var layer = this.getLayer(layerIndex);

    // 获取第0层的半径
    if (layerIndex === 0) {
        // 第0层只有一个顶点,半径为0
        layer.radius = 0;
    }
        // 获取其他层的半径
    else {
        // 获取相邻的内层树层
        var innerLayer = this.getLayer(layerIndex - 1);

        // 计算树层的初始(最小)半径
        var radius = innerLayer.radius + innerLayer.thickness / 2 + this.layout.layerSpacing + layer.thickness / 2;

        // 计算树层的初始(最小)半径
        while (this.isLayerRadiusTooSmall(layer, radius)) {
            // 树层半径增大
            radius += this.layout.incrementLayerSpacing;
        }

        layer.radius = radius;
    }
};

/**
* 计算顶点的所占弧长
*
* @param {RadialTreeVertex} vertex 目标顶点
* @return {Number} 顶点所占弧长
*/
RadialTree.prototype.computeVertexArcLength = function (vertex) {
    // 子顶点弧长总和
    var childrenArcLength = this.computeVertexChildrenArcLength(vertex);
    // 顶点自身弧长
    var selfArcLength = vertex.diameter + this.layout.minVertexSpacing;
    // 顶点所占弧长
    var arcLength = 0;

    // 取较大的值作为顶点所占弧长
    arcLength = childrenArcLength > selfArcLength ? childrenArcLength : selfArcLength;

    // 设置顶点所占弧长
    vertex.arcLength = arcLength;

    return arcLength;
};

/**
* 计算顶点的子顶点弧长总和
*
* @param {RadialTreeVertex} vertex 目标顶点
* @return {Number} 子顶点弧长总和
*/
RadialTree.prototype.computeVertexChildrenArcLength = function (vertex) {
    // 子顶点弧长总和
    var childrenArcLength = 0;

    // 计算子顶点弧长总和
    vertex.children.each(function (child) {
        childrenArcLength += child.arcLength;
    });

    // 设置子顶点弧长总和
    vertex.childrenArcLength = childrenArcLength;

    return childrenArcLength;
};

/**
* 计算顶点的直径
*
* 并非精确的直径，假设顶点外观为圆形，使用简单的模糊计算，效率高。
*
* @param {RadialTreeVertex} vertex 目标顶点
* @return {Number} 顶点直径
*/
RadialTree.prototype.computeVertexDiameter = function (vertex) {
    // 计算顶点直径
    var diameter = vertex.width > vertex.height ? vertex.width : vertex.height;

    // 设置顶点直径
    vertex.diameter = diameter;

    return diameter;
};

/**
* 删除树层
*
* @param {RadialTreeLayer} layer 目标树层
*/
RadialTree.prototype.deleteLayer = function (layer) {
    if (layer._tree !== this) return;

    // 从树层集合中删除目标树层
    this.layers.remove(layer);

    // 将树层的所在树设置为空
    layer._tree = null;
};

/**
* 获取索引对应的树层
*
* @param {Number} layerIndex 树层索引
* @return {RadialTreeLayer} 径向树层
*/
RadialTree.prototype.getLayer = function (layerIndex) {
    return this.layers.get(layerIndex);
};

/**
* 获取树的根顶点
*
* @return {RadialTreeLayer} 径向树的根顶点
*/
RadialTree.prototype.getRootVertex = function () {
    var rootVertex = null;
    var iterator = this.vertexes.iterator;

    while (iterator.next()) {
        var vertex = iterator.value;

        // 第一个无父顶点的顶点，即为根顶点
        if (vertex.parent === null) {
            rootVertex = vertex;
            break;
        }
    }

    return rootVertex;
};

/**
* 初始化径向树
*/
RadialTree.prototype.initialize = function () {
    // 获取根顶点
    this.root = this.getRootVertex();

    // 从根顶点开始，分配每个顶点至各个树层
    this.splitVertexIntoLayer(this.root, 0);

    // 获取层数
    var layerCount = this.layers.count;

    // 设置叶顶点的放置位置
    if (this.layout.treeLeafLayer === RadialTreeLayout.OutermostLayer) {
        // 将叶顶点(无后代的顶点)全部放在最外层上
        var outermostLayer = this.getLayer(layerCount - 1);
        this.vertexes.each(function (vertex) {
            if (vertex.children.count === 0) {
                vertex.layer = outermostLayer;
            }
        });
    }

    // 从最外层开始，计算相关数值
    while (layerCount > 0) {
        var layer = this.getLayer(layerCount - 1);
        var thickness = 0;
        var vertexesArcLength = 0;
        var iterator = layer.vertexes.iterator;

        while (iterator.next()) {
            var vertex = iterator.value;

            // 计算顶点直径
            var diameter = this.computeVertexDiameter(vertex);

            // 计算树层厚度
            thickness = thickness > diameter ? thickness : diameter;

            // 计算顶点弧长
            var arcLength = this.computeVertexArcLength(vertex);

            // 计算树层弧长
            vertexesArcLength += arcLength;
        }

        // 设定树层厚度
        layer.thickness = thickness;

        // 设定树层弧长
        layer.vertexesArcLength = vertexesArcLength;

        layerCount--;
    }

    // 计算各层的半径
    for (var i = 0; i < this.layers.count; i++) {
        this.computeLayerRadius(i);
    }

    // 初始化根顶点相关信息
    this.root.centerX = 0;
    this.root.centerY = 0;
    this.root.startAngle = this.layout.treeStartAngle;
    this.root.sweepAngle = this.layout.treeSweepAngle;

    // 从根顶点开始，通过递归，计算树中所有顶点位置
    this.locateVertexChildren(this.root);

    // 计算树边界
    this.computeBounds();
};

/**
* 测试树层半径是否过小
*
* @param {RadialTreeLayer} layer 目标树层
* @param {Number} radius 树层半径
* @return {Boolean} 树层半径过小标识
*/
RadialTree.prototype.isLayerRadiusTooSmall = function (layer, radius) {
    var isLayerRadiusTooSmall = false;
    var count = layer.vertexes.count;
    var layerArcLength = radius * this.layout.treeSweepAngle * Math.PI / 180;

    for (var i = 0; i < count; i++) {
        // 获取当前顶点
        var vertex = layer.vertexes.get(i);
        // 该顶点的真实弧长
        var arcLength = layerArcLength * vertex.arcLength / layer.vertexesArcLength;
        // 该顶点所对应的顶点间距
        var spacing = arcLength - vertex.diameter;

        // 获取下一个顶点，若当前顶点是最后一个顶点，则下一个顶点是第一个顶点
        var nextVertex = i < count - 1 ? layer.vertexes.get(i + 1) : layer.vertexes.get(0);
        // 下一个顶点的真实弧长
        var nextArcLength = layerArcLength * nextVertex.arcLength / layer.vertexesArcLength;
        // 下一个顶点所对应的顶点间距
        var nextSpacing = nextArcLength - nextVertex.diameter;

        // 获取当前顶点与相邻的下一个顶点的间距
        var vertexSpacing = spacing / 2 + nextSpacing / 2;

        // 顶点间距小于最小值时，则视为层半径过小
        if (vertexSpacing < this.layout.minVertexSpacing) {
            isLayerRadiusTooSmall = true;

            break;
        }
    }

    return isLayerRadiusTooSmall;
};

/**
* 计算顶点的子顶点位置
*
* @param {RadialTreeVertex} vertex 目标顶点
*/
RadialTree.prototype.locateVertexChildren = function (vertex) {
    var startAngle = vertex.startAngle;
    var sweepAngle = vertex.sweepAngle;
    var childrenArcLength = vertex.childrenArcLength; // 子顶点的弧长总和
    var preAngle = 0; // 前置保留角度
    var childrenSweepAngle = sweepAngle; // 子顶点的扫描角度总和
    var vertexSpacing = this.layout.vertexSpacing;

    // 顶点间距非宽松时，需要计算前置保留角度
    if (vertexSpacing !== RadialTreeLayout.Loose) {
        // 一般情况下,所有子顶点均在下一层
        var nextLayer = this.getLayer(vertex.layer.index + 1);

        if (nextLayer === null) return;

        // 获取下一层的半径
        var nextLayerRadius = nextLayer.radius;

        // 使用父顶点的扫描角度与次层的半径，计算出扫描弧长
        var sweepArcLength = nextLayerRadius * sweepAngle * Math.PI / 180;

        // 子顶点的弧长总和小于扫描弧长时,则视为扫描角度过大
        // 扫描角度过大时,直接给子顶点分配角度，会使子顶点排列过于松散
        // 设置前置保留角度,收紧子顶点之间的距离
        if (childrenArcLength < sweepArcLength) {
            // 获取真正的子顶点扫描角度
            childrenSweepAngle = sweepAngle * childrenArcLength / sweepArcLength;
            // 设置前置保留角度
            preAngle = (sweepAngle - childrenSweepAngle) / 2;
        }
    }

    // 计算每个子顶点的位置
    var iterator = vertex.children.iterator;
    while (iterator.next()) {
        var child = iterator.value;

        if (vertexSpacing === RadialTreeLayout.Compact
            || (vertexSpacing === RadialTreeLayout.RootChildrenLoose && child.layer.index > 1)
            || (vertexSpacing === RadialTreeLayout.TreeLeafCompact && child.children.count === 0)) {
            // 设置起始角度
            child.startAngle = startAngle + preAngle;
            // 设置扫描角度
            child.sweepAngle = childrenSweepAngle * child.arcLength / childrenArcLength;
        }
        else {
            // 设置起始角度
            child.startAngle = startAngle;
            // 设置扫描角度
            child.sweepAngle = sweepAngle * child.arcLength / childrenArcLength;
        }

        // 获取中心点角度
        var centerAngle = child.startAngle + child.sweepAngle / 2;
        // 获取子顶点所在层半径(子顶点不一定真的在下一层,需要重新获取)
        var radius = child.layer.radius;

        // 计算顶点的中心点位置
        child.centerX = radius * Math.cos(centerAngle * Math.PI / 180);
        child.centerY = radius * Math.sin(centerAngle * Math.PI / 180);

        startAngle += child.sweepAngle;

        // 向下递归，计算子顶点位置
        this.locateVertexChildren(child);
    }
};

/**
* 移动树中所有顶点
*/
RadialTree.prototype.moveAllVertexes = function (offsetX, offsetY) {
    // 移动树中所有顶点
    this.vertexes.each(function (vertex) {
        vertex.centerX += offsetX;
        vertex.centerY += offsetY;
    });
};

/**
* 为顶点分配径向树层
*
* 将树中所有的顶点分配到对应的树层中
*
* @param {RadialTreeVertex} vertex 目标顶点
* @param {Number} layerIndex 树层索引
*/
RadialTree.prototype.splitVertexIntoLayer = function (vertex, layerIndex) {
    // 获取树层
    var layer = this.getLayer(layerIndex);

    if (layer === null) {
        // 生成新的树层
        layer = new RadialTreeLayer(layerIndex);

        // 为树添加树层
        this.addLayer(layer);
    }

    // 为目标顶点分配径向树层
    layer.addVertex(vertex);

    var iterator = vertex.children.iterator;
    while (iterator.next()) {
        var child = iterator.value;

        // 为子顶点分配径向树层
        this.splitVertexIntoLayer(child, layerIndex + 1);
    }
};

//#endregion 径向树

//#region 径向树层

/**
* 径向树层的构造函数
*/
function RadialTreeLayer(index) {
    // 树层索引
    this.index = index;
    // 树层包含的顶点集合
    this.vertexes = new go.List();
    // 树层半径
    this.radius = NaN;
    // 树层厚度
    this.thickness = NaN;
    // 树层所属树
    this._tree = null;
    // 树层的顶点弧长总和
    this.vertexesArcLength = NaN;
};

/**
* 将目标顶点添加到树层中
*
* @param {RadialTreeVertex} vertex 目标顶点
*/
RadialTreeLayer.prototype.addVertex = function (vertex) {
    if (vertex._layer === this) return;

    // 将目标顶点添加到树层中
    this.vertexes.add(vertex);

    // 设置顶点的所属树层
    vertex._layer = this;
};

/**
* 删除子顶点
*
* @param {RadialTreeVertex} vertex 目标顶点
*/
RadialTreeLayer.prototype.deleteVertex = function (vertex) {
    if (vertex._layer !== this) return;

    // 从子顶点集合中删除目标顶点
    this.vertexes.remove(vertex);

    // 将子顶点的所在层设置为空
    vertex._layer = null;
};

/**
* @property {RadialTree} 所在树
*/
Object.defineProperty(RadialTreeLayer.prototype, "tree", {
    get: function () {
        return this._tree;
    },
    set: function (value) {
        // 值未变化，则直接跳过
        if (this._tree === value) return;

        // 从旧树的树层集合中删除当前顶树层
        if (this._tree) {
            this._tree.deleteLayer(this);
        }

        // 将当前树层添加进新树的树层集合
        if (value) {
            value.addLayer(this);
        }
    }
});

//#endregion 径向树层

//#region 径向树顶点

/**
* 径向树顶点的构造函数
*/
function RadialTreeVertex() {
    go.LayoutVertex.call(this);

    // 父顶点
    this._parent = null;
    // 子顶点集合
    this.children = new go.Set();
    // 是否在树形关系中
    this.isInTreeRelation = false;
    // 所属树层
    this._layer = null;
    // 自身所占区域的外接圆直径
    this.diameter = NaN;
    // 子顶点弧长总和
    this.childrenArcLength = NaN;
    // 所占弧长
    this.arcLength = NaN;
    // 所占弧的扫描角度
    this.sweepAngle = NaN;
    // 所占弧的起始角度
    this.startAngle = NaN;
};
go.Diagram.inherit(RadialTreeVertex, go.LayoutVertex);

/**
* 添加子顶点
*
* @param {RadialTreeVertex} vertex 目标顶点
*/
RadialTreeVertex.prototype.addChild = function (vertex) {
    if (vertex._parent === this || vertex === this) return;

    // 将目标顶点添加子顶点集合中
    this.children.add(vertex);

    // 将当前顶点作为目标顶点的父顶点
    vertex._parent = this;
};

/**
* 删除子顶点
*
* @param {RadialTreeVertex} vertex 目标顶点
*/
RadialTreeVertex.prototype.deleteChild = function (vertex) {
    if (vertex._parent !== this) return;

    // 从子顶点集合中删除目标顶点
    this.children.remove(vertex);

    // 将当前顶点作为目标顶点的父顶点
    vertex._parent = null;
};

/**
* @property {RadialTreeLayer} 所在树层
*/
Object.defineProperty(RadialTreeVertex.prototype, "layer", {
    get: function () {
        return this._layer;
    },
    set: function (value) {
        // 值未变化，则直接跳过
        if (this._layer === value) return;

        // 从旧树层的子顶点集合中删除当前顶点
        if (this._layer) {
            this._layer.deleteVertex(this);
        }

        // 将当前顶点添加进新树层的子顶点集合中
        if (value) {
            value.addVertex(this);
        }
    }
});

/**
* @property {RadialTreeVertex} 父顶点
*/
Object.defineProperty(RadialTreeVertex.prototype, "parent", {
    get: function () {
        return this._parent;
    },
    set: function (value) {
        // 值未变化，则直接跳过
        if (this._parent === value) return;

        // 从旧父顶点的子顶点集合中删除当前顶点
        if (this._parent) {
            this._parent.deleteChild(this);
        }

        // 将当前顶点添加进新父顶点的子顶点集合中
        if (value) {
            value.addChild(this);
        }
    }
});

//#endregion 径向树顶点

//#region 径向树边线

/**
* 径向树边线的构造函数
*/
function RadialTreeEdge() {
    go.LayoutEdge.call(this);
};
go.Diagram.inherit(RadialTreeEdge, go.LayoutEdge);

//#endregion 径向树边线