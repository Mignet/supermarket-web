/**
 * @require style.css
 */
var $ = require("zepto");
var comm = require('modules/common/common');
var ScrollList = require('modules/common/scrollList');
var financingApi = require('modules/api/financingApi');
var FinacingList = require('modules/widget/finacingList/finacingList');
$("#productList").html(FinacingList.template);

var financing = {
    init: function () {
        this.sort = 1;
        this.order = 1;
        this.query = comm.getQueryString();
        this.cateId =  parseInt(this.query.cateId);
        this.financingTitle = sessionStorage.getItem('financingTitle');
        document.title = this.financingTitle;
        this.bindEvent();
        this.renderProductList();
    },

    bindEvent: function () {
        var self = this;
        $('.tab li').on('click', function () {
            $('.tab li').removeClass('selected');
            $(this).addClass('selected');
            $(this).siblings().removeClass('des').removeClass('asc');
            var span = $(this).find('span.default');
            if (span.hasClass('des')) {
                self.order = 0;
                self.sort = $(this).data('value');
                span.removeClass('des').addClass('asc');
            } else {
                self.order = 1;
                self.sort = $(this).data('value');
                span.removeClass('asc').addClass('des');
            }
            if (self.sort == "1") {
                self.order = 1;
            }
            $("#productList").html(FinacingList.template);
            self.sort = $(this).data('value');
            self.renderProductList();
        })

        //回到顶部
        comm.backTop();
    },

    renderProductList: function () {
        var self = this;

        new FinacingList({
            ele: $("#productList"),
            api: this.cateId == 802 ? financingApi.hotRecommendProductListTop201 : financingApi.productClassifyPagelist201,
            isNeedToken: this.cateId == 802 ? false : true ,
            data: {
                sort: this.sort,
                order: this.order,
                cateId: parseInt(this.query.cateId)
            },
            dataFilter: this._filter,
            callback: function (data, result) {
                //理财师热推
                if( self.cateId == 802 ) {
                    $('.tab').hide();
                    $('.financing-product').addClass('hot');
                    $('#productList .orgName').each(function(index, obj){
                        $(obj).prepend('<span class="pro-rank-back"><span class="pro-rank">' + (index+1) + '</span></span>');
                    })
                }
                //修改无数据文案
                $(".listEmpty").html("哎呀,"+self.financingTitle+"卖完了~<br/>您可以看下其他类型的产品哦。");
            }
        });
    },

    _filter: function (arr) {
        arr.forEach(function (obj, index) {

        });
        return arr;
    }
};

financing.init();