/// <reference path="jquery.min.js" />

(function () {
    $(".vis_tabHeader ul li").click(function () {
        $(this).siblings("li").removeClass("selected");
        $(this).addClass("selected");
        $(".vis_tabMenuList").find(".vis_tabMenu").css("display", "none");

        var group = $(this).attr("group");
        var tabMenu = $(".vis_tabMenuList").find(".vis_tabMenu[group='" + group + "']")[0];
        if (tabMenu) {
            $(tabMenu).css("display", "block");
        }
    });

    $("#hideMenu").click(function () {
        $("#hideMenu a i").toggleClass("svg_jiantouxiangxia");


    });

    $(".vis_tabHeader ul li[group='1']").click();
})();