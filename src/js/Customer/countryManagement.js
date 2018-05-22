$(document).ready(function () {
    var countryManagement = (window['countryManagement'] = {
        init: function () {
            this.getCountryList(1)
        },
        getCountryList: function (page) {
            var _this = this;
            getAjax("host/country/get/all/", {}, function (response) {
                _this.renderList(response.dataInfo);
            })
        },
        renderList: function (data) {
            var _this = this;
            if (data && data.length > 0) {
                var list = data.map(function (item, key, array) {
                    return '<tr class="text-c">' +
                        '<td>' + item.id + '</td>' +
                        '<td>' + item.code + '</td>' +
                        '<td>' + item.name + '</td>' +
                        '<td>' + item.desc + '</td>' +
                        '<td><i data-item=' + JSON.stringify(item) + ' style="margin-right:10px;" data-btn="editRoomCountry" class="hide iconfont-edit2 Hui-iconfont Hui-iconfont-edit2"></i><i data-item=' + JSON.stringify(item) + ' data-btn="delRoomCountry" class="hide iconfont-del2 Hui-iconfont Hui-iconfont-del2"></i></td>' +
                        '</tr>'
                }).join('');
                var htmls = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="3">\
                                代理国家管理\
                                <td colspan="2">\
                                    <input data-btn="addRoomCountry" id="addCountry" class="hide btn radius btn-secondary" type="button" value="新建">\
                                    \
                                </td>\
                                </td></tr>\
                                <tr class="text-c">\
                                    <th>编号</th>\
                                    <th>枚举(国家代码)</th>\
                                    <th>名称</th>\
                                    <th>描述</th>\
                                    <th>操作</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table >';
                $("#countryManagement").html(util.String.stringFormat(htmls, list));
                util.functions();
                _this.add_country();
                _this.edit_country();
                _this.delete_country();
                _this.refresh_country();

            }
        },
        add_country: function () {
            var _this = this;
            var addHtml = '<form class="layui-form" action="" style="padding-right:15px;padding-top:15px;">\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">国家Id</label>\
                                <div class="layui-input-block">\
                                <input type="text" name="countryId"  placeholder="请输入id" autocomplete="off" class="layui-input">\
                                </div>\
                                </div>\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">国家代码</label>\
                                <div class="layui-input-block">\
                                <input type="text" name="countryCode"  placeholder="请输入国家代码" autocomplete="off" class="layui-input">\
                                </div>\
                                </div>\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">国家名称</label>\
                                <div class="layui-input-block">\
                                <input type="text" name="countryName"  placeholder="请输入国家名称" autocomplete="off" class="layui-input">\
                                </div>\
                                </div>\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">国家描述</label>\
                                <div class="layui-input-block">\
                                <input type="text" name="countryDesc"  placeholder="请输入国家描述" autocomplete="off" class="layui-input">\
                                </div>\
                                </div>\
                            </from>';

            $("#addCountry").click(function () {
                layer.open({
                    title: '新添',
                    type: 1,
                    btn: ['确定'],
                    skin: 'layui-layer-rim', //加上边框
                    area: ['400px', '360px'], //宽高
                    content: addHtml,
                    yes: function (index, layero) {
                        var c_id = $("input[name='countryId']").val(),
                            c_code = $('input[name="countryCode"]').val(),
                            c_name = $('input[name="countryName"]').val(),
                            c_desc = $('input[name="countryDesc"]').val();
                        if (!c_id) {
                            layer.mag("id不能为空")
                        } else if (!c_code) {
                            layer.msg('代码不能为空')
                        } else if (!c_name) {
                            layer.msg('名称不能为空')
                        } else {
                            postAjax('host/country/add/', {
                                id: c_id,
                                code: c_code,
                                name: c_name,
                                desc: c_desc
                            }, function () {
                                layer.close(index);
                                layer.msg('新添成功')
                                _this.getCountryList()
                            })
                        }
                    }
                })
            })


        },
        edit_country: function () {
            var editHtml = '<form class="layui-form" action="" style="padding-right:15px;padding-top:15px;">\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">国家代码</label>\
                                <div class="layui-input-block">\
                                <input type="text" value="{0}"  name="3"  placeholder="请输入国家代码" autocomplete="off" class="countryCode layui-input">\
                                </div>\
                                </div>\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">国家名称</label>\
                                <div class="layui-input-block">\
                                <input type="text" value="{1}"  name="2" placeholder="请输入国家名称" autocomplete="off" class="layui-input countryName">\
                                </div>\
                                </div>\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">国家描述</label>\
                                <div class="layui-input-block">\
                                <input type="text" value="{2}"  name="1" placeholder="请输入国家描述" autocomplete="off" class="layui-input countryDesc">\
                                </div>\
                                </div>\
                            </from>';
            $(".iconfont-edit2").on('click', function () {
                var data = JSON.parse($(this).attr('data-item'));
                // console.log(data)
                layer.open({
                    title: "编辑",
                    type: 1,
                    btn: ['确定'],
                    skin: 'layui-layer-rim', //加上边框
                    area: ['400px', '360px'], //宽高
                    content: util.String.stringFormat(editHtml, data.code, data.name, data.desc),
                    yes: function (index, layero) {
                        postAjax("host/country/update/" + data.id, {
                            name: $(".countryName").val(),
                            code: $(".countryCode").val(),
                            desc: $(".countryDesc").val()
                        }, function () {
                            layer.close(index);
                            layer.msg('修改成功');
                        })
                        //; 
                    }
                })
            })
        },
        delete_country: function () {
            var _this = this;
            $(".iconfont-del2").on('click', function () {
                var data = JSON.parse($(this).attr('data-item'));
                postAjax("host/country/del/" + data.id, {}, function () {
                    layer.msg("删除成功！");
                    _this.getCountryList()
                })
            })
        },
        refresh_country: function () {
            $("#refreshConutry").click(function () {

            })
        }

    })
    countryManagement.init();
});