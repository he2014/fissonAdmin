$(document).ready(function() {
    var stringFormat = util.String.stringFormat;

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
    var user_taables = (window["user_taables"] = {
        init: function() {
            var _this = this;
            new Promise(function(resolve) {
                _this.getUserList(1);
                resolve();
            }).then(function() {
                util.table.allSelect(_this.selected);
            });
        },
        binds: function() {
            var _this = this;
            this.roleSearch();
            $("select[name='role-search']").change(function() {
                var val = $(this).val();
                var text = $('input[name="searchRole"]');

                if (val == 0) {
                    text.val("");
                    text.attr("disabled", true);
                    text.attr("placeholder", " ");
                } else {
                    text.removeAttr("disabled");
                    text.val("");
                    if (val == 1) {
                        text.attr("placeholder", "请输入角色名");
                    } else {
                        text.attr("placeholder", "请输入角色id");
                    }
                }
            });
            $("table thead th input:checkbox")
                .closest("table")
                .find("tr > td:first-child input:checkbox")
                .on("click", function() {
                    util.table.selectNode(user_taables.selected);
                });
            $(".userDelete").on("click", function() {
                var roleId = $(this)
                    .parent()
                    .attr("data-roleId");
                _this.admin_del(roleId);
            });
            $(".userEdit").on("click", function() {
                var roleIds = $(this)
                    .parent()
                    .attr("data-roleId");
                // console.log(roleIds)
                _this.admin_edit(roleIds);
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
        /*角色搜索*/
        roleSearch: function() {
            var _this = this;
            $("#searchRole")
                .unbind("click")
                .click(function() {
                    var types = $("select[name='role-search']").val(),
                        value = $('input[name="searchRole"]').val();
                    if (value && types != 0) {
                        var data = {
                            page: "",
                            size: "",
                            n: "",
                            id: ""
                        };
                        if (types == 1) {
                            data.id = "";
                            data.n = value;
                        } else {
                            data.id = value;
                            data.n = "";
                        }
                        getAjax("role/list", data, function(data) {
                            if (data.code == 0) {
                                if (
                                    data.dataInfo.list &&
                                    data.dataInfo.list.length > 0
                                ) {
                                    var htmls = _this.getListHtmls(
                                        data.dataInfo.list
                                    );
                                    $("#UserList").html(htmls);
                                    _this.binds();
                                    util.page_html(
                                        "user_layerPage",
                                        1,
                                        1,
                                        "user_taables.getUserList"
                                    );
                                    util.functions();
                                }
                            }
                        });
                    } else {
                        if (types == 0) {
                            _this.getUserList(1);
                        } else {
                            layer.msg("角色名或id不能为空");
                        }
                    }
                    // console.log(types)
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
                url: paths + "role/list",
                async: false,
                dataType: "json",
                data: datas,
                success: function(data) {
                    // console.log(data)
                    // alert(2)
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
                                "user_taables.getUserList"
                            );
                            util.functions();
                        } else {
                            $("#UserList").html(" ");
                        }
                    } else {
                        // alert(1)
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
        // 批量删除
        selected: function(data) {
            $("#batchDelete").on("click", function() {
                layer.confirm("确认要删除吗？", function(index) {
                    $.ajax({
                        type: "POST",
                        url: paths + "role/delete",
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
                                user_taables.getUserList(1);
                            }
                        },
                        error: function(data) {
                            console.log(data.msg);
                        }
                    });
                });
            });
        },
        /*管理员-删除*/
        admin_del: function(roleId) {
            var datas = {
                ids: roleId
            };
            layer.confirm("确认要删除吗？", function(index) {
                $.ajax({
                    type: "POST",
                    url: paths + "role/delete",
                    dataType: "json",
                    data: datas,
                    success: function(data) {
                        if (data.code == 0 && data.dataInfo > 0) {
                            $(roleId)
                                .parents("tr")
                                .remove();
                            layer.msg("已删除!", {
                                icon: 1,
                                time: 1000
                            });
                            user_taables.getUserList(1);
                        }
                    },
                    error: function(data) {
                        console.log(data.msg);
                    }
                });
            });
        },
        /*管理员-编辑*/
        admin_edit: function(roleIds) {
            $("#editUser").modal("show");
            $(".edit-User")
                .unbind("click")
                .click(function(event) {
                    // console.log(userIds);
                    var un = $(".input-userName").val();
                    var ps = $(".input-passWord").val();
                    var regex = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
                    if (!un) {
                        $.Huimodalalert("角色名不能为空！", 1500);
                    }
                    if (un) {
                        var data = {
                            id: roleIds,
                            n: un
                        };
                        postAjax("role/update", data, function(data) {
                            if (data.code == 0 && data.dataInfo > 0) {
                                $.Huimodalalert("角色信息修改成功！", 1500);
                                $("#editUser").modal("hide");
                                $(".input-userName").val("");
                                user_taables.getUserList(1);
                            }
                        });
                    }
                });
        },
        page_edit: function(roleIdPage) {
            $("#pageEdit").modal("show");
            pagetable.init(roleIdPage);
        },
        page_edit_name(roleNamePage) {
            $(".pagePrompt").html("角色：" + roleNamePage + "的页面权限");
        },
        function_edit: function(roleIdFun) {
            $("#functionEdit").modal("show");
            functiontable.init(roleIdFun);
        },
        function_edit_name(roleNameFun) {
            $(".functionPrompt").html("角色：" + roleNameFun + "的功能权限");
        },
        getListHtmls: function(datas) {
            var htmls = "";
            $.each(datas, function(index, item) {
                if (item.roleId == 1) {
                    htmls +=
                        '<tr class="text-c"><td><input type="checkbox" class="hide" value="' +
                        item.roleId +
                        '" name=""></td><td class="userId">' +
                        item.roleId +
                        "</td><td>" +
                        item.roleName +
                        "</td><td>" +
                        getTimes(item.createTime) +
                        '</td><td class="td-manage"><a data-btn="editRole" data-roleId="' +
                        item.roleId +
                        '" title="编辑" href="javascript:;" class="ml-5 hide" style="text-decoration:none;display:none;"><i class="Hui-iconfont userEdit">&#xe6df;</i></a><a   data-roleId="' +
                        item.roleId +
                        '" title="删除" href="javascript:;" class="ml-7 hide" style="text-decoration:none"><i  class="Hui-iconfont userDelete">&#xe6e2;</i></a><a data-roleId="' +
                        item.roleId +
                        '" data-roleName="' +
                        item.roleName +
                        '" href="javascript:;" class="btn hide btn-primary size-S radius editorPage">修改页面权限</a><a data-roleId="' +
                        item.roleId +
                        '" data-roleName="' +
                        item.roleName +
                        '" href="javascript:;" class="btn hide btn-primary size-S radius editorFun">修改功能权限</a></td></tr>';
                } else {
                    htmls +=
                        '<tr class="text-c"><td><input type="checkbox" value="' +
                        item.roleId +
                        '" name=""></td><td class="userId">' +
                        item.roleId +
                        "</td><td>" +
                        item.roleName +
                        "</td><td>" +
                        getTimes(item.createTime) +
                        '</td><td class="td-manage"><a data-btn="editRole"  data-roleId="' +
                        item.roleId +
                        '" title="编辑" href="javascript:;" class="ml-5 hide" style="text-decoration:none"><i class="Hui-iconfont userEdit">&#xe6df;</i></a><a data-btn="deleteRole"  data-roleId="' +
                        item.roleId +
                        '" title="删除" href="javascript:;" class="ml-7 hide" style="text-decoration:none"><i  class="Hui-iconfont userDelete">&#xe6e2;</i></a><a data-btn="pageJurisdictionRole" data-roleId="' +
                        item.roleId +
                        '" data-roleName="' +
                        item.roleName +
                        '" href="javascript:;" class="btn hide btn-primary size-S radius editorPage">修改页面权限</a><a data-btn="functionJurisdictionRole" data-roleId="' +
                        item.roleId +
                        '" data-roleName="' +
                        item.roleName +
                        '" href="javascript:;" class="btn hide btn-primary size-S radius editorFun">修改功能权限</a></td></tr>';
                }
            });
            return htmls;
        }
    });
    user_taables.init();

    var pagetable = {
        init: function(MAS) {
            // this.userId = MAS;
            this.getPage(MAS);
            this.ids = [];
        },
        getPage: function(msg) {
            var _this = this;
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
                lasttrtdNotWithBottun: ' <tr> <td id="{1}" pid="{2} style="height: 30px; border-bottom: none;"">{3}</td></tr>',
                trtdNotWithBottum: ' <tr> <td style="height: {0}px;border-bottom: none;" id="{1}" pid="{2}" class="mybutton">{3}</td></tr>',
                tdtable: "<td><table>{0}</table></td>",
                tdconst: '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr></table>',
                symbol: '<form class="_privilege" name="from1" id="form{0}" action=""><input {1}  type="radio" name="judge" class="yes"/><label>是</label><input {2} name="io" type="radio" class="no"/><label>否</label></form> '
            };

            getAjax("privilege/role/page/" + msg, {}, function(data) {
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
                                        // if (value2.permissionValue == 0) {
                                        //     $("input[name='no']").attr("checked", 'checked');
                                        // } else if (value2.permissionValue == 1) {
                                        //     $("input[name='yes']").attr("checked", 'checked');
                                        // }
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
            $(".submitIds")
                .unbind("click")
                .click(function() {
                    if (bool) {
                        postAjax(
                            "privilege/page/update/1/" + msg, {
                                rids: ids
                            },
                            function(data) {
                                if (data.code == 0) {
                                    layer.msg("设置权限成功！");
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
                lasttrtdNotWithBottun: ' <tr> <td id="{0}" pid="{1}" style="height: 30px; ">{2}</td></tr>',
                trtdNotWithBottum: ' <tr> <td style="height: {0}px;border-bottom: none;" id="{1}" pid="{2}" class="mybutton">{3}</td></tr>',
                tdtable: "<td><table>{0}</table></td>",
                tdconst: '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr></table>',
                // symbol: '<form class="_functionBtnForm" name="from1" id="form{0}" action=""><input {1}  type="radio" name="judge" class="yes"/><label>是</label><input {2} name="io" type="radio" class="no"/><label>否</label></form> ',
                symbol: '<td class="td-manage" id="{1}">{0}</td>',
                form: '<form class="_functionBtnForm" name="from1" id="form{0}" action=""><input {1} type="radio" name="judge" class="yes"/><label>是</label><input {2} name="judge" type="radio" class="no"/><label>否</label></form>'
            };
            getAjax("privilege/role/function/" + msg, {}, function(data) {
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
                                    //         // 功能
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
                                                        "' data-recource=" +
                                                        value3.functionId +
                                                        " data-key=" +
                                                        JSON.stringify(
                                                            $fun
                                                        ) +
                                                        ">权限详情</a>";
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
                                                        value3.functionId +
                                                        " data-key=" +
                                                        JSON.stringify(
                                                            $funs
                                                        ) +
                                                        ">权限详情</a>";
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
                                                    var symbolss = stringFormat(
                                                        htmlTemplate.symbol,
                                                        formOrBtn,
                                                        value3.functionId
                                                    );
                                                    td3 += stringFormat(
                                                        htmlTemplate.lasttrtd,
                                                        value3.functionId,
                                                        value3.resourceId,
                                                        value3.functionName +
                                                        symbolss
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
                                                '<tr><td style="height: 30px; border-bottom: none;">没有资源</td><td style="height: 30px; "></td></tr>';
                                        } else {
                                            td3 +=
                                                '<tr><td style="height: 30px; ">没有资源</td><td style="height: 30px; "></td></tr>';
                                        }
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
                    var data = $(this).data("key");
                    var pid = $(this).data("recource");
                    var list =
                        '<li data-id={0}>\
                            <input type="checkbox"  {1}/><span>{2}</span>\
                        </li>';
                    // $("#user_permissions").modal("show");
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
                        $(".user_permissionsList").on(
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
                    var data = $(this).data("key");
                    var pid = $(this).data("recource");
                    var list =
                        '<li data-id={0}>\
                            <input type="checkbox"  {1}/><span>{2}</span>\
                        </li>';
                    // $("#user_permissions").modal("show");
                    var htmls = "";
                    if (data && data.length > 0) {
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
                        $(".user_permissionsList").on(
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
                // console.log(_this.ids)
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
                            "privilege/function/update/1/" + msg, {
                                c: JSON.stringify(ids)
                            },
                            function(data) {
                                if (data.code == 0) {
                                    layer.msg("設置權限成功");
                                    $("#functionEdit").modal("hide");
                                    _this.isSubmit = false;
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