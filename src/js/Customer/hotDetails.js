$(document).ready(function() {

    var hotDetails = window["hotDetails"] = {
        init: function(data) {
            // console.log(data);
            var _this = this;
            _this.getHotDetails(data);
        },
        getHotDetails: function(data) {
            // console.log(data.host);
            var _this = this;
            var h = data.host;
            if (h) {
                var userPIc = '<img id="userPic" src={0} />'
                var changePic = h.roomVtPosterPic ? util.String.stringFormat(userPIc, serverUrl + h.roomVtPosterPic) : '<img id="userPic" src="../../images/nophoto.jpg">';
                var state = h.actorIng == 0 ? '停止直播' : '直播中';
                var sstate = h.isShow == 1 ? '显示' : '隐藏';
                var sType = h.roomShowType == 1 ? '不推荐' : h.roomShowType = 4 ? '置顶推荐' : '直播推荐';
                var host_level = "";
                var host_level_width = 0;
                var host_level_img = '<img style="height:30px;" src="' + serverUrl + h.levelPic + '" />';
                var host_level_score = Math.floor((h.score - h.curLevelScore) * 100 / (h.nextLevelScore - h.curLevelScore));
                if (host_level_score != 0) {
                    host_level_width = host_level_score + '%';
                }
                var user_span_inner = '<span style="height:100%;font-size:12px;position: absolute;line-height:30px;z-index: 99;">' + host_level_width + '</span><span style="width:' + host_level_width + ';background-color: #0088cc;height:100%;font-size:12px;position: absolute;line-height:30px;"></span>'

                var host_level_span = '<div style="position: relative;width:80px;height:30px;margin:5px;background-color: #e8e8e8;">' + user_span_inner + '</div>';
                var video = h.videoAddr == 1 ? '默认地址' : 'Advection';
                var htmls =
                    '<table width="600" class="table table-border table-bordered table-bg  table-hover"><tr><th scope="col" colspan="12">主播信息</th></tr>';
                htmls +=
                    '<tr><td style="color:red" id="liveState"></td><td>显示状态：<a href="javascript::" id="showState" data-type="select" data-pk="1" data-url="' + paths + 'host/update/isshow/' + data.user.uid + '/' + h.roomId + '" data-title="请选择显示状态">' + sstate + '</a></td><td>收到礼物(币)：' +
                    data.cost.gift.r +
                    '</td><td rowspan="3" id= "hotHeaderPIC" class="hotHeaderPIC" style="position:relative;width:250px;" align="center" valign="middle" data-roleId="' +
                    h.roomId +
                    '" data-userId="' +
                    data.user.uid +
                    '"></td></tr>';
                htmls +=
                    '<tr><td>房间编号：' +
                    h.roomId +
                    '</td><td id="showType">推荐类型：<a href="javascript::" id="RecommendStyle" data-type="select" data-pk="1" data-url="' + paths + 'host/update/recommend/' + data.user.uid + '/' + h.roomId + '" data-title="请选择推荐类型">' + sType + '</a></td><td>显示顺序：<a href="javascript::" id="displayOrder" data-type="text" data-pk="1" data-url="' + paths + 'host/update/showproperity/' + data.user.uid + '/' + h.roomId + '" data-title="请输入显示顺序">' +
                    h.roomShowPriority +
                    '</a></td></tr>';
                htmls +=
                    '<tr><td>Gis：<a href="javascript::" id="gis" data-type="text" data-pk="1" data-url="' + paths + 'host/update/gis/' + data.user.uid + '/' + h.roomId + '" data-title="请输入Gis">' +
                    h.gis +
                    '</a></td>';
                if (h.countryId) {
                    htmls +=
                        '<td>国家：<a href="javascript::" id="country" class="country" data-type="select" data-pk="1" data-url="' + paths + 'host/update/country/' + data.user.uid + '/' + h.roomId + '" data-title="请输入国家">' +
                        h.countryId +
                        '</a></td>';
                } else {
                    htmls +=
                        '<td>国家：<a href="javascript::" id="country" class="country" data-type="select" data-pk="1" data-url="' + paths + 'host/update/country/' + data.user.uid + '/' + h.roomId + '" data-title="请输入国家" style="color:red;"><i>Empty</i></a></td>';
                }
                if (h.brokerageName) {
                    htmls +=
                        '<td>经济公司：<a href="javascript::" id="brokerageFirm" data-type="text" data-pk="1" data-url="' + paths + 'host/update/brokerage/' + data.user.uid + '/' + h.roomId + '" data-title="请输入经纪公司">' +
                        h.brokerageName +
                        '</a></td></tr>';
                } else {
                    htmls +=
                        '<td>经济公司：<a href="javascript::" id="brokerageFirm" data-type="text" data-pk="1" data-url="' + paths + 'host/update/brokerage/' + data.user.uid + '/' + h.roomId + '" data-title="请输入经纪公司" style="color:red;"><i>Empty</i></a></td></tr>';
                }
                htmls +=
                    '<tr><td id="host_level_td">用户等级：' + host_level_img + host_level_span +
                    '</td><td>分享数目：' +
                    h.share +
                    '</td><td>被关注数：' +
                    h.favoriteCount +
                    '</td><td>钻石收入：' +
                    data.user.redDiamond +
                    '</td></tr>';
                htmls += '<tr><td>视频流地址：<a href="javascript::" id="videoAddr" data-type="select" data-pk="1" data-url="' + paths + 'host/update/videoAddr/' + data.user.uid + '/' + h.roomId + '" data-title="请选择视频流地址">' +
                    video +
                    '</a></td><td>上次直播：' +
                    util.DateTime.fulltime(new Date(h.liveDate)) +
                    '</td>';
                if (!h.topic || h.topic == "undefined") {
                    htmls += '<td>话题：<a href="javascript::" id="topic" data-type="text" data-pk="1" data-url="' + paths + 'host/update/topic/' + data.user.uid + '/' + h.roomId + '" data-title="请输入话题" style="color:red;"><i>Empty</i></a></td>';

                } else {
                    htmls += '<td>话题：<a href="javascript::" id="topic" data-type="text" data-pk="1" data-url="' + paths + 'host/update/topic/' + data.user.uid + '/' + h.roomId + '" data-title="请输入话题">' +
                        h.topic +
                        '</a></td>';
                }
                if (!h.notice || h.notice == "undefined") {
                    htmls += '<td>公告：<a href="javascript::" id="notice" data-type="text" data-pk="1" data-url="' + paths + 'host/update/notice/' + data.user.uid + '/' + h.roomId + '" data-title="请输入公告" style="color:red;"><i>Empty</i></a></td></tr>';
                } else {
                    htmls += '<td style="width:350px">公告：<a href="javascript::" id="notice" data-type="text" data-pk="1" data-url="' + paths + 'host/update/notice/' + data.user.uid + '/' + h.roomId + '" data-title="请输入公告">' +
                        h.notice +
                        '</a></td></tr>';
                }
                if (h.exchange) {
                    htmls +=
                        '<tr><th scope="col" colspan="12">结算信息</th></tr><tr><td>提现比例：<a href="javascript::" id="exchangeRate" data-type="text" data-pk="1" data-url="' + paths + 'host/update/exchangeRate/' + data.user.uid + '/' + h.roomId + '" data-title="请选择视频流地址">' +
                        h.exchange.exchangeRate +
                        '</a></td><td>结算日期：' +
                        h.exchange.exchangeDate +
                        '</td><td>时长底薪(单位：美分)：<a href="javascript::" id="exchangeMoney" data-type="text" data-pk="1" data-url="' + paths + 'host/update/exchangeMoney/' + data.user.uid + '/' + h.roomId + '" data-title="请选择视频流地址">' +
                        h.exchange.exchangeMoney +
                        '</a></td><td>时长底线(单位：秒)：<a href="javascript::" id="exchangeOnline" data-type="text" data-pk="1" data-url="' + paths + 'host/update/exchangeOnline/' + data.user.uid + '/' + h.roomId + '" data-title="请选择视频流地址">' +
                        h.exchange.exchangeOnline +
                        '</a></td></tr></table>';
                } else {
                    htmls += '</table>';
                }

                // htmls +=
                //     '<tr><td colspan="2">话题：<a href="#" id="topic" data-type="text" data-pk="1" data-url="' + paths + 'host/update/topic/' + data.user.uid + '/' + h.roomId + '" data-title="请输入话题">' +
                //     h.topic +
                //     '</a></td><td colspan="2">公告：<a href="#" id="notice" data-type="text" data-pk="1" data-url="' + paths + 'host/update/notice/' + data.user.uid + '/' + h.roomId + '" data-title="请输入公告">' +
                //     h.notice +
                //     '</a></td></tr></table>';
                $("#hotDetails").html(htmls);
                $("#hotHeaderPIC").html(changePic);
                $("#liveState").html('状态：' + state);
                $(".hotHeaderPIC").unbind("click").click(function() {
                    upload_util.show_upload_image(this, "上传图片", true, hotDetails.updatehostHead);
                    var rrid = $(this).attr("data-roleId");
                    var uuid = $(this).attr("data-userId");
                    cookie_util.add_or_update_cookie('rrid', rrid);
                    cookie_util.add_or_update_cookie('uuid', uuid);
                })
                var resourceId = util.Storage.get("resourceId");
                var local_change = cookie_util.get_cookie('local_change');
                if (local_change == 'LOCAL_CAHNGE_' + resourceId) {
                    $("#gis").editable({
                        success: hotDetails.editableCallback
                    });
                    $("#brokerageFirm").editable({
                        success: hotDetails.editableCallback
                    });
                    $("#displayOrder").editable({
                        success: hotDetails.editableCallback
                    });
                    $("#topic").editable({
                        success: hotDetails.editableCallback
                    });
                    $("#notice").editable({
                        success: hotDetails.editableCallback
                    });
                    $("#showState").editable({
                        source: [{
                                value: 1,
                                text: '显示'
                            },
                            {
                                value: 3,
                                text: '隐藏'
                            },
                        ],
                        success: hotDetails.editableCallback
                    });
                    $("#RecommendStyle").editable({
                        source: [{
                                value: 1,
                                text: '不推荐'
                            },
                            {
                                value: 4,
                                text: '置顶推荐'
                            },
                        ],
                        success: hotDetails.editableCallback
                    });
                    $("#exchangeRate").editable({
                        success: hotDetails.editableCallback
                    });
                    $("#exchangeMoney").editable({
                        success: hotDetails.editableCallback
                    });
                    $("#exchangeOnline").editable({
                        success: hotDetails.editableCallback
                    });
                    $(".country").editable({
                        success: hotDetails.editableCallback
                    });
                    $("#videoAddr").editable({
                        success: hotDetails.editableCallback
                    });
                }
                // _this.binds();

                $(".editLabel").on("click", function() {
                    // console.log($(".hostLabels"))
                    $("#hostLabel").modal("show");

                });
                this.getCountry();
                this.getVideoAll();
            }


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
        getCountry: function() {
            getAjax("host/country/get/all", {}, function(data) {
                if (data.dataInfo) {
                    var datas = data.dataInfo;
                    var sourcees = [];
                    $.each(datas, function(index, item) {
                        sourcees.push({
                            value: item.name,
                            text: item.name
                        })
                    })
                    var resourceId = util.Storage.get("resourceId");
                    var local_change = cookie_util.get_cookie('local_change');
                    if (local_change == 'LOCAL_CAHNGE_' + resourceId) {
                        $("#country").editable({
                            source: sourcees,
                            success: hotDetails.editableCallback
                        });
                    }
                }

            })
        },
        getVideoAll: function() {
            getAjax("host/get/room/video", {}, function(data) {
                if (data.dataInfo) {
                    var datas = data.dataInfo;
                    var video = [];
                    $.each(datas, function(index, item) {
                        video.push({
                            value: item.vid,
                            text: item.vname
                        })
                    })
                    var resourceId = util.Storage.get("resourceId");
                    var local_change = cookie_util.get_cookie('local_change');
                    if (local_change == 'LOCAL_CAHNGE_' + resourceId) {
                        $("#videoAddr").editable({
                            source: video,
                            success: hotDetails.editableCallback
                        });
                    }
                }

            })

        },
        updatehostHead: function(data) { //更新头像回调
            var rid = cookie_util.get_cookie('rrid');
            var uid = cookie_util.get_cookie('uuid');
            //console.log(rid);
            postAjax("host/update/posterpic/" + uid + "/" + rid, {
                value: data
            }, function(da) {
                $("#userPic").attr('src', serverUrl + data);
            })

        },
    }
});