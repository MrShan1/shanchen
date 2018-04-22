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
                                                                                                              
          {"Id":"Hotel_1","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "S123456"},
                                                                                                          {"Key": "fromCity","Value": "上海"}]},

          {"Id":"Hotel_2","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "A110110"},
                                                                                                          {"Key": "City","Value": "北京"}]},

          {"Id":"Hotel_3","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "A126135"},
                                                                                                          {"Key": "fromCity","Value": "北京"}]},

          {"Id":"Hotel_4","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "A110188"},
                                                                                                          {"Key": "fromCity","Value": "北京"}]},

          {"Id":"Hotel_5","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "B6830123"},
                                                                                                          {"Key": "fromCity","Value": "河南"}]}
        ],
    "Links": [
            {"Id":"Person_4_Hotel_1","FromId": "Person_4","ToId": "Hotel_1","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "旅游"},
                                                                                                                             {"Key": "time","Value": "2017/01/01 12:00 ~ 2017/01/01 14:20"}]},

            {"Id":"Person_4_Hotel_2","FromId": "Person_4","ToId": "Hotel_2","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "办事"},
                                                                                                                             {"Key": "time","Value": "2016/05/23 9:26 ~ 2016/05/24 11:20"}]},

            {"Id":"Person_4_Hotel_3","FromId": "Person_4","ToId": "Hotel_3","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "住宿"},
                                                                                                                             {"Key": "time","Value": "2016/08/28 10:30 ~ 2016/09/01 6:27"}]},

            {"Id":"Person_4_Hotel_4","FromId": "Person_4","ToId": "Hotel_4","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "娱乐"},
                                                                                                                             {"Key": "time","Value": "2016/11/06 22:08 ~ 2016/11/07 6:27"}]},

            {"Id":"Person_4_Hotel_5","FromId": "Person_4","ToId": "Hotel_5","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "出差"},
                                                                                                                             {"Key": "time","Value": "2016/11/06 22:08 ~ 2016/11/07 6:27"}]}
        ]
}
