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
            {"Id":"Person_21","NodeTypeId": "Person","Image": "test/images/HS7.png","PropertyValues": [{"Key": "name","Value": "person 21"},
                                                                                                  {"Key": "age","Value": "21"},
                                                                                                  {"Key": "position","Value": "CEO"}]},
            {"Id":"Person_22","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "person 22"},
                                                                                                  {"Key": "age","Value": "22"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_23","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "person 23"},
                                                                                                  {"Key": "age","Value": "23"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_24","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "person 24"},
                                                                                                  {"Key": "age","Value": "24"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]}
    ],
    "Links": [
            {"Id":"Person_13_Person_21","FromId": "Person_13","ToId": "Person_21","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},
            {"Id":"Person_13_Person_22","FromId": "Person_13","ToId": "Person_22","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下属"}]},
            {"Id":"Person_13_Person_23","FromId": "Person_13","ToId": "Person_23","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "师傅"}]},
            {"Id":"Person_13_Person_24","FromId": "Person_13","ToId": "Person_24","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]}
    ]
}
