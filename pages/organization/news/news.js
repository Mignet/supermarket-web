var $ = require("zepto");
var organizationApi = require('modules/api/organizationApi');
var comm = require('modules/common/common');
var Service = require('modules/common/service');

var organizationNews = {
    init: function() {
        this.getNews();
    },

    getNews: function() {
        var query = comm.getQueryString();
        var orgServer = new Service();
        orgServer.api = organizationApi.queryOrgDynamicInfo;
        orgServer.data = {orgDynamicId: query.id};
        orgServer.success = function(result) {
            $('h1').text(result.orgTitle);
            $('.content').html(result.orgContent);
        }
        orgServer.send();
    }
};

organizationNews.init();