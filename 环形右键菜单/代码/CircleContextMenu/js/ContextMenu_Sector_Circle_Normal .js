/// <reference path="go-debug-1.7-test.js" />
var $$ = go.GraphObject.make; // 简化定义模板，避免使用$（与jQuery冲突）

/**
* 扇形右键菜单的构造函数
*/
function SectorContextMenu(buttonDataArray) {
    go.Adornment.call(this);

    // 按钮数据集合
    this._buttonDataArray = null;
    // 子元素集合
    this.children = new go.List();
    // 根按钮层的内层半径
    this.rootOuterRadius = this.minRootOuterRadius;

    // 配置右键菜单的基本属性
    this.configAdornment();

    // 创建按钮模板
    this.createMenuButtonTemplate();

    // 设置按钮数据集合,制作扇形右键菜单
    this.buttonDataArray = buttonDataArray;
};
go.Diagram.inherit(SectorContextMenu, go.Adornment);

/**
* @property {SectorContextMenuButton} 按钮模板
*/
SectorContextMenu.prototype.menuButtonTemplate = null;

/**
* @property {Number} 最小按钮宽度
*/
SectorContextMenu.prototype.minButtonWidth = 70;

/**
* @property {Number} 根按钮层的最小外层半径
*/
SectorContextMenu.prototype.minRootOuterRadius = 40;

/**
* @property {Number} 扇形间距
*/
SectorContextMenu.prototype.sectorDistance = 5;

/**
* @property {Number} 扇形厚度
*/
SectorContextMenu.prototype.sectorThickness = 50;

/**
* @property {Number} 第一个根按钮的放置角度
*/
SectorContextMenu.prototype.startAngle = -90;

/**
* 创建按钮关系链
*
* 使按钮之间形成父子关系
*
* @param {SectorContextMenu|SectorContextMenuButton} part 要关联子元素的对象
* @param {Array} childrenDataArray 子元素数据集合
*/
SectorContextMenu.prototype.buildButtonRelations = function (part, childrenDataArray) {
    var length = childrenDataArray.length;

    for (var i = 0; i < length; i++) {
        // 获取当期的按钮数据
        var data = buttonDataArray[i];

        // 创建右键菜单按钮
        var button = new SectorContextMenuButton({
            imagePath: data.imagePath,
            text: data.imagePath,
            exec: data.exec,
        });

        // 关联父子关系
        part.children.add(button);
        button.parent = part;

        // 将按钮添加至右键菜单
        this.add(button);

        // 继续向下递归，为子元素创建按钮关系链
        if (data.children && data.children.length > 0) {
            this.buildButtonRelations(button, data.children);
        }
    }
};

/**
* 清空子元素
*/
SectorContextMenu.prototype.clearChildren = function () {
    // 清除已有菜单内容
    this.clearAdornments();

    // 清除所有子元素
    this.children.clear();
};

SectorContextMenu.prototype.computeAngle = function (parentAngle, parentSweepAngle, sweepAngle, index, count) {
    //var firstAngle = parentAngle - parentSweepAngle / 2 + sweepAngle / 2;
    var firstAngle = parentAngle - sweepAngle * count / 2 + sweepAngle / 2;
    var angle = firstAngle + sweepAngle * index;

    return angle;
};

SectorContextMenu.prototype.computeDistance = function (innerRadius, sweepAngle) {
    var inner = innerRadius;
    var sweep = sweepAngle;
    var distance = Math.cos(sweep * Math.PI / 360) * inner;

    return distance;
};

SectorContextMenu.prototype.computeHeight = function (outerRadius, distance) {
    var height = outerRadius - distance;

    return height;
};

SectorContextMenu.prototype.computeInnerRadius = function (parentRadius, parentHeight) {
    var radius = parentRadius + parentHeight / 2 + 5;

    return radius;
};

SectorContextMenu.prototype.computeOuterRadius = function (innerRadius) {
    var radius = innerRadius + this.sectorDistance;

    return radius;
};

SectorContextMenu.prototype.computeRadius = function (distance, height) {
    var radius = distance + height / 2;

    return radius;
};

SectorContextMenu.prototype.computeRootAngle = function (sweepAngle, index) {
    var angle = this.startAngle + sweepAngle * index;

    return angle;
};

SectorContextMenu.prototype.computeRootDistance = function (sweepAngle) {
    var minDistance = this.minDistance;
    var width = this.initialButtonWidth;
    var height = this.initialButtonHeight;
    var sweep = sweepAngle;
    var distance = width / (2 * Math.sin(sweep * Math.PI / 360)) - height;

    return distance > minDistance ? distance : minDistance;
};

SectorContextMenu.prototype.computeRootInnerRadius = function (part, index) {
    var width = this.minButtonWidth;
    var innerRadius = this.rootInnerRadius + (this.sectorDistance + this.sectorThickness) * index;
    var circumference = 2 * Math.PI * innerRadius;

};

SectorContextMenu.prototype.computeRootOuterRadius = function (part, layerIndex) {
    var width = this.minButtonWidth;
    var count = part.children.count;
    var radius = width / 2 / Math.sin(2 * Math.PI / count);
    var rootOuterRadius = radius - (this.sectorDistance + this.sectorThickness) * layerIndex;

    if (this.rootOuterRadius < rootOuterRadius) {
        this.rootOuterRadius = Math.ceil(rootOuterRadius);
    }

    var iterator = part.children.iterator;
    while (iterator) {
        var child = iterator.value;
        if (child.children.count === 0) continue;

        this.computeRootOuterRadius(child, layerIndex + 1);
    }
};

SectorContextMenu.prototype.computeRootSweepAngle = function (childCount) {
    var maxSweep = this.maxSweepAngle;
    var sweep = 360 / count;

    //return sweep < maxSweep ? sweep : maxSweep;
    return sweep;
};

SectorContextMenu.prototype.computeRootWidth = function (sweep, outerRadius) {
    var width = outerRadius * Math.sin(sweep * Math.PI / 360) * 2;

    return width;
};

SectorContextMenu.prototype.computeSectorDistance = function (rootOuterRadius, rootInnerRadius) {
    var outer = rootOuterRadius;
    var inner = rootInnerRadius;
    var sectorDistance = outer - inner;

    return sectorDistance;
};

SectorContextMenu.prototype.computeSweepAngle = function (outerRadius, parentSweepAngle, count) {
    var width = this.initialButtonWidth;
    var outer = outerRadius;
    var sweep = Math.asin(width / 2 / outer) * 360 / Math.PI;

    var sweep1 = parentSweepAngle / count;

    return sweep > sweep1 ? sweep : sweep1;
};

/**
* 配置右键菜单的基本属性
*/
SectorContextMenu.prototype.configAdornment = function () {
    this.type = go.Panel.Spot
    this.add(new go.Placeholder());
};

SectorContextMenu.prototype.createInfoPanel = function (imagePath, text) {
    if (!imagePath && !text) return;

    var panel =
       $$(go.Panel, "Vertical",
           {
               name: 'BUTTON_TEXT_PANEL',
               alignment: go.Spot.Center,
               //background: "gray",
           }
       );

    if (imagePath) {
        var picture =
            $$(go.Panel, "Auto",
                {
                    name: 'BUTTON_TEXT_PANEL',
                    alignment: go.Spot.Center,
                    //background: "gray",
                },
                $$(go.Shape, "Circle",
                    {
                        stroke: null,
                        //fill: "green",
                        fill: $$(go.Brush, "Linear",
                                {
                                    0: "#2786de",
                                    //1: "green"
                                    1: "gray"
                                }
                            ),
                        //desiredSize: new go.Size(20, 20),
                    }
                ),
                $$(go.Picture,
                    {
                        name: 'PICTURE',
                        desiredSize: new go.Size(22, 22),
                        alignment: go.Spot.Center,
                        source: imagePath,
                        imageStretch: go.GraphObject.UniformToFill,
                    }
                )
            );

        panel.add(picture);
    }

    if (text) {
        var textBlock =
            $$(go.TextBlock,
                {
                    text: text,
                    alignment: go.Spot.Center,
                    name: "BUTTON_TEXT",
                    stroke: "#fff",
                    font: "normal 10px sans-serif",
                    margin: new go.Margin(2, 0, 0, 0),
                    maxSize: new go.Size(50, 20),
                    overflow: go.TextBlock.OverflowEllipsis
                }
            );

        panel.add(textBlock);
    }

    return panel;
};

/**
* 创建按钮模板
*/
SectorContextMenu.prototype.createMenuButtonTemplate = function () {
    var template =
        $$(CustomContextMenuButton,
            {
                desiredSize: new go.Size(70, 70),
                alignmentFocus: go.Spot.Center,
                //"ButtonBorder.stroke": "#f7f7f7",
                "ButtonBorder.stroke": "rgba(82, 82, 88, 0.90)",
                "ButtonBorder.strokeWidth": 1,
                //"ButtonBorder.fill": "#4b51d0",
                //"ButtonBorder.fill": "#008feb",
                "ButtonBorder.fill": "rgba(82, 82, 88, 0.90)",
                "ButtonBorder.figure": "Rectangle",
                mouseEnter: function (e, obj) {
                    obj.isExpanded = true;
                },
                mouseLeave: function (e, obj) {
                    if (obj.children.count === 0) {
                        obj.isExpanded = false;
                    }
                }
            },
            // 子菜单标识
            $$(go.Shape,
                {
                    name: "ExpandShape",
                    desiredSize: new go.Size(6, 3),
                    alignmentFocus: go.Spot.Center,
                    alignment: go.Spot.Top,
                    //figure: "TriangleUp",
                    geometryString: "F M0 3 L3 0 6 3z",
                    margin: new go.Margin(3, 0, 0, 0),
                    stroke: "lightgray",
                    fill: "lightgray",
                    visible: false,
                }
            )
        );

    // 设置按钮模板
    this.menuButtonTemplate = template;
};

SectorContextMenu.prototype.createSectorGeometryString = function (outerRadius, innerRadius, sweepAngle) {
    var outer = outerRadius;
    var inner = innerRadius;
    var sweep = sweepAngle;


    var p = new go.Point(0, -outer).rotate(-sweep / 2);
    var q = new go.Point(0, -inner).rotate(sweep / 2);
    var geoString = ""
        + " F"
        + " M" + p.x + " " + p.y
        + " B" + (-90 - sweep / 2) + " " + (sweep) + " 0 0 " + outer + " " + outer
        + " L" + q.x + " " + q.y
        + " B" + (-90 + sweep / 2) + " " + (-sweep) + " 0 0 " + inner + " " + inner
        + "z";

    return geoString;
};

SectorContextMenu.prototype.createSectorMenuButtonTemplate = function (width, height, sweepAngle, innerRadius, outerRadius) {
    var template = this.menuButtonTemplate.copy();
    template.desiredSize.setTo(width, height);

    var border = template.findObject("ButtonBorder");
    border.geometryString = this.createSectorGeometryString(outerRadius, innerRadius, sweepAngle);

    return template;
};

SectorContextMenu.prototype.makeChildren = function (buttonDataArray, parentAngle, parentSweepAngle, parentRadius, parentHeight, parent) {
    var innerRadius = this.computeInnerRadius(parentRadius, parentHeight);
    var outerRadius = this.computeOuterRadius(innerRadius);
    var sweep = this.computeSweepAngle(outerRadius, parentSweepAngle, buttonDataArray.length);
    var distance = this.computeDistance(innerRadius, sweep);
    var height = this.computeHeight(outerRadius, distance);
    //var width = this.initialButtonWidth;
    var width = this.computeRootWidth(sweep, outerRadius);
    var radius = this.computeRadius(distance, height);
    var template = this.createSectorMenuButtonTemplate(width, height, sweep, innerRadius, outerRadius);

    for (var i = 0; i < buttonDataArray.length; i++) {
        var buttonData = buttonDataArray[i];
        var angle = this.computeAngle(parentAngle, parentSweepAngle, sweep, i, buttonDataArray.length);

        this.makeSectorMenuButton(buttonData, template, angle, sweep, radius, parent);
    }
};

/**
* 制作右键菜单
*/
SectorContextMenu.prototype.makeSectorMenu = function () {
    // 清空子元素
    this.clearChildren();

    // 空数据判断
    var buttonDataArray = this.buttonDataArray;
    if (!this.buttonDataArray || this.buttonDataArray.length === 0) return;

    // 创建按钮关系链
    this.buildButtonRelations(this, buttonDataArray);



    var sweep = this.computeRootSweepAngle(buttonDataArray.length);
    var distance = this.computeRootDistance(sweep);
    var innerRadius = this.computeRootInnerRadius(distance, sweep);
    var outerRadius = this.computeRootOuterRadius(innerRadius);
    var width = this.computeRootWidth(sweep, outerRadius);
    var height = outerRadius - this.minDistance;
    //var width = this.initialButtonWidth;
    var radius = this.computeRadius(distance, height);
    var template = this.createSectorMenuButtonTemplate(width, height, sweep, innerRadius, outerRadius);

    this.sectorDistance = this.computeSectorDistance(outerRadius, innerRadius);

    for (var i = 0; i < buttonDataArray.length; i++) {
        var buttonData = buttonDataArray[i];
        var angle = this.computeRootAngle(sweep, i);

        this.makeSectorMenuButton(buttonData, template, angle, sweep, radius, this);
    }
};

SectorContextMenu.prototype.makeSectorMenuButton = function (buttonData, template, angle, sweep, radius, parent) {
    var menuButton = template.copy()
    var rotateAngle = angle + 90;
    var imagePath = buttonData[this.imagePathProperty];
    var text = buttonData[this.textProperty];
    var func = buttonData[this.funcProperty];
    var offsetX = Math.cos(angle * Math.PI / 180) * radius;
    var offsetY = Math.sin(angle * Math.PI / 180) * radius;
    var offsetX1 = Math.cos(angle * Math.PI / 180) * (radius + 5);
    var offsetY1 = Math.sin(angle * Math.PI / 180) * (radius + 5);
    var height = menuButton.height;

    //new CustomContextMenuButton().adorn(menuButton);
    //menuButton.children = new go.List();

    var infoPanel = this.createInfoPanel(imagePath, text);
    if (infoPanel) {
        infoPanel.angle = -rotateAngle;
        menuButton.add(infoPanel);
    }

    if (func) {
        menuButton.click = func;
    }

    menuButton.angle = rotateAngle;

    menuButton.alignment1 = new go.Spot(0.5, 0.5, offsetX, offsetY);
    menuButton.alignment2 = new go.Spot(0.5, 0.5, offsetX1, offsetY1);
    menuButton.alignment = menuButton.alignment1;

    menuButton.visible = (parent instanceof go.Adornment);
    //menuButton.visible = true;

    menuButton.parent = parent;
    parent.children.add(menuButton);
    this.add(menuButton);

    if (buttonData.children && buttonData.children.length > 0) {
        menuButton.findObject("ExpandShape").visible = true;

        this.makeChildren(buttonData.children, angle, sweep, radius, height, menuButton);
    }
};

/**
* @property {Array} 按钮数据集合
*/
Object.defineProperty(SectorContextMenu.prototype, "buttonDataArray", {
    get: function () {
        return this._buttonDataArray;
    },
    set: function (value) {
        if (this._buttonDataArray === value) return;

        this._buttonDataArray = value;

        // 制作右键菜单
        this.makeSectorMenu();
    }
});


function SectorContextMenuButton(buttonData) {
    this.visible = false;
    this.parent = null;
    this.children = new go.List();
    this._isExpanded = false;
};

SectorContextMenuButton.prototype = $$("ContextMenuButton");

SectorContextMenuButton.prototype.constructor = SectorContextMenuButton;

SectorContextMenuButton.prototype.hideChildren = function () {
    if (!this.children.count === 0) return;

    this.children.each(function (child) {
        child.hideChildren();
        child.visible = false;
    });
};

SectorContextMenuButton.prototype.hideSiblingChildren = function () {
    if (!this.parent) return;

    var button = this;
    button.parent.children.each(function (child) {
        if (child !== button) {
            //child.hideChildren();
            child.isExpanded = false;
        }
    });
};

SectorContextMenuButton.prototype.showChildren = function () {
    if (!this.children.count === 0) return;

    this.hideSiblingChildren();

    this.children.each(function (child) {
        child.visible = true;
        child.isExpanded = false;
    });
};

Object.defineProperty(SectorContextMenuButton.prototype, "isExpanded", {
    get: function () {
        return this._isExpanded;
    },
    set: function (value) {

        if (this._isExpanded === value) return;

        this._isExpanded = value;

        if (this._isExpanded === true) {
            this.setProperties({
                //"ButtonBorder.fill": "#4b51d0"
                "ButtonBorder.fill": "rgba(82, 82, 88, 0.70)"
            });

            this.showChildren();

            //this.alignment = this.alignment2;

            function up(obj, index) {
                var alignment1 = obj.alignment1;
                var alignment2 = obj.alignment2;
                var dx = alignment2.offsetX - alignment1.offsetX;
                var dy = alignment2.offsetY - alignment1.offsetY;

                var ox = alignment1.offsetX + dx * index / 100;
                var oy = alignment1.offsetY + dy * index / 100;

                obj.alignment = new go.Spot(obj.alignment.x, obj.alignment.y, ox, oy);

                obj.children.each(function (child) {
                    child.opacity = index / 100;
                });

                if (index / 100 < 1) {
                    index += 10;

                    requestAnimationFrame(function () {
                        up(obj, index);
                    });
                }
            };

            up(this, 0);
        }
        else {
            this.setProperties({
                //"ButtonBorder.fill": "#008feb"
                "ButtonBorder.fill": "rgba(82, 82, 88, 0.90)"
            });

            //this.hideChildren();

            //this.alignment = this.alignment1;

            function down(obj, index) {
                var alignment1 = obj.alignment1;
                var alignment2 = obj.alignment2;
                var dx = alignment2.offsetX - alignment1.offsetX;
                var dy = alignment2.offsetY - alignment1.offsetY;

                var ox = alignment2.offsetX - dx * index / 100;
                var oy = alignment2.offsetY - dy * index / 100;

                obj.alignment = new go.Spot(obj.alignment.x, obj.alignment.y, ox, oy);

                obj.children.each(function (child) {
                    child.opacity = 1 - index / 100;
                });

                if (index / 100 < 1) {
                    index += 10;

                    requestAnimationFrame(function () {
                        down(obj, index);
                    });
                }
                else {
                    obj.hideChildren();
                }
            };

            down(this, 0);
        }
    }
});