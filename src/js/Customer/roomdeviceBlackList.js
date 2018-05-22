$(document).ready(function() {
    var roomdeviceBlackList = (window['roomdeviceBlackList'] = {
        init: function() {
            this.getBalckList(1); //
            this.balckListBind()
        },
        getBalckList: function(page) {
            var _this = this;
            var val = $('#_roomdeviceBlackList').val(),
                type = $('#changeSearchType').val(),
                rid = 0,
                dev = '';
            if (val && type == 0) {
                rid = val;
            };
            if (val && type == 1) {
                dev = val;
            };
            getAjax('host/black/device', {
                rid: rid,
                dev: dev,
                page: page,
                size: 10
            }, function(data) {
                _this.renderBlackList(data.dataInfo);
            })

        },
        renderBlackList: function(data) {

            if (data) {
                var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead >\
                                <tr class="text-l"><td colspan="3">黑名單</td><td colspan="2"><button class="add_blackList layui-btn layui-btn-sm hide" data-btn="roomBlackAddBtn">新建</button><button class="refreshList layui-btn layui-btn-sm">刷新缓存</button></td></tr>\
                                <tr class="text-c">\
                                <td >房间id</td>\
                                <td >设备id</td>\
                                <td >设备编号</td>\
                                <td >创建时间</td>\
                                 <td >操作</td>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="room_deviceBlackList">\
                                {0}\
                            </tbody>\
                        </table >';
                var list = data.list.map(function(item) {
                    return '<tr class="text-c">' +
                        '<td>' + item.room_id + '</td>' +
                        '<td>' + item.black_device_id + '</td>' +
                        '<td>' + item.black_device + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                        '<td><button data-dev=' + item.black_device + ' class="delete_blackList layui-btn layui-btn-sm hide" data-rid=' + item.room_id + ' data-btn="roomBlackDeleteBtn">删除</button>' +
                        '</td>' +
                        '</tr>'
                }).join('');

                $("#roomdeviceBlackList").html(util.String.stringFormat(tableHtml, list));
                $("#room_deviceBlackList").removeClass('hide');
                $("div.holder").jPages({
                    containerID: "room_deviceBlackList",
                    first: "首页",
                    last: "尾页",
                    next: "下一页",
                    previous: "上一页"
                })
                $("div.holder").removeClass('hide');
                util.functions();
                this.black_device_envent()
            } else {
                $("div.holder").addClass('hide');
            }

        },
        black_device_envent: function() {
            var _this = this;
            $(".delete_blackList").unbind('click').click(function() {
                var rid = $(this).data('rid');
                var dev = $(this).data('dev');
                //console.log(dev)
                layer.confirm('确认此操作？', {
                    btn: ['确定', '取消'] //按钮
                }, function() {
                    postAjax('host/black/device/delete/' + rid + "/" + dev, {}, function() {
                        layer.msg('刪除成功！');
                        _this.getBalckList(1)
                    })
                }, function() {

                });
            });
            $(".add_blackList").unbind('click').click(function() {
                var from = '<form class="layui-form" action="">\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label">房间Id</label>\
                                <div class="layui-input-block">\
                                <input type="text" id="roomid-input" name="title" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                </div>\
                            </div>\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label">设备号</label>\
                                <div class="layui-input-block">\
                                <input type="text" id="device-input" name="title" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                </div>\
                            </div>\
                        </form>'
                layer.open({
                    type: 1,
                    title: "新建",
                    btn: ['确定'],
                    skin: 'layui-layer-rim', //加上边框
                    area: ['420px', '240px'], //宽高
                    content: from,
                    yes: function(index) {
                        var roomid = $("#roomid-input").val();
                        var device = $("#device-input").val();
                        if (roomid && device) {
                            postAjax('host/black/device/add/' + roomid + '/' + device, {}, function() {
                                layer.msg('新建成功');
                                layer.close(index);
                                _this.getBalckList(1);
                                util.functions();
                            })
                        } else {
                            layer.msg('roomid或设备号都不能为空');
                        }
                    }
                });
            });
            $(".refreshList").unbind('click').click(function() {
                postAjax('host/black/device/cache/refresh', {}, function() {
                    util.Huipopup('刷新成功！');
                    _this.getBalckList(1);
                })
            })
        },
        balckListBind: function() {
            var _this = this;
            var text = $('#_roomdeviceBlackList');
            $("#roomdeviceBlackList_btn").unbind('click').click(function() {
                _this.getBalckList(1)

            });
            $("#changeSearchType").change(function() {
                var value = $(this).val();
                if (value == 1) {
                    text.attr('placeholder', '请输入设备号');
                    text.val('');
                } else {
                    text.attr('placeholder', '请输入roomid');
                    text.val('');
                };
            });
        }
    })
    roomdeviceBlackList.init();
});