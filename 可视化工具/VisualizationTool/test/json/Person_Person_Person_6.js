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
            
          {"Id":"Person_7","NodeTypeId": "Person","Image": "test/images/HS7.png","PropertyValues": [{"Key": "name","Value": "Luke Warm"},
                                                                                                  {"Key": "age","Value": "39"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_8","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_9","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_10","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]}
        ],
    "Links": [
            {"Id":"Person_6_Person_7","FromId": "Person_6","ToId": "Person_7","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上级"}]},

            {"Id":"Person_6_Person_8","FromId": "Person_6","ToId": "Person_8","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_6_Person_9","FromId": "Person_6","ToId": "Person_9","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_6_Person_10","FromId": "Person_6","ToId": "Person_10","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_6_Person_1","FromId": "Person_6","ToId": "Person_1","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]}
        ]
}
