$(document).ready(function() {
    $("#functionTable").on("click", "a", function() {
        var id = $(this).parent("td").attr("id") || $(this).parent("td").siblings("td").attr("id");
        var pid = $(this).parent("td").attr("pid") || $(this).parent("td").siblings("td").attr("pid");
        if ($(this).find('i').hasClass("userDelete") && pid) { //删除
            layer.confirm('确认要删除吗？', function(index) {
                $.ajax({
                    type: 'POST',
                    url: paths + 'function/del',
                    dataType: 'json',
                    data: {
                        id: id
                    },
                    success: function(data) {
                        if (data.code == 0 && data.dataInfo > 0) {
                            layer.msg('已删除!', {
                                icon: 1,
                                time: 1000
                            });
                            functiontable.init();
                        }
                    },
                    error: function(data) {
                        console.log(data.msg);
                    },
                });
            });
        } else if ($(this).find('i').hasClass("userEdit") && pid) { //编辑
            var edit = layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['600px', '280px'], //宽高
                content: '<div class="modal-content radius">' +
                    '<form role="form">' +
                    '<div class="form name">' +
                    '<label for="name">功能名字：</label>' +
                    '<input type="text" class="input-text radius" id="functionEditName" placeholder="请输入名称" required="required" >' +
                    '</div>' +
                    '<div class="form flag">' +
                    '<label for="functionFlag">功能标记：</label>' +
                    '<input type="text" id="functionEditFlag" class="input-text radius" placeholder="请填写功能标记" required="required" >' +
                    '</div>' +
                    '</form>' +
                    '</div>',

                btn: ['确定', '关闭'],
                yes: function(index, layero) {
                    var fna = $("#functionEditName").val();
                    var ffl = $("#functionEditFlag").val();

                    if (!fna || !ffl) {
                        layer.msg('信息不能为空！')
                    }
                    if (fna && ffl) {
                        var data = {
                            name: fna,
                            flag: ffl,
                            id: id
                        }
                        postAjax("function/update", data, function(msg) {
                            if (msg.code == 0 && msg.dataInfo > 0) {
                                layer.msg('功能修改成功！', {
                                    icon: 1,
                                    time: 1000
                                })
                                layer.close(edit);
                                functiontable.init();
                            }
                        })
                    }
                    return false;
                },
                btn2: function(index, layero) {
                    layer.close(edit);
                }

            });

        } else { //添加
            var add = layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['600px', '460px'], //宽高
                content: '<div class="modal-content radius">' +
                    '<form role="form">' +
                    '<div class="form name">' +
                    '<label for="name">功能名字：</label>' +
                    '<input type="text" class="input-text radius" id="functionName" placeholder="请输入名称" required="required" >' +
                    '</div>' +
                    '<div class="form id">' +
                    '<label for="functionId">功能id：</label>' +
                    '<input type="text" id="functionId" class="input-text radius" placeholder="请输入功能id" required="required" >' +
                    '</div>' +
                    '<div class="form flag">' +
                    '<label for="functionFlag">功能标记：</label>' +
                    '<input type="text" id="functionFlag" class="input-text radius" placeholder="请填写功能标记" required="required" >' +
                    '</div>' +
                    '<div class="form type">' +
                    '<label class="control-label" for="functionType">功能类型：</label>' +
                    '<select id="selectType" class="functionType" placeholder="请选择功能类型" ><option value:"">请选择</option><option value:"1">是否</option><option value:"2">范围</option></select>' +
                    '<span class="choose-type">请选择类型</span>' +
                    '</div>' +
                    '<div class="form scope" >' +
                    '<label for="functionScope">权限范围：</label>' +
                    '<select id="selectScope" class="functionScope" placeholder="请选择权限范围" style="color:#bbb" disabled><option value:"">请选择</option><option value:"1">角色</option><option value:"2">用户</option></select>' +
                    '<span class="choose-type">功能类型为"范围"时可选</span>' +
                    '</div>' +
                    '</form>' +
                    '</div>',
                success: function(layero, index) {
                    $("#selectType").change(function() {
                        var ft = $("#selectType option:checked").text();
                        if (ft == "范围") {
                            $(".functionScope").attr("disabled", false);
                            $(".functionScope").css("color", "#000");
                        } else {
                            $(".functionScope").attr("disabled", true);
                            $(".functionScope").css("color", "#bbb");
                        }
                    })
                },
                btn: ['确定', '关闭'],
                yes: function(index, layero) {
                    var fn = $("#functionName").val();
                    var fid = $("#functionId").val();
                    var ff = $("#functionFlag").val();
                    var fs = $(".functionScope").val();
                    var ft = $(".functionType").val();

                    if (!fn || !fid || !ff) {
                        layer.msg('信息不能为空！')
                    }
                    if (fn && fid && ff) {
                        var p = "";
                        if (ft == "是否") {
                            p = 0
                            var data = {
                                name: fn,
                                flag: ff,
                                rid: pid,
                                pt: p,
                                id: fid
                            }
                            postAjax("function/add", data, function(msg) {
                                if (msg.code == 0 && msg.dataInfo > 0) {
                                    layer.msg('新功能保存成功！', {
                                        icon: 1,
                                        time: 1000
                                    });
                                    layer.close(add);

                                    functiontable.init();
                                }
                            })
                        } else if (ft == "范围") {
                            p = 1
                            if (fs == "请选择") {
                                layer.msg('请选择权限范围！')
                            } else {
                                var rr = "";
                                if (fs == "角色") {
                                    rr = 1
                                } else if (fs == "用户") {
                                    rr = 0
                                }
                                var datas = {
                                    name: fn,
                                    flag: ff,
                                    rid: pid,
                                    pt: p,
                                    r: rr,
                                    id: fid
                                }
                                postAjax("function/add", datas, function(msg) {
                                    if (msg.code == 0 && msg.dataInfo > 0) {
                                        layer.msg('新功能保存成功！', {
                                            icon: 1,
                                            time: 1000
                                        });
                                        layer.close(add);

                                        functiontable.init();
                                    }
                                })
                            }
                        } else {
                            layer.msg('请选择功能类型！')
                        }
                    }
                    return false;
                },
                btn2: function(index, layero) {
                    layer.close(edit);
                }
            });
        }

    });
    var stringFormat = util.String.stringFormat;
    var functiontable = {
        init: function() {
            this.getFunction();
        },
        getFunction: function() {
            var _this = this;
            $("#functionTable").html(
                "<tr> " +
                "<td>顶部菜单</td>" +
                "<td>左侧菜单</td>" +
                "<td>资源</td>" +
                "<td>功能</td>" +
                "</tr>"
            );

            var htmlTemplate = {
                td: '<td style="height:{0}px" id="{1}" pid="{2}">{3}</td>',
                trtd: ' <tr> <td style="height: {0}px;" id="{1}" pid="{2}">{3}</td></tr>',
                lasttrtd: ' <tr> <td id="{0}" pid="{1}">{2}</td></tr>',
                lasttrtdNotWithBottun: ' <tr> <td id="{0}" pid="{1}" style="height: 30px; border-bottom: none;">{2}</td></tr>',
                trtdNotWithBottum: ' <tr> <td style="height: {0}px;border-bottom: none;" id="{1}" pid="{2}" class="mybutton">{3}</td></tr>',
                tdtable: '<td><table>{0}</table></td>',
                tdconst: '<td> <table><tr><td id="{1}" pid="{2} style="height: 30px; border-bottom: none;">没有资源</td></tr></table>',
                symbol: '<td class="td-manage"><a title="添加" href="javascript:;" class="ml-3" style="text-decoration:none" id="functonBtn_add"><i class="Hui-iconfont">&#xe600;</i></a><a title="编辑" href="javascript:;" class="ml-5" style="text-decoration:none" id="functonBtn_edit"><i class="Hui-iconfont userEdit">&#xe6df;</i></a><a title="删除" href="javascript:;" class="ml-7" style="text-decoration:none" id="functonBtn_delete"><i  class="Hui-iconfont userDelete">&#xe6e2;</i></a></td>',
            }
            getAjax("function/list", {}, function(data) {
                //顶部菜单
                data.dataInfo.forEach(function(t) {
                    var template = "<tr>";
                    template += "<td id='" + t.id + "' pid='" + t.pId + "'>" + t.name + "</td>";
                    var td1 = "";
                    var td2 = "";
                    var td3 = "";
                    if (t.childs && t.childs.length > 0) {
                        //左侧菜单
                        t.childs.forEach(function(value1, index1, array1) {
                            var functionSize = getFunctionSize(value1);
                            if (index1 == array1.length - 1) {
                                td1 += stringFormat(htmlTemplate.trtdNotWithBottum, 30 * functionSize, value1.id, value1.pId, value1.name);
                            } else {
                                td1 += stringFormat(htmlTemplate.trtd, 30 * functionSize, value1.id, value1.pId, value1.name);
                            }
                            //资源
                            if (value1.childs && value1.childs.length > 0) {
                                value1.childs.forEach(function(value2, index2, array2) {
                                    var functionSize2 = getFunctionSize(value2);
                                    if (index1 == array1.length - 1 && index2 == array2.length - 1) {
                                        td2 += stringFormat(htmlTemplate.trtdNotWithBottum, 30 * functionSize2, value2.id, value2.pId, value2.name);
                                    } else {
                                        td2 += stringFormat(htmlTemplate.trtd, 30 * functionSize2, value2.id, value2.pId, value2.name);

                                    }
                                    //         // 功能
                                    if (value2.functionInfoBeans && value2.functionInfoBeans.length > 0) {
                                        value2.functionInfoBeans.forEach(function(value3, index3, array3) {
                                            if (index2 == array2.length - 1 && index3 == array3.length - 1) {
                                                console.info(value3.functionName);
                                                td3 += stringFormat(htmlTemplate.lasttrtdNotWithBottun, value3.functionId, value3.resourceId, value3.functionName + htmlTemplate.symbol);
                                            } else {
                                                // console.info(value3.functionName);
                                                td3 += stringFormat(htmlTemplate.lasttrtd, value3.functionId, value3.resourceId, value3.functionName + htmlTemplate.symbol);
                                            }
                                        });

                                    } else {
                                        if (index1 == array1.length - 1 && index2 == array2.length - 1) {
                                            td3 += '<tr><td  style="height: 30px; border-bottom: none;">没有资源</td><td pid="' + value2.id + '" class="td-manage" style="height: 30px; border-bottom: none;"><a title="添加" href="javascript:;" class="ml-3" style="text-decoration:none"><i class="Hui-iconfont">&#xe600;</i></a></td></tr>';
                                        } else {
                                            td3 += '<tr><td style=\"height: 30px;\">没有资源</td><td class="td-manage"  pid="' + value2.id + '"  style=\"height: 30px;\"><a   title="添加" href="javascript:;" class="ml-3" style="text-decoration:none"><i class="Hui-iconfont">&#xe600;</i></a></td></tr>';
                                        }
                                    }
                                    // td3 += '<td class="td-manage"><a title="添加" href="javascript:;" class="ml-3" style="text-decoration:none"><i class="Hui-iconfont">&#xe600;</i></a><a title="编辑" href="javascript:;" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont userEdit">&#xe6df;</i></a><a title="删除" href="javascript:;" class="ml-7" style="text-decoration:none"><i  class="Hui-iconfont userDelete">&#xe6e2;</i></a></td>';

                                });
                            } else {
                                if (index1 == array1.length - 1) {
                                    td2 += "<tr><td style=\"height: 30px; border-bottom: none;\">没有资源</td></tr>";
                                    td3 += "<tr><td style=\"height: 30px; border-bottom: none;\">没有资源</td></tr>";
                                } else {
                                    td2 += "<tr><td style=\"height: 30px; \">没有资源</td></tr>";
                                    td3 += "<tr><td style=\"height: 30px; \">没有资源</td></tr>";
                                }
                            }

                        });
                    } else {
                        template +=
                            '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr></table>' +
                            '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr></table>' +
                            '<td> <table><tr><td style="height: 30px; border-bottom: none;">没有资源</td></tr></table>';
                    }
                    template += (
                        (td1 == "" ? "" : stringFormat(htmlTemplate.tdtable, td1)) +
                        (td2 == "" ? "" : stringFormat(htmlTemplate.tdtable, td2)) +
                        (td3 == "" ? "" : stringFormat(htmlTemplate.tdtable, td3)) +
                        "</tr>");
                    $("#functionTable").append(template);

                });
            });
        },
        binds: function() {
            var _this = this;
            $("#functionTable td").on("click", "div", function(e) {
                var target = e.target;
                var id = $(target).attr("id");
                var reId = $(target).attr("dataId");
                // console.log(id).split("_")
                if (id) {
                    if (id.split("_")[0] == 'fun') {
                        var ids = id.split("_")[1]
                        layer.open({
                            content: template.btn,
                        });
                        $(".layui-layer-btn a").css("display", 'none')
                        setTimeout(function() {
                            $("#functonBtn_add").on("click", function() {

                            })
                            $("#functonBtn_edit").on("click", function() {

                            })
                            $("#functonBtn_delete").on("click", function() {
                                layer.confirm('您确定删除吗？', {
                                    btn: ['确定', '取消'] //按钮
                                }, function() {
                                    postAjax("function/del", {
                                        id: ids
                                    }, function(data) {
                                        if (data.code == 0) {
                                            layer.msg("删除成功");
                                            _this.getFunction();
                                        } else {
                                            return false;
                                        }
                                    })
                                }, function() {
                                    // return false;
                                });
                            })
                        }, 300)
                    }
                }
            })
        }
    }
    // }

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
            return e.functionInfoBeans && e.functionInfoBeans.length > 0 ? e.functionInfoBeans.length : 1;
        }
    }

    functiontable.init();

});
