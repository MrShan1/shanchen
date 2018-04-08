/// <reference path="go-debug-1.7-test.js" />
var $$ = go.GraphObject.make; // 简化定义模板，避免使用$（与jQuery冲突）

function createContextMenu(obj) {
    var adornment =
        $$(go.Adornment, "Spot",
            {
                //background: "red"
            },
            $$(go.Placeholder,
                {
                    //background: "rgba(255, 255, 255, 0.8)"
                }
            )
        );

    //#region 按钮模板
    var buttonTemplate =
        $$("ContextMenuButton",
            {
                //background: "black",
                desiredSize: new go.Size(85, 85),
                alignmentFocus: go.Spot.Center,
                "ButtonBorder.stroke": "#f7f7f7",
                //"ButtonBorder.stroke": "gray",
                "ButtonBorder.strokeWidth": 1,
                "ButtonBorder.fill": "#2786de",
                //"ButtonBorder.figure": "Hexagon",
                "ButtonBorder.figure": "Circle",
                mouseEnter: function (e, obj) {
                    var border = obj.findObject("ButtonBorder");
                    border.fill = $$(go.Brush, "Linear", { 0: "#2786de", 1: "#92a6d0" });
                },
                mouseLeave: function (e, obj) {
                    var border = obj.findObject("ButtonBorder");
                    border.fill = "#2786de";
                },
                //background: "gray",
            }
            //,
            //$$(go.Shape, "Circle",
            //    {
            //        fill: "aliceblue",
            //        stroke: "darkgrey"
            //    }
            //)
            ,
            $$(go.Panel, "Vertical"
                ,
                {
                    name: 'BUTTON_TEXT_PANEL',
                    background: "gray",
                }
                ,
                $$(go.Picture,
                    {
                        name: 'PICTURE',
                        desiredSize: new go.Size(30, 30),
                        alignment: go.Spot.Center,
                        source: "images/Airplane.jpg",
                        imageStretch: go.GraphObject.UniformToFill,
                    }
                )
                ,
                $$(go.TextBlock,
                    {
                        text: "测试1",
                        name: "BUTTON_TEXT",
                        stroke: "#fff",
                        font: "normal 12px sans-serif",
                        //textAlign: "center",
                        //margin: new go.Margin(0, 20, 0, 20),
                    }
                )
            )
        );
    //#endregion

    var intialAngle = -90;
    var count = 10;
    var per= 360 / count;
    var perMax = 36;
    //var perMin = 36;
    var sweep = per < perMax ? per : perMax;

    var dist = computeDistance(buttonTemplate.width, buttonTemplate.height, sweep);

    var border = buttonTemplate.findObject("ButtonBorder");
    border.geometryString = makeGeometryString({
        width: buttonTemplate.width,
        height: buttonTemplate.height,
        sweep: sweep,
        dist: dist,
    });

    var radius = dist + buttonTemplate.width / 2;

    for (var i = 0; i < count; i++) {
        var panel = buttonTemplate.copy();
        var textBlock = panel.findObject("BUTTON_TEXT");
        if (textBlock) {
            textBlock.text = "测试" + (i + 1);
        }

        var newAngle = intialAngle + (sweep * i);
        panel.angle = (sweep * i);

        var textPanel = panel.findObject("BUTTON_TEXT_PANEL");
        textPanel.angle = -(sweep * i);

        var x = Math.cos(newAngle * Math.PI / 180) * radius;
        var y = Math.sin(newAngle * Math.PI / 180) * radius;
        panel.alignment = new go.Spot(0.5, 0.5, x, y);
        //panel.position = new go.Point(x, y);

        adornment.add(panel);
    }

    return adornment;
};

function computeDistance(w, h, sweep) {
    var dist = w / (2 * Math.sin(sweep * Math.PI / 360)) - h;

    return dist;
};

function makeGeometryString(data) {
    var initAngle = -90;
    var width = data.width;
    var height = data.height;
    var sweep = data.sweep;
    var dist = data.dist;

    var outer = height + dist;
    var inner = dist / Math.cos(sweep * Math.PI / 360);
    var p = new go.Point(0, -outer).rotate(-sweep / 2);
    var q = new go.Point(0, -inner).rotate(sweep / 2);
    var geoString = ""
    + " F"
    + " M" + p.x + " " + p.y
    + " B" + (initAngle - sweep / 2) + " " + (sweep) + " 0 0 " + outer + " " + outer
    + " L" + q.x + " " + q.y
    + " B" + (initAngle + sweep / 2) + " " + (-sweep) + " 0 0 " + inner + " " + inner
    //+ " L" + p.x + " " + p.y
    + "z"
    ;

    return geoString;
};