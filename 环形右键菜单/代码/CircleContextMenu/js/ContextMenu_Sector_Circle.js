﻿/// <reference path="go-debug-1.7-test.js" />
var $$ = go.GraphObject.make; // 简化定义模板，避免使用$（与jQuery冲突）

function SectorContextMenu(buttonDataArray) {
    go.Adornment.call(this);

    this.configAdornment();
    this.menuButtonTemplate = this.createMenuButtonTemplate(this.initialButtonWidth, this.initialButtonHeight);
    this.makeSectorMenu(buttonDataArray);
};
go.Diagram.inherit(SectorContextMenu, go.Adornment);

SectorContextMenu.prototype = new go.Adornment();

SectorContextMenu.prototype.constructor = SectorContextMenu;

SectorContextMenu.prototype.children = new go.List();

SectorContextMenu.prototype.funcProperty = "func";

SectorContextMenu.prototype.imagePathProperty = "imagePath";

SectorContextMenu.prototype.initialButtonHeight = 70;

SectorContextMenu.prototype.initialButtonWidth = 70;

SectorContextMenu.prototype.maxSweepAngle = 36;

SectorContextMenu.prototype.menuButtonTemplate = null;

SectorContextMenu.prototype.minDistance = 40;

SectorContextMenu.prototype.sectorDistance = 0;

SectorContextMenu.prototype.startAngle = -90;

SectorContextMenu.prototype.sweepAngle = 36;

SectorContextMenu.prototype.textProperty = "text";

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

SectorContextMenu.prototype.computeRootInnerRadius = function (distance, sweepAngle) {
    var dist = this.minDistance;
    var sweep = sweepAngle;
    var radius = dist / Math.cos(sweep * Math.PI / 360);

    return radius;
};

SectorContextMenu.prototype.computeRootOuterRadius = function (innerRadius) {
    //var dist = 200;
    var thickness = 70;
    //var sweep = sweepAngle;
    var radius = innerRadius + thickness;

    return radius;
};

SectorContextMenu.prototype.computeRootSweepAngle = function (count) {
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

SectorContextMenu.prototype.configAdornment = function () {
    this.type = go.Panel.Spot;
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

SectorContextMenu.prototype.createMenuButtonTemplate = function (width, height) {
    var template =
        $$("ContextMenuButton",
            {
                desiredSize: new go.Size(width, height),
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
                },
                //mouseEnter: function (e, obj) {
                //    obj.setProperties({
                //        //"ButtonBorder.fill": $$(go.Brush, "Linear",
                //        //    {
                //        //        0: "#2786de",
                //        //        1: "#92a6d0"
                //        //    }
                //        //),
                //        "ButtonBorder.fill": "#4b51d0"
                //    });

                //    obj.isExpanded = true;
                //},
                //mouseLeave: function (e, obj) {
                //    obj.setProperties({
                //        "ButtonBorder.fill": "#008feb"
                //    });
                //}
            },
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

    template.visible = false;
    template.parent = null;
    template.children = new go.List();
    template._isExpanded = false;

    template.cloneProtected = function (copy) {
        template.constructor.prototype.cloneProtected.apply(this, arguments);

        copy.cloneProtected = this.cloneProtected;
        copy.parent = null;
        copy.children = new go.List();
        copy._isExpanded = false;
        Object.defineProperty(copy, "isExpanded", {
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
                            child.opacity = 1-index / 100;
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

        copy.hideChildren = this.hideChildren;
        copy.hideSiblingChildren = this.hideSiblingChildren;
        copy.showChildren = this.showChildren;
    };

    template.hideChildren = function () {
        if (!this.children.count === 0) return;

        this.children.each(function (child) {
            child.hideChildren();
            child.visible = false;
        });
    };

    template.hideSiblingChildren = function () {
        if (!this.parent) return;

        var button = this;
        button.parent.children.each(function (child) {
            if (child !== button) {
                //child.hideChildren();
                child.isExpanded = false;
            }
        });
    };

    template.showChildren = function () {
        if (!this.children.count === 0) return;

        this.hideSiblingChildren();

        this.children.each(function (child) {
            child.visible = true;
            child.isExpanded = false;
        });
    };

    return template;
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

SectorContextMenu.prototype.makeSectorMenu = function (buttonDataArray) {
    if (!buttonDataArray || buttonDataArray.length === 0) return;

    var height = this.initialButtonHeight;
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


function CustomContextMenuButton() {
    //go.GraphObject.make("ContextMenuButton").constructor.apply(this, arguments);

    //this.type = go.Panel.Vertical;
    this.parent = null;
    this.children = new go.List();
    this.isExpanded = false;
};

//CustomContextMenuButton.prototype = go.GraphObject.make("ContextMenuButton");

//CustomContextMenuButton.prototype.constructor = CustomContextMenuButton;

CustomContextMenuButton.prototype.adorn = function (target) {
    if (!target) return;

    for (var i in this) {
        target[i] = this[i];
    }

    target.isExpanded = this.isExpanded;
};

//CustomContextMenuButton.prototype.cloneProtected = function (copy) {
//    go.GraphObject.make("ContextMenuButton").constructor.prototype.cloneProtected.apply(this, arguments);

//    copy.parent = null;
//    copy.children = new go.List();
//    copy.isExpanded = this.isExpanded;
//};

CustomContextMenuButton.prototype.hideChildren = function () {
    if (!this.children.count === 0) return;

    this.children.each(function (child) {
        child.hideChildren();
        child.visible = false;
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

    this.hideSiblingChildren();

    this.children.each(function (child) {
        child.visible = true;
    });
};

//Object.defineProperty(CustomContextMenuButton.prototype, "isExpanded", {
//    get: function () {
//        return isExpanded;
//    },
//    set: function (value) {
//        isExpanded = value;

//        if (isExpanded) {
//            this.showChildren();
//        }
//        else {
//            this.hideChildren();
//        }
//    }
//});