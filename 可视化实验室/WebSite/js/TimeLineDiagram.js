/// <reference path="go-debug-1.7-test.js" />

var LinePrefix = 40;        //前缀线的长度
var LineSuffix = 30;        //后缀线的长度
var MessageSpacing = 20;    //每个期间的长度

//视图初始化
function init() {
    var $ = go.GraphObject.make;

    //#region 定义主视图
    myDiagram =
      $(go.Diagram, "myDiagramDiv",
        {
            initialContentAlignment: go.Spot.Center,
            layout: $(TimelineLayout),
            allowCopy: false,
            linkingTool: $(MessagingTool),  // defined below
            "resizingTool.isGridSnapEnabled": true,
            "draggingTool.gridSnapCellSize": new go.Size(1, MessageSpacing / 4),
            "draggingTool.isGridSnapEnabled": true,
            // automatically extend Lifelines as Activities are moved or resized
            "SelectionMoved": ensureLifelineWidths,
            "PartResized": ensureLifelineWidths,
            "undoManager.isEnabled": true
        });
    //#endregion

    //#region 定义组模板
    myDiagram.groupTemplate =
      $(go.Group, "Horizontal",
        {
            locationSpot: go.Spot.Bottom,
            locationObjectName: "HEADER",
            minLocation: new go.Point(0, 0),
            maxLocation: new go.Point(0, 9999),
            selectionObjectName: "HEADER"
        },
        new go.Binding("location", "index", function (obj) { return new go.Point(0, obj * 100) }).makeTwoWay(function (property) { return property.y / 100 }),
        $(go.Panel, "Auto",
          { name: "HEADER" },
          $(go.Shape, "Rectangle",
            {
                fill: $(go.Brush, "Linear", { 0: "#70A6FF", 1: "#A8C8FF" }),
                stroke: null
            }),
          $(go.TextBlock,
            {
                margin: 2,
                font: "400 10pt Source Sans Pro, sans-serif"
            },
            new go.Binding("text", "phoneNum"))
        ),
        $(go.Panel, "Auto",
          $(go.Shape,
            {
                figure: "LineH",
                fill: null,
                stroke: "gray",
                strokeDashArray: [3, 3],
                width: 1,
                alignment: go.Spot.Center,
                portId: "",
                fromLinkable: true,
                fromLinkableDuplicates: true,
                toLinkable: true,
                toLinkableDuplicates: true,
                cursor: "pointer"
            },
            new go.Binding("width", "duration", computeLifelineWidth))
          )
      );
    //#endregion

    //#region 定义链接模板
    myDiagram.linkTemplate =
      $(MessageLink,
        {
            relinkableFrom: true,
            selectionAdorned: true,
            routing: go.Link.Orthogonal
        },
        $(go.Shape, "Rectangle",
          { stroke: "black" }),
        $(go.Shape,
          { toArrow: "OpenTriangle", stroke: "black" }),
        $(go.TextBlock,
          {
              font: "400 9pt Source Sans Pro, sans-serif",
              segmentIndex: 0,
              segmentOffset: new go.Point(NaN, NaN),
              isMultiline: false,
              editable: true
          },
          new go.Binding("text", "length").makeTwoWay())
      );
    //#endregion

    //#region 定义时间线模板
    myDiagram.nodeTemplateMap.add("Line",
              $(go.Node, "Graduated",
                {
                    height:100,
                    movable: false, copyable: false,
                    resizable: true, resizeObjectName: "MAIN",
                    background: "transparent",
                    graduatedMin: 0,
                    graduatedMax: 365,
                    graduatedTickUnit: 1,
                    resizeAdornmentTemplate:  // only resizing at right end
                      $(go.Adornment, "Spot",
                        $(go.Placeholder),
                        $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(4, 16), fill: "lightblue", stroke: "deepskyblue" })
                      )
                },
                new go.Binding("graduatedMax", "", timelineDays),
                $(go.Shape, "LineH",
                  { name: "MAIN", stroke: "#519ABA", height: 1, strokeWidth: 3 },
                  new go.Binding("width", "length").makeTwoWay()
                ),
                $(go.Shape, { geometryString: "M0 0 V10", interval: 7, stroke: "#519ABA", strokeWidth: 2 }),
                $(go.TextBlock,
                  {
                      font: "10pt sans-serif",
                      stroke: "#CCCCCC",
                      interval: 14,
                      alignmentFocus: go.Spot.MiddleRight,
                      segmentOrientation: go.Link.OrientMinus90,
                      segmentOffset: new go.Point(0, 12),
                      graduatedFunction: valueToDate
                  },
                  new go.Binding("interval", "length", calculateLabelInterval)
                )
              )
            );
    //#endregion

    //加载数据
    load();
}

//#region 定义自定义链接
//自定义链接
function MessageLink() {
    go.Link.call(this);
    this.pointX = 0;  // use this "time" value when this is the temporaryLink
}

//自定义链接继承原型链接
go.Diagram.inherit(MessageLink, go.Link);

//获取链接点（重写）
MessageLink.prototype.getLinkPoint = function (node, port, spot, from, ortho, othernode, otherport) {
    var p = port.getDocumentPoint(go.Spot.Center);
    var data = this.data;
    //var time = data !== null ? data.startTime : this.startTime;

    var x = this.pointX;
    var y = p.y;
    return new go.Point(x, y);
};

//计算链接路线上的点集合（重写）
MessageLink.prototype.computePoints = function () {
    if (this.fromNode === this.toNode) {
        return;
    }

    return go.Link.prototype.computePoints.call(this);
}
//#endregion

//#region 定义自定义链接工具
//自定义链接工具
function MessagingTool() {
    go.LinkingTool.call(this);
    var $ = go.GraphObject.make;
    this.temporaryLink =
      $(MessageLink,
        $(go.Shape, "Rectangle",
          { stroke: "magenta", strokeWidth: 2 }),
        $(go.Shape,
          { toArrow: "OpenTriangle", stroke: "magenta" }));
};

//自定义链接工具继承原型链接工具
go.Diagram.inherit(MessagingTool, go.LinkingTool);

//激活工具（重写）
MessagingTool.prototype.doActivate = function () {
    go.LinkingTool.prototype.doActivate.call(this);
    var time = convertXToTime(this.diagram.firstInput.documentPoint.x);
    this.temporaryLink.time = Math.ceil(time);  // round up to an integer value
};

//添加链接（重写）
MessagingTool.prototype.insertLink = function (fromnode, fromport, tonode, toport) {
    var newlink = go.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport);
    if (newlink !== null) {
        var model = this.diagram.model;
        // specify the time of the message
        var start = this.temporaryLink.time;
        var duration = 1;
        newlink.data.startTime = start;
        model.setDataProperty(newlink.data, "text", "未知时长");
        // now make sure all Lifelines are long enough
        ensureLifelineWidths();
    }
    return newlink;
};
//#endregion

//#region 定义时间线布局
//定义时间线布局
function TimelineLayout() {
    go.Layout.call(this);
};

//时间线布局继承原型布局
go.Diagram.inherit(TimelineLayout, go.Layout);

//布局计算（重写）
TimelineLayout.prototype.doLayout = function (coll) {
    var diagram = this.diagram;
    if (diagram === null) return;
    coll = this.collectParts(coll);
    diagram.startTransaction("TimelineLayout");

    var line = null;
    var parts = [];
    var it = coll.iterator;
    while (it.next()) {
        var part = it.value;
        if (part instanceof go.Node)
        {
            if (part.category === "Line") {
                line = part;
            }
            continue;
        }
        parts.push(part);
        var x = part.data.startTime;
        if (x === undefined) { x = new Date(); part.data.startTime = x; }
    }
    if (!line) throw Error("No node of category 'Line' for TimelineLayout");

    line.location = new go.Point(0, 0);

    // lay out the events above the timeline
    if (parts.length > 0) {
        // determine the offset from the main shape to the timeline's boundaries
        var main = line.findMainElement();
        var sw = main.strokeWidth;
        var mainOffX = main.actualBounds.x;
        var mainOffY = main.actualBounds.y;
        // spacing is between the Line and the closest Nodes, defaults to 30
        var spacing = line.data.lineSpacing;
        if (!spacing) spacing = 30;
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            var bnds = part.actualBounds;
            var dt = part.data.startTime;
            var val = dateToValue(dt);
            var pt = line.graduatedPointForValue(val);
            //var tempLoc = new go.Point(pt.x, pt.y - bnds.height / 2 - spacing);
            part.pointX = pt.x;
        }
    }

    diagram.commitTransaction("TimelineLayout");
};
//#endregion

//保障生命线宽度
function ensureLifelineWidths(e) {
    // iterate over all Activities (ignore Groups)
    var arr = myDiagram.model.nodeDataArray;
    var max = -1;
    for (var i = 0; i < arr.length; i++) {
        var act = arr[i];
        if (act.isGroup) continue;
        max = Math.max(max, act.duration);
    }
    if (max > 0) {
        // now iterate over only Groups
        for (var i = 0; i < arr.length; i++) {
            var gr = arr[i];
            if (!gr.isGroup) continue;
            if (max > gr.duration) {  // this only extends, never shrinks
                myDiagram.model.setDataProperty(gr, "duration", max);
            }
        }
    }
}

//计算生命线宽度
function computeLifelineWidth(duration) {
    return LinePrefix + duration * MessageSpacing + LineSuffix;
}

//计算横坐标
function convertTimeToX(t) {
    return t * MessageSpacing + LinePrefix;
}

//计算起始时间
function convertXToTime(x) {
    return (x - LinePrefix) / MessageSpacing;
}

//计算显示标签的时间间隔
function calculateLabelInterval(len) {
    if (len >= 800) return 7;
    else if (400 <= len && len < 800) return 14;
    else if (200 <= len && len < 400) return 21;
    else if (140 <= len && len < 200) return 28;
    else if (110 <= len && len < 140) return 35;
    else return 365;
}

//值转化为日期
function valueToDate(n) {
    var timeline = myDiagram.model.findNodeDataForKey("timeline");
    var startDate = timeline.start;
    var startDateMs = startDate.getTime() + startDate.getTimezoneOffset() * 60000;
    var msPerDay = 24 * 60 * 60 * 1000;
    var date = new Date(startDateMs + n * msPerDay);
    return date.toLocaleDateString();
}

//日期转化为值
function dateToValue(d) {
    var timeline = myDiagram.model.findNodeDataForKey("timeline");
    var startDate = timeline.start;
    var startDateMs = startDate.getTime() + startDate.getTimezoneOffset() * 60000;
    var dateInMs = d.getTime() + d.getTimezoneOffset() * 60000;
    var msSinceStart = dateInMs - startDateMs;
    var msPerDay = 24 * 60 * 60 * 1000;
    return msSinceStart / msPerDay;
}

//计算时间线的天数
function timelineDays() {
    var timeline = myDiagram.model.findNodeDataForKey("timeline");
    var startDate = timeline.start;
    var endDate = timeline.end;

    function treatAsUTC(date) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }

    function daysBetween(startDate, endDate) {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
    }
    return daysBetween(startDate, endDate);
}




//加载数据
function load() {
    //模拟数据
    var callHistoryData = {
        //"nodeKeyProperty": "name",
        //"nodeTextProperty": "phoneNum",
        //"nodeFromProperty": "callFrom",
        //"nodeToProperty": "callTo",
        "nodeDataArray": [
        { "key": "Fred", "phoneNum": "15801316375" },
        { "key": "Bob", "phoneNum": "13552915937" },
        { "key": "Hank", "phoneNum": "18701306061" },
        { "key": "Renee", "phoneNum": "13126515995" }
        ],
        "linkDataArray": [
        { "from": "Fred", "to": "Bob", startTime: new Date("1 Jan 2016"), "length": "0:30" },
        { "from": "Bob", "to": "Hank", startTime: new Date("18 Jan 2016"), "length": "1:20" },
        { "from": "Bob", "to": "Fred", startTime: new Date("15 Feb 2016"), "length": "5:30" },
        { "from": "Hank", "to": "Bob", startTime: new Date("30 May 2016"), "length": "2:33" },
        { "from": "Bob", "to": "Fred", startTime: new Date("4 Jul 2016"), "length": "1:30" },
        { "from": "Fred", "to": "Renee", startTime: new Date("5 Sep 2016"), "length": "5:30" }
        ]
    };

    //获取解析数据
    var modelData = analysisData(callHistoryData);

    //生成数据模型
    myDiagram.model = new go.GraphLinksModel(modelData.nodeDataArray, modelData.linkDataArray);

    //模拟时间线数据
    var timeLineData = {
        key: "timeline",
        category: "Line",
        lineSpacing: 30,
        length: 700,
        start: new Date("1 Jan 2016"),
        end: new Date("31 Dec 2016")
    };

    //添加时间线数据
    myDiagram.model.addNodeData(timeLineData);
}

//解析数据
function analysisData(data) {
    var nodeDataArray = data.nodeDataArray;
    var linkDataArray = data.linkDataArray;
    var newNodeDataArray = [];
    var newLinkDataArray = [];

    if (nodeDataArray !== undefined && nodeDataArray !== null) {
        for (var i = 0; i < nodeDataArray.length; i++) {
            var nodeData = nodeDataArray[i];

            var newNodeData = copy(nodeData);
            newNodeData.index = i + 1;
            newNodeData.duration = 30;
            newNodeData.isGroup = true;

            newNodeDataArray.push(newNodeData);
        }
    }

    if (linkDataArray !== undefined && linkDataArray !== null) {
        for (var i = 0; i < linkDataArray.length; i++) {
            var linkData = linkDataArray[i];

            var newLinkData = copy(linkData);
            //newLinkData.index = i;
            //newLinkData.duration = 18;

            newLinkDataArray.push(newLinkData);
        }
    }

    var modelData = {
        "nodeDataArray": newNodeDataArray,
        "linkDataArray": newLinkDataArray,
    };

    return modelData;
}

//对象复制
function copy(obj) {
    //if (typeof (obj) !== 'object')
    //    return obj;

    if (obj === null)
        return obj;

    var newObj = {};
    for (var i in obj)
        newObj[i] = obj[i];

    return newObj;
}

