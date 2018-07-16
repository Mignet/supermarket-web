
/**
 * @require style.css
 */
var $ = require("zepto");
var financingApi  = require('modules/api/financingApi');
var comm        = require('modules/common/common');
var Service     = require('modules/common/service');
var ScrollList  = require('modules/common/scrollList');
var Toolbar     = require('modules/widget/toolbar/toolbar');

var investmentStrategy = {
    init:function(){
      this.query = comm.getQueryString();
      this.orgCode = this.query.orgCode;
      this.render();
    },

    render:function(){
      var strategyService = new Service();
       strategyService.api = financingApi.investmentStrategy;
       strategyService.isShowLoading = true;
       strategyService.data={
        orgCode:this.orgCode
      };
     strategyService.success = function(result){
      if(result){
        $("body").append(result.orgInvestStrategy);
      }
     }
      strategyService.send();
    }
};

investmentStrategy.init();
