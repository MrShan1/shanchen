{
    "Layout": "TreeLayout",
    "NodeTypes": [
            {"Id":"Person","Name":"人员", "DefaultImage":"test/images/default.png","Properties": [{"Key": "name","Name": "名称", "IsHidden": "false"},
                                                                                              {"Key": "age","Name": "年龄", "IsHidden": "true"},
                                                                                              {"Key": "position","Name": "职位", "IsHidden": "true"}]},
            {"Id":"Airplane","Name":"飞机", "DefaultImage":"test/images/Airplane.jpg","Properties": [{"Key": "no","Name": "编号", "IsHidden": "false"},
                                                                                                 {"Key": "fromCity","Name": "出发城市", "IsHidden": "true"},
                                                                                                 {"Key": "toCity","Name": "到达城市", "IsHidden": "true"}]},
            {"Id":"Hotel","Name":"酒店", "DefaultImage":"test/images/Hotel.jpg","Properties": [{"Key": "no","Name": "编号", "IsHidden": "false"},
                                                                                                 {"Key": "fromCity","Name": "所在城市", "IsHidden": "true"}]}
    ],
    "LinkTypes": [
            {"Id":"Person_Person", "Name": "人际关系","Color": "black","Thickness": "3","FromArrowType": "","ToArrowType": "Standard","Properties": [{"Key": "type","Name": "类型","IsHidden": "true"},
                                                                                                                                                         {"Key": "relation","Name": "关系","IsHidden": "false"}]},
            {"Id":"Person_Airplane", "Name": "航空旅行","Color": "blue","Thickness": "1","FromArrowType": "","ToArrowType": "OpenTriangle","Properties": [{"Key": "reason","Name": "目的","IsHidden": "true"},
                                                                                                                         {"Key": "time","Name": "时间","IsHidden": "false"}]},
            {"Id":"Person_Hotel", "Name": "住宿酒店","Color": "blue","Thickness": "1","FromArrowType": "","ToArrowType": "OpenTriangle","Properties": [{"Key": "reason","Name": "目的","IsHidden": "true"},
                                                                                                                         {"Key": "time","Name": "时间","IsHidden": "false"}]}
    ],
    "Nodes": [
            {"Id":"Person_12","NodeTypeId": "Person","Image": "test/images/HS12.png","PropertyValues": [{"Key": "name","Value": "王刚"},
                                                                                                  {"Key": "age","Value": "27"},
                                                                                                  {"Key": "position","Value": "CEO"}]},
            {"Id":"Person_13","NodeTypeId": "Person","Image": "test/images/HS13.png","PropertyValues": [{"Key": "name","Value": "张三"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_14","NodeTypeId": "Person","Image": "test/images/HS14.png","PropertyValues": [{"Key": "name","Value": "老李"},
                                                                                                  {"Key": "age","Value": "24"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]}
    ],
    "Links": [
            {"Id":"Person_3_Person_12","FromId": "Person_3","ToId": "Person_12","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},
            {"Id":"Person_3_Person_13","FromId": "Person_3","ToId": "Person_13","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下属"}]},
            {"Id":"Person_3_Person_14","FromId": "Person_3","ToId": "Person_14","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},
            {"Id":"Person_3_Person_1","FromId": "Person_3","ToId": "Person_1","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下属"}]}
    ]
}
