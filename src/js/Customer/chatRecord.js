$(document).ready(function() {
    var stringFormat = util.String.stringFormat;
    var chatRecord_tables = (window["chatRecord_tables"] = {
        init: function() {
            this.bool = false;
            this.changeSearchType();
        },
        changeSearchType: function() {
            var _this = this;
            var data = new Date().getTime();
            var endTime = data + (24 * 60 * 60 * 1000);
            var startTime = data - (7 * 24 * 60 * 60 * 1000);
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                laydate.render({
                    elem: '#chatRecordStart', //指定元素
                    type: 'date',
                    range: false,
                    format: 'yyyy-MM-dd',
                    value: util.DateTime.showtime(new Date(startTime))
                });
                laydate.render({
                    elem: '#chatRecordEnd',
                    type: 'date',
                    range: false,
                    format: 'yyyy-MM-dd',
                    value: util.DateTime.showtime(new Date(endTime))
                });
            });
            $("#chatRecordSearch").unbind("click").click(function() {
                if ($("#chatRecordStart").val() && $("#chatRecordEnd").val()) {
                    _this.chatRecordList(1);
                } else {
                    layer.msg("请选择时间！")
                }
            })

        },
        // 获取聊天列表
        chatRecordList: function(page) {
            var type = $("#searchType").val();
            var param = $("#searchTypeConet").val();
            var hostParam = $("#recordRoomID").val();
            var startTime = $("#chatRecordStart").val();
            var endTime = $("#chatRecordEnd").val();
            var chat = $("#recordChat").val();
            var s_time = startTime + " 00:00:00";
            var e_time = endTime + " 00:00:00";
            var _this = this;
            if (!param) {
                param = "n"
            }
            if (!hostParam) {
                hostParam = 0
            }
            if (!chat) {
                chat = "n"
            }
            getAjax('custom/user/chat/history/' + type + "/" + param + "/1/" + hostParam + "/" + s_time + "/" + e_time + "/" + chat, {
                page: page,
                size: 10
            }, function(data) {
                _this.chatRecordListHtmls(data.dataInfo)
            })
        },
        // 处理聊天列表数据
        chatRecordListHtmls: function(data) {
            var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead >\
                                <tr class="text-l"><td colspan="4">聊天记录</td></tr>\
                                <tr class="text-c">\
                                <th >内容</th>\
                                <th >用户ID</th>\
                                <th >房间ID</th>\
                                <th >时间</th>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="record_chatRecord">\
                                {0}\
                            </tbody>\
                        </table ><div id="user_page_chatRecord"></div>';
            if (data.list && data.list.length > 0) {
                var list = data.list.map(function(item) {
                    return '<tr class="text-c">' +
                        '<td>' + item.chat + '</td>' +
                        '<td>' + item.fromUser + '</td>' +
                        '<td>' + item.roomId + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.sendTimeStr)) + '</td>'
                    '</tr>'
                }).join('');
                $("#chatRecordList").html(util.String.stringFormat(tableHtml, list));
                $("#record_chatRecord").removeClass('hide');
                util.page_html('user_page_chatRecord', data.page, data.pageCount, 'chatRecord_tables.chatRecordList');
            } else {
                $('#chatRecordList').html(util.String.stringFormat(tableHtml, '<tr></tr>'));
                layer.msg('查询内容不存在！')
            }
        }
    });
    chatRecord_tables.init();
});