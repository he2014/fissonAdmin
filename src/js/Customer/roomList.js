$(document).ready(function() {
    var stringFormat = util.String.stringFormat;
    var sysVersion = 0;
    var reasonzu = 1;
    var violationTotal = 0;
    var roomList_tables = (window["roomList_tables"] = {
        init: function() {
            this.bool = false;
            var _this = this;
            _this.changeSearchType();
            _this.getRoomList(1);
        },
        changeSearchType: function() {
            var _this = this;
            $("#changeSearchType").bind("change", function() {
                var val = $(this).val();
                var text = $('#changeSearchId');
                if (val == 0) {
                    text.val("");
                    text.addClass('hide')
                    $('#changeSearchShow').show();
                    $('#changeSearchRoomtype').show();
                    $(".show_state").show();
                    $(".room_type").show();
                } else if (val == 3) {
                    text.val("");
                    text.addClass('hide')
                    $('#changeSearchShow').hide();
                    $('#changeSearchRoomtype').hide();
                    $(".show_state").hide();
                    $(".room_type").hide();
                } else {
                    text.removeAttr("disabled");
                    text.val("");
                    if (val == 2) {
                        text.removeClass('hide')
                        text.attr("placeholder", "请输入房间编号");
                        $('#changeSearchShow').hide();
                        $('#changeSearchRoomtype').hide();
                        $(".show_state").hide();
                        $(".room_type").hide();
                    } else {}
                }
            });
            $("#roomSearchSubmit").unbind("click").click(function() {
                _this.getRoomList(1);
            })
        },
        // 获取房间列表
        getRoomList: function(page, type, show, roomtype, value) {
            var type = $("#changeSearchType").val();
            var show = $("#changeSearchShow").val();
            var roomtype = $("#changeSearchRoomtype").val();
            var valuee = $("#changeSearchId").val();
            if (type == 2) {
                if (valuee == "") {
                    layer.msg("id不能为空");
                } else {
                    var value = valuee;
                }
            } else if (type == 0) {
                var value = 0;
            } else if (type == 3) {
                var value = 0;
            }
            var _this = this;
            var datas = {
                page: page,
                size: 10
            };
            $.ajax({
                type: "get",
                url: paths + "host/all/" + type + "/" + value + "/" + show + "/" + roomtype,
                async: false,
                dataType: "json",
                data: datas,
                success: function(data) {
                    // console.log(data)
                    if (data.code == 0) {
                        if (
                            data.dataInfo.list &&
                            data.dataInfo.list.length > 0
                        ) {
                            var htmls = roomList_tables.getRoomListHtmls(data.dataInfo.list);
                            $("#roomList").html(htmls);

                            _this.binds();
                            util.page_html(
                                "room_layerPage",
                                data.dataInfo.page,
                                data.dataInfo.pageCount,
                                "roomList_tables.getRoomList"
                            );
                            util.functions();
                            _this.roomList_edit();
                        } else {
                            $("#roomList").html(" ");
                        }

                    } else {
                        if (data.code == 99) {
                            window.location.href = window.location.href.replace(
                                "index.html",
                                "login.html"
                            );
                        } else if (data.code == 93) {
                            window.parent.location.href = window.parent.location.href.replace(
                                "index.html",
                                "login.html"
                            );
                        }
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        },
        roomList_edit: function() {
            var resourceId = util.Storage.get("resourceId");
            var local_change = cookie_util.get_cookie('local_change');
            if (local_change == 'LOCAL_CAHNGE_' + resourceId) {
                $('a[data-name="showPriorityEdit"]').editable({
                    success: roomList_tables.editableCallback
                });
                $('a[data-name="roomTypeEdit"]').editable({
                    source: [{
                            value: 1,
                            text: 'PGC'
                        },
                        {
                            value: 2,
                            text: 'UGC'
                        }
                    ],
                    success: roomList_tables.editableCallback
                });
                $('a[data-name="voiceEdit"]').editable({
                    source: [{
                            value: 1,
                            text: '是'
                        },
                        {
                            value: 0,
                            text: '否'
                        }
                    ],
                    success: roomList_tables.editableCallback
                });
            }
        },
        // 处理房间列表数据
        getRoomListHtmls: function(datas) {
            var htmls = "";
            if (datas) {
                $.each(datas, function(index, u) {
                    var roomPIc = '<img id="PostPic" class="postPicChange" src={0} />'
                    var roomPostPic = u.roomVtPosterPic ? util.String.stringFormat(roomPIc, serverUrl + u.roomVtPosterPic) : '<img id="PostPic" class="postPicChange"  src="../../images/nophoto.jpg">';
                    var roomTypes = u.roomType == 1 ? 'PGC' : 'UGC';
                    var voice = u.isVoice == 1 ? '是' : '否';
                    var states = "";
                    var disable = u.state == 2 && 7 ? '开启直播' : '禁止直播';
                    var online = u.actorIng == 0 ? 'background-color:;' : 'background-color:red;'
                    switch (u.state) {
                        case 0:
                            states = "未定义";
                            break;
                        case 1:
                            states = "审核通过";
                            break;
                        case 2:
                            states = "禁用主播";
                            break;
                        case 3:
                            states = "隐藏";
                            break;
                        case 4:
                            states = "置顶推荐";
                            break;
                        case 5:
                            states = "首次开通";
                            break;
                        case 6:
                            states = "直播推荐";
                            break;
                        case 7:
                            states = "犯规禁用";
                            break;
                    }
                    htmls +=
                        '<tr><td id="roomPoster" class="roomPoster" data-roleId="' +
                        u.roomId +
                        '" data-userId="' +
                        u.uid +
                        '">' + roomPostPic + '</td><td style="width:75px;' + online + '">' +
                        u.uid +
                        '</td><td>' +
                        u.nickName +
                        '</td><td>' +
                        u.guestUser +
                        '</td><td>' +
                        u.lastLiveDate +
                        '</td><td><a href="#" data-name="roomTypeEdit" data-type="select" data-pk="1" data-url="' + paths + 'host/update/pgcugc/' + u.uid + '/' + u.roomId + '" data-title="请选择房间类型">' + roomTypes + '</a></td>' +
                        '<td><a href="#" data-name="voiceEdit" data-type="select" data-pk="1" data-url="' + paths + 'host/update/voice/' + u.uid + '/' + u.roomId + '" data-title="请选择是否是声音主播">' + voice + '</a></td>' +
                        '<td><a href="#" data-name="showPriorityEdit" data-type="text" data-pk="1" data-url="' + paths + 'host/update/showproperity/' + u.uid + '/' + u.roomId + '" data-title="请输入排序编号">' +
                        u.showPriority + '</a></td><td>' +
                        states +
                        '</td><td><a data-btn="pageGuestUsert" data-roleId="' +
                        u.roomId +
                        '" data-roleName="' +
                        u.guestUser +
                        '" href="javascript:;" class="btn btn-primary size-S radius guestUser">获取用户</a><a data-btn="pagePlayVideo" data-roleId="' +
                        u.roomId +
                        '" data-roleName="' +
                        u.videoAddress +
                        '" href="javascript:;" class="btn btn-primary size-S radius playVideo">播放视频</a><a data-btn="pageStopBtn" data-roleId="' +
                        u.roomId +
                        '" href="javascript:;" class="btn btn-primary size-S radius stopBtn hide">STOP</a><a data-btn="pagePlayRecording" data-roleId="' +
                        u.roomId +
                        '" href="javascript:;" class="btn  btn-primary size-S radius playRecording">播放记录</a><a data-btn="pageStopPlayRecording" data-roleId="' +
                        u.roomId +
                        '" data-roleName="' +
                        u.loginName +
                        '" href="javascript:;" class="btn btn-primary size-S radius stopPlayRecording">停播记录</a><a data-btn="pageBannedBtn" data-roleId="' +
                        u.roomId +
                        '" data-userId="' +
                        u.uid +
                        '" href="javascript:;" class="btn btn-primary size-S radius bannedBtn hide">' + disable + '</a></td></tr>';
                });
                return htmls;
            } else {
                return "";
            }
        },
        binds: function() {
            var _this = this;

            // 获取用户
            $(".guestUser").unbind("click").click(function() {
                $("#guestUserDetails").modal("show");
                var guestUserId = $(this).attr("data-roleId");
                roomList_tables.guestUserList(guestUserId);
            });
            // 获取用户--禁言
            $(".MuteBtn").unbind("click").click(function() {
                var muteRid = $(this).attr("data-roleId");
                var muteUid = $(this).attr("data-userId");
                var muteText = $(this).text();
                var state = "";
                if (muteText == "取消禁言") {
                    state = 1;
                } else if (muteText == "禁言") {
                    state = 0;
                }
                var datas = '';
                postAjax("host/mute/" + muteRid + "/" + muteUid + "/" + state, {
                    value: datas
                }, function(da) {
                    roomList_tables.guestUserList(muteRid);
                })
            });
            // 获取用户--踢人
            $(".KickingBtn").unbind("click").click(function() {
                var kickRid = $(this).attr("data-roleId");
                var kickUid = $(this).attr("data-userId");
                var datas = '';
                postAjax("host/kick/" + kickRid + "/" + kickUid, {
                    value: datas
                }, function(da) {
                    layer.msg("已踢人！");
                    roomList_tables.guestUserList(kickRid);
                })
            });
            // 播放记录弹窗
            $(".playRecording").unbind("click").click(function() {
                $("#playRecordingDetails").modal("show");
                var playRecordingId = $(this).attr("data-roleId");
                $("#playRecordingSearchSubmit").attr("data-roleId", playRecordingId);
                roomList_tables.playRecordingDate(playRecordingId);
            });
            // 停播记录弹窗
            $(".stopPlayRecording").unbind("click").click(function() {
                $("#stopPlayRecordingDetails").modal("show");
                var stopPlayRecordingId = $(this).attr("data-roleId");
                roomList_tables.stopPlayRecordingList(stopPlayRecordingId);
            });
            // 播放记录弹窗搜索
            $("#playRecordingSearchSubmit").unbind("click").click(function() {
                var playRecordingId = $(this).attr("data-roleId");
                roomList_tables.playRecordingList(playRecordingId);
            });
            // stop弹窗
            $(".stopBtn").unbind("click").click(function() {
                $("#stopDetails").modal("show");
                var stopRecordingId = $(this).attr("data-roleId");
                cookie_util.add_or_update_cookie('roomIds', stopRecordingId);
                roomList_tables.stopRecordingList(stopRecordingId);
                roomList_tables.getSystemVersion(stopRecordingId);
            });
            // stop弹窗A、B键
            $("#yhButton").unbind("click").click(function() {
                roomList_tables.switchReason(1, _this.sysVersion)
            });
            $("#jgButton").unbind("click").click(function() {
                roomList_tables.switchReason(2, _this.sysVersion)
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
                roomList_tables.bool = true;
            })
            // stop弹窗提交
            $("#submitStopDetail").unbind("click").click(function() {
                roomList_tables.stop_host_live()
            });
            // 获取列表海报
            $(".roomPoster").unbind("click").click(function() {
                upload_util.show_upload_image(this, '上传图片', true, roomList_tables.updateRoomPost);
                var rrid = $(this).attr("data-roleId");
                var uuid = $(this).attr("data-userId");
                cookie_util.add_or_update_cookie('rid', rrid);
                cookie_util.add_or_update_cookie('uid', uuid);
            });
            // 禁播按钮
            $(".bannedBtn").unbind("click").click(function() {
                var disableRid = $(this).attr("data-roleId");
                var disableUid = $(this).attr("data-userId");
                var text = $(this).text()
                var datas = '';
                if (text == "开启直播") {
                    datas = 1
                } else {
                    datas = 2
                }
                postAjax("host/update/disable/" + disableUid + "/" + disableRid, {
                    value: datas
                }, function(da) {
                    _this.getRoomList(1);
                })
            });
        },

        // 就地更改回调
        editableCallback: function(response, newVal) {
            if (response && response.code == 0) {
                util.Huipopup("更新成功");
            } else {
                util.Huipopup("更新失败");
            }
            //console.log(response)

        },
        //更新头像回调
        updateRoomPost: function(data) {
            var rid = cookie_util.get_cookie('rid');
            var uid = cookie_util.get_cookie('uid');
            postAjax("host/update/posterpic/" + uid + "/" + rid, {
                value: data
            }, function(da) {
                roomList_tables.getRoomList(1);
            })
        },
        // 获取用户弹窗列表
        guestUserList: function(guestUserId) {
            var _this = this;
            var roomid = guestUserId;
            cookie_util.add_or_update_cookie('roomids', roomid);
            var datas = {};
            $.ajax({
                type: "get",
                url: paths + "host/user/list/" + roomid,
                async: false,
                dataType: "json",
                data: datas,
                success: function(data) {
                    if (data.code == 0) {
                        if (
                            data.dataInfo &&
                            data.dataInfo.length > 0
                        ) {
                            var htmls = roomList_tables.getRoomUserHtmls(data.dataInfo);
                            $("#roomUserList").html(htmls);
                            _this.binds();
                        } else {
                            $("#roomUserList").html(" ");
                        }
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        },
        // 处理用户数据
        getRoomUserHtmls: function(datas) {
            var htmls = "";
            if (datas) {
                $.each(datas, function(index, u) {
                    var roomid = cookie_util.get_cookie('roomids');
                    var roomUserType = "";
                    switch (u.roomUserType) {
                        case 0:
                            roomUserType = "游客";
                            break;
                        case 1:
                            roomUserType = "普通用户";
                            break;
                        case 2:
                            roomUserType = "机器人"
                            break;
                        case 3:
                            roomUserType = "房间管理员"
                            break;
                        case 4:
                            roomUserType = "主播"
                            break;
                        case 5:
                            roomUserType = "巡管"
                            break;
                    }
                    var muteFont = u.mute > 0 ? '取消禁言' : '禁言';
                    var mute = u.mute / 1000;
                    var muteTime = Math.floor(mute);
                    htmls +=
                        '<tr><td>' +
                        u.userId +
                        '</td><td>' +
                        u.nickName +
                        '</td><td>' +
                        roomUserType +
                        '</td><td>' +
                        muteTime +
                        '</td><td>' +
                        getTimes(u.joinTime) +
                        '</td><td><a data-btn="pageMuteBtn" data-roleId="' +
                        roomid +
                        '" data-userId="' +
                        u.userId +
                        '" data-roleName="" href="javascript:;" class="btn btn-primary size-S radius MuteBtn">' + muteFont + '</a><a data-btn="pageKickingBtn" data-roleId="' +
                        roomid +
                        '" data-userId="' +
                        u.userId +
                        '" data-roleName="" href="javascript:;" class="btn btn-primary size-S radius KickingBtn">踢人</a></td></tr>';
                });
                return htmls;
            } else {
                return "";
            }
        },
        // 获取时间
        playRecordingDate: function(playRecordingId) {
            var data = new Date().getTime();
            var endTime = data + (24 * 60 * 60 * 1000);
            var statrTime = data - (7 * 24 * 60 * 60 * 1000);
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                laydate.render({
                    elem: '#playRecordingStart',
                    type: 'date',
                    range: false,
                    format: 'yyyy-MM-dd',
                    value: util.DateTime.showtime(new Date(statrTime))
                });
                laydate.render({
                    elem: '#playRecordingEnd',
                    type: 'date',
                    range: false,
                    format: 'yyyy-MM-dd',
                    value: util.DateTime.showtime(new Date(endTime))
                });
            });
            roomList_tables.playRecordingList(playRecordingId);
        },
        // 获取播放记录
        playRecordingList: function(playRecordingId) {
            var _this = this;
            this.roomListtimeOut = null;
            var roomid = playRecordingId;
            var startTime = $("#playRecordingStart").val();
            var endTime = $("#playRecordingEnd").val();
            var s_time = startTime + " 00:00:00";
            var e_time = endTime + " 00:00:00";
            var datas = {
                startTime: s_time,
                endTime: e_time
            };
            $.ajax({
                type: "get",
                url: paths + "host/living/history/" + roomid,
                async: false,
                dataType: "json",
                data: datas,
                success: function(data) {
                    if (data.code == 0) {
                        if (
                            data.dataInfo.list &&
                            data.dataInfo.list.length > 0
                        ) {
                            var htmls = roomList_tables.playRecordingListHtmls(data.dataInfo.list);
                            $("#playRecordingList").html(htmls);
                            _this.roomListtimeOut = setTimeout(function() {
                                $("div.holder").show();
                                $("div.holder").jPages({
                                    containerID: "playRecordingList",
                                    first: "首页",
                                    last: "尾页",
                                    next: "下一页",
                                    previous: "上一页"
                                });
                            }, 500);
                            _this.binds();
                        } else {
                            $("#playRecordingList").html(" ");
                            $("div.holder").hide();
                            layer.msg('该时间下无记录！')
                        }
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        },
        // 处理播放记录数据
        playRecordingListHtmls: function(datas) {
            var htmls = "";
            if (datas) {
                $.each(datas, function(index, r) {
                    htmls +=
                        '<tr><td>' +
                        getTimes(r.startTime) +
                        '</td><td>' +
                        getTimes(r.endTime) +
                        '</td><td>' +
                        r.liveTime +
                        '</td><td>' +
                        r.punishTime +
                        '</td></tr>';
                });
                return htmls;
            } else {
                return "";
            }
        },
        // 获取停播记录
        stopPlayRecordingList: function(stopPlayRecordingId) {
            var _this = this;
            this.roomListtimeOut = null;
            var roomid = stopPlayRecordingId;
            var datas = {};
            $.ajax({
                type: "get",
                url: paths + "host/stop/history/" + roomid,
                async: false,
                dataType: "json",
                data: datas,
                success: function(data) {
                    if (data.code == 0) {
                        if (
                            data.dataInfo &&
                            data.dataInfo.length > 0
                        ) {
                            var htmls = roomList_tables.stopPlayRecordingListHtmls(data.dataInfo);
                            $("#stopPlayRecordingList").html(htmls);
                            _this.roomListtimeOut = setTimeout(function() {
                                $("div.holder").show();
                                $("div.holder").jPages({
                                    containerID: "stopPlayRecordingList",
                                    first: "首页",
                                    last: "尾页",
                                    next: "下一页",
                                    previous: "上一页"
                                });
                            }, 500);
                            _this.binds();
                        } else {
                            $("#stopPlayRecordingList").html(" ");
                            $("div.holder").hide();
                        }
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        },
        // 处理停播记录数据
        stopPlayRecordingListHtmls: function(datas) {
            var htmls = "";
            if (datas) {
                $.each(datas, function(index, s) {
                    var reasonGroup = s.reasonGroup == 1 ? 'A' : 'B';
                    htmls +=
                        '<tr><td>' +
                        getTimes(s.createDate) +
                        '</td><td>' +
                        s.stopReason +
                        '</td><td>' +
                        reasonGroup +
                        '</td><td>' +
                        s.punishTime +
                        '</td><td>' +
                        s.stopUserName +
                        '</td></tr>';
                });
                return htmls;
            } else {
                return "";
            }
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
                            var htmls = roomList_tables.stopRecordingHtmls(data.dataInfo);
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
                            roomList_tables.switchReason(1, 1);
                        } else {
                            $('input:radio[value="3"]').prop('checked', true);
                            $('input:radio[value="1"]').prop('disabled', true);
                            _this.sysVersion = 2;
                            $('.tuerqi').show()
                            $(".zhongdong").hide()
                            roomList_tables.switchReason(1, 3);
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
                                _this.getRoomList(1);
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
                            _this.getRoomList(1);
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
                        _this.getRoomList(1);
                    } else {
                        layer.msg("错误！");
                    }
                });
            }
        }
    });
    roomList_tables.init();
});