$(document).ready(function() {
    var deviceBlackList = (window['deviceBlackList'] = {
        init: function() {
            this.getBlackList(1);
        },
        getBlackList: function(page) {
            var _this = this;
            getAjax("device/get/all", {
                page: page,
                size: 10
            }, function(data) {
                _this.renderList(data);
                util.functions();
                //console.log(data)
            })
        },
        renderList: function(data) {
            var _this = this;
            if (data && data.dataInfo.list && data.dataInfo.list.length > 0) {
                var datas = data.dataInfo;
                var list = datas.list.map(function(item, key, array) { //addBlackList
                    return '<tr class="text-c">' +
                        '<td>' + item.user_id + '</td>' +
                        '<td>' + item.machineId + '</td>' +
                        '<td><i data-item=' + JSON.stringify(item) + ' data-btn="delBlackList" class="hide iconfont-del2 Hui-iconfont Hui-iconfont-del2"></i></td>' +
                        '</tr>'
                }).join('');
                var htmls = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="1">\
                                设备黑名单\
                                <td colspan="2">\
                                    <input style="width:auto;" type="text" name="searchBlackList" placeholder="输入设备号" class=" input-text radius size-M">\
                                    <input id="searchBlackList"  class=" btn btn-success radius" type="button" value="查询">\
                                    <input data-btn="addBlackList" id="addBlackList" class="hide btn radius btn-secondary" type="button" value="新建">\
                                    <input id="refreshList" class="btn radius btn-secondary" type="button" value="刷新缓存">\
                                </td>\
                                </td></tr>\
                                <tr class="text-c">\
                                    <th>用户id</th>\
                                    <th>设备号</th>\
                                    <th>操作</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table ><div id="pageBlackList"></div>';
                $("#userBlackList").html(util.String.stringFormat(htmls, list));
                util.functions();
                util.page_html("pageBlackList", datas.page, datas.pageCount, 'deviceBlackList.getBlackList');
                _this.searchBlackList();
                _this.addBlackList();
                _this.delBlackList();
                _this.refreshList();
            }
        },
        addBlackList: function() {
            var _this = this;
            var addHtml = '<form class="layui-form" action="" style="padding-right:15px;padding-top:15px;">\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">userId</label>\
                                <div class="layui-input-block">\
                                <input type="text" name="countryId"  placeholder="请输入id" autocomplete="off" class="layui-input">\
                                </div>\
                                </div>\
                                <div class="layui-form-item">\
                                <label class="layui-form-label">设备号</label>\
                                <div class="layui-input-block">\
                                <input type="text" name="countryCode"  placeholder="请输入设备号" autocomplete="off" class="layui-input">\
                                </div>\
                                </div>\
                            </from>';

            $("#addBlackList").click(function() {
                layer.open({
                    title: '新添',
                    type: 1,
                    btn: ['确定'],
                    skin: 'layui-layer-rim', //加上边框
                    area: ['360px', '240px'], //宽高
                    content: addHtml,
                    yes: function(index, layero) {
                        var c_id = $("input[name='countryId']").val(),
                            c_code = $('input[name="countryCode"]').val();

                        if (!c_id) {
                            layer.mag("id不能为空")
                        } else if (!c_code) {
                            layer.msg('设备号不能为空')
                        } else {
                            postAjax('device/add/', {
                                userId: c_id,
                                dev: c_code,
                            }, function() {
                                layer.close(index);
                                layer.msg('新添成功')
                                _this.getBlackList(1);
                            })
                        }
                    }
                })
            })

        },
        searchBlackList: function() {
            var _this = this;
            $("#searchBlackList").click(function() {
                var dev = $('[name="searchBlackList"]').val();
                if (!dev) {
                    _this.getBlackList(1);
                } else {
                    getAjax("device/get/all?dev=" + dev, {}, function(data) {
                        if (data.dataInfo && data.dataInfo.list) {
                            if (data.dataInfo.list.length == 0) {
                                layer.msg("当前设备号无记录");
                            } else {
                                _this.renderList(data);
                                util.functions();
                            }
                        }

                    })
                }
            })
        },
        delBlackList: function() {
            var _this = this;
            $(".iconfont-del2").on('click', function() {
                var dev = JSON.parse($(this).attr("data-item"));
                postAjax("device/del/" + dev.machineId, {}, function() {
                    layer.msg("删除成功");
                    _this.getBlackList(1);
                })
            })
        },
        refreshList: function() {
            var _this = this;
            $("#refreshList").unbind('click').click(function() {
                postAjax('device/cache/flush', {}, function() {
                    util.Huipopup('刷新成功！');
                    _this.getBlackList(1);
                })
            })
        }
    })
    deviceBlackList.init();
});