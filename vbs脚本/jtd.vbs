Option Explicit

ExchangeFile WScript.Arguments(0), WScript.Arguments(1), WScript.Arguments(2)

Sub ExchangeFile(src,dest,password)
	Dim taro,jtds,jtd
	If src = "-1" Then
		'销毁对象
		Set taro = CreateObject("JXW.Application")
        taro.Quit()
    Else
    	'处理密码
		If password="@##@" Then password=""
		Set taro = CreateObject("JXW.Application")
		On Error Resume Next
		'检测打开文件是否异常
		taro.Documents.Open src,password
		If Err.Number <> 0 Then
			'异常后销毁对象，重新打开
			taro.Quit()
			Set taro = CreateObject("JXW.Application")
			taro.Documents.Open src,password
		End If
		taro.Visible = False
		Set jtds = taro.Documents
		If jtds.Count > 0 Then
			For i = 0 To jtds.Count
				Set jtd = jtds(i+1)
				If src = (jtd.Path + jtd.Name) Then
					jtd.SaveAs dest, "", "", "", 10, ""
					Exit For
				End If
			Next
		End If
	End If
End Sub