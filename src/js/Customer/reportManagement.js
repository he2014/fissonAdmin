$(document).ready(function() {
    var stringFormat = util.String.stringFormat;
    var sysVersion = 0;
    var reasonzu = 1;
    var violationTotal = 0;
    var reportManagement_tables = (window["reportManagement_tables"] = {
        init: function() {
            this.bool = false;
            var _this = this;
            _this.getReportList(1);
            _this.binds();
        },
        // 获取举报列表
        getReportList: function() {
            var _this = this;
            getAjax('custom/report/host/get/all', {
                page: 1,
                size: 10
            }, function(data) {
                _this.getReportListHtmls(data.dataInfo)
                _this.binds();
                util.functions();
            })
        },
        // 处理举报列表数据
        getReportListHtmls: function(data) {
            var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead >\
                                <tr class="text-l"><td colspan="7">主播举报信息列表</td></tr>\
                                <tr class="text-c">\
                                <th >房间ID</th>\
                                <th >举报人</th>\
                                <th >举报主播</th>\
                                <th >举报名称</th>\
                                <th >举报内容</th>\
                                <th >举报次数</th>\
                                <th >操作</th>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="record_ReportList">\
                                {0}\
                            </tbody>\
                        </table ><div id="user_page_ReportList"></div>';
            if (data.list && data.list.length > 0) {
                var list = data.list.map(function(item) {
                    var to_user_nick = item.to_user_nick || " ";
                    var from_user_nick = item.from_user_nick || " ";
                    return '<tr class="text-c">' +
                        '<td>' + item.room_id + '</td>' +
                        '<td>' + to_user_nick + '</td>' +
                        '<td>' + from_user_nick + '</td>' +
                        '<td>' + item.contName + '</td>' +
                        '<td>' + item.contMessage + '</td>' +
                        '<td>' + item.total + '</td>' +
                        '<td><a data-roleId="' +
                        item.room_id +
                        '"data-userId="' +
                        item.from_user_id +
                        '" href="javascript:;" class="layui-btn layui-btn-sm reportDetail">详情</a><a data-btn="pageReportStopBtn" data-roleId="' +
                        item.room_id +
                        '" href="javascript:;" class="layui-btn layui-btn-sm stopBtn hide">停止直播</a><a href="' +
                        item.webDomain + "live/" + item.roomSurfing + '" class="layui-btn layui-btn-sm" target ="_blank" >进入房间</a></td>' +
                        '</tr>'
                }).join('');
                $("#reportManagementList").html(util.String.stringFormat(tableHtml, list));
                $("#record_ReportList").removeClass('hide');
                util.page_html('user_page_ReportList', data.page, data.pageCount, 'reportManagement_tables.getReportList');
            } else {
                $('#reportManagementList').html(util.String.stringFormat(tableHtml, '<tr></tr>'));
                layer.msg('查询内容不存在！')
            }
        },
        binds: function() {
            var _this = this;
            $(".reportDetail").off('click').on('click', function() {
                var rid = $(this).attr("data-roleId");
                var uid = $(this).attr("data-userId");
                getAjax("custom/report/host/detail/" + rid + "/" + uid, {}, function(data) {
                    var table_list_chat = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="7">\
                                  停播记录\
                                </td>\
                                </tr>\
                                <tr class="text-c">\
                                    <th>房间Id</th>\
                                    <th>举报人</th>\
                                    <th>主播id</th>\
                                    <th>主播名称</th>\
                                    <th>举报名称</th>\
                                    <th>举报内容</th>\
                                    <th>时间</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table >';
                    if (data.dataInfo) {
                        var chatRoomList = data.dataInfo.map(function(item) {
                            return '<tr>' +
                                '<td>' + item.room_id + '</td>' +
                                '<td>' + item.to_user_nick + '</td>' +
                                '<td>' + item.from_user_id + '</td>' +
                                '<td>' + item.from_user_nick + '</td>' +
                                '<td>' + item.content_name + '</td>' +
                                '<td>' + item.source_message + '</td>' +
                                '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                                '</tr>'
                        }).join('');
                        layer.open({
                            type: 1,
                            title: '拦截详细信息',
                            // btn: ['确定', '取消'],
                            skin: 'layui-layer-rim', //加上边框
                            area: ['1000px', '480px'], //宽高
                            content: util.String.stringFormat(table_list_chat, chatRoomList),
                            yes: function(index, layero) {},
                            btn2: function(index) {
                                layer.close(index)
                            }
                        });
                    }
                })
            })
            // stop弹窗
            $(".stopBtn").unbind("click").click(function() {
                $("#stopDetails").modal("show");
                var stopRecordingId = $(this).attr("data-roleId");
                cookie_util.add_or_update_cookie('roomIds', stopRecordingId);
                reportManagement_tables.stopRecordingList(stopRecordingId);
                reportManagement_tables.getSystemVersion(stopRecordingId);
            });
            // stop弹窗A、B键
            $("#yhButton").unbind("click").click(function() {
                reportManagement_tables.switchReason(1, _this.sysVersion)
            });
            $("#jgButton").unbind("click").click(function() {
                reportManagement_tables.switchReason(2, _this.sysVersion)
            });
            // stop-点击获取警告原因
            $(".clickChange").off().on("click", "tr", function(e) {
                $(this).addClass("hotonline").siblings("tr").removeClass("hotonline");
                var showReasonIndexId = $(this).attr("data-Id");
                var reasonnumss = Number(showReasonIndexId) + 1;
                cookie_util.add_or_update_cookie('reasonnums', reasonnumss);
            });
            //stop-语言切换
            $("input").unbind("click").click(function() {
                $(".lang").hide()
                var lan = $("input[name='demo-radio']:checked").val();
                $(".language" + lan).show()
                reportManagement_tables.bool = true;
            })
            // stop弹窗提交
            $("#submitStopDetail").unbind("click").click(function() {
                reportManagement_tables.stop_host_live()
            });
        },
        // 获取stop记录
        stopRecordingList: function(stopRecordingId) {
            var _this = this;
            var roomid = stopRecordingId;
            var datas = {};
            $.ajax({
                type: "get",
                url: paths + "host/stop/live/history/" + roomid,
                async: false,
                dataType: "json",
                data: datas,
                success: function(data) {
                    if (data.code == 0) {
                        if (
                            data.dataInfo &&
                            data.dataInfo.length > 0
                        ) {
                            var htmls = reportManagement_tables.stopRecordingHtmls(data.dataInfo);
                            $("#stopDetailsList").html(htmls);
                            _this.binds();
                        } else {
                            $("#stopDetailsList").html(" ");
                        }
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        },
        stopRecordingHtmls: function(datas) {
            var htmls = "";
            if (datas) {
                $.each(datas, function(index, sr) {
                    var group = sr.irregulariy_group
                    var reasonId = sr.irregulariy_id;
                    if (group == 1) {
                        groupName = "A";
                    } else {
                        groupName = "B";
                        bReasonTotal = sr.toal_num;
                        violationTotal += 1;
                    }
                    htmls +=
                        '<tr><td>' +
                        groupName + '-' + reasonId +
                        '</td><td>' +
                        sr.toal_num +
                        '次</td></tr>';
                });
                return htmls;
            } else {
                return "";
            }
        },
        //stop原因,获取环境，禁用按键
        getSystemVersion: function() {
            var _this = this;
            var datas = {};
            $.ajax({
                type: "get",
                url: paths + "system/env",
                async: false,
                dataType: "json",
                data: datas,
                success: function(data) {
                    if (data.code == 0) {
                        if (data.dataInfo == "ar") {
                            $('input:radio[value="3"]').prop('checked', true);
                            $('input:radio[value="2"]').prop('disabled', true);

                            _this.sysVersion = 1
                            $(".zhongdong").show()
                            $('.tuerqi').hide()
                            reportManagement_tables.switchReason(1, 1);
                        } else {
                            $('input:radio[value="3"]').prop('checked', true);
                            $('input:radio[value="1"]').prop('disabled', true);
                            _this.sysVersion = 2;
                            $('.tuerqi').show()
                            $(".zhongdong").hide()
                            reportManagement_tables.switchReason(1, 3);
                        }
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        },
        // stop原因
        switchReason: function(type, sysVersio, bool) {
            var _this = this;
            this.type = type;
            var reasonzu = 1;
            var reasonnum = 1;
            var bReasonTotal = 0;
            $("#yhButton").removeClass("on");
            $("#jgButton").removeClass("on");
            if (!this.bool) {
                $(".language3").show().siblings().hide();

            }
            reasonzu = type;
            cookie_util.add_or_update_cookie('reasonzus', reasonzu);
            if (type == 1) {
                $("#yhButton").addClass("on");
                $(".suggestions").show().siblings(".violation").hide()
            } else if (type == 2) {
                $("#jgButton").addClass("on");
                $(".violation").show().siblings(".suggestions").hide()
            }
            // 中东环境stop原因列表
            var ArSuAr = "";
            $.each(stop_reason_ar_util.scam_ar, function(idx, obj) {
                var indexArs = parseInt(idx);
                if (indexArs == 0) {
                    ArSuAr += "<tr id='scam" + idx + "' class='hotonline' data-Id=" + idx + "><td>" + (indexArs + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                } else {
                    ArSuAr += "<tr id='scam" + idx + "' data-Id=" + idx + " ><td>" + (indexArs + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                }
            });
            var ArSuEn = "";
            $.each(stop_reason_ar_util.scam_en, function(idx, obj) {
                var indexEns = parseInt(idx);
                if (indexEns == 0) {
                    ArSuEn += "<tr id='scam" + idx + "' class='hotonline' data-Id=" + idx + "><td>" + (indexEns + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                } else {
                    ArSuEn += "<tr id='scam" + idx + "' data-Id=" + idx + "><td>" + (indexEns + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                }
            });
            var ArViAr = "";
            $.each(stop_reason_ar_util.law_ar, function(idx, obj) {
                var indexArv = parseInt(idx);
                if (indexArv == 0) {
                    ArViAr += "<tr id='law" + idx + "' class='hotonline'  data-Id=" + idx + "><td>" + (indexArv + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                } else {
                    ArViAr += "<tr id='law" + idx + "' data-Id=" + idx + "><td>" + (indexArv + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                }
            });
            var ArViEn = "";
            $.each(stop_reason_ar_util.law_en, function(idx, obj) {
                var indexEnv = parseInt(idx);
                if (indexEnv == 0) {
                    ArViEn += "<tr id='law" + idx + "' class='hotonline' data-Id=" + idx + "><td>" + (indexEnv + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                } else {
                    ArViEn += "<tr id='law" + idx + "' data-Id=" + idx + "><td>" + (indexEnv + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                }
            });

            // 土耳其环境stop原因列表
            var tuSuTr = "";
            $.each(stop_reason_util.scam_tr, function(idx, obj) {
                var indexTrs = parseInt(idx);
                if (indexTrs == 0) {
                    tuSuTr += "<tr id='scam" + idx + "' class='hotonline law'  onclick='showReasonIndex(this," + idx + ")'><td>" + (indexTrs + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                } else {
                    tuSuTr += "<tr id='scam" + idx + "' class='law' onclick='showReasonIndex(this," + idx + ")'><td>" + (indexTrs + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                }
            });
            var tuSuEn = "";
            $.each(stop_reason_util.scam_en, function(idx, obj) {
                var indexEns = parseInt(idx);
                if (indexEns == 0) {
                    tuSuEn += "<tr id='scam" + idx + "' class='hotonline'  onclick='showReasonIndex(this," + idx + ")'><td>" + (indexEns + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                } else {
                    tuSuEn += "<tr id='scam" + idx + "' onclick='showReasonIndex(this," + idx + ")'><td>" + (indexEns + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                }
            });
            var tuViTr = "";
            $.each(stop_reason_util.law_tr, function(idx, obj) {
                var indexTrv = parseInt(idx);
                if (indexTrv == 0) {
                    tuViTr += "<tr id='law" + idx + "' class='hotonline law'  onclick='showReasonIndex(this," + idx + ")'><td>" + (indexTrv + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                } else {
                    tuViTr += "<tr id='law" + idx + "' class='law' onclick='showReasonIndex(this," + idx + ")'><td>" + (indexTrv + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                }
            });
            var tuViEn = "";
            $.each(stop_reason_util.law_en, function(idx, obj) {
                var indexEnv = parseInt(idx);
                if (indexEnv == 0) {
                    tuViEn += "<tr id='law" + idx + "' class='hotonline'  onclick='showReasonIndex(this," + idx + ")'><td>" + (indexEnv + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                } else {
                    tuViEn += "<tr id='law" + idx + "' onclick='showReasonIndex(this," + idx + ")'><td>" + (indexEnv + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;" + obj + "</td></tr>";
                }
            });
            // 中东插入
            $("#ArsuAr_list").html(ArSuAr);
            $("#ArsuEn_list").html(ArSuEn);
            $("#ArviAr_list").html(ArViAr);
            $("#ArviEn_list").html(ArViEn);
            // 土耳其插入
            $("#TrsuTr_list").html(tuSuTr);
            $("#TrsuEn_list").html(tuSuEn);
            $("#TrviTr_list").html(tuViTr);
            $("#TrviEn_list").html(tuViEn);
            $(".lang").hide()
            var lan = $("input[name='demo-radio']:checked").val();
            $(".language" + lan).show()
            $("#noteDetails").val("");
        },
        // stop提交数据
        stop_host_live: function() {
            var _this = this;
            var roomId = cookie_util.get_cookie('roomIds');
            var language = $('input[name="demo-radio"]:checked ').val();
            var noteDetails = $("#noteDetails").val();
            var reasonnum = cookie_util.get_cookie('reasonnums');
            var reasonzu = cookie_util.get_cookie('reasonzus');
            if (reasonzu == 2) {
                if (violationTotal >= 2) {
                    var index = layer.confirm('Anchor warning has ' + violationTotal + ' times, off again, the host will disable accounts!', {
                        btn: ['confirm', 'cancel'],
                        icon: 3
                    }, function() {
                        postAjax("host/stop/live", {
                            "ri": roomId,
                            "rg": reasonzu,
                            "r": (reasonnum),
                            "m": noteDetails,
                            "l": language
                        }, function(data) {
                            if (data.code == 0) {
                                layer.msg("停播成功！");
                                layer.close(index);
                                _this.getReportList(1);
                            } else {
                                layer.msg("错误！");
                            }
                        });
                    });
                } else {
                    postAjax("host/stop/live", {
                        "ri": roomId,
                        "rg": reasonzu,
                        "r": (reasonnum),
                        "m": noteDetails,
                        "l": language
                    }, function(data) {
                        if (data.code == 0) {
                            layer.msg("停播成功！");
                            $("#stopDetails").modal("hide");
                            _this.getReportList(1);
                        } else {
                            layer.msg("错误！");
                        }
                    });
                }
            } else {
                postAjax("host/stop/live", {
                    "ri": roomId,
                    "rg": reasonzu,
                    "r": (reasonnum),
                    "m": noteDetails,
                    "l": language
                }, function(data) {
                    if (data.code == 0) {
                        layer.msg("停播成功！");
                        $("#stopDetails").modal("hide");
                        _this.getReportList(1);
                    } else {
                        layer.msg("错误！");
                    }
                });
            }
        }
    });
    reportManagement_tables.init();
});