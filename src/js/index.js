$(document).ready(function () {
    var resource_data = null;
    var resource = {
        init: function () {
            var _this = this;
            getAjax("sysuser", {}, function (data) {
                if (data.code == 0) {
                    resource_data = data.dataInfo.resources;
                    function_data = data.dataInfo.functions;
                    _this.render(resource_data);
                    util.Storage.set("item", JSON.stringify(function_data));
                }
            });
        },
        render: function (data) {
            var resources = "";
            var menu = "";
            $.each(data, function (index, item) {
                resources +=
                    '<li class="navbar-levelone " id=' +
                    item.id +
                    '><a href="javascript:;">' +
                    item.name +
                    "</a></li>";

                if (item.childs && item.childs.length > 0) {
                    $.each(item.childs, function (ind, ite) {
                        menu +=
                            '<div class="menu_dropdown bk_2 ' +
                            item.id +
                            '" style="display:none" id="' + item.id + '">';
                        menu += '<dl id="menu-article">';
                        var icon = ite.icon ? ite.icon : "&#xe616;";
                        menu +=
                            ' <dt><i class="Hui-iconfont">' +
                            icon +
                            "</i> " +
                            ite.name +
                            '<i class="Hui-iconfont menu_dropdown-arrow">&#xe6d5;</i></dt>';
                        menu += "<dd>";
                        menu += "<ul>";
                        if (ite.childs && ite.childs.length > 0) {
                            $.each(ite.childs, function (inds, key) {
                                menu +=
                                    '<li  data-reID="' +
                                    key.id +
                                    '"><a  data-href="' +
                                    key.urls +
                                    '" data-title="' +
                                    key.name +
                                    '" href="javascript:void(0)">' +
                                    key.name +
                                    "</a></li>";
                            });
                        }

                        menu += "</ul></dd></dl></div>";
                    });
                }
            });
            $("#navbar-navs").html(resources);
            $(".Hui-aside").html(menu);

            this.binds();
        },
        binds: function () {
            $(".Hui-aside").Huifold({
                titCell: ".menu_dropdown dl dt",
                mainCell: ".menu_dropdown dl dd"
            });
            /**
             * 默认显示内容
             */
            var showIndex = $(".menu_dropdown").eq(0).attr('id');
            $(".Hui-aside ." + showIndex).show();
            /*选项卡导航*/
            $(".Hui-aside").on("click", ".menu_dropdown a", function () {
                /*存当前资源ID*/
                util.Storage.set("resourceId", $(this).parent("li").attr("data-reID"));
                Hui_admin_tab(this);
            });
            $("#navbar-navs li").unbind("click").click(function () {
                $(".Hui-aside .menu_dropdown").hide();
                var index = $(this).attr("id");
                $(".Hui-aside ." + index).show();
            });
        }
    };
    resource.init();
});