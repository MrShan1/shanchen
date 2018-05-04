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

    $(".vis_scroll_left").click(function () {
        var tabMenu = $(this).parent(".vis_tabMenu");
        var scrollLeft = $(tabMenu).scrollLeft() - 100;

        $(tabMenu).scrollLeft(scrollLeft);

        moveScroll(tabMenu);
    });

    $(".vis_scroll_right").click(function () {
        var tabMenu = $(this).parent(".vis_tabMenu");
        var scrollLeft = $(tabMenu).scrollLeft() + 100;

        $(tabMenu).scrollLeft(scrollLeft);

        moveScroll(tabMenu);
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

            $("#hideMenu i").removeClass("svg_jiantouxiangxia");
            $("#hideMenu i").removeClass("svg_tuding");
            $("#hideMenu i").addClass("svg_jiantouxiangshang");

            var group = $(".vis_top").data("lastGroup");
            var tab = $(".vis_tabHeader ul li[data-group='" + group + "']");
            showMenu(tab);
        }
        else if (val === 2) {
            $(".vis").css("padding-top", "33px");

            $(".vis_top").removeClass("vis_float");

            $("#hideMenu i").removeClass("svg_jiantouxiangshang");
            $("#hideMenu i").removeClass("svg_tuding");
            $("#hideMenu i").addClass("svg_jiantouxiangxia");

            hideAllMenus();
        }
        else if (val === 3) {
            $(".vis_top").addClass("vis_float");

            $("#hideMenu i").removeClass("svg_jiantouxiangshang");
            $("#hideMenu i").removeClass("svg_jiantouxiangxia");
            $("#hideMenu i").addClass("svg_tuding");
        }
    };

    function moveScroll(tabMenu) {
        var leftScroll = $(tabMenu).find(".vis_scroll_left");
        var rightScroll = $(tabMenu).find(".vis_scroll_right");
        var scrollLeft = tabMenu[0].scrollLeft;
        var clientWidth = tabMenu[0].clientWidth;
        var scrollWidth = tabMenu[0].scrollWidth;

        if (scrollLeft === 0) {
            $(leftScroll).css("display", "none");
        }
        else if (scrollWidth <= Math.abs(scrollLeft) + clientWidth) {
            $(rightScroll).css("display", "none");
        }
        else {
            $(leftScroll).css("display", "block");
            $(rightScroll).css("display", "block");
        }

        $(leftScroll).css("left", scrollLeft);
        $(rightScroll).css("right", -scrollLeft);
    };

    $(".vis_tabHeader ul li[data-group='1']").click();
})();