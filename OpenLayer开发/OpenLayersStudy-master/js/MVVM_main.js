/// <reference path="require-2.3.6.js" />
/// <reference path="knockout-3.4.2.debug.js" />

require.config({
    paths: {
        knockout: "/js/knockout-3.4.2.debug",
        jquery: "/js/jquery-3.3.1.min",
        text: "/js/text-2.0.15",
        //test: "/testWidget.html"
    },
    shim: {
        'text': {
            deps: ['knockout']
        }
    }
});

require(["knockout", "jquery", "text"], function (ko, $) {
    window.ko = ko;

    model = {
        param1: ko.observable(0),
        param2: ko.observable(0),
        doSum: function () {
            alert((+this.param1()) + (+this.param2()));
        }
    };

    //model.sum = ko.computed(function () {
    //    return (+this.param1()) + (+this.param2());
    //}, model),

    //ko.applyBindings(model);

    //ko.applyBindings(model, $("#container"));

    //ko.components.register("testwidget", {
    //    viewModel: function (params) {
    //        this.param1 = ko.observable(0);
    //        this.param2 = ko.observable(0);
    //        this.doSum = function () {
    //            alert((+this.param1()) + (+this.param2()));
    //        }
    //    },
    //    //viewModel: { instance: model },
    //    template:
    //        '<div>\
    //            <span>\
    //                <input type="text" data-bind="value:param1" />\
    //            </span>\
    //            <span>\
    //                <input type="text" data-bind="value:param2" />\
    //            </span>\
    //            <span>\
    //                <input type="button" data-bind="click:doSum" value="合计" />\
    //            </span>\
    //        </div> '
    //});

    ko.components.register("testwidget", {
        viewModel: { instance: model },
        template: { require: 'text!/testWidget.html' }
    });

    //ko.applyBindings({
    //    test:{
    //        param1: 1,
    //        param2: 2
    //    }
    //});

    ko.applyBindings();

    //ko.applyBindings();

    //ko.applyBindings(model, $("#testWidget")[0]);

    //ko.components.get("testWidget", function () { });

    //$.getJSON("/testWidget.html", null, function (html) {
    //    $("#container2").html(html);
    //});
});