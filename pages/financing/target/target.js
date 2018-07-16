/**
 * @require style.css
 */
var $ = require("zepto");
var comm = require('modules/common/common');
var ScrollList = require('modules/common/scrollList');
var financingApi = require('modules/api/financingApi');
var service 	= require('modules/common/service');
var FinacingList = require('modules/widget/finacingList/finacingList');
$("#productList").html(FinacingList.template);

var newTarget = {
    init: function () {
        this.sort = 1;
        this.order = 1;
        this.search = comm.getQueryString();
        this.cateId = parseInt(this.search.cateId) || 1;
        document.title = sessionStorage.getItem("financingTitle");
        this.renderProductList();
        this.bindEvent();
    },

    bindEvent: function () {
        var self = this;

        // 回到顶部点击
        $('.toolbar-top').on('click', function () {
            $('body').scrollTop(0);
        })

        /*回到顶部图标显示*/
        $(document).scroll(comm.throttle(function(){
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if(scrollTop>=900){
                $('.toolbar-top').show();
            }else{
                $('.toolbar-top').hide();
            }
        }, 500));
    },

    renderBanner: function() {
        if( this.cateId === 801 && !comm.getCookie("__token__") ) {
            comm.goUrl('/pages/user/login.html');
        }
        var newTargetService = new service();
        newTargetService.api=financingApi.productClassifyStatistics;
        newTargetService.isNeedToken = this.cateId === 801;
        newTargetService.data={
            cateIdList: this.cateId
        };
        newTargetService.success=function(response){
            // response.datas[0].cateLoge = '77a6c87e6911edb205f7d33d7b776e88';
            // response.datas[0].content = 'http://toobei.tophlc.com/pages/activities/scratch.html';
            $('#header a').attr('href', response.datas[0].content);
            $('#header img').attr('src', comm.getServerImg(response.datas[0].cateLoge)).show();
        };
        newTargetService.send();
    },

    renderProductList: function () {
        new FinacingList({
            ele: $("#productList"),
            api: financingApi.productClassifyPagelist,
            isNeedToken: true,
            data: {
                sort: this.sort,
                order: this.order,
                cateId: this.cateId
            },
            dataFilter: this._filter,
            callback: function (data, result) {
                $(".listEmpty").html("哎呀,"+document.title+"卖完了~<br/>您可以看下其他类型的产品哦。");
            }
        });
    },

    _filter: function (arr) {
        arr.forEach(function (obj, index) {

        });

        return arr;
    }
};

newTarget.init();