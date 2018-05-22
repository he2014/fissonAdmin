$(document).ready(function() {
    var userDetails = (window["userDetails"] = {
        init: function() {
            // console.log(JSON.parse(util.Storage.get("item")))
            // this.getuserDatas();
            this.first_change = [true, true, true, true, true, true]; //是否重新异步AJAX
            this.changeSearchType();
            this.add_user();
            $("#tab_demo").Huitab({
                fn: userDetails.tabFunction
            });
            this.fresh_first_change()
        },
        fresh_first_change: function() { //值改变重置状态；
            var _this = this;
            var elememt = $('[name="userDetailsSearch"],[name="siginListId"],[name="userDesablerecordId"],[name="user-gag-play"],[name="user-backpack"],[name="user-rechange"]');
            elememt.on('input propertychange', function() {
                _this.first_change.forEach(function(ele, index) {
                    _this.first_change[index] = true;
                })
            })
        },
        add_user: function() {
            $("#add_user_Btn").unbind('click').click(function() {
                var addChatFrom = '<form class="layui-form" action="" style="padding:10px;">\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">登录名</label>\
                                        <div class="layui-input-block">\
                                        <input type="text" id="rid" name="title" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                        </div>\
                                    </div>\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">昵称</label>\
                                        <div class="layui-input-block">\
                                        <input type="text" id="cn" name="title" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                        </div>\
                                    </div>\
                                     <div class="layui-form-item" >\
                                        <label class="layui-form-label">密码</label>\
                                        <div class="layui-input-block">\
                                        <input type="password" id="ps" name="title" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                        </div>\
                                    </div>\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">性别</label>\
                                        <div class="layui-input-block">\
                                        <span class="select-box">\
                                            <select style="display:block;" class="select" size = "1" name = "demo1" >\
                                                <option value="2" selected>女</option>\
                                                <option value="1">男</option>\
                                            </select >\
                                         </span >\
                                        </div>\
                                    </div>\
                              </from>';
                layer.open({
                    type: 1,
                    title: '新建',
                    btn: ['确定', '取消'],
                    skin: 'layui-layer-rim', //加上边框
                    area: ['600px', '380px'], //宽高
                    content: addChatFrom,
                    yes: function(index, layero) {
                        var rid = $("#rid").val(),
                            cn = $("#cn").val(),
                            ci = $("#ps").val(),
                            des = $("#sex").val();
                        if (!rid) {
                            layer.msg('请输入登录名');
                        } else if (!cn) {
                            layer.msg('请输入昵称');
                        } else if (!ci) {
                            layer.msg('请输入密码');
                        } else {
                            postAjax('user/register', {
                                ln: rid,
                                nn: cn,
                                ps: ci,
                                sex: des
                            }, function(data) {
                                if (data.code == 0) {
                                    layer.msg("新建成功");
                                    layer.close(index);
                                    // $("#changeSearchType").find('option').eq(1).attr('selected', true);
                                    // $('input[name="userDetailsSearch"]').val(rid)
                                    // userDetails.getuserDatas(rid, false)
                                    // _this.getChatDetails(1);
                                } else if (data.code == 113) {
                                    util.Huipopup('用户名已存在');
                                } else if (data.code == 114) {
                                    util.Huipopup('昵称已存在')
                                }
                            }, "", true)
                        }
                    },
                    btn2: function(index) {
                        layer.close(index)
                    }
                });
            })

        },
        changeSearchType: function() {
            var _this = this;
            var text = $('input[name="userDetailsSearch"]'),
                select = $("#changeSearchType");
            $("#changeSearchType").change(function() {
                var type = $(this).val();
                if (type == 2) {
                    text.attr('placeholder', "请输入用户邮箱");
                    text.val('');
                } else if (type == 3) {
                    text.attr('placeholder', "请输入用户名");
                    text.val('');
                } else if (type == 4) {
                    text.attr('placeholder', "请输入设备号");
                    text.val('');
                } else {
                    text.attr('placeholder', "请输入用户ID");
                    if (cookie_util.get_cookie('siginListId')) {
                        text.val(cookie_util.get_cookie('siginListId'));
                    } else {
                        text.val('');
                    }

                };
            });
            if (cookie_util.get_cookie('siginListId') && select.val() == 1) {
                _this.getuserDatas(cookie_util.get_cookie('siginListId'), false);
                $('input[name="userDetailsSearch"]').val(cookie_util.get_cookie('siginListId'));
            }
            $("#userDetailsSearch").unbind("click").click(function() {
                var textValue = text.val();
                if (textValue) {
                    if (select.val() != 3 && select.val() != 4) {
                        if (select.val() == 1) {
                            cookie_util.add_or_update_cookie('siginListId', textValue);
                        }
                        _this.getuserDatas(textValue, false);
                    } else { //模糊查找
                        _this.searchnickname(1, textValue);
                        _this.textValue = true; //第一次
                    }
                }
            })

        },
        /**
         *
         *
         * @param {any} data  被点击项 index
         */
        tabFunction: function(data) { //选项卡回调，实现异步
            // console.log(data);
            var self = userDetails;
            $('#userDetails_tabBox').find('div').addClass('hide');
            $("#tabindex" + data).removeClass('hide');
            switch (data) {
                case 1:
                    if (self.first_change[data]) {
                        userDetails.getLoginLog();
                        self.getLoginLog_index = data;
                    }

                    break;
                case 2:
                    if (self.first_change[data]) {
                        userDetails.getDesableRecord();
                        self.getDesableRecord_index = data;
                    }

                    break;
                case 3:
                    if (self.first_change[data]) {
                        userDetails.getGagPlay();
                        self.getGagPlay_index = data;
                    }

                    break;
                case 4:
                    if (self.first_change[data]) {
                        userDetails.getBackpack();
                        self.getBackpack_index = data;
                    }

                    break;
                case 5:
                    if (self.first_change[data]) {
                        userDetails.getRechange();
                        self.getRechange_index = data;
                    }


                    break;
                default: //首次展开
                    var cookie_val = cookie_util.get_cookie("siginListId")
                    if (cookie_val) {
                        $("#changeSearchType").find('option').eq(0).attr('selected', true).siblings('option').attr('selected', false);
                        $('input[name="userDetailsSearch"]').val(cookie_val)
                    }
                    if (self.first_change[data]) {
                        userDetails.changeSearchType();
                        self.getuserDatas_index = data;
                    }

            }

        },
        searchnickname: function(page, textValue) {
            var _this = this;
            var text = $('input[name="userDetailsSearch"]').val();
            var page = page ? page : 1;
            var url = $("#changeSearchType").val() == 3 ? "user/list/nick/" : "user/list/device/"
            getAjax(url + text, {
                page: page,
                size: 10
            }, function(res) {
                //console.log(res)
                if (res.dataInfo.list && res.dataInfo.list.length > 0) {
                    _this.getuserDatas(text, true, res.dataInfo);
                } else {
                    layer.msg("搜索内容不存在");
                }

            })

        },
        getuserDatas: function(keyWord, bool, data) { //bool限定搜索方式

            var _this = this;
            var type = $("#changeSearchType").val()
            if (!bool) { //12855
                type = (type == 3 || type == 4) ? 1 : type; //弹窗返回时限定type
                getAjax("user/search/" + type + "/" + keyWord, {}, function(response) {
                    if (response.dataInfo) {
                        var data = response.dataInfo;
                        // _this.getbagDatas(data);
                        if (data.host) {
                            //console.log(_this.hotDetails)
                            hotDetails.init(data);
                            cookie_util.add_or_update_cookie('id_r', data.host.roomId);
                        } else {
                            $("#hotDetails").html('')
                        }
                        _this.userDetailsMessage(data);
                        cookie_util.add_or_update_cookie('id_u', data.user.uid);
                        cookie_util.add_or_update_cookie('siginListId', data.user.uid);
                        _this.first_change[_this.getuserDatas_index] = false;
                    } else {
                        layer.msg('搜索内容不存在！');
                        $("#_userDetails").html('');
                        $("#hotDetails").html('')
                    }
                });
            } else { //弹窗
                if (data) {
                    var tbodyHtmls = "";
                    data.list.forEach(function(item) {
                        tbodyHtmls += '<tr class="text-c">' +
                            "<td>" + item.userId + " </td >" +
                            "<td> <img style='height: 30px;' src=" + serverUrl + item.headPic + " ></td>" +
                            "<td>" + item.loginName + "</td >" +
                            "<td> " + item.nickName + "</td >" +
                            '<td><input data-id="' + item.userId + '" class="tableToPageBtn" class="btn btn - success radius" type="button" value="详情"></td >' +
                            '</tr>';
                    })
                    if (data.page == 1 && _this.textValue) { //首次第一页
                        _this.textValue = false;
                        var userHtmls = '<table class="table table-border table-bordered">' +
                            ' <thead class="text-c" >' +
                            '<tr><th>用户id</th> <th>用户图像</th> <th>邮箱</th><th>昵称</th><th>详情</th> </tr> </thead >' +
                            '<tbody class="pagetbodyHtmls" >' + tbodyHtmls + '</tbody></table ><div id="pagetbodyHtmls"></div>';
                        var index = layer.open({
                            type: 1,
                            skin: 'layui-layer-rim', //加上边框
                            area: ['1000px', '460px'], //宽高
                            content: userHtmls
                        });
                    } else { //其他页
                        $(".pagetbodyHtmls").html(tbodyHtmls);
                    }
                    util.page_html("pagetbodyHtmls", data.page, data.pageCount, 'userDetails.searchnickname');
                    $("input.tableToPageBtn").on('click', function() {
                        var val = $(this).attr('data-id');
                        _this.getuserDatas(val, false);
                        layer.closeAll();
                    })


                }

            }
        },
        userDetailsMessage: function(data) {
            var _this = this;
            if (data.user) {
                var badgeMap = [];
                if (data.badgeMap) {
                    data.badgeMap.forEach(function(ele) {
                        badgeMap[ele['level_num']] = ele;
                    })
                }
                // console.log(badgeMap);
                var h = data.user;
                var userPIc = '<img id="userHeaderPic" src={0} />';
                var userType = "";
                var changePic = h.head ? util.String.stringFormat(userPIc, serverUrl + h.head) : '<img id="userHeaderPic" src="../../images/nophoto.jpg">';
                switch (h.userType) {
                    case 0:
                        userType = "普通用户";
                        break;
                    case 1:
                        userType = "巡管";
                        break;
                    case 2:
                        userType = "运营"
                        break;
                    case 77:
                        userType = "机器人"
                        break;
                }
                var device = '<table  class="table table-border table-bordered table-bg "><tr><th colspan="3" id="toggleClass_device">下面均是该用户登录过的设备（红色表示被封），设备号后面是该设备登录过的账号：</th></tr><tr class="hide  _user_device  text-c"><td>设备号</td><td>曾登录账号</td><td>禁入房间id</td></tr>{0}</table>';
                if (h.smallUser && h.smallUser.length > 0) {

                    var deviceList = h.smallUser.map(function(item) {
                        var color = item.disable == true ? 'red' : '';
                        var disableRoomIds = item.disableRoomIds ? item.disableRoomIds : "";
                        var disableRoomIds_html = disableRoomIds.split(',').map(function(ele) {
                            return '<a data-dev="' + item.imeiCode + '" href="javascript::">' + ele + '</a>'
                        }).join(' ')
                        return '<tr class="hide  _user_device text-c"><td style="color:' + color + ';min-width:300px;">' + item.imeiCode + '</td><td>' + item.smallUsers + '</td><td class="disableRoomIds">' + disableRoomIds_html + '</td></tr>';
                    }).join('');
                    // console.log(deviceList)
                }
                var information = "用户信息";
                var first_flag = false;
                if (h.isBig) {
                    information += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style='color: red'> 大用户</font>";
                    first_flag = true;
                }
                if (h.isCustomer) {
                    if (first_flag) {
                        information += "<font style='color: red'>、客服等级用户</font>";
                    } else {
                        first_flag = true;
                        information += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style='color: red'>客服等级用户</font>";
                    }
                }
                if (h.isBlack) {
                    if (first_flag) {
                        information += "<font style='color: red'>、充值黑名单用户</font>";
                    } else {
                        first_flag = true;
                        information += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style='color: red'>充值黑名单用户</font>";
                    }
                }
                if (h.lastDeviceDisable) {
                    if (first_flag) {
                        information += "<font style='color: red'>、" + h.lastDeviceDisable + "</font>";
                    } else {
                        first_flag = true;
                        information += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style='color: red'>" + h.lastDeviceDisable + " </font>";
                    }
                }
                if (h.lastDeviceBlack) {
                    if (first_flag) {
                        information += "<font style='color: red'>、" + h.lastDeviceBlack + "</font>";
                    } else {
                        first_flag = true;
                        information += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style='color: red'>" + h.lastDeviceBlack + "</font>";
                    }
                }

                var states = h.state == 0 ? "启用" : h.state == 1 ? "禁用" : "永久禁用"
                var htmls_user = '<table width="600" class="table table-border table-bordered table-bg  table-hover"><tr><th scope="col" colspan="12">' + information + '</th></tr>';
                htmls_user += '<tr>' + "<td id='submitId'>id：<span>" + h.uid + "</span>" + '<a style="margin-left:40px;" href = "#" id = "userPasswordChange"  data-btn="userPasswordChange" class="hide">修改密码</a>' + "</td>" + "<td>用户名：" +
                    '<a data-edit="updete_user_msg" href="#" id="userNick" data-type="text" data-pk="1" data-url="' + paths + 'user/update/nick/' + h.uid + '" data-title="修改昵称">' + h.nick + '</a>' +
                    "</td>" + '<td >状态：' +
                    '<a href="#" id="userState" data-type="select" data-pk="1" data-url="' + paths + 'user/update/state/' + h.uid + '" data-title="状态变更">' + states + '</a></td>' +
                    '<td rowspan="3" id= "userHeaderPIC" style="position:relative" align="center" valign="middle"></td>' + '</tr>';
                var user_level = "";
                var user_level_width = 0;
                var user_level_img = '<img style="height:30px;" src="' + serverUrl + h.levelPic + '" />';
                var user_level_score = Math.floor((h.score - h.curLevelScore) * 100 / (h.nextLevelScore - h.curLevelScore));
                var user_badge = '';
                if (user_level_score != 0) {
                    user_level_width = user_level_score + '%';
                }
                var user_span_inner = '<span style="height:100%;font-size:12px;position: absolute;line-height:30px;z-index: 99;">' + user_level_width + '</span><span style="width:' + user_level_width + ';background-color: #0088cc;height:100%;font-size:12px;position: absolute;line-height:30px;"></span>'
                var user_level_span = '<div style="position: relative;width:80px;height:30px;margin:5px;background-color: #e8e8e8;">' + user_span_inner + '</div>'
                if (data.badges && data.badges.length > 0) { //
                    var data_badges = data.badges.forEach(function(item) {
                        if (badgeMap[item['id']]) {
                            user_badge += '<div class="badge_img" style="position: relative;"><img  style="height:30px;margin:5px;" src="' + serverUrl + badgeMap[item['id']]['level_pic'] + '" /><span>徽章编号:' + item.id + '过期时间:' + util.DateTime.fulltime(new Date(item['expire'])) + '</span></div>';
                        } else {
                            user_badge += '<div class="badge_img" style="position: relative;"><img  style="height:30px;margin:5px;" src="../../images/nophoto1.jpg" /><span>徽章编号:' + item.id + '过期时间:' + util.DateTime.fulltime(new Date(item['expire'])) + '</span></div>';
                        }

                    })
                }


                // htmls_user +=
                //     '<tr></tr>';
                var email_login = data.emailLoginName ? '' : 'hide';
                var thrid_login = data.thridLoginName ? '' : 'hide';
                htmls_user +=
                    "<tr><td  >登录方式：" + data.loginType + "</td>" +
                    "<td>登录邮箱：" +
                    '<a href="#" id="useremailChange" data-type="text" data-pk="1" data-url="' + paths + 'user/update/email/' + h.uid + '" data-title="修改邮箱">' + data.emailLoginName + '</a>' +
                    '<button data-btn="del_login"  style="margin-left:40px" data-uid=' + h.uid + ' class="del_login layui-btn layui-btn-xs hide ' + email_login + '">删除</button>' +
                    "</td>" +

                    "<td rowspan='1'>第三方账号：" +
                    '<span>' + data.thridLoginName + '</span>' +
                    '<button data-btn="del_thrid_login"  style="margin-left:40px" data-uid=' + h.uid + ' class="del_thrid_login layui-btn layui-btn-xs hide ' + thrid_login + '">删除</button>' +
                    "</td>" +
                    "</tr>";
                var sex = h.sex == 0 ? "保密" : h.sex == 1 ? "男" : "女";
                htmls_user +=
                    "<tr>" +

                    "<td>余额：" + data.balance.totalBalance + "</td>" +
                    "<td>钻石：" + data.fansgift + "</td>" +
                    "<td>送出礼物(币)：" +
                    data.cost.gift.s +
                    "</td>" +
                    "</tr>";
                htmls_user +=
                    "<tr>" +
                    "<td id='user_level_td'>用户等级：" + user_level_img + user_level_span + user_badge + "</td>" +
                    "<td>性别：" +
                    '<a href="#" id="userSexChange" data-type="select" data-pk="1" data-url="' + paths + 'user/update/sex/' + h.uid + '" data-title="状态变更">' + sex + '</a>' +
                    "</td>" +
                    '<td>生日：<a href="#" id="userbrithdayChange" data-type="combodate" data-pk="1" data-url="' + paths + 'user/update/birthday/' + h.uid + '" data-title="生日变更">' + h.brithday + '</a>' +
                    "</td>" +

                    "<td>身份：" +
                    '<a href="#" id="userTypeChange" data-type="select" data-pk="1" data-url="' + paths + 'user/update/userType/' + h.uid + '" data-title="身份变更">' + userType + '</a>' +
                    "</td></tr>"


                var vipHtml = ""
                if (data.viplist && data.viplist.length > 0) {
                    data.viplist.forEach(function(item) {
                        var vip = item.type == 1 ? "vip" : "svip"
                        if (data.viplist.length == 1) {
                            vipHtml += '<td colspan="2">' + vip + '过期时间:' + getTimes(item.expire) + '</td>'
                        } else {
                            vipHtml += '<td >' + vip + '过期时间:' + getTimes(item.expire) + '</td>'
                        }
                    })
                } else {
                    vipHtml = "<td colspan='2'>此用户不是vip或sivp</td>"
                }
                htmls_user += '<tr>' + vipHtml + "<td >注册时间：" +
                    getTimes(h.registerTime) +
                    "</td>" +
                    '<td colspan="1" style="border-right:none;">上次登陆：' + h.loginTime + '</td>' +
                    // '<td style="visibility:hidden;border-left:none;" colspan="1">ert4545454545</td>' +
                    '</tr>';
                htmls_user +=
                    "<tr>" +
                    "<td>whatsApp:<span data-btn='whatapp' class='hide'>" + h.whatsApp + "<span></td>" +
                    '<td>联系方式：' +
                    '<a class="hide" data-btn="content_user"  href="#" id="userinformationChange" data-type="text" data-pk="1" data-url="' + paths + 'user/update/information/' + h.uid + '" data-title="联系方式变更">' + h.information + '</a>' +
                    '</td>' +
                    '<td colspan="2">最后一次登录设备号：' + h.lastDevice + '</td>' +
                    '<td></td>' +
                    "</tr>";

                htmls_user += '<tr><td colspan="4">充值设备黑名单:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (h.black ? h.black : '无 ') + '</td></tr>';
                htmls_user += '<tr><td colspan="4">' + util.String.stringFormat(device, deviceList) + '</td></tr>';
                $("#_userDetails").html(htmls_user);
                var str = $("#_userDetails").html().toString();
                $("#_userDetails").html(str.replace(/undefined/, ""))
                $("#userHeaderPIC").html(changePic);
                $("#userHeaderPic").click(function() {
                    upload_util.show_upload_image(this, "上传图片", true, userDetails.updateUserHead);
                });
                $("#userPasswordChange").click(function() { //修改密码
                    var userID = cookie_util.get_cookie('id_u');
                    layer.prompt({
                        title: '更改密码',
                        formType: 1
                    }, function(pass, index) {
                        postAjax("user/update/password/" + userID, {
                            value: pass
                        }, function() {
                            layer.close(index);
                        })
                    });
                })
                util.functions()
                _this.updateUserMessage();
            }
        },
        updateUserHead: function(data) { //更新头像回调
            var userID = cookie_util.get_cookie('id_u');
            postAjax("user/update/headPic/" + userID, {
                value: data
            }, function(da) {

            })
            // console.log(data);
        },
        editableCallback: function(response, newVal) {
            if (response && response.code == 0) {
                util.Huipopup("更新成功");
            } else {
                util.Huipopup("更新失败");
            }
            //console.log(response)
        },
        updateUserMessage: function() { //就地修改
            var _this = this;
            var resourceId = util.Storage.get("resourceId");
            var local_change = cookie_util.get_cookie('local_change');
            if (local_change == 'LOCAL_CAHNGE_' + resourceId) {
                $("#userNick").editable({
                    success: userDetails.editableCallback
                });

                $("#userState").editable({
                    success: userDetails.editableCallback,
                    source: [{
                            value: 0,
                            text: '启用'
                        },
                        {
                            value: 1,
                            text: '禁用'
                        },
                        {
                            value: 2,
                            text: '永久禁用'
                        }
                    ]
                });
                $("#userTypeChange").editable({
                    success: userDetails.editableCallback,
                    // 机器人77  普通用户0 巡管 1 运营2
                    source: [{
                            value: 0,
                            text: '普通用户'
                        },
                        {
                            value: 1,
                            text: '巡管'
                        },
                        {
                            value: 2,
                            text: '运营2'
                        }, {
                            value: 77,
                            text: "机器人"
                        }
                    ]
                })
                $("#userSexChange").editable({
                    success: userDetails.editableCallback,
                    source: [{
                            value: 0,
                            text: '保密'
                        },
                        {
                            value: 1,
                            text: '男'
                        },
                        {
                            value: 2,
                            text: '女'
                        }
                    ]
                });

                $("#useremailChange").editable({
                    success: userDetails.editableCallback
                });
                $("#userinformationChange").editable({
                    success: userDetails.editableCallback
                });
                $("#userbrithdayChange").editable({
                    success: userDetails.editableCallback,
                    format: 'YYYY-MM-DD',
                    viewformat: 'YYYY-MM-DD',
                    template: 'YYYY-MM-DD',
                    combodate: {
                        minYear: 1940,
                        maxYear: 2050,
                        minuteStep: 1
                    }
                });
                var time1 = setInterval(function() {
                    var type1 = $("#useremailChange").html();
                    if (type1 && type1 != 'Empty') {
                        $('.del_login').removeClass('hide');
                    };
                });
            }

            $('.del_login').unbind('click').click(function() { //删除邮箱
                var id = $(this).data('uid');
                var self = $(this);
                layer.confirm('确认此操作？', {
                        btn: ['确定', '取消'] //按钮
                    }, function() {
                        postAjax('user/update/logindel/' + id, {
                            value: 'email'
                        }, function() {
                            layer.msg('刪除成功！');
                            // self.siblings('a').addClass('hide');
                            // self.addClass('hide');
                            _this.getuserDatas(id, false);
                        })
                    },
                    function() {

                    });

            })
            $('.del_thrid_login').unbind('click').click(function() { //删除三方账号
                var id = $(this).data('uid');
                var self = $(this);
                layer.confirm('确认此操作？', {
                    btn: ['确定', '取消'] //按钮
                }, function() {
                    postAjax('user/update/logindel/' + id, {
                        value: 'thirdpart'
                    }, function() {
                        _this.getuserDatas(id, false);
                        layer.msg('刪除成功！');
                        // self.siblings('span').addClass('hide');
                        // self.addClass('hide');
                    })
                }, function() {

                });

            });
            $("#toggleClass_device").unbind('click').click(function() {
                $("._user_device").toggleClass('hide');
            });
            //監聽html值變化；

            $(".badge_img").mouseenter(function() {
                $(this).find('span').show();
            }).mouseleave(function() {
                $(this).find('span').hide();
            })
            $(".disableRoomIds").unbind('click').click(function(e) {
                var target = e.target;
                var device = $(target).data('dev');
                var rid = $(target).html();
                if (device && rid) {
                    layer.confirm('您确认此操作？', {
                        btn: ['确人', '取消'] //按钮
                    }, function(index) {
                        postAjax('host/black/device/delete/' + rid + '/' + device, {}, function() {
                            layer.msg('删除成功');
                            layer.close(index);
                            $(target).addClass('hide');
                        })

                    }, function() {

                    });
                }


            })
        },
        /*登录日志开始*/
        getLoginLog: function() {
            // var siginListId = $('input[name="siginListId"]').val();
            var data = new Date().getTime();
            var endTime = data + (24 * 60 * 60 * 1000);
            var statrTime = data - (7 * 24 * 60 * 60 * 1000);
            /*当查询过基本信息的用户，自动查询登录信息*/
            if (!$("#siginListstart").val() || !$("#siginListend").val()) {
                layui.use('laydate', function() {
                    var laydate = layui.laydate;
                    //执行一个laydate实例
                    laydate.render({
                        elem: '#siginListstart', //指定元素
                        type: 'date',
                        range: false,
                        format: 'yyyy-MM-dd',
                        value: util.DateTime.showtime(new Date(statrTime))
                    });
                    laydate.render({
                        elem: '#siginListend',
                        type: 'date',
                        range: false,
                        format: 'yyyy-MM-dd',
                        value: util.DateTime.showtime(new Date(endTime))
                    });
                });
            }
            if (cookie_util.get_cookie('siginListId')) {
                $('input[name="siginListId"]').val(cookie_util.get_cookie('siginListId'));
                this.getLoginLogList(1, cookie_util.get_cookie('siginListId'), $("#siginListstart").val(), $("#siginListend").val())
            }
            this.loginLogBind();
        },
        getLoginLogList: function(page, id, startTime, endTime, ) {
            if (!id) {
                var id = $('input[name="siginListId"]').val();
            }
            if (!startTime) {
                var startTime = $('input[name="siginListstart"]').val();
            }
            if (!endTime) {
                var endTime = $('input[name="siginListend"]').val();
            }
            var s_time = startTime + " 00:00:00";
            var e_time = endTime + " 00:00:00";
            var _this = this;
            // alert(id)
            if (id && startTime && endTime) {
                cookie_util.add_or_update_cookie('siginListId', id);
                getAjax('login/log/get/' + id, {
                    start: s_time,
                    end: e_time,
                    page: page,
                    size: 10
                }, function(data) {
                    _this.first_change[_this.getLoginLog_index] = false;
                    _this.loginLogRender(data.dataInfo)
                    //console.log(data)
                })
            } else {
                layer.msg('你输入的搜索条件不正确')
            }

        },
        loginLogRender: function(data) {
            var loginHtml = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="7">\
                                登录日志\
                                </td></tr>\
                                <tr class="text-c">\
                                    <th>用户id</th>\
                                    <th>状态</th>\
                                    <th>登录时间</th>\
                                    <th>登录类型</th>\
                                    <th>登录ip</th>\
                                    <th>设备账号</th>\
                                    <th>设备类型</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table ><div id="login_page"></div>';
            if (data.list && data.list.length > 0) {

                var list_login = data.list.map(function(item) {
                    var login_result = item.login_result == 1 ? "登录" : "退出";
                    var login_type = "";
                    if (item.login_type == 1) {
                        login_type = 'web';
                    } else if (item.login_type == 2) {
                        login_type = 'android手机';
                    } else if (item.login_type == 3) {
                        login_type = 'android平板';
                    } else if (item.login_type == 4) {
                        login_type = 'apple手机';
                    } else if (item.login_type == 5) {
                        login_type = 'apple平板';
                    }
                    var machine_id = item.machine_id ? item.machine_id : "";
                    var machine_type = item.machine_type ? item.machine_type : "";
                    return '<tr class="text-c">' +
                        '<td>' + item.user_id + '</td>' +
                        '<td>' + login_result + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.login_date)) + '</td>' +
                        '<td>' + login_type + '</td>' +
                        '<td>' + item.login_ip + '</td>' +
                        '<td>' + machine_id + '</td>' +
                        '<td>' + machine_type + '</td>' +
                        '</tr>'
                }).join('');
                $('#loginLog').html(util.String.stringFormat(loginHtml, list_login));
                util.page_html("login_page", data.page, data.pageCount, 'userDetails.getLoginLogList')
            } else {
                $('#loginLog').html(util.String.stringFormat(loginHtml, '<tr></tr>'));
                layer.msg('查询内容不存在！')
            }
        },
        loginLogBind: function() {
            var _this = this;
            $("#userLoginLogSearch").unbind('click').click(function() {
                _this.getLoginLogList(1);
            });

        },
        /**
         *  禁用記錄
         */
        getDesableRecord: function() {
            if (cookie_util.get_cookie('siginListId')) {
                $("input[name='userDesablerecordId']").val(cookie_util.get_cookie('siginListId'));
                this.getRecordList()
            }
            this.bindRecord()
        },
        getRecordList: function() {
            var textValue = $("input[name='userDesablerecordId']").val();
            var _this = this;
            if (textValue) {
                getAjax('user/disable/info/' + textValue, {}, function(data) {
                    cookie_util.add_or_update_cookie('siginListId', textValue);
                    _this.first_change[_this.getDesableRecord_index] = false;
                    _this.renderRecord(data.dataInfo);
                })
            } else {
                layer.msg('请输入查询用户ID')
            }

        },
        bindRecord: function() {
            var _this = this;
            $("#userDesablerecordSearch").unbind('click').click(function() {
                _this.getRecordList();
            })

        },
        renderRecord: function(data) {
            var chat_record = '',
                live_record = '',
                desable_record = "";
            var tableHtml = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td >\
                                禁用记录详情\
                                </td></tr>\
                             </thead >\
                            <tbody>\
                                <tr class="text-c"><td>{0}</td></tr>\
                                <tr class="text-c"><td>{1}</td></tr>\
                                <tr class="text-c"><td>{2}</td></tr>\
                            </tbody>\
                        </table >';
            var table_list_chat = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="7">\
                                  聊天室禁用记录\
                                </td>\
                                </tr>\
                                <tr class="text-c">\
                                    <th>聊天室Id</th>\
                                    <th>操作用户Name</th>\
                                    <th>操作用户Id</th>\
                                    <th>状态</th>\
                                    <th>操作时间</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table >';
            var table_list_live = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="7">\
                                  直播间禁用记录\
                                </td>\
                                </tr>\
                                <tr class="text-c">\
                                    <th>房间id</th>\
                                    <th>操作用户Name</th>\
                                    <th>操作用户Id</th>\
                                    <th>状态</th>\
                                    <th>操作时间</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table >';
            var table_list_user = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="7">\
                                  账号禁用记录\
                                </td>\
                                </tr>\
                                <tr class="text-c">\
                                    <th>用户id</th>\
                                    <th>操作用户Name</th>\
                                    <th>操作用户Id</th>\
                                     <th>来源</th>\
                                    <th>状态</th>\
                                    <th>操作时间</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table >';
            if (data.chatroom) {
                var chatRoomList = data.chatroom.map(function(item) {
                    var roomType = item.type == 1 ? '解封' : "禁用";
                    return '<tr>' +
                        '<td>' + item.user_id + '</td>' +
                        '<td>' + item.oper_user_name + '</td>' +
                        '<td>' + item.oper_user_id + '</td>' +
                        '<td>' + roomType + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                        '</tr>'
                }).join('');
                chat_record = util.String.stringFormat(table_list_chat, chatRoomList);
            };
            if (data.live) {
                var liveRoomList = data.live.map(function(item) {
                    var state_flag = item.state_flag == 1 ? '解封' : "禁用";
                    return '<tr>' +
                        '<td>' + item.room_id + '</td>' +
                        '<td>' + item.oper_name + '</td>' +
                        '<td>' + Math.abs(item.user_id) + '</td>' +
                        '<td>' + state_flag + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                        '</tr>'
                }).join('');
                live_record = util.String.stringFormat(table_list_live, liveRoomList);
            }
            if (data.disable) {
                var USERList = data.disable.map(function(item) {
                    var state_flag = item.type == 0 ? '解封' : item.type == 1 ? "禁用" : '永久禁用';
                    var suerType = item.source == 1 ? '后台' : item.source == 2 ? '短视屏' : '敏感词'
                    return '<tr>' +
                        '<td>' + item.userId + '</td>' +
                        '<td>' + item.operName + '</td>' +
                        '<td>' + item.operId + '</td>' +
                        '<td>' + suerType + '</td>' +
                        '<td>' + state_flag + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.createTime)) + '</td>' +
                        '</tr>'
                }).join('');
                desable_record = util.String.stringFormat(table_list_user, USERList);
            }
            $("#desableRecord").html(util.String.stringFormat(tableHtml, desable_record, live_record, chat_record))
        },
        /**
         * @param  禁言踢出房间列表;
         */
        getGagPlay: function() {
            if (cookie_util.get_cookie('siginListId')) {
                $('input[name="user-gag-play"]').val(cookie_util.get_cookie('siginListId'));
                this.getGag_playList(1);
            }
            this.getGag_playBind();
        },
        getGag_playList: function(page) {
            var textVal = $('input[name="user-gag-play"]').val();
            var _this = this;
            if (textVal) {
                getAjax('user/mute/' + textVal, {
                    page: page,
                    size: 10
                }, function(data) {
                    getAjax("user/kick/" + textVal, {
                        page: page,
                        size: 10
                    }, function(res) {
                        var msg = {
                            gag: data.dataInfo,
                            play: res.dataInfo
                        }
                        cookie_util.add_or_update_cookie("siginListId", textVal);
                        _this.renderGag_playList(msg);
                        _this.first_change[_this.getGagPlay_index] = false;
                    })
                })
            } else {
                layer.msg('请输入查询条件')
            }
        },
        getGag_playBind: function() {
            var _this = this;
            $("#user-gag-play").unbind('click').click(function() {
                _this.getGag_playList(1);
            })
        },
        renderGag_playList: function(data) {
            //console.log(data)
            var gag_record = "",
                play_record = "";
            var table_list_gag = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="7">\
                                  禁言管理\
                                </td>\
                                </tr>\
                                <tr class="text-c">\
                                    <th>房间号</th>\
                                    <th>禁言用户Id</th>\
                                    <th>禁言时长(分钟)</th>\
                                    <th>被禁言时间</th>\
                                     <th>操作</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table ><div id="table_list_gag_page"></div>';
            var table_list_play = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="7">\
                                  踢出房间管理\
                                </td>\
                                </tr>\
                                <tr class="text-c">\
                                    <th>房间号</th>\
                                    <th>房间类型</th>\
                                    <th>操作用户Id</th>\
                                    <th>踢出时长(分钟)</th>\
                                    <th>被踢出时间</th>\
                                    <th>操作</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table ><div id="table_list_play_page"></div>';
            if (data.gag.list) {
                var gagList = data.gag.list.map(function(item) {
                    return '<tr class="text-c">' +
                        '<td>' + item.room_id + '</td>' +
                        '<td>' + item.user_id + '</td>' +
                        '<td>' + ((item.mute_time) / (60 * 1000)) + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                        '<td><input data-btn="remove_gag" data-rid=' + item.room_id + ' style="margin-right:10px;" class="hide removeGag btn btn-secondary radius" type="button" value="解除禁言">' +
                        '<input data-btn="remove_gag" data-rid=' + item.room_id + '  style="margin-right:10px;" class="hide removeAllgag btn btn-secondary radius" type="button" value="解除全站禁言">' +
                        '<input data-uid=' + item.user_id + ' data-rid=' + item.room_id + ' class="gag_message btn btn-secondary radius" type="button" value="详情"></td>' +
                        '</tr>'
                }).join('');
                gag_record = util.String.stringFormat(table_list_gag, gagList);

            }
            if (data.play.list) {
                var palyList = data.play.list.map(function(item) {
                    var state_flag = item.room_type == 1 ? '直播间' : "语聊室";

                    return '<tr class="text-c">' +
                        '<td>' + item.room_id + '</td>' +
                        '<td>' + state_flag + '</td>' +
                        '<td>' + item.user_id + '</td>' +
                        '<td>' + ((item.kick_time) / (60 * 1000)) + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                        '<td><input style="margin-right:10px;" data-btn="remove_play" data-rid=' + item.room_id + ' data-type=' + item.room_type + ' class="hide removeplay btn btn-secondary radius" type="button" value="解除踢出房间">' +
                        '<input data-uid=' + item.user_id + ' data-rid=' + item.room_id + ' class="play_message btn btn-secondary radius" type="button" value="详情"></td>' +
                        '</tr>'
                }).join('');
                play_record = util.String.stringFormat(table_list_play, palyList);

            }
            $("#gag_PlayRoom").html(gag_record + play_record);
            var page_gag = data.gag.page || 1;
            var page_play = data.play.page || 1;
            var pagEcount_gag = data.gag.pageCount > 0 ? data.gag.pageCount : 1;
            var pagEcount_play = data.play.pageCount > 0 ? data.play.pageCount : 1;
            util.page_html('table_list_gag_page', page_gag, pagEcount_gag, 'userDetails.getGag_playList');
            util.page_html('table_list_play_page', page_play, pagEcount_play, 'userDetails.getGag_playList');
            util.functions();
            this.gagAndPlayEvent();
            this.gag_play_details();
            this.detailsSearch();
        },
        detailsSearch: function() {
            var _this = this;
            var uid = cookie_util.get_cookie("siginListId");
            $("#bannedDetailsSearch").off('click').on('click', function() { //禁言
                var rid = $('input[name="bannedDetailsSearch_Id"]').val();
                if (rid) {
                    var tableHtml = '<table style="padding:10px;" class="table table-border table-bordered table-bg table-hover">\
                                <thead class="text-c" >\
                                    <tr><td >房间id</td>\
                                    <td >用户id</td>\
                                    <td >禁用状态</td>\
                                    <td >操作用户id</td>\
                                    <td >操作用户</td>\
                                    <td >禁言时长(分钟)</td>\
                                    <td >操作时间</td>\
                                    </tr>\
                                 </thead >\
                                <tbody>\
                                    {0}\
                                </tbody>\
                            </table >';
                    getAjax("user/mute/detail/" + rid + "/" + uid, {}, function(data) {
                        if (data.dataInfo && data.dataInfo.length > 0) {
                            var list = data.dataInfo.map(function(item) {
                                var mute_state = item.mute_state == 0 ? '移除禁用' : '添加禁用';
                                return '<tr class="text-c">' +
                                    '<td>' + item.room_id + '</td>' +
                                    '<td>' + item.to_user_id + '</td>' +
                                    '<td>' + mute_state + '</td>' +
                                    '<td>' + item.from_user_id + '</td>' +
                                    '<td>' + item.oper_name + '</td>' +
                                    '<td>' + item.mute_time / (60 * 1000) + '</td>' +
                                    '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                                    '</tr>'
                            }).join('')
                            layer.open({
                                type: 1,
                                title: '禁言详情',
                                skin: 'layui-layer-rim', //加上边框
                                area: ['900px', '480px'], //宽高
                                content: util.String.stringFormat(tableHtml, list)
                            });
                        } else {
                            layer.msg('查询内容不存在！')
                        }
                    })
                } else {
                    layer.msg('请输入房间ID！')
                }

            });
            $("#kickDetailsSearch").off('click').on("click", function() {
                var rid = $('input[name="bannedDetailsSearch_Id"]').val();
                if (rid) {
                    var tableHtml = '<table style="padding:10px;" class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-c" >\
                                <tr><td >房间id</td>\
                                <td >用户id</td>\
                                <td >踢出状态</td>\
                                <td >操作用户id</td>\
                                <td >操作用户</td>\
                                <td >提出时长(分钟)</td>\
                                <td >操作时间</td>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table >';
                    getAjax("user/kick/detail/" + rid + "/" + uid, {}, function(data) {
                        if (data.dataInfo && data.dataInfo.length > 0) {
                            var list = data.dataInfo.map(function(item) {
                                var mute_state = item.kick_state == 0 ? '移除' : '添加';
                                return '<tr class="text-c">' +
                                    '<td>' + item.room_id + '</td>' +
                                    '<td>' + item.to_user_id + '</td>' +
                                    '<td>' + mute_state + '</td>' +
                                    '<td>' + item.from_user_id + '</td>' +
                                    '<td>' + item.oper_name + '</td>' +
                                    '<td>' + item.kick_time / (60 * 1000) + '</td>' +
                                    '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                                    '</tr>'
                            }).join('')
                            layer.open({
                                type: 1,
                                title: '踢出详情',
                                skin: 'layui-layer-rim', //加上边框
                                area: ['900px', '480px'], //宽高
                                content: util.String.stringFormat(tableHtml, list)
                            });
                        } else {
                            layer.msg('查询内容不存在！')
                        }
                    })
                } else {
                    layer.msg('请输入房间ID！')
                }

            });
        },
        gagAndPlayEvent: function() {
            var uid = cookie_util.get_cookie("siginListId");
            var _this = this;
            $(".removeGag").unbind('click').click(function() {
                var room_id = $(this).attr('data-rid');
                layer.confirm('确定解除吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function() {
                    postAjax("user/release/" + room_id + "/" + uid + "/1/0", {}, function() {
                        layer.msg("解除成功");
                        _this.getGag_playList(1)
                    })
                }, function() {

                });
            });
            $(".removeAllgag").unbind('click').click(function() {
                var room_id = $(this).attr('data-rid');
                layer.confirm('确定解除吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function() {
                    postAjax("user/release/" + room_id + "/" + uid + "/3/0", {}, function() {
                        layer.msg("解除成功");
                        _this.getGag_playList(1);
                    })
                }, function() {

                });
            });
            $(".removeplay").unbind('click').click(function() {
                var room_id = $(this).attr('data-rid');
                var roomType = $(this).attr("data-type")
                layer.confirm('确定解除吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function() {
                    postAjax("user/release/" + room_id + "/" + uid + "/2/" + roomType, {}, function() {
                        layer.msg("解除成功");
                        _this.getGag_playList(1);
                    })
                }, function() {

                });

            })
        },
        gag_play_details: function() {
            /**
             * 详情
             */
            var _this = this;

            $(".gag_message").off('click').on('click', function() { //禁言
                var uid = $(this).data('uid');
                var rid = $(this).data('rid');
                var tableHtml = '<table style="padding:10px;" class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-c" >\
                                <tr><td >房间id</td>\
                                <td >用户id</td>\
                                <td >禁用状态</td>\
                                <td >操作用户id</td>\
                                <td >操作用户</td>\
                                <td >禁言时长(分钟)</td>\
                                <td >操作时间</td>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table >';
                getAjax("user/mute/detail/" + rid + "/" + uid, {}, function(data) {
                    if (data.dataInfo && data.dataInfo.length > 0) {
                        var list = data.dataInfo.map(function(item) {
                            var mute_state = item.mute_state == 0 ? '移除禁用' : '添加禁用';
                            return '<tr class="text-c">' +
                                '<td>' + item.room_id + '</td>' +
                                '<td>' + item.to_user_id + '</td>' +
                                '<td>' + mute_state + '</td>' +
                                '<td>' + item.from_user_id + '</td>' +
                                '<td>' + item.oper_name + '</td>' +
                                '<td>' + item.mute_time / (60 * 1000) + '</td>' +
                                '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                                '</tr>'
                        }).join('')
                        layer.open({
                            type: 1,
                            title: '禁言详情',
                            skin: 'layui-layer-rim', //加上边框
                            area: ['900px', '480px'], //宽高
                            content: util.String.stringFormat(tableHtml, list)
                        });
                    } else {
                        layer.msg("无详情！");
                    }

                })

            });
            $(".play_message").off('click').on("click", function() {
                var uid = $(this).data('uid');
                var rid = $(this).data('rid');
                var tableHtml = '<table style="padding:10px;" class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-c" >\
                                <tr><td >房间id</td>\
                                <td >用户id</td>\
                                <td >踢出状态</td>\
                                <td >操作用户id</td>\
                                <td >操作用户</td>\
                                <td >提出时长(分钟)</td>\
                                <td >操作时间</td>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table >';
                getAjax("user/kick/detail/" + rid + "/" + uid, {}, function(data) {
                    if (data.dataInfo && data.dataInfo.length > 0) {
                        var list = data.dataInfo.map(function(item) {
                            var mute_state = item.kick_state == 0 ? '移除' : '添加';
                            return '<tr class="text-c">' +
                                '<td>' + item.room_id + '</td>' +
                                '<td>' + item.to_user_id + '</td>' +
                                '<td>' + mute_state + '</td>' +
                                '<td>' + item.from_user_id + '</td>' +
                                '<td>' + item.oper_name + '</td>' +
                                '<td>' + item.kick_time / (60 * 1000) + '</td>' +
                                '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                                '</tr>'
                        }).join('')
                        layer.open({
                            type: 1,
                            title: '踢出详情',
                            skin: 'layui-layer-rim', //加上边框
                            area: ['900px', '480px'], //宽高
                            content: util.String.stringFormat(tableHtml, list)
                        });
                    }

                })

            })
        },
        /**
         * 背包
         */
        getBackpack: function() {
            //backpack_tab
            var userID = cookie_util.get_cookie('siginListId');
            if (userID) {
                $('input[name="user-backpack"]').val(userID);
                this.backpackList();
            };
            this.backpackBind();
        },
        backpackBind: function() {
            var _this = this;
            $('#user-backpack').off('click').on('click', function() {
                _this.backpackList();

            })

        },
        backpackList: function() {
            var _this = this;
            var userId = $('input[name="user-backpack"]').val();
            if (userId) {
                cookie_util.add_or_update_cookie('siginListId', userId);
                getAjax('user/bag/info/' + userId, {}, function(data) {
                    _this.first_change[_this.getBackpack_index] = false;
                    if (data.dataInfo && data.dataInfo) {
                        if (data.dataInfo.gift) {
                            var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-c" >\
                                 <tr class="text-l"> 背包</tr>\
                                <tr>\
                                <td >礼物id</td>\
                                <td >图片</td>\
                                <td >礼物数量</td>\
                                <td >类型</td>\
                                <td >支付方式</td>\
                                <td >是否上架</td>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table >';
                            var list = data.dataInfo.gift.map(function(item) {
                                var mute_state = item.giftUserType == 0 ? '共享' : item.giftUserType == 1 ? '房间专属' : '用户专属';
                                var payType = item.payType == 0 ? '金币' : '钻石';
                                var shelves = item.shelves == 0 ? "上架" : '下架';
                                return '<tr class="text-c">' +
                                    '<td>' + item.id + '</td>' +
                                    '<td><img style="height:30px;" src=' + serverUrl + item.pic + ' /></td>' +
                                    '<td>' + item.num + '</td>' +
                                    '<td>' + mute_state + '</td>' +
                                    '<td>' + payType + '</td>' +
                                    '<td>' + shelves + '</td>' +
                                    '</tr>'
                            }).join('');
                            $("#backpack_tab").html(util.String.stringFormat(tableHtml, list));
                        }
                        if (data.dataInfo.car) {
                            var tableHtml_car = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-c" >\
                                 <tr class="text-l"> 座驾</tr>\
                                <tr>\
                                <td >carid</td>\
                                <td >图片</td>\
                                <td >是否正在使用</td>\
                                <td >过期时间</td>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table >';
                            var list_car = data.dataInfo.car.map(function(item) {
                                var mute_state = item.user ? '是' : '否'
                                return '<tr class="text-c">' +
                                    '<td>' + item.cid + '</td>' +
                                    '<td><img style="height:30px;" src=' + serverUrl + item.pic + ' /></td>' +
                                    '<td>' + mute_state + '</td>' +
                                    '<td>' + util.DateTime.showtime(new Date(item.expire)) + '</td>' +
                                    '</tr>'
                            }).join('');
                            $("#car_tab").html(util.String.stringFormat(tableHtml_car, list_car));
                        }
                    }
                })
            } else {
                layer.msg('请输入查询条件')
            }


        },
        /**
         * 充值
         */
        getRechange: function() {
            var userID = cookie_util.get_cookie('siginListId');
            var data = new Date().getTime();
            var endTime = data + (24 * 60 * 60 * 1000);
            var statrTime = data - (7 * 24 * 60 * 60 * 1000);
            /*当查询过基本信息的用户，自动查询登录信息*/
            if (!$("#rechange-start").val() || !$("#rechange-end").val()) {
                layui.use('laydate', function() {
                    var laydate = layui.laydate;
                    //执行一个laydate实例
                    laydate.render({
                        elem: '#rechange-start', //指定元素
                        type: 'date',
                        range: false,
                        format: 'yyyy-MM-dd',
                        value: util.DateTime.showtime(new Date(statrTime))
                    });
                    laydate.render({
                        elem: '#rechange-end',
                        type: 'date',
                        range: false,
                        format: 'yyyy-MM-dd',
                        value: util.DateTime.showtime(new Date(endTime))
                    });
                });
            }
            if (userID) {
                $('input[name="user-rechange"]').val(userID);
                this.rechangeList(1);
            };
            this.rechangeBind();
        },
        rechangeList: function(page) {
            var _this = this;

            var userId = $('input[name="user-rechange"]').val();
            if (userId) {
                var kw = $('input[name="user-rechangLists"]').val();
                var startTime = "";
                var endTime = ""
                if ($('#rechange-start').val()) {
                    startTime = $('#rechange-start').val() + ' 00:00:00';
                };
                if ($('#rechange-end').val()) {
                    endTime = $('#rechange-end').val() + ' 00:00:00';
                };
                if (kw) {
                    startTime = "";
                    endTime = "";
                }
                cookie_util.add_or_update_cookie('siginListId', userId);
                getAjax('user/recharge/' + userId, {
                    page: page,
                    size: 10,
                    kw: kw,
                    s: startTime,
                    e: endTime
                }, function(data) {
                    _this.first_change[_this.getRechange_index] = false;
                    _this.render_rechangeTable(data.dataInfo);
                })
            } else {
                layer.msg("请输入userid")
            }
        },
        render_rechangeTable: function(data) {
            if (data.list) {
                var table_list = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="11">\
                                  充值记录\
                                </td>\
                                </tr>\
                                <tr class="text-c">\
                                    <th>用户id</th>\
                                    <th>订单号</th>\
                                    <th>秀币</th>\
                                    <th>秀豆</th>\
                                    <th>币种</th>\
                                    <th>金额</th>\
                                    <th>充值状态</th>\
                                    <th>客户端</th>\
                                    <th>充值类型</th>\
                                    <th>充值时间</th>\
                                    <th>付款时间</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table ><div id="user_page_recharge"></div>';
                var rechangeList = data.list.map(function(item) {
                    var rechargeStatus = item.rechargeStatus == 0 ? "初始状态" : item.rechargeStatus == 1 ? "成功" : "失败",
                        requestType = "";
                    switch (item.requestType) {
                        case 1:
                            requestType = 'web前端';
                            break;
                        case 2:
                            requestType = '安卓手机';
                            break;
                        case 3:
                            requestType = '安卓平板';
                            break;
                        case 4:
                            requestType = '苹果手机';
                            break;
                        case 5:
                            requestType = '苹果平板';
                            break;
                        case 6:
                            requestType = '后台';
                            break;
                    }
                    // if (){
                    var enddata = item.endDate ? util.DateTime.fulltime(new Date(item.endDate)) : "";
                    var rechargeNo = item.rechargeNo ? item.rechargeNo : "";
                    //}
                    return '<tr>' +
                        '<td>' + item.userId + '</td>' +
                        '<td>' + rechargeNo + '</td>' +
                        '<td>' + item.balance + '</td>' +
                        '<td>' + item.returnBalance + '</td>' +
                        '<td>' + item.currency + '</td>' +
                        '<td>' + item.money + '</td>' +
                        '<td>' + rechargeStatus + '</td>' +
                        '<td>' + requestType + '</td>' +
                        '<td>' + item.rechargeType + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.startDate)) + '</td>' +
                        '<td>' + enddata + '</td>' +
                        '</tr>'
                }).join('');
                $("#rechangList").html(util.String.stringFormat(table_list, rechangeList));
                util.page_html('user_page_recharge', data.page, data.pageCount, 'userDetails.rechangeList');
            }

        },
        rechangeBind: function() {
            var _this = this;
            $('input[name="user-rechangLists"]').on('input propertychange', function() {
                var val = $(this).val()
                if (val) {
                    $('#rechange-end').hide();
                    $('#rechange-start').hide();
                } else {
                    $('#rechange-end').show();
                    $('#rechange-start').show();
                }
            });
            $("#user-rechangeSearch").unbind('click').click(function() {
                _this.rechangeList(1);
            })
            $("#export").unbind("click").click(function() {
                var id = $('input[name="user-rechange"]').val();
                var startTime = $('#rechange-start').val();
                var endTime = $('#rechange-end').val();
                var s_time = startTime + " 00:00:00";
                var e_time = endTime + " 00:00:00";
                if (id && startTime && endTime) {
                    var src = paths + 'record/recharge/excel/' + id + '/' + s_time + '/' + e_time;
                    window.location.href = src;
                } else {
                    layer.msg('你输入的搜索条件不正确')
                }
            });
        }
    });

    userDetails.init();
    util.functions();
});