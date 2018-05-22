$(document).ready(function() {
    var stringFormat = util.String.stringFormat;
    var backgroundOperation_tables = (window["backgroundOperation_tables"] = {
        init: function() {
            this.timeType();
        },
        timeType: function() {
            var _this = this;
            var data = new Date().getTime();
            var endTime = data + (24 * 60 * 60 * 1000);
            var startTime = data - (7 * 24 * 60 * 60 * 1000);
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                laydate.render({
                    elem: '#operationStart', //指定元素
                    type: 'date',
                    range: false,
                    format: 'yyyy-MM-dd',
                    value: util.DateTime.showtime(new Date(startTime))
                });
                laydate.render({
                    elem: '#operationEnd',
                    type: 'date',
                    range: false,
                    format: 'yyyy-MM-dd',
                    value: util.DateTime.showtime(new Date(endTime))
                });
            });
            _this.mychangeSearchType();
            // $("#operationSearch").click();
        },

        getBackLogData: function(page) {
            var startTime = $("#operationStart").val();
            var endTime = $("#operationEnd").val();
            var s_time = startTime + " 00:00:00";
            var e_time = endTime + " 00:00:00";
            var type = $("#searchType").val();
            var userID = $("#userOperationID").val();
            var additional = $("#additional").val();
            getAjax('custom/log/get/' + type, {
                s: s_time,
                e: e_time,
                uid: userID,
                a: additional,
                page: page,
                size: 10
            }, function(data) {
                switch (type) {
                    case 'gift_config':
                        backgroundOperation_tables.publicListHtmls(data.dataInfo, function(item) {
                            var split = item.split("/");
                            return "动作: " + (split[3] == 'add' ? "添加礼物" : "减少礼物") + '，礼物id：' + split[5] + '，数量：' + split[6];
                        });
                        break;
                    case 'diamond_config':
                        backgroundOperation_tables.publicListHtmls(data.dataInfo, function(item) {
                            var split = item.split("/");
                            return "动作: " + (split[3] == 'add' ? "添加钻石" : "减少钻石") + '，数量：' + split[5];
                        });
                        break;
                    case 'car_config':
                        backgroundOperation_tables.publicListHtmls(data.dataInfo, function(item) {
                            var split = item.split("/");
                            return "动作: " + (split[3] == 'add' ? "添加座驾" : "减少座驾") + '，座驾id：' + split[5] + '，数量：' + split[6];
                        });
                        break;
                    case 'badge_config':
                        backgroundOperation_tables.publicListHtmls(data.dataInfo, function(item) {
                            var split = item.split("/");
                            return "动作: " + (split[3] == 'add' ? "添加徽章" : "减少徽章") + '，徽章id：' + split[5] + '，数量：' + split[6];
                        });
                        break;
                    case 'level_config':
                        backgroundOperation_tables.publicListHtmls(data.dataInfo, function(item) {
                            var split = item.split("/");
                            return "动作: " + (split[3] == 'add' ? "添加积分" : "减少积分") + '，积分类型：' + (split[5] == '1' ? "用户" : "主播") + '，数量：' + split[6];
                        });
                        break;
                    case 'vip_config':
                        backgroundOperation_tables.publicListHtmls(data.dataInfo, function(item) {
                            var split = item.split("/");
                            return "动作: " + (split[3] == 'add' ? "添加会员" : "减少会员") + '，会员类型：' + (split[5] == '1' ? "vip" : "svip") + '，数量：' + split[6];
                        });
                        break;
                    case 'sign_config':
                        backgroundOperation_tables.publicListHtmls(data.dataInfo, function(item) {
                            var split = item.split("/");
                            return "修改签到: " + '用户id：' + split[3] + '，数量：' + split[4];
                        });
                        break;
                    case 'back_login':
                        backgroundOperation_tables.publicListHtmls(data.dataInfo, function(item) {
                            var split = item.split("/");
                            return "";
                        });
                        break;
                    default:
                        backgroundOperation_tables.publicListHtmls(data.dataInfo);
                }
            })
        },

        // 配置下拉框
        mychangeSearchType: function() {

            $("#searchType").append("<option value='gift_config'>送礼配置</option>");
            $("#searchType").append("<option value='diamond_config'>钻石配置</option>");
            $("#searchType").append("<option value='car_config'>座驾配置</option>");
            $("#searchType").append("<option value='badge_config'>徽章配置</option>");
            $("#searchType").append("<option value='level_config'>等级配置</option>");
            $("#searchType").append("<option value='vip_config'>vip配置</option>");
            $("#searchType").append("<option value='sign_config'>签到配置</option>");
            $("#searchType").append("<option value='back_login'>登录记录</option>");

            $("#operationSearch").unbind("click").click(function() {
                backgroundOperation_tables.getBackLogData(1)
            });
        },
        publicListHtmls: function(data, operHandler) {
            var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead >\
                                <tr class="text-l"><td colspan="6">操作记录查询</td></tr>\
                                <tr class="text-c">\
                                <th >ID</th>\
                                <th >操作人</th>\
                                <th >用户ID</th>\
                                <th >操作详情</th>\
                                <th >结果</th>\
                                <th >时间</th>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="record_operationRecord">\
                                {0}\
                            </tbody>\
                        </table ><div id="user_page_operationRecord"></div>';
            if (data.list && data.list.length > 0) {
                var list = data.list.map(function(item) {
                    var newVar = '发生未知错误';
                    if (!item.request_url) {
                        newVar = 'url为空';
                    } else if (!operHandler) {
                        newVar = item.request_url;
                    } else {
                        try {
                            newVar = operHandler(item.request_url);
                        } catch (err) {
                            console.info(err);
                        }
                    }

                    return '<tr class="text-c">' +
                        '<td>' + item.id + '</td>' +
                        '<td>' + item.oper_user_name + '</td>' +
                        '<td id="add_data">' + item.add_data + '</td>' +
                        '<td id="oper_detail">' + (newVar) + '<span></span></td>' +
                        '<td>' + (item.oper_result_code == 0 ? '成功' : '失败，错误码：' + item.oper_result_code) + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.oper_time)) + '</td>'
                    '</tr>'
                }).join('');
                $("#OperationRecordList").html(util.String.stringFormat(tableHtml, list));
                $("#record_operationRecord").removeClass('hide');
                util.page_html('user_page_operationRecord', data.page, data.pageCount, 'backgroundOperation_tables.getBackLogData');
            } else {
                $('#OperationRecordList').html(util.String.stringFormat(tableHtml, '<tr></tr>'));
                layer.msg('查询内容不存在！')
            }
        }

    });
    backgroundOperation_tables.init();
});