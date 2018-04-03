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


    var panelTemplate =
        $$(go.Panel, "Auto",
            {
                alignmentFocus: go.Spot.Center,
            },
            $$(go.Shape, "Circle",
                {
                    fill: "aliceblue",
                    stroke: "darkgrey"
                }
            ),
            $$(go.TextBlock,
                {
                    font: "6pt sans-serif",
                    name: "TEXT",
                    text: "测试",
                    stroke: "#606060",
                }
            )
        );

    var buttonTemplate =
        $$("ContextMenuButton",
            {
                //background: "black",
                desiredSize: new go.Size(70, 70),
                alignmentFocus: go.Spot.Center,
                "ButtonBorder.stroke": "#f7f7f7",
                //"ButtonBorder.stroke": "gray",
                "ButtonBorder.strokeWidth": 1,
                "ButtonBorder.fill": "#2786de",
                //"ButtonBorder.figure": "Hexagon",
                "ButtonBorder.figure": "Stopsign",
                mouseEnter: function (e, obj) {
                    var border = obj.findObject("ButtonBorder");
                    border.fill = $$(go.Brush, "Linear", { 0: "#2786de", 1: "#92a6d0" });
                },
                mouseLeave: function (e, obj) {
                    var border = obj.findObject("ButtonBorder");
                    border.fill = "#2786de";
                },
                click: function (e, obj) {
                    //alert();
                },
                //mouseEnter: function (e, obj) {
                //    alert();
                //},
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
                }
                ,
                $$(go.Picture,
                    {
                        name: 'PICTURE',
                        desiredSize: new go.Size(30, 30),
                        alignment: go.Spot.Center,
                        source: "images/gearwheels.png",
                        imageStretch: go.GraphObject.UniformToFill,
                    }
                )
                ,
                $$(go.TextBlock,
                    {
                        text: "测试1",
                        name: "BUTTON_TEXT",
                        stroke: "#fff",
                        font: "normal 6px sans-serif",
                        //textAlign: "center",
                        //margin: new go.Margin(0, 20, 0, 20),
                    }
                )
            )
        )


    var dia = computeRadius(buttonTemplate);

    //var count = 10;
    //var radiusBefore = 0;
    //var radiusCurrent = 0;
    //var angle = 1/4;
    //var radius = 50;
    //var space = 0;
    //var cos = Math.cos(angle * Math.PI / 180)
    //var sin = Math.sin(angle * Math.PI / 180)
    //var d = dia + space;

    //var intialAngle = 0;
    //var intialRadius = 60;
    //var currentAngle = 0;
    //var currentRadius = 0;

    var intialAngle = 0;
    var count = 10;
    var angle = 360 / count;
    var sin = Math.sin(angle * Math.PI / 360);
    var radius = dia / sin;

    var border = buttonTemplate.findObject("ButtonBorder");
    //border.geometryString = makeGeometryString({
    //    angle: 0,
    //    sweep: angle,
    //    radius: radius,
    //    dia: dia
    //});

    for (var i = 0; i < count; i++) {
        var panel = buttonTemplate.copy();
        var textBlock = panel.findObject("BUTTON_TEXT");
        if (textBlock) {
            textBlock.text = "测试" + (i + 1);
        }

        //if (i === 0) {
        //    radiusCurrent = radius;
        //    panel.alignment = new go.Spot(0.5, 0.5, radius, 0);
        //    adornment.add(panel);
        //}
        //else {
        //    radiusCurrent = radiusBefore * cos + Math.sqrt(d * d - Math.pow(radiusBefore * sin, 2));
        //    var x = Math.cos(angle * i) * radiusCurrent;
        //    var y = Math.sin(angle * i) * radiusCurrent;
        //    panel.alignment = new go.Spot(0.5, 0.5, x, y);
        //    adornment.add(panel);
        //}
        //radiusBefore = radiusCurrent;

        //var cos = Math.cos(angle);
        //var sin = Math.sin(angle);
        //var x = radius * (cos + angle * sin);
        //var y = radius * (sin - angle * cos);
        //angle = angle - angle * 0;
        //currentAngle = currentAngle + angle;
        //currentRadius = currentRadius + radius;

        //var x = Math.cos(currentAngle * Math.PI / 180) * currentRadius;
        //var y = Math.sin(currentAngle * Math.PI / 180) * currentRadius;
        //panel.alignment = new go.Spot(0.5, 0.5, x, y);
        //adornment.add(panel);
        //var dia = dia + dia;
        //angle += Math.atan((dia + space) / Math.sqrt(x * x + y * y));

        //var newAngle = intialAngle + (angle * i);
        //var x = Math.cos(newAngle * Math.PI / 180) * radius;
        //var y = Math.sin(newAngle * Math.PI / 180) * radius;
        //panel.alignment = new go.Spot(0.5, 0.5, x, y);

        var newAngle = intialAngle + (angle * i);

        //var border = panel.findObject("ButtonBorder");
        //border.figure = "None";
        //border.geometry = makeAnnularWedge({
        //    angle: newAngle,
        //    sweep: angle,
        //    radius: radius,
        //    dia: dia
        //});

        //var textPanel = panel.findObject("BUTTON_TEXT_PANEL");
        //panel.angle = newAngle;
        //textPanel.angle = -newAngle;

        var x = Math.cos(newAngle * Math.PI / 180) * radius;
        var y = Math.sin(newAngle * Math.PI / 180) * radius;
        panel.alignment = new go.Spot(0.5, 0.5, x, y);
        //panel.position = new go.Point(x, y);

        adornment.add(panel);
    }

    return adornment;
};

function computeRadius(v) {
    if (!v) return 0;
    var buffer = 12;
    return Math.sqrt(v.width * v.width + v.height * v.height) / 2 - buffer;
};

function makeAnnularWedge(data) {
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
    var geo = new go.Geometry()
                  .add(new go.PathFigure(-outer, -outer))  // always make sure the Geometry includes the top left corner
                  .add(new go.PathFigure(outer, outer))    // and the bottom right corner of the whole circular area
                  .add(new go.PathFigure(p.x, p.y)
                      .add(new go.PathSegment(go.PathSegment.Arc, angle - sweep / 2, sweep, 0, 0, outer, outer))
                      .add(new go.PathSegment(go.PathSegment.Line, q.x, q.y))
                      .add(new go.PathSegment(go.PathSegment.Arc, angle + sweep / 2, -sweep, 0, 0, inner, inner).close()));
    return geo;
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