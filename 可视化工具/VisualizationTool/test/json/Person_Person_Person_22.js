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
            {"Id":"Person_31","NodeTypeId": "Person","Image": "test/images/HS1.png","PropertyValues": [{"Key": "name","Value": "person 31"},
                                                                                                  {"Key": "age","Value": "21"},
                                                                                                  {"Key": "position","Value": "CEO"}]},
            {"Id":"Person_32","NodeTypeId": "Person","Image": "test/images/HS2.png","PropertyValues": [{"Key": "name","Value": "person32"},
                                                                                                  {"Key": "age","Value": "22"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_33","NodeTypeId": "Person","Image": "test/images/HS3.png","PropertyValues": [{"Key": "name","Value": "person33"},
                                                                                                  {"Key": "age","Value": "23"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]}
    ],
    "Links": [
            {"Id":"Person_22_Person_31","FromId": "Person_22","ToId": "Person_31","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "朋友"},
                                                                                                                             {"Key": "relation","Value": "朋友"}]},
            {"Id":"Person_22_Person_32","FromId": "Person_22","ToId": "Person_32","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "朋友"},
                                                                                                                             {"Key": "relation","Value": "哥们"}]},
            {"Id":"Person_22_Person_33","FromId": "Person_22","ToId": "Person_33","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "朋友"},
                                                                                                                             {"Key": "relation","Value": "兄弟"}]}
    ]
}
