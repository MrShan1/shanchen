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
             
          {"Id":"Person_120","NodeTypeId": "Person","Image": "test/images/HS7.png","PropertyValues": [{"Key": "name","Value": "Luke Warm"},
                                                                                                  {"Key": "age","Value": "39"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_121","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_122","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_123","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_124","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_125","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_126","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_127","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_128","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_129","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_130","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_131","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_132","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_133","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_134","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_135","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_136","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_137","NodeTypeId": "Person","Image": "test/images/HS10.png","PropertyValues": [{"Key": "name","Value": "lily chen"},
                                                                                                  {"Key": "age","Value": "42"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_138","NodeTypeId": "Person","Image": "test/images/HS8.png","PropertyValues": [{"Key": "name","Value": "可拓展"},
                                                                                                  {"Key": "age","Value": "40"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]},

          {"Id":"Person_139","NodeTypeId": "Person","Image": "test/images/HS9.png","PropertyValues": [{"Key": "name","Value": "wang xuesi"},
                                                                                                  {"Key": "age","Value": "41"},
                                                                                                  {"Key": "position","Value": "VP Marketing/Sales"}]}
    ],
    "Links": [
            {"Id":"Person_33_Person_120","FromId": "Person_33","ToId": "Person_120","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上级"}]},

            {"Id":"Person_33_Person_121","FromId": "Person_33","ToId": "Person_121","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_33_Person_122","FromId": "Person_33","ToId": "Person_122","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_33_Person_123","FromId": "Person_33","ToId": "Person_123","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_33_Person_124","FromId": "Person_33","ToId": "Person_124","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_33_Person_125","FromId": "Person_33","ToId": "Person_125","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_33_Person_126","FromId": "Person_33","ToId": "Person_126","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_33_Person_127","FromId": "Person_33","ToId": "Person_127","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_33_Person_128","FromId": "Person_33","ToId": "Person_128","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_33_Person_129","FromId": "Person_33","ToId": "Person_129","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_33_Person_130","FromId": "Person_33","ToId": "Person_130","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_33_Person_131","FromId": "Person_33","ToId": "Person_131","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_33_Person_132","FromId": "Person_33","ToId": "Person_132","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_33_Person_133","FromId": "Person_33","ToId": "Person_133","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "下级"}]},

            {"Id":"Person_33_Person_134","FromId": "Person_33","ToId": "Person_134","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_33_Person_135","FromId": "Person_33","ToId": "Person_135","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_33_Person_136","FromId": "Person_33","ToId": "Person_136","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]},

            {"Id":"Person_33_Person_137","FromId": "Person_33","ToId": "Person_137","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "主任"}]},

            {"Id":"Person_33_Person_138","FromId": "Person_33","ToId": "Person_138","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "总经理"}]},

            {"Id":"Person_33_Person_139","FromId": "Person_33","ToId": "Person_139","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},
                                                                                                                             {"Key": "relation","Value": "上司"}]}
    ]
}
