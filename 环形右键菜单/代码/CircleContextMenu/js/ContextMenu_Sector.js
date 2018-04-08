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
                background: "black",
                desiredSize: new go.Size(70, 70),
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

    var dia = computeRadius(buttonTemplate);

    var intialAngle = 0;
    var count = 15;
    var angle = 360 / count;
    var sin = Math.sin(angle * Math.PI / 360);
    var radius = dia / sin;

    var border = buttonTemplate.findObject("ButtonBorder");
    border.geometryString = makeGeometryString({
        angle: 0,
        sweep: angle,
        radius: radius,
        dia: dia
    });

    for (var i = 0; i < count; i++) {
        var panel = buttonTemplate.copy();
        var textBlock = panel.findObject("BUTTON_TEXT");
        if (textBlock) {
            textBlock.text = "测试" + (i + 1);
        }

        var newAngle = intialAngle + (angle * i);
        panel.angle = newAngle;

        //var textPanel = panel.findObject("BUTTON_TEXT_PANEL");
        //textPanel.angle = -newAngle;

        var currentRadius = radius;
        var x = Math.cos(newAngle * Math.PI / 180) * currentRadius;
        var y = Math.sin(newAngle * Math.PI / 180) * currentRadius;
        panel.alignment = new go.Spot(0.5, 0.5, x, y);
        //panel.position = new go.Point(x, y);

        adornment.add(panel);
    }

    return adornment;
};

function computeRadius(v) {
    if (!v) return 0;
    var buffer = 0;
    //var buffer = 12;
    return Math.sqrt(v.width * v.width + v.height * v.height) / 2 - buffer;
};

function makeGeometryString(data) {
    var angle = data.angle;
    var sweep = data.sweep;
    var radius = data.radius;  // the inner radius
    var dia = data.dia;
    if (angle === undefined || sweep === undefined || radius === undefined) return null;

    // the Geometry will be centered about (0,0)
    var outer = radius + dia;  // the outer radius
    var inner = radius - dia;
    var p = new go.Point(outer, 0).rotate(angle - sweep / 2);
    var q = new go.Point(inner, 0).rotate(angle + sweep / 2);
    var geoString = ""
    + " F"
    + " M" + p.x + " " + p.y
    + " B" + (angle - sweep / 2) + " " + (sweep) + " 0 0 " + outer + " " + outer
    + " L" + q.x + " " + q.y
    + " B" + (angle + sweep / 2) + " " + (-sweep) + " 0 0 " + inner + " " + inner
    //+ " L" + p.x + " " + p.y
    + "z"
    ;

    return geoString;
};