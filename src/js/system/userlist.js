$(document).ready(function() {
    var stringFormat = util.String.stringFormat;

    function getPageSize(e) {
        if (e == null) {
            return 0;
        }
        // 如果是菜单
        if (e.isMenu == 0) {
            var i = 0;
            if (e.childs && e.childs.length > 0) {
                for (temp in e.childs) {
                    i += getPageSize(e.childs[temp]);
                }
                return i;
            } else {
                return 0;
            }
        } else {
            return e.functionInfoBeans && e.functionInfoBeans.length > 0 ?
                e.functionInfoBeans.length :
                1;
        }
    }

    function getFunctionSize(e) {
        if (e == null) {
            return 0;
        }
        // 如果是菜单
        if (e.isMenu == 0) {
            var i = 0;
            if (e.childs && e.childs.length > 0) {
                for (temp in e.childs) {
                    i += getFunctionSize(e.childs[temp]);
                }
                return i;
            } else {
                return 0;
            }
        } else {
            return e.functionInfoBeans && e.functionInfoBeans.length > 0 ?
                e.functionInfoBeans.length :
                1;
        }
    }
    var user_taable = (window["user_taable"] = {
        init: function() {
            this.user_message_functions = "";
            this.role_message_functions = ""
            util.functions();
            var _this = this;
            new Promise(function(resolve) {
                _this.getUserList(1);
                resolve();
            }).then(function() {
                util.table.allSelect(_this.selected);
                _this.userSearchMessage();
            });
        },
        binds: function() {
            var _this = this;
            $("table thead th input:checkbox")
                .closest("table")
                .find("tr > td:first-child input:checkbox")
                .on("click", function() {
                    util.table.selectNode(user_taable.selected);
                });
            $(".addUser-bt").on("click", function() {
                _this.admin_add();
            });
            $(".userDelete").on("click", function() {
                var userId = $(this)
                    .parent()
                    .attr("data-userId");
                // console.log(userId)
                _this.admin_del(userId);
            });
            $(".userEdit").on("click", function() {
                var userIdEd = $(this).attr("data-userIde");
                // console.log(userIdEd)
                _this.admin_edit(userIdEd);
            });
            $(".userRole").on("click", function() {
                var userIda = $(this).attr("data-userIdRo");
                // console.log(userIda)
                _this.admin_role(userIda);
            });
            $(".editorPage").on("click", function() {
                var roleIdPage = $(this).attr("data-roleId");
                var roleNamePage = $(this).attr("data-roleName");
                // console.log(roleIdPage)
                _this.page_edit(roleIdPage);
                _this.page_edit_name(roleNamePage);
            });
            $(".editorFun").on("click", function() {
                var roleIdFun = $(this).attr("data-roleId");
                var roleNameFun = $(this).attr("data-roleName");
                // console.log(roleNameFun)
                _this.function_edit(roleIdFun);
                _this.function_edit_name(roleNameFun);
            });
        },
        // 获取数据
        getUserList: function(page) {
            var _this = this;
            var datas = {
                page: page,
                size: 10
            };
            $.ajax({
                type: "get",
                url: paths + "sysuser/manage/list",
                async: true,
                dataType: "json",
                data: datas,
                success: function(data) {
                    // console.log(data)
                    if (data.code == 0) {
                        if (
                            data.dataInfo.list &&
                            data.dataInfo.list.length > 0
                        ) {
                            var pageCount = data.dataInfo.total / datas.size;
                            var count =
                                pageCount > Math.floor(pageCount) ?
                                Math.floor(pageCount) + 1 :
                                pageCount;
                            var htmls = _this.getListHtmls(data.dataInfo.list);
                            $("#UserList").html(htmls);
                            _this.binds();

                            util.page_html(
                                "user_layerPage",
                                page,
                                count,
                                "user_taable.getUserList"
                            );
                            util.functions();
                        } else {
                            $("#UserList").html(" ");
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
        // 获取角色数据
        getUserRoleList: function(userId) {
            user_taable.role_userID = userId;
            var _this = this;
            var datas = {
                // id: userId
            };
            $.ajax({
                type: "get",
                url: paths + "sysuser/manage/role/" + userId,
                async: true,
                dataType: "json",
                data: datas,
                success: function(data) {
                    // console.log(data)
                    if (data.code == 0) {
                        if (data.dataInfo && data.dataInfo.length > 0) {
                            var tables = _this.getRoleListHtmls(data.dataInfo);
                            $("#UserRoleList").html(tables);
                        } else {
                            $("#UserRoleList").html(" ");
                        }
                        $("._editRole tbody tr > td input:checkbox").on(
                            "click",
                            function() {
                                // alert(3)
                                if (!$(this).attr("checked")) {
                                    $(this).attr("checked", true);
                                } else {
                                    $(this).removeAttr("checked");
                                }
                                util.table.selectNode(
                                    user_taable.roleselected,
                                    true
                                );
                            }
                        );
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        },
        roleselected: function(data) {
            $(".submit_Role")
                .unbind("click")
                .click(function() {
                    postAjax(
                        "sysuser/manage/role", {
                            id: user_taable.role_userID,
                            rids: data.join(",")
                        },
                        function(msg) {
                            if (msg.code == 0) {
                                $("#editRole").modal("hide");
                                layer.msg("修改成功！");
                                user_taable.getUserList(1);
                            }
                        }
                    );
                });
        },
        // 批量删除
        selected: function(data) {
            $("#batchDelete").on("click", function() {
                layer.confirm("确认要删除吗？", function(index) {
                    $.ajax({
                        type: "POST",
                        url: paths + "sysuser/manage/delBatch",
                        dataType: "json",
                        data: {
                            ids: data.join(",")
                        },
                        success: function(data) {
                            if (data.code == 0) {
                                layer.msg("已删除!", {
                                    icon: 1,
                                    time: 1000
                                });
                                user_taable.getUserList(1);
                            }
                        },
                        error: function(data) {
                            console.log(data.msg);
                        }
                    });
                });
            });
        },
        /*用户-增加*/
        admin_add: function() {
            $("#addUser").modal("show");
            var _this = this;
            var datas = {};
            $.ajax({
                type: "get",
                url: paths + "role/list",
                async: true,
                dataType: "json",
                data: datas,
                success: function(data) {
                    if (data.code == 0) {
                        if (
                            data.dataInfo.list &&
                            data.dataInfo.list.length > 0
                        ) {
                            var tableEdit = _this.getRoleLists(
                                data.dataInfo.list
                            );
                            $("#setRole").html(tableEdit);
                        } else {
                            $("#setRole").html(" ");
                        }
                        $(".setRole ul>li input:checkbox").on(
                            "click",
                            function() {
                                // alert(3)
                                if (!$(this).attr("checked")) {
                                    $(this).attr("checked", true);
                                } else {
                                    $(this).removeAttr("checked");
                                }
                                var ele = $(".setRole").find(" li :checked");
                                util.table.selectNode(
                                    user_taable.newRoleselected,
                                    true,
                                    $(".user_chooseRole input:checkbox")
                                );
                            }
                        );
                    }
                },

                error: function(e) {
                    console.log(e);
                }
            });
            $(".add-User")
                .unbind("click")
                .click(function(event) {
                    var un = $(".input-user").val();
                    var ps = $(".input-ps").val();

                    var regex = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
                    if (!un && !ps) {
                        $.Huimodalalert("用户名、密码不能为空！", 1500);
                    } else if (!un) {
                        $.Huimodalalert("用户名不能为空！", 1500);
                    } else if (!ps) {
                        $.Huimodalalert("密码不能为空！", 1500);
                    }

                    if (ps && un) {
                        if (!regex.test(ps)) {
                            $.Huimodalalert("密码格式不正确！", 1500);
                        } else if (!regex.test(ps) &&
                            (ps.length < 6 || ps.length > 20)
                        ) {
                            $.Huimodalalert("密码格式不正确！", 1500);
                        } else if (un.length < 6) {
                            $.Huimodalalert("用户名格式不正确！", 1500);
                        }
                        if (
                            regex.test(ps) &&
                            un.length >= 6 &&
                            ps.length >= 6 &&
                            ps.length <= 20
                        ) {
                            var data = {
                                un: un,
                                ps: ps,
                                r: _this.addNewUserId
                            };
                            postAjax("sysuser/manage/add", data, function(msg) {
                                if (msg.code == 0) {
                                    $.Huimodalalert("新用户保存成功！", 1500);
                                    $("#addUser").modal("hide");
                                    $(".input-user").val("");
                                    $(".input-ps").val("");
                                    user_taable.getUserList(1);
                                }
                            });
                        }
                    }
                });
        },
        //验证新增用户
        newRoleselected: function(data) {
            user_taable.addNewUserId = data.join(",");
        },
        /*管理员-删除*/
        admin_del: function(userId) {
            var datas = {
                ui: userId
            };
            layer.confirm("确认要删除吗？", function(index) {
                $.ajax({
                    type: "POST",
                    url: paths + "sysuser/manage/del",
                    dataType: "json",
                    data: datas,
                    success: function(data) {
                        if (data.code == 0 && data.dataInfo > 0) {
                            $(userId)
                                .parents("tr")
                                .remove();
                            layer.msg("已删除!", {
                                icon: 1,
                                time: 1000
                            });
                            user_taable.getUserList(1);
                        }
                    },
                    error: function(data) {
                        console.log(data.msg);
                    }
                });
            });
        },
        /*管理员-修改角色*/
        admin_role: function(userIda) {
            $("#editRole").modal("show");
            user_taable.getUserRoleList(userIda);
        },
        /*管理员-编辑*/
        admin_edit: function(userIdEd) {
            $("#editUser").modal("show");
            $(".edit-User")
                .unbind("click")
                .click(function(event) {
                    // var un = $(".input-userName").val();
                    var ps = $(".input-passWord").val();
                    var regex = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
                    if (!ps) {
                        $.Huimodalalert("密码不能为空！", 1500);
                    }
                    if (ps) {
                        if (!regex.test(ps)) {
                            $.Huimodalalert("密码由数字和字母构成！", 1500);
                        } else if (
                            regex.test(ps) &&
                            (ps.length < 6 || ps.length > 20)
                        ) {
                            $.Huimodalalert("密码需6-20位长度！", 1500);
                        }
                        if (
                            regex.test(ps) &&
                            ps.length >= 6 &&
                            ps.length <= 20
                        ) {
                            var data = {
                                ui: userIdEd,
                                ps: ps
                            };
                            postAjax(
                                "sysuser/manage/update/info",
                                data,
                                function(data) {
                                    if (data.code == 0 && data.dataInfo > 0) {
                                        $.Huimodalalert(
                                            "用户信息修改成功！",
                                            1500
                                        );
                                        $("#editUser").modal("hide");
                                        $(".input-userName").val("");
                                        $(".input-passWord").val("");
                                        user_taable.getUserList(1);
                                    }
                                }
                            );
                        }
                    }
                });
        },
        page_edit: function(roleIdPage) {
            $("#pageEdit").modal("show");
            pagetable.init(roleIdPage);
        },
        page_edit_name(roleNamePage) {
            $(".pagePrompt").html("用户：" + roleNamePage + "的页面权限");
        },
        function_edit: function(roleIdFun) {
            $("#functionEdit").modal("show");

            functiontable.init(roleIdFun);
        },
        function_edit_name(roleNameFun) {
            $(".functionPrompt").html("用户：" + roleNameFun + "的功能权限");
        },
        getListHtmls: function(datas) {
            var htmls = "";
            if (datas) {
                $.each(datas, function(index, item) {
                    htmls +=
                        '<tr class="text-c"><td><input type="checkbox" value="' +
                        item.userId +
                        '" name=""></td><td class="userId">' +
                        item.userId +
                        "</td><td>" +
                        item.loginName +
                        "</td><td>" +
                        getTimes(item.createTime) +
                        '</td><td class="userId">' +
                        item.roles +
                        '</td><td class="td-manage"><a data-btn="edit-userRole" data-userIdRo="' +
                        item.userId +
                        '" title="编辑角色" href="javascript:;" class="ml-3 userRole hide" style="text-decoration:none"><i  class="Hui-iconfont ">&#xe62c;</i></a><a data-btn="userDelete" data-userId="' +
                        item.userId +
                        '" title="删除" href="javascript:;" class="ml-7 hide" style="text-decoration:none"><i  class="Hui-iconfont userDelete">&#xe6e2;</i></a><a data-btn="editPassWord" data-userIde="' +
                        item.userId +
                        '" href="javascript:;" class="ml-5 hide userEdit btn btn-primary size-S radius">重置密码</a><a data-btn="pageJurisdictionUser" data-roleId="' +
                        item.userId +
                        '" data-roleName="' +
                        item.loginName +
                        '" href="javascript:;" class="btn hide btn-primary size-S radius editorPage">页面权限</a><a data-btn="functionJurisdictionUser" data-roleId="' +
                        item.userId +
                        '" data-roleName="' +
                        item.loginName +
                        '" href="javascript:;" class="btn hide btn-primary size-S radius editorFun">功能权限</a></td></tr>';
                });
                return htmls;
            } else {
                return "";
            }
        },
        getRoleListHtmls: function(datas) {
            var tables = "";
            $.each(datas, function(indexs, items) {
                var check = "";
                if (items.permitted == 1) {
                    check = "checked";
                }
                tables +=
                    '<tr class="text-r"><td class="roleId">' +
                    items.roleId +
                    "</td><td>" +
                    items.roleName +
                    "</td><td>" +
                    getTimes(items.createTime) +
                    "</td><td><input " +
                    check +
                    ' type="checkbox" value="' +
                    items.roleId +
                    '" name="roleCheck"></td></tr>';
            });
            return tables;
        },
        getRoleLists: function(datas) {
            var tableEdit = "";
            $.each(datas, function(indexs, items) {
                var check = "";
                if (items.permitted == 1) {
                    check = "checked";
                }
                tableEdit +=
                    '<ul class="user_chooseRole"><li class="setRoleWidth"><input ' +
                    check +
                    ' type="checkbox" value="' +
                    items.roleId +
                    '" name="roleCheck">' +
                    items.roleName +
                    "</li></ul>";
            });
            return tableEdit;
        },
        /*登录用户角色列表*/
        userSearchMessage: function() {
            var userID = cookie_util.get_cookie("SELF_USER_ID");
            var _this = this;
            getAjax("sysuser/manage/role/" + userID, {}, function(data) {
                var datas = data.dataInfo;
                if (datas.length > 0) {
                    var htmls = "";

                    $.each(datas, function(index, ele) {
                        htmls +=
                            '<option value="' +
                            ele.roleId +
                            '">' +
                            ele.roleName +
                            "</option>";
                    });

                    $('select[name="user-search"]').html(
                        '<option value="0" selected>全部</option>' + htmls
                    );
                    _this.userSelectChange();
                } else {
                    $('select[name="user-search"]').hide();
                }
            });
            _this.userSearchSubmit();
        },
        /*select改变*/
        userSelectChange: function(page) {
            var _this = this;
            if (page) {
                getAjax(
                    "sysuser/manage/list", {
                        page: page,
                        size: 10,
                        r: $('select[name="user-search"]').val()
                    },
                    function(msg) {
                        var htmls = _this.getListHtmls(msg.dataInfo.list);
                        $("#UserList").html(htmls);
                        _this.binds();
                        util.page_html(
                            "user_layerPage",
                            msg.dataInfo.page,
                            msg.dataInfo.pageCount,
                            "user_taable.userSelectChange"
                        );
                        util.functions();
                    }
                );
            } else {
                $('select[name="user-search"]').change(function(e) {
                    $('input[name="userSearchMessage"]').val("");
                    var val = $(this).val();
                    if (val == 0) {
                        user_taable.getUserList(1);
                    } else {
                        getAjax(
                            "sysuser/manage/list", {
                                page: 1,
                                size: 10,
                                r: val
                            },
                            function(msg) {
                                var htmls = _this.getListHtmls(
                                    msg.dataInfo.list
                                );
                                $("#UserList").html(htmls);
                                _this.binds();
                                util.page_html(
                                    "user_layerPage",
                                    1,
                                    msg.dataInfo.pageCount,
                                    "user_taable.userSelectChange"
                                );
                                util.functions();
                            }
                        );
                    }
                });
            }
        },
        userSearchSubmit: function() {
            /*提交搜索*/
            var _this = this;
            $("#userSearchSubmit")
                .unbind("click")
                .click(function() {
                    var value = $('input[name="userSearchMessage"]').val();
                    var types = $('select[name="user-search"]').val();
                    var data = {
                        page: 1,
                        size: 10,
                        kw: value,
                        r: ""
                    };
                    types == 0 ? (data["r"] = "") : (data["r"] = types);
                    // var selectFunction = types == 0?
                    if (value) {
                        getAjax("sysuser/manage/list", data, function(msg) {
                            var htmls = _this.getListHtmls(msg.dataInfo.list);
                            $("#UserList").html(htmls);
                            _this.binds();
                            /*分页只有1页，回调函数无要求*/
                            util.page_html(
                                "user_layerPage",
                                1,
                                1,
                                "user_taable.userSelectChange"
                            );
                            util.functions();
                        });
                    } else {
                        if (types == 0) {
                            _this.getUserList(1);
                        } else {
                            _this.userSelectChange(1);
                        }
                    }
                });
        }
    });
    user_taable.init();
    var pagetable = {
        init: function(MAS) {
            // this.userId = MAS;
            this.getPage(MAS);
            this.ids = [];
        },
        getPage: function(msg) {
            var _this = this;
            $("#pageTable").html("");
            // $("#functionTable").html(" ");
            $("#pageTable").html(
                "<tr> " +
                "<td>顶部菜单</td>" +
                "<td>左侧菜单</td>" +
                "<td>资源</td>" +
                "<td>是否有进入权限</td>" +
                "</tr>"
            );
            var htmlTemplate = {
                td: '<td style="height:{0}px" id="{1}" pid="{2}">{3}</td>',
                trtd: ' <tr> <td style="height: {0}px;" id="{1}" pid="{2}">{3}</td></tr>',
                lasttrtd: ' <tr> <td id="{0}" pid="{1}">{2}</td></tr>',
                lasttrtdNotWithBottun: ' <tr> <td id="{1}" pid="{2}" style="height: 30px; border-bottom: none;">{3}</td></tr>',
                trtdNotWithBottum: ' <tr> <td style="height: {0}px;border-bottom: none;" id="{1}" pid="{2}" class="mybutton">{3}</td></tr>',
                tdtable: "<td><table>{0}</table></td>",
                tdconst: '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr></table>',
                symbol: '<form class="_privilege" name="from1" id="form{0}" action=""><input {1}  type="radio" name="judge" class="yes"/><label>是</label><input {2} name="io" type="radio" class="no"/><label>否</label></form> '
            };

            getAjax("privilege/user/page/" + msg, {}, function(data) {
                //顶部菜单
                data.dataInfo.forEach(function(t) {
                    var template = "<tr>";
                    template +=
                        "<td id='" +
                        t.id +
                        "' pid='" +
                        t.pId +
                        "'>" +
                        t.name +
                        "</td>";
                    var td1 = "";
                    var td2 = "";
                    var td3 = "";

                    if (t.childs && t.childs.length > 0) {
                        //左侧菜单
                        t.childs.forEach(function(value1, index1, array1) {
                            var functionSize = getFunctionSize(value1);
                            if (index1 == array1.length - 1) {
                                td1 += stringFormat(
                                    htmlTemplate.trtdNotWithBottum,
                                    30 * functionSize,
                                    value1.id,
                                    value1.pId,
                                    value1.name
                                );
                            } else {
                                td1 += stringFormat(
                                    htmlTemplate.trtd,
                                    30 * functionSize,
                                    value1.id,
                                    value1.pId,
                                    value1.name
                                );
                            }
                            //资源
                            if (value1.childs && value1.childs.length > 0) {
                                value1.childs.forEach(function(
                                    value2,
                                    index2,
                                    array2
                                ) {
                                    var functionSize2 = getFunctionSize(value2);
                                    if (
                                        index1 == array1.length - 1 &&
                                        index2 == array2.length - 1
                                    ) {
                                        var bool1 = "checked",
                                            bool2 = "";
                                        if (value2.permissionValue == 0) {
                                            bool1 = "";
                                            bool2 = "checked";
                                        }
                                        if (value2.permissionValue == 1)
                                            _this.ids.push(value2.id);
                                        var symbols = stringFormat(
                                            htmlTemplate.symbol,
                                            value2.id,
                                            bool1,
                                            bool2
                                        );
                                        td2 += stringFormat(
                                            htmlTemplate.trtdNotWithBottum,
                                            30 * functionSize2,
                                            value2.id,
                                            value2.pId,
                                            value2.name
                                        );
                                        td3 += stringFormat(
                                            htmlTemplate.trtdNotWithBottum,
                                            30 * functionSize2,
                                            value2.id,
                                            value2.pId,
                                            symbols
                                        );
                                    } else {
                                        td2 += stringFormat(
                                            htmlTemplate.trtd,
                                            30 * functionSize2,
                                            value2.id,
                                            value2.pId,
                                            value2.name
                                        );
                                        var bool3 = "checked",
                                            bool4 = "";
                                        if (value2.permissionValue == 0) {
                                            bool3 = "";
                                            bool4 = "checked";
                                        }
                                        if (value2.permissionValue == 1)
                                            _this.ids.push(value2.id);
                                        var symbol = stringFormat(
                                            htmlTemplate.symbol,
                                            value2.id,
                                            bool3,
                                            bool4
                                        );
                                        td3 += stringFormat(
                                            htmlTemplate.trtd,
                                            30 * functionSize2,
                                            value2.id,
                                            value2.pId,
                                            symbol
                                        );
                                    }
                                });
                            } else {
                                if (index1 == array1.length - 1) {
                                    td2 +=
                                        '<tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr>';
                                    td3 +=
                                        '<tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr>';
                                } else {
                                    td2 +=
                                        '<tr><td style="height: 30px; ">没有资源</td></tr>';
                                    td3 +=
                                        '<tr><td style="height: 30px; ">没有资源</td></tr>';
                                }
                            }
                        });
                    } else {
                        template +=
                            '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr></table>' +
                            '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr></table>' +
                            '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr></table>';
                    }
                    template +=
                        (td1 == "" ?
                            "" :
                            stringFormat(htmlTemplate.tdtable, td1)) +
                        (td2 == "" ?
                            "" :
                            stringFormat(htmlTemplate.tdtable, td2)) +
                        (td3 == "" ?
                            "" :
                            stringFormat(htmlTemplate.tdtable, td3)) +
                        "</tr>";
                    $("#pageTable").append(template);
                });
                // _this.checkedInput(msg)
                _this.binds(msg);
            });
        },
        binds: function(msg) {
            var _this = this;
            $("._privilege").on("click", "input", function() {
                if (!$(this).attr("checked")) {
                    var id = $(this)
                        .parent()
                        .parent("td")
                        .attr("id");
                    $(this)
                        .attr("checked", true)
                        .siblings("input")
                        .removeAttr("checked");
                    if ($(this).hasClass("no")) {
                        _this.ids = _this.ids.filter(function(item) {
                            //過濾掉不要的id
                            if (item == id) return false;
                            return true;
                        });
                    } else {
                        _this.ids.push(Number(id));
                        var data = _this.ids;
                        _this.ids = (function(data) {
                            //去重
                            var arr = data,
                                result = [],
                                len = arr.length;
                            arr.forEach(function(v, i, arr) {
                                var bool = arr.indexOf(v, i + 1);
                                if (bool === -1) {
                                    result.push(v);
                                }
                            });
                            return result;
                        })(data);
                    }
                    _this.submitIds(msg, true);
                }
            });
            _this.submitIds(msg, false);
        },
        submitIds: function(msg, bool) {
            var ids = this.ids.join(",");
            $(".submit_userIds")
                .unbind("click")
                .click(function() {
                    if (bool) {
                        postAjax(
                            "privilege/page/update/0/" + msg, {
                                rids: ids
                            },
                            function(data) {
                                if (data.code == 0) {
                                    layer.msg("設置權限成功");
                                    $("#pageEdit").modal("hide");
                                }
                            }
                        );
                    } else {
                        $("#pageEdit").modal("hide");
                    }
                });
        }
    };
    var functiontable = {
        //
        init: function(msg) {
            this.isSubmit = false;
            this.ids = [];
            this.dataUser = [];
            this.dataRole = [];
            this.getFunction(msg);
        },
        getFunction: function(msg) {
            var _this = this;
            // $("#functionTable").html(" ");
            $("#functionTable").html(
                "<tr> " +
                "<td>顶部菜单</td>" +
                "<td>左侧菜单</td>" +
                "<td>资源</td>" +
                "<td>是否有进入权限</td>" +
                "</tr>"
            );

            var htmlTemplate = {
                td: '<td style="height:{0}px" id="{1}" pid="{2}">{3}</td>',
                trtd: ' <tr> <td style="height: {0}px;" id="{1}" pid="{2}">{3}</td></tr>',
                lasttrtd: ' <tr> <td id="{0}" pid="{1}">{2}</td></tr>',
                lasttrtdNotWithBottun: ' <tr> <td id="{0}"  pid="{1}" style="height: 30px; ">{2}</td></tr>',
                trtdNotWithBottum: ' <tr> <td style="height: {0}px;border-bottom: none;" id="{1}" pid="{2}" class="mybutton">{3}</td></tr>',
                tdtable: "<td><table>{0}</table></td>",
                tdconst: '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr></table>',
                // symbol: '<form class="_functionBtnForm" name="from1" id="form{0}" action=""><input {1}  type="radio" name="judge" class="yes"/><label>是</label><input {2} name="io" type="radio" class="no"/><label>否</label></form> ',
                symbol: '<td class="td-manage" id="{1}">{0}</td>',
                form: '<form class="_functionBtnForm" name="from1" id="form{0}" action=""><input {1} type="radio" name="judge" class="yes"/><label>是</label><input {2} name="judge" type="radio" class="no"/><label>否</label></form>'
            };
            getAjax("privilege/user/function/" + msg, {}, function(data) {
                //顶部菜单
                data.dataInfo.forEach(function(t) {
                    var template = "<tr>";
                    template +=
                        "<td id='" +
                        t.id +
                        "' pid='" +
                        t.pId +
                        "'>" +
                        t.name +
                        "</td>";
                    var td1 = "";
                    var td2 = "";
                    var td3 = "";
                    if (t.childs && t.childs.length > 0) {
                        //左侧菜单
                        t.childs.forEach(function(value1, index1, array1) {
                            var functionSize = getFunctionSize(value1);
                            if (index1 == array1.length - 1) {
                                td1 += stringFormat(
                                    htmlTemplate.trtdNotWithBottum,
                                    30 * functionSize,
                                    value1.id,
                                    value1.pId,
                                    value1.name
                                );
                            } else {
                                td1 += stringFormat(
                                    htmlTemplate.trtd,
                                    30 * functionSize,
                                    value1.id,
                                    value1.pId,
                                    value1.name
                                );
                            }
                            //资源
                            if (value1.childs && value1.childs.length > 0) {
                                value1.childs.forEach(function(
                                    value2,
                                    index2,
                                    array2
                                ) {
                                    var functionSize2 = getFunctionSize(value2);
                                    if (
                                        index1 == array1.length - 1 &&
                                        index2 == array2.length - 1
                                    ) {
                                        td2 += stringFormat(
                                            htmlTemplate.trtdNotWithBottum,
                                            30 * functionSize2,
                                            value2.id,
                                            value2.pId,
                                            value2.name
                                        );
                                    } else {
                                        td2 += stringFormat(
                                            htmlTemplate.trtd,
                                            30 * functionSize2,
                                            value2.id,
                                            value2.pId,
                                            value2.name
                                        );
                                    }
                                    // 功能
                                    if (
                                        value2.functionInfoBeans &&
                                        value2.functionInfoBeans.length > 0
                                    ) {
                                        value2.functionInfoBeans.forEach(
                                            function(value3, index3, array3) {
                                                if (
                                                    index2 ==
                                                    array2.length - 1 &&
                                                    index3 == array3.length - 1
                                                ) {
                                                    var bool1 = "checked",
                                                        bool2 = "";
                                                    if (
                                                        value3.permissionValue ==
                                                        0 &&
                                                        value3.functionPermissionType ==
                                                        0
                                                    ) {
                                                        bool1 = "";
                                                        bool2 = "checked";
                                                    }
                                                    var $fun =
                                                        value3.functionRange ==
                                                        0 ?
                                                        value3.users :
                                                        value3.roles;
                                                    if ($fun.length > 0) {
                                                        var dataArray = [];
                                                        $fun.forEach(function(
                                                            items
                                                        ) {
                                                            if (
                                                                items.permitted ==
                                                                1
                                                            ) {
                                                                /*待测*/
                                                                var itemid = items.userId ?
                                                                    items.userId :
                                                                    items.roleId;
                                                                dataArray.push(
                                                                    itemid
                                                                );
                                                            }
                                                        });
                                                        if (
                                                            dataArray.length > 0
                                                        ) {
                                                            _this.ids.push({
                                                                id: value3.functionId,
                                                                data: dataArray
                                                            });
                                                        }
                                                    }
                                                    var roleRoUSER =
                                                        value3.functionRange ==
                                                        0 ?
                                                        "user" :
                                                        "role";

                                                    if (roleRoUSER == "user") {
                                                        _this.user_message_functions = $fun;
                                                    } else {
                                                        _this.role_message_functions = $fun
                                                    }
                                                    var formOrBtn =
                                                        value3.functionPermissionType ==
                                                        0 ?
                                                        stringFormat(
                                                            htmlTemplate.form,
                                                            value3.functionId,
                                                            bool1,
                                                            bool2
                                                        ) :
                                                        "<a  class='_function_messages" +
                                                        roleRoUSER +
                                                        "' data-recource=" + value3.functionId + ">权限详情</a>";
                                                    if (
                                                        value3.permissionValue ==
                                                        1 &&
                                                        value3.functionPermissionType ==
                                                        0
                                                    )
                                                        _this.ids.push({
                                                            id: value3.functionId,
                                                            data: [1]
                                                        });
                                                    var symbols = stringFormat(
                                                        htmlTemplate.symbol,
                                                        formOrBtn,
                                                        value3.functionId
                                                    );
                                                    td3 += stringFormat(
                                                        htmlTemplate.lasttrtdNotWithBottun,
                                                        value3.functionId,
                                                        value3.resourceId,
                                                        value3.functionName +
                                                        symbols
                                                    );
                                                } else {
                                                    var bool3 = "checked",
                                                        bool4 = "";
                                                    if (
                                                        value3.permissionValue ==
                                                        0 &&
                                                        value3.functionPermissionType ==
                                                        0
                                                    ) {
                                                        bool3 = "";
                                                        bool4 = "checked";
                                                    }
                                                    var $funs =
                                                        value3.functionRange ==
                                                        0 ?
                                                        value3.users :
                                                        value3.roles;
                                                    if ($funs.length > 0) {
                                                        var dataArrays = [];
                                                        $funs.forEach(function(
                                                            items
                                                        ) {
                                                            if (
                                                                items.permitted ==
                                                                1
                                                            ) {
                                                                var itemid = items.userId ?
                                                                    items.userId :
                                                                    items.roleId;
                                                                dataArrays.push(
                                                                    itemid
                                                                );
                                                            }
                                                        });
                                                        if (
                                                            dataArrays.length >
                                                            0
                                                        ) {
                                                            /*待测*/
                                                            _this.ids.push({
                                                                id: value3.functionId,
                                                                data: dataArrays
                                                            });
                                                        }
                                                    }
                                                    var roleRoUSERs =
                                                        value3.functionRange ==
                                                        0 ?
                                                        "user" :
                                                        "role";
                                                    if (roleRoUSERs == "user") {
                                                        _this.user_message_functions = $funs;
                                                    } else {
                                                        _this.role_message_functions = $funs
                                                    }
                                                    var formOrBtn =
                                                        value3.functionPermissionType ==
                                                        0 ?
                                                        stringFormat(
                                                            htmlTemplate.form,
                                                            value3.functionId,
                                                            bool3,
                                                            bool4
                                                        ) :
                                                        "<a class='_function_messages" +
                                                        roleRoUSERs +
                                                        "' data-recource=" +
                                                        value3.functionId + ">权限详情</a>";
                                                    if (
                                                        value3.permissionValue ==
                                                        1 &&
                                                        value3.functionPermissionType ==
                                                        0
                                                    )
                                                        _this.ids.push({
                                                            id: value3.functionId,
                                                            data: [1]
                                                        });
                                                    var symbols = stringFormat(
                                                        htmlTemplate.symbol,
                                                        formOrBtn,
                                                        value3.functionId
                                                    );
                                                    td3 += stringFormat(
                                                        htmlTemplate.lasttrtd,
                                                        value3.functionId,
                                                        value3.resourceId,
                                                        value3.functionName +
                                                        symbols
                                                    );
                                                }
                                            }
                                        );
                                    } else {
                                        if (
                                            index1 == array1.length - 1 &&
                                            index2 == array2.length - 1
                                        ) {
                                            td3 +=
                                                '<tr><td style="height: 30px; border-bottom: none;">没有功能</td><td style="height: 30px; "></td></tr>';
                                        } else {
                                            td3 +=
                                                '<tr><td style="height: 30px; ">没有功能</td><td style="height: 30px; "></td></tr>';
                                        }
                                    }
                                });
                            } else {
                                if (index1 == array1.length - 1) {
                                    td2 +=
                                        '<tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr>';
                                    td3 +=
                                        '<tr><td style="height: 30px; border-bottom: none;">没有功能</td></tr>';
                                } else {
                                    td2 +=
                                        '<tr><td style="height: 30px; ">没有资源</td></tr>';
                                    td3 +=
                                        '<tr><td style="height: 30px; ">没有功能</td></tr>';
                                }
                            }
                        });
                    } else {
                        template +=
                            '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有菜单</td></tr></table>' +
                            '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr></table>' +
                            '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有功能</td></tr></table>';
                    }
                    template +=
                        (td1 == "" ?
                            "" :
                            stringFormat(htmlTemplate.tdtable, td1)) +
                        (td2 == "" ?
                            "" :
                            stringFormat(htmlTemplate.tdtable, td2)) +
                        (td3 == "" ?
                            "" :
                            stringFormat(htmlTemplate.tdtable, td3)) +
                        "</tr>";
                    $("#functionTable").append(template);
                    $("#functionTable tr td table tr:last td").eq(0).css('border', 0);
                });
                _this.binds(msg);
                _this.functionLayer(msg);
                _this.functionRole(msg);
            });
        },
        functionRole: function(msg) {
            var _this = this;
            $("._function_messagesrole")
                .unbind("click")
                .click(function() {
                    // console.log($(this).data("key"))
                    if (!_this.role_message_functions) return;
                    var data = _this.role_message_functions; //获取数据
                    var pid = $(this).data("recource"); //获取当前功能ID
                    var list =
                        '<li data-id={0}>\
                            <input type="checkbox"  {1}/><span>{2}</span>\
                        </li>';
                    var htmls = "";
                    if (data && data.length > 0 && data != "undefind") {
                        data.forEach(function(item) {
                            var bool = item.permitted == 1 ? "checked" : "";
                            var userID = item.userId ?
                                item.userId :
                                item.roleId;
                            var name = item.loginName ?
                                item.loginName :
                                item.roleName;
                            htmls += stringFormat(list, userID, bool, name);
                        });
                        var $html =
                            '<ul id="user_permissionsList" class="user_permissionsList">' +
                            htmls +
                            "<ul/>";
                        layer.open({
                            type: 1,
                            skin: "layui-layer-rim", //加上边框
                            area: ["1000px", "400px"], //宽高
                            content: $html
                        });
                        $("#user_permissionsList").on(
                            "click",
                            "input",
                            function() {
                                _this.isSubmit = true;
                                var id = $(this)
                                    .parent("li")
                                    .data("id");
                                if (!$(this).attr("checked")) {
                                    $(this).attr("checked", true);
                                    _this.dataRole.push(id);
                                } else {
                                    $(this).removeAttr("checked");
                                    _this.dataRole = _this.dataRole.filter(
                                        function(item) {
                                            if (item == id) return false;
                                            else return true;
                                        }
                                    );
                                }
                                _this.ids = _this.ids.filter(function(item) {
                                    //過濾掉不要的id
                                    if (item.id == pid) return false;
                                    return true;
                                });
                                _this.ids.push({
                                    id: pid,
                                    data: _this.dataRole
                                });
                            }
                        );
                        // $("#user_permissionsList").html(htmls);
                    }
                });
        },
        functionLayer: function(msg) {
            var _this = this;
            $("._function_messagesuser")
                .unbind("click")
                .click(function() {
                    // console.log($(this).data("key"))
                    if (!_this.user_message_functions) return;
                    var data = _this.user_message_functions;
                    var pid = $(this).data("recource");
                    var list =
                        '<li data-id={0}>\
                            <input type="checkbox"  {1}/><span>{2}</span>\
                        </li>';
                    // $("#user_permissions").modal("show");
                    var htmls = "";
                    if (data && data.length > 0) {
                        if (typeof data == "string") {
                            data = JSON.parse(data)
                        }
                        data.forEach(function(item) {
                            var bool = item.permitted == 1 ? "checked" : "";
                            var userID = item.userId ?
                                item.userId :
                                item.roleId;
                            var name = item.loginName ?
                                item.loginName :
                                item.roleName;
                            htmls += stringFormat(list, userID, bool, name);
                        });
                        var $html =
                            '<ul id="user_permissionsLists" class="user_permissionsList">' +
                            htmls +
                            "<ul/>";
                        layer.open({
                            type: 1,
                            skin: "layui-layer-rim", //加上边框
                            area: ["1000px", "400px"], //宽高
                            content: $html
                        });
                        $("#user_permissionsLists").on(
                            "click",
                            "input",
                            function() {
                                _this.isSubmit = true;
                                var id = $(this)
                                    .parent("li")
                                    .data("id");
                                if (!$(this).attr("checked")) {
                                    $(this).attr("checked", true);
                                    _this.dataUser.push(id);
                                } else {
                                    $(this).removeAttr("checked");
                                    _this.dataUser = _this.dataUser.filter(
                                        function(item) {
                                            if (item == id) return false;
                                            else return true;
                                        }
                                    );
                                }
                                _this.ids = _this.ids.filter(function(item) {
                                    //過濾掉不要的id
                                    if (item.id == pid) return false;
                                    return true;
                                });
                                _this.ids.push({
                                    id: pid,
                                    data: _this.dataUser
                                });
                            }
                        );
                        // $("#user_permissionsList").html(htmls);
                    }
                });
        },
        binds: function(msg) {
            var _this = this;
            $("._functionBtnForm").on("click", "input", function() {
                _this.isSubmit = true;
                if (!$(this).attr("checked")) {
                    var id = $(this)
                        .parent()
                        .parent("td")
                        .attr("id");
                    $(this)
                        .attr("checked", true)
                        .siblings("input")
                        .removeAttr("checked");
                    if ($(this).hasClass("no")) {
                        _this.ids = _this.ids.filter(function(item) {
                            //過濾掉不要的id
                            if (item.id == id) return false;
                            return true;
                        });
                    } else {
                        _this.ids.push({
                            id: id,
                            data: [1]
                        });
                    }
                }
            });

            this.submitIds(msg);
        },
        submitIds: function(msg) {
            var _this = this;
            $(".functionBtn_primary")
                .unbind("click")
                .click(function() {
                    if (_this.isSubmit) {
                        var arrid = _this.ids;
                        var ids = util.objArray(arrid, "id");
                        postAjax(
                            "privilege/function/update/0/" + msg, {
                                c: JSON.stringify(ids)
                            },
                            function(data) {
                                if (data.code == 0) {
                                    layer.msg("设置权限成功！");
                                    _this.isSubmit = false;
                                    $("#functionEdit").modal("hide");
                                }
                            }
                        );
                    } else {
                        $("#functionEdit").modal("hide");
                    }
                });
        }
    };
});