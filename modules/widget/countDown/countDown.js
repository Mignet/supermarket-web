var $ = require("zepto");

function countDown(options) {
    for(var i in countDown.elms ) {
        if( countDown.elms[i] === $(options.elm)[0] ) {
            alert('请不要重复设置定时器');
            return ;
        }
    }
    countDown.elms.push($(options.elm)[0]);
    for( key in options ){
        this[key] = options[key];
    }
    this.init();
}

countDown.elms = [];

countDown.prototype = {

    elm: '',

    time: '',

    hour: 0,

    minute: 0,

    second: 0,

    timer: null,

    init: function() {
        this.setData();
        this.start();
    },

    setData: function() {
        var t = this.time.split(':');
        this.hour = parseInt(t[0]);
        this.minute = parseInt(t[1]);
        this.second = parseInt(t[2]);
    },

    start: function() {
        var self = this;

        this.timer = setInterval(function(){
            if( self.check() ) {
                $(self.elm).text(self.hour + ':' + self.minute + ':' + self.second);
                console.log('true', self.hour + ':' + self.minute + ':' + self.second);
            } else {
                console.log('false');
                clearInterval(self.timer);
            }
        }, 1000);
    },

    check: function() {
        // console.log(this.hour + ':' + this.minute + ':' + this.second);
        if( this.hour || this.minute || this.second ) {
            if( this.second > 0 ) {
                this.second --;
            } else {
                this.second = 59;
                if( this.minute > 0 ) {
                    this.minute --;
                } else {
                    this.minute = 59;
                    this.hour --;
                }
            }
            return true;
        } else {
            console.log('倒计时结束', this);
            this.callBack();
            return false;
        }
    },

    callBack: function() {
        console.log(this,'回调');
    }
}

module.exports = countDown;