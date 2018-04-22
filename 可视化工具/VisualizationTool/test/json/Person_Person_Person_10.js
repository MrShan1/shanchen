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
             
          {"Id":"Person_190","NodeTypeId": "Person","Image": "test/images/HS7.png","PropertyValues": [{"Key": "name","Value": "Luke Warm"},
                                                                                                  {"Key": "age","Value": "39"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_191","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_192","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_193","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_194","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_195","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_196","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_197","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_198","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_199","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_200","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_201","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_202","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_203","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_204","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_205","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_206","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_207","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_208","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_209","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]}
    ],
    "Links": [
            {"Id":"Person_10_Person_191","FromId": "Person_10","ToId": "Person_190","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上级"}]},

            {"Id":"Person_10_Person_192","FromId": "Person_10","ToId": "Person_191","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_10_Person_193","FromId": "Person_10","ToId": "Person_192","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_10_Person_194","FromId": "Person_10","ToId": "Person_193","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_10_Person_195","FromId": "Person_10","ToId": "Person_194","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_10_Person_196","FromId": "Person_10","ToId": "Person_195","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_10_Person_197","FromId": "Person_10","ToId": "Person_196","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_10_Person_198","FromId": "Person_10","ToId": "Person_197","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_10_Person_199","FromId": "Person_10","ToId": "Person_198","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_10_Person_199","FromId": "Person_10","ToId": "Person_199","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_10_Person_200","FromId": "Person_10","ToId": "Person_200","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_10_Person_201","FromId": "Person_10","ToId": "Person_201","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_10_Person_202","FromId": "Person_10","ToId": "Person_202","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_10_Person_203","FromId": "Person_10","ToId": "Person_203","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_10_Person_204","FromId": "Person_10","ToId": "Person_204","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_10_Person_205","FromId": "Person_10","ToId": "Person_205","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_10_Person_206","FromId": "Person_10","ToId": "Person_206","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_10_Person_207","FromId": "Person_10","ToId": "Person_207","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_10_Person_208","FromId": "Person_10","ToId": "Person_208","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_10_Person_209","FromId": "Person_10","ToId": "Person_209","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]}
    ]
}
