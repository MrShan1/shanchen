$(function() {
	cdr_seriesJudge_initVisualEntityLinkType_ajax();
})

/**
 * 可视化页面：只接不打模型ajax添加数据
 */
function cdr_seriesJudge_initVisualEntityLinkType_ajax() {
	$.post(basePath + "/cdr/seriesJudge/initVisualEntityLinkType.action", {}, function(data, status) {
		loadDiagramData(data, true, false, false);
	})
}

var nodeData;
/**
 * 打开点研判层
 * 
 * @param data {Object} 实体数据
 */
function openJudgeEntityDataLayer(data) {
	if (!data) {
		return;
	}
	toShowOther("js-icon-shiti");
	toHideOther("js-icon-xqyp");
	// handleClass('.js-icon-xqyp', ' icon-active')
	$('.js-icon-shiti').addClass('icon-active').siblings().removeClass('icon-active');
	// 关闭其他面板
	toHideOther("right-many-function");
	toHideOther("ljyp-box");
	// 打开点研判面板
	toShowOther("sjyp-box");
	// 设置实体对象id
	$("#sjyp_entityId").val(data.id);
	nodeData = data;
	
	var dataValue;
	var propertyValues = data.propertyValues;
	if (propertyValues.length > 0) {
		for (var i = 0; i < propertyValues.length; i++) {
			var propertyValue = propertyValues[i];
			if (i == 0) {
				// 设置批注标题文本
				dataValue = propertyValue.value;
			}
		}
	}
	
	// 获取实体数据对应的基本信息 TODO
	var basicDataArray = [ {
		key : "手机号码",
		value : dataValue
	} ];
	
	// 设置基本信息列表
	setBasicDataList(basicDataArray);
	
	// 设置选中的背景颜色
	setSelectedColor(data.color);
	
	// 设置选中的图标大小
	setSelectedScale(data.scale);
	
	// 设置预判标签文本
	setMark(data.mark);
	
	// 设置批注文本
	setComment(data);
};

/**
 * 获取节点基本信息列表
 * 
 * @param nodeId 节点Id
 * @return dataArray {Array} 节点基本信息集合
 */
function getBasicDataList(nodeId) {
	myAjax({
		url : basePath + "/cdr/billedManagement/callRecordTask/callRecordTaskDelete.action",
		data : {
			id : nodeId
		},
		success : function(json) {
			if (json.success) {
				return json.obj;
			}
		}
	})
};

/**
 * 设置基本信息列表
 * 
 * @param dataArray {Array} 基本信息集合
 */
function setBasicDataList(dataArray) {
	if (!dataArray) {
		return;
	}
	
	var $ul = $("#basicDataList"); // 获取基本信息列表对象
	
	// 判断页面对象是否存在
	if ($ul.length === 0) {
		return;
	}
	
	// 清空基本信息列表
	$ul.empty();
	
	// 填充列表
	for (var i = 0; i < dataArray.length; i++) {
		var data = dataArray[i];
		var $i = $("<i class='st-width in-b al-r fl'></i>").html(data.key + "：");
		var $span = $("<div style='margin-left:80px;'></div>").html(data.value);
		var $li = $("<li></li>").append($i).append($span);
		
		// 向页面对象中添加基本信息
		$ul.append($li);
	}
};

/**
 * 设置选中的背景颜色
 * 
 * @param color {String} 实体颜色
 */
function setSelectedColor(color) {
	if (!color || !vis) {
		return;
	}
	
	var colorId = null; // 颜色对象id
	var pre = "entityColor";
	
	// 获取颜色对应的颜色id
	switch (color) {
		case vis.ColorConfigTool.Color1:
			colorId = pre + "1";
			break;
		case vis.ColorConfigTool.Color2:
			colorId = pre + "2";
			break;
		case vis.ColorConfigTool.Color3:
			colorId = pre + "3";
			break;
		case vis.ColorConfigTool.Color4:
			colorId = pre + "4";
			break;
		default:
			colorId = pre + "0";
			break;
	}
	
	// 获取颜色对象
	var $span = $("#" + colorId);
	// 清除同级的其他对象的选中样式
	// $span.siblings('.factor-tag-span').find('.factor-tag-jx').removeClass('select');
	// 选中当前对象
	// $span.find('.factor-tag-jx').addClass('select');
	$span.addClass('select').siblings().removeClass('select');
};

/**
 * 设置选中的图标大小
 * 
 * @param scale {String} 实体尺寸
 */
function setSelectedScale(scale) {
	if (!scale || !vis) {
		return;
	}
	
	var scaleId = null; // 尺寸对象id
	var pre = "entityScale";
	
	// 获取尺寸对应的尺寸id
	if (scale === vis.Consts.scale1) {
		scaleId = pre + "1";
	} else {
		scaleId = pre + "0";
	}
	
	// 获取尺寸对象
	var $span = $("#" + scaleId);
	$span.addClass('select').siblings().removeClass('select');
};

/**
 * 设置预判标签文本
 * 
 * @param mark {String} 实体标签
 */
function setMark(mark) {
	if (mark) {
		// 设置标签文本
		$("#mark").val(mark);
	} else {
		// 设置标签文本
		$("#mark").val("");
	}
};

/**
 * 设置批注文本
 * 
 * @param data {object} 实体
 */
function setComment(data) {
	
	if (data.commentTitle) {
		// 设置批注标题
		$("#commentTitle").val(data.commentTitle);
	} else {
		$("#commentTitle").val("");
	}
	
	if (data.commentValue) {
		// 设置批注内容
		$("#commentValue").val(data.commentValue);
	} else {
		$("#commentValue").val("");
	}
	
	// var propertyValues = data.propertyValues;
	// if (propertyValues.length > 0) {
	// for (var i = 1; i < propertyValues.length; i++) {
	// var propertyValue = propertyValues[i];
	// if (i == 1) {
	// // 设置批注标题文本
	// $("#commentTitle").val(propertyValue.id);
	// // 设置批注内容文本
	// $("#commentValue").val(propertyValue.value);
	// }
	// }
	// }
};

/**
 * 研判实体数据
 */
function judgeEntityData() {
	var id = $("#sjyp_entityId").val(); // 获取实体id
	var color = getSelectedColor(); // 获取选中颜色
	var scale = getSelectedScale(); // 获取选中尺寸
	var mark = $("#mark").val(); // 获取标签文本
	// var comment = []; // 获取批注文本
	//	
	// var propertyValues = nodeData.propertyValues;
	// var propertyValue = "{\" id\":\"" + propertyValues[0].id + "\",\" value\":\"" + propertyValues[0].value + "\"}"; // 获取标签文本
	// var commentValue = "{\" id\":\"" + $("#commentTitle").val() + "\",\" value\":\"" + $("#commentValue").val() + "\"}"; // 获取标签文本
	// comment.push(JSON.parse(propertyValue));
	// comment.push(JSON.parse(commentValue));
	
	var properties = []; // 要修改的属性集合
	
	properties.push({
		key : "color",
		value : color
	});
	properties.push({
		key : "scale",
		value : scale
	});
	properties.push({
		key : "mark",
		value : mark
	});
	
	// properties.push({
	// key : "propertyValues",
	// value : comment
	// });
	
	properties.push({
		key : "commentTitle",
		value : $("#commentTitle").val()
	});
	properties.push({
		key : "commentValue",
		value : $("#commentValue").val()
	});
	
	// 编辑实体数据
	editEntityData(id, properties);
	
	// 隐藏点研判面板
	toHideOther('sjyp-box');
	
	toHideOther("js-icon-xqyp");
};

/**
 * 获取选中的背景颜色
 * 
 * @return {String} 选中颜色
 */
function getSelectedColor() {
	if (!vis) {
		return;
	}
	
	var color = null; // 选中颜色
	var colorId = $("#colorDiv").find(".select").attr("id"); // 选中的颜色对象
	var pre = "entityColor";
	
	// 获取选中颜色
	switch (colorId) {
		case pre + "1":
			color = vis.ColorConfigTool.Color1;
			break;
		case pre + "2":
			color = vis.ColorConfigTool.Color2;
			break;
		case pre + "3":
			color = vis.ColorConfigTool.Color3;
			break;
		case pre + "4":
			color = vis.ColorConfigTool.Color4;
			break;
		default:
			color = vis.ColorConfigTool.Color0;
			break;
	}
	
	return color;
};

/**
 * 获取选中的图标大小
 * 
 * @return {String} 选中尺寸
 */
function getSelectedScale() {
	if (!vis) {
		return;
	}
	
	var scale = null; // 选中尺寸
	var scaleId = $("#scaleDiv").find(".select").attr("id"); // 选中的尺寸对象
	var pre = "entityScale";
	
	// 获取选中尺寸
	if (scaleId === pre + "1") {
		scale = vis.Consts.scale1;
	} else {
		scale = vis.Consts.scale0;
	}
	
	return scale;
};

/**
 * 编辑实体数据
 * 
 * @param id {String} 实体id
 * @param properties {Array} 属性集合
 */
function editEntityData(id, properties) {
	if (!id || !properties || !visTool) {
		return;
	}
	
	// 开始记录操作
	visTool.diagram.undoManager.isEnabled = true;
	visTool.diagram.startTransaction("editEntityData");
	
	var model = visTool.diagram.currentModel;
	
	var nodeData = model.findNodeDataForKey(id);
	if (nodeData) {
		for (var i = 0; i < properties.length; i++) {
			var property = properties[i];
			
			// 编辑对应的属性
			model.setDataProperty(nodeData, property.key, property.value);
		}
	}
	
	// 结束记录操作
	visTool.diagram.commitTransaction("editEntityData");
	visTool.diagram.undoManager.isEnabled = false;
};

// 嫌疑信息添加
function linkDetail_showDataTable() {
	var dataString = $("#cdr_visualization_linkDetail_judgeLinkDataValue").val();
	dataArray = dataString.split(";");
	for ( var key in dataArray) {
		items = key.split("=");
		if (items[0] === "startDate") {
			$("#cdr_visualization_startDate").val(items[1]);
		}
		if (items[0] === "endDate") {
			$("#cdr_visualization_endDate").val(items[1]);
		}
	}
	$("#cdr_visualization_linkDetail_meetAnalysis").val($("#link_meet_timeCondition").val());
	$("#cdr_generalSearch_getLineDetail_form").submit();
}

var $cdr_visualization_linkDetail_dataTable = null;// 单表检索结果表格
/**
 * 跳转至详情页面_datatable展示
 */
function linkDetail_showDataTable123() {
	// debugger;
	// var caseId = $("#cdr_seriesJudge_init_caseId").val();
	// var taskId = $("#cdr_seriesJudge_init_taskId").val();
	// var linkData = $("#cdr_visualization_linkDetail_judgeLinkDataValue").val();
	// var dataArray = linkData.filterCondition;
	
	var dataString = $("#cdr_visualization_linkDetail_judgeLinkDataValue").val();
	dataArray = dataString.split(";");
	var startDate;
	var endDate;
	// 填充列表
	for ( var key in dataArray) {
		items = key.split("=");
		if (items[0] === "startDate") {
			startDate = items[1];
		}
		if (items[0] === "endDate") {
			endDate = items[1];
		}
	}
	
	$("#cdr_visualization_linkDetail_dataTableDiv")
			.html(
					'<h3 class="padding10 f16 bb bg white"><span class="white">链接详情</span><a class="iconfont icon-cuowu3 fr white" onclick="toHideOther(\'showLinkDetail\')"></a></h3><div class="padding10 empty-con datatable_wrapper" style="width:500px;"><table class="w100 border layui-table" id="cdr_visualization_linkDetail_dataTable" style=" height:100%;">'
							+ '<thead id="cdr_visualization_linkDetail_dataTable_thead"></thead></table></div>');
	var fieldArray = new Array();
	$("#cdr_search_cdrSearch_searchResult_div").show();// 显示查询结果层
	var displayFieldStr = $("#cdr_visualization_linkDetail_displayFieldList").val();
	var displayFieldList = JSON.parse(displayFieldStr);
	$("#cdr_visualization_linkDetail_dataTable_thead").empty();
	// $("#cdr_visualization_linkDetail_dataTable_thead").append("<th>序号</th>");
	fieldArray.push({
		"data" : null,
		"title" : "序号",
		"orderable" : false
	});
	var displayFieldsInfo = "solrkey;";
	$.each(displayFieldList, function(index) {
		var displayField = displayFieldList[index];
		if (displayField.isDefaultDisplay) {
			displayFieldsInfo += displayField.solrField + ";";
			fieldArray.push({
				"data" : displayField.solrField,
				"title" : displayField.fieldDesc,
				"name" : displayField.solrField,
				"defaultContent" : '',
				"orderable" : true,
			})
		}
	})
	// params["displayFieldsInfo"] = displayFieldsInfo;
	fieldArray.push({
		"data" : null,
		"title" : "详情",
		"orderable" : false,
		"render" : function(data, type, row, meta) {
			return '<a class="link iconfont icon-jiansuo" title="详情" onclick="cdr_search_cdrSearch_showDetailFun(\'' + row.solrkey + '\')">详情</a>';
		}
	})
	if ($cdr_visualization_linkDetail_dataTable != null) {
		$cdr_visualization_linkDetail_dataTable = null;
	}
	$cdr_visualization_linkDetail_dataTable = myDataTable("cdr_visualization_linkDetail_dataTable", {
		ajax : {
			url : basePath + "/cdr/generalSearch/getLineDetail.action",
			data : function(d) {
				d.displayFieldsInfo = displayFieldsInfo;
				d["caseId"] = $("#cdr_seriesJudge_init_caseId").val();
				d["taskId"] = $("#cdr_seriesJudge_init_taskId").val();
				d["userPhone"] = $("#cdr_visualization_linkDetail_judgeLinkFormNodeId").val();
				d["otherPhone"] = $("#cdr_visualization_linkDetail_judgeLinkToNodeId").val();
				d["startDate"] = startDate;
				d["endDate"] = endDate;
			}
		},
		scrollX : true,
		ordering : true,
		order : [],
		scrollXInner : true,
		select : {// 用于修改单元格的值
			style : 'os',
			selector : 'td:first-child'
		},
		columns : fieldArray,
	});
	
	toShowOther('showLinkDetail');
};

/**
 * 初始化datatables展示列字段
 */
function cdr_visualization_linkDetail_initDataTableField() {
	// var core = $("#cdr_search_cdrSearch_coreName").val();
	myAjax({
		url : basePath + "/cdr/generalSearch/intiDataTableFields.action",
		data : {
			"cores" : ""
		},
		// async : true,
		success : function(json) {
			var fields = json.searchFieldList;
			var array = new Array();
			$.each(fields, function(i) {
				array.push({
					"fieldName" : fields[i].fieldName,
					"fieldDesc" : fields[i].fieldDesc,
					"isDefaultDisplay" : fields[i].isDefaultDisplay,
					"solrField" : fields[i].solrField,
				})
			})
			console.info(JSON.stringify(array));
			$("#cdr_visualization_linkDetail_displayFieldList").val(JSON.stringify(array));
		}
	});
}

/**
 * 展示链接单个通联联系详情
 * 
 * @param solrkey 数据的solrKey
 */
function cdr_search_cdrSearch_showDetailFun(solrkey) {
	var paramNames = "solrkey";
	var paramValues = solrkey;
	var url = basePath + "/cdr/generalSearch/showDetail.action";
	openPostWindow(url, paramNames, paramValues, new Date().getTime());
}

var JudgeLinkDataValue;
/**
 * 打开链接研判层
 * 
 * @param data {Object} 链接数据
 */
function openJudgeLinkDataLayer(linkData) {
	var linkDataId = linkData.id;
	var JudgeLinkDataValue = linkData;
	$("#cdr_visualization_linkDetail_judgeLinkDataValue").val(linkData.filterCondition);
	$("#cdr_visualization_linkDetail_judgeLinkFormNodeId").val(linkData.fromEntityId);
	$("#cdr_visualization_linkDetail_judgeLinkToNodeId").val(linkData.toEntityId);
	// 关闭其他面板
	toShowOther("js-icon-xqyp");
	toHideOther("js-icon-shiti");
	// handleClass('.js-icon-xqyp', ' icon-active')
	$('.js-icon-xqyp').addClass('icon-active').siblings().removeClass('icon-active');
	
	toHideOther("right-many-function");
	toHideOther("sjyp-box");
	// 打开链接研判面板
	toShowOther("ljyp-box");
	// debugger;
	
	// 设置链接对象id
	$("#ljyp_linkId").val(linkData.id);
	// 获取链接数据对应的基本信息 TODO
	var basicLinkDataArray = linkData.linkBasicInfo;
	// basicLinkDataArray.push(JSON.stringify(basicLinkData));
	
	// var basicLinkDataArray = [ {
	// key : "姓名",
	// value : "张明"
	// }, {
	// key : "身份证号",
	// value : "130411123456987"
	// }];
	// 设置基本链接信息列表
	setBasicLinkDataList(basicLinkDataArray);
	
	// 设置链接批注文本
	setLinkComment(linkData);
	
	// cdr_visualization_linkDetail_initDataTableField();
};

/**
 * 设置基本链接信息列表
 * 
 * @param dataArray {Array} 基本链接信息集合
 */
function setBasicLinkDataList(dataArray) {
	if (!dataArray) {
		return;
	}
	
	var $ul = $("#basicLinkDataList"); // 获取基本信息列表对象
	
	// 判断页面对象是否存在
	if ($ul.length === 0) {
		return;
	}
	
	// 清空基本信息列表
	$ul.empty();
	
	// var $i = $("<i class='in-b al-r fl' style='min-width:120px;'></i>").html("电话号码A：");
	// var $span = $("<div style='margin-left:120px;'></div>").html($("#cdr_visualization_linkDetail_judgeLinkFormNodeId").val());
	// var $li = $("<li></li>").append($i).append($span);
	// $ul.append($li);
	// var $i = $("<i class='in-b al-r fl' style='min-width:120px;'></i>").html("电话号码B：");
	// var $span = $("<div style='margin-left:120px;'></div>").html($("#cdr_visualization_linkDetail_judgeLinkToNodeId").val());
	// var $li = $("<li></li>").append($i).append($span);
	// $ul.append($li);
	// 填充列表
	for ( var key in dataArray) {
		var key1 = key;
		key = key.substring(2, key.length);
		if (key == "碰面时间" || key == "碰面位置") {
			var $i = $("<i class='in-b al-r' style='min-width:120px;'></i>").html(key + "：");
			var $span = $("<div class='al-c other-pesj-pmwz' style='max-height:318px;overflow-y:auto;'></div>").html(dataArray[key1]);
			var $li = $("<li></li>").append($i).append($span);
			// 向页面对象中添加基本信息
			
		} else if (key == "碰面详情条件") {
			var $li = $('<input type="hidden" id="link_meet_timeCondition" value="' + dataArray[key1] + '"/>');
		} else {
			var $i = $("<i class='in-b al-r fl' style='min-width:120px;'></i>").html(key + "：");
			var $span = $("<div style='margin-left:120px;'></div>").html(dataArray[key1]);
			var $li = $("<li></li>").append($i).append($span);
			// 向页面对象中添加基本信息
		}
		$ul.append($li);
	}
};

/**
 * 设置链接批注文本
 * 
 * @param data {object} 链接
 */
function setLinkComment(linkData) {
	
	if (linkData.commentTitle) {
		// 设置批注标题
		$("#link_commentTitle").val(linkData.commentTitle);
	} else {
		$("#link_commentTitle").val("");
	}
	
	if (linkData.commentValue) {
		// 设置批注内容
		$("#link_commentValue").val(linkData.commentValue);
	} else {
		$("#link_commentValue").val("");
	}
	
};

/**
 * 研判链接数据
 */
function judgeLinkData() {
	var id = $("#ljyp_linkId").val(); // 获取链接id
	var properties = []; // 要修改的属性集合
	properties.push({
		key : "commentTitle",
		value : $("#link_commentTitle").val()
	});
	properties.push({
		key : "commentValue",
		value : $("#link_commentValue").val()
	});
	
	// 编辑链接数据
	editLinkData(id, properties);
	
	// 隐藏链接研判面板
	toHideOther('ljyp-box');
	
	toHideOther("js-icon-xqyp");
};

/**
 * 编辑链接数据
 * 
 * @param id {String} 链接id
 * @param properties {Array} 属性集合
 */
function editLinkData(id, properties) {
	if (!id || !properties || !visTool) {
		return;
	}
	
	// 开始记录操作
	visTool.diagram.undoManager.isEnabled = true;
	visTool.diagram.startTransaction("editLinkData");
	
	var model = visTool.diagram.currentModel;
	
	var linkData = model.findLinkDataForKey(id);
	if (linkData) {
		for (var i = 0; i < properties.length; i++) {
			var property = properties[i];
			
			// 编辑对应的属性
			model.setDataProperty(linkData, property.key, property.value);
		}
	}
	
	// 结束记录操作
	visTool.diagram.commitTransaction("editLinkData");
	visTool.diagram.undoManager.isEnabled = false;
};