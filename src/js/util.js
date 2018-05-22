var util = (window["util"] = {
    /**
     * @param  String pagenation  显示分页盒模型id(div)
     * @param Number page  当前页
     * @param Number pageCount 总页数
     * @param string method 回调函数，获取分页数据，
     * @param  types 切换
     * @param float  浮动 默认right
     */
    page_html: function(pagenation, page, pageCount, method, types, float) {
        var type = types ? types : 0;
        var html_str = '<div class="digg">';
        if (page == 1) {
            html_str += '<span class="span_1 disabled"></span>';
            html_str += '<span class="span_3 disabled"></span>';
        } else {
            html_str += '<span class="span_1" onclick="' + method + "(1," + type + ')"></span>';
            html_str += '<span class="span_3" onclick="' + method + "(" + (page - 1) + "," + type + ')"></span>';
        }
        var start_page = 0,
            end_page = 0;
        if (pageCount > 10) {
            start_page = Math.max(page - 3, 1);
            if (start_page < 3) {
                end_page = 7;
            } else if (page + 6 > pageCount) {
                end_page = pageCount;
            } else {
                end_page = Math.min(page + 3, pageCount);
            }
        } else {
            start_page = 1;
            end_page = pageCount;
        }
        if (pageCount > 10 && end_page + 3 > pageCount) {
            start_page = pageCount - 6;
            html_str += '<a href="javascript:void(0)" onclick="' + method + "(1," + type + ')">1</a>';
            html_str += '<a href="javascript:void(0)" onclick="' + method + "(2," + type + ')">2</a>';
            html_str += "<b>&hellip;</b>";
        }

        for (var i = start_page; i <= end_page; i++) {
            if (page == i) {
                html_str += '<span class="current">' + i + "</span>";
            } else {
                html_str += '<a href="javascript:void(0)" onclick="' + method + "(" + i + "," + type + ')">' + i + "</a>";
            }
        }

        if (end_page + 2 < pageCount) {
            html_str += "<b>&hellip;</b>";
            html_str += '<a href="javascript:void(0)" onclick="' + method + "(" + (pageCount - 1) + "," + type + ')">' + (pageCount - 1) + "</a>";
            html_str += '<a href="javascript:void(0)" onclick="' + method + "(" + pageCount + "," + type + ')">' + pageCount + "</a>";
        }

        if (page == pageCount) {
            html_str += '<span class="span_4 disabled"></span>';
            html_str += '<span class="span_2 disabled"></span>';
        } else {
            html_str += '<span class="span_4" onclick="' + method + "(" + (page + 1) + "," + type + ')"></span>';
            html_str += '<span class="span_2" onclick="' + method + "(" + pageCount + "," + type + ')"></span>';
        }
        html_str += "</div>";
        $("#" + pagenation).html(html_str);
        $("#" + pagenation).css("float", float ? float : "right");
        $("#" + pagenation).show();
    },
    http: (function() {
        var first = '?',
            other = '&',
            serverUrl = "";

        function wrapRandom(url) {
            return url + (url.indexOf(first) > 0 ? other : first) + 'r=' + Math.ceil(Math.random() * 1000000);
        }

        function wrapURL(url) {
            if (url.toLowerCase().indexOf('http') != 0)
                url = serverUrl + url;
            return url;
        }
        return {
            'getData': function(path, callback) {
                var url;
                if (path.toLowerCase().indexOf('http://') == 0)
                    url = path;
                else
                    url = serverUrl + path;
                url = wrapRandom(url);
                $.getJSON(url, callback);
            },
            'postData': function(path, data, success, error) {
                var option = {
                    url: wrapRandom(wrapURL(path)),
                    type: "post",
                    dataType: 'json'
                };
                if (data)
                    option['data'] = data;
                if (success)
                    option['success'] = success;
                if (error)
                    option['error'] = error;
                $.ajax(option);
            },

            'postForm': function(path, data, success, error) {
                var option = {
                    url: wrapRandom(wrapURL(path)),
                    type: "post",
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
                };
                if (data)
                    option['data'] = data;
                if (success)
                    option['success'] = success;
                if (error)
                    option['error'] = error;
                $.ajax(option);
            },
            /**
             *
             * @param {any} array  数组,可是函数，也可是多个ajax并发执行的回调;
             * @param {any} callback
             */
            'when': function(array, callback) {
                var arr = [];
                array.forEach(function(item) {
                    if (typeof item == 'function') {
                        arr.push(item);
                    } else {
                        var option = {
                            url: wrapRandom(wrapURL(item.url)),
                            type: item.type,
                        }
                        if (item.contentType) {
                            option.contentType = item.contentType
                        }
                        arr.push($.ajax(option));
                    }
                });
                $.when(arr.join(",")).done(callback);

            }
        }
    })(),
    /**
     *
     *
     * @param {any} arr
     * @param {any} id
     * @returns
     */
    arrNOte: function(arr, id) {
        //arr 数组，id要过滤的id
        var ids = arr.filter(function(item) {
            //多选，单选时过滤掉不需要提交的ID
            if (item == id) return false;
            return true;
        });
        return ids;
    },
    noRepeatArr: function(data) {
        //數組去重
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
    },
    table: {
        allSelect: function(fn, ele) {
            /*全选*/
            var _this = this;
            if (ele) {
                ele.on("click", function() {
                    $(this)
                        .closest("table")
                        .find("tr > td:first-child input:checkbox")
                        .prop(
                            "checked",
                            $("table thead th input:checkbox").prop("checked")
                        );
                    _this.selectNode(fn);
                });
            } else {
                $("table thead th input:checkbox").on("click", function() {
                    $(this)
                        .closest("table")
                        .find("tr > td:first-child input:checkbox")
                        .prop(
                            "checked",
                            $("table thead th input:checkbox").prop("checked")
                        );
                    _this.selectNode(fn);
                });
            }
        },
        /**
         * fn 回调 function;
         * tyep   true或false
         * ele   input:checkbox 对象
         */
        selectNode: function(fn, type, ele) {
            //单选或复选几个
            var arr = [];
            if (!type) {
                //用戶列表
                var couctNode = $("table thead th input:checkbox")
                    .closest("table")
                    .find("tr > td:first-child input:checkbox");
            } else {
                if (ele) {
                    var couctNode = ele;
                } else {
                    var couctNode = $(
                        "._editRole tbody tr > td input:checkbox"
                    ); //角色修改
                }
            }

            for (var i = 0; i < couctNode.length; i++) {
                if (couctNode[i]["checked"]) {
                    arr.push(couctNode[i]["value"]);
                }
            }
            var data = (function(arr) {
                var tmp = {},
                    ret = [];
                for (var i = 0, j = arr.length; i < j; i++) {
                    if (!tmp[arr[i]]) {
                        tmp[arr[i]] = 1;
                        ret.push(arr[i]);
                    }
                }
                return ret;
            })(arr);
            //console.log(data)
            if (arr.length > 0 && fn && !type) {
                fn(data);
            } else {
                fn(data);
            }
        }
    },
    Storage: {
        /*本地存储*/
        hname: location.hostname ? location.hostname : "localStatus",
        isLocalStorage: window.localStorage ? true : false,
        dataDom: null,

        initDom: function() {
            //初始化userData
            if (!this.dataDom) {
                try {
                    this.dataDom = document.createElement_x("input"); //这里使用hidden的input元素
                    this.dataDom.type = "hidden";
                    this.dataDom.style.display = "none";
                    this.dataDom.addBehavior("#default#userData"); //这是userData的语法
                    document.body.appendChild(this.dataDom);
                    var exDate = new Date();
                    exDate = exDate.getDate() + 30;
                    this.dataDom.expires = exDate.toUTCString(); //设定过期时间
                } catch (ex) {
                    return false;
                }
            }
            return true;
        },
        set: function(key, value) {
            if (this.isLocalStorage) {
                window.localStorage.setItem(key, escape(value));
            } else {
                if (this.initDom()) {
                    this.dataDom.load(this.hname);
                    this.dataDom.setAttribute(key, escape(value));
                    this.dataDom.save(this.hname);
                }
            }
        },
        get: function(key) {
            if (this.isLocalStorage) {
                return unescape(window.localStorage.getItem(key));
            } else {
                if (this.initDom()) {
                    this.dataDom.load(this.hname);
                    return unescape(this.dataDom.getAttribute(key));
                }
            }
        },
        remove: function(key) {
            if (this.isLocalStorage) {
                localStorage.removeItem(key);
            } else {
                if (this.initDom()) {
                    this.dataDom.load(this.hname);
                    this.dataDom.removeAttribute(key);
                    this.dataDom.save(this.hname);
                }
            }
        }
    },
    /**
     *
     *
     * @param {any} key
     * @returns
     */
    queryString: function(key) {
        var result = location.search.match(
            new RegExp("[?&]" + key + "=([^&]+)", "i")
        );
        if (result == null || result.length < 1) return "";
        return result[1];
    },
    DateTime: {
        /**
         *
         *
         * @param {date} source  new Date()
         * @returns
         */
        showtime: function(source) {
            var month = source.getUTCMonth() + 1;
            return (
                source.getUTCFullYear() +
                "-" +
                (month < 10 ? "0" + month : month) +
                "-" +
                (source.getUTCDate() < 10 ?
                    "0" + source.getUTCDate() :
                    source.getUTCDate())
            );
        },

        fulltime: function(source) {
            var hours = source.getUTCHours(),
                minutes = source.getUTCMinutes(),
                seconds = source.getUTCSeconds();
            return (
                this.showtime(source) +
                " " +
                (hours < 10 ? "0" + hours : hours) +
                ":" +
                (minutes < 10 ? "0" + minutes : minutes) +
                ":" +
                (seconds < 10 ? "0" + seconds : seconds)
            );
        },

    },
    String: {
        stringFormat: function() {
            if (arguments.length == 0) return null;
            var value = arguments[0];
            for (var i = 1, count = arguments.length; i < count; i++) {
                var pattern = new RegExp("\\{" + (i - 1) + "\\}", "gm");
                value = value.replace(pattern, arguments[i]);
            }
            return value;
        },
        /**
         *  去空格
         *
         * @param {string} source
         * @returns
         */
        trim: function(source) { //
            return source.replace(/^\s+|\s+$/gi, "");
        },
        /**
         *
         *  获取字符串长度
         * @param {string} source
         * @returns
         */
        getByteLength: function(source) {
            return String(source).replace(/[^\x00-\xff]/g, "ci").length;
        },
        /**
         *   截取字符串
         *
         * @param {string} source   字符串
         * @param {number} length  截取到第几位
         * @param {string} tail  要拼接在一起的窜
         * @returns
         */
        subByte: function(source, length, tail) {
            var source = String(source);
            tail = tail || "";
            if (length < 0 || this.getByteLength(source) <= length) {
                return source;
            }
            source = source
                .substr(0, length)
                .replace(/([^\x00-\xff])/g, "\x241")
                .substr(0, length)
                .replace(/[^\x00-\xff]$/, "")
                .replace(/([^\x00-\xff]) /g, "\x241");
            return source + tail;
        },
        /**
         *  转义一下HTML 特殊字符
         *
         * @param {any} source
         * @returns
         */
        xssFilter: function(source) {
            var source = source
                .replace(/</gi, "")
                .replace(/>/gi, "")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
            return source;
        }
    },
    functions: function() {
        /*显示页面功能按钮，按钮都添加data-btn等于Flg,所有btn默认hide*/
        var store = JSON.parse(util.Storage.get("item")),
            resourceId = util.Storage.get("resourceId");
        // $('a[data-pk="1"]').off();
        if (store && resourceId) {
            datas = store[resourceId];
            //console.log($('[data-btn="edit-userRole"]'))
            if (datas) {
                datas.forEach(function(item) {
                    $("[data-btn='" + item.functionFlag + "']").removeClass("hide");
                    if (item.functionFlag == 'LOCAL_CAHNGE') {
                        cookie_util.add_or_update_cookie('local_change', item.functionFlag + "_" + resourceId);
                    }
                    // $("a[data-edit='" + item.functionFlag + "']").on();
                });
            }

        }
    },
    /**
     *
     *
     * @param {any} arr  [{a:iruirri,id:1},{a:iruirri,id:2},{a:iruirri,id:1}]
     * @param {any} id   arr的重复值标识
     * @returns
     */
    objArray: function(arr, id) {
        /*arr数组对象，id(string)重复标识即重复值*/
        var hash = {};
        return arr.reduce(function(item, next) {
            hash[next.id] ? "" : (hash[next.id] = true && item.push(next));
            return item;
        }, []);
    },
    /**
     *
     *
     * @param {string} value  提示内容
     * @param {date} time 显示时间
     */
    Huipopup: function(value, time) {
        var pop = '<div id="_Huipopup" style="color:#fff;position:fixed;left:50%;top:50%;padding:10px;background-color:rgba(0,0,0,.6);z-index:99999999999999999;margin-left:-150px;">' + value + '</div>';
        var time_r = null;
        var times = time ? time : 1200;
        if ($("#_Huipopup").length > 0) {
            $("#_Huipopup").html(value);
            $("#_Huipopup").show();
        } else {
            $('body').eq(0).append(pop);
        }
        time_r = setTimeout(function() {
            $("#_Huipopup").hide();
        }, times);
    },
    /**
     *  敏感词标红函数
     *
     * @param {any} schat  content 内容
     * @param {any} tchat  keywords 关键字
     * @returns
     */
    gldata: function(schat, tchat) {
        var sctArray = schat.replace(/(.)(?=[^$])/g, "$1,").split(",");
        var tctArray = tchat.replace(/(.)(?=[^$])/g, "$1,").split(",");
        var glvalue = "";
        for (var i = 0; i < sctArray.length; i++) {
            if (sctArray[i] != tctArray[i]) {
                glvalue += "<span style='color:red'>" + sctArray[i] + "</span>";
            } else {
                glvalue += sctArray[i];
            }
        }
        return glvalue;
    },
    /**
     * 询问弹窗
     *
     * @param {string} url  ajax url
     * @param {string} msg  提示信息
     * @param {string} title  提示标题
     * @param {string} tips  请求成功信息
     */
    popup_masage: function(url, msg, title, tips) {
        layer.confirm(msg, {
            title: title,
            btn: ['ok', 'cancel'] //按钮
        }, function(index) {
            postAjax(url, {}, function() {
                var Success = tips || 'Success'
                util.Huipopup(Success);
                layer, close(index);
            })
        }, function() {

        });
    },
    /**
     *  徽章
     * @param {array} data  array badges
     * @param {aobject} dataMap  object badgeMap
     */
    badge: function(data, dataMap) {
        if (data && dataMap) {
            var data_html = '<span class="badge_list">{0}<span>';
            var badge_arr = {};
            for (items in dataMap) {
                badge_arr[dataMap[items]['level_num']] = dataMap[items];
            };
            var data_img = data.map(function(item) {
                var img_list = '';
                if (badge_arr[item.id]) {
                    img_list += '<img style="height:25px;" src=' + serverUrl + badge_arr[item.id]['level_pic'] + ' />'
                } else {
                    img_list += '<img style="height:25px;" src="../../images/nophoto1.jpg" />'
                }
                return img_list;
            }).join(" ");
            return util.String.stringFormat(data_html, data_img);
        } else {
            return '';
        }
    },
    /**
     *  input  实时监听
     * @param {string} ele  input 对象
     * @param {function} callback  回调函数
     * @param {boolean} bool    true/false 是否jq
     */
    event_input: function(ele, callback, bool) {
        if (bool) {
            $(ele).on('input propertychange', callback);
        } else {
            if ((!!window.ActiveXObject || "ActiveXObject" in window) && ele.attachEvent) {
                ele.attachEvent('onpropertychange', callback)
            } else {
                ele.addEventListener('input', callback, false);
            }
        }

    },
    /**
     *
     *
     * @param {any} ele  array或 string
     * @param {any} callback  function
     */
    html_enter: function(ele, callback) {
        if (typeof ele == 'string') {
            $("#" + ele).off().on('keyup', function(e) {
                if (e.keyCode == 13) {
                    callback();
                }
            })
        } else {
            ele.forEach(function(item) {
                $('#' + item).off().on('keyup', function(e) {
                    if (e.keyCode == 13) {
                        callback();
                    }
                })

            })

        }
    }

});
var cookie_util = (window["cookie_util"] = new function() {
    /*  cookie的参数cookie_name说明：
     * id_u  userid
     * id_r  roomId
     *  siginListId 用户详情查询时当前userId
     * SELF_USER_NAME //当前登录用户Name
     * local_change  //就地更改权限；
     */
    this.base_attr = {
        loginKey: "SELF_LOGIN_KEY", //
        user_msg: "SELF_USER_ID" //当前用户Id
    };
    this.get_cookie = function(cookie_name) {
        if (!cookie_name || cookie_name == "") {
            return null;
        }
        var reg = new RegExp("(^| )" + cookie_name + "=([^;]*)(;|$)");
        var arr = document.cookie.match(reg);
        if (arr) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    };
    this.add_or_update_cookie = function(cookie_name, cookie_val, time) {
        if (!cookie_name || cookie_name == "") {
            return;
        }
        var cookie_str = cookie_name + "=" + escape(cookie_val) + ";";
        if (time > 0) {
            var date = new Date();
            date.setTime(date.getTime() + time);
            cookie_str += "expires=" + date.toGMTString() + ";";
        }
        cookie_str += "path=/;";
        //cookie_str += "path=/;domain=;";
        document.cookie = cookie_str;
    };
    this.delete_cookie = function(cookie_name) {
        if (!cookie_name || cookie_name == "") {
            return;
        }
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie =
            cookie_name +
            "=; expires=" +
            date.toGMTString() +
            ";path=/;domain=;";
    };
    this.delete_cookie_all = function() {
        this.delete_cookie('SELF_LOGIN_KEY');
        this.delete_cookie('SELF_USER_ID');
        this.delete_cookie('id_r');
        this.delete_cookie('id_u');
        this.delete_cookie('siginListId');
        this.delete_cookie('local_change');
        this.delete_cookie('userLogId');

    }
}());