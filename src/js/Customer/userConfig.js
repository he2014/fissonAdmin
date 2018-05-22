$(document).ready(function() {
    var userConfig = (window["userConfig"] = {
        init: function() {
            new Promise(
                function(resolve) {
                    this.getConfigs();
                    resolve();
                    util.functions();
                }.bind(this)).then(function() {
                this.content_toggle();
                // this.gift();
                // this.diamond();
                // this.car();
                // this.badge();
                // this.level();
                // this.member();
                // this.sign();

            }.bind(this));
            this.binds();

        },
        content_toggle: function() {
            $(".admin_bar").unbind('click').click(function() {
                $('div.content').addClass('hide');
                $(this).siblings('div.content').toggleClass('hide');
            })
        },
        getConfigs: function() {
            getAjax('record/list/gift', {}, function(data) {
                if (data.dataInfo) {
                    var list = data.dataInfo.map(function(item) {
                        return '<option value=' + item.gift_id + '>' + item.gift_name + '</option>'
                    }).join(' ')
                    $("#gift_select").html(list);
                }
            });
            getAjax('record/list/car', {}, function(data) {
                if (data.dataInfo) {
                    var list = data.dataInfo.map(function(item) {
                        return '<option value=' + item.car_id + '>' + item.car_name + '</option>'
                    }).join(' ')
                    $("#car_select").html(list);
                }
            })
            getAjax('record/list/badge', {}, function(data) {
                if (data.dataInfo) {
                    var list = data.dataInfo.map(function(item) {
                        return '<option value=' + item.level_num + '>' + item.level_name + '</option>'
                    }).join(' ')
                    $("#badge_select").html(list);
                }
            })
            var date_list = '';
            for (var i = 1; i <= 30; i++) {
                date_list += '<option value=' + i + '>' + i + '</option>'
            }
            $('#sign_number').html(date_list);
        },
        gift: function(userId) {
            var _this = this;
            getAjax('user/detail/' + userId + "/gift", {}, function(data) {
                var header = ['礼物', '数量(个)'];
                var content = [{
                    item: "pic",
                    //0 普通文字  1 图片  2 日期  3布尔
                    bool: 1
                }, {
                    item: "num",
                    bool: 0
                }]
                if (data.dataInfo.gift != undefined && data.dataInfo.gift.length > 0) {
                    $("#gift_table").html(_this.renderTable(data.dataInfo.gift, header, content));

                } else {
                    $("#gift_table").html('<div class="ml-20 " style="margin-top: 20px !important;">无记录</div>');
                }
            })
        },
        diamond: function(userId) { //stars_search
            var _this = this;
            getAjax('user/detail/' + userId + "/diamond", {}, function(data) {
                var header = ['数量'];
                var content = [{
                    item: "fansgift",
                    bool: false
                }];
                var datas = [];
                datas.push(data.dataInfo)
                $("#stars_table").html(_this.renderTable(datas, header, content, '用户礼物'));
            })
        },
        car: function(userId) {
            var _this = this;
            getAjax('user/detail/' + userId + "/car", {}, function(data) {
                var header = ['座驾', '名称', '过期时间', '当前使用'];
                var content = [{
                        item: "pic",
                        bool: 1
                    },
                    {
                        item: "name",
                        bool: 0
                    },
                    {
                        item: "expire",
                        bool: 2
                    },
                    {
                        item: "user",
                        bool: 3
                    }
                ];
                if (data.dataInfo.car != undefined && data.dataInfo.car.length > 0) {
                    $("#car_table").html(_this.renderTable(data.dataInfo.car, header, content));
                } else {
                    $("#car_table").html('<div class="ml-20 " style="margin-top: 20px !important;">无记录</div>');
                }
            })
        },
        badge: function(userId) {
            var _this = this;
            getAjax('user/detail/' + userId + "/badge", {}, function(data) {
                var header = ['徽章', '名字', '过期时间'];
                var content = [{
                        item: "pic",
                        bool: 1
                    },
                    {
                        item: "name",
                        bool: 0
                    },
                    {
                        item: "exp",
                        bool: 2
                    }
                ];
                var d = [];
                if (data.dataInfo.badges && data.dataInfo.badges.length > 0) {
                    data.dataInfo.badges.forEach(function(value) {
                        var temp = new Object();
                        temp.exp = value.expire;
                        if (data.dataInfo.badgeMap) {
                            data.dataInfo.badgeMap.forEach(function(value2) {
                                if (value.id == value2.level_num) {
                                    temp.pic = value2.level_pic;
                                    temp.name = value2.level_name;
                                }
                            })
                        }
                        d.push(temp);
                    });
                    $("#badge_table").html(_this.renderTable(d, header, content));

                } else {
                    $("#badge_table").html('<div class="ml-20 " style="margin-top: 20px !important;">无记录</div>');
                }
            })
        },
        level: function(userId) {
            var _this = this;
            getAjax('user/detail/' + userId + "/level", {}, function(data) {
                var header = ['类型', '等级', '积分'];
                var content = [{
                        item: "type",
                        bool: 0
                    },
                    {
                        item: "level",
                        bool: 0
                    },
                    {
                        item: "score",
                        bool: 0
                    }
                ];
                var d = [];
                if (data.dataInfo.host) {
                    var temp = new Object();
                    temp.type = '主播等级';
                    temp.score = data.dataInfo.host.score;
                    temp.level = data.dataInfo.host.level;
                    d.push(temp);
                }
                if (data.dataInfo.user) {
                    var temp = new Object();
                    temp.type = '用户等级';
                    temp.score = data.dataInfo.user.score;
                    temp.level = data.dataInfo.user.level;
                    d.push(temp);
                }
                $("#level_table").html(_this.renderTable(d, header, content));
            })
        },
        member: function(userId) {
            var _this = this;
            getAjax('user/detail/' + userId + "/viplist", {}, function(data) {
                var header = ['类型', '过期时间'];
                var content = [{
                        item: "type",
                        bool: 0
                    },
                    {
                        item: "exp",
                        bool: 2
                    }
                ];
                if (data.dataInfo.viplist && data.dataInfo.viplist.length > 0) {
                    var d = [];
                    data.dataInfo.viplist.forEach(function(value) {
                        var temp = new Object();
                        temp.type = value.type == 1 ? 'vip' : 'svip';
                        temp.exp = value.expire;
                        d.push(temp);
                    })
                    $("#member_table").html(_this.renderTable(d, header, content));
                } else {
                    $("#member_table").html('<div class="ml-20 " style="margin-top: 20px !important;">无记录</div>');
                }
            })
        },
        renderTable: function(data, header, content) {
            var template = '<table class="table table-border table-bordered table-bg table-hover" style="margin-top: 20px;">\
                    <thead  >\
                    <tr class="text-c" >\
                     {0}\
                </tr>\
                </thead >\
                <tbody>\
                 {1}\
                </tbody>\
                </table >';
            var headContent = header.map(function(item) {
                return '<th>' + item + '</th>'
            }).join("");
            var table_body = data.map(function(item, index) {
                var list = "";
                list += '<tr class="text-c">';
                list += content.map(function(ele) {
                    if (ele.bool == 1) {
                        var item_pic = item.pic ? '<img style="height:28px;" src="' + serverUrl + item[ele['item']] + '"/>' :
                            '<img style="height:28px;" src="../../images/nophoto1.jpg" />';
                        return '<td>' + item_pic + '</td>'
                    } else if (ele.bool == 2) {
                        return '<td>' + (util.DateTime.fulltime(new Date(item[ele['item']]))) + '</td>'
                    } else if (ele.bool == 3) {
                        return '<td>' + (item[ele['item']] ? '是' : '否') + '</td>'
                    } else {
                        if (item[ele['item']]) {
                            return '<td>' + item[ele['item']] + '</td>'
                        } else {
                            return '<td></td>'
                        }
                    }
                }).join('')
                list += '</tr>';
                return list;
            })
            return util.String.stringFormat(template, headContent, table_body).replace(/,/g, "");
        },
        binds: function() {
            // 礼物按钮
            $("#gift_search").unbind("click").click(function() {
                var userId = $("#gift_userId").val();
                if (!userId || userId == 0) {
                    layer.msg('请输入用户id');
                    return;
                }
                if (userId) {
                    userConfig.gift(userId);
                }
            });
            $("#gift_add").unbind("click").click(function() {
                var userId = $("#gift_userId").val();
                var giftId = $("#gift_select").val();
                var number = $("#gift_number").val();
                if (!userId || userId == 0 || !number || number == 0) {
                    layer.msg('请输入用户id和数量');
                    return;
                }
                if (userId && number && giftId) {
                    postAjax('user/config/gift/add/' + userId + "/" + giftId + "/" + number, {}, function(data) {
                        userConfig.gift(userId);
                    })
                }
            });
            $("#gift_delete").unbind("click").click(function() {
                var userId = $("#gift_userId").val();
                var giftId = $("#gift_select").val();
                var number = $("#gift_number").val();
                if (!userId || userId == 0 || !number || number == 0) {
                    layer.msg('请输入用户id和数量');
                    return;
                }
                if (userId && number && giftId) {
                    postAjax('user/config/gift/sub/' + userId + "/" + giftId + "/" + number, {}, function(data) {
                        userConfig.gift(userId);
                    })
                }
            });
            // 钻石按钮
            $("#stars_search").unbind("click").click(function() {
                var userId = $("#stars_userId").val();
                if (!userId || userId == 0) {
                    layer.msg('请输入用户id');
                    return;
                }
                if (userId) {
                    userConfig.diamond(userId);
                }
            });
            $("#stars_add").unbind("click").click(function() {
                var userId = $("#stars_userId").val();
                var number = $("#stars_number").val();
                if (!userId || userId == 0 || !number || number == 0) {
                    layer.msg('请输入用户id和数量');
                    return;
                }
                if (userId && number) {
                    postAjax('user/config/diamond/add/' + userId + "/" + number, {}, function(data) {
                        userConfig.diamond(userId);
                    })
                }
            });
            $("#stars_delete").unbind("click").click(function() {
                var userId = $("#stars_userId").val();
                var number = $("#stars_number").val();
                if (!userId || userId == 0 || !number || number == 0) {
                    layer.msg('请输入用户id和数量');
                    return;
                }
                if (userId && number) {
                    postAjax('user/config/diamond/sub/' + userId + "/" + number, {}, function(data) {
                        userConfig.diamond(userId);
                    })
                }
            });
            // 座驾按钮
            $("#car_search").unbind("click").click(function() {
                var userId = $("#car_userId").val();
                if (!userId || userId == 0) {
                    layer.msg('请输入用户id');
                    return;
                }
                if (userId) {
                    userConfig.car(userId);
                }
            });
            $("#car_add").unbind("click").click(function() {
                var userId = $("#car_userId").val();
                var carId = $("#car_select").val();
                var number = $("#car_number").val();
                if (!userId || userId == 0 || !number || number == 0) {
                    layer.msg('请输入用户id和数量');
                    return;
                }
                if (userId && number && carId) {
                    postAjax('user/config/car/add/' + userId + "/" + carId + "/" + number, {}, function(data) {
                        userConfig.car(userId);
                    })
                }
            });
            $("#car_delete").unbind("click").click(function() {
                var userId = $("#car_userId").val();
                var carId = $("#car_select").val();
                var number = $("#car_number").val();
                if (!userId || userId == 0 || !number || number == 0) {
                    layer.msg('请输入用户id和数量');
                    return;
                }
                if (userId && number && carId) {
                    postAjax('user/config/car/sub/' + userId + "/" + carId + "/" + number, {}, function(data) {
                        if (data.code == 0) {
                            userConfig.car(userId);
                        }
                    })
                }
            });
            // 徽章按钮
            $("#badge_search").unbind("click").click(function() {
                var userId = $("#badge_userId").val();
                if (!userId || userId == 0) {
                    layer.msg('请输入用户id');
                    return;
                }
                if (userId) {
                    userConfig.badge(userId);
                }
            });
            $("#badge_add").unbind("click").click(function() {
                var userId = $("#badge_userId").val();
                var badgeId = $("#badge_select").val();
                var number = $("#badge_number").val();
                if (!userId || userId == 0 || !number || number == 0) {
                    layer.msg('请输入用户id和数量');
                    return;
                }
                if (userId && number && badgeId) {
                    postAjax('user/config/badge/add/' + userId + "/" + badgeId + "/" + number, {}, function(data) {
                        userConfig.badge(userId);
                    })
                }
            });
            $("#badge_delete").unbind("click").click(function() {
                var userId = $("#badge_userId").val();
                var badgeId = $("#badge_select").val();
                var number = $("#badge_number").val();
                if (!userId || userId == 0 || !number || number == 0) {
                    layer.msg('请输入用户id和数量');
                    return;
                }
                if (userId && number && badgeId) {
                    postAjax('user/config/badge/sub/' + userId + "/" + badgeId + "/" + number, {}, function(data) {
                        userConfig.badge(userId);
                    })
                }
            });
            // 等级按钮
            $("#level_search").unbind("click").click(function() {
                var userId = $("#level_userId").val();
                if (!userId || userId == 0) {
                    layer.msg('请输入用户id');
                    return;
                }
                if (userId) {
                    userConfig.level(userId);
                }
            });
            $("#level_add").unbind("click").click(function() {
                var userId = $("#level_userId").val();
                var levelId = $("#level_select").val();
                var number = $("#level_number").val();
                if (!userId || userId == 0 || !number || number == 0) {
                    layer.msg('请输入用户id和积分');
                    return;
                }
                if (userId && number && levelId) {
                    postAjax('user/config/level/add/' + userId + "/" + levelId + "/" + number, {}, function(data) {
                        userConfig.level(userId);
                    })
                }
            });
            $("#level_delete").unbind("click").click(function() {
                var userId = $("#level_userId").val();
                var levelId = $("#level_select").val();
                var number = $("#level_number").val();
                if (!userId || userId == 0 || !number || number == 0) {
                    layer.msg('请输入用户id和积分');
                    return;
                }
                if (userId && number && levelId) {
                    postAjax('user/config/level/sub/' + userId + "/" + levelId + "/" + number, {}, function(data) {
                        userConfig.level(userId);
                    })
                }
            });
            // 会员按钮
            $("#member_search").unbind("click").click(function() {
                var userId = $("#member_userId").val();
                if (!userId || userId == 0) {
                    layer.msg('请输入用户id');
                    return;
                }
                if (userId) {
                    userConfig.member(userId);
                }
            });
            $("#member_add").unbind("click").click(function() {
                var userId = $("#member_userId").val();
                var memberId = $("#member_select").val();
                var number = $("#member_number").val();
                if (!userId || userId == 0 || !number || number == 0) {
                    layer.msg('请输入用户id');
                    return;
                }
                if (userId && number && memberId) {
                    postAjax('user/config/vip/add/' + userId + "/" + memberId + "/" + number, {}, function(data) {
                        userConfig.member(userId);
                    })
                }
            });
            $("#member_delete").unbind("click").click(function() {
                var userId = $("#member_userId").val();
                var memberId = $("#member_select").val();
                var number = $("#member_number").val();
                if (!userId || userId == 0 || !number || number == 0) {
                    layer.msg('请输入用户id');
                    return;
                }
                if (userId && number && memberId) {
                    postAjax('user/config/vip/sub/' + userId + "/" + memberId + "/" + number, {}, function(data) {
                        userConfig.member(userId);
                    })
                }
            });
            // 签到
            $("#sign_search").unbind("click").click(function() {
                var userId = $("#sign_userId").val();
                var number = $("#sign_number").val();
                if (!userId || userId == 0) {
                    layer.msg('请输入用户id');
                    return;
                }
                if (userId && number) {
                    postAjax('user/config/sign/' + userId + "/" + number, {}, function(data) {
                        layer.msg('修改成功！');
                    })
                }
            })
        }
    });
    userConfig.init();

})