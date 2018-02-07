$(document).ready(function() {
    var resource_data = null;
    var resource = {
        init: function() {
            var _this = this;
            getAjax('sysuser', {}, function(data) {
                if (data.code == 0) {
                    resource_data = data.dataInfo.resources;
                    function_data = data.dataInfo.functions;
                    _this.render(resource_data);

                    cookie_util.add_or_update_cookie("functiondata", function_data)
                    cookie_util.get_cookie("functiondata")

                }
            })
        },
        render: function(data) {
            var resources = '';
            var menu = '';
            $.each(data, function(index, item) {
                resources += '<li class="navbar-levelone " id=' + item.id + '><a href="javascript:;">' + item.name + '</a></li>';

                if (item.childs && item.childs.length > 0) {
                    $.each(item.childs, function(ind, ite) {
                        menu += '<div class="menu_dropdown bk_2 ' + item.id + '" style="display:none">';
                        menu += '<dl id="menu-article">'
                        menu += ' <dt><i class="Hui-iconfont">&#xe616;</i> ' + ite.name + '<i class="Hui-iconfont menu_dropdown-arrow">&#xe6d5;</i></dt>'
                        menu += '<dd>'
                        menu += '<ul>'
                        if (ite.childs && ite.childs.length > 0) {
                            // alert(1)
                            $.each(ite.childs, function(inds, key) {
                                menu += '<li><a data-href="' + key.urls + '" data-title="' + key.name + '" href="javascript:void(0)">' + key.name + '</a></li>'
                            })
                        }

                        menu += "</ul></dd></dl></div>"
                    });
                }
            });
            $("#navbar-navs").html(resources);
            $(".Hui-aside").html(menu)

            this.binds();
        },
        binds: function() {
            $(".Hui-aside").Huifold({
                titCell: '.menu_dropdown dl dt',
                mainCell: '.menu_dropdown dl dd',
            });
            $(".menu_dropdown").eq(0).show();
            $("#navbar-navs li").unbind('click').click(function() {
                $('.Hui-aside .menu_dropdown').hide()
                var index = $(this).attr('id');
                $('.Hui-aside .' + index).show();
            })
        },

    }
    resource.init();
})