var paths = "http://10.10.32.147/backv2/";
/**
 * ajax的get请求
 * @param String url  请求接口url
 * @param json datas 请求参数，null传{}
 * @param function success 成功回调
 * @param function error  失败回调 ，可为空
 */
function getAjax(url, datas, success, error, isSysTip) {
    $.ajax({
        type: "get",
        url: paths + url,
        async: true,
        dataType: 'json',
        data: datas,
        success: function (data) {
            if (isSysTip) {
                success(data);
                return;
            }
            if (data.code == 0) {
                success(data);
            } else if (data.code == 99) {
                window.location.href = window.location.href.replace("index.html", "login.html");
            } else if (data.code == 95) {
                $.Huimodalalert('code ：95 id不存在！', 1500);
            } else if (data.code == 93) {
                window.parent.location.href = window.parent.location.href.replace("index.html", "login.html");
            } else {
                if (error) {
                    error(data);
                } else {
                    if (data.code == 403) {
                        $.Huimodalalert("code: " + data.code + ' 沒有权限！', 1500)
                    } else {
                        $.Huimodalalert("code: " + data.code + ' 请求失败！', 1500)
                    }

                }
            }
        },
        error: function (e) {
            $.Huimodalalert("code: " + data.code + ' 接口请求失败！', 1500)
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
    $.ajax({
        type: "post",
        url: paths + url,
        async: true,
        dataType: 'json',
        data: datas,
        success: function (data) {
            console.log(data)
            if (isSysTip) {
                success(data);
                return;
            }
            if (data.code == 0) {
                success(data);
            } else if (data.code == 99) {
                //$.Huimodalalert('登录失效，请重新登录！', 1500)
                window.location.href = window.location.href.replace("index.html", "login.html");
            } else if (data.code == 104) {
                $.Huimodalalert('code ：104 角色名不能重复！', 1500);

            } else if (data.code == 94) {
                $.Huimodalalert('code ：94 用户名重复！', 1500);
            } else if (data.code == 93) {
                window.parent.location.href = window.parent.location.href.replace("index.html", "login.html");
            } else if (data.code == 106) {
                $.Huimodalalert('code ：106 id重复！', 1500);
            } else {
                if (error) {
                    error(data);
                } else {
                    $.Huimodalalert("code: " + data.code + ' 参数错误！', 1500)
                }
            }
        },
        error: function (e) {
            $.Huimodalalert("code: " + data.code + ' 接口请求失败！', 1500)
        }
    });
}

function formAjax(url, datas, success, error, isSysTip) {
    $.ajax({
        type: "post",
        url: paths + url,
        async: true,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: datas,
        success: function (data) {
            console.log(data)
            if (isSysTip) {
                success(data);
                return;
            }
            if (data.code == 0) {
                success(data);
            } else if (data.code == 99) {
                $.Huimodalalert('code ：99 登录失效，请重新登录！', 1500)
            } else {
                if (error) {
                    error(data);
                } else {
                    $.Huimodalalert("code: " + data.code + ' 请求失败！', 1500)
                }
            }
        },
        error: function (e) {
            $.Huimodalalert("code: " + data.code + ' 接口请求失败！', 1500)
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
    var t = (f) ? parseInt(str) * 1000 : parseInt(str);
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
        return y + "." + m + "." + da;
    }
}
/**
 * 把年月日（2015-10-20）转变为时间戳
 * @param String dateStr 日期
 */
function getTimeStr(dateStr) {
    var newstr = dateStr.replace(/-/g, '/');
    var date = new Date(newstr);
    var time_str = date.getTime().toString();
    return time_str.substr(0, 10);
}

function setNum(s) {
    return (parseInt(s) > 9) ? s : '0' + s;
}