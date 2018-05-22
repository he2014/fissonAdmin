$(document).ready(function() {
    // console.log(window)
    var room_tagConfigs = (window['room_tagConfigs'] = {
        init: function() {
            this.getTagConfig();
        },
        tempnentHtml: function(data) {
            var template = '<div class="top" style="padding:10px 10px;"> \
                        <span colspan="6" class="{1}">标签分类</span></div>\
            <table class="table table-border table-bordered table-bg table-hover">\
            <thead class="text-l" >\
                <tr class="text-c">\
                    <th>编号</th>\
                    <th>标签名称</th>\
                    <th>子标签</th>\
                    <th>排序</th>\
                    <th>是否推荐</th>\
                    <th>操作</th>\
                </tr>\
             </thead >\
            <tbody>\
                {0}\
            </tbody>\
        </table ><div id="pageBlackList"></div>';

            if (data && data.list && data.list.length > 0) {
                var btn_isHide = "hide";
                var list = data.list.map(function(item) {
                    btn_isHide = item.parent_id == 0 ? "" : "hide";
                    var child_tag = item.is_seed == 1 ? "" : "hide";
                    var is_recommend = item.is_recommend == 1 ? "推荐" : "不推荐";
                    var btn = '<button data-pid="' + item.id + '" class="searchTag layui-btn-xs layui-btn ' + child_tag + '" style="float:left;">查看分类</button>';
                    return '<tr class="text-c">' +
                        '<td>' + item.id + '</td>' +
                        '<td>' + item.value + '</td>' +
                        '<td>' + btn + '<div class="hide" id="tableBox_' + item.id + '"></div></td>' +
                        '<td>' + item.sort + '</td>' +
                        '<td>' + is_recommend + '</td>' +
                        '<td style="width: 160px;">' +
                        '<button class="layui-btn layui-btn-xs set_language" data-id=' + item.id + ' data-pid = "' + item.parent_id + '">语言</button>' +
                        '<button data-btn="tagConfig_edit" class="hide layui-btn layui-btn-xs edit_tag" data-msg=' + JSON.stringify(item) + ' >编辑</button>' +
                        '<button data-btn="tagConfig_delete" class="hide layui-btn layui-btn-xs  delete_tag" data-id="' + item.id + '" data-pid = "' + item.parent_id + '">删除</button>' +
                        '<button data-btn="tagConfig_add" class="hide layui-btn layui-btn-xs add_tag" data-id="' + item.id + '" data-pid = "' + item.parent_id + '">添加</button>' +
                        '</td>' +
                        '</tr>'

                }).join('');
                return util.String.stringFormat(template, list, btn_isHide);
            } else {
                return '<span style="color:red;">此标签子分类为空</span>'
            }
        },
        tempnentHtml_child: function(data) {
            var template = '<div class="top" style="padding:10px 10px;"> \
                        <span colspan="6" class="{1}">标签分类</span></div>\
            <table class="table table-border table-bordered table-bg table-hover">\
            <thead class="text-l" >\
                <tr class="text-c">\
                    <th>编号</th>\
                    <th>标签名称</th>\
                    <th>子标签</th>\
                    <th>排序</th>\
                    <th>是否推荐</th>\
                    <th>位置</th>\
                    <th>封面</th>\
                    <th>操作</th>\
                </tr>\
             </thead >\
            <tbody>\
                {0}\
            </tbody>\
        </table ><div id="pageBlackList"></div>';

            if (data && data.list && data.list.length > 0) {
                var btn_isHide = "hide";
                var list = data.list.map(function(item) {
                    btn_isHide = item.parent_id == 0 ? "" : "hide";
                    var child_tag = item.is_seed == 1 ? "" : "hide";
                    var is_recommend = item.is_recommend == 1 ? "推荐" : "不推荐";
                    var btn = '<button data-pid="' + item.id + '" class="searchTag layui-btn-xs layui-btn ' + child_tag + '" style="float:left;">查看分类</button>';
                    return '<tr class="text-c">' +
                        '<td>' + item.id + '</td>' +
                        '<td>' + item.value + '</td>' +
                        '<td>' + btn + '<div class="hide" id="tableBox_' + item.id + '"></div></td>' +
                        '<td>' + item.sort + '</td>' +
                        '<td>' + is_recommend + '</td>' +
                        '<td>' + item.feed_index + '</td>' +
                        '<td><img style="height:50px;" src=' + serverUrl + item.tag_pic_url + ' / ></td>' +
                        '<td style="width: 160px;">' +
                        '<button class="layui-btn layui-btn-xs set_language" data-id=' + item.id + ' data-pid = "' + item.parent_id + '">语言</button>' +
                        '<button data-btn="tagConfig_edit" class="hide layui-btn layui-btn-xs edit_tag" data-msg=' + JSON.stringify(item) + ' >编辑</button>' +
                        '<button data-btn="tagConfig_delete" class="hide layui-btn layui-btn-xs  delete_tag" data-id="' + item.id + '" data-pid = "' + item.parent_id + '">删除</button>' +
                        '<button data-btn="tagConfig_add" class="hide layui-btn layui-btn-xs add_tag" data-id="' + item.id + '" data-pid = "' + item.parent_id + '">添加</button>' +
                        '</td>' +
                        '</tr>'

                }).join('');
                return util.String.stringFormat(template, list, btn_isHide);
            } else {
                return '<span style="color:red;">此标签子分类为空</span>'
            }
        },
        getTagConfig: function() {
            var _this = this;
            getAjax('tag/list/0', {}, function(data) {
                $("#tagConfig").html(_this.tempnentHtml(data.dataInfo));
                util.functions();
                _this.bind_event()
            })

        },
        bind_event: function() {
            var _this = this;
            $(".searchTag").unbind('click').click(function() {
                var pid = $(this).data('pid');
                var content = $('#tableBox_' + pid);
                var bool = content.hasClass('hide');
                // content.toggle("hide");
                if (bool) {
                    getAjax('tag/list/' + pid, {}, function(data) {
                        content.html(_this.tempnentHtml_child(data.dataInfo));
                        util.functions();
                        _this.bind_event();
                        content.removeClass("hide");
                    })
                } else {
                    content.addClass("hide");

                }
            });
            this.tag_refresh();
            this.set_language();
            this.edit_tag();
            this.delete_tag();
            this.add_tag();
        },
        set_language: function(tag_Id) {
            var _this = this;
            $(".set_language").unbind('click').click(function() {
                var tagId = $(this).data('id');
                _this.get_tag_language(tagId);
            });
            if (tag_Id) {
                this.get_tag_language(tag_Id);
            };
        },
        get_tag_language: function(tagId) {
            var _this = this;
            getAjax('tag/get/lang/' + tagId, {}, function(data) {
                _this.renderLanguage(data.dataInfo, tagId);

            })
        },
        renderLanguage: function(data, tagId) {
            if (data) {
                var template = '<table class="table table-border table-bordered table-bg table-hover" style="padding:30px 10px 10px;">\
                    <thead class="text-l" >\
                    <tr><td colspan="4">\
                    <button data-id="{1}"  data-btn="add_tag_language" class="hide layui-btn layui-btn-xs tag_add_languages">新建</button> \
                    </td></tr>\
                    <tr class="text-c">\
                     <th>编号</th>\
                    <th>语言</th>\
                     <th>名称</th>\
                    <th>操作</th>\
                </tr>\
                </thead >\
                <tbody>\
                 {0}\
                </tbody>\
                </table >';
                var list = data.map(function(item) {
                    var sys_language_type = item.sys_language_type == 1 ? "英语" : item.sys_language_type == 2 ? "阿语" : "土耳其语"
                    return '<tr class="text-c">' +
                        '<td>' + item.language_detail_id + '</td>' +
                        '<td>' + sys_language_type + '</td>' +
                        '<td>' + JSON.parse(item.language_val).name + '</td>' +
                        '<td>' +
                        '<button data-btn="tagConfig_delete_language"  data-tagId=' + tagId + ' class="hide layui-btn layui-btn-xs  tag_delete_language" data-id="' + item.language_detail_id + '">删除</button>' +
                        '</td>' +
                        '</tr>'

                }).join('');
                layer.open({
                    title: '编辑',
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['800px', '480px'], //宽高
                    content: util.String.stringFormat(template, list, tagId)
                });
                this.tag_language_event();
                this.tag_add_languages();
                this.tag_delete_language();
            }

        },
        // tag_editableCallback: function () {
        //     util.Huipopup('跟新成功')
        // },
        tag_language_event: function() {
            util.functions();
            var _this = this;

            $("button.tag_delete_language").unbind('click').click(function() {
                var language_id = $(this).data('id');
                var tagId = $(this).data('tagid');
                layer.confirm('确定删除吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function(index) {
                    postAjax('tag/delete/lang/' + language_id, {}, function() {
                        util.Huipopup("删除成功");
                        layer.closeAll();
                        _this.set_language(tagId);
                    })
                });
            })
        },
        tag_add_languages: function() {
            var _this = this;
            $("button.tag_add_languages").unbind('click').click(function() {
                var tagId = $(this).data('id');
                var add_language = '<div style="height:100px;display:flex;justify-content:space-between;align-items:center;flex-direction:column;margin:5px 50px;">\
                <select name="city" lay-verify="" style="height:30px;" class="add_taglanguage_select">\
                <option value="1" selected>英语</option>\
                <option value="2">阿语</option>\
                <option value="3">土耳其语</option>\
              </select>\
              <input type="text" name="title"  required lay-verify="required" placeholder="请输入语言" autocomplete="off" class="layui-input add_taglanguage_input"> \
             </div>'
                layer.open({
                    title: '新建语言',
                    type: 1,
                    btn: ['确定'],
                    area: ['400px', '240px'],
                    content: add_language,
                    yes: function(index) {
                        var lang = $("input.add_taglanguage_input").val();
                        var type = $('select.add_taglanguage_select').val();
                        if (lang) {
                            postAjax('tag/add/lang/' + tagId + '/' + type + '/' + lang, {}, function() {
                                util.Huipopup('新建成功！');
                                layer.closeAll();
                                _this.set_language(tagId);
                            })
                        } else {
                            util.Huipopup('请输入语言');
                        }
                    }
                });
            })

        },
        tag_delete_language: function() {

        },
        edit_tag: function() {
            var _this = this;
            $(".edit_tag").unbind('click').click(function() {
                var edit_form = '<div class="form-out">\
                <div class="form-lable">是否显示</div>\
                <div class="form-box is-show">\
                    <input type="radio"  name="demo-3" value="1" {0}>\
                    <label for="radio-2">是</label>\
                    <input type="radio"  name="demo-3" value="0" {1}>\
                    <label for="radio-2">否</label>\
                </div>\
                  </div>\
                  <div class="form-out">\
                  <div class="form-lable">是否大小图</div>\
                  <div class="form-box is-img">\
                      <input type="radio"  name="demo-radio1" value="1" {2}>\
                      <label for="radio-2">是</label>\
                      <input type="radio" name="demo-radio1" value="0" {3} >\
                      <label for="radio-2">否</label>\
                  </div>\
                </div>\
                <div class="form-out">\
                  <div class="form-lable">是否OBS</div>\
                  <div class="form-box is-OBS">\
                      <input type="radio"  name="demo-radio2" value="1" {4}>\
                      <label for="radio-2">是</label>\
                      <input type="radio" name="demo-radio2" value="0" {5}>\
                      <label for="radio-2">否</label>\
                  </div>\
                </div>\
                <div class="form-out">\
                  <div class="form-lable">海报尺寸</div>\
                  <div class="form-box is-poster">\
                      <input type="radio" " name="demo-radio3" value="1" {6}>\
                      <label for="radio-2">大</label>\
                      <input type="radio" name="demo-radio3" value="2" {7}>\
                      <label for="radio-2">长</label>\
                      <input type="radio" name="demo-radio3" value="3" {8}>\
                      <label for="radio-2">小</label>\
                  </div>\
                </div>\
                <div class="form-out">\
                <div class="form-lable">排序</div>\
                <div class="form-box is-sort">\
                    <input type="text" placeholder="请输入" class="input-text radius size-S">\
                </div>\
              </div>\
              <div class="form-out">\
              <div class="form-lable">标签名</div>\
              <div class="form-box is-name">\
              <input type="text" placeholder="请输入" class="input-text radius size-S">\
              </div>\
                </div>\
                <div class="form-out">\
                <div class="form-lable">ArabName</div>\
                <div class="form-box is-ArabName">\
                <input type="text" placeholder="请输入" class="input-text radius size-S">\
                </div>\
              </div>\
              <div class="form-out">\
              <div class="form-lable">位置</div>\
              <div class="form-box is-location">\
              <input type="text" placeholder="请输入" class="input-text radius size-S">\
              </div>\
             </div>\
                <div class="form-out">\
                <div class="form-lable">封面</div>\
                <div class="form-box">\
                <button class="layui-btn layui-btn-xs editPicture">上传图片</button>\
                </div>\
                 </div>'
                var data_msg = $(this).data('msg');
                var demo_3_1 = "checked",
                    demo_3_2 = "";
                if (data_msg.is_recommend) {
                    if (data_msg.is_recommend == 0) {
                        demo_3_2 = "checked";
                        demo_3_1 = "";
                    }
                }
                var demo_radio_1 = "checked",
                    demo_radio_2 = "";
                if (data_msg.is_small_pic) {
                    if (data_msg.is_small_pic == 0) {
                        demo_radio_2 = "checked";
                        demo_radio_1 = "";
                    }
                }
                var demo_radio_3 = "checked",
                    demo_radio_4 = "";
                if (data_msg.is_obs) {
                    if (data_msg.is_obs == 0) {
                        demo_radio_4 = "checked";
                        demo_radio_3 = "";
                    }
                }
                var demo_radio_5 = "checked",
                    demo_radio_6 = "",
                    demo_radio_7 = "";
                if (data_msg.show_type) {
                    if (data_msg.show_type == 2) {
                        demo_radio_6 = "checked";
                        demo_radio_5 = "";
                        demo_radio_7 = "";
                    }
                    if (data_msg.show_type == 3) {
                        demo_radio_7 = "checked";
                        demo_radio_5 = "";
                        demo_radio_6 = "";
                    }
                }
                layer.open({
                    title: '编辑',
                    btn: ['确定'],
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['480px', '400px'], //宽高
                    content: util.String.stringFormat(edit_form, demo_3_1, demo_3_2, demo_radio_1, demo_radio_2, demo_radio_3, demo_radio_4, demo_radio_5, demo_radio_6, demo_radio_7),
                    yes: function(index) {
                        var name = $('.is-name input').val();
                        var sort = $('.is-sort input').val();
                        var arabLang = $('.is-ArabName input').val();
                        var isRecommend = $('[name="demo-3"]:checked').val();
                        var isSmallPic = $('[name="demo-radio1"]:checked').val();
                        var isObs = $('[name="demo-radio2"]:checked').val();
                        var showType = $('[name="demo-radio3"]:checked').val();
                        var location = $('.is-location input').val();
                        postAjax('tag/update/' + data_msg.id, {
                            name: name,
                            sort: sort,
                            arabLang: arabLang,
                            isRecommend: isRecommend,
                            isSmallPic: isSmallPic,
                            isObs: isObs,
                            showType: showType,
                            fi: location,
                            pic: room_tagConfigs.data_pic
                        }, function() {
                            _this.getTagConfig();
                            util.Huipopup('修改成功');
                            layer.close(index);
                        })
                    }
                });


                if (data_msg.sort) {
                    $('.is-sort input').val(data_msg.sort)
                }
                if (data_msg.arab_lang) {
                    $('.is-ArabName input').val(decodeURI(data_msg.arab_lang));
                }
                if (data_msg.value) {
                    $('.is-name input').val(data_msg.value)
                }
                // console.log(data_msg)
                // $('[name="demo-radio3"]').click(function () {

                // console.log(a)
                //  })
                $(".editPicture").unbind("click").click(function() {
                    console.log(1)
                    upload_util.show_upload_image(this, '上传图片', true, room_tagConfigs.add_pic_tag);
                });
            });
        },
        delete_tag: function() {
            var _this = this;
            $(".delete_tag").unbind('click').click(function() {
                var id = $(this).data('id');
                layer.confirm('确定删除吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function(index) {
                    postAjax('tag/del/' + id, {}, function() {
                        util.Huipopup('删除成功')
                        _this.getTagConfig();
                        layer.close(index);
                    })
                });
            })

        },
        add_tag: function() {
            var _this = this;
            $(".add_tag").unbind('click').click(function() {
                var add_form = '<div class="form-out">\
                <div class="form-lable">是否显示</div>\
                <div class="form-box is-show">\
                    <input type="radio"  name="demo-3" value="1" checked>\
                    <label for="radio-2">是</label>\
                    <input type="radio"  name="demo-3" value="0" >\
                    <label for="radio-2">否</label>\
                </div>\
                </div>\
                <div class="form-out">\
                <div class="form-lable">是否大小图</div>\
                <div class="form-box is-img">\
                  <input type="radio"  name="demo-radio1" value="1" checked>\
                  <label for="radio-2">是</label>\
                  <input type="radio" name="demo-radio1" value="0"  >\
                  <label for="radio-2">否</label>\
                </div>\
                </div>\
                <div class="form-out">\
                <div class="form-lable">是否OBS</div>\
                 <div class="form-box is-OBS">\
                  <input type="radio"  name="demo-radio2" value="1" checked>\
                  <label for="radio-2">是</label>\
                  <input type="radio" name="demo-radio2" value="0" >\
                  <label for="radio-2">否</label>\
                </div>\
                </div>\
                <div class="form-out">\
                <div class="form-lable">海报尺寸</div>\
                 <div class="form-box is-poster">\
                  <input type="radio" " name="demo-radio3" value="1" checked>\
                  <label for="radio-2">大</label>\
                  <input type="radio" name="demo-radio3" value="2" >\
                  <label for="radio-2">长</label>\
                  <input type="radio" name="demo-radio3" value="3" >\
                  <label for="radio-2">小</label>\
                 </div>\
                </div>\
                <div class="form-out">\
                <div class="form-lable">排序</div>\
                <div class="form-box is-sort">\
                <input type="text" placeholder="请输入" class="input-text radius size-S">\
                </div>\
                </div>\
                <div class="form-out">\
                <div class="form-lable">标签名</div>\
                <div class="form-box is-name">\
                <input type="text" placeholder="请输入" class="input-text radius size-S">\
                </div>\
                 </div>\
                <div class="form-out">\
                <div class="form-lable">ArabName</div>\
                <div class="form-box is-ArabName">\
                <input type="text" placeholder="请输入" class="input-text radius size-S">\
                </div>\
               </div>\
               <div class="form-out">\
               <div class="form-lable">位置</div>\
               <div class="form-box is-location">\
               <input type="text" placeholder="请输入" class="input-text radius size-S">\
               </div>\
              </div>\
             <div class="form-out">\
             <div class="form-lable">封面</div>\
             <div class="form-box">\
             <button class="layui-btn layui-btn-xs changePicture">上传图片</button>\
             </div>\
              </div>'
                var parentId = $(this).data('id')
                layer.open({
                    title: '添加',
                    btn: ['确定'],
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['480px', '400px'], //宽高
                    content: add_form,
                    yes: function(index) {
                        var name = $('.is-name input').val();
                        var sort = $('.is-sort input').val();
                        var arabLang = $('.is-ArabName input').val();
                        var location = $('.is-location input').val();
                        var isRecommend = $('[name="demo-3"]:checked').val();
                        var isSmallPic = $('[name="demo-radio1"]:checked').val();
                        var isObs = $('[name="demo-radio2"]:checked').val();
                        var showType = $('[name="demo-radio3"]:checked').val();
                        if (!name) {
                            util.Huipopup('请输入标签名', 1000)
                        } else if (!arabLang) {
                            util.Huipopup('请输入ArabName', 1000)
                        } else if (!room_tagConfigs.data_pic) {
                            util.Huipopup('请上传图片', 1000)
                        } else {
                            postAjax('tag/add/' + parentId, {
                                name: name,
                                sort: sort,
                                arabLang: arabLang,
                                isRecommend: isRecommend,
                                isSmallPic: isSmallPic,
                                isObs: isObs,
                                showType: showType,
                                fi: location,
                                pic: room_tagConfigs.data_pic
                            }, function() {
                                _this.getTagConfig();
                                util.Huipopup('添加成功')
                                layer.close(index);
                            })
                        }

                    }
                });
                $(".changePicture").unbind("click").click(function() {
                    upload_util.show_upload_image(this, '上传图片', true, room_tagConfigs.add_pic_tag);
                });
            });

        },
        add_pic_tag: function(data) {
            room_tagConfigs.data_pic = data;
        },
        tag_refresh: function() {
            var _this = this;
            $("#update_tag").unbind('click').click(function() {
                getAjax("tag/cache/reload/lableinfo", {}, function() {
                    util.Huipopup('刷新成功');
                    _this.getTagConfig();
                })
            });
        }
    });
    room_tagConfigs.init();
})