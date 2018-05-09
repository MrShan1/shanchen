/// <reference path="go-debug-1.8.7.js" />

/**
* 环形树布局的构造函数
*/
function CircleTreeLayout() {
    go.Layout.call(this);
};

// 环形树布局继承基类布局的所有属性和方法
go.Diagram.inherit(CircleTreeLayout, go.Layout);