/**/

var format = util.String.stringFormat;
/**
 * control 当前被点击元素，
 * title 弹窗标题
 * bool 是否弹窗，弹窗（true）
 * */

var upload_util = new function () {
    //上传图片在图库
    this.show_upload_image = function (control, title, bool, fn) {
        var resource = $(control).attr("data-type");
        if (resource == null || resource == undefined || resource == "") {
            resource = "other";
        }
        var controlId = $(control).attr("data-target");
        var html = '<div style="text-align: center;padding-top: 30px;"><button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="userHeaderImg">\
            选择文件</button>\
            <input id="userHeaderSubmit" class="btn btn-primary radius userHeaderSubmit" type="button" value="上传"></div>';
        if (!title) {
            title = "图片上传";
        }
        if (bool) {
            var index = layer.open({
                type: 1,
                area: ["300px", "150px"],
                title: title,
                skin: "layui-layer-rim", // 加上边框
                content: html
            });
        } else {
            $(control).html(html);
        }
        $("#upload_image_frame").attr("dialog-identity", index);
        var upload = layui.upload;
        upload.render({
            elem: "#userHeaderImg",
            url: paths + "upload/" + resource,
            bindAction: "#userHeaderSubmit",
            auto: false,
            done: function (res) {
                if (res.code == 0) {
                    layer.msg("上传成功！");
                    $(control).attr("src", serverUrl + res.dataInfo);
                    layer.close(index);
                    if (fn) fn(res.dataInfo);
                } else {
                    layer.close(index);
                    layer.msg("上传异常！code:" + res.code);
                }
            },
            error: function () {
                layer.msg("上传失败！");
            }
        });
    };
}();