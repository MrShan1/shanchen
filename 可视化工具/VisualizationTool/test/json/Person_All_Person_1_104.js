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
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
          {"Id":"Person_12","NodeTypeId": "Person","Image": "test/images/HS12.png","PropertyValues": [{"Key": "name","Value": "王刚"},
                                                                                                  {"Key": "age","Value": "27"},
                                                                                                  {"Key": "position","Value": "CEO"}]},
            {"Id":"Person_13","NodeTypeId": "Person","Image": "test/images/HS13.png","PropertyValues": [{"Key": "name","Value": "张三"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_14","NodeTypeId": "Person","Image": "test/images/HS14.png","PropertyValues": [{"Key": "name","Value": "老李"},
                                                                                                  {"Key": "age","Value": "24"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

            {"Id":"Hotel_1","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "S123456"},
                                                                                                          {"Key": "fromCity","Value": "上海"}]},

          {"Id":"Hotel_2","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "A110110"},
                                                                                                          {"Key": "City","Value": "北京"}]},

          {"Id":"Hotel_3","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "A126135"},
                                                                                                          {"Key": "fromCity","Value": "北京"}]},

          {"Id":"Hotel_4","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "A110188"},
                                                                                                          {"Key": "fromCity","Value": "北京"}]},

          {"Id":"Hotel_5","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "B6830123"},
                                                                                                          {"Key": "fromCity","Value": "河南"}]},

           {"Id":"Person_7","NodeTypeId": "Person","Image": "test/images/HS7.png","PropertyValues": [{"Key": "name","Value": "Luke Warm"},
                                                                                                  {"Key": "age","Value": "39"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_8","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "zhu xinlong"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_9","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_10","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

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
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_26","NodeTypeId": "Person","Image": "test/images/HS7.png","PropertyValues": [{"Key": "name","Value": "Luke Warm"},
                                                                                                  {"Key": "age","Value": "39"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_27","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "zhu xinlong"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_28","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_29","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

            {"Id":"Person_31","NodeTypeId": "Person","Image": "test/images/HS1.png","PropertyValues": [{"Key": "name","Value": "person 31"},
                                                                                                  {"Key": "age","Value": "21"},
                                                                                                  {"Key": "position","Value": "CEO"}]},
            {"Id":"Person_32","NodeTypeId": "Person","Image": "test/images/HS2.png","PropertyValues": [{"Key": "name","Value": "person32"},
                                                                                                  {"Key": "age","Value": "22"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_33","NodeTypeId": "Person","Image": "test/images/HS3.png","PropertyValues": [{"Key": "name","Value": "person33"},
                                                                                                  {"Key": "age","Value": "23"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

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
                                                                                                          {"Key": "toCity","Value": "上海"}]},

          {"Id":"Hotel_12","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "A110110"},
                                                                                                          {"Key": "City","Value": "北京"}]},

          {"Id":"Hotel_13","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "A126135"},
                                                                                                          {"Key": "fromCity","Value": "北京"}]},

          {"Id":"Hotel_14","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "A110188"},
                                                                                                          {"Key": "fromCity","Value": "北京"}]},

          {"Id":"Hotel_15","NodeTypeId": "Hotel","Image": "test/images/Hotel.jpg","PropertyValues": [{"Key": "no","Value": "B6830123"},
                                                                                                          {"Key": "fromCity","Value": "河南"}]},
            {"Id":"Person_41","NodeTypeId": "Person","Image": "test/images/HS1.png","PropertyValues": [{"Key": "name","Value": "person 21"},
                                                                                                  {"Key": "age","Value": "21"},
                                                                                                  {"Key": "position","Value": "CEO"}]},
            {"Id":"Person_42","NodeTypeId": "Person","Image": "test/images/HS2.png","PropertyValues": [{"Key": "name","Value": "person 22"},
                                                                                                  {"Key": "age","Value": "22"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_43","NodeTypeId": "Person","Image": "test/images/HS3.png","PropertyValues": [{"Key": "name","Value": "person 23"},
                                                                                                  {"Key": "age","Value": "23"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_44","NodeTypeId": "Person","Image": "test/images/HS4.png","PropertyValues": [{"Key": "name","Value": "person 24"},
                                                                                                  {"Key": "age","Value": "24"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_45","NodeTypeId": "Person","Image": "test/images/HS5.png","PropertyValues": [{"Key": "name","Value": "person 22"},
                                                                                                  {"Key": "age","Value": "22"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_46","NodeTypeId": "Person","Image": "test/images/HS6.png","PropertyValues": [{"Key": "name","Value": "person 23"},
                                                                                                  {"Key": "age","Value": "23"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_47","NodeTypeId": "Person","Image": "test/images/HS7.png","PropertyValues": [{"Key": "name","Value": "person 24"},
                                                                                                  {"Key": "age","Value": "24"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_48","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "person 22"},
                                                                                                  {"Key": "age","Value": "22"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_49","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "person 23"},
                                                                                                  {"Key": "age","Value": "23"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_50","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "person 24"},
                                                                                                  {"Key": "age","Value": "24"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

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
                                                                                                          {"Key": "toCity","Value": "上海"}]},
          {"Id":"Person_67","NodeTypeId": "Person","Image": "test/images/HS7.png","PropertyValues": [{"Key": "name","Value": "Luke Warm"},
                                                                                                  {"Key": "age","Value": "39"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_68","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_69","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_70","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_68","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_69","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_70","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_71","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_72","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_73","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_74","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_75","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]}, 
          {"Id":"Person_80","NodeTypeId": "Person","Image": "test/images/HS7.png","PropertyValues": [{"Key": "name","Value": "Luke Warm"},
                                                                                                  {"Key": "age","Value": "39"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_81","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_82","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_83","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_84","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_85","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_86","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_87","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_88","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},   
          {"Id":"Person_90","NodeTypeId": "Person","Image": "test/images/HS7.png","PropertyValues": [{"Key": "name","Value": "Luke Warm"},
                                                                                                  {"Key": "age","Value": "39"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_91","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_92","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_93","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_94","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_95","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_96","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_97","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_98","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},   
          {"Id":"Person_100","NodeTypeId": "Person","Image": "test/images/HS7.png","PropertyValues": [{"Key": "name","Value": "Luke Warm"},
                                                                                                  {"Key": "age","Value": "39"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_101","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_102","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_103","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_104","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_105","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_106","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_107","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_108","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_109","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_110","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_111","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_112","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_113","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_114","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_115","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_116","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_117","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_118","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_119","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
          {"Id":"Person_141","NodeTypeId": "Person","Image": "test/images/HS7.png","PropertyValues": [{"Key": "name","Value": "person 21"},
                                                                                                  {"Key": "age","Value": "21"},
                                                                                                  {"Key": "position","Value": "CEO"}]},
            {"Id":"Person_142","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "person 22"},
                                                                                                  {"Key": "age","Value": "22"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_143","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "person 23"},
                                                                                                  {"Key": "age","Value": "23"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_144","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "person 24"},
                                                                                                  {"Key": "age","Value": "24"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_145","NodeTypeId": "Person","Image": "test/images/HS11.png","PropertyValues": [{"Key": "name","Value": "person 24"},
                                                                                                  {"Key": "age","Value": "24"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_146","NodeTypeId": "Person","Image": "test/images/HS11.png","PropertyValues": [{"Key": "name","Value": "person 24"},
                                                                                                  {"Key": "age","Value": "24"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_147","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "person 24"},
                                                                                                  {"Key": "age","Value": "24"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_148","NodeTypeId": "Person","Image": "test/images/HS11.png","PropertyValues": [{"Key": "name","Value": "person 24"},
                                                                                                  {"Key": "age","Value": "24"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},
            {"Id":"Person_149","NodeTypeId": "Person","Image": "test/images/HS11.png","PropertyValues": [{"Key": "name","Value": "person 24"},
                                                                                                  {"Key": "age","Value": "24"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]}  









    ],
    "Links": [
            {"Id":"Person_Person_1","FromId": "Person_1","ToId": "Person_2","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},

            {"Id":"Person_Person_3","FromId": "Person_1","ToId": "Person_3","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上级"}]},

            {"Id":"Person_Person_4","FromId": "Person_1","ToId": "Person_4","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},

            {"Id":"Person_Person_5","FromId": "Person_1","ToId": "Person_5","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同行"}]},

            {"Id":"Person_Person_6","FromId": "Person_1","ToId": "Person_6","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "打杂"}]},
            {"Id":"Person_3_Person_12","FromId": "Person_3","ToId": "Person_12","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},
            {"Id":"Person_3_Person_13","FromId": "Person_3","ToId": "Person_13","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下属"}]},
            {"Id":"Person_3_Person_14","FromId": "Person_3","ToId": "Person_14","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},
            {"Id":"Person_Airplane_1","FromId": "Person_1","ToId": "Airplane_1","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "旅行"},
                                                                                                                                   {"Key": "time","Value": "2017/01/01 12:00 ~ 2017/01/01 14:20"}]},

            {"Id":"Person_4_Hotel_1","FromId": "Person_4","ToId": "Hotel_1","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "旅游"},
                                                                                                                             {"Key": "time","Value": "2017/01/01 12:00 ~ 2017/01/01 14:20"}]},

            {"Id":"Person_4_Hotel_2","FromId": "Person_4","ToId": "Hotel_2","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "办事"},
                                                                                                                             {"Key": "time","Value": "2016/05/23 9:26 ~ 2016/05/24 11:20"}]},

            {"Id":"Person_4_Hotel_3","FromId": "Person_4","ToId": "Hotel_3","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "住宿"},
                                                                                                                             {"Key": "time","Value": "2016/08/28 10:30 ~ 2016/09/01 6:27"}]},

            {"Id":"Person_4_Hotel_4","FromId": "Person_4","ToId": "Hotel_4","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "娱乐"},
                                                                                                                             {"Key": "time","Value": "2016/11/06 22:08 ~ 2016/11/07 6:27"}]},

            {"Id":"Person_4_Hotel_5","FromId": "Person_4","ToId": "Hotel_5","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "出差"},
                                                                                                                             {"Key": "time","Value": "2016/11/06 22:08 ~ 2016/11/07 6:27"}]},

             {"Id":"Person_6_Person_7","FromId": "Person_6","ToId": "Person_7","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上级"}]},

            {"Id":"Person_6_Person_8","FromId": "Person_6","ToId": "Person_8","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_6_Person_9","FromId": "Person_6","ToId": "Person_9","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_6_Person_10","FromId": "Person_6","ToId": "Person_10","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_13_Person_21","FromId": "Person_13","ToId": "Person_21","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},
            {"Id":"Person_13_Person_22","FromId": "Person_13","ToId": "Person_22","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下属"}]},
            {"Id":"Person_13_Person_23","FromId": "Person_13","ToId": "Person_23","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "师傅"}]},
            {"Id":"Person_13_Person_24","FromId": "Person_13","ToId": "Person_24","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_8_Person_26","FromId": "Person_8","ToId": "Person_26","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "亲属"},
                                                                                                                             {"Key": "relation","Value": "兄弟"}]},

            {"Id":"Person_8_Person_27","FromId": "Person_8","ToId": "Person_27","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "亲属"},
                                                                                                                             {"Key": "relation","Value": "哥哥"}]},

            {"Id":"Person_8_Person_28","FromId": "Person_8","ToId": "Person_28","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "亲属"},
                                                                                                                             {"Key": "relation","Value": "父亲"}]},

            {"Id":"Person_8_Person_29","FromId": "Person_8","ToId": "Person_29","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "亲属"},
                                                                                                                             {"Key": "relation","Value": "儿子"}]},

            {"Id":"Person_22_Person_31","FromId": "Person_22","ToId": "Person_31","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "朋友"},
                                                                                                                             {"Key": "relation","Value": "朋友"}]},
            {"Id":"Person_22_Person_32","FromId": "Person_22","ToId": "Person_32","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "朋友"},
                                                                                                                             {"Key": "relation","Value": "哥们"}]},
            {"Id":"Person_22_Person_33","FromId": "Person_22","ToId": "Person_33","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "朋友"},
                                                                                                                             {"Key": "relation","Value": "兄弟"}]},
            {"Id":"Person_3_Person_1","FromId": "Person_3","ToId": "Person_1","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下属"}]},
            {"Id":"Person_6_Person_1","FromId": "Person_6","ToId": "Person_1","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_32_Airplane_11","FromId": "Person_32","ToId": "Airplane_11","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "旅行"},
                                                                                                                                   {"Key": "time","Value": "2017/01/01 12:00 ~ 2017/01/01 14:20"}]},
            {"Id":"Person_32_Airplane_12","FromId": "Person_32","ToId": "Airplane_12","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "出差"},
                                                                                                                                   {"Key": "time","Value": "2016/01/01 12:50 ~ 2016/01/01 14:10"}]},
            {"Id":"Person_32_Airplane_13","FromId": "Person_32","ToId": "Airplane_13","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "办事"},
                                                                                                                                   {"Key": "time","Value": "2017/01/012 18:40 ~ 2017/01/12 22:20"}]},
            {"Id":"Person_32_Airplane_14","FromId": "Person_32","ToId": "Airplane_14","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "旅行"},
                                                                                                                                   {"Key": "time","Value": "2016/11/23 10:30 ~ 2016/11/23 16:40"}]},

            {"Id":"Person_28_Hotel_12","FromId": "Person_28","ToId": "Hotel_12","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "办事"},
                                                                                                                             {"Key": "time","Value": "2016/05/23 9:26 ~ 2016/05/24 11:20"}]},

            {"Id":"Person_28_Hotel_13","FromId": "Person_28","ToId": "Hotel_13","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "住宿"},
                                                                                                                             {"Key": "time","Value": "2016/08/28 10:30 ~ 2016/09/01 6:27"}]},

            {"Id":"Person_28_Hotel_14","FromId": "Person_28","ToId": "Hotel_14","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "娱乐"},
                                                                                                                             {"Key": "time","Value": "2016/11/06 22:08 ~ 2016/11/07 6:27"}]},

            {"Id":"Person_28_Hotel_15","FromId": "Person_28","ToId": "Hotel_15","LinkTypeId": "Person_Hotel","PropertyValues": [{"Key": "reason","Value": "出差"},
                                                                                                                             {"Key": "time","Value": "2016/11/06 22:08 ~ 2016/11/07 6:27"}]},
            {"Id":"Person_24_Person_41","FromId": "Person_24","ToId": "Person_41","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},
            {"Id":"Person_24_Person_42","FromId": "Person_24","ToId": "Person_42","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下属"}]},
            {"Id":"Person_24_Person_43","FromId": "Person_24","ToId": "Person_43","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "师傅"}]},
            {"Id":"Person_24_Person_44","FromId": "Person_24","ToId": "Person_44","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},
            {"Id":"Person_24_Person_45","FromId": "Person_24","ToId": "Person_45","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},
        {"Id":"Person_24_Person_46","FromId": "Person_24","ToId": "Person_46","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                         {"Key": "relation","Value": "下属"}]},
        {"Id":"Person_24_Person_47","FromId": "Person_24","ToId": "Person_47","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                         {"Key": "relation","Value": "师傅"}]},
        {"Id":"Person_24_Person_48","FromId": "Person_24","ToId": "Person_48","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                         {"Key": "relation","Value": "上司"}]},
            {"Id":"Person_24_Person_49","FromId": "Person_24","ToId": "Person_49","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},
        {"Id":"Person_24_Person_50","FromId": "Person_24","ToId": "Person_50","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                         {"Key": "relation","Value": "下属"}]},
            {"Id":"Person_12_Airplane_11","FromId": "Person_12","ToId": "Airplane_11","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "旅行"},
                                                                                                                                   {"Key": "time","Value": "2017/01/01 12:00 ~ 2017/01/01 14:20"}]},
            {"Id":"Person_12_Airplane_12","FromId": "Person_12","ToId": "Airplane_12","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "出差"},
                                                                                                                                   {"Key": "time","Value": "2016/01/01 12:50 ~ 2016/01/01 14:10"}]},
            {"Id":"Person_12_Airplane_13","FromId": "Person_12","ToId": "Airplane_13","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "办事"},
                                                                                                                                   {"Key": "time","Value": "2017/01/012 18:40 ~ 2017/01/12 22:20"}]},
            {"Id":"Person_12_Airplane_14","FromId": "Person_12","ToId": "Airplane_14","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "旅行"},
                                                                                                                                   {"Key": "time","Value": "2016/11/23 10:30 ~ 2016/11/23 16:40"}]},
            {"Id":"Person_5_Person_67","FromId": "Person_5","ToId": "Person_67","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上级"}]},

            {"Id":"Person_5_Person_68","FromId": "Person_5","ToId": "Person_68","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_5_Person_69","FromId": "Person_5","ToId": "Person_69","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_5_Person_70","FromId": "Person_5","ToId": "Person_70","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_5_Person_71","FromId": "Person_5","ToId": "Person_71","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_5_Person_72","FromId": "Person_5","ToId": "Person_72","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_5_Person_73","FromId": "Person_5","ToId": "Person_73","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_5_Person_74","FromId": "Person_5","ToId": "Person_74","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_5_Person_75","FromId": "Person_5","ToId": "Person_75","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},
            {"Id":"Person_70_Person_80","FromId": "Person_70","ToId": "Person_80","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上级"}]},

            {"Id":"Person_70_Person_81","FromId": "Person_70","ToId": "Person_81","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_70_Person_82","FromId": "Person_70","ToId": "Person_82","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_70_Person_83","FromId": "Person_70","ToId": "Person_83","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_70_Person_84","FromId": "Person_70","ToId": "Person_84","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_70_Person_85","FromId": "Person_70","ToId": "Person_85","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_70_Person_86","FromId": "Person_70","ToId": "Person_86","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_70_Person_87","FromId": "Person_70","ToId": "Person_87","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_70_Person_88","FromId": "Person_70","ToId": "Person_88","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_86_Person_90","FromId": "Person_86","ToId": "Person_90","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_86_Person_91","FromId": "Person_86","ToId": "Person_91","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上级"}]},

            {"Id":"Person_86_Person_92","FromId": "Person_86","ToId": "Person_92","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_86_Person_93","FromId": "Person_86","ToId": "Person_93","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_86_Person_94","FromId": "Person_86","ToId": "Person_94","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_86_Person_95","FromId": "Person_86","ToId": "Person_95","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_86_Person_96","FromId": "Person_86","ToId": "Person_96","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_86_Person_97","FromId": "Person_86","ToId": "Person_97","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_86_Person_98","FromId": "Person_86","ToId": "Person_98","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_82_Person_100","FromId": "Person_82","ToId": "Person_100","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上级"}]},

            {"Id":"Person_82_Person_101","FromId": "Person_82","ToId": "Person_101","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_82_Person_102","FromId": "Person_82","ToId": "Person_102","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_82_Person_103","FromId": "Person_82","ToId": "Person_103","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_82_Person_104","FromId": "Person_82","ToId": "Person_104","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_82_Person_105","FromId": "Person_82","ToId": "Person_105","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_82_Person_106","FromId": "Person_82","ToId": "Person_106","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_82_Person_107","FromId": "Person_82","ToId": "Person_107","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_82_Person_108","FromId": "Person_82","ToId": "Person_108","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_82_Person_109","FromId": "Person_82","ToId": "Person_109","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_82_Person_110","FromId": "Person_82","ToId": "Person_110","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_82_Person_111","FromId": "Person_82","ToId": "Person_111","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_82_Person_112","FromId": "Person_82","ToId": "Person_112","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_82_Person_113","FromId": "Person_82","ToId": "Person_113","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_82_Person_114","FromId": "Person_82","ToId": "Person_114","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_82_Person_115","FromId": "Person_82","ToId": "Person_115","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_82_Person_116","FromId": "Person_82","ToId": "Person_116","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_82_Person_117","FromId": "Person_82","ToId": "Person_117","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_82_Person_118","FromId": "Person_82","ToId": "Person_118","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_82_Person_119","FromId": "Person_82","ToId": "Person_119","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},
            {"Id":"Person_14_Person_141","FromId": "Person_13","ToId": "Person_141","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "同事"}]},
            {"Id":"Person_14_Person_142","FromId": "Person_13","ToId": "Person_142","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下属"}]},
            {"Id":"Person_14_Person_143","FromId": "Person_13","ToId": "Person_143","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "师傅"}]},
            {"Id":"Person_14_Person_144","FromId": "Person_13","ToId": "Person_144","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},
            {"Id":"Person_14_Person_145","FromId": "Person_13","ToId": "Person_145","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下属"}]},
            {"Id":"Person_14_Person_146","FromId": "Person_13","ToId": "Person_146","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "师傅"}]},
            {"Id":"Person_14_Person_147","FromId": "Person_13","ToId": "Person_147","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},
            {"Id":"Person_14_Person_148","FromId": "Person_13","ToId": "Person_148","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下属"}]},
            {"Id":"Person_14_Person_149","FromId": "Person_13","ToId": "Person_149","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]}

  

    ]
}
