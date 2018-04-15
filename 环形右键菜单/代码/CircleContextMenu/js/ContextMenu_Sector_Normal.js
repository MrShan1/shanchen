/// <reference path="go-debug-1.7-test.js" />
var $$ = go.GraphObject.make; // 简化定义模板，避免使用$（与jQuery冲突）

function SectorContextMenu(buttonDataArray) {
    this.configAdornment();
    this.menuButtonTemplate = this.createMenuButtonTemplate();
    this.makeSectorMenu(buttonDataArray);
};

SectorContextMenu.prototype = new go.Adornment();

//SectorContextMenu.prototype.constructor = SectorContextMenu;

SectorContextMenu.prototype.children = new go.List();

SectorContextMenu.prototype.funcProperty = "func";

SectorContextMenu.prototype.imagePathProperty = "imagePath";

SectorContextMenu.prototype.maxSweepAngle = 36;

SectorContextMenu.prototype.menuButtonTemplate = null;

SectorContextMenu.prototype.minDistance = 20;

SectorContextMenu.prototype.startAngle = -90;

SectorContextMenu.prototype.sweepAngle = 36;

SectorContextMenu.prototype.textProperty = "text";

SectorContextMenu.prototype.computeAngle = function (parentAngle, parentSweepAngle, sweepAngle, index) {
    var firstAngle = parentAngle - parentSweepAngle / 2 + sweepAngle / 2;
    var angle = firstAngle + sweepAngle * index;

    return angle;
};

SectorContextMenu.prototype.computeDistance = function (parentRadius, parentHeight) {
    var width = this.menuButtonTemplate.width;
    var height = parentHeight;
    var innerRadius = parentRadius + height / 2;
    var distance = Math.sqrt(innerRadius * innerRadius - width * width / 4);

    return distance;
};

SectorContextMenu.prototype.computeSweepAngle = function (parendistatRadius, parentHeight, distance) {
    var width = this.menuButtonTemplate.width;
    var height = parentHeight;
    var innerRadius = parentRadius + height / 2;
    var sweep = Math.cos(distance / innerRadius) * 2;

    return sweep;
};

SectorContextMenu.prototype.computeRadius = function (distance) {
    var height = this.menuButtonTemplate.height;
    var radius = distance + height / 2;

    return radius;
};

SectorContextMenu.prototype.computeRootAngle = function (sweepAngle, index) {
    var angle = -90 + sweepAngle * index;

    return angle;
};

SectorContextMenu.prototype.computeRootDistance = function (sweepAngle) {
    var minDistance = this.minDistance;
    var width = this.menuButtonTemplate.width;
    var height = this.menuButtonTemplate.height;
    var sweep = sweepAngle;
    var distance = width / (2 * Math.sin(sweep * Math.PI / 360)) - height;

    return distance > minDistance ? distance : minDistance;
};

SectorContextMenu.prototype.computeRootSweepAngle = function (count) {
    var maxSweep = this.maxSweepAngle;
    var sweep = 360 / count;

    return sweep < maxSweep ? sweep : maxSweep;
};

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
               background: "gray",
           }
       );

    if (imagePath) {
        var picture =
            $$(go.Picture,
                {
                    name: 'PICTURE',
                    desiredSize: new go.Size(30, 30),
                    alignment: go.Spot.Center,
                    source: imagePath,
                    imageStretch: go.GraphObject.UniformToFill,
                }
            );

        panel.add(picture);
    }

    if (text) {
        var textBlock =
            $$(go.TextBlock,
                {
                    text: text,
                    name: "BUTTON_TEXT",
                    stroke: "#fff",
                    font: "normal 12px sans-serif",
                }
            );

        panel.add(textBlock);
    }

    return panel;
};

SectorContextMenu.prototype.createMenuButtonTemplate = function () {
    var template =
        $$("ContextMenuButton",
            {
                desiredSize: new go.Size(85, 85),
                alignmentFocus: go.Spot.Center,
                "ButtonBorder.stroke": "#f7f7f7",
                "ButtonBorder.strokeWidth": 1,
                "ButtonBorder.fill": "#2786de",
                "ButtonBorder.figure": "Rectangle",
                visible: false,
                mouseEnter: function (e, obj) {
                    obj.setProperties({
                        "ButtonBorder.fill": $$(go.Brush, "Linear",
                            {
                                0: "#2786de",
                                1: "#92a6d0"
                            }
                        )
                    });

                    obj.showChildren();
                },
                mouseLeave: function (e, obj) {
                    var border = obj.findObject("ButtonBorder");
                    border.fill = "#2786de";
                    obj.setProperties({
                        "ButtonBorder.fill": "#2786de"
                    });

                    //obj.hideChildren();
                },
                mouseHold: function (e, obj) {

                }
            }
        );

    return template;
};

SectorContextMenu.prototype.createSectorGeometryString = function (distance, sweepAngle) {
    var height = this.menuButtonTemplate.height;
    var dist = distance;
    var sweep = sweepAngle;

    var outer = height + dist;
    var inner = dist / Math.cos(sweep * Math.PI / 360);
    if (!this.temp) {
        this.temp = outer - inner;
    }

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

SectorContextMenu.prototype.createSectorMenuButtonTemplate = function (distance, sweepAngle) {
    var template = this.menuButtonTemplate.copy();
    var border = template.findObject("ButtonBorder");

    border.geometryString = this.createSectorGeometryString(distance, sweepAngle);

    return template;
};

SectorContextMenu.prototype.makeChildren = function (buttonDataArray, parentAngle, parentSweepAngle, parentRadius, parentHeight, parent) {
    var distance = this.computeDistance(parentRadius, parentHeight);
    var sweep = this.computeSweepAngle(parentRadius, parentHeight, distance);
    //var sweep = 36;
    var tempHeight = 
    var radius = this.computeRadius(distance);
    var template = this.createSectorMenuButtonTemplate(distance, sweep);

    for (var i = 0; i < buttonDataArray.length; i++) {
        var buttonData = buttonDataArray[i];
        var angle = this.computeAngle(parentAngle, parentSweepAngle, sweep, i);

        this.makeSectorMenuButton(buttonData, template, angle, sweep, radius, parent);
    }
};

SectorContextMenu.prototype.makeSectorMenu = function (buttonDataArray) {
    if (!buttonDataArray || buttonDataArray.length === 0) return;

    var sweep = this.computeRootSweepAngle(buttonDataArray.length);
    var distance = this.computeRootDistance(sweep);
    var radius = this.computeRadius(distance);
    var template = this.createSectorMenuButtonTemplate(distance, sweep);

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

    new CustomContextMenuButton().adorn(menuButton);

    var infoPanel = this.createInfoPanel(imagePath, text);
    if (infoPanel) {
        infoPanel.angle = -rotateAngle;
        menuButton.add(infoPanel);
    }

    if (func) {
        menuButton.click = func;
    }

    menuButton.angle = rotateAngle;

    menuButton.alignment = new go.Spot(0.5, 0.5, offsetX, offsetY);

    //menuButton.visible = (parent instanceof go.Adornment);
    menuButton.visible = true;

    menuButton.parent = parent;
    parent.children.add(menuButton);
    this.add(menuButton);

    if (buttonData.children && buttonData.children.length > 0) {
        this.makeChildren(buttonData.children, angle, sweep, radius, menuButton);
    }
};


function CustomContextMenuButton(contextMenuButton) {
    this.isExpanded = false;
};

//CustomContextMenuButton.prototype = go.GraphObject.make("ContextMenuButton");

//CustomContextMenuButton.prototype.constructor = CustomContextMenuButton;

CustomContextMenuButton.prototype.children = new go.List();

CustomContextMenuButton.prototype.parent = null;

CustomContextMenuButton.prototype.adorn = function (target) {
    if (!target) return;

    for (var i in this) {
        target[i] = this[i];
    }
};

CustomContextMenuButton.prototype.expand = function () {
    this.hideSiblingChildren();

    this.showChildren();
};

CustomContextMenuButton.prototype.hideChildren = function () {
    if (!this.children.count === 0) return;

    this.children.each(function (child) {
        child.visible = false;
        child.isExpanded = false;
    });
};

CustomContextMenuButton.prototype.hideSiblingChildren = function () {
    if (!this.parent) return;

    var button = this;
    button.parent.children.each(function (child) {
        if (child !== button) {
            child.hideChildren();
        }
    });
};

CustomContextMenuButton.prototype.showChildren = function () {
    if (!this.children.count === 0) return;

    this.children.each(function (child) {
        child.visible = true;
    });
};

Object.defineProperty(CustomContextMenuButton.prototype, "isExpanded", {
    get: function () {
        return isExpanded;
    },
    set: function (value) {
        isExpanded = value;

        if (!isExpanded) {
            this.hideChildren();
        }
    }
});