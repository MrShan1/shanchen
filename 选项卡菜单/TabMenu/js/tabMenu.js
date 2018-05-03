/// <reference path="jquery.min.js" />

(function () {
    $(".vis_tabHeader ul li").click(function () {
        var mode = $(".vis_top").data("mode");

        if (mode === 1) {
            showMenu(this);
        }
        else if (mode === 2) {
            changeTopMode(3);

            showMenu(this);
        }
        else if (mode === 3) {
            var group = $(this).data("group");
            var tabMenu = $(".vis_tabMenuList").find(".vis_tabMenu[data-group='" + group + "']")[0];
            if (tabMenu && $(tabMenu).css("display") !== "none") {
                changeTopMode(2);
            }
            else {
                showMenu(this);
            }
        }
    });

    $("#hideMenu").click(function () {
        var mode = $(".vis_top").data("mode");

        if (mode === 1) {
            changeTopMode(2);
        }
        else {
            changeTopMode(1);
        }
    });

    $(document).click(function (e) {
        var model = $(".vis_top").data("mode");
        if ($(e.target).parents('.vis_top').length === 0 && model === 3) {
            changeTopMode(2);
        }
    });

    function showMenu(tab) {
        hideAllMenus();

        $(tab).addClass("selected");

        var group = $(tab).data("group");
        $(".vis_top").data("lastGroup", group);

        var tabMenu = $(".vis_tabMenuList").find(".vis_tabMenu[data-group='" + group + "']")[0];
        if (tabMenu) {
            $(tabMenu).css("display", "block");
        }
    };

    function hideMenu(tab) {
        $(tab).removeClass("selected");

        var group = $(tab).data("group");

        var tabMenu = $(".vis_tabMenuList").find(".vis_tabMenu[data-group='" + group + "']")[0];
        if (tabMenu) {
            $(tabMenu).css("display", "none");
        }
    };

    function hideAllMenus() {
        $(".vis_tabHeader ul li").each(function () {
            hideMenu(this);
        });
    };

    function changeTopMode(val) {
        $(".vis_top").data("mode", val);

        if (val === 1) {
            $(".vis").css("padding-top", "103px");

            $(".vis_top").removeClass("vis_float");

            $("#hideMenu a i").removeClass("svg_jiantouxiangxia");
            $("#hideMenu a i").removeClass("svg_tuding");
            $("#hideMenu a i").addClass("svg_jiantouxiangshang");

            var group = $(".vis_top").data("lastGroup");
            var tab = $(".vis_tabHeader ul li[data-group='" + group + "']");
            showMenu(tab);
        }
        else if (val === 2) {
            $(".vis").css("padding-top", "33px");

            $(".vis_top").removeClass("vis_float");

            $("#hideMenu a i").removeClass("svg_jiantouxiangshang");
            $("#hideMenu a i").removeClass("svg_tuding");
            $("#hideMenu a i").addClass("svg_jiantouxiangxia");

            hideAllMenus();
        }
        else if (val === 3) {
            $(".vis_top").addClass("vis_float");

            $("#hideMenu a i").removeClass("svg_jiantouxiangshang");
            $("#hideMenu a i").removeClass("svg_jiantouxiangxia");
            $("#hideMenu a i").addClass("svg_tuding");
        }
    };

    $(".vis_tabHeader ul li[data-group='1']").click();
})();