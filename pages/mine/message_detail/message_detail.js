var $ = require("zepto");

var service = require('modules/common/service');
var mineApi = require('modules/api/mineApi');
var comm = require("modules/common/common");

var md = {
    init: function() {
        this.query = comm.getQueryString();
        this.renderMessage();
    },

    renderMessage: function() {
        var messageDetail = new service();
        messageDetail.api = mineApi.noticeDetail;
        messageDetail.data = {
            msgId: this.query.msgId
        }
        messageDetail.success = function (result) {
            $(".title").text(result.title);
            $('.article').html(result.content);
        };
        messageDetail.send();
    }
};

md.init();





