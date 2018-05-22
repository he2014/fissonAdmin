$(document).ready(function () {
    var chatMonitor = {
        init: function () {
            this.getchatMonitor()
        },
        getchatMonitor: function () {
            var self = this;
            getAjax('chatroom/live', {}, function (data) {
                if (data.dataInfo) {
                    self.renderMonitor(data.dataInfo);
                };
            });
        },
        renderMonitor: function (data) {
            var _this = this;
            var table_list_user = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="6">\
                                  监控记录\
                                </td>\
                                </tr>\
                                <tr class="text-c">\
                                    <th>房间id</th>\
                                    <th>头像</th>\
                                    <th>房间Name</th>\
                                    <th>描述</th>\
                                    <th>状态</th>\
                                    <th>操作</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table >';
            if (data.list) {
                var chatRoomList = data.list.map(function (item) {
                    var flag = item.flag != 0 ? "有更新" : '无更新'
                    return '<tr class="text-c">' +
                        '<td>' + item.roomId + '</td>' +
                        '<td><img style="height:50px;" src=' + serverUrl + item.posterPic + ' / ></td>' +
                        '<td>' + item.roomName + '</td>' +
                        '<td>' + item.desc + '</td>' +
                        '<td>' + flag + '</td>' +
                        '<td><a data-btn="chatIgnoreBtn" data-roleId="' + item.roomId + '"href="javascript:;" class="btn btn-primary size-S radius chatIgnoreBtn hide" style="margin-left:10px">忽略</a><a data-btn="chatBannedBtn" data-roleId="' + item.roomId + '"href="javascript:;" class="btn btn-primary size-S radius chatBannedBtn hide" style="margin-left:10px">禁用</a></td>' +
                        '</tr>'
                }).join('');
                $("#chatMonitor").html(util.String.stringFormat(table_list_user, chatRoomList));
                util.functions();
                _this.binds();
            };
        },
        binds: function () {
            var _this = this;
            $(".chatIgnoreBtn").unbind("click").click(function () {
                var ignoreRid = $(this).attr("data-roleId");
                var datas = '';
                postAjax("chatroom/update/ignore/" + ignoreRid, {
                    value: ""
                }, function (da) {
                    layer.msg('已忽略！');
                    _this.getchatMonitor(1);
                })
            });
            $(".chatBannedBtn").unbind("click").click(function () {
                var bannedRid = $(this).attr("data-roleId");
                var datas = '';
                postAjax("chatroom/update/disable/" + bannedRid, {
                    value: 2
                }, function (da) {
                    layer.msg('已禁用！');
                    _this.getchatMonitor(1);
                })
            });
        }
    }
    chatMonitor.init();
});