<%@ WebHandler Language="C#" Class="Datahandler" %>

using System;
using System.Web;

public class Datahandler : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        HttpResponse res = context.Response;
        HttpRequest req = context.Request;
       
        string type = req["type"];


        //        string test = "{\"ddd\":[{\"cid\":\"1\",\"pid\":\"0\",\"oid\":\"0\",\"view_type\":\"0\",\"status\":\"1\",\"name\":\"西科推荐\",\"eng_name\":\"\",\"ctpl\":\"\",\"ctitle\":\"\",\"ckeywords\":\"\",\"cdescription\":\"\",\"url\":\"http:\\/\\/www.bursonchurch.net\\/index.php?Cate-index-cid-1.html\"},{\"cid\":\"2\",\"pid\":\"0\",\"oid\":\"2\",\"view_type\":\"0\",\"status\":\"1\",\"name\":\"校园活动\",\"eng_name\":\"\",\"ctpl\":\"\",\"ctitle\":\"\",\"ckeywords\":\"\",\"cdescription\":\"\",\"url\":\"http:\\/\\/www.bursonchurch.net\\/index.php?Cate-index-cid-2.html\"},{\"cid\":\"3\",\"pid\":\"0\",\"oid\":\"2\",\"view_type\":\"0\",\"status\":\"1\",\"name\":\"帅哥\",\"eng_name\":\"\",\"ctpl\":\"\",\"ctitle\":\"\",\"ckeywords\":\"动物世界keword\",\"cdescription\":\"动物世界s\",\"url\":\"http:\\/\\/www.bursonchurch.net\\/index.php?Cate-index-cid-3.html\"},{\"cid\":\"4\",\"pid\":\"0\",\"oid\":\"4\",\"view_type\":\"1\",\"status\":\"1\",\"name\":\"静物\",\"eng_name\":\"\",\"ctpl\":\"\",\"ctitle\":\"\",\"ckeywords\":\"\",\"cdescription\":\"\",\"url\":\"http:\\/\\/www.bursonchurch.net\\/index.php?Cate-index-cid-4.html\"},{\"cid\":\"5\",\"pid\":\"0\",\"oid\":\"5\",\"view_type\":\"1\",\"status\":\"1\",\"name\":\"美女\",\"eng_name\":\"\",\"ctpl\":\"\",\"ctitle\":\"\",\"ckeywords\":\"\",\"cdescription\":\"\",\"url\":\"http:\\/\\/www.bursonchurch.net\\/index.php?Cate-index-cid-5.html\"}]}";

        //        string inputJsonString = @"
        //                  [
        //                      {StudentID:'100',Name:'aaa',Hometown:'china'},
        //                      {StudentID:'101',Name:'bbb',Hometown:'us'},
        //                     {StudentID:'102',Name:'ccc',Hometown:'england'}
        //                  ]";


        if (type == "loaddatajson")
        {
            res.Write(loadDataJson());

        };

        res.ContentType = "text/plain";
        res.End();
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }


    private string loadDataJson()
    {
        string inputJsonString ="{\"Layout\":\"TreeLayout\",\"NodeTypes\":[{\"Id\":\"Person\",\"Name\":\"人员\",\"DefaultImage\":\"test/images/default.png\",\"Properties\":[{\"Key\":\"name\",\"Name\":\"名称\",\"IsHidden\":\"false\"},{\"Key\":\"age\",\"Name\":\"年龄\",\"IsHidden\":\"false\"},{\"Key\":\"position\",\"Name\":\"职位\",\"IsHidden\":\"false\"}]},{\"Id\":\"Airplane\",\"Name\":\"飞机\",\"DefaultImage\":\"test/images/Airplane.jpg\",\"Properties\":[{\"Key\":\"no\",\"Name\":\"编号\",\"IsHidden\":\"false\"},{\"Key\":\"fromCity\",\"Name\":\"出发城市\",\"IsHidden\":\"false\"},{\"Key\":\"toCity\",\"Name\":\"到达城市\",\"IsHidden\":\"false\"}]}],\"LinkTypes\":[{\"Id\":\"Person_Person\",\"Name\":\"人际关系\",\"Color\":\"black\",\"Thickness\":\"3\",\"FromArrowType\":\"\",\"ToArrowType\":\"Standard\",\"Properties\":[{\"Key\":\"type\",\"Name\":\"类型\",\"IsHidden\":\"false\"},{\"Key\":\"relation\",\"Name\":\"关系\",\"IsHidden\":\"false\"}]},{\"Id\":\"Person_Airplane\",\"Name\":\"航空旅行\",\"Color\":\"blue\",\"Thickness\":\"1\",\"FromArrowType\":\"\",\"ToArrowType\":\"OpenTriangle\",\"Properties\":[{\"Key\":\"reason\",\"Name\":\"目的\",\"IsHidden\":\"false\"},{\"Key\":\"time\",\"Name\":\"时间\",\"IsHidden\":\"false\"}]}],\"Nodes\":[{\"Id\":\"Person_1\",\"NodeTypeId\":\"Person\",\"Image\":\"test/images/HS1.png\",\"PropertyValues\":[{\"Key\":\"name\",\"Value\":\"StellaPayneDiaz\"},{\"Key\":\"age\",\"Value\":\"35\"},{\"Key\":\"position\",\"Value\":\"CEO\"}]},{\"Id\":\"Person_2\",\"NodeTypeId\":\"Person\",\"Image\":\"test/images/HS2.png\",\"PropertyValues\":[{\"Key\":\"name\",\"Value\":\"LukeWarm\"},{\"Key\":\"age\",\"Value\":\"34\"},{\"Key\":\"position\",\"Value\":\"VPMarketing/Sales\"}]},{\"Id\":\"Airplane_1\",\"NodeTypeId\":\"Airplane\",\"Image\":\"test/images/Airplane.jpg\",\"PropertyValues\":[{\"Key\":\"no\",\"Value\":\"A110110\"},{\"Key\":\"fromCity\",\"Value\":\"北京\"},{\"Key\":\"toCity\",\"Value\":\"上海\"}]}],\"Links\":[{\"Id\":\"Person_Person_1\",\"FromId\":\"Person_1\",\"ToId\":\"Person_2\",\"LinkTypeId\":\"Person_Person\",\"PropertyValues\":[{\"Key\":\"type\",\"Value\":\"职场\"},{\"Key\":\"relation\",\"Value\":\"同事\"}]},{\"Id\":\"Person_Airplane_1\",\"FromId\":\"Person_1\",\"ToId\":\"Airplane_1\",\"LinkTypeId\":\"Person_Airplane\",\"PropertyValues\":[{\"Key\":\"reason\",\"Value\":\"旅行\"},{\"Key\":\"time\",\"Value\":\"2017/01/0112:00~2017/01/0114:20\"}]}]}";
        //string json = @"{"Layout": "TreeLayout","NodeTypes": [{"Id":"Person","Name":"人员", "DefaultImage":"test/images/default.png","Properties": [{"Key": "name","Name": "名称", "IsHidden": "false"},{"Key": "age","Name": "年龄", "IsHidden": "false"},{"Key": "position","Name": "职位", "IsHidden": "false"}]},{"Id":"Airplane","Name":"飞机", "DefaultImage":"test/images/Airplane.jpg","Properties": [{"Key": "no","Name": "编号", "IsHidden": "false"},{"Key": "fromCity","Name": "出发城市", "IsHidden": "false"},{"Key": "toCity","Name": "到达城市", "IsHidden": "false"}]}],"LinkTypes": [{"Id":"Person_Person", "Name": "人际关系","Color": "black","Thickness": "3","FromArrowType": "","ToArrowType": "Standard","Properties": [{"Key": "type","Name": "类型","IsHidden": "false"},{"Key": "relation","Name": "关系","IsHidden": "false"}]},{"Id":"Person_Airplane", "Name": "航空旅行","Color": "blue","Thickness": "1","FromArrowType": "","ToArrowType": "OpenTriangle","Properties": [{"Key": "reason","Name": "目的","IsHidden": "false"},{"Key": "time","Name": "时间","IsHidden": "false"}]}],"Nodes": [{"Id":"Person_1","NodeTypeId": "Person","Image": "test/images/HS1.png","PropertyValues": [{"Key": "name","Value": "Stella Payne Diaz"},{"Key": "age","Value": "35"},{"Key": "position","Value": "CEO"}]},{"Id":"Person_2","NodeTypeId": "Person","Image": "test/images/HS2.png","PropertyValues": [{"Key": "name","Value": "Luke Warm"},{"Key": "age","Value": "34"},{"Key": "position","Value": "VP Marketing/Sales"}]},{"Id":"Airplane_1","NodeTypeId": "Airplane","Image": "test/images/Airplane.jpg","PropertyValues": [{"Key": "no","Value": "A110110"},{"Key": "fromCity","Value": "北京"},{"Key": "toCity","Value": "上海"}]}],"Links": [{"Id":"Person_Person_1","FromId": "Person_1","ToId": "Person_2","LinkTypeId": "Person_Person","PropertyValues": [{"Key": "type","Value": "职场"},{"Key": "relation","Value": "同事"}]},{"Id":"Person_Airplane_1","FromId": "Person_1","ToId": "Airplane_1","LinkTypeId": "Person_Airplane","PropertyValues": [{"Key": "reason","Value": "旅行"},{"Key": "time","Value": "2017/01/01 12:00 ~ 2017/01/01 14:20"}]}]}";

        return inputJsonString;



    }
}