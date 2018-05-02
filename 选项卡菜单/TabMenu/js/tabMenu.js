/// <reference path="jquery.min.js" />

(function () {
    $(".vis_tabButton").click(function () {
        var group = $(this).data("group");
        var tabMenu = $(this).parents(".vis_top").find(".vis_tabMenu[data-group='" + group + "']")[0];

        $(tabMenu).css("display", "block");
        $(tabMenu).siblings(".vis_tabMenu").css("display", "none");
    });
})();