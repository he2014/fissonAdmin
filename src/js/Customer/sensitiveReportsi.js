$(document).ready(function() {
    var sensitiveReports_tables = (window['sensitiveReports_tables'] = {
        init: function() {
            this.sensitiveReportData(1);
            this.sensitiveReport_add();
            //add_reports_Btn
            this.searchAll();
        },
        searchAll: function() {
            var _this = this;
            $("#sensitiveReportsSearch").unbind('click').click(function() {
                _this.sensitiveReportData(1);
            })
        },
        sensitiveReport_add: function() {
            var _this = this;
            $("#add_reports_Btn").unbind('click').click(function() {
                var edit_form = '<div class="form-out">\
              <div class="form-lable">   </div>\
              <div class="form-box is-poster">\
                  <input type="radio"  name="demo-radio3" checked value="1" >\
                  <label for="radio-2">all</label>\
                  <input type="radio" name="demo-radio3" value="2" >\
                  <label for="radio-2">chat</label>\
                  <input type="radio" name="demo-radio3" value="3" >\
                  <label for="radio-2">name</label>\
              </div>\
            </div>\
            <div class="form-out">\
            <div class="form-lable">key words</div>\
            <div class="form-box is-sort">\
                <input type="text" placeholder="pleacse." class="input-text radius size-m">\
            </div>\
          </div>'
                //
                layer.open({
                    title: 'Add Forbidden Words',
                    btn: ['ok'],
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['400px', '240px'], //宽高
                    content: edit_form,
                    yes: function(index) {
                        var sort = $('.is-sort input').val();
                        var showType = $('[name="demo-radio3"]:checked').val();
                        if (sort) {
                            postAjax('sensitive/add/keyword/' + showType + '/' + sort, {}, function() {
                                _this.sensitiveReportData(1);
                                util.Huipopup('修改成功');
                                layer.close(index);
                            })
                        }

                    }
                });

            })

        },
        sensitiveReportData: function(page) {
            var _this = this;
            getAjax('sensitive/keyword/history', {
                page: page,
                size: 20,
                breakType: $('#searchType').val(),
                handleType: $("#searchOperationType").val(),
                roomId: $("#sensitiveReports_room").val(),
                userId: $("#sensitiveReports_user").val()
            }, function(data) {
                _this.renderDate(data.dataInfo)
            })
        },
        renderDate: function(data) {
            var template = ' <table class="table table-border table-bordered table-bg table-hover">\
            <thead class="text-l" >\
            <tr> <td colspan="6" >Monitoring information list</td></tr>\
            <tr class="text-c">\
            <th>RoomID</th>\
            <th>Presenter</th>\
            <th>Number</th>\
            <th>Content</th>\
            <th>Date</th>\
            <th>Operation</th>\
            </tr>\
            </thead >\
            <tbody>\
                {0}\
            </tbody>\
            </table><div id="pagesensitiveReports"></div>';
            if (data.list && data.list.length > 0) {
                var list = data.list.map(function(item) {
                    var fromNickname = item.fromNickname || "";
                    var userid = item.userid;
                    var badge = item.badge.badges || "";
                    var badgeMap = item.badge.badgeMap || "";
                    return '<tr class="text-c">' +
                        '<td>' + item.roomId + '</td>' +
                        '<td style="min-width: 100px;">[' + item.fromUserId + ']' + fromNickname + util.badge(badge, badgeMap) + '</td>' +
                        '<td>' + item.total + '</td>' +
                        '<td>' + util.gldata(item.content, item.keyword) + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.foulTime)) + '</td>' +
                        '<td><div style="display:flex;justify-content:space-around">' +
                        '<button class="layui-btn layui-btn-xs edit_tag_info" data-uid=' + userid + ' data-msg=' + item.roomId + ' >INFO</button>' +
                        '<button data-btn="sensitiveReport_RBan" class="hide layui-btn layui-btn-xs edit_tag_rban"  data-uid=' + userid + ' data-msg=' + item.roomId + ' >RBan</button>' +
                        '<button data-btn="sensitiveReport_GLBan" class="hide layui-btn layui-btn-xs edit_tag_GLBan"  data-uid=' + userid + ' data-msg=' + item.roomId + ' >GLBan</button>' +
                        '<button data-btn="sensitiveReport_KKO" class="hide layui-btn layui-btn-xs edit_tag_KKO"   data-uid=' + userid + ' data-msg=' + item.roomId + ' >KKO</button>' +
                        '<button data-btn="sensitiveReport_DisU" class="hide layui-btn layui-btn-xs edit_tag_DisU"  data-uid=' + userid + ' data-msg=' + item.roomId + ' >DisU</button>' +
                        '<a href="' +
                        item.webDomain + "live/" + item.roomId + '" class="layui-btn layui-btn-xs" target ="_blank" >ENT</a>' +
                        '</div></td>' +
                        '</tr>'
                }).join('');
                $("#sensitiveReportsList").html(util.String.stringFormat(template, list));
                util.page_html('pagesensitiveReports', data.page, data.pageCount, 'sensitiveReports_tables.sensitiveReportData');
                util.functions();
                this.sensitiveReports_event()
            } else {
                util.Huipopup('记录为空！');
                $("#sensitiveReportsList").html(util.String.stringFormat(template, '<tr class="text-c"></tr>'));
            }
        },
        sensitiveReports_event: function() {
            var _this = this;

            $(".edit_tag_info").unbind('click').click(function() {
                getAjax('sensitive/keyword/detail/' + $(this).data('msg') + '/' + $(this).data('uid') + '/0', {}, function(data) {
                    _this.detail_list(data.dataInfo);
                    //
                })
            });

            $(".edit_tag_rban").unbind('click').click(function() {
                var url = 'sensitive/mute/' + $(this).data('msg') + '/' + $(this).data('uid') + '/0';
                var msg = 'Make sure the room is banned?'
                _this.popup_masage(url, msg, "the room is banned")
            });
            $(".edit_tag_GLBan").unbind('click').click(function() {
                var url = 'sensitive/muteall/' + $(this).data('msg') + '/' + $(this).data('uid') + '/0';
                var msg = 'To determine the total GAG?'
                _this.popup_masage(url, msg, "determine the total GAG")
            })
            $(".edit_tag_KKO").unbind('click').click(function() {
                var url = 'sensitive/kickout/' + $(this).data('msg') + '/' + $(this).data('uid');
                var msg = 'Is it sure to kick out of the room?'
                _this.popup_masage(url, msg, "kick out of the room")
            })
            $(".edit_tag_DisU").unbind('click').click(function() {
                var url = 'sensitive/disable/user/' + $(this).data('uid');
                var msg = 'Do you decide to disable this user?'
                _this.popup_masage(url, msg, "disable user")
            })
        },
        popup_masage: function(url, msg, title, tips) {
            var _this = this;
            layer.confirm(msg, {
                title: title,
                btn: ['ok', 'cancel'] //按钮
            }, function(index) {
                postAjax(url, {}, function() {
                    util.Huipopup('Success');
                    layer.close(index);
                    _this.sensitiveReportData(1);
                })
            }, function() {

            });
        },
        detail_list: function(data) {
            if (data && typeof data == 'object') {
                var template_detail = ' <table style="margin:2%; width:96%;" class="table table-border table-bordered table-bg table-hover">\
                <thead class="text-l" >\
                <tr> <td colspan="6" >Monitoring information detail</td></tr>\
                <tr class="text-c">\
                <th>HostName</th>\
                <th>Presenter</th>\
                <th>Report user</th>\
                <th>Message type</th>\
                <th>Content</th>\
                <th>Date</th>\
                </tr>\
                </thead >\
                <tbody>\
                    {0}\
                </tbody>\
                </table>';
                var list_detail = data.map(function(item) {
                    var fromNickname = item.fromNickname || "no name";
                    var hostNickname = item.hostNickname || "no name";
                    var to_user_id = item.to_user_id > 0 ? "public chat" : "Private chat";
                    return '<tr class="text-c">' +
                        '<td>' + hostNickname + '</td>' +
                        '<td style="min-width: 100px;">' + fromNickname + '</td>' +
                        '<td>' + item.reportUser + '</td>' +
                        '<td>' + to_user_id + '</td>' +
                        '<td>' + item.source + '</td>' +
                        '<td>' + util.DateTime.fulltime(new Date(item.createTime)) + '</td>' +
                        '</tr>'
                }).join('');
                layer.open({
                    title: 'Add Forbidden Words',
                    btn: ['ok'],
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['900px', '480px'], //宽高
                    content: util.String.stringFormat(template_detail, list_detail),
                    yes: function(index) {

                        layer.close(index);
                    }


                });


            }
        }

    })

    sensitiveReports_tables.init();

})