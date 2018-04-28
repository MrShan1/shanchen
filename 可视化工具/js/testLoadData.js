$(function() {
	var testData = {
		"entityTypes" : [ {
			"id" : "PE",
			"name" : "人员",
			"iconName" : "/static/20170214/images/visualization/icon/person.png",
			"propertyValues" : [ {
				"id" : "PE",
				"value" : "父亲"
			} ]
		}, {
			"id" : "CA",
			"name" : "车辆",
			"iconName" : "/static/20170214/images/visualization/icon/car.png",
			"propertyValues" : [ {
				"id" : "ca",
				"value" : "车牌"
			} ]
		},
		// { "id": "AI", "name": "飞机", "iconName": "/static/20170214/images/visualization/icon/airplane.png" },
		// { "id": "TR", "name": "火车", "iconName": "/static/20170214/images/visualization/icon/train.png" },
		{
			"id" : "HO",
			"name" : "房屋",
			"iconName" : "/static/20170214/images/visualization/icon/home.png"
		}, {
			"id" : "PH",
			"name" : "手机",
			"iconName" : "/static/20170214/images/visualization/icon/phone.png"
		}, ],
		"linkTypes" : [ {
			"id" : "PE_PE_01",
			"isTwoWay" : true,
			"name" : "父子",
			"canFilter" : false,
			"fromEntityTypeId" : "PE",
			"toEntityTypeId" : "PE"
		}, {
			"id" : "PE_PE_02",
			"isTwoWay" : true,
			"name" : "母子",
			"canFilter" : false,
			"fromEntityTypeId" : "PE",
			"toEntityTypeId" : "PE"
		}, {
			"id" : "PE_PE_03",
			"isTwoWay" : true,
			"name" : "夫妻",
			"canFilter" : false
		}, {
			"id" : "PE_PE_04",
			"isTwoWay" : true,
			"name" : "朋友",
			"canFilter" : false
		}, {
			"id" : "PE_PE_05",
			"isTwoWay" : true,
			"name" : "同飞机",
			"canFilter" : true
		}, {
			"id" : "PE_PE_06",
			"isTwoWay" : true,
			"name" : "同火车",
			"canFilter" : true
		}, {
			"id" : "PE_CA_01",
			"isTwoWay" : true,
			"name" : "人-车",
			"canFilter" : false
		}, {
			"id" : "PE_HO_01",
			"isTwoWay" : true,
			"name" : "人-房",
			"canFilter" : false
		}, {
			"id" : "PE_PH_01",
			"isTwoWay" : true,
			"name" : "人-机",
			"canFilter" : false,
			"fromEntityTypeId" : "PE",
			"toEntityTypeId" : "PH"
		}, {
			"id" : "PH_PH_01",
			"isTwoWay" : true,
			"name" : "通话",
			"canFilter" : true
		}, ],
		"entities" : [ {
			"id" : "PE001",
			"typeId" : "PE",
			"color" : "red",
			"scale" : 1.75,
			"mark" : "大尺寸",
			"isMain" : true,
			"propertyValues" : [ {
				"id" : "PE",
				"value" : "父亲"
			} ]
		}, {
			"id" : "PE002",
			"typeId" : "PE",
			"color" : "white",
			"scale" : 1,
			"mark" : "标签",
			"isMain" : true,
			"propertyValues" : [ {
				"id" : "PE",
				"value" : "母亲"
			} ]
		}, {
			"id" : "PE003",
			"typeId" : "PE",
			"color" : "white",
			"scale" : 1,
			"mark" : "标签",
			"isMain" : true,
			"propertyValues" : [ {
				"id" : "PE",
				"value" : "孩子"
			} ]
		}, {
			"id" : "PE004",
			"typeId" : "PE",
			"color" : "blue",
			"scale" : 1.75,
			"mark" : "嘿嘿嘿",
			"isMain" : false,
			"propertyValues" : [ {
				"id" : "PE",
				"value" : "朋友1"
			} ]
		}, {
			"id" : "PE005",
			"typeId" : "PE",
			"color" : "white",
			"scale" : 1,
			"mark" : "标签",
			"isMain" : false,
			"propertyValues" : [ {
				"id" : "PE",
				"value" : "朋友2"
			} ]
		}, {
			"id" : "PE006",
			"typeId" : "PE",
			"color" : "white",
			"scale" : 1,
			"mark" : "标签",
			"isMain" : false,
			"propertyValues" : [ {
				"id" : "PE",
				"value" : "朋友3"
			} ]
		}, {
			"id" : "PE007",
			"typeId" : "PE",
			"color" : "white",
			"scale" : 1,
			"mark" : "标签",
			"isMain" : false,
			"propertyValues" : [ {
				"id" : "PE",
				"value" : "朋友4"
			} ]
		}, {
			"id" : "PE008",
			"typeId" : "PE",
			"color" : "white",
			"scale" : 1,
			"mark" : "标签",
			"isMain" : false,
			"propertyValues" : [ {
				"id" : "PE",
				"value" : "朋友5"
			} ]
		}, {
			"id" : "PH001",
			"typeId" : "PH",
			"color" : "white",
			"scale" : 1,
			"mark" : "标签",
			"isMain" : false,
			"propertyValues" : [ {
				"id" : "PH",
				"value" : "手机1"
			} ]
		}, {
			"id" : "PH002",
			"typeId" : "PH",
			"color" : "white",
			"scale" : 1,
			"mark" : "标签",
			"isMain" : false,
			"propertyValues" : [ {
				"id" : "PH",
				"value" : "手机2"
			} ]
		}, {
			"id" : "PH003",
			"typeId" : "PH",
			"color" : "white",
			"scale" : 1,
			"mark" : "标签",
			"isMain" : false,
			"propertyValues" : [ {
				"id" : "PH",
				"value" : "手机3"
			} ]
		}, {
			"id" : "PH004",
			"typeId" : "PH",
			"color" : "white",
			"scale" : 1,
			"mark" : "标签",
			"isMain" : false,
			"propertyValues" : [ {
				"id" : "PH",
				"value" : "手机4"
			} ]
		}, {
			"id" : "CA001",
			"typeId" : "CA",
			"color" : "white",
			"scale" : 1,
			"mark" : "标签",
			"isMain" : false,
			"propertyValues" : [ {
				"id" : "CA",
				"value" : "车辆1"
			} ]
		}, {
			"id" : "HO001",
			"typeId" : "HO",
			"color" : "white",
			"scale" : 1,
			"mark" : "标签",
			"isMain" : false,
			"propertyValues" : [ {
				"id" : "HO",
				"value" : "房屋1"
			} ]
		}, ],
		"links" : [ {
			"id" : "PE_PE_01_001",
			"typeId" : "PE_PE_01",
			"fromEntityId" : "PE001",
			"toEntityId" : "PE003",
			"propertyValues" : [ {
				"id" : "PE_PE_01",
				"value" : "父子"
			} ]
		}, {
			"id" : "PE_PE_02_001",
			"typeId" : "PE_PE_02",
			"fromEntityId" : "PE002",
			"toEntityId" : "PE003",
			"propertyValues" : [ {
				"id" : "PE_PE_02",
				"value" : "母子"
			} ]
		}, {
			"id" : "PE_PE_02_002",
			"typeId" : "PE_PE_02",
			"fromEntityId" : "PE006",
			"toEntityId" : "PE005",
			"propertyValues" : [ {
				"id" : "PE_PE_02",
				"value" : "母子"
			} ]
		}, {
			"id" : "PE_PE_03_001",
			"typeId" : "PE_PE_03",
			"fromEntityId" : "PE001",
			"toEntityId" : "PE002",
			"propertyValues" : [ {
				"id" : "PE_PE_03",
				"value" : "夫妻"
			} ]
		}, {
			"id" : "PE_PE_04_001",
			"typeId" : "PE_PE_04",
			"fromEntityId" : "PE003",
			"toEntityId" : "PE004",
			"propertyValues" : [ {
				"id" : "PE_PE_04",
				"value" : "朋友"
			} ]
		}, {
			"id" : "PE_PE_04_002",
			"typeId" : "PE_PE_04",
			"fromEntityId" : "PE004",
			"toEntityId" : "PE005",
			"propertyValues" : [ {
				"id" : "PE_PE_04",
				"value" : "朋友"
			} ]
		},
		// { "id": "PE_PE_04_003", "typeId": "PE_PE_04", "fromEntityId": "PE002", "toEntityId": "PE006", "propertyValues": [{ "id": "PE_PE_04",
		// "value": "朋友" }] },
		// { "id": "PE_PE_04_004", "typeId": "PE_PE_04", "fromEntityId": "PE002", "toEntityId": "PE007", "propertyValues": [{ "id": "PE_PE_04",
		// "value": "朋友" }] },
		// { "id": "PE_PE_04_005", "typeId": "PE_PE_04", "fromEntityId": "PE007", "toEntityId": "PE008", "propertyValues": [{ "id": "PE_PE_04",
		// "value": "朋友" }] },
		{
			"id" : "PE_PH_01_001",
			"typeId" : "PE_PH_01",
			"fromEntityId" : "PE003",
			"toEntityId" : "PH001",
			"propertyValues" : [ {
				"id" : "PE_PH_01",
				"value" : "人-机"
			} ]
		}, {
			"id" : "PE_PH_01_002",
			"typeId" : "PE_PH_01",
			"fromEntityId" : "PE004",
			"toEntityId" : "PH002",
			"propertyValues" : [ {
				"id" : "PE_PH_01",
				"value" : "人-机"
			} ]
		}, {
			"id" : "PE_PH_01_003",
			"typeId" : "PE_PH_01",
			"fromEntityId" : "PE005",
			"toEntityId" : "PH003",
			"propertyValues" : [ {
				"id" : "PE_PH_01",
				"value" : "人-机"
			} ]
		}, {
			"id" : "PE_PH_01_004",
			"typeId" : "PE_PH_01",
			"fromEntityId" : "PE001",
			"toEntityId" : "PH004",
			"propertyValues" : [ {
				"id" : "PE_PH_01",
				"value" : "人-机"
			} ]
		}, {
			"id" : "PE_CA_01_001",
			"typeId" : "PE_CA_01",
			"fromEntityId" : "PE001",
			"toEntityId" : "CA001",
			"propertyValues" : [ {
				"id" : "PE_CA_01",
				"value" : "人-车"
			} ]
		}, {
			"id" : "PE_HO_01_001",
			"typeId" : "PE_HO_01",
			"fromEntityId" : "PE001",
			"toEntityId" : "HO001",
			"propertyValues" : [ {
				"id" : "PE_HO_01",
				"value" : "人-房"
			} ]
		}, {
			"id" : "PH_PH_01_001",
			"typeId" : "PH_PH_01",
			"fromEntityId" : "PH001",
			"toEntityId" : "PH002",
			"filterValue" : 5,
			"propertyValues" : [ {
				"id" : "PH_PH_01",
				"value" : "通话5次"
			} ]
		}, {
			"id" : "PH_PH_01_002",
			"typeId" : "PH_PH_01",
			"fromEntityId" : "PH002",
			"toEntityId" : "PH003",
			"filterValue" : 5,
			"propertyValues" : [ {
				"id" : "PH_PH_01",
				"value" : "通话5次"
			} ]
		}, {
			"id" : "PH_PH_01_003",
			"typeId" : "PH_PH_01",
			"fromEntityId" : "PH001",
			"toEntityId" : "PH004",
			"filterValue" : 5,
			"propertyValues" : [ {
				"id" : "PH_PH_01",
				"value" : "通话5次"
			} ]
		}, {
			"id" : "PE_PE_05_001",
			"typeId" : "PE_PE_05",
			"fromEntityId" : "PE002",
			"toEntityId" : "PE007",
			"filterValue" : 5,
			"propertyValues" : [ {
				"id" : "PE_PE_05",
				"value" : "同飞机5次"
			} ]
		}, {
			"id" : "PE_PE_05_002",
			"typeId" : "PE_PE_05",
			"fromEntityId" : "PE007",
			"toEntityId" : "PE008",
			"filterValue" : 5,
			"propertyValues" : [ {
				"id" : "PE_PE_05",
				"value" : "同飞机5次"
			} ]
		}, {
			"id" : "PE_PE_06_002",
			"typeId" : "PE_PE_06",
			"fromEntityId" : "PE002",
			"toEntityId" : "PE006",
			"filterValue" : 5,
			"propertyValues" : [ {
				"id" : "PE_PE_05",
				"value" : "同火车5次"
			} ]
		}, ],
	};
	
	$("#test").click(function() {
	    loadDiagramData(testData, true, false, false);
	});

	$("#expandTest").click(function () {
	    if (!visTool) return;

	    var nodes = visTool.diagram.currentModel.filterNode(function (data) {
	        if (data.isNode && data.isSelected) {
	            return true;
	        }

	        return false;
	    });

	    visTool.diagram.startNodes = nodes;

	    expandRelation(nodes.toArray(), true, false, false);
	});

	function expandRelation(nodeDataArray) {
	    if (!nodeDataArray || nodeDataArray.length === 0) return;

	    var entities = []
	    var links = [];
	    var expandCount = 5;

	    for (var i = 0; i < nodeDataArray.length; i++) {
	        var data = nodeDataArray[i];
	        var propertyId = data.propertyValues[0].id;
	        var propertyValue = data.propertyValues[0].value;

	        for (var j = 0; j < expandCount; j++) {
	            var nodeData = {
	                id: data.id+"_"+j,
	                typeId: data.typeId,
	                color: data.color,
	                scale: 1,
	                mark: "标签",
	                isMain: false,
	                propertyValues: [{
	                    id: propertyId,
	                    value: propertyValue + "_" + j
	                }]
	            };

	            entities.push(nodeData);

	            var linkData = {
	                id: data.id+"_"+nodeData.id,
	                typeId: "PE_PE_04",
	                fromEntityId: data.id,
	                toEntityId: nodeData.id,
	                propertyValues : [ {
	                    id: propertyId,
	                    value : "测试"
	                }]
	            };

	            links.push(linkData);
	        }
	    }

	    loadDiagramData({ entities: entities, links: links }, true, false, false);
	};
});