﻿<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib prefix="c" uri="/WEB-INF/tld/c.tld"%>
<%@ taglib prefix="fn" uri="/WEB-INF/tld/fn.tld"%>
<link rel="stylesheet" type="text/css" href="${basePath }/static/${assetVersion }/styles/cdr/visualizationNew/index.css">
<link rel="stylesheet" type="text/css" href="${basePath }/static/${assetVersion }/styles/cdr/visualizationNew/menuResize.css">
<!-- <link rel="stylesheet" type="text/css" href="${basePath }/static/${assetVersion }/styles/cdr/visualizationNew/iconfonts/iconfont.css"> -->
<script type="text/javascript" src="${basePath }/static/${assetVersion }/scripts/cdr/visualizationNew/index.js"></script>
<script type="text/javascript" src="${basePath }/static/${assetVersion }/scripts/cdr/visualizationNew/go-debug-1.8.7.js"></script>
<script type="text/javascript" src="${basePath }/static/${assetVersion }/scripts/cdr/visualizationNew/DragZoomingTool.js"></script>
<script type="text/javascript" src="${basePath }/static/${assetVersion }/scripts/cdr/visualizationNew/VisualizationTool.js"></script>
<script type="text/javascript" src="${basePath }/static/${assetVersion }/scripts/cdr/visualizationNew/visualization.js"></script>
<script type="text/javascript" src="${basePath }/static/${assetVersion }/scripts/cdr/visualizationNew/testLoadData.js"></script>
<script type="text/javascript" src="${basePath }/static/${assetVersion }/scripts/cdr/visualizationNew/visualizationStatisticalAnalysis.js"></script>
<script type="text/javascript" src="${basePath }/static/${assetVersion }/scripts/cdr/visualizationNew/visualizationJudgeEntityData.js"></script>
<script type="text/javascript" src="${basePath }/static/${assetVersion }/scripts/cdr/visualizationNew/visualizationNodeLinkHandle.js"></script>
<script type="text/javascript" src="${basePath }/static/${assetVersion }/scripts/cdr/visualizationNew/menuResize.js"></script>
<div style="height:100%; width:100%; position:absolute;top:0;">
	<div class="center">
		<!-- 可视化图标菜单 -->
		<div class="top clearfix bb bg-gray-5">
			<!-- <a class="iconfont icon-leibie f20 liebie-ksh-icon" style="margin-top:10px;"></a> -->
			<div class="fl  ml_5 mr_5 re f_12" style=" width: 10px; padding: 5px; color: #6f7a89;">布局</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re" title="布局切换&#13;&#13;切换视图的整体布局。">
				<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh11.png" /> -->
				<span>
					<i class="iconfont icon-jiegou2 icon-func"></i><i class="iconfont icon-jiantou icon-arrow"></i>
				</span>
				<div class="ksh_menu ab border br3 white-bg b-shadow" style="display: none;">
					<!-- <p class="bb h-c" id="layout1" title="视图整体切换为环形布局。">
						<i class="iconfont icon-huanxingbuju f22 vm mr5"></i>环形布局
					</p> -->
					<p class="bb h-c" id="layout1" title="视图整体切换为环形布局。">
						<i class="iconfont icon-huanxingbuju mr5"></i>环形布局
					</p>
					<p class="bb h-c" id="layout2" title="视图整体切换为力导向布局。">
						<i class="iconfont icon-guanxitu mr5"></i>力导向布局
					</p>
					<!-- <p id="layout3" >层次有向布局</p> -->
					<p class="bb h-c" id="layout4" title="视图整体切换为网格布局。">
						<i class="iconfont icon-plus-gridview mr5"></i>网格布局
					</p>
					<p class="bb h-c" id="layout5" title="视图整体切换为网格布局。">
						<i class="iconfont icon-shuzhuangtu mr5"></i>树形布局
					</p>
				</div>
			</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re" title="统一布局&#13;&#13;按照当前布局，对整个视图重新布局。" id="initializeLayout">
				<i class="iconfont icon-guihua icon-func"></i>
				<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh12.png" /> -->
			</div>
			<div class="fl  ml_5 mr_5 re f_12" style="border-left: 1px #cfd0d2 solid; width: 10px; padding: 5px; color: #6f7a89;">常用</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re" title="快速选择&#13;&#13;以多种方式一键选择视图中的元素。">
				<span>
					<i class="iconfont icon-xuanze icon-func"></i> <i class="iconfont icon-jiantou icon-arrow"></i>
				</span>
				<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh23.png" /> -->
				<div class="ksh_menu ab border br3 white-bg b-shadow" style="display: none;">
					<p class="bb h-c" id="selectionWay1" title="直接选中视图中的所有节点。">选择全部节点</p>
					<p class="bb h-c" id="selectionWay2" title="直接选中视图中的所有链接。">选择全部链接</p>
					<p class="bb h-c" id="selectionWay3" title="选择一个或多个节点作为目标，点击此按钮，选中所有与目标同类型的节点。">选择同类型节点</p>
					<p class="bb h-c" id="selectionWay4" title="选择一个或多个链接作为目标，点击此按钮，选中所有与之同类型的链接。">选择同类型链接</p>
					<p class="bb h-c" id="selectionWay5" title="选择一个或多个节点作为目标，点击此按钮，选中与目标相连的链接以及另一端的节点。">选择节点直接关系</p>
					<p class="bb h-c" id="selectionWay6" title="选择一个或多个链接作为目标，点击此按钮，选中目标两端的节点。">选择链接直接关系</p>
					<p class="bb h-c" id="selectionWay7" title="直接选中视图中的所有节点和链接。 (Ctrl + A)">选择全部</p>
					<p class="bb h-c" id="selectionWay8" title="反向选择视图中的节点，选中非选中状态的节点，并使选中状态的节点非选中。">反向选择节点</p>
					<p class="bb h-c" id="selectionWay9" title="反向选择视图中的链接，选中非选中状态的链接，并使选中状态的链接非选中。">反向选择链接</p>
					<p class="bb h-c" id="selectionWay10" title="反向选择视图中的节点和链接，选中非选中状态的节点或链接，并使选中状态的节点或链接非选中。">反向选择</p>
				</div>
			</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re switch group" title="高亮分析&#13;&#13;高亮节点的直接关系。" id="highlightRelation">
				<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh26.png" /> -->
				<i class="iconfont icon-dengpao icon-func" style="font-size: 23px;"></i>
			</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re switch group" title="路径分析&#13;&#13;分析节点之间的路径关系。" id="analysisPath">
				<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh27.png" /> -->
				<span>
					<i class="iconfont icon-lujingfenxi  icon-func" style="font-size: 20px;"></i>
				</span>
				<div class="ksh_menu ab border br3 white-bg b-shadow" style="display: none;">
					<p class="bb h-c" title="选择2个节点后，自动选中起始点至结束点的最短路径。">
						<label class="pointer"><input type="radio" name="analysisPath" onclick="toggleAnalysisPathMode(0, false)" checked>两点最短路径</label>
					</p>
					<p class="bb h-c" title="选择2个节点后，自动选中起始点至结束点的所有路径(6层内)。">
						<label class="pointer"><input type="radio" name="analysisPath" onclick="toggleAnalysisPathMode(0, true)">两点全部路径(6层内)</label>
					</p>
					<p class="bb h-c" title="选择3个节点后(第1个为起始点，第2个为结束点，第3个为中间点)，&#13;自动选中起始点经过中间点，至结束点的最短路径(6层内)。">
						<label class="pointer"><input type="radio" name="analysisPath" onclick="toggleAnalysisPathMode(1, false)">三点最短路径(6层内)</label>
					</p>
					<p class="bb h-c" title="选择3个节点后(第1个为起始点，第2个为结束点，第3个为中间点)，&#13;自动选中起始点经过中间点，至结束点的所有路径(6层内)。">
						<label class="pointer"><input type="radio" name="analysisPath" onclick="toggleAnalysisPathMode(1, true)">三点全部路径(6层内)</label>
					</p>
				</div>
			</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re" title="隐藏与显示&#13;&#13;隐藏或显示视图元素。">
				<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh33.png" /> -->
				<span>
					<i class="iconfont icon-yincang icon-func" style="font-size: 24px;"></i><i class="iconfont icon-jiantou icon-arrow"></i>
				</span>
				<div class="ksh_menu ab border br3 white-bg b-shadow" style="display: none;">
					<p class="bb h-c" id="hideSelectedParts" title="隐藏视图中的选中的节点和链接。">隐藏选中部分</p>
					<p class="bb h-c" id="hideUnselectedParts" title="隐藏视图中的非选中的节点和链接。">隐藏非选中部分</p>
					<p class="bb h-c" id="showHiddenParts" title="显示视图中隐藏的节点和链接。">显示隐藏部分</p>
				</div>
			</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re" title="添加与删除&#13;&#13;添加或删除视图元素。">
				<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh34.png" /> -->
				<span>
					<i class="iconfont icon-xinzeng  icon-func" style="font-size: 20px;"></i><i class="iconfont icon-jiantou icon-arrow"></i>
				</span>
				<div class="ksh_menu ab border br3 white-bg b-shadow" style="display: none;">
					<p class="bb h-c" id="addNode" title="向视图中添加一个自定义节点。" onclick="addNodesClick()">添加节点</p>
					<p class="bb h-c" id="addLink" title="向视图中添加一个自定义链接。" onclick="addLinkClick()">添加链接</p>
					<p class="bb h-c" id="delSelected" title="删除视图中的选中的节点和链接。 (Delete)" onclick="deleteSelectNodesLinks()">删除选中部分</p>
				</div>
			</div>
			<div class="fl  ml_5 mr_5 re f_12" style="border-left: 1px #cfd0d2 solid; width: 10px; padding: 5px; color: #6f7a89;">缩放</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re switch group" title="放大镜&#13;&#13;放大局部视图。" id="showMagnifier">
				<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh29.png" /> -->
				<i class="iconfont icon-fangda icon-func"></i>
			</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re" title="合适尺寸 (Shift + Z)&#13;&#13;调整视图的缩放比例，使视图上所有对象都能在容器内显示。" id="uniformScale">
				<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh13.png" /> -->
				<i class="iconfont icon-quanping icon-func"></i>
			</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re switch" title="网格显示&#13;&#13;显示背景网格，使节点以网格为单位进行移动，&#13;方便节点位置对齐。" id="showGridLine">
				<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh16.png" /> -->
				<i class="iconfont icon-plus-gridview icon-func"></i>
			</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re" title="选择定位 (Space)&#13;&#13;调整视图的显示范围，移动至选中节点所在区域。" id="centerSelection">
				<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh15.png" /> -->
				<i class="iconfont icon-xuanzedingwei icon-func"></i>
			</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re switch" title="全景视图&#13;&#13;显示全景视图。" id="showOverview">
				<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh17.png" /> -->
				<i class="iconfont icon-quanjingshitu icon-func"></i>
			</div>
			<a class="iconfont icon-leibie f20 liebie-ksh-icon" style="margin-top:10px;"></a>
			<section class="section fl">
				<div class="fl  ml_5 mr_5 re f_12" style="border-left: 1px #cfd0d2 solid; width: 10px; padding: 5px; color: #6f7a89;">标注</div>
				<div class="fl pointer ml_5 mr_5 ksh_icon re" title="节点颜色设置&#13;&#13;改变选中节点的背景颜色。">
					<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh21.png" /> -->
					<span>
						<i class="iconfont icon-youqitong icon-func" style="font-size: 24px;"></i><i class="iconfont icon-jiantou icon-arrow"></i>
					</span>
					<div class="ksh_menu ab border br3 white-bg b-shadow" style="display: none;">
						<p class="bb h-c" id="color1" title="">灰色(默认)</p>
						<p class="bb h-c" id="color2" title="">红色(1级)</p>
						<p class="bb h-c" id="color3" title="">橙色(2级)</p>
						<p class="bb h-c" id="color4" title="">蓝色(3级)</p>
						<p class="bb h-c" id="color5" title="">绿色(4级)</p>
					</div>
				</div>
				<div class="fl pointer ml_5 mr_5 ksh_icon re" title="节点图形设置&#13;&#13;改变选中节点的背景形状。">
					<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh22.png" /> -->
					<span>
						<i class="iconfont icon-jiediantuxing icon-func" style="font-size: 29px;"></i><i class="iconfont icon-jiantou icon-arrow"></i>
					</span>
					<div class="ksh_menu ab border br3 white-bg b-shadow" style="display: none;">
						<p class="bb h-c" id="shape1" title="">矩形</p>
						<p class="bb h-c" id="shape2" title="">圆形</p>
						<p class="bb h-c" id="shape3" title="">五角形</p>
						<p class="bb h-c" id="shape4" title="">云型</p>
					</div>
				</div>
				<div class="fl  ml_5 mr_5 re f_12" style="border-left: 1px #cfd0d2 solid; width: 10px; padding: 5px; color: #6f7a89;">操作</div>
				<div class="fl pointer ml_5 mr_5 ksh_icon re" title="撤销操作 (Ctrl + Z)&#13;&#13;撤销当前操作。" id="undoOperation">
					<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh31.png" /> -->
					<i class="iconfont icon-houtui icon-func"></i>
				</div>
				<div class="fl pointer ml_5 mr_5 ksh_icon re" title="恢复操作 (Ctrl + Y)&#13;&#13;恢复上一步操作。" id="redoOperation">
					<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh32.png" /> -->
					<i class="iconfont icon-houtui  icon-func" style="transform: scaleX(-1)"></i>
				</div>
				<div class="fl pointer ml_5 mr_5 ksh_icon re" title="导出打印&#13;&#13;将视图导出为图片或进行打印。">
					<!-- <img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh22.png" /> -->
					<span>
						<i class="iconfont icon-daochu1 icon-func" style="font-size: 23px;"></i><i class="iconfont icon-jiantou icon-arrow"></i>
					</span>
					<div class="ksh_menu output-ksh ab border br3 white-bg b-shadow" style="display: none;">
						<p class="bb h-c h-c-span" title="将视图导出为高清图片。" onclick="saveDiagramAsImage()">
							<i class="iconfont icon-tupian mr5"></i>导出图片
						</p>
						<p class="bb h-c h-c-span" title="调用浏览器打印功能，对视图进行打印。" onclick="printDiagram()">
							<i class="iconfont icon-dayin mr5"></i>打印视图
						</p>
					</div>
				</div>
			</section>
			<!-- <div class="fl  ml_5 mr_5 re f_12" style="border-left: 1px #cfd0d2 solid; width: 10px; padding: 5px; color: #6f7a89;">查找</div>
			<div class="fl  ml_5 mr_5 re" style="padding: 5px;">
				<input id="searchInputText" type="text" style="width:120px; border-radius: 3px 0px 0px 3px; padding:0px 5px;" />
				<input id="searchCountText" type="text" readonly value="第0个，共0个"
					style="width: 100px; border-radius: 0px 3px 3px 0px;  margin-left: -4px; color:gray; text-align:right;padding:0px 5px; background-color: #f7f7f7;">
			</div>
			<div class="fl pointer ml_5 mr_5 ksh_icon re" style="margin-left: -7px;" title="文本检索&#13;&#13;检索视图上所有的文本信息。" id="searchText">
				<img src="${basePath}/static/${assetVersion}/styles/cdr/images/ksh18.png" />
				<i class="iconfont icon-sousuo icon-func"></i>
			</div> -->
			<!-- 	<a class="iconfont icon-leibie f20 liebie-ksh-icon" style="margin-top:10px;"></a>
			<section class="section fl"></section> -->
		</div>
		<!-- 放置可视化控件div -->
		<div class="middle clearfix" style="background-color:transparent;">
			<div class="diagram" id="diagramDiv"></div>
			<div class="magnifier" id="magnifierDiv"></div>
			<div class="overview" id="overviewDiv"></div>
			<!-- 节点环形菜单 -->
			<div class="huan-box fix" style="width: 200px; height: 200px;top:100px;left: 200px; display:none; z-index:101" id="nodeContextMenu">
				<div class="right-key-huan right-key-huan1">
					<dl class="huan-icon ab al-c" style="top: 0;left:20px;">
						<dt>
							<i class="iconfont icon-shuzhuangtu f22 white"></i>
						</dt>
						<dd class="white f12">关系</dd>
					</dl>
					<!-- 二级拓展 -->
					<div>
						<div class="huan-second huan-second-1 al-c function-button" id="getCallRelations">
							<dl class="ab huan-second-dl huan-second-dl">
								<dt>
									<i class="iconfont icon-dianhua f18 white"></i>
								</dt>
								<dd class="white f14">电话通联</dd>
							</dl>
						</div>
						<div class="huan-second huan-second-2 al-c function-button" id="getMessageRelations">
							<dl class="ab huan-second-dl huan-second-dl">
								<dt>
									<i class="iconfont icon-pinglun2 f18 white"></i>
								</dt>
								<dd class="white f14">短信通联</dd>
							</dl>
						</div>
					</div>
				</div>
				<div class="right-key-huan right-key-huan2 function-button" id="selectNodeRelation">
					<dl class="huan-icon ab al-c" style="top: 2px;">
						<dt>
							<i class="iconfont icon-liangdianzuiduanlujing f20 white"></i>
						</dt>
						<dd class="white f12">直接关系</dd>
					</dl>
				</div>
				<div class="right-key-huan right-key-huan3 function-button" id="nodeJudgeId">
					<dl class="huan-icon ab al-c" style="top: 5px;">
						<dt>
							<i class="iconfont icon-qingbaoyanpan f16 white"></i>
						</dt>
						<dd class="white f12">详情研判</dd>
					</dl>
				</div>
				<div class="right-key-huan right-key-huan4 function-button" id="deleteNode">
					<dl class="huan-icon ab al-c rotate90-" style="top: 3px;left: 24px;">
						<dt>
							<i class="iconfont icon-cuowu3 f20 white"></i>
						</dt>
						<dd class="white f12">删除</dd>
					</dl>
				</div>
			</div>
			<!-- 链接环形菜单 -->
			<div class="huan-box fix" style="width: 200px; height: 200px;top:100px;left: 200px; display:none; z-index:101" id="linkContextMenu">
				<div class="right-key-huan right-key-huan1 function-button">
					<dl class="huan-icon ab al-c" style="top: 0;" id="selectLinkRelation">
						<dt>
							<i class="iconfont icon-liangdianzuiduanlujing f20 white"></i>
						</dt>
						<dd class="white f12">直接关系</dd>
					</dl>
				</div>
				<div class="right-key-huan right-key-huan2 function-button" id="linkJudgeId">
					<dl class="huan-icon ab al-c" style="top: 5px;">
						<dt>
							<i class="iconfont icon-qingbaoyanpan f16 white"></i>
						</dt>
						<dd class="white f12">详情研判</dd>
					</dl>
				</div>
				<div class="right-key-huan right-key-huan3 function-button" id="deleteLink">
					<dl class="huan-icon ab al-c" style="top: 0;">
						<dt>
							<i class="iconfont icon-cuowu3 f20 white"></i>
						</dt>
						<dd class="white f12">&nbsp;&nbsp;&nbsp;&nbsp;删除&nbsp;&nbsp;&nbsp;&nbsp;</dd>
					</dl>
				</div>
			</div>
			<!-- 状态栏 -->
			<div class="status-panel">
				<li class="status-panel-item ">
					节点数: <label id="nodesCount">NaN</label>
				</li>
				<li class="status-panel-item ">
					链接数: <label id="linksCount">NaN</label>
				</li>
				<li class="status-panel-item ">
					缩放比例: <label id="diagramScale">NaN</label>
					<a class="al-c pt5 pb5 pl pr bg br3 f16 white" title="缩小视图。 (Ctrl + -)" id="decreaseScale">-</a>
					<a class="al-c pt5 pb5 pl pr bg br3 f16 white" title="放大视图。 (Ctrl + +)" id="increaseScale" style="padding: 5px 7px;">+</a>
				</li>
				<li class="status-panel-item " style="visibility: hidden; min-width: 1px; padding: 0px;">
					<a class="al-c pt5 pb5 pl pr bg br3 f16 white" id="statusSwitch"
						style="visibility: visible; padding: 6px 3px; margin: 0; background-color: #797979;">></a>
				</li>
			</div>
			<div class="white-bg fix br3 border alert b-shadow o-hidden node-input" style="display: none; z-index:100">
				<h3 class="padding10 f16 bb bg white">
					<span class="white">添加实体</span>
					<a class="iconfont icon-cuowu3 fr white" onclick="toHideOther('node-input')"></a>
				</h3>
				<div class="padding10 empty-con" id="cdr_add_node_input_content">
					<label class="al-r mb15" style="width: 80px;display:none;">实体类型：</label>
					<!-- <input type="text" class="br3 w25" id="entityTypeId"> -->
					<select class="br3 w25" id="entityTypeId" style="display:none;">
						<!-- <option value="phoneEntity">电话号码</option> -->
					</select> <label class="al-r mb15" style="width: 80px;display:none;">要素类型：</label>
					<!-- <input type="text" class="br3 w25" id ="factorTypeId"> -->
					<select class="br3 w25" style="display:none;" id="factorTypeId">
						<!-- <option value="phoneFactor">电话号码</option> -->
					</select> <label class="al-r mb15" style="width: 80px;">电话号码：</label>
					<input type="text" class="br3 w25" id="factorDataId">
				</div>
				<div class="layout-ycy mb20 mt20 al-c">
					<a class="bg bton white btn-b br3" onclick="cdr_node_input_add_ok()">确&nbsp;定</a>
					<a class="bg bton white btn-b br3 ml" onclick="cdr_node_input_add_cancel()">取&nbsp;消</a>
				</div>
			</div>
			<div class="white-bg fix br3 border alert b-shadow o-hidden link-input" style="display: none; z-index:100">
				<h3 class="padding10 f16 bb bg white">
					<span class="white">添加链接</span>
					<a class="iconfont icon-cuowu3 fr white" onclick="toHideOther('link-input')"></a>
				</h3>
				<div class="padding10 empty-con" id="cdr_add_link_input_content">
					<label class="al-r mb15" style="width: 80px;display:none;">链接类型：</label>
					<!-- <input type="text" class="br3 w25" id="linkTypeId"> -->
					<select class="br3 w25" id="linkTypeId" style="display:none;">
						<option value="callLink">通话关系</option>
					</select> <label class="al-r mb15" style="width: 80px;">自定义：</label>
					<input type="text" class="br3 w25" id="linkDataId">
				</div>
				<div class="layout-ycy mb20 mt20 al-c">
					<a class="bg bton white btn-b br3" onclick="cdr_link_input_add_ok()">确&nbsp;定</a>
					<a class="bg bton white btn-b br3 ml" onclick="cdr_link_input_add_cancel()">取&nbsp;消</a>
				</div>
			</div>
		</div>
	</div>
</div>
<script>
	$(function() {
		if (!visTool) {
			// 初始化可视化工具
			initTool();
		}
	})
</script>