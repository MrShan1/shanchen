{
    "Layout": "TreeLayout",
    "NodeTypes": [
            {"Id":"Person","Name":"人员", "DefaultImage":"images/default.png","Properties": [{"Key": "name","Name": "名称", "IsHidden": "false"},
                                                                                              {"Key": "age","Name": "年龄", "IsHidden": "false"},
                                                                                              {"Key": "position","Name": "职位", "IsHidden": "false"}]},
            {"Id":"Airplane","Name":"飞机", "DefaultImage":"images/Airplane.jpg","Properties": [{"Key": "no","Name": "编号", "IsHidden": "false"},
                                                                                                 {"Key": "fromCity","Name": "出发城市", "IsHidden": "false"},
                                                                                                 {"Key": "toCity","Name": "到达城市", "IsHidden": "false"}]}
        ],
    "LinkTypes": [
            {"Id":"Person_Person", "Name": "人际关系","Color": "black","Thickness": "3","FromArrowType": "","ToArrowType": "Standard","Properties": [{"Key": "type","Name": "类型","IsHidden": "false"},
                                                                                                                                                         {"Key": "relation","Name": "关系","IsHidden": "false"}]},
            {"Id":"Person_Airplane", "Name": "航空旅行","Color": "blue","Thickness": "1","FromArrowType": "","ToArrowType": "OpenTriangle","Properties": [{"Key": "reason","Name": "目的","IsHidden": "false"},
                                                                                                                         {"Key": "time","Name": "时间","IsHidden": "false"}]}
        ],
    "Nodes": [
            {"Id":"Person_1","NodeTypeId": "Person","Image": "images/HS1.png","PropertyValues": [{"Key": "name","Value": "Stella Payne Diaz"},
                                                                                                  {"Key": "age","Value": "35"},
                                                                                                  {"Key": "position","Value": "CEO"}]},
            {"Id":"Person_2","NodeTypeId": "Person","Image": "images/HS2.png","PropertyValues": [{"Key": "name","Value": "Luke Warm"},
                                                                                                  {"Key": "age","Value": "34"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

            {"Id":"Airplane_1","NodeTypeId": "Airplane","Image": "images/Airplane.jpg","PropertyValues": [{"Key": "no","Value": "A110110"},
                                                                                                          {"Key": "fromCity","Value": "北京"},
                                                                                                          {"Key": "toCity","Value": "上海"}]}
        ],
    "Links": [
            {"Id":"Person_Person_1","FromId": "Person_1","ToId": "Person_2","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},
            {"Id":"Person_Airplane_1","FromId": "Person_1","ToId": "Airplane_1","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "旅行"},
                                                                                                                                   {"Key": "time","Value": "2017/01/01 12:00 ~ 2017/01/01 14:20"}]}
        ]
}
