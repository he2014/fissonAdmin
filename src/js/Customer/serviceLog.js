$(document).ready(function () {
    var servic_logs_list = (window['servic_logs_list'] = {
        init: function () {
            this.serviceLog_search();
            this.changeType();
            this.serviceLogs(1);
            this.add_service_log();
        },
        serviceLog_search: function () {
            var _this = this;
            $("#serviceLog_search").unbind('click').click(function () {
                _this.serviceLogs(1)
            })
        },
        changeType: function () {
            var text = $("#service_log_text");
            $("#change_Type").change(function () {
                var type = $(this).val();
                if (type == 1) {
                    text.val('');
                    text.attr('placeholder', '请输入Id')
                } else {
                    text.val('');
                    text.attr('placeholder', '请输入name')
                }
            });

        },
        serviceLogs: function (page) {
            var textVal = $("#service_log_text").val();
            var typeVal = $("#change_Type").val();
            var userId = '';
            var userName = '',
                _this = this;
            if (textVal) {
                if (typeVal == 1) {
                    userId = textVal;
                } else {
                    userName = textVal;
                }
                getAjax('custom/log/get/all', {
                    page: page,
                    size: 10,
                    id: userId,
                    n: userName
                }, function (data) {
                    _this.renderServiceLog(data.dataInfo)
                })
            } else {
                getAjax('custom/log/get/all', {
                    page: page,
                    size: 10,
                }, function (data) {
                    _this.renderServiceLog(data.dataInfo)
                })
            }

        },
        renderServiceLog: function (data) {

            var template = ' <table class="table table-border table-bordered table-bg table-hover">\
                                <thead class="text-l" >\
                                <tr> <td colspan="9" >客服日志</td></tr>\
                                <tr class="text-c">\
                                <th>编号</th>\
                                <th>用户id</th>\
                                <th>录入客服id</th>\
                                <th>录入客服name</th>\
                                <th>whatapp</th>\
                                <th>facebook</th>\
                                <th>备注</th>\
                                <th>创建时间</th>\
                                <th>操作</th>\
                                </tr>\
                                </thead >\
                                <tbody>\
                                    {0}\
                                </tbody>\
                                </table ><div id="pageserviceList"></div>';
            if (data.list) {
                var list = data.list.map(function (item) {
                    return '<tr class="text-c">' +
                        '<td>' + item.id + '</td>' +
                        '<td>' + item.user_id + '</td>' +
                        '<td>' + item.add_user_id + '</td>' +
                        '<td>' + item.add_user_name + '</td>' +
                        '<td>' + item.whatsapp + '</td>' +
                        '<td>' + item.facebook_id + '</td>' +
                        '<td>' + item.remarks + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                        '<td>' +
                        '<button data-btn="serviceLog_edit" class="hide layui-btn layui-btn-xs edit_tag" data-msg=' + JSON.stringify(item) + ' >编辑</button>' +
                        '</td>' +
                        '</tr>'

                }).join('');
                $("#serviceLog").html(util.String.stringFormat(template, list));
                util.page_html('pageserviceList', data.page, data.pageCount, 'servic_logs_list.serviceLogs');
                util.functions();
                this.edit_service_log();
                //edit_tag
            }
        },
        edit_service_log: function () {
            var _this = this;
            $(".edit_tag").unbind('click').click(function () {
                var data = $(this).data('msg');
                var edit_form = '<div class="form-out">\
                            <div class="form-lable">用户id</div>\
                            <div class="form-box uid">\
                            <input type="text" placeholder="请输入" class="input-text radius size-M" value={0}>\
                            </div>\
                    </div>\
                    <div class="form-out">\
                            <div class="form-lable">记录人名字</div>\
                            <div class="form-box name">\
                            <input type="text" placeholder="请输入" class="input-text radius size-M" value={1}>\
                            </div>\
                    </div>\
                    <div class="form-out">\
                            <div class="form-lable">录入客服id</div>\
                            <div class="form-box aid">\
                            <input type="text" placeholder="请输入" class="input-text radius size-M" value={2}>\
                            </div>\
                    </div>\
                    <div class="form-out">\
                            <div class="form-lable">facebook账号</div>\
                            <div class="form-box facebook">\
                            <input type="text" placeholder="请输入" class="input-text radius size-M" value={3}>\
                            </div>\
                    </div>\
                    <div class="form-out">\
                            <div class="form-lable">whatApp账号</div>\
                            <div class="form-box whatApp">\
                            <input type="text" placeholder="请输入" class="input-text radius size-M" value={4}>\
                    </div>\
                    </div>\
                    <div class="form-out">\
                            <div class="form-lable">记录备注</div>\
                            <div class="form-box mess">\
                            <input type="text" placeholder="请输入" class="input-text radius size-M" value={5}>\
                            </div>\
                 </div>';
                layer.open({
                    title: '编辑',
                    btn: ['确定'],
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['480px', '400px'], //宽高
                    content: util.String.stringFormat(edit_form, data.user_id, data.add_user_name, data.add_user_id, data.facebook_id, data.whatsapp, data.remarks),
                    yes: function (index) {
                        var user_id = $('.uid').find('input').val(),
                            add_name = $('.name').find('input').val(),
                            aid = $('.aid').find('input').val(),
                            facebook = $('.facebook').find('input').val(),
                            userwhatApp_id = $('.whatApp').find('input').val(),
                            mess = $('.mess').find('input').val();

                        postAjax('custom/log/update/' + data.id, {
                            uid: user_id,
                            n: add_name,
                            aid: aid,
                            f: facebook,
                            wa: userwhatApp_id,
                            m: mess,
                        }, function () {
                            _this.serviceLogs(1);
                            util.Huipopup('修改成功');
                            layer.close(index);
                        })
                    }
                });
            })
        },
        add_service_log: function () {
            var _this = this;
            $("#add_service_log_Btn").unbind('click').click(function () {
                var add_form = '<div class="form-out">\
                    <div class="form-lable">用户id</div>\
                    <div class="form-box uids">\
                    <input type="text" placeholder="请输入" class="input-text radius size-M">\
                    </div>\
                 </div>\
                    <div class="form-out">\
                            <div class="form-lable">记录人名字</div>\
                            <div class="form-box names">\
                            <input type="text" placeholder="请输入" class="input-text radius size-M" value={0}>\
                            </div>\
                    </div>\
                    <div class="form-out">\
                            <div class="form-lable">录入客服id</div>\
                            <div class="form-box aids">\
                            <input type="text" placeholder="请输入" class="input-text radius size-M" value={1}>\
                            </div>\
                    </div>\
                    <div class="form-out">\
                            <div class="form-lable">facebook账号</div>\
                            <div class="form-box facebooks">\
                            <input type="text" placeholder="请输入" class="input-text radius size-M" >\
                            </div>\
                                                </div>\
                                <div class="form-out">\
                                        <div class="form-lable">whatApp账号</div>\
                                        <div class="form-box whatApps">\
                                        <input type="text" placeholder="请输入" class="input-text radius size-M" >\
                                </div>\
                                </div>\
                                <div class="form-out">\
                                        <div class="form-lable">记录备注</div>\
                                        <div class="form-box messs">\
                                        <input type="text" placeholder="请输入" class="input-text radius size-M">\
                                        </div>\
                            </div>';

                layer.open({
                    title: '新建',
                    btn: ['确定'],
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['480px', '400px'], //宽高
                    content: util.String.stringFormat(add_form, cookie_util.get_cookie('SELF_USER_NAME'), cookie_util.get_cookie('SELF_USER_ID')),
                    yes: function (index) {
                        var user_id = $('.uids').find('input').val(),
                            add_name = $('.names').find('input').val(),
                            aid = $('.aids').find('input').val(),
                            facebook = $('.facebooks').find('input').val(),
                            userwhatApp_id = $('.whatApps').find('input').val(),
                            mess = $('.messs').find('input').val();

                        postAjax('custom/log/add', {
                            uid: user_id,
                            n: add_name,
                            aid: aid,
                            f: facebook,
                            wa: userwhatApp_id,
                            m: mess,
                        }, function () {
                            _this.serviceLogs(1);
                            util.Huipopup('新建成功');
                            layer.close(index);
                        })
                    }
                });
            })


        }
    })
    servic_logs_list.init();
})