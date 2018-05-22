$(document).ready(function() {
    var stringFormat = util.String.stringFormat;
    var monitoringResults_tables = (window["monitoringResults_tables"] = {
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
                    elem: '#monitorStart', //指定元素
                    type: 'date',
                    range: false,
                    format: 'yyyy-MM-dd',
                    value: util.DateTime.showtime(new Date(startTime))
                });
                laydate.render({
                    elem: '#monitorEnd',
                    type: 'date',
                    range: false,
                    format: 'yyyy-MM-dd',
                    value: util.DateTime.showtime(new Date(endTime))
                });
            });
            $("#monitorSearch").unbind("click").click(function() {
                if ($("#monitorStart").val() && $("#monitorEnd").val()) {
                    _this.monitoringResultsList(1);
                } else {
                    layer.msg("请选择时间！")
                }
            })

        },
        // 获取监控列表
        monitoringResultsList: function(page) {
            var rid = $("#monitorSearchRID").val();
            var uid = $("#monitorSearchUID").val();
            var type = $("#searchType").val();
            var startTime = $("#monitorStart").val();
            var endTime = $("#monitorEnd").val();
            var s_time = startTime + " 00:00:00";
            var e_time = endTime + " 00:00:00";
            var _this = this;
            if (!rid) {
                rid = 0
            }
            if (!uid) {
                uid = 0
            }
            getAjax('monitor/handler/' + rid + "/" + uid + "/" + type + "/" + s_time + "/" + e_time, {
                page: page,
                size: 10
            }, function(data) {
                _this.monitoringListHtmls(data.dataInfo)
            })
        },
        // // 处理监控列表数据
        monitoringListHtmls: function(data) {
            var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead >\
                                <tr class="text-l"><td colspan="7">监控结果</td></tr>\
                                <tr class="text-c">\
                                <th >房间ID</th>\
                                <th >用户ID</th>\
                                <th >用户昵称</th>\
                                <th >处理人名字</th>\
                                <th >处理人ID</th>\
                                <th >类型</th>\
                                <th >时间</th>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="record_monitorList">\
                                {0}\
                            </tbody>\
                        </table ><div id="user_page_monitorList"></div>';
            if (data.list && data.list.length > 0) {
                var list = data.list.map(function(item) {
                    var nickname = item.nickname || " ";
                    var handleName = item.handleName || " ";
                    if (item.handle_type == 1) {
                        handle_type = '房间禁言';
                    } else if (item.handle_type == 2) {
                        handle_type = '全站禁言';
                    } else if (item.handle_type == 3) {
                        handle_type = '房间解禁';
                    } else if (item.handle_type == 4) {
                        handle_type = '全站解禁';
                    } else if (item.handle_type == 5) {
                        handle_type = '踢出房间';
                    } else if (item.handle_type == 6) {
                        handle_type = '禁用账号';
                    }
                    return '<tr class="text-c">' +
                        '<td>' + item.room_id + '</td>' +
                        '<td>' + item.user_id + '</td>' +
                        '<td>' + nickname + '</td>' +
                        '<td>' + handleName + '</td>' +
                        '<td>' + item.handleUserId + '</td>' +
                        '<td>' + handle_type + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.create_date)) + '</td>'
                    '</tr>'
                }).join('');
                $("#monitoringResultsList").html(util.String.stringFormat(tableHtml, list));
                $("#record_monitorList").removeClass('hide');
                util.page_html('user_page_monitorList', data.page, data.pageCount, 'monitoringResults_tables.monitoringResultsList');
            } else {
                $('#monitoringResultsList').html(util.String.stringFormat(tableHtml, '<tr></tr>'));
                layer.msg('查询内容不存在！')
            }
        }
    });
    monitoringResults_tables.init();
});