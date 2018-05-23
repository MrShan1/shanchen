<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Text;

public class Handler : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        HttpResponse res = context.Response;
        context.Response.ContentType = "application/json";

        string appPath = System.AppDomain.CurrentDomain.BaseDirectory;
        string filePath = @"json\Test.txt";
        string fullPath = System.IO.Path.Combine(appPath, filePath);

        //StreamReader file = new StreamReader(fullPath);
        //string content = file.ReadToEnd();
        //res.Write(content);

        string jsonStr = "";

        using (StreamReader file = new StreamReader(fullPath, Encoding.Default))
        {
            while (true)
            {
                string sLine = file.ReadLine();
                if (sLine == null)
                {
                    break;
                }
                sLine = sLine.Replace("\n", string.Empty).Replace("\r", string.Empty);
                jsonStr = jsonStr + sLine;
            }
        }
        

        //string s = System.IO.File.ReadAllText(fullPath, System.Text.Encoding.UTF8);

        //string jsonText = @"[{'a':'aaa','b':'bbb','c':'ccc'},{'a':'aa','b':'bb','c':'cc'}]";

        //var jData = JArray.Parse(jsonStr);
        var jData = JObject.Parse(jsonStr);

        context.Response.Write(jData);

        context.Response.End();
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}