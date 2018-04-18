Option Explicit

msgbox "开始",0,"标题"
Dim src,dest,taro,doc,index,document,fullPath

src = "C:\Users\cr\Documents\Visual Studio 2013\Projects\WindowsApplication1\WindowsApplication1\JTD1\test - 副本 (2).jtd"
dest = "C:\Users\cr\Documents\Visual Studio 2013\Projects\WindowsApplication1\WindowsApplication1\TXT1\test - 副本 (2).txt"

Set taro = CreateObject("JXW.Application")

taro.Documents.Open src,""

Set doc = taro.Documents

For index = 1 To doc.Count
	Set document = doc(index)
	fullPath = document.Path & document.Name
	
	'msgbox fullPath

	If src = fullPath Then
		document.SaveAs dest, "", "", "", 10, ""
		Exit For
	End If
Next

taro.Quit()