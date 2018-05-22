$(document).ready(function () {
    var tagManagement = (window['tagManagement'] = {
        init: function () {
            this.getRootTag()
        },
        getRootTag: function () {
            getAjax("tag/list/0", {}, function (reponse) {
                console.log(reponse)
            })
        }
    })
    tagManagement.init()
});