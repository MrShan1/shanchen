<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Text;
using Microsoft.Office.Interop.Excel;
using System.Reflection;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;

public class Handler : IHttpHandler
{
    [DllImport("User32.dll", CharSet = CharSet.Auto)]
    public static extern int GetWindowThreadProcessId(IntPtr hwnd, out int ID);

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";

        HttpPostedFile file = context.Request.Files[0];
        string path = file.FileName;
        string pathInServer = System.AppDomain.CurrentDomain.BaseDirectory + path;
        file.SaveAs(pathInServer);

        try
        {
            Application excel = new Application();
            excel.Visible = false;
            excel.DisplayAlerts = false;
            excel.AlertBeforeOverwriting = false;

            Workbook book = excel.Workbooks.Open(pathInServer,
                Missing.Value, Missing.Value, Missing.Value, Missing.Value, Missing.Value,
                Missing.Value, Missing.Value, Missing.Value, Missing.Value, Missing.Value,
                Missing.Value, Missing.Value, Missing.Value, Missing.Value);

            try
            {
                List<string> mainEntities = new List<string>();

                foreach (Worksheet sheet in book.Worksheets)
                {
                    if (sheet.Name == "NODES")
                    {
                        string nodesEntity = CreateMainEntityFromSheet(sheet, "NODES", 2);
                        mainEntities.Add(nodesEntity);
                    }
                    else if (sheet.Name == "LINKS")
                    {
                        string linksEntity = CreateMainEntityFromSheet(sheet, "LINKS", 3);
                        mainEntities.Add(linksEntity);
                    }
                }

                string jsonDataStr = CreateEntity(mainEntities);

                //var jData = JArray.Parse(jsonStr);
                var jData = JObject.Parse(jsonDataStr);

                context.Response.Write(jData);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                book.Save();
                excel.Quit();

                killExcel(excel);

                //System.Runtime.InteropServices.Marshal.ReleaseComObject(r);
                //System.Runtime.InteropServices.Marshal.ReleaseComObject(book);
                //System.Runtime.InteropServices.Marshal.ReleaseComObject(excel);
                //GC.Collect();

                context.Response.End();
            }
        }
        catch (Exception)
        {

            throw;
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    /// <summary>
    /// 解析sheet数据,生成主节点
    /// </summary>
    /// <param name="sheet"></param>
    /// <param name="key"></param>
    /// <param name="staticPropertyCount"></param>
    /// <returns></returns>
    private string CreateMainEntityFromSheet(Worksheet sheet, string entityKey, int staticPropertyCount)
    {
        Range tableName = (Range)sheet.Cells[1, 1];

        if (tableName.Text == null || string.IsNullOrWhiteSpace(tableName.Text.ToString()))
        {
            throw new Exception("未找到表！");
        }

        int rowCount = sheet.UsedRange.Rows.Count;
        int colCount = sheet.UsedRange.Columns.Count;

        List<string> keys = new List<string>();
        List<string> names = new List<string>();
        for (int col = 2; col <= colCount; col++)
        {
            string key = ((Range)sheet.Cells[2, col]).Text.ToString();
            if (string.IsNullOrWhiteSpace(key) == true)
            {
                break;
            }

            keys.Add(key);

            string name = ((Range)sheet.Cells[3, col]).Text.ToString();
            names.Add(name);
        }

        List<string> mainEntityItems = new List<string>();

        for (int i = 4; i <= rowCount; i++)
        {
            List<string> mixedProperties = new List<string>();

            for (int j = 0; j < staticPropertyCount; j++)
            {
                string key = keys[j];
                string value = ((Range)sheet.Cells[i, j + 2]).Text.ToString();
                string staticProperty = CreateProperty(key, value);
                mixedProperties.Add(staticProperty);
            }

            List<string> propertyValueEntities = new List<string>();
            for (int j = staticPropertyCount; j < keys.Count; j++)
            {
                string key = keys[j];
                string name = names[j];
                string value = ((Range)sheet.Cells[i, j + 2]).Text.ToString();
                string propertyValueEntity = null;
                if (j == staticPropertyCount)
                {
                    propertyValueEntity = CreateDynamicEntity(key, name, value, false);
                }
                else
                {
                    propertyValueEntity = CreateDynamicEntity(key, name, value, true);
                }

                propertyValueEntities.Add(propertyValueEntity);
            }

            string propertyValuesEntityColl = CreateEntityCollection("PropertyValues", propertyValueEntities);
            mixedProperties.Add(propertyValuesEntityColl);

            string mainEntityItem = CreateEntity(mixedProperties);

            mainEntityItems.Add(mainEntityItem);
        }

        string mainEntity = CreateEntityCollection(entityKey, mainEntityItems);

        return mainEntity;
    }

    /// <summary>
    /// 创建一般属性
    /// </summary>
    /// <param name="key"></param>
    /// <param name="value"></param>
    /// <returns></returns>
    private string CreateProperty(string key, string value)
    {
        return string.Format("'{0}':'{1}'", key, value);
    }

    /// <summary>
    /// 创建动态实体
    /// </summary>
    /// <param name="key"></param>
    /// <param name="name"></param>
    /// <param name="value"></param>
    /// <returns></returns>
    private string CreateDynamicEntity(string key, string name, string value, bool isHidden)
    {
        if (isHidden)
        {
            return string.Format("{{'Key':'{0}', 'Name':'{1}', 'Value':'{2}', 'IsHidden':'true'}}", key, name, value);
        }
        else
        {
            return string.Format("{{'Key':'{0}', 'Name':'{1}', 'Value':'{2}', 'IsHidden':'false'}}", key, name, value);
        }
    }

    /// <summary>
    /// 创建实体
    /// </summary>
    /// <param name="properties"></param>
    /// <returns></returns>
    private string CreateEntity(List<string> properties)
    {
        string entity = "{";

        foreach (string property in properties)
        {
            entity += property + ",";
        }

        if (entity.Length > 1)
        {
            entity = entity.TrimEnd(',');
        }

        entity += "}";

        return entity;
    }

    /// <summary>
    /// 创建实体集合
    /// </summary>
    /// <param name="key"></param>
    /// <param name="entities"></param>
    /// <returns></returns>
    private string CreateEntityCollection(string key, List<string> entities)
    {
        string entitiesStr = "[";

        foreach (string entity in entities)
        {
            entitiesStr += entity + ",";
        }

        if (entitiesStr.Length > 1)
        {
            entitiesStr = entitiesStr.TrimEnd(',');
        }

        entitiesStr += "]";

        return string.Format("'{0}':{1}", key, entitiesStr);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="excel"></param>
    private static void killExcel(Microsoft.Office.Interop.Excel._Application excel)
    {
        try
        {
            Process[] ps = Process.GetProcesses();
            IntPtr t = new IntPtr(excel.Hwnd); //得到这个句柄，具体作用是得到这块内存入口  
            int ExcelID = 0;
            GetWindowThreadProcessId(t, out ExcelID); //得到本进程唯一标志k  
            foreach (Process p in ps)
            {
                if (p.ProcessName.ToLower().Equals("excel"))
                {
                    if (p.Id == ExcelID)
                    {
                        p.Kill();
                    }
                }
            }
        }
        catch (Exception ex)
        {
            throw;
        }
    }
}