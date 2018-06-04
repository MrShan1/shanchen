/// <reference path="jquery-3.3.1.js" />
/// <reference path="datatables.js" />

$(function () {
    var testData = [
        { id: "1", link: "A1_B1", entityA: "A1", entityB: "B1" },
        { id: "2", link: "A2_B2", entityA: "A2", entityB: "B2" },
        { id: "3", link: "A3_B3", entityA: "A3", entityB: "B3" },
        { id: "4", link: "A4_B4", entityA: "A4", entityB: "B4" },
        { id: "5", link: "A5_B5", entityA: "A5", entityB: "B5" },
        { id: "6", link: "C1_D1", entityA: "C1", entityB: "D1" },
        { id: "7", link: "C2_D2", entityA: "C2", entityB: "D2" },
        { id: "8", link: "C3_D3", entityA: "C3", entityB: "D3" },
        { id: "9", link: "C4_D4", entityA: "C4", entityB: "D4" },
        { id: "10", link: "C5_D5", entityA: "C5", entityB: "D5" },
    ];

    var table = $("#relationTable").dataTable({
        "orderable": true,
        "pageLength": 5,
        "data": testData,
        "aLengthMenu": [[5, 10, 20, -1], ["5条", "10条", "20条", "All"]],
        "aoColumns": [
        { "sTitle": "序号", "mData": "id" },
        { "sTitle": "关系", "mData": "link" },
        { "sTitle": "实体A", "mData": "entityA" },
        { "sTitle": "实体B", "mData": "entityB" },
        ],
        "columnDefs": [
        {
            "render": function (data, type, row, meta) {
                //渲染 把数据源中的标题和url组成超链接
                return "<label onclick=test('" + row.link + "')>" + data + "</label>";
            },
            //指定是第三列
            "targets": 2
        }]
    });
});

function test(param) {
    alert("test:" + param);
};