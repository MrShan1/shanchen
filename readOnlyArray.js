function CustomArray() {
    Array.apply(this, arguments);
};

//CustomArray.prototype = new Array();

CustomArray.prototype.isReadOnly = false;

CustomArray.prototype.push = function (obj) {
    if (this.isReadOnly === false) {
        Array.prototype.push.apply(this, arguments);
    }
    else {
        console.error("不可添加，只读！")
    }
};

CustomArray.prototype.pop = function (obj) {
    if (this.isReadOnly === false) {
        Array.prototype.pop.apply(this, arguments);
    }
    else {
        console.error("不可删除，只读！")
    }
};

function Test() {
    this._children = new CustomArray();
    this._children.isReadOnly = true;
};

Test.prototype.addChild = function (obj) {
    this.children.isReadOnly = false;
    this.children.push(obj);
    this.children.isReadOnly = true;
};

Object.defineProperty(Test.prototype, "children", {
    get: function () {
        return this._children;
    },
    set: function () {
        console.error("不可编辑，只读！");
    }
});

var test = new Test();

test.addChild("1"); // 成功

test.children.push("1"); // 错误

test.children = null; // 错误