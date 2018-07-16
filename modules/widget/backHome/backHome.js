/**
 * @require style.css
 */

var $ = require("zepto");
var comm = require("modules/common/common");

// 初始化
function backHome(){
    this.init();
};

backHome.prototype = {
    template: '<div id="backHome"></div>',

    init: function() {
        $('body').append(this.template);
        this.bindEvent();
    },

    bindEvent: function() {
        $('#backHome').on('click', function(e){
            comm.goUrl('index.html', true);
        });
    }
};

module.exports = backHome;
