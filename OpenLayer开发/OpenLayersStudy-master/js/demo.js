/// <reference path="ol5.2.0/ol.js" />
/// <reference path="jquery-3.3.1.min.js" />

var map = new ol.Map({
    controls: ol.control.defaults({
        attribution: true,
        rotate: true,
        zoom: true
    }),
    interactions: ol.interaction.defaults({
        doubleClickZoom: true,
        dragPan: true,
        altShiftDragRotate: true,
    })
});
var geoJsonLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: "data/countries.geojson",
        format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: "rgba(55, 130, 197, 0.3)"
        }),
        stroke: new ol.style.Stroke({
            color: "rgba(0, 112, 210, 0.2)",
            width: 3
        })
    })
});
var drawLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: [new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.7)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    }),
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: 'orange'
            })
        }),
        geometry: function (feature) {
            // return the coordinates of the first ring of the polygon
            var coordinates = feature.getGeometry().getCoordinates()[0];
            return new ol.geom.MultiPoint(coordinates);
        }
    })
    ]
});
var featureLayer = new ol.layer.Vector({
    source: new ol.source.Vector()
});
var currentPosition = null;
var selectInteraction = new ol.interaction.Select({
    layers: [featureLayer, drawLayer, geoJsonLayer],
    style: function (feature) {
        var style = null;
        var geo = feature.getGeometry();
        if (geo.getType() === "Point") {
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 17, // 图形大小，单位为像素
                    fill: new ol.style.Fill({
                        color: "green"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "red",
                        width: 3
                    })
                })
            })
        }
        else {
            style = new ol.style.Style({
                //geometry: geo,
                fill: new ol.style.Fill({
                    color: "rgba(205, 92, 92, 0.7)"
                }),
                stroke: new ol.style.Stroke({
                    color: "red",
                    width: 3
                }),
                text: new ol.style.Text({
                    text: "测试",
                    placement: "line",
                    fill: new ol.style.Fill({
                        color: "black"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "gray",
                        width: 3
                    })
                }),
            });
        }

        return style;
    }
})
var drawInteraction = null;
var gifOverlay = null;

function init() {
    map.setTarget("map");

    // 地图层
    var layer = new ol.layer.Tile();
    map.addLayer(layer);

    // 地图层的数据源
    var source = new ol.source.OSM({
        attributions: [
            '<img src="images/logo.png" style="width: 150px;"></img>'
        ]
    }); // 谷歌地图
    //var source = getBaiduSource(); // 百度地图
    layer.setSource(source);

    // 绘画层
    map.addLayer(drawLayer);

    // 绘画层的数据源
    //var source = new ol.source.Vector();
    //drawLayer.setSource(source);

    // 绘画层的样式
    //var style = new ol.style.Style({
    //    fill: new ol.style.Fill({
    //        color: 'rgba(255, 255, 255, 0.7)'
    //    }),
    //    stroke: new ol.style.Stroke({
    //        color: '#ffcc33',
    //        width: 2
    //    }),
    //    image: new ol.style.Circle({
    //        radius: 7,
    //        fill: new ol.style.Fill({
    //            color: '#ffcc33'
    //        })
    //    })
    //});
    //drawLayer.setStyle(style);

    // 画线层的样式中的笔画设置
    //var stroke = new ol.style.Stroke();
    //stroke.setColor("red");
    //stroke.setWidth(2);
    //style.setStroke(stroke);

    // 矢量图层
    map.addLayer(geoJsonLayer);

    // 中心坐标
    var centerCoordinate = ol.proj.fromLonLat([116.3905856200, 39.9164989600]); // 故宫（谷歌）

    // 地图视野
    var view = new ol.View({
        //extent: [12952039.463781066, 4852490.085141984, 12960953.932204822, 4855920.196786284]
    });
    view.setE
    view.setCenter(centerCoordinate); // 故宫（谷歌）
    //view.setCenter(ol.proj.fromLonLat([116.4031986823, 39.9242434649])); // 故宫（百度）
    //view.setCenter(ol.proj.fromLonLat([116.4031986823, 39.7313448469])); // 故宫（百度）
    view.setZoom(16);
    //view.setMaxZoom(17);
    //view.setMinZoom(6);
    //view.setResolution(2); // 1像素50米？
    //view.setRotation(Math.PI / 2);
    map.setView(view);

    // 监听中心属性变化
    //view.on('change:center', function (event) {
    //    console.log(event.key + ":" + event.oldValue);
    //})

    // html标记
    gifOverlay = new ol.Overlay({
        element: document.getElementById('anchor'),
        position: centerCoordinate, // 故宫（谷歌）
        positioning: "center-center"
    });
    map.addOverlay(gifOverlay);

    // 标记层
    map.addLayer(featureLayer);
    featureLayer.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 15, // 图形大小，单位为像素
            fill: new ol.style.Fill({
                color: "green"
            }),
            stroke: new ol.style.Stroke({
                color: "lightgreen",
                width: 3
            })
        }),
        text: new ol.style.Text({
            text: "测试",
            //placement: "line",
            fill: new ol.style.Fill({
                color: "black"
            }),
            stroke: new ol.style.Stroke({
                color: "wheat",
                width: 2
            })
        })
    }));

    // 中心点feature标记
    var feature = new ol.Feature({
        geometry: new ol.geom.Point(centerCoordinate)
    });
    // 中心点feature标记样式
    feature.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            src: "images/marker-red.png",
            //img: document.getElementById("center"),
            //imgSize: [100, 100]
        })
    }));
    feature.name = "default";
    featureLayer.getSource().addFeature(feature);

    // 初始化控件
    initializeControls();

    // 添加选择交互
    map.addInteraction(selectInteraction);
    // 为交互添加添加监听事件
    //selectInteraction.on("select", function (event) {
    //    selectedFeatures = event.selected;
    //});

    // 单击拾取坐标
    map.on("singleclick", function (event) {
        var coordinate = event.coordinate;

        currentPosition = coordinate;

        // 展示经纬度
        var container = document.getElementById("coordinateValue");
        var lonLat = ol.proj.toLonLat(coordinate);
        container.value = lonLat;

        // 调整标记位置
        gifOverlay.setPosition(coordinate);

        // 触发feature点击事件
        //map.forEachFeatureAtPixel(event.pixel, function (feature) {
        //    // 为移动到的feature发送自定义的mousemove消息
        //    feature.dispatchEvent({ type: 'singleclick', event: event });
        //});
    });

    // 监听鼠标移动事件
    map.on("pointermove", function (event) {
        var features = map.getFeaturesAtPixel(event.pixel);

        // 修改鼠标样式为默认样式
        map.getTargetElement().style.cursor = features ? "pointer" : "default";

        //// 触发feature点击事件
        //map.forEachFeatureAtPixel(event.pixel, function (feature) {
        //    // 为移动到的feature发送自定义的mousemove消息
        //    feature.dispatchEvent({ type: 'pointermove', event: event });
        //});
    });
};

function getBaiduSource() {
    var projection = ol.proj.get("EPSG:3857");
    var resolutions = [];
    for (var i = 0; i < 19; i++) {
        resolutions[i] = Math.pow(2, 18 - i);
    }
    var tilegrid = new ol.tilegrid.TileGrid({
        origin: [0, 0],
        resolutions: resolutions
    });

    var baidu_source = new ol.source.TileImage({
        projection: projection,
        tileGrid: tilegrid,
        tileUrlFunction: function (tileCoord, pixelRatio, proj) {
            if (!tileCoord) {
                return "";
            }
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];

            if (x < 0) {
                x = "M" + (-x);
            }
            if (y < 0) {
                y = "M" + (-y);
            }

            return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20151021&scaler=1&p=1";
        }
    });

    return baidu_source;
};

function initializeControls() {
    // 全屏控件
    var fsControl = new ol.control.FullScreen({
        //className: "custom-full-screen",
        //target: "fullScreen",
        source: "GISContainer",
    });
    //fsControl.setTarget(document.getElementById("fullScreen"));
    map.addControl(fsControl);

    // 缩放轴控件
    var zsControl = new ol.control.ZoomSlider();
    map.addControl(zsControl);

    // 缩放至最小程度控件
    var zteControl = new ol.control.ZoomToExtent();
    map.addControl(zteControl);

    // 鼠标坐标控件
    var mpControl = new ol.control.MousePosition();
    mpControl.setCoordinateFormat(function (coord) {
        var longitude = (coord[0] / 1e5).toFixed(4);
        var latitude = (coord[1] / 1e5).toFixed(4);
        return "经度:" + longitude + "  纬度:" + latitude;
    });
    map.addControl(mpControl);

    // 全景视图控件
    var omControl = new ol.control.OverviewMap();
    map.addControl(omControl);

    // 比例尺控件
    var slControl = new ol.control.ScaleLine();
    map.addControl(slControl);
};

function rotate() {
    var view = map.getView();
    view.setRotation(view.getRotation() + Math.PI / 2);
};

function rotateOpposite() {
    var view = map.getView();
    view.setRotation(view.getRotation() - Math.PI / 2);
};

function selectZoom() {
    var view = map.getView();
    var zoom = document.getElementById("zoomValue").value;
    zoom = parseInt(zoom);
    if (zoom > 0 && zoom < 19) {
        view.setZoom(zoom);
    }
    else {
        alert("格式不正确");
    }
};

function locatePosition() {
    var container = document.getElementById("coordinateValue");
    var coordinate = container.value;
    if (coordinate) {
        // 经纬度转换
        var array = coordinate.split(",");
        array[0] = parseFloat(array[0]);
        array[1] = parseFloat(array[1]);

        var view = map.getView();
        view.setCenter(ol.proj.fromLonLat(array));

        // 调整标记位置
        gifOverlay.setPosition(ol.proj.fromLonLat(array));
    }
    else {
        alert("格式不正确");
    }
};

function locatePositionWidthAnimation() {
    var container = document.getElementById("coordinateValue");
    var coordinate = container.value;
    if (coordinate) {
        // 经纬度转换
        var array = coordinate.split(",");
        array[0] = parseFloat(array[0]);
        array[1] = parseFloat(array[1]);

        var view = map.getView();
        view.animate({
            center: ol.proj.fromLonLat(array),
            easing: ol.easing.inAndOut,
            duration: 1000
        });

        // 调整标记位置
        gifOverlay.setPosition(ol.proj.fromLonLat(array));

        // 显示所属区域
        loadPolygonsAtPoint(ol.proj.fromLonLat(array));
    }
    else {
        alert("格式不正确");
    }
};

function locateInitialPosition() {
    var centerCoordinate = ol.proj.fromLonLat([116.3905856200, 39.9164989600]); // 故宫（谷歌）
    var view = map.getView();
    view.animate({
        center: centerCoordinate,
        zoom: 16,
        easing: ol.easing.inAndOut,
        duration: 1000
    });
};

function addMark() {
    if (!currentPosition) return;

    // feature标记
    var feature = new ol.Feature({
        geometry: new ol.geom.Point(currentPosition)
        //geometry: new ol.geom.Circle(currentPosition, 15, null)
    });

    // feature标记样式
    //feature.setStyle(new ol.style.Style({
    //    image: new ol.style.Circle({
    //        radius: 15, // 图形大小，单位为像素
    //        fill: new ol.style.Fill({
    //            color: "green"
    //        }),
    //        stroke: new ol.style.Stroke({
    //            color: "lightgreen",
    //            width: 3
    //        })
    //    })
    //}));

    //// feature点击切换样式
    //feature.on("singleclick", function (event) {
    //    this.setStyle(new ol.style.Style({
    //        image: new ol.style.Circle({
    //            radius: 17, // 图形大小，单位为像素
    //            fill: new ol.style.Fill({
    //                color: "green"
    //            }),
    //            stroke: new ol.style.Stroke({
    //                color: "red",
    //                width: 3
    //            })
    //        })
    //    }))
    //});

    // feature鼠标移动
    feature.on("pointermove", function (event) {
        // 修改鼠标样式为指针样式
        map.getTargetElement().style.cursor = "pointer";
    });

    featureLayer.getSource().addFeature(feature);
};

function deleteMark() {
    var selectedFeatures = [];

    selectInteraction.getFeatures().forEach(function (f) {
        selectedFeatures.push(f);
    });

    // 清空选中状态
    selectInteraction.getFeatures().clear();

    // 删除选中feature
    for (var i = 0, len = selectedFeatures.length; i < len; i++) {
        featureLayer.getSource().removeFeature(selectedFeatures[i]);
    }
};

function addRegularShape() {
    var type = document.getElementById("regularShapes").value;
    var style = null;
    switch (type) {
        case "线段":
            style = {
                points: 2,
                radius: 10,    // 图形大小，单位为像素
                stroke: new ol.style.Stroke({ // 设置边的样式
                    color: "red",
                    width: 3
                })
            };
            break;
        case "三角形":
            style = {
                points: 3,
                radius: 10,    // 图形大小，单位为像素
                stroke: new ol.style.Stroke({ // 设置边的样式
                    color: "blue",
                    width: 3
                })
            };
            break;
        case "五角形":
            style = {
                points: 5,
                radius: 10,    // 图形大小，单位为像素
                stroke: new ol.style.Stroke({ // 设置边的样式
                    color: "green",
                    width: 3
                })
            };
            break;
        default:
            style = {
                points: 5,
                radius1: 15,
                radius2: 10,
                stroke: new ol.style.Stroke({ // 设置边的样式
                    color: "brown",
                    width: 3
                })
            };
            break;
    }

    var polygon = new ol.Feature({
        geometry: new ol.geom.Point(currentPosition)
    });
    polygon.setStyle(new ol.style.Style({
        image: new ol.style.RegularShape(style)
    }));

    featureLayer.getSource().addFeature(polygon);
};

function drawPolygon() {
    var drawType = document.getElementById("polygons").value;
    var drawOption = {
        source: drawLayer.getSource()
    }

    if (drawType === "Square") {
        drawOption.type = "Circle";
        drawOption.geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
    }
    else if (drawType === "Box") {
        drawOption.type = "Circle";
        drawOption.geometryFunction = ol.interaction.Draw.createBox();
    }
    else if (drawType === "Star") {
        drawOption.type = "Circle";
        drawOption.geometryFunction = function (coordinates, geometry) {
            var center = coordinates[0];
            var last = coordinates[1];
            var dx = center[0] - last[0];
            var dy = center[1] - last[1];
            var radius = Math.sqrt(dx * dx + dy * dy);
            var rotation = Math.atan2(dy, dx);
            var newCoordinates = [];
            var numPoints = 12;
            for (var i = 0; i < numPoints; ++i) {
                var angle = rotation + i * 2 * Math.PI / numPoints;
                var fraction = i % 2 === 0 ? 1 : 0.5;
                var offsetX = radius * fraction * Math.cos(angle);
                var offsetY = radius * fraction * Math.sin(angle);
                newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
            }
            newCoordinates.push(newCoordinates[0].slice());
            if (!geometry) {
                geometry = new ol.geom.Polygon([newCoordinates]);
            } else {
                geometry.setCoordinates([newCoordinates]);
            }
            return geometry;
        };
    }
    else {
        drawOption.type = drawType;
    }

    drawInteraction = new ol.interaction.Draw(drawOption);
    drawInteraction.isCancel = false;

    drawInteraction.on('drawend', function (event) {
        // 绘制完毕，删除绘制和吸附交互
        map.removeInteraction(drawInteraction);
        map.removeInteraction(snapInteraction);

        // 取消操作时，删除绘制图形
        setTimeout(function () {
            if (drawInteraction.isCancel === true) {
                drawLayer.getSource().removeFeature(event.feature);
            }
        }, 0);
    });

    // 添加画线交互
    map.addInteraction(drawInteraction);

    // 添加吸附交互
    var snapInteraction = new ol.interaction.Snap({
        source: drawLayer.getSource()
    });
    map.addInteraction(snapInteraction);
};

function modifyPolygon() {
    // 添加编辑交互，用于编辑图形
    var interaction = new ol.interaction.Modify({
        source: drawLayer.getSource()
    });

    interaction.on('modifyend', function (event) {
        // 编辑完毕，删除编辑交互
        map.removeInteraction(interaction);
    });

    map.addInteraction(interaction);
};

function cancelDrawing() {
    if (!drawInteraction || drawInteraction.getMap() !== map) return;

    drawInteraction.isCancel = true;
    drawInteraction.finishDrawing();
};

function measureLength() {
    var interaction = new ol.interaction.Draw({
        type: "LineString",
        source: drawLayer.getSource()
    });
    interaction.on('drawend', function (event) {
        var geometry = event.feature.getGeometry();
        var length = ol.sphere.getLength(geometry);
        alert("总长" + length + "米");

        // 画线完毕，删除画线交互
        map.removeInteraction(interaction);

        // 清空数据源中的线
        setTimeout(function () { drawLayer.getSource().clear(); }, 0);
    });

    // 清空数据源中的线
    drawLayer.getSource().clear();

    // 添加画线交互
    map.addInteraction(interaction);
};

function measureDistance() {
    var centerCoordinate = ol.proj.fromLonLat([116.3905856200, 39.9164989600]); // 中心坐标
    //var distance = ol.sphere.getDistance(centerCoordinate, currentPosition); // 数值有问题，暂不用
    var line = new ol.geom.LineString([centerCoordinate, currentPosition]);
    var distance = ol.sphere.getLength(line);

    alert("距离" + distance + "米");
};

function measureArea() {
    var interaction = new ol.interaction.Draw({
        type: "Polygon",
        source: drawLayer.getSource()
    });
    interaction.on('drawend', function (event) {
        var geometry = event.feature.getGeometry();
        var area = ol.sphere.getArea(geometry);
        alert("总面积" + area + "平方米");

        // 绘制完毕，删除绘制交互
        map.removeInteraction(interaction);

        // 清空数据源中的图形
        setTimeout(function () { drawLayer.getSource().clear(); }, 0);
    });

    // 清空数据源中的图形
    drawLayer.getSource().clear();

    // 添加绘制交互
    map.addInteraction(interaction);
};

function exportImage() {
    map.once('postcompose', function (event) {
        var canvas = event.context.canvas;

        canvas.toBlob(function (blob) {
            var url = URL.createObjectURL(blob);
            var filename = "地图快照";

            var a = document.createElement("a");
            a.style = "display: none";
            a.href = url;
            a.download = filename;

            document.body.appendChild(a);
            requestAnimationFrame(function () {
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            });
        });
    });

    map.renderSync();
};

function savePolygons() {
    if (!drawLayer) return;

    var features = drawLayer.getSource().getFeatures();
    if (features.length === 0) {
        alert("数据为空！");
        return;
    }

    var polygons = [];
    features.forEach(function (f) {
        polygons.push(f.getGeometry().getCoordinates());
    });

    localStorage.setItem("polygons", JSON.stringify(polygons));
    alert("保存成功！");
};

function loadPolygons() {
    var polygons = JSON.parse(localStorage.getItem("polygons"));
    var features = [];

    if (!polygons) {
        alert("数据为空！");
        return;
    }

    polygons.forEach(function (coordinates) {
        if (!coordinates) return;

        var geo = new ol.geom.Polygon(coordinates);
        var feature = new ol.Feature(geo);
        features.push(feature);
    });

    drawLayer.getSource().addFeatures(features);
};

function loadPolygonsAtPoint(position) {
    var polygons = JSON.parse(localStorage.getItem("polygons"));
    var features = [];

    if (!polygons) {
        alert("数据为空！");
        return;
    }

    drawLayer.getSource().clear();

    var p = position || currentPosition;
    if (!p) return;

    polygons.forEach(function (coordinates) {
        if (!coordinates) return;

        var geo = new ol.geom.Polygon(coordinates);
        if (geo.intersectsCoordinate(p)) {
            var feature = new ol.Feature(geo);
            features.push(feature);
        }
    });

    if (!position && features.length === 0) {
        alert("未找到匹配区域！");
        return;
    }

    drawLayer.getSource().addFeatures(features);
};

function loadGeoJson() {
    function load(data) {
        var features = (new ol.format.GeoJSON()).readFeatures(data);
        geoJsonLayer.getSource().addFeatures(features);
    };

    $.getJSON("js/test.js", load);
};