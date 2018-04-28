/// <reference path="go.js" />
//var model = new go.GraphLinksModel(); // 创建视图的数据模型
$(function() {
	// loadStatisticalData();
	
})

// function toggleOther(other1) {
// // $('.' + other1).toggle();
// analysisObjectStatistics();
// }

function loadStatisticalData() {
	model = getDiagramModelForStatistic();
	var nLength = model.nodeDataArray.length;
	jsonData = JSON.stringify(model.nodeDataArray);
	for (var i = 0; i < nLength; i++) {
		var node = model.nodeDataArray[i];
		// alert(JSON.stringify(node));
	}
	
	// $('#fxdx').dataTable(
	// {
	// "data" : [ [ 1, "17610608727", "手机号码", 6, 8, "搭桥人", "一般大", "默认白" ], [ 2, "17610608727", "手机号码", 6, 8, "搭桥人", "一般大", "默认白" ],
	// [ 3, "17610608727", "手机号码", 6, 8, "搭桥人", "一般大", "默认白" ], [ 4, "17610608727", "手机号码", 6, 8, "搭桥人", "一般大", "默认白" ],
	// [ 5, "17610608727", "手机号码", 6, 8, "搭桥人", "一般大", "默认白" ], [ 6, "17610608727", "手机号码", 6, 8, "搭桥人", "一般大", "默认白" ] ],
	// "ordering" : false, // 是否排序
	// "searching" : false,
	// "language" : {
	// search : "模糊查询：",
	// lengthMenu : "每页 _MENU_ 条记录",
	// paginate : {
	// first : "首页",
	// previous : "上一页",
	// next : "下一页",
	// last : "尾页"
	// },
	// lengthMenu : "显示 _MENU_ 记录",
	// info : "当前显示_START_到_END_，共_TOTAL_条记录",
	// infoFiltered : "(过滤总条数 _MAX_ 条)",
	// emptyTable : "未有相关数据",
	// infoEmpty : "当前显示0到0，共0条记录",
	// zeroRecords : "对不起，查询不到任何相关数据",
	// loadingRecords : "正在加载数据，请稍候.....",
	// processing : "正在加载数据，请稍候.....",
	// url : ""
	// },
	// "lengthMenu" : [ [ 5, 10, 25, 50, 100 ], [ 5, 10, 25, 50, 100 ] ],
	// "displayLength" : 5,// 设置默认显示条数
	// });
	
	// var tt = [ [ 3, "同飞", 8, 1, 6 ], [ 4, "同住", 12, 2, 10 ] ];
	// $('#fxdx2').dataTable({
	// "data" : tt
	// });
	
};
var $analysisObjectDataTable;
function analysisObjectStatistics() {
	// $('#fxdx').dataTable().clear().draw();
	model = getDiagramModelForStatistic();
	var data = analysisObject(model);
	$analysisObjectDataTable = intitialDataTable("fxdx", data);
};

function analysisObject_getSelectedRow() {
	var nTrs = $analysisObjectDataTable.fnGetNodes();
	for (var i = 0; i < nTrs.length; i++) {
		if ($(nTrs[i]).hasClass('selected')) {
			var selectedRowData = $analysisObjectDataTable.fnGetData(nTrs[i]);
			alert(selectedRowData[1]);
			toggleOther("sjyp-box");
		}
	}
}

var analysisObjectExpandLinkNode = new go.Set();
var analysisObjectNodeNum = new go.Set();
var analysisObjectLinkNum = new go.Set();
/**
 * 获取分析对象数据统计
 * 
 * @param model {Object} model数据
 */
function analysisObject(model) {
	var analysisObjectDataList = [];
	var j = 0;
	var entityTypes = [ {
		"id" : "PE",
		"name" : "人员",
		"iconName" : "/static/20170214/images/visualization/icon/person.png"
	}, {
		"id" : "CA",
		"name" : "车辆",
		"iconName" : "/static/20170214/images/visualization/icon/car.png"
	}, {
		"id" : "HO",
		"name" : "房屋",
		"iconName" : "/static/20170214/images/visualization/icon/home.png"
	}, {
		"id" : "PH",
		"name" : "手机",
		"iconName" : "/static/20170214/images/visualization/icon/phone.png"
	}, ];
	model.eachNode(function(data) {
		if (data.isMain) {
			var analysisObjectData = []; // 节点数据类型集合
			j++;
			analysisObjectData.push(j);
			
			var propertyValues = data.propertyValues;
			// this.propertyValues.each(function(obj) {
			// analysisObjectData.push(obj.value);
			// });
			var propertyValue = propertyValues[0].value;
			analysisObjectData.push(propertyValue);
			var typeId = data.typeId;
			
			var length = entityTypes.length;
			for (var i = 0; i < length; i++) {
				var item = entityTypes[i];
				if (item.id === typeId) {
					analysisObjectData.push(item.name);
				}
			}
			
			analysisObjectNode = new go.Set();
			analysisObjectNodeNum = new go.Set();
			analysisObjectLinkNum = new go.Set();
			analysisObjectExpandLinkNode = new go.Set();
			
			var analysisObjectExpandLinkNum = expandLinkNum(data);
			var number1 = analysisObjectExpandLinkNum.iterator.count;
			analysisObjectData.push(number1);
			var analysisObjectExpandNodeNum = expandNodeNum(data);
			var number2 = analysisObjectExpandNodeNum.iterator.count;
			analysisObjectData.push(number2);
			
			var mark = data.mark;
			analysisObjectData.push(mark);
			var scale = data.scale;
			if (scale == vis.Consts.scale0) {
				analysisObjectData.push("一般小");
			} else if (scale == vis.Consts.scale1) {
				analysisObjectData.push("关注大");
			}
			var color = data.color;
			if (color = vis.ColorConfigTool.Color0) {
				analysisObjectData.push("白色");
			} else if (color = vis.ColorConfigTool.Color1) {
				analysisObjectData.push("红色");
			} else if (color = vis.ColorConfigTool.Color2) {
				analysisObjectData.push("橙色");
			} else if (color = vis.ColorConfigTool.Color3) {
				analysisObjectData.push("蓝色");
			} else if (color = vis.ColorConfigTool.Color4) {
				analysisObjectData.push("绿色");
			}
			
			var selectColor;
			$("#fxdx_color option:selected").each(function() {
				selectColor = $(this).val();
			});
			if ((selectColor == "" || selectColor == color) && propertyValue.search($("#fxdx_name").val().trim()) != -1) {
				debugger;
				analysisObjectDataList.push(analysisObjectData);
			}
		}
	});
	return analysisObjectDataList;
};

function expandNodeNum(obj) {
	var analysisObjectNode = model.findNodeDataForKey(obj.id);
	model.findNodesConnected(analysisObjectNode).each(function(node) {
		if (!analysisObjectNodeNum.contains(node)) {
			analysisObjectNodeNum.add(node);
			this.expandNodeNum(node);
		}
	});
	return analysisObjectNodeNum;
};

function expandLinkNum(obj) {
	analysisObjectExpandLinkNode.add(obj);
	var analysisObjectNode = model.findNodeDataForKey(obj.id);
	model.findLinksConnected(analysisObjectNode).each(function(link) {
		if (!analysisObjectLinkNum.contains(link)) {
			analysisObjectLinkNum.add(link);
			var fromNode = model.findNodeDataForKey(link.fromEntityId);
			if (!analysisObjectExpandLinkNode.contains(fromNode)) {
				this.expandLinkNum(fromNode);
			}
			var toNode = model.findNodeDataForKey(link.toEntityId);
			if (!analysisObjectExpandLinkNode.contains(toNode)) {
				this.expandLinkNum(toNode);
			}
		}
	});
	return analysisObjectLinkNum;
};
var $expandRelationDataTable;
function expandRelationStatistics() {
	model = getDiagramModelForStatistic();
	var data = expandRelation(model);
	debugger;
	$expandRelationDataTable = intitialDataTable("tzgx", data);
};

function expandRelation_getSelectedRow() {
	var nTrs = $expandRelationDataTable.fnGetNodes();
	for (var i = 0; i < nTrs.length; i++) {
		if ($(nTrs[i]).hasClass('selected')) {
			var selectedRowData = $expandRelationDataTable.fnGetData(nTrs[i]);
			alert(selectedRowData[1]);
			toggleOther("sjyp-box");
		}
	}
}
var expandRelationLinkTypes = new go.Set("string");
var expandRelationLinkNum = 0;
var expandRelationAnalysisNodeNum = new go.Set();
var expandRelationResultNodeNum = new go.Set();

/**
 * 获取拓展关系数据统计
 * 
 * @param model {Object} model数据
 */
function expandRelation(model) {
	var expandRelationDataList = [];
	var linkTypes = [ {
		"id" : "PE_PE_01",
		"isTwoWay" : true,
		"name" : "父子",
		"canFilter" : false
	}, {
		"id" : "PE_PE_02",
		"isTwoWay" : true,
		"name" : "母子",
		"canFilter" : false
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
		"canFilter" : false
	}, {
		"id" : "PH_PH_01",
		"isTwoWay" : true,
		"name" : "通话",
		"canFilter" : true
	}, ]
	model.eachLink(function(link) {
		if (link.typeId) {
			if (!expandRelationLinkTypes.contains(link.typeId)) {
				expandRelationLinkTypes.add(link.typeId);
			}
		}
	});
	var iterator = expandRelationLinkTypes.iterator;
	var j = 0;
	while (iterator.next()) {
		expandRelationLinkNum = 0;
		expandRelationAnalysisNodeNum = new go.Set();
		expandRelationResultNodeNum = new go.Set();
		// expandRelationLinkNum = null;
		// 统计拓展关系连接对象数
		var expandRelationData = []; // 节点数据类型集合
		j++;
		expandRelationData.push(j);
		var dataLinkValue;
		var length = linkTypes.length;
		for (var i = 0; i < length; i++) {
			var item = linkTypes[i];
			if (item.id === iterator.key) {
				dataLinkValue = item.name;
				expandRelationData.push(item.name);
			}
		}
		debugger;
		var number1 = expendedRelationNum(iterator);
		expandRelationData.push(number1);
		var expandAnalysisNodeNum = analysisNodeNum(iterator);
		var number2 = expandAnalysisNodeNum.iterator.count;
		expandRelationData.push(number2);
		var expandResultNodeNum = resultNodeNum(iterator);// iterator.value
		var number3 = expandResultNodeNum.iterator.count;
		expandRelationData.push(number3);
		
		if (dataLinkValue.search($("#tzgx_name").val().trim()) != -1) {
			expandRelationDataList.push(expandRelationData);
		}
	}
	return expandRelationDataList;
	
};

function expendedRelationNum(obj) {
	model.eachLink(function(link) {
		if (obj.key === link.typeId) {
			expandRelationLinkNum++;
		}
	});
	return expandRelationLinkNum;
};

function analysisNodeNum(obj) {
	model.eachLink(function(link) {
		if (obj.key === link.typeId) {
			var fromNode = model.findNodeDataForKey(link.fromEntityId);
			if (fromNode.isMain) {
				if (!expandRelationAnalysisNodeNum.contains(fromNode)) {
					expandRelationAnalysisNodeNum.add(fromNode);
				}
			}
			var toNode = model.findNodeDataForKey(link.toEntityId);
			if (toNode.isMain) {
				if (!expandRelationAnalysisNodeNum.contains(toNode)) {
					expandRelationAnalysisNodeNum.add(toNode);
				}
			}
		}
	});
	return expandRelationAnalysisNodeNum;
};

function resultNodeNum(obj) {
	model.eachLink(function(link) {
		if (obj.key === link.typeId) {
			var fromNode = model.findNodeDataForKey(link.fromEntityId);
			if (!fromNode.isMain) {
				if (!expandRelationResultNodeNum.contains(fromNode)) {
					expandRelationResultNodeNum.add(fromNode);
				}
			}
			var toNode = model.findNodeDataForKey(link.toEntityId);
			if (!toNode.isMain) {
				if (!expandRelationResultNodeNum.contains(toNode)) {
					expandRelationResultNodeNum.add(toNode);
				}
			}
		}
	});
	return expandRelationResultNodeNum;
};

var $resultObjectDataTable;
function resultObjectStatistics() {
	model = getDiagramModelForStatistic();
	var data = resultObject(model);
	if ($resultObjectDataTable != null) {
		$resultObjectDataTable.fnDestroy();
	}
	$resultObjectDataTable = intitialDataTable("jgdx", data);
};

function resultObject_getSelectedRow() {
	var nTrs = $resultObjectDataTable.fnGetNodes();
	for (var i = 0; i < nTrs.length; i++) {
		if ($(nTrs[i]).hasClass('selected')) {
			var selectedRowData = $resultObjectDataTable.fnGetData(nTrs[i]);
			alert(selectedRowData[1]);
			toggleOther("sjyp-box");
		}
	}
}
var resultObjectNodeNum = new go.Set();
var resultObjectLinkNum = new go.Set();

/**
 * 获取结果对象数据统计
 * 
 * @param model {Object} model数据
 */
function resultObject(model) {
	var resultObjectDataList = [];
	var j = 0;
	var entityTypes = [ {
		"id" : "PE",
		"name" : "人员",
		"iconName" : "/static/20170214/images/visualization/icon/person.png"
	}, {
		"id" : "CA",
		"name" : "车辆",
		"iconName" : "/static/20170214/images/visualization/icon/car.png"
	}, {
		"id" : "HO",
		"name" : "房屋",
		"iconName" : "/static/20170214/images/visualization/icon/home.png"
	}, {
		"id" : "PH",
		"name" : "手机",
		"iconName" : "/static/20170214/images/visualization/icon/phone.png"
	}, ];
	model.eachNode(function(data) {
		if (!data.isMain) {
			var resultObjectData = [];
			j++;
			resultObjectData.push(j);
			
			var propertyValues = data.propertyValues;
			var propertyValue = propertyValues[0].value;
			resultObjectData.push(propertyValue);
			var typeId = data.typeId;
			
			var length = entityTypes.length;
			for (var i = 0; i < length; i++) {
				var item = entityTypes[i];
				if (item.id === typeId) {
					resultObjectData.push(item.name);
				}
			}
			debugger;
			resultObjectNodeNum = new go.Set();
			resultObjectLinkNum = new go.Set();
			var expendedLinkNum = resultObjectExpendedLinkNum(data);
			var number1 = expendedLinkNum.iterator.count;
			resultObjectData.push(number1);
			var expendedNodeNum = resultObjectExpendedNodeNum(data);
			var number2 = expendedNodeNum.iterator.count;
			resultObjectData.push(number2);
			var mark = data.mark;
			resultObjectData.push(mark);
			var scale = data.scale;
			if (scale == vis.Consts.scale0) {
				resultObjectData.push("一般小");
			} else if (scale == vis.Consts.scale1) {
				resultObjectData.push("关注大");
			}
			var color = data.color;
			if (color = vis.ColorConfigTool.Color0) {
				resultObjectData.push("白色");
			} else if (color = vis.ColorConfigTool.Color1) {
				resultObjectData.push("红色");
			} else if (color = vis.ColorConfigTool.Color2) {
				resultObjectData.push("橙色");
			} else if (color = vis.ColorConfigTool.Color3) {
				resultObjectData.push("蓝色");
			} else if (color = vis.ColorConfigTool.Color4) {
				resultObjectData.push("绿色");
			}
			
			var selectColor;
			$("#jgdx_color option:selected").each(function() {
				selectColor = $(this).val();
			});
			if ((selectColor == "" || selectColor == color) && propertyValue.search($("#jgdx_name").val().trim()) != -1) {
				resultObjectDataList.push(resultObjectData);
			}
		}
	});
	return resultObjectDataList;
};

function resultObjectExpendedNodeNum(obj) {
	var resultObjectNode = model.findNodeDataForKey(obj.id);
	model.findNodesConnected(resultObjectNode).each(function(node) {
		if (node.isMain) {
			if (!resultObjectNodeNum.contains(node)) {
				resultObjectNodeNum.add(node);
			}
		}
	});
	return resultObjectNodeNum;
};

function resultObjectExpendedLinkNum(obj) {
	var resultObjectNode = model.findNodeDataForKey(obj.id);
	model.findLinksConnected(resultObjectNode).each(function(link) {
		if (!resultObjectLinkNum.contains(link)) {
			resultObjectLinkNum.add(link);
		}
	});
	return resultObjectLinkNum;
};
/**
 * 表格展示数据统计
 * 
 */
function visualization_dataTable() {
	model.eachLink(function(link) {
		var fromNode = model.findNodeDataForKey(link.fromEntityId);
		formNode.id;
		var toNode = model.findNodeDataForKey(link.toEntityId);
	});
};

function checkDetail(linkData) {
	debugger;
	var linkDataId = linkData.id;
	var linkDataFromEntityId = linkData.fromEntityId;
	$visualizationLinkDetail_dataTable = myDataTable("visualizationLinkDetail_dataTable", {
		ajax : {
			url : basePath + "/cooperationReplace/queryList.action",
			data : function(d) {
				
			}
		},
		columns : [ {
			data : null,
			"width" : "5%",
		}, {
			data : "sendPersonName",
			"width" : "10%",
			defaultContent : ""
		}, {
			data : "projectName",
			"width" : "10%",
			defaultContent : ""
		}, {
			data : "projectCreatorName",
			"width" : "10%",
			defaultContent : ""
		}, {
			data : "explain",
			"width" : "15%",
			defaultContent : ""
		}, {
			data : "createDate",
			"width" : "10%",
			defaultContent : ""
		}, {
			data : "status",
			"width" : "5%",
			defaultContent : ""
		} ]
	}, "");
	
	$('#fxdx').dataTable(
			{
				"data" : [ [ 1, "Tiger Nixon", "System Architect", "$3,120", "2011/04/25", "Edinburgh", 5421, 5421 ],
						[ 2, "Garrett Winters", "Director", "$8,422", "2011/07/25", "Edinburgh", 8422, 8422 ] ],
				"ordering" : false, // 是否排序
				"searching" : false
			// 是否启用自带查询框
			});
};
function toggleOther2(other1) {
	$('#' + other1).toggle();
}

function intitialDataTable(id, data) {
	var $myDataTable = $('#' + id).dataTable({
		"dom" : "<'float_left'f>r<'float_right'l>tip",// 布局// dom定位
		"destroy" : true,
		"data" : data,
		"ordering" : false, // 是否排序
		"searching" : false,
		"language" : {
			search : "模糊查询：",
			lengthMenu : "每页 _MENU_ 条记录",
			paginate : {
				first : "首页",
				previous : "上一页",
				next : "下一页",
				last : "尾页"
			},
			lengthMenu : "显示 _MENU_ 记录",
			info : "当前显示_START_到_END_，共_TOTAL_条记录",
			infoFiltered : "(过滤总条数 _MAX_ 条)",
			emptyTable : "未有相关数据",
			infoEmpty : "当前显示0到0，共0条记录",
			zeroRecords : "对不起，查询不到任何相关数据",
			loadingRecords : "正在加载数据，请稍候.....",
			processing : "正在加载数据，请稍候.....",
			url : ""
		},
		"lengthMenu" : [ [ 5, 10, 25, 50, 100 ], [ 5, 10, 25, 50, 100 ] ],
		"displayLength" : 5,// 设置默认显示条数
	});
	$tbEvt = $._data($("#" + id)[0], "events");
	if ($tbEvt && $tbEvt["click"]) {// 判断是否存在点击事件
		$("#" + id).unbind("click");// 删除点击事件
		$("#" + id + ' tbody').unbind("click");
	}
	$("#" + id).on("click", "tr", function() {// 添加列表每行的单击事件
		if ($(this).attr("class")) {
			if (($(this).attr("class").indexOf("selected") == -1)) {
				$("#" + id).find(" tr").removeClass("selected");
				// $("#" + id + " tbody tr").removeClass("selected");
			}
		}
		$(this).toggleClass("selected");
	});
	
	return $myDataTable;
}
