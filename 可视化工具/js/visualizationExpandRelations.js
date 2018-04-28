/**
* 打开点拓展层
*
* @param dataArray {Array} 选中的实体数据集合
* @param startDate {String} 开始日期
* @param endDate {String} 结束日期
*/
function openExpandRelationsLayer(dataArray, startDate, endDate) {
    if (!dataArray) return;

    // 关闭其他面板
    toHideOther("ecsx-box");
    toHideOther("fxtj-box");
    toHideOther("sjyp-box");

    // 打开点拓展面板
    toShowOther('yjtz-box');

    // 设置选中对象列表
    setEntityIdList(dataArray);

    // 设置初设时间区间
    setDateRange(startDate, endDate);

    // 设置战法模型树
    setExpandModelZTree();
};

/**
* 设置选中对象列表
*
* @param dataArray {Array} 基本信息集合
*/
function setEntityIdList(dataArray) {
    if (!dataArray) return;

    var idArray = []; // 实体id集合

    // 获取实体id集合
    dataArray.forEach(function (data) {
        idArray.push(data.id);
    });

    // 将实体id集合转化为字符串，并以逗号隔开
    var idString = idArray.join(",");

    // 设置实体id列表的文本内容
    $("#entityIdList").text(idString);
};

/**
* 设置日期范围
*
* @param startDate {String} 开始日期
* @param endDate {String} 结束日期
*/
function setDateRange(startDate, endDate) {
    if (!startDate || !endDate) return;

    // 设置开始日期
    $("#startDate").val(startDate);
    $("#startDate").html(startDate);

    // 设置结束日期
    $("#endDate").val(endDate);
    $("#endDate").html(endDate);
};

/**
* 设置战法模型树
*/
function setExpandModelZTree() {
    //获取战法模型数据 TODO
    var models = [];

    // 加载战法模型树
    myZTreeSelect("expand_modelZTree", {
        check: {
            enable: true
        }
    }, models);
};

/**
* 拓展实体关系
*/
function expandRelations() {
    var ids = $("#entityIdList").text(); // 获取实体id字符串
    var startDate = $("#startDate").val(); // 获取开始日期
    var endDate = $("#endDate").val(); // 获取结束日期
    var modelIds = $("#expand_modelZTree_selectedIds").val(); // 获取战法模型id字符串

    // 调用外部方法TODO
};