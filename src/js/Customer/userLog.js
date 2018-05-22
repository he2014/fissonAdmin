$(document).ready(function() {
    var userLog_tables = (window["userLog_tables"] = {
        init: function() {
            this.first_change = [true, true, true, true, true, true]; //是否重新异步AJAX
            console.log(JSON.parse(util.Storage.get("item")))
            // this.getLoginLog();
            $("#tab_userLog").Huitab({
                fn: userLog_tables.tabFunction
            });
            this.fresh_first_change()
        },
        fresh_first_change: function() { //值改变重置状态；
            var _this = this;
            var elememt = $('[name="userLogSiginId"]');
            elememt.on('input propertychange', function() {
                _this.first_change.forEach(function(ele, index) {
                    _this.first_change[index] = true;
                })
            })
        },
        tabFunction: function(data) {
            var self = userLog_tables;
            $('.btn').addClass('hide');
            $("#tabindex" + data).removeClass('hide');
            $("#typeFont").addClass('hide')
            $("#balanceSearchType").addClass('hide');
            $("#user_page_SendList").addClass('hide');
            $("#userLogSiginStart").removeClass('hide');
            $("#userLogSiginEnd").removeClass('hide');
            $("#spanStart").removeClass('hide');
            $("#spanEnd").removeClass('hide');
            // $(".holder").addClass('hide');
            switch (data) {
                case 1:
                    $("#export_receive").removeClass('hide');
                    if (self.first_change[data]) {
                        userLog_tables.getReceiveLog();
                        self.getReceiveLog_index = data;
                    }
                    break;
                case 2:
                    if (self.first_change[data]) {
                        userLog_tables.getCostLog();
                        self.getCostLog_index = data;
                    }
                    break;
                case 3:
                    $("#export_balance").removeClass('hide');
                    $("#typeFont").removeClass('hide')
                    $("#balanceSearchType").removeClass('hide')
                    if (self.first_change[data]) {
                        userLog_tables.getBalanceLog();
                        self.getBalanceLog_index = data;

                    }
                    break;
                case 4:
                    if (self.first_change[data]) {
                        userLog_tables.getPurchaseLog();
                        self.getPurchaseLog_index = data;
                    }
                    break;
                case 5:
                    $("#userLogSiginStart").addClass('hide');
                    $("#userLogSiginEnd").addClass('hide');
                    $("#spanStart").addClass('hide');
                    $("#spanEnd").addClass('hide');
                    if (self.first_change[data]) {
                        userLog_tables.getBadgeLog();
                        self.getBadgeLog_index = data;
                    }
                    break;
                default: //首次展开
                    $("#user_page_SendList").removeClass('hide');
                    $("#export_send").removeClass('hide');
                    if (self.first_change[data]) {
                        userLog_tables.getLoginLog();
                        self.getLoginLog_index = data;
                    }
            }
        },
        // 送礼记录
        getLoginLog: function() {
            var _this = this;
            var id = cookie_util.get_cookie('userLogId');
            var startTime = cookie_util.get_cookie('userLogStart');
            var endTime = cookie_util.get_cookie('userLogEnd');
            var data = new Date().getTime();
            // var data = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
            if (!startTime && !endTime) {
                var endTime = data + (24 * 60 * 60 * 1000);
                var startTime = data - (7 * 24 * 60 * 60 * 1000);
            }
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                laydate.render({
                    elem: '#userLogSiginStart', //指定元素
                    type: 'date',
                    range: false,
                    format: 'yyyy-MM-dd',
                    value: util.DateTime.showtime(new Date(startTime))
                });
                laydate.render({
                    elem: '#userLogSiginEnd',
                    type: 'date',
                    range: false,
                    format: 'yyyy-MM-dd',
                    value: util.DateTime.showtime(new Date(endTime))
                });
            });
            if (id != null && startTime && endTime) {
                _this.getSendRecordLog(1, id, startTime, endTime);
                $('input[name="userLogSiginId"]').val(id);
            }
            _this.bindSend();
        },
        bindSend: function() {
            $("#tabindex0").unbind("click").click(function() {
                var id = $('input[name="userLogSiginId"]').val();
                var startTime = $("#userLogSiginStart").val();
                var endTime = $("#userLogSiginEnd").val();
                if (id) {
                    cookie_util.add_or_update_cookie('userLogId', id);
                    userLog_tables.getSendRecordLog(1, id, startTime, endTime);
                } else {
                    layer.msg('请输入用户名！')
                }
            });
            $("#export_send").unbind("click").click(function() {
                var id = $('input[name="userLogSiginId"]').val();
                var startTime = $("#userLogSiginStart").val();
                var endTime = $("#userLogSiginEnd").val();
                var s_time = startTime + " 00:00:00";
                var e_time = endTime + " 00:00:00";
                if (id && startTime && endTime) {
                    var src = paths + 'record/goods/send/excel/' + id + '/' + s_time + '/' + e_time;
                    window.parent.location.href = src;
                } else {
                    layer.msg('你输入的搜索条件不正确')
                }
            });
        },
        getSendRecordLog: function(page, id, startTime, endTime) {
            if (!id) {
                var id = $('input[name="userLogSiginId"]').val();
            }
            if (!startTime) {
                var startTime = $("#userLogSiginStart").val();
            }
            if (!endTime) {
                var endTime = $("#userLogSiginEnd").val();
            }
            var _this = this;
            var s_time = startTime + " 00:00:00";
            var e_time = endTime + " 00:00:00";
            if (id && startTime && endTime) {
                getAjax('record/good/send/' + id, {
                    s: s_time,
                    e: e_time,
                    page: page,
                    size: 10
                }, function(data) {
                    _this.renderSendList(data.dataInfo)
                    cookie_util.add_or_update_cookie('userLogId', id);
                    cookie_util.add_or_update_cookie('userLogStart', startTime);
                    cookie_util.add_or_update_cookie('userLogEnd', endTime);
                    _this.first_change[_this.getLoginLog_index] = false;
                })
            } else {
                layer.msg('你输入的搜索条件不正确')
            }
        },
        renderSendList: function(data) {
            var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover sendRecord">\
                            <thead >\
                                <tr class="text-l"><td colspan="8">送礼记录</td></tr>\
                                <tr class="text-c">\
                                <th >收礼人</th>\
                                <th >赠送房间</th>\
                                <th >礼物</th>\
                                <th >图片</th>\
                                <th >单价</th>\
                                <th >数量</th>\
                                <th >消耗秀币</th>\
                                <th >时间</th>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="record_SendList">\
                                {0}\
                            </tbody>\
                        </table ><div id="user_page_SendList"></div>';
            if (data.list && data.list.length > 0) {
                var list = data.list.map(function(item) {
                    return '<tr class="text-c">' +
                        '<td>' + item.n + '</td>' +
                        '<td>' + item.rm + '</td>' +
                        '<td>' + item.gn + '</td>' +
                        '<td><img style="height:30px;" src=' + serverUrl + item.p + ' /></td>' +
                        '<td>' + item.pr + '</td>' +
                        '<td>' + item.nm + '</td>' +
                        '<td>' + item.c + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.t)) + '</td>' +
                        '</tr>'
                }).join('');
                $("#sendRecord").html(util.String.stringFormat(tableHtml, list));
                $("#record_SendList").removeClass('hide');
                util.page_html('user_page_SendList', data.page, data.pageCount, 'userLog_tables.getSendRecordLog');
            } else {
                $('#sendRecord').html(util.String.stringFormat(tableHtml, '<tr></tr>'));
                layer.msg('查询内容不存在！')
            }
        },
        // 收礼记录
        getReceiveLog: function() {
            var _this = this;
            var id = cookie_util.get_cookie('userLogId');
            var startTime = cookie_util.get_cookie('userLogStart');
            var endTime = cookie_util.get_cookie('userLogEnd');
            if (id != null && startTime && endTime) {
                userLog_tables.getReceiveRecordLog(1, id, startTime, endTime);
                $('input[name="userLogSiginId"]').val(id);
            } else {
                _this.bindReceive();
            }
            _this.bindReceive();
        },
        bindReceive: function() {
            $("#tabindex1").unbind("click").click(function() {
                var id = $('input[name="userLogSiginId"]').val();
                var startTime = $("#userLogSiginStart").val();
                var endTime = $("#userLogSiginEnd").val();
                if (id) {
                    cookie_util.add_or_update_cookie('userLogId', id);
                    userLog_tables.getReceiveRecordLog(1, id, startTime, endTime);
                } else {
                    layer.msg('请输入用户名！')
                }
            });
            $("#export_receive").unbind("click").click(function() {
                var id = $('input[name="userLogSiginId"]').val();
                var startTime = $("#userLogSiginStart").val();
                var endTime = $("#userLogSiginEnd").val();
                var s_time = startTime + " 00:00:00";
                var e_time = endTime + " 00:00:00";
                if (id && startTime && endTime) {
                    var src = paths + 'record/goods/receive/excel/' + id + '/' + s_time + '/' + e_time;
                    window.parent.location.href = src;
                } else {
                    layer.msg('你输入的搜索条件不正确')
                }
            });
        },
        getReceiveRecordLog: function(page, id, startTime, endTime) {
            if (!id) {
                var id = $('input[name="userLogSiginId"]').val();
            }
            if (!startTime) {
                var startTime = $("#userLogSiginStart").val();
            }
            if (!endTime) {
                var endTime = $("#userLogSiginEnd").val();
            }
            var _this = this;
            var s_time = startTime + " 00:00:00";
            var e_time = endTime + " 00:00:00";
            if (id && startTime && endTime) {
                getAjax('record/good/receive/' + id, {
                    s: s_time,
                    e: e_time,
                    page: page,
                    size: 10
                }, function(data) {
                    _this.renderReceiveList(data.dataInfo)
                    cookie_util.add_or_update_cookie('userLogId', id);
                    cookie_util.add_or_update_cookie('userLogStart', startTime);
                    cookie_util.add_or_update_cookie('userLogEnd', endTime);
                    _this.first_change[_this.getReceiveLog_index] = false;
                })
            } else {
                layer.msg('你输入的搜索条件不正确')
            }
        },
        renderReceiveList: function(data) {
            var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead >\
                                <tr class="text-l"><td colspan="7">收礼记录</td></tr>\
                                <tr class="text-c">\
                                <th >送礼人</th>\
                                <th >礼物</th>\
                                <th >图片</th>\
                                <th >单价</th>\
                                <th >数量</th>\
                                <th >消耗秀币</th>\
                                <th >时间</th>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="record_ReceiveList">\
                                {0}\
                            </tbody>\
                        </table ><div id="user_page_ReceiveList"></div>';
            if (data.list && data.list.length > 0) {
                var list = data.list.map(function(item) {
                    return '<tr class="text-c">' +
                        '<td>' + item.n + '</td>' +
                        '<td>' + item.gn + '</td>' +
                        '<td><img style="height:30px;" src=' + serverUrl + item.p + ' /></td>' +
                        '<td>' + item.pr + '</td>' +
                        '<td>' + item.nm + '</td>' +
                        '<td>' + item.c + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.t)) + '</td>' +
                        '</tr>'
                }).join('');
                $("#receiveRecord").html(util.String.stringFormat(tableHtml, list));
                $("#record_ReceiveList").removeClass('hide');
                util.page_html('user_page_ReceiveList', data.page, data.pageCount, 'userLog_tables.getReceiveRecordLog');
            } else {
                $('#receiveRecord').html(util.String.stringFormat(tableHtml, '<tr></tr>'));
                layer.msg('查询内容不存在！')
            }
        },
        // 消费记录
        getCostLog: function() {
            var _this = this;
            var id = cookie_util.get_cookie('userLogId');
            var startTime = cookie_util.get_cookie('userLogStart');
            var endTime = cookie_util.get_cookie('userLogEnd');
            if (id != null && startTime && endTime) {
                userLog_tables.getCostRecordLog(1, id, startTime, endTime);
            } else {
                _this.bindCost();
            }
            _this.bindCost();
        },
        bindCost: function() {
            $("#tabindex2").unbind("click").click(function() {
                var id = $('input[name="userLogSiginId"]').val();
                var startTime = $("#userLogSiginStart").val();
                var endTime = $("#userLogSiginEnd").val();
                if (id) {
                    cookie_util.add_or_update_cookie('userLogId', id);
                    userLog_tables.getCostRecordLog(1, id, startTime, endTime);
                    $('input[name="userLogSiginId"]').val(id);
                } else {
                    layer.msg('请输入用户名！')
                }
            })
        },
        getCostRecordLog: function(page, id, startTime, endTime) {
            if (!id) {
                var id = $('input[name="userLogSiginId"]').val();
            }
            if (!startTime) {
                var startTime = $("#userLogSiginStart").val();
            }
            if (!endTime) {
                var endTime = $("#userLogSiginEnd").val();
            }
            var _this = this;
            var s_time = startTime + " 00:00:00";
            var e_time = endTime + " 00:00:00";
            if (id && startTime && endTime) {
                getAjax('record/cost/' + id, {
                    s: s_time,
                    e: e_time,
                    page: page,
                    size: 10
                }, function(data) {
                    _this.renderCostList(data.dataInfo)
                    cookie_util.add_or_update_cookie('userLogId', id);
                    cookie_util.add_or_update_cookie('userLogStart', startTime);
                    cookie_util.add_or_update_cookie('userLogEnd', endTime);
                    _this.first_change[_this.getCostLog_index] = false;
                })
            } else {
                layer.msg('你输入的搜索条件不正确')
            }
        },
        renderCostList: function(data) {
            var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead >\
                                <tr class="text-l"><td colspan="5">消费记录</td></tr>\
                                <tr class="text-c">\
                                <th >图片</th>\
                                <th >价格</th>\
                                <th >数量</th>\
                                <th >消费</th>\
                                <th >时间</th>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="record_costList">\
                                {0}\
                            </tbody>\
                        </table ><div id="user_page_CostList"></div>';
            if (data.list && data.list.length > 0) {
                var list = data.list.map(function(item) {
                    return '<tr class="text-c">' +
                        '<td><img style="height:30px;" src=' + serverUrl + item.img + ' /></td>' +
                        '<td>' + item.pi + '</td>' +
                        '<td>' + item.num + '</td>' +
                        '<td>' + item.bal + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.tm)) + '</td>' +
                        '</tr>'
                }).join('');
                $("#costRecord").html(util.String.stringFormat(tableHtml, list));
                $("#record_costList").removeClass('hide');
                util.page_html('user_page_CostList', data.page, data.pageCount, 'userLog_tables.getCostRecordLog');
            } else {
                $('#costRecord').html(util.String.stringFormat(tableHtml, '<tr></tr>'));
                layer.msg('查询内容不存在！')
            }
        },
        // 秀币变化
        getBalanceLog: function() {
            var _this = this;
            var id = cookie_util.get_cookie('userLogId');
            var startTime = cookie_util.get_cookie('userLogStart');
            var endTime = cookie_util.get_cookie('userLogEnd');
            if (id != null && startTime && endTime) {
                userLog_tables.getBalanceRecordLog(1, id, startTime, endTime);
            } else {
                _this.bindBalance();
            }
            _this.bindBalance();
        },
        bindBalance: function() {
            $("#tabindex3").unbind("click").click(function() {
                var id = $('input[name="userLogSiginId"]').val();
                var startTime = $("#userLogSiginStart").val();
                var endTime = $("#userLogSiginEnd").val();
                if (id) {
                    cookie_util.add_or_update_cookie('userLogId', id);
                    userLog_tables.getBalanceRecordLog(1, id, startTime, endTime);
                    $('input[name="userLogSiginId"]').val(id);
                } else {
                    layer.msg('请输入用户名！')
                }
            });
            $("#export_balance").unbind("click").click(function() {
                var id = $('input[name="userLogSiginId"]').val();
                var startTime = $("#userLogSiginStart").val();
                var endTime = $("#userLogSiginEnd").val();
                var s_time = startTime + " 00:00:00";
                var e_time = endTime + " 00:00:00";
                if (id && startTime && endTime) {
                    var src = paths + 'record/balance/excel/' + id + '/' + s_time + '/' + e_time;
                    window.parent.location.href = src;
                } else {
                    layer.msg('你输入的搜索条件不正确')
                }
            });
        },
        getBalanceRecordLog: function(page, id, startTime, endTime) {
            if (!id) {
                var id = $('input[name="userLogSiginId"]').val();
            }
            if (!startTime) {
                var startTime = $("#userLogSiginStart").val();
            }
            if (!endTime) {
                var endTime = $("#userLogSiginEnd").val();
            }
            var _this = this;
            var type = $("#balanceSearchType").val();
            var s_time = startTime + " 00:00:00";
            var e_time = endTime + " 00:00:00";
            if (id && startTime && endTime) {
                getAjax('record/balance/' + type + "/" + id, {
                    s: s_time,
                    e: e_time,
                    page: page,
                    size: 10,
                    type: type
                }, function(data) {
                    _this.renderBalanceList(data.dataInfo)
                    cookie_util.add_or_update_cookie('userLogId', id);
                    cookie_util.add_or_update_cookie('userLogStart', startTime);
                    cookie_util.add_or_update_cookie('userLogEnd', endTime);
                    _this.first_change[_this.getBalanceLog_index] = false;
                })
            } else {
                layer.msg('你输入的搜索条件不正确')
            }
        },
        renderBalanceList: function(data) {
            var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead >\
                                <tr class="text-l"><td colspan="8">秀币变化</td></tr>\
                                <tr class="text-c">\
                                <th >用户</th>\
                                <th >剩余秀币</th>\
                                <th >剩余秀豆</th>\
                                <th >秀币变化</th>\
                                <th >秀豆变化</th>\
                                <th >时间</th>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="record_BalanceList">\
                                {0}\
                            </tbody>\
                        </table ><div id="user_page_BalanceList"></div>';
            if (data.list && data.list.length > 0) {
                var list = data.list.map(function(item) {
                    var balanceChange = "";
                    var return_balanceChange = ""
                    if (item.record_type == 0) {
                        balanceChange = item.balance;
                        return_balanceChange = item.return_balance;
                    } else if (item.record_type == 1) {
                        balanceChange = -item.balance;
                        return_balanceChange = -item.return_balance;
                    }
                    return '<tr class="text-c">' +
                        '<td>' + item.user_id + '</td>' +
                        '<td>' + item.current_balance + '</td>' +
                        '<td>' + item.current_return_balance + '</td>' +
                        '<td>' + balanceChange + '</td>' +
                        '<td>' + return_balanceChange + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.record_time)) + '</td>' +
                        '</tr>'
                }).join('');
                $("#balanceRecord").html(util.String.stringFormat(tableHtml, list));
                $("#record_BalanceList").removeClass('hide');
                util.page_html('user_page_BalanceList', data.page, data.pageCount, 'userLog_tables.getBalanceRecordLog');
            } else {
                $('#balanceRecord').html(util.String.stringFormat(tableHtml, '<tr></tr>'));
                layer.msg('查询内容不存在！')
            }
        },
        // 购买记录
        getPurchaseLog: function() {
            var _this = this;
            var id = cookie_util.get_cookie('userLogId');
            var startTime = cookie_util.get_cookie('userLogStart');
            var endTime = cookie_util.get_cookie('userLogEnd');
            if (id != null && startTime && endTime) {
                userLog_tables.getPurchaseRecordLog(1, id, startTime, endTime);
                $('input[name="userLogSiginId"]').val(id);
            } else {
                _this.bindPurchase();
            }
            _this.bindPurchase();
        },
        bindPurchase: function() {
            $("#tabindex4").unbind("click").click(function() {

                var id = $('input[name="userLogSiginId"]').val();
                var startTime = $("#userLogSiginStart").val();
                var endTime = $("#userLogSiginEnd").val();
                if (id) {
                    cookie_util.add_or_update_cookie('userLogId', id);
                    userLog_tables.getPurchaseRecordLog(1, id, startTime, endTime);
                } else {
                    layer.msg('请输入用户名！')
                }
            })
        },
        getPurchaseRecordLog: function(page, id, startTime, endTime) {
            if (!id) {
                var id = $('input[name="userLogSiginId"]').val();
            }
            if (!startTime) {
                var startTime = $("#userLogSiginStart").val();
            }
            if (!endTime) {
                var endTime = $("#userLogSiginEnd").val();
            }
            var _this = this;
            var s_time = startTime + " 00:00:00";
            var e_time = endTime + " 00:00:00";
            if (id && startTime && endTime) {

                getAjax('record/shop/' + id, {
                    s: s_time,
                    e: e_time,
                    page: page,
                    size: 10
                }, function(data) {
                    _this.renderPurchaseList(data.dataInfo)
                    cookie_util.add_or_update_cookie('userLogId', id);
                    cookie_util.add_or_update_cookie('userLogStart', startTime);
                    cookie_util.add_or_update_cookie('userLogEnd', endTime);
                    _this.first_change[_this.getPurchaseLog_index] = false;
                })
            } else {
                layer.msg('你输入的搜索条件不正确')
            }
        },
        renderPurchaseList: function(data) {
            var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead >\
                                <tr class="text-l"><td colspan="8">购买记录</td></tr>\
                                <tr class="text-c">\
                                <th >图片</th>\
                                <th >商品类型</th>\
                                <th >单价</th>\
                                <th >过期时间</th>\
                                <th >数量</th>\
                                <th >秀币</th>\
                                <th >秀豆</th>\
                                <th >购买时间</th>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="record_PurchaseList">\
                                {0}\
                            </tbody>\
                        </table ><div id="user_page_PurchaseList"></div>';
            if (data.list && data.list.length > 0) {
                var list = data.list.map(function(item) {
                    return '<tr class="text-c">' +
                        '<td><img style="height:30px;" src=' + serverUrl + item.pic + ' /></td>' +
                        '<td>' + item.specialType + '</td>' +
                        '<td>' + item.balance + '</td>' +
                        '<td>' + item.expireTime + '</td>' +
                        '<td>' + item.number + '</td>' +
                        '<td>' + item.costBalance + '</td>' +
                        '<td>' + item.costReturnBalance + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.buyTime)) + '</td>' +
                        '</tr>'
                }).join('');
                $("#purchaseRecord").html(util.String.stringFormat(tableHtml, list));
                $("#record_PurchaseList").removeClass('hide');
                util.page_html('user_page_PurchaseList', data.page, data.pageCount, 'userLog_tables.getPurchaseRecordLog');
            } else {
                $('#purchaseRecord').html(util.String.stringFormat(tableHtml, '<tr></tr>'));
                layer.msg('查询内容不存在！')
            }
        },
        // 徽章记录
        getBadgeLog: function() {
            var _this = this;
            var id = cookie_util.get_cookie('userLogId');
            if (id != null) {
                userLog_tables.getBadgeRecordLog(1, id);
                $('input[name="userLogSiginId"]').val(id);
            } else {
                _this.bindBadge();
            }
            _this.bindBadge();
        },
        bindBadge: function() {
            $("#tabindex5").unbind("click").click(function() {
                var id = $('input[name="userLogSiginId"]').val();
                if (id) {
                    cookie_util.add_or_update_cookie('userLogId', id);
                    userLog_tables.getBadgeRecordLog(1, id);
                } else {
                    layer.msg('请输入用户名！')
                }
            })
        },
        getBadgeRecordLog: function(page, id) {
            if (!id) {
                var id = $('input[name="userLogSiginId"]').val();
            }
            var _this = this;
            if (id) {
                getAjax('record/badge/recharge/' + id, {}, function(data) {
                    _this.renderBadgeList(data.dataInfo)
                    cookie_util.add_or_update_cookie('userLogId', id);
                    _this.first_change[_this.getBadgeLog_index] = false;
                })
            } else {
                layer.msg('你输入的搜索条件不正确')
            }
        },
        renderBadgeList: function(data) {
            var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead >\
                                <tr class="text-l"><td colspan="6">徽章记录</td></tr>\
                                <tr class="text-c">\
                                <th >用户ID</th>\
                                <th >勋章等级</th>\
                                <th >勋章类型</th>\
                                <th >过期时间</th>\
                                <th >状态</th>\
                                <th >创建时间</th>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="record_BadgeList">\
                                {0}\
                            </tbody>\
                        </table ><div id="user_page_BadgeList"></div>';
            var rechargeTable = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead >\
                                <tr class="text-l"><td colspan="4">充值记录</td></tr>\
                                <tr class="text-c">\
                                <th >用户ID</th>\
                                <th >原充值</th>\
                                <th >新增值</th>\
                                <th >充值时间</th>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="record_rechargeList">\
                                {0}\
                            </tbody>\
                        </table >';
            if (data) {
                var badgeCosts = '<span style="color:red;line-height: 30px;">备注 ：充值累计<span style="color:green">' + data.ba20003 + '</span>获得星星勋章，充值累计<span style="color:green">' + data.ba20004 + '</span>获得钻石勋章，充值累计<span style="color:green">' + data.ba20005 + '</span>获得皇冠勋章,周期时间过后充值金额清零处理(周期时间为当前显示勋章过期时间)。</span>';
                $("#badgeCost").html(badgeCosts);
                if (data.rtf == 2) {
                    var rti = util.DateTime.fulltime(new Date(data.rti))
                    var rechargeCosts = '<span style="color:green;line-height: 30px;">个人充值数据 : 截至 （' + rti + '）累计充值（' + data.rt + '）</span>';
                } else if (data.rtf == 1) {
                    var rechargeCosts = '<span style="color:green;line-height: 30px;">个人充值数据 : 无充值数据</span>';
                }
                $("#rechargeCost").html(rechargeCosts);
            } else {
                $("#badgeCost").html('<span style="color:red;line-height: 30px;">备注 : 充值累计获得星星勋章，充值累计获得钻石勋章，充值累计获得皇冠勋章,周期时间过后充值金额清零处理(周期时间为当前显示勋章过期时间)。</span>');
                $("#rechargeCost").html('<span></span>');
            }
            if (data && data.badges.length > 0) {
                // 徽章列表
                var list = data.badges.map(function(item) {
                    var now = new Date().getTime();
                    var newTime = util.DateTime.showtime(new Date(now))
                    var expire = util.DateTime.showtime(new Date(item.expire_time))
                    if (newTime > expire) {
                        var state = "已过期"
                    } else {
                        state = "未过期"
                    }
                    var badgeType = ""
                    if (item.badge_level == 20003) {
                        badgeType = '星星';
                    } else if (item.badge_level == 20004) {
                        badgeType = '钻石';
                    } else if (item.badge_level == 20005) {
                        badgeType = '皇冠';
                    }
                    return '<tr class="text-c">' +
                        '<td>' + item.user_id + '</td>' +
                        '<td>' + item.badge_level + '</td>' +
                        '<td>' + badgeType + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.expire_time)) + '</td>' +
                        '<td>' + state + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                        '</tr>'
                }).join('');
                $("#badgeRecord").html(util.String.stringFormat(tableHtml, list));
                $("#record_BadgeList").removeClass('hide');
            } else {
                $('#badgeRecord').html(util.String.stringFormat(tableHtml, '<tr></tr>'));
                // layer.msg('徽章列表不存在！')
            }
            if (data && data.recharges.length > 0) {
                // 充值列表
                var _this = this;
                this.roomListtimeOut = null;
                var rechargelist = data.recharges.map(function(items) {
                    return '<tr class="text-c">' +
                        '<td>' + items.user_id + '</td>' +
                        '<td>' + items.level_score_old + '</td>' +
                        '<td>' + items.add_socre + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(items.create_date)) + '</td>' +
                        '</tr>'
                }).join('');
                $("#rechargeRecord").html(util.String.stringFormat(rechargeTable, rechargelist));
                $("#record_rechargeList").removeClass('hide');
                _this.roomListtimeOut = setTimeout(function() {
                    $("div.holder").removeClass('hide');
                    $("div.holder").jPages({
                        containerID: "record_rechargeList",
                        first: "首页",
                        last: "尾页",
                        next: "下一页",
                        previous: "上一页"
                    });
                }, 500);
            } else {
                $("#rechargeRecord").html(util.String.stringFormat(rechargeTable, '<tr></tr>'));
                // layer.msg('充值记录不存在！')
                $("div.holder").addClass('hide');
            }
        }
    });
    userLog_tables.init();
});