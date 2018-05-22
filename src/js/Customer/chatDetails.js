$(document).ready(function() {
    var chatDetails = (window['chatDetails'] = {
        init: function() {
            this.getRoomcountry();
            this.chatDetailsheader()
            this.getChatDetails(1);
            this.addChatRoom();

        },
        addChatRoom: function() {
            var _this = this;
            $("#addChatRoomBtn").off('click').on('click', function() {
                if (_this.country) {
                    var $datas = _this.country.map(function(item) {
                        return '<option value="' + item.id + '">' + item.en_name + '</option>'
                    }).join();
                    var countrys = '<option value="0">无</option>' + $datas;
                    var addChatFrom = '<form class="layui-form" action="" style="padding:10px;">\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">聊天室Id</label>\
                                        <div class="layui-input-block">\
                                        <input type="text" id="rid" name="title" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                        </div>\
                                    </div>\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">聊天室名称</label>\
                                        <div class="layui-input-block">\
                                        <input type="text" id="cn" name="title" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                        </div>\
                                    </div>\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">国家</label>\
                                        <div class="layui-input-block">\
                                        <span class="select-box">\
                                         <select style="display:block" class="select" size = "1" id="ci" name = "ci" >{0}\
                                        </select >\
                                        </span >\
                                        </div>\
                                    </div>\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">最大用户数</label>\
                                        <div class="layui-input-block">\
                                        <input type="text" id="maxu" name="title" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                        </div>\
                                    </div>\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">聊天室描述</label>\
                                        <div class="layui-input-block">\
                                        <input type="text" id="des" name="title" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                        </div>\
                                    </div>\
                              </from>';
                    layer.open({
                        type: 1,
                        title: '新建',
                        btn: ['确定', '取消'],
                        skin: 'layui-layer-rim', //加上边框
                        area: ['600px', '480px'], //宽高
                        content: util.String.stringFormat(addChatFrom, countrys),
                        yes: function(index, layero) {
                            var rid = $("#rid").val(),
                                cn = $("#cn").val(),
                                ci = $("#ci").val(),
                                maxu = $("#maxu").val(),
                                des = $("#des").val();
                            if (!rid) {
                                layer.msg('请输入roomid');
                            } else if (!cn) {
                                layer.msg('请输入name');
                            } else if (!ci) {
                                layer.msg('请输入country');
                            } else if (!maxu) {
                                layer.msg('请输入人数');
                            } else {
                                postAjax('chatroom/add', {
                                    rid: rid,
                                    cn: cn,
                                    ci: ci,
                                    m: maxu,
                                    des: des
                                }, function(data) {
                                    if (data.code == 0) {
                                        layer.msg("新建成功");
                                        layer.close(index);
                                        _this.getChatDetails(1);
                                    } else if (data.code == 6001) {
                                        layer.msg("聊天室已存在");
                                    } else if (data.code == 6002) {
                                        layer.msg("房间名字包含关键字");
                                    } else if (data.code == 6003) {
                                        layer.msg("房间描述包含关键字");
                                    }
                                }, "", true)
                            }
                        },
                        btn2: function(index) {
                            layer.close(index)
                        }
                    });

                }


            })
        },
        chatDetailsheader: function() {
            var _this = this;
            $("#changeSearchType").change(function() {
                var val = $(this).val();
                var text = $('input[name="ChatDetailsSearch"]');
                if (val == 1) {
                    text.parent('td').removeClass('hide');
                } else {
                    text.parent('td').addClass('hide');
                    text.val('');
                }
            });
            $("#userDetailsSearch").unbind('click').click(function() {
                _this.getChatDetails(1);
            })
        },
        getChatDetails: function(page) {
            var _this = this;
            this.chatTimeout = null;
            var roomIdInput = $('input[name="ChatDetailsSearch"]').val();
            var room_groom = $("#room_groom").val();
            var room_state = $("#room_state").val();
            var searchType = 0,
                list = "无数据",
                chatDetailsDom = $("#chatDetails");
            if (roomIdInput) {
                searchType = roomIdInput;
            };
            var tableHtml = '<table  class="table table-border table-bordered table-bg table-hover">\
                            <thead >\
                                <tr class="text-l"><td colspan="10">聊天室列表</td></tr>\
                                <tr class="text-c">\
                                <td >房间id</td>\
                                <td >房间名称</td>\
                                <td >麦数</td>\
                                <td >人数上限</td>\
                                <td >是否置顶</td>\
                                <td >是否推荐</td>\
                                <td >是否禁用</td>\
                                <td >麦序</td>\
                                 <td >操作</td>\
                                </tr>\
                             </thead >\
                            <tbody class="hide" id="playRecordingList">\
                                {0}\
                            </tbody>\
                        </table >';
            getAjax('chatroom/' + searchType + '/' + room_groom + '/' + room_state, {
                page: page,
                size: 10
            }, function(data) {
                var datas = data.dataInfo;
                if (datas.list && datas.list.length > 0) {
                    list = datas.list.map(function(item) {
                        var states = item.roomTop == 1 ? "不置顶" : '置顶';
                        var roomShowPriority = item.roomShowPriority == 1 ? "不推荐" : '推荐';
                        var isDisbale = item.roomState == 1 ? '启用' : '禁用';
                        var roomType = item.roomType == 1 ? '正常' : '自由麦';
                        var room_chatNum = item.mr;
                        if (item.mr < 0) {
                            room_chatNum = "查询失败"
                        }
                        item.roomName = item.roomName.replace(/\s/g, '&nbsp;')
                        return '<tr class="text-c">' +
                            '<td>' + item.roomId + '</td>' +
                            '<td>' + item.roomName + '</td>' +
                            '<td>' + room_chatNum + '</td>' +
                            '<td>' + item.maxUser + '</td>' +
                            '<td><a href="#" data-name="roomTop" data-type="select" data-pk="1" data-url="' + paths + 'chatroom/update/top/' + item.roomId + '" data-title="置顶变更">' + states + '</a>' +
                            '</td>' +
                            '<td><a href="#" data-name="roomShowPriority" data-type="select" data-pk="1" data-url="' + paths + 'chatroom/update/state/' + item.roomId + '" data-title="推荐变更">' + roomShowPriority + '</a>' +
                            '</td>' +
                            '<td><a href="#" data-name="isDisbale" data-type="select" data-pk="1" data-url="' + paths + 'chatroom/update/disable/' + item.roomId + '" data-title="置顶变更">' + isDisbale + '</a>' +
                            '</td>' +
                            '<td>' + roomType + '</td>' +
                            '<td >' +
                            "<button data-btn='editTable_chatroom'  id='editTable_chatroom'  class='layui-btn editTable_chatroom hide layui-btn-sm'  data-item=" + JSON.stringify(item) + "><i class='layui-icon'></i></button>" +
                            '<button data-rid=' + item.roomId + ' class="addwheat layui-btn hide  layui-btn-sm" data-btn="addwheat">加麦</button>' +
                            '<button data-rid=' + item.roomId + '  class="delwheat layui-btn hide layui-btn-sm" data-btn="delwheat">减麦</button>' +
                            '<button data-rid=' + item.roomId + '  class="timeOutTask layui-btn hide layui-btn-sm" data-btn="timeOutTask_chatRoom">定时任务</button>' +
                            '</td>' +
                            '</tr>'
                    }).join('');
                    $("#chatDetails").html(util.String.stringFormat(tableHtml, list));
                    _this.chatTimeout = setTimeout(function() {
                        $("#playRecordingList").removeClass('hide');
                        $("div.holder").jPages({
                            containerID: "playRecordingList",
                            first: "首页",
                            last: "尾页",
                            next: "下一页",
                            previous: "上一页"
                        })
                        $("div.holder").removeClass('hide');
                    });
                    util.functions();
                    _this.chatTableEdit();
                    _this.changeTanle_chat();
                } else {
                    $("div.holder").addClass('hide');
                    chatDetailsDom.html(util.String.stringFormat(tableHtml, list));
                }
            })
        },
        getRoomcountry: function() {
            var _this = this;
            getAjax('chatroom/country/get/all', {
                size: 100,
                page: 1
            }, function(datas) {
                _this.country = datas.dataInfo.list;
            })
        },
        changeTanle_chat: function() {
            var self = this;
            var addChatFrom = '<form class="layui-form" action="" style="padding:10px;">\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">聊天室Id</label>\
                                        <div class="layui-input-block">\
                                        <input type="text" value={0} name="rid" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                        </div>\
                                    </div>\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">聊天室名称</label>\
                                        <div class="layui-input-block">\
                                        <input type="text" value={1} name="cn" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                        </div>\
                                    </div>\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">国家</label>\
                                        <div class="layui-input-block">\
                                        <span class="select-box">\
                                         <select style="display:block" class="select" size = "1" name = "ci" >{2}\
                                        </select >\
                                        </span >\
                                        </div>\
                                    </div>\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">最大用户数</label>\
                                        <div class="layui-input-block">\
                                        <input type="text" value={3} name="max" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                        </div>\
                                    </div>\
                                    <div class="layui-form-item" >\
                                        <label class="layui-form-label">聊天室描述</label>\
                                        <div class="layui-input-block">\
                                        <input type="text" value={4} name="des" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">\
                                        </div>\
                                    </div>\
                              </from>';
            $(".editTable_chatroom").unbind('click').click(function() {

                if (self.country) {
                    var data = $(this).attr('data-item');

                    if (typeof data == "string") {
                        var data_s = JSON.parse(data)
                    }
                    var $datas = self.country.map(function(item) {
                        var select = item.id == data_s.country ? 'selected' : "";
                        return '<option ' + select + ' value="' + item.id + '">' + item.en_name + '</option>'
                    }).join(" ");
                    var countrys = '<option value="0">无</option>' + $datas;
                    if (!data_s.desc) {
                        data_s.desc = "无描述"
                    }
                    layer.open({
                        type: 1,
                        title: '编辑',
                        btn: ['确定', '取消'],
                        skin: 'layui-layer-rim', //加上边框
                        area: ['600px', '480px'], //宽高
                        content: util.String.stringFormat(addChatFrom, data_s.roomId, data_s.roomName, countrys, data_s.maxUser, data_s.desc),
                        yes: function(index, layero) {
                            var rid = $("[name='rid']").val(),
                                cn = $("[name='cn']").val(),
                                ci = $("[name='ci']").val(),
                                maxu = $("[name='max']").val(),
                                des = $("[name='des']").val();
                            if (!rid) {
                                layer.msg('请输入roomid');
                            } else if (!cn) {
                                layer.msg('请输入name');
                            } else if (!ci) {
                                layer.msg('请输入country');
                            } else if (!maxu) {
                                layer.msg('请输入人数');
                            } else {
                                postAjax('chatroom/update/' + rid, {
                                    rid: rid,
                                    cn: cn,
                                    ci: ci,
                                    m: maxu,
                                    des: des
                                }, function(data) {
                                    if (data.code == 0) {
                                        layer.msg("修改");
                                        layer.close(index);
                                        self.getChatDetails(1);
                                    } else if (data.code == 6001) {
                                        layer.msg("聊天室已存在");
                                    } else if (data.code == 6002) {
                                        layer.msg("房间名字包含关键字");
                                    } else if (data.code == 6003) {
                                        layer.msg("房间描述包含关键字");
                                    }
                                }, "", true)
                            }
                        },
                        btn2: function(index) {
                            layer.close(index)
                        }
                    });
                }

            })
            $(".addwheat").unbind('click').click(function() {
                var rid = $(this).data('rid');
                layer.confirm('确定执行此操作吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function(index) {
                    postAjax('chatroom/update/forwheat/' + rid, {
                        value: 1
                    }, function() {
                        layer.msg('加麦成功');
                        layer.close(index);
                        self.getChatDetails(1);
                    })
                }, function(index) {
                    layer.close(index);
                });
            })
            $(".delwheat").unbind('click').click(function() {
                var rid = $(this).data('rid');
                layer.confirm('确定执行此操作吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function(index) {
                    postAjax('chatroom/update/forwheat/' + rid, {
                        value: -1
                    }, function() {
                        self.getChatDetails(1);
                        layer.msg('减麦成功');
                        layer.close(index);
                    })
                }, function(index) {
                    layer.close(index);

                });
            });
            $(".timeOutTask").unbind('click').click(function() {
                var rid = $(this).data('rid');
                getAjax("chatroom/timer/info/" + rid, {}, function(data) {
                    var table_list_chat = '<table class="table table-border table-bordered table-bg table-hover">\
                            <thead class="text-l" >\
                                <tr><td colspan="7">\
                                  任务记录\
                                </td>\
                                </tr>\
                                <tr class="text-c">\
                                    <th>任务Id</th>\
                                    <th>任务类型</th>\
                                    <th>回滚值</th>\
                                    <th>房间id</th>\
                                    <th>状态</th>\
                                    <th>执行时间</th>\
                                    <th>创建时间</th>\
                                </tr>\
                             </thead >\
                            <tbody>\
                                {0}\
                            </tbody>\
                        </table >';
                    if (data.dataInfo) {
                        var chatRoomList = data.dataInfo.map(function(item) {
                            var roomType = item.type == 1 ? '房间人数' : "麦序数";
                            var flag = item.flag == 1 ? '已处理' : '未处理';
                            return '<tr>' +
                                '<td>' + item.id + '</td>' +
                                '<td>' + roomType + '</td>' +
                                '<td>' + item.old_value + '</td>' +
                                '<td>' + item.room_id + '</td>' +
                                '<td>' + flag + '</td>' +
                                '<td>' + util.DateTime.fulltime(new Date(item.timer_time)) + '</td>' +
                                '<td>' + util.DateTime.fulltime(new Date(item.create_time)) + '</td>' +
                                '</tr>'
                        }).join('');

                        var addTaskFrom = '<form class="layui-form" action="" style="padding:10px;">\
                                        <span class="font_chat">回滚值</span>\
                                        <input type="text"  name="cn" required lay-verify="required" placeholder="请输入" autocomplete="off" class="input-text radius size-M input_edit">\
                                        <span class="font_chat">执行时间</span>\
                                        <input type="text" id="tastTime"  name="ci" required lay-verify="required" placeholder="请输入" autocomplete="off" class="input-text radius size-M input_edit">\
                                        <span class="font_chat">类型</span>\
                                        <select id="taskSelect" style="display: initial;height: 30px;" name="city" lay-verify=""  >\
                                            <option value = "1" selected> 房间人数</option>\
                                            <option value="2">麦序数</option>\
                                          </select > \
                              </from>';
                        layer.open({
                            type: 1,
                            title: '编辑',
                            btn: ['确定', '取消'],
                            skin: 'layui-layer-rim', //加上边框
                            area: ['1000px', '480px'], //宽高
                            content: util.String.stringFormat(table_list_chat, chatRoomList) + util.String.stringFormat(addTaskFrom),
                            yes: function(index, layero) {
                                var cn = $("[name='cn']").val(),
                                    ci = $("[name='ci']").val(),
                                    maxu = $("#taskSelect").val(),
                                    des = $("[name='des']").val();
                                if (!cn) {
                                    layer.msg('请输入name');
                                } else if (!ci) {
                                    layer.msg('请输入时间');
                                } else if (!maxu) {
                                    layer.msg('请输入人数');
                                } else {
                                    postAjax('chatroom/timer/add/' + rid, {
                                        rid: rid,
                                        ov: cn,
                                        nv: 0,
                                        s: ci,
                                        t: maxu
                                    }, function(data) {
                                        layer.close(index);
                                        layer.msg("新建成功")
                                    })
                                }
                            },
                            btn2: function(index) {
                                layer.close(index)
                            }
                        });
                        layui.use('laydate', function() {
                            var laydate = layui.laydate;
                            //执行一个laydate实例
                            laydate.render({
                                elem: '#tastTime', //指定元素
                                type: 'datetime',
                                range: false,
                                format: 'yyyy-MM-dd HH:mm:ss',
                                value: ''
                            });
                        });
                    }

                })

            })
        },
        editableCallback: function(response, newVal) {
            if (response && response.code == 0) {
                util.Huipopup("更新成功");
            } else {
                util.Huipopup("更新失败");
            }
            //console.log(response)
        },
        chatTableEdit: function() {
            var resourceId = util.Storage.get("resourceId");
            var local_change = cookie_util.get_cookie('local_change');
            if (local_change == 'LOCAL_CAHNGE_' + resourceId) {
                $('a[data-name="roomTop"]').editable({
                    success: chatDetails.editableCallback,
                    source: [{
                            value: 1,
                            text: '不置顶'
                        },
                        {
                            value: 2,
                            text: '置顶'
                        }
                    ]
                });
                $('a[data-name="roomShowPriority"]').editable({
                    success: chatDetails.editableCallback,
                    source: [{
                            value: 1,
                            text: '未推荐'
                        },
                        {
                            value: 2,
                            text: '推荐'
                        }
                    ]
                });
                $('a[data-name="isDisbale"]').editable({
                    success: chatDetails.editableCallback,
                    source: [{
                            value: 1,
                            text: '启用'
                        },
                        {
                            value: 2,
                            text: '禁用'
                        }
                    ]
                });
            }

        }
    })
    chatDetails.init();
});