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
            {"Id":"Airplane_11","NodeTypeId": "Airplane","Image": "test/images/Airplane.jpg","PropertyValues": [{"Key": "no","Value": "A110110"},
                                                                                                          {"Key": "fromCity","Value": "北京"},
                                                                                                          {"Key": "toCity","Value": "上海"}]},
            {"Id":"Airplane_12","NodeTypeId": "Airplane","Image": "test/images/Airplane.jpg","PropertyValues": [{"Key": "no","Value": "A110110"},
                                                                                                          {"Key": "fromCity","Value": "北京"},
                                                                                                          {"Key": "toCity","Value": "上海"}]},
            {"Id":"Airplane_13","NodeTypeId": "Airplane","Image": "test/images/Airplane.jpg","PropertyValues": [{"Key": "no","Value": "A110110"},
                                                                                                          {"Key": "fromCity","Value": "北京"},
                                                                                                          {"Key": "toCity","Value": "上海"}]},
            {"Id":"Airplane_14","NodeTypeId": "Airplane","Image": "test/images/Airplane.jpg","PropertyValues": [{"Key": "no","Value": "A110110"},
                                                                                                          {"Key": "fromCity","Value": "北京"},
                                                                                                          {"Key": "toCity","Value": "上海"}]}
    ],
    "Links": [
            {"Id":"Person_32_Airplane_11","FromId": "Person_32","ToId": "Airplane_11","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "旅行"},
                                                                                                                                   {"Key": "time","Value": "2017/01/01 12:00 ~ 2017/01/01 14:20"}]},
            {"Id":"Person_32_Airplane_12","FromId": "Person_32","ToId": "Airplane_12","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "出差"},
                                                                                                                                   {"Key": "time","Value": "2016/01/01 12:50 ~ 2016/01/01 14:10"}]},
            {"Id":"Person_32_Airplane_13","FromId": "Person_32","ToId": "Airplane_13","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "办事"},
                                                                                                                                   {"Key": "time","Value": "2017/01/012 18:40 ~ 2017/01/12 22:20"}]},
            {"Id":"Person_32_Airplane_14","FromId": "Person_32","ToId": "Airplane_14","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "旅行"},
                                                                                                                                   {"Key": "time","Value": "2016/11/23 10:30 ~ 2016/11/23 16:40"}]}
    ]
}
