{
    "Layout": "ForceDirectedLayout",
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
            {"Id":"Person_1","NodeTypeId": "Person","Image": "test/images/HS1.png","PropertyValues": [{"Key": "name","Value": "Stella Payne Diaz"},
                                                                                                  {"Key": "age","Value": "35"},
                                                                                                  {"Key": "position","Value": "CEO"}]},
            {"Id":"Person_2","NodeTypeId": "Person","Image": "test/images/HS2.png","PropertyValues": [{"Key": "name","Value": "Luke Warm"},
                                                                                                  {"Key": "age","Value": "34"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

            {"Id":"Airplane_1","NodeTypeId": "Airplane","Image": "test/images/Airplane.jpg","PropertyValues": [{"Key": "no","Value": "A110110"},
                                                                                                          {"Key": "fromCity","Value": "北京"},
                                                                                                          {"Key": "toCity","Value": "上海"}]},

            {"Id":"Person_3","NodeTypeId": "Person","Image": "test/images/HS3.png","PropertyValues": [{"Key": "name","Value": "Luke Warm3"},
                                                                                                  {"Key": "age","Value": "35"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_4","NodeTypeId": "Person","Image": "test/images/HS4.png","PropertyValues": [{"Key": "name","Value": "Luke Warm4"},
                                                                                                  {"Key": "age","Value": "36"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_5","NodeTypeId": "Person","Image": "test/images/HS5.png","PropertyValues": [{"Key": "name","Value": "Luke Warm5"},
                                                                                                  {"Key": "age","Value": "37"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_6","NodeTypeId": "Person","Image": "test/images/HS6.png","PropertyValues": [{"Key": "name","Value": "Luke Warm6"},
                                                                                                  {"Key": "age","Value": "38"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]}

    ],
    "Links": [
            {"Id":"Person_Person_1","FromId": "Person_1","ToId": "Person_2","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},

            {"Id":"Person_Person_3","FromId": "Person_1","ToId": "Person_3","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_Person_4","FromId": "Person_1","ToId": "Person_4","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},

            {"Id":"Person_Person_5","FromId": "Person_1","ToId": "Person_5","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同行"}]},

            {"Id":"Person_Person_6","FromId": "Person_1","ToId": "Person_6","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下属"}]},
          
          {"Id":"Person_Airplane_1","FromId": "Person_1","ToId": "Airplane_1","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "旅行"},
                                                                                                                                   {"Key": "time","Value": "2017/01/01 12:00 ~ 2017/01/01 14:20"}]}
    ]
}
