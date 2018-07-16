/**
 * @require style.css
 */

var $ = require("zepto");
var comm = require("modules/common/common");
var service = require('modules/common/service');
var render = require('modules/common/render');
var organizationApi = require('modules/api/organizationApi');

var gaosouyiwomen = {
    init: function() {
        this.getProductList();
    },

    getProductList: function() {
        new render({
            ele: $('.product-list'),
            api: organizationApi.productPageList,
            isList: true,
            data: {
                orgCode: 'OPEN_GAOSOUYI_WEB',
                sort: 1,
                order: 1
            },
            filter: function(arr) {

                return arr.filter(function(obj, index) {
                    if(obj.isFlow == "1"){
                        obj.yearRate = obj.flowMinRate.toFixed(2)
                    }else{
                        obj.yearRate = obj.flowMinRate.toFixed(2) + '~' + obj.flowMaxRate.toFixed(2);
                    }
                    //产品期限
                    var arr = obj.deadLineValueText.split(',');
                    //固定期限
                    if(arr.length == 2){
                        obj.deadLineText = arr[0];
                    }
                    return index < 3;
                });
            },
            callback: function(data) {
                console.log(data);
            }
        })
    }
};

gaosouyiwomen.init();
