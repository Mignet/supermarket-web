/**
 * @require style.css
 */

var $ = require("zepto");
var actApi = require('modules/api/actApi');
var comm = require("modules/common/common");
var service = require('modules/common/service');

var turning = {
    init : function() {
        this.baseNum = 56;
        this.baseSpeed = 30;
        this.canClick = true;
        this.getAllPrice();
        this.bindEvent();
    },

    bindEvent: function() {
        var self = this;


        $('#btn-know').on('click', function(){
           $('.pop-price').hide();
            $('.price-info').hide();
            $('.mask').hide();
        });

        $('.cancel').on('click', function() {
            $('.pop-price').hide();
            $('.price-info').hide();
            $('.mask').hide();
        });

        $('.cancel-2').on('click', function() {
            $('.pop-times').hide();
            $('.pop-choose-times').hide();
            $('.no-my-price').hide();
            self.setCanScroll(true);
        });

        $('.cancel-3').on('click', function() {
            $('.pop-my-price').hide();
            self.setCanScroll(true);
        })

        $('.start').on('click', function() {
            self.judgeState();
        });

        $('.btn-invest').on('click', function() {
           comm.goUrl('../organization/organization.html');
        });

        $('.choose-one').on('click', function() {
            $('.pop-choose-times').hide();
            self.oneTimes();
        });

        $('.choose-ten').on('click', function() {
            $('.pop-choose-times').hide();
            self.tenTimes();
        });

        $('.btn-my-price').on('click', function() {
            self.getMyPrice();
            self.setCanScroll(false);
        })
    },

    setCanScroll: function(flag) {
        if( flag ) {
            $('body').css({
                'height': 'auto',
                'overflow': 'auto'
            });
        } else {
            $('body').css({
                'height': '100%',
                'overflow': 'hidden'
            });
        }
    },

    judgeState: function() {
        var self = this;
        if( !comm.getCookie('__token__') ) {
            comm.goUrl('../user/login.html');
            return ;
        }
        if( !this.canClick ) {
            comm.alert('正在抽奖，请耐心等待结果');
            return ;
        }
        this.getTimes(function(times){
            if( times == 0 ) {
                $('.pop-times').show();
            } else if ( times < 10 ) {
                self.oneTimes();
            } else {
                $('.pop-choose-times').show();
                $('#choose-times-count').text(times);
            }
        })
    },

    turnTimes: function(num, speed, callback) {
        var step = 0;
        var timer = null;
        var imgList = $('.img-list > .mask');
        function turn() {
            if ( num == 0 ) {
                clearTimeout(timer);
                callback.call(callback);
                return ;
            }

            //减速
            if( num < 11 ) {
                speed += 50;
            }

            //隐藏前一个
            var preStep = step - 1;
            preStep = preStep >= 0 ? preStep : preStep + 7;
            imgList.eq(preStep).hide();

            //显示当前
            imgList.eq(step).show();
            // console.log(preStep, step);

            step = (step + 1) % imgList.length;

            timer = setTimeout(function(){
                turn();
            }, speed);

            -- num;
        }
        turn();
    },

    oneTimes: function() {
        this.canClick = false;
        var self = this;
        var Service = new service();
        Service.api = actApi.one;
        Service.isShowLoading = false;
        Service.success = function (result) {
            self.showPriceByNum(result.prizeId, result.leftTimes);
        }
        Service.send();
    },

    tenTimes: function() {
        var self = this;
        var Service = new service();
        Service.api = actApi.ten;
        Service.isShowLoading = false;
        Service.success = function (result) {
            self.showPriceByNum(result.prizeId, result.leftTimes);
        }
        Service.send();
    },

    getMyPrice: function() {
        var Service = new service();
        Service.api = actApi.user;
        Service.isShowLoading = false;
        Service.success = function (result) {
            if( result.datas.length > 0 ) {
                $('.price-list').html(result.datas.map(function(obj){
                    return '<li><div class="text-left">' + obj.crtTime + '</div><div class="text-right">' + obj.orderDesc + '</div></li>';
                }).join(''));
                $('.pop-my-price').show();
            } else{
                $('.no-my-price').show();
            }
        }
        Service.send();

        // new ScrollList({
        //     ele : $('.price-list'),
        //     api : actApi.user,
        //     isNeedToken: true,
        //     callback:function(data, result){
        //         if( result.datas.length > 0 ) {
        //             $('.price-list').html(result.datas.map(function(obj){
        //                 return '<li><div class="text-left">' + obj.crtTime + '</div><div class="text-right">' + obj.orderDesc + '</div></li>';
        //             }).join(''));
        //             $('.pop-my-price').show();
        //         } else{
        //             $('.no-my-price').show();
        //         }
        //     }
        // });
    },

    getAllPrice: function() {
        var self = this;
        var Service = new service();
        Service.api = actApi.all;
        Service.isNeedToken = false;
        Service.isShowLoading = false;
        Service.success = function (result) {
            $('.all-price').html('<div>' + result.datas.map(function(obj){
                return '<p>' + obj.mobile + '　刚刚抽中' + obj.orderDesc + '</p>';
            }).join('') + '</div>');
            if( result.datas.length > 4 ) {
                self.rolling();
            }
        }
        Service.send();
    },

    getTimes: function(callback) {
        var Service = new service();
        Service.api = actApi.times;
        Service.isShowLoading = false;
        Service.success = function (result) {
            callback.call(callback, result.leftTimes);
            console.log('times', result);
        }
        Service.send();
    },

    showPriceByNum: function(num, times) {
        var self = this;
        var priceMap = {
            1: 5,
            2: 3,
            3: 2,
            4: 7,
            5: 4,
            8888: 1
        };
        this.turnTimes(this.baseNum + priceMap[num], this.baseSpeed, function(){
            self.canClick = true;
            $('.pop-price').show();
            $('.price-' + num).show();
            $('#times').text(times);
        });

    },

    rolling: function() {
            var noticeTimer = setInterval(function(){
                $('.all-price').children().animate({marginTop:'-0.99rem'},1000,function(){
                    for(var i = 0; i < 4; i ++) {
                        $(this).children().first().appendTo($(this));
                    }
                    $(this).css('margin-top',0);
                })
            },4000)
    }

};
turning.init();
