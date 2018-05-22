$(document).ready(function() {
    var serviceLevelUsers = (window['serviceLevelUsers'] = {
        init: function() {

            this.getServiceLevelUsers(1);
        },
        get_recharge_threshold: function() {
            var _this = this;
            getAjax('customer/level/user/money/get', {}, function(data) {
                $("#recharge_threshold").val(data.dataInfo);
            })
        },
        getServiceLevelUsers: function(page) {
            var _this = this;
            getAjax('customer/level/user', {
                page: page,
                size: 10,
            }, function(data) {

                _this.renderLevelUsers(data.dataInfo);
            })
            //_this.renderLevelUsers();
        },
        renderLevelUsers(data) {
            var htmls = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="4">\
                                <div style="width:600px;display:flex;justify-content:space-around;align-items:center;">\
                                <div>充值阈值 :</div>\
                                <input id="recharge_threshold" style="width:auto;" value="{1}" type = "text" name = "title" required lay-verify="required" placeholder = "请输入阈值" autocomplete = "off" class="layui-input" >\
                                <div style = "flex:1" > (单位: 美分) </div>\
                                <button id = "update_recharge_threshold" data-btn="update_recharge_threshold" class = "layui-btn layui-btn-sm hide" > <i class = "layui-icon">&#x1002;</i>更新金额阈值</button > \
                                </div>\
                                </td></tr>\
                                <tr>\
                                <td colspan="4">\
                                     <button id="update_level_list"  class="layui-btn layui-btn-sm"> <i class="layui-icon" >&#x1002;</i >刷新缓存</button >\
                                     <button id="add_level_list" data-btn="add_level_list" class="layui-btn layui-btn-sm hide"> <i class="layui-icon" >&#xe608;</i >添加名单</button >\
                                </td>\
                                </tr>\
                                <tr><td colspan="4">客服等级用户名单</td></tr>\
                                <tr class="text-c">\
                                    <th>用户id</th>\
                                    <th>等级类型</th>\
                                    <th>创建时间</th>\
                                    <th>操作</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table ><div id="page_ServiceLevelUsers"></div>';
            if (data && data.list) {
                var datas = data.list;
                var list = datas.map(function(item, key, array) { //addBlackList
                    var level_type = item.level_type == 1 ? "自动" : '手动';
                    return '<tr class="text-c">' +
                        '<td>' + item.user_id + '</td>' +
                        '<td>' + level_type + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.create_date)) + '</td>' +
                        '<td><i data-item=' + JSON.stringify(item) + ' data-btn="delete_level_list" class="hide iconfont-del2 Hui-iconfont Hui-iconfont-del2"></i></td>' +
                        '</tr>'
                }).join('');

                $("#serviceLevelUsers").html(util.String.stringFormat(htmls, list, ""));
                this.get_recharge_threshold();
                util.page_html('page_ServiceLevelUsers', data.page, data.pageCount, 'serviceLevelUsers.getServiceLevelUsers');
                util.functions();
                this.delete_levelUser();
                this.bind_event();
            } else {
                $("#serviceLevelUsers").html(util.String.stringFormat(htmls, ""));
            }
        },

        bind_event: function() {
            var _this = this;
            $("#update_recharge_threshold").unbind('click').click(function() {
                var value = $("#recharge_threshold").val();
                if (value >= 0) {
                    layer.confirm('确定更新？', function(index) {
                        postAjax('customer/level/user/money/update', {
                            m: value
                        }, function() {
                            util.Huipopup('更新成功');
                            _this.getServiceLevelUsers(1);
                            _this.recharge_threshold_num = value;
                            layer.close(index);
                        })

                    });
                } else {
                    util.Huipopup('充值阈值必须大于等于0')
                }


            });
            $("#update_level_list").unbind('click').click(function() {
                postAjax('customer/level/user/cache/clean', {}, function() {
                    util.Huipopup('刷新成功！');
                    _this.getServiceLevelUsers(1);
                })
            });
            $("#add_level_list").unbind('click').click(function() {
                layer.prompt({
                    title: '添加名单,输入用户id，并确认',
                    formType: 0
                }, function(pass, index) {
                    if (pass && !isNaN(pass)) {
                        postAjax('customer/level/user/add', {
                            uid: pass
                        }, function() {
                            layer.close(index);
                            _this.getServiceLevelUsers(1);
                        })

                    } else {
                        util.Huipopup('输入内容错误')
                    }


                });

            });
        },
        delete_levelUser: function() {
            var _this = this;
            $("i.iconfont-del2").unbind('click').click(function() {
                var userId = $(this).data('item').user_id;
                layer.confirm('确人删除吗？', function(index) {
                    postAjax('customer/level/user/del/' + userId, {}, function() {
                        util.Huipopup('删除成功');
                        _this.getServiceLevelUsers(1);
                        layer.close(index);
                    })

                });
            })
        }

    })

    serviceLevelUsers.init();
})