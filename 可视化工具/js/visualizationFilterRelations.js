$(function () {
    $(".r-nav-1").bind("click", function () {
        // 二次筛选层可见时，执行初始化操作
        if ($('.ecsx-box').css("display") !== "none") {
            // 初始化二次筛选层
            initializeFilterRelationsLayer();
        }
    });

    $("#selectAll").click(function () {
        var checked = $(this).prop("checked");

        // 全选或全不选复选框
        $("#linkTypeList").find("input[type='checkbox']").prop("checked", checked);
    });
})

/**
* 初始化二次筛选层
*/
function initializeFilterRelationsLayer() {
    if (!visTool) return;

    // 关闭其他面板
    //toHideOther("fxtj-box");
    //toHideOther("sjyp-box");
    //toHideOther("yjtz-box");

    // 打开二次筛选面板
    //toShowOther('ecsx-box');

    // 获取链接类型集合
    var linkTypes = getLinkTypes();

    // 设置分析模型列表
    setLinkTypeList(linkTypes);

    // 设置挖掘层数初始值
    //$("#layerCount").val("");
};

/**
* 设置链接类型列表
*
* @param linkTypes {go.Iterator} 链接类型集合
*/
function setLinkTypeList(linkTypes) {
    if (!linkTypes) return;

    var $div = $("#linkTypeList"); // 获取实体类型列表

    // 清空列表
    //$div.empty();

    // 加载列表元素
    linkTypes.each(function (type) {
        // 实体类型没有对应的实体数据时，跳过
        if (type.itemCount === 0) return;

        // 实体类型已存在，则不再重新加载，保留上次操作，跳过
        if ($("#" + type.id).length > 0) return;

        // 创建p标签
        var $p = $("<p class='mt'></p>");

        // 拼接html内容
        var htmlText = "<label style='cursor: pointer;'><input type='checkbox' class='mr5' checked id='" + type.id + "' />" + type.name + "</label>";
        if (type.canFilter) {
            htmlText += "<label>- 频次区间</label>"
                + "<input type='text' class='br3 ml mr' style='width: 50px;' id='" + type.id + "Min" + "' />"
                + "到"
                + "<input type='text' class='br3 ml mr' style='width: 50px;' id='" + type.id + "Max" + "' />";
        }

        // 加载html内容
        $p.html(htmlText);

        // 添加模型标签选项
        $div.append($p);
    });
};

/**
* 筛选实体关系
*/
function filterRelationsLayer_filterRelations() {
    // 获取被选中的模型复选框
    var $checkboxes = $("#linkTypeList").find("input[type='checkbox']:checked");
    if ($checkboxes.length === 0) {
        myMsg("请至少选择一个模型", 99);
        return;
    }

    // 获取挖掘层数
    var layerCount = $("#layerCount").val();
    if (!layerCount) {
        myMsg("请选择挖掘层数", 99);
        return;
    }

    var models = new go.Map(); // 创建模型集合
    var regex = /^[1-9]*$/; // 设置判断正整数的正则表达式

    // 获取模型集合
    for (var i = 0; i < $checkboxes.length; i++) {
        var checkbox = $checkboxes[i]; // 模型复选框
        var id = checkbox.id;
        var $minText = $("#" + id + "Min"); // 模型的区间起始值
        var $maxText = $("#" + id + "Max"); // 模型的区间结束值
        var model = {};

        model.id = id; // 设置模型id

        // 设置模型的区间值
        if ($minText.length > 0 && $maxText.length > 0) {
            var min = $minText.val().trim();
            var max = $maxText.val().trim();

            // 起始值非正整数时，弹出警告
            if (min.length > 0 && !regex.test(min)) {
                myMsg("区间值只能为正整数", 2);
                $minText.focus();
                return;
            }

            // 结束值非正整数时，弹出警告
            if (max.length > 0 && !regex.test(max)) {
                myMsg("区间值只能为正整数", 2);
                $maxText.focus();
                return;
            }

            model.min = parseInt(min); // 设置模型区间起始值
            model.max = parseInt(max); // 设置模型区间结束值

            // 起始值大于结束值时，弹出警告
            if (model.min > model.max) {
                myMsg("区间结束值不能小于区间起始值", 2);
                $$minText.focus();
                return;
            }
        }

        models.add(model.id, model);
    }

    // 筛选实体关系
    filterRelationsByLinkType(models, parseInt(layerCount));

    // 隐藏点研判面板
    toHideOther('ecsx-box');
};

/**
 * 筛选实体关系
 * 
 * @param linkTypes {go.Map} 链接类型集合
 * @param layerCount {Number} 挖据层数
 */
function filterRelationsByLinkType(linkTypes, layerCount) {
    if (!linkTypes || !layerCount || !visTool) return;

    var wholeModel = visTool.diagram.wholeModel;
    var virtualizedModel = visTool.diagram.virtualizedModel;
    var wholeNodeDatas = new go.Set();
    var wholeLinkDatas = new go.Set();

    // 开始记录操作
    //visTool.diagram.undoManager.isEnabled = true;
    //visTool.diagram.startTransaction("filterRelationsByLinkType");

    // 所有数据设为可见
    virtualizedModel.each(function (data) {
        virtualizedModel.setDataProperty(data, "isVisible", true);
    });

    // 获取主要实体集合
    var mainNodeDatas = wholeModel.filterNode(function (data) {
        if (data.isNode && data.isMain) {
            return true;
        }

        return false;
    });

    // 为主要实体筛选实体关系
    mainNodeDatas.each(function (data) {
        var nodeDatas = new go.Set();
        var linkDatas = new go.Set();

        // 为每个主要实体筛选实体关系
        filterRelationsForNodeData(data, linkTypes, nodeDatas, linkDatas, layerCount);

        // 向实体数据集合中添加实体数据
        wholeNodeDatas.addAll(nodeDatas);
        // 向链接数据集合中添加链接数据
        wholeLinkDatas.addAll(linkDatas);
    });

    // 清空视图数据
    visTool.diagram.clear();
    virtualizedModel.clear();
    //visTool.diagram.removeParts(visTool.diagram.nodes);
    //visTool.diagram.removeParts(visTool.diagram.links);
    //var nodeDataList = virtualizedModel.filterNode(function (data) { return true });
    //var linkDataList = virtualizedModel.filterLink(function (data) { return true });
    //virtualizedModel.removeNodeDataCollection(nodeDataList);
    //virtualizedModel.removeLinkDataCollection(linkDataList);

    // 节点数据对象虚拟化
    wholeNodeDatas.each(function (data) {
        virtualizedModel.setDataProperty(data, "isVirtual", true);
    });

    // 链接数据对象虚拟化
    wholeLinkDatas.each(function (data) {
        virtualizedModel.setDataProperty(data, "isVirtual", true);
    });

    // 重新加载数据
    virtualizedModel.addNodeDataCollection(wholeNodeDatas.toArray());
    virtualizedModel.addLinkDataCollection(wholeLinkDatas.toArray());

    // 更新视图内容
    visTool.updateDiagramParts();

    // 初始化布局
    // visTool.diagram.layoutDiagram(true);

    // 结束记录操作
    //visTool.diagram.commitTransaction("filterRelationsByLinkType");
    //visTool.diagram.undoManager.isEnabled = false;
};

/**
 * 为单个实体筛选实体关系
 * 
 * @param nodeData {Object} 链接类型集合
 * @param linkTypes {go.Map} 链接类型集合
 * @param nodeDatas {go.Set} 实体数据集合
 * @param linkDatas {go.Set} 链接数据集合
 * @param count {Number} 挖据层数
 */
function filterRelationsForNodeData(nodeData, linkTypes, nodeDatas, linkDatas, count) {
    if (!nodeData || !linkTypes || !nodeDatas || !linkDatas || !count || !visTool) return;

    var model = visTool.diagram.wholeModel;
    var tempNodeDatas = new go.Set();
    var tempLinkDatas = new go.Set();

    // 获取实体的关联链接数据集合
    var linksConnected = model.findLinksConnected(nodeData);

    // 筛选实体关系
    linksConnected.each(function (data) {
        var isPass = true;

        if (!linkDatas.contains(data) && linkTypes.contains(data.typeId)) {
            var filterValue = data.filterValue;
            var linkType = linkTypes.getValue(data.typeId);

            // 若有过滤值，且页面上设置了区间值，则过滤值必须在区间内
            if (filterValue
                && ((linkType.min && linkType.min > filterValue)
                || (linkType.max && linkType.max < filterValue))) {
                isPass = false;
            }
        }
        else {
            isPass = false;
        }

        if (isPass) {
            // 添加链接数据
            tempLinkDatas.add(data);

            // 获取链接另一端的实体数据
            var otherNodeData = model.getOtherNode(data, nodeData);
            // 添加实体数据
            if (!nodeDatas.contains(otherNodeData)) {
                tempNodeDatas.add(otherNodeData);
            }
        }
    });

    nodeDatas.addAll(tempNodeDatas);
    linkDatas.addAll(tempLinkDatas);

    // 剩余层数不为0，且实体数据集合不为空时，执行下一层的筛选
    if (count - 1 > 0 && tempNodeDatas.count > 0) {
        tempNodeDatas.each(function (data) {
            // 为本层的实体筛选实体关系
            filterRelationsForNodeData(data, linkTypes, nodeDatas, linkDatas, count - 1);
        });
    }
};

/**
* 重置筛选条件
*/
function filterRelationsLayer_resetConditions() {
    if (!visTool) return;

    // 初始化全选复选框
    $("#selectAll").prop("checked", true);

    // 默认选中所有的复选框
    $("#linkTypeList").find("input[type='checkbox']").prop("checked", true);

    // 默认所有的文本框为空
    $("#linkTypeList").find("input[type='text']").val("");

    // 默认挖掘层数为空
    $("#layerCount").val("");
};