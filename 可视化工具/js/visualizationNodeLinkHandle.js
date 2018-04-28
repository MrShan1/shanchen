/**
 * 删除选中节点链接数据
 */
function deleteSelectNodesLinks() {
	if (!visTool) {
		return;
	}
	
	// var model = visTool.diagram.model;
	var model = visTool.diagram.currentModel;
	var selectNodes = new go.Set();
	var selectLinks = new go.Set();
	
	// 添加选中节点数据于节点集合中
	model.eachNode(function(data) {
		if (data.isVisible && data.isSelected && data.isNode) {
			selectNodes.add(data);
			// 添加与该节点相关的链接数据于链接集合中
			var links = model.findLinksConnected(data);
			links.each(function(link) {
				selectLinks.add(link);
			});
			
		}
	});
	
	// 添加相关的链接数据于链接集合中
	model.eachLink(function(data) {
		if (data.isVisible && data.isSelected) {
			selectLinks.add(data);
		}
	});
	
	if (selectNodes.count == 0 && selectLinks.count == 0) {
		vis.MessageTool.ShowWarningMessage("请至少选择一个节点或链接删除");
	}
	
	// visTool.diagram.undoManager.isEnabled = true;
	// visTool.diagram.startTransaction("deleteSelectNodesLinks");
	
	// 移除节点数据集合
	model.removeNodeDataCollection(selectNodes);
	// 移除链接数据集合
	model.removeLinkDataCollection(selectLinks);
	
	cdr_seriesJudge_init_showThink("删除选中部分");
	// visTool.diagram.commitTransaction("deleteSelectNodesLinks");
	// visTool.diagram.undoManager.isEnabled = false;
}

/**
 * 删除右键选中节点数据
 */
function deleteSelectNode(selectNode) {
	if (!visTool) {
		return;
	}
	var model = visTool.diagram.currentModel;
	var selectNodes = new go.Set();
	var selectLinks = new go.Set();
	
	// 添加选中节点数据于节点集合中
	model.eachNode(function(data) {
		if (data.isVisible && data.isSelected && data.isNode) {
			if (data.id === selectNode.id) {
				selectNodes.add(data);
				// 添加与该节点相关的链接数据于链接集合中
				var links = model.findLinksConnected(data);
				links.each(function(link) {
					selectLinks.add(link);
				});
				
			}
		}
	});
	
	// visTool.diagram.undoManager.isEnabled = true;
	// visTool.diagram.startTransaction("deleteSelectNode");
	
	// 移除节点数据集合
	model.removeNodeDataCollection(selectNodes);
	// 移除链接数据集合
	model.removeLinkDataCollection(selectLinks);
	
	cdr_seriesJudge_init_showThink("删除点");
	// visTool.diagram.commitTransaction("deleteSelectNode");
	// visTool.diagram.undoManager.isEnabled = false;
}

/**
 * 删除右键选中链接数据
 */
function deleteSelectLink(selectLink) {
	if (!visTool) {
		return;
	}
	var model = visTool.diagram.currentModel;
	var selectLinks = new go.Set();
	
	selectLinks.add(selectLink);
	
	// visTool.diagram.undoManager.isEnabled = true;
	// visTool.diagram.startTransaction("deleteSelectLink");
	// 移除链接数据集合
	model.removeLinkDataCollection(selectLinks);
	
	cdr_seriesJudge_init_showThink("删除线");
	// visTool.diagram.commitTransaction("deleteSelectLink");
	// visTool.diagram.undoManager.isEnabled = false;
}

/**
 * 添加实体点击事件
 */
function addNodesClick() {
	if (!visTool) {
		return;
	}
	$("#factorDataId").val("");
	toShowOther('node-input');
	var model = visTool.diagram.currentModel;
	var entityTypes = visTool.entityTypes;
	var length = entityTypes.count;
	var j = 0;
	var firstTemp;
	//debugger;
	if (length > 0) {
		$("#entityTypeId").empty();
		// $("#entityTypeId").append("<option value=''></option>");
		var iterator = entityTypes.iterator;
		while (iterator.next()) {
			j++;
			var item = iterator.value;
			firstTemp = iterator.value;
			$("#entityTypeId").append("<option value='" + item.id + "'>" + item.name + "</option>");
			if (j == 1) {
				// 动态添加第一个实体子类 要素类型下拉数据菜单
				var propertyValues = firstTemp.propertyValues;
				if (propertyValues != undefined && propertyValues.length > 0) {
					$("#factorTypeId").empty();
					$("#factorTypeId").append("<option value=''></option>");
					for (var i = 0; i < propertyValues.length; i++) {
						var propertyValue = propertyValues[i];
						$("#factorTypeId").append("<option value='" + propertyValue.id + "'>" + propertyValue.value + "</option>");
					}
				}
			}
		}
	}
}

/**
 * 设置实体子类 要素类型
 */
function setTypeOptions(obj) {
	var entityTypes = visTool.entityTypes;
	var length = entityTypes.count;
	if (length > 0) {
		var iterator = entityTypes.iterator;
		while (iterator.next()) {
			var item = iterator.value;
			if (item.id == obj.value) {
				var propertyValues = item.propertyValues;
				// 动态添加实体子类 要素类型下拉数据菜单
				if (propertyValues != undefined && propertyValues.length > 0) {
					// 清空原有的文本框中的值
					$("#factorTypeId").empty();
					$("#factorTypeId").append("<option value=''></option>");
					for (var i = 0; i < propertyValues.length; i++) {
						var propertyValue = propertyValues[i];
						$("#factorTypeId").append("<option value='" + propertyValue.id + "'>" + propertyValue.value + "</option>");
					}
				}
			}
		}
	}
}

/**
 * 提交实体
 */
function cdr_node_input_add_ok() {
	var model = visTool.diagram.currentModel;
	// 获取添加节点数据
	var nodeDatas = getNodeDatas();
	// 过滤实体数据
	// var entities = visTool.filterEntities(nodeDatas, model);
	
	// visTool.diagram.undoManager.isEnabled = true;
	// visTool.diagram.startTransaction("addNodes");
	// 向视图中添加新增节点数据
	// visTool.diagram.currentModel.addNodeDataCollection(entities);
	
	visTool.loadData({
		"entities" : nodeDatas
	}, true, false, false);
	
	cdr_seriesJudge_init_showThink("添加点");
	// visTool.diagram.commitTransaction("addNodes");
	// visTool.diagram.undoManager.isEnabled = false;
	
	toHideOther('node-input');
}

/**
 * 获取添加节点数据
 * 
 */
function getNodeDatas() {
	var nodeDatasList = [];
	var entityTypeValue = $("#entityTypeId").val();
	var factorTypeValue = $("#factorTypeId").val();
	var factorDatas = $("#factorDataId").val();
	
	// 封装nodesData数据
	var factorDatasArray = factorDatas.split(',');
	for (var i = 0; i < factorDatasArray.length; i++) {
		var nodeData = "{\"id\":\"" + factorDatasArray[i] + "\",\"typeId\":\"" + entityTypeValue + "\",\"factorId\":\"" + factorTypeValue
				+ "\",\"propertyValues\":[{\"id\":\"" + entityTypeValue + "\",\"value\":\"" + factorDatasArray[i] + "\"}]}";
		
		nodeDatasList.push(JSON.parse(nodeData));
	}
	return nodeDatasList;
};

function cdr_node_input_add_cancel() {
	toHideOther('node-input');
}

var firstNode;
var secondNode;
/**
 * 添加链接点击事件
 */
function addLinkClick() {
	if (!visTool) {
		return;
	}
	// var model = visTool.diagram.model;
	var model = visTool.diagram.currentModel;
	// 判断选中是否为两个节点
	var i = 0;
	var j = 0;
	var selectNodes = new go.Set();
	model.eachNode(function(data) {
		if (data.isVisible && data.isSelected && data.isNode) {
			i++;
			selectNodes.add(data);
		}
	});
	if (i != 2) {
		vis.MessageTool.ShowWarningMessage("请选择两个节点");
		return;
	} else {
		var iterator = selectNodes.iterator;
		while (iterator.next()) {
			j++;
			var item = iterator.value;
			if (j == 1) {
				firstNode = iterator.value;
			}
			if (j == 2) {
				secondNode = iterator.value;
			}
			// if (!iterator.hasNext()) {
			// var secondNode = iterator.value;
			// }
		}
		// 选择适合两节点的链接
		var linkTypesArray = new go.Set();
		var linkTypes = visTool.linkTypes;
		var length = linkTypes.count;
		var iterator = linkTypes.iterator;
		// 循环判断适合两节点的链接类型
		while (iterator.next()) {
			j++;
			var item = iterator.value;
			// if (item.fromEntityTypeId === firstNode.typeId && item.toEntityTypeId === secondNode.typeId) {
			linkTypesArray.add(item);
			// }
			// if (item.fromEntityTypeId === secondNode.typeId && item.toEntityTypeId === firstNode.typeId) {
			// linkTypesArray.add(item);
			// }
		}
		
		// 动态添加下拉数据
		var length = linkTypesArray.count;
		if (length > 0) {
			$("#linkDataId").val("");
			toShowOther('link-input');
			// 动态添加链接类型下拉菜单
			$("#linkTypeId").empty();
			// $("#linkTypeId").append("<option value=''></option>");
			var iterator = linkTypesArray.iterator;
			while (iterator.next()) {
				var item = iterator.value;
				if (item.name === "自定义") {
					$("#linkTypeId").append("<option value='" + item.id + "'>" + item.name + "</option>");
				}
			}
		} else {
			vis.MessageTool.ShowWarningMessage("没有与选中点对应的链接类型");
		}
	}
}
/**
 * 提交链接
 */
function cdr_link_input_add_ok() {
	// if ($("#linkTypeId").val() == "") {
	// vis.MessageTool.ShowWarningMessage("请选择链接类型");
	// return;
	// }
	if ($("#linkDataId").val() == "") {
		vis.MessageTool.ShowWarningMessage("请输入链接值");
		return;
	}
	var model = visTool.diagram.currentModel;
	// 获取添加链接数据
	var linkData = getLinkData();
	// visTool.diagram.undoManager.isEnabled = true;
	// visTool.diagram.startTransaction("addLink");
	visTool.loadData({
		"links" : linkData
	}, true, false, false);
	
	cdr_seriesJudge_init_showThink("添加线");
	// visTool.diagram.commitTransaction("addLink");
	// visTool.diagram.undoManager.isEnabled = false;
	toHideOther('link-input');
}
/**
 * 获取添加链接数据
 * 
 */
function getLinkData() {
	var linkDataList = [];
	var linkTypeValue = $("#linkTypeId").val();
	var linkValue = $("#linkDataId").val();
	// 封装linkData数据
	var linkData = "{\"id\":\"" + linkValue + "\",\"typeId\":\"" + linkTypeValue + "\",\"isTwoWay\":true,\"fromEntityId\":\"" + firstNode.id
			+ "\",\"toEntityId\":\"" + secondNode.id + "\",\"propertyValues\":[{\"id\":\"" + linkTypeValue + "\",\"value\":\"" + linkValue + "\"}]}";
	
	linkDataList.push(JSON.parse(linkData));
	return linkDataList;
};

function cdr_link_input_add_cancel() {
	
	toHideOther('link-input');
}

/**
 * 表格展示
 */
var $visualizationDataTable;
function visualization_showDataTable() {
	if (!visTool) {
		return;
	}
	var model = visTool.diagram.currentModel;
	// 获取datatable封装数据
	var data = visualizationDataTableList(model);
	if (data.length == 0) {
		return;
	}
	toShowOther('showDataTable');
	if ($visualizationDataTable != null) {
		$visualizationDataTable.fnDestroy();
	}
	$visualizationDataTable = intitialDataTable("cdr_visualization_showDataTable_content", data);
	
};

/**
 * 表格展示数据统计
 */
function visualizationDataTableList(model) {
	var visualizationDataList = [];
	var j = 0;
	model.eachLink(function(link) {
		var fromNode = model.findNodeDataForKey(link.fromEntityId);
		var toNode = model.findNodeDataForKey(link.toEntityId);
		
		var visualizationData = []; // 节点数据类型集合
		j++;
		visualizationData.push(j);
		// 添加链接值
		var linkPropertyValues = link.propertyValues;
		var linkPropertyValue = linkPropertyValues[0].value;
		visualizationData.push(linkPropertyValue);
		
		// 添加实体A值
		var fromNodePropertyValues = fromNode.propertyValues;
		var fromNodePropertyValue = fromNodePropertyValues[0].value;
		visualizationData.push(fromNodePropertyValue);
		
		// 添加实体B值
		var toNodePropertyValues = toNode.propertyValues;
		var toNodePropertyValue = toNodePropertyValues[0].value;
		visualizationData.push(toNodePropertyValue);
		
		visualizationDataList.push(visualizationData);
	});
	return visualizationDataList;
}

/**
 * 跳转gis
 */
function turnToGis() {
	if (!visTool) {
		return;
	}
	var model = visTool.diagram.currentModel;
	var nodesValue = "";
	var selectNodes = new go.Set();
	// 添加选中节点数据于节点集合中
	model.eachNode(function(data) {
		if (data.isVisible && data.isSelected && data.isNode) {
			selectNodes.add(data);
		}
	});
	if (selectNodes.count > 0) {
		var iterator = selectNodes.iterator;
		while (iterator.next()) {
			var item = iterator.value;
			var nodePropertyValues = item.propertyValues;
			nodesValue = nodesValue + nodePropertyValues[0].value + ",";
		}
	} else {// 若未选中节点 则获取全部显示节点于集合中
		selectNodes = new go.Set();
		model.eachNode(function(data) {
			if (data.isVisible && data.isNode) {
				selectNodes.add(data);
			}
		});
		var iterator = selectNodes.iterator;
		while (iterator.next()) {
			var item = iterator.value;
			var nodePropertyValues = item.propertyValues;
			nodesValue = nodesValue + nodePropertyValues[0].value + ",";
		}
	}
	nodesValue = nodesValue.substring(0, nodesValue.length - 1);
	$("#cdr_baidugis_turnToGis_nodesValue").val(nodesValue);
	$("#cdr_baidugis_turnToGis_form").submit();
};
