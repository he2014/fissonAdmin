$(document).ready(function () {
    var $chatCountry = (window['$chatCountry'] = {
        init: function () {
            this.getChatCountry(1);
        },
        getChatCountry: function (page) {
            var _this = this;
            getAjax('chatroom/country/get/all', {
                page: page,
                size: 10
            }, function (response) {
                if (response.dataInfo) {
                    _this.renderChatCountry(response.dataInfo)
                }
                //console.log(response);
            })
        },
        renderChatCountry: function (data) {
            if (data.list && data.list.length > 0) {
                var htmls = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="8">\
                                国家配置\
                                <td colspan="2">\
                                    <input data-btn="addChatCountry" id="addCountry" class="hide btn radius btn-secondary" type="button" value="新建">\
                                </td>\
                                </td></tr>\
                                <tr class="text-c">\
                                    <th>编号</th>\
                                    <th>国家编号</th>\
                                    <th>国家代码</th>\
                                    <th>英语名称</th>\
                                    <th>阿语名称</th>\
                                    <th>土耳其名称</th>\
                                    <th>国旗</th>\
                                    <th>描述</th>\
                                    <th>创建日期</th>\
                                    <th>操作</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table ><div id="chatCountry_page"></div>';
                var list = data.list.map(function (item, key, array) {
                    return '<tr class="text-c">' +
                        '<td>' + item.id + '</td>' +
                        '<td>' + item.cid + '</td>' +
                        '<td>' + item.code + '</td>' +
                        '<td>' + item.en_name + '</td>' +
                        '<td>' + item.ar_name + '</td>' +
                        '<td>' + item.tr_name + '</td>' +
                        '<td><img style="height:30px;" src="' + serverUrl + item.national_flag + '"/></td>' +
                        '<td>' + item.country_desc + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                        '<td><i data-item=' + item.id + ' data-btn="delchatCountry" class="hide iconfont-del2 Hui-iconfont Hui-iconfont-del2"></i></td>' +
                        '</tr>'
                }).join('');
                $("#chatCountry").html(util.String.stringFormat(htmls, list));
                util.functions();
                util.page_html('chatCountry_page', data.page, data.pageCount, '$chatCountry.getChatCountry');
                this.delChatCountry();
                this.addChatCountry()
            }
        },
        addChatCountry: function () {
            var _this = this;
            var addHtml = '<form class="layui-form" action="" style="padding-right:15px;padding-top:15px;">\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">国家编号</label>\
                                <div class="layui-input-block">\
                                <input type="text" name="countryId"  placeholder="请输入" autocomplete="off" class="layui-input">\
                                </div>\
                                </div>\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">国家代码</label>\
                                <div class="layui-input-block">\
                                <input type="text" name="countryCode"  placeholder="请输入" autocomplete="off" class="layui-input">\
                                </div>\
                                </div>\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">英语名称</label>\
                                <div class="layui-input-block">\
                                <input type="text" name="encountryName"  placeholder="请输入" autocomplete="off" class="layui-input">\
                                </div>\
                                </div>\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">阿语名称</label>\
                                <div class="layui-input-block">\
                                <input type="text" name="arcountryName"  placeholder="请输入" autocomplete="off" class="layui-input">\
                                </div>\
                                </div>\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">土耳其名称</label>\
                                <div class="layui-input-block">\
                                <input type="text" name="trcountryName"  placeholder="请输入" autocomplete="off" class="layui-input">\
                                </div>\
                                </div>\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">国旗</label>\
                                <div class="layui-input-block">\
                                <input data-type="show" id="chatCountryUpload" class="btn btn-secondary radius size-S" type="button" value="上传">\
                                    \
                                </div>\
                                </div>\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">国家描述</label>\
                                <div class="layui-input-block">\
                                <input type="text" name="countryDesc"  placeholder="请输入" autocomplete="off" class="layui-input">\
                                </div>\
                                </div>\
                            </from>';

            $("#addCountry").click(function () {

                layer.open({
                    title: '新添',
                    type: 1,
                    btn: ['确定'],
                    skin: 'layui-layer-rim', //加上边框
                    area: ['420px', '480px'], //宽高
                    content: addHtml,
                    yes: function (index, layero) {
                        var c_id = $("input[name='countryId']").val(),
                            c_code = $('input[name="countryCode"]').val(),
                            en_name = $('input[name="encountryName"]').val(),
                            ar_name = $('input[name="arcountryName"]').val(),
                            tr_name = $('input[name="trcountryName"]').val(),
                            c_desc = $('input[name="countryDesc"]').val();
                        if (!c_id) {
                            layer.msg("id不能为空")
                        } else if (!c_code) {
                            layer.msg('代码不能为空')
                        } else if (!en_name || !ar_name || !tr_name) {
                            layer.msg('名称不能为空')
                        } else {
                            if ($chatCountry.countryImage) {
                                postAjax('chatroom/country/add', {
                                    cid: c_id,
                                    c: c_code,
                                    en: en_name,
                                    ar: ar_name,
                                    tr: tr_name,
                                    flag: $chatCountry.countryImage,
                                    desc: c_desc
                                }, function () {
                                    layer.close(index);
                                    layer.msg('新添成功')
                                    _this.getChatCountry(1)
                                })
                            } else {
                                layer.msg('请上传图片！');
                            }

                        }
                    }
                })
                $("#chatCountryUpload").click(function () {
                    upload_util.show_upload_image(this, "上传图片", true, $chatCountry.chatUplodeCountry);
                });
            })

        },
        chatUplodeCountry: function (data) {
            if (data) {
                $chatCountry.countryImage = data;
            }
        },
        delChatCountry: function () {
            var _this = this;
            $(".Hui-iconfont-del2").on('click', function () {
                var id = $(this).attr('data-item');
                postAjax('chatroom/country/del/' + id, {}, function () {
                    layer.msg('删除成功！');
                    _this.getChatCountry(1);
                })
            })
        }
    })
    $chatCountry.init();
});