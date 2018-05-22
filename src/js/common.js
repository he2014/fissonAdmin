// var paths = "http://10.10.22.132/backv2/";
var paths = "http://www.7najm.com/backv2/";
var serverUrl = "http://www.7najm.com/resource/";
/**
 * ajax的get请求
 * @param String url  请求接口url
 * @param json datas 请求参数，null传{}
 * @param function success 成功回调
 * @param function error  失败回调 ，可为空
 */

function getAjax(url, datas, success, error, isSysTip) {
    var newTime = new Date().getTime();
    datas['version_'] = newTime;
    $.ajax({
        type: "get",
        url: paths + url,
        async: true,
        dataType: "json",
        data: datas,
        success: function(data) {
            if (isSysTip) {
                success(data);
                return;
            }
            if (data.code == 0) {
                success(data);
            } else if (data.code == 99) {
                var locations = window.parent.location ? window.parent.location : window.location;
                locations.href = locations.href.replace(
                    "index.html",
                    "login.html"
                );
            } else if (data.code == 95) {
                util.Huipopup("code ：95 id不存在！", 1500);
            } else if (data.code == 93) {
                var location_s = window.parent.location ? window.parent.location : window.location;
                location_s.href = location_s.href.replace(
                    "index.html",
                    "login.html"
                );
            } else {
                if (error) {
                    error(data);
                } else {
                    if (data.code == 403) {
                        util.Huipopup(
                            "code: " + data.code + " 沒有权限！",
                            1500
                        );
                    } else {
                        var _timeOut = null;
                        if (data.code == 404) {
                            util.Huipopup(
                                "code: " + data.code + "请求路径不存在", 1500);
                        } else {
                            util.Huipopup("code: " + data.code + "  未知错误！");
                        }
                        // _timeOut = setTimeout(function () {
                        //     var location_error = window.parent.location ? window.parent.location : window.location;
                        //     if (cookie_util.get_cookie('SELF_LOGIN_KEY') && location_error.href.indexOf("index.html") >= 0) {
                        //         location_error.href = location_error.href.replace("index.html", "login.html");
                        //     }
                        // }, 1500)


                    }
                }
            }
        },
        error: function(e) {
            util.Huipopup("接口请求失败！", 1500);
        }
    });
}
/**
 * ajax的post请求
 * @param String url  请求接口url
 * @param json datas 请求参数，null传{}
 * @param function success 成功回调
 * @param function error  失败回调 ，可为空
 */
function postAjax(url, datas, success, error, isSysTip) {
    var newTime = new Date().getTime();
    $.ajax({
        type: "post",
        url: paths + url + '?version=' + newTime,
        async: true,
        dataType: "json",
        data: datas,
        success: function(data) {
            //console.log(data);
            if (isSysTip) {
                success(data);
                return;
            }
            if (data.code == 0) {
                success(data);
            } else if (data.code == 99) {
                var locations = window.parent.location ? window.parent.location : window.location;
                locations.href = locations.href.replace(
                    "index.html",
                    "login.html"
                );
            } else if (data.code == 104) {
                util.Huipopup("code ：104 角色名不能重复！", 1500);
            } else if (data.code == 91) {
                util.Huipopup("code ：91 密码错误！", 1500);
            } else if (data.code == 94) {
                util.Huipopup("code ：94 用户名重复！", 1500);
            } else if (data.code == 93) {
                var location_s = window.parent.location ? window.parent.location : window.location;
                location_s.href = location_s.href.replace(
                    "index.html",
                    "login.html"
                );
            } else if (data.code == 106) {
                util.Huipopup("code ：106 id重复！", 1500);
            } else if (data.code == 100) {
                util.Huipopup("code ：100 url不能为空！", 1500);
            } else if (data.code == 111) {
                util.Huipopup("code ：111 设备号重复！", 1500);
            } else if (data.code == 90) {
                util.Huipopup("code 90 参数错误");
            } else if (data.code == 112) {
                util.Huipopup("code 112 起始时间不能大于结束时间", 1500);
            } else if (data.code == 117) {
                util.Huipopup("道具数量不足");
            } else if (data.code == 115) {
                util.Huipopup("已经存在");
            } else if (data.code == 403) {
                util.Huipopup("code ：403 没有权限！", 1500);
            } else {
                if (error) {
                    error(data);
                } else {
                    if (data.code == 404) {
                        util.Huipopup(
                            "code: " + data.code + "请求路径不存在", 1500);
                    } else {
                        util.Huipopup("code: " + data.code + "  未知错误！");
                    }
                }
            }
        },
        error: function(e) {
            util.Huipopup(" 接口请求失败！", 1500);
        }
    });
}

function formAjax(url, datas, success, error, isSysTip) {
    $.ajax({
        type: "post",
        url: paths + url,
        async: true,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        data: datas,
        success: function(data) {
            console.log(data);
            if (isSysTip) {
                success(data);
                return;
            }
            if (data.code == 0) {
                success(data);
            } else if (data.code == 99) {
                $.Huimodalalert("code ：99 登录失效，请重新登录！", 1500);
            } else {
                if (error) {
                    error(data);
                } else {
                    $.Huimodalalert("code: " + data.code + " 请求失败！", 1500);
                }
            }
        },
        error: function(e) {
            $.Huimodalalert("code: " + data.code + " 接口请求失败！", 1500);
        }
    });
}
/**
 * 根据时间戳获取年、月、日
 * @param String str 时间戳
 * @param Boolean f 是否在原来的基础上*1000，true要*，false或不填就不*
 * @param num type 显示格式，，不传时默认显示年月日
 */
function getTimes(str, f, type) {
    var t = f ? parseInt(str) * 1000 : parseInt(str);
    var d = new Date(t);
    var y = d.getFullYear();
    var m = setNum(d.getMonth() + 1);
    var da = setNum(d.getDate());
    var h = setNum(d.getHours());
    var mm = setNum(d.getMinutes());
    var ss = setNum(d.getSeconds());
    if (type == 1) {
        return y + "-" + m + "-" + da + " " + h + ":" + mm + ":" + ss;
    } else if (type == 2) {
        return y + "年" + m + "月" + da + "日 " + h + ":" + mm + ":" + ss;
    } else if (type == 3) {
        return h + ":" + mm + ":" + ss;
    } else if (type == 4) {
        return y + "年" + m + "月" + da + "日 " + h + ":" + mm;
    } else if (type == 5) {
        return y + "年" + m + "月" + da + "日 ";
    } else if (type == 6) {
        return y + "." + m + "." + da + "  " + h + ":" + mm;
    } else if (type == 7) {
        return y + "." + m + "." + da + "  " + h + ":" + mm + ":" + ss;
    } else {
        return y + "-" + m + "-" + da;
    }
}
/**
 * 把年月日（2015-10-20）转变为时间戳
 * @param String dateStr 日期
 */
function getTimeStr(dateStr) {
    var newstr = dateStr.replace(/-/g, "/");
    var date = new Date(newstr);
    var time_str = date.getTime().toString();
    return time_str.substr(0, 10);
}

function setNum(s) {
    return parseInt(s) > 9 ? s : "0" + s;
}
/**
 * 集中处理img错误问题;
 */