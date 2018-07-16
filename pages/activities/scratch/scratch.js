/**
 * @require style.css  
 */
 var comm 		 = require("modules/common/common");
 var Service 	 = require('modules/common/service');
 var Marquee     = require('marquee');
 var WScratchPad = require('wScratchPad');

 var scratch = {
 	init: function() {
 		this.enabled = true;
 		this.startMarquee();
 		this.judgeUser();
 		this.bindEvent();
 		this.buildScratchPad('#scratch-pad');

 	},

 	startMarquee: function() {
 		var marqueeService = new Service();
 		marqueeService.api = 'activity/scratch/records';
 		// marqueeService.isNeedToken = true;
 		marqueeService.success = function(result) {
 			console.log(result);
 			// result = {"hasRecord":true,"winningRecords":[{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"}]};
 			if( result.winningRecords.length  > 0 ) {
 			var str = "";
 			for(var i = 0; i < result.winningRecords.length; i ++) {
 				str += '<li class="clearfix">';
 				str	+= '<div class="marquee-col">投资人' + result.winningRecords[i].mobile;
 				str	+= '</div><div class="marquee-col">刮中 <span class="money-color">' + result.winningRecords[i].winningAmt;
 				str	+= '元</span></div><div class="marquee-col">' + result.winningRecords[i].winningTime.substring(0, 10);
 				str	+= '</div></li>';
 			}

 			str += '<li class="clearfix">';
 				str	+= '<div class="marquee-col">投资人' + result.winningRecords[0].mobile;
 				str	+= '</div><div class="marquee-col">刮中 <span class="money-color">' + result.winningRecords[0].winningAmt;
 				str	+= '元</span></div><div class="marquee-col">' + result.winningRecords[0].winningTime.substring(0, 10);
 				str	+= '</div></li>';

 			$('#marquee-view').html(str);

 			new Marquee({
 				dom 	: document.getElementById('marquee-view'),
 				height 	: 25,
 				speed 	: 50,
 				inter 	: 4000,
 				count 	: result.winningRecords.length
 			});
 			} else {
 				$('#marquee-view').hide();
 			}

 		}
 		marqueeService.send();
 	},

 	judgeUser: function() {
 		var self = this;

 		if( !comm.getCookie("__token__") ) {
 			this.showNoLogin();
 			return ;
 		}

 		var scratchService = new Service();
 		scratchService.api = 'activity/scratch/detail';
 		scratchService.isNeedToken = true;
 		scratchService.success = function(result){
 			console.log(result);
			// result = {
			// 		"availableScratchTime": 1,
			// 		"nextScratchMoney": 588,
			// 		"totalScratchTime": 3
			// 		};
			switch( result.totalScratchTime ) {
				case 0:
				case 1: {
					self.showNoInvest();
					break;
				}
				case 2: {
					if( result.availableScratchTime > 0 ) {
						$('.scratch-light .scratch-text').text('您拥有' + result.availableScratchTime + '次刮奖机会');	
						self.setMoney(result.nextScratchMoney);
						self.showScratch();
					} else {
						self.showTwoInvest();
					}
					break;
				}
				case 3: {
					if( result.availableScratchTime > 0 ) {
						$('.scratch-light .scratch-text').text('您拥有' + result.availableScratchTime + '次刮奖机会');	
						self.setMoney(result.nextScratchMoney);
						self.showScratch();
					} else {
						self.showNoChance();
					}
					break;
				}
			}
		}
		scratchService.onError = function(msg) {
			console.log(msg);
		}
		scratchService.send();
	},

	showNoLogin: function() {
		$('.scratch-light').hide();
		$('.scratch-dark').show().find('.scratch-box').hide();
		$('.no-login').show();
	},

	showNoInvest: function() {
		$('.scratch-light').hide();
		$('.scratch-dark').show().find('.scratch-box').hide();
		$('.no-invest').show();
	},

	showTwoInvest: function() {
		$('.scratch-light').hide();
		$('.scratch-dark').show().find('.scratch-box').hide();
		$('.two-invest').show();
	},

	showNoChance: function() {
		$('.scratch-light').hide();
		$('.scratch-dark').show().find('.scratch-box').hide();
		$('.no-chance').show();
	},

	showScratch: function() {
		$('.scratch-dark').hide();
		$('.scratch-light').show();
	},

	setMoney: function(money) {
		$('.scratch-back-text').text(money + '元现金奖励');
		$('.pop-text-red').text(money + '元');
		$('.pocket-money').text(money + '元');
	},

	showPop: function() {
		$('.pop-window').show();
	},

	bindEvent: function() {
		var self = this;

		$('.pop-know').on('click', function(){
			$('.pop-window').hide();
			//重置刮刮乐
			self.enabled = true;
			$('#scratch-pad').wScratchPad('reset');
			self.judgeUser();
		});

		$('.login-img').on('click', function(){
			comm.goUrl('../user/login.html');
		});

		$('.invest-img').on('click', function(){
			comm.goUrl('../financing/manageMoney.html');
		});
	},

	scratchComplete: function() {
		
		var self = this;
		var completeService = new Service();
 		completeService.api = 'activity/scratch/winning';
 		completeService.isNeedToken = true;
 		completeService.success = function(result) {
 			self.showPop();
 		}
 		completeService.send();
	},

	buildScratchPad: function(id) {
		var self = this;
		$(id).wScratchPad({
			bg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbQAAACWCAMAAACB+Y39AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAALTUExURQAAAO0cVe0cVfA+bu0cVe0cVe0cVe0cVfA+bu0cVfA+bu0cVe0cVfA+bu0cVe0cVfA+bvA+bu0cVe0cVe4jWu0cVe0cVe0cVe0cVe0cVfA+bu0cVe0cVfA+bu0cVe0cVe0cVe0cVe0cVe0cVe0cVe0cVe0cVe0cVe0cVe0cVe0cVfA+bvA+bu0cVe0cVe0cVe0cVe0cVfA+bu0cVe0cVe0cVe0cVe0cVe0cVe0cVe0cVe0cVe0cVfA+bvA+bu0cVfA+bu0cVfA+bvA+bvA+bu4qX+0cVfA+bvA5au0cVe0eV+4jWu0cVe80Z/A+bu0cVfA+bu4jWu0cVe0cVe84au0cVfA+bu4tYe0cVe4iWe0cVe0cVe0cVfA6a+4iWu0fV/A+bvA+bu81aO4lXO0cVe0cVe0cVe0cVe0cVfA+bu0cVfA+bu8wZPA+bu8wZPA+bu0fV/A+bvA+bvA+bvA+bu0cVfA9bfA+bvA+bu4tYfA+bvA+bvA+bvA+bvA+bvA+bvA+bu4qX/A+bvA9bfA+bvA+bvA+bvA+bvA+bvA+bu0cVfA+bu4tYfA+bvA+bu0cVe0cVe0cVe0cVfA+bu0cVe0cVe0cVe0cVfA+bu0cVe0cVe8vY/A+bu0cVfA+bvA+bu4oXu82aPA+bvA+bu4nXe0eV+0cVe8zZu4sYfA+bu0eVvA+bvA+bvA+bvA+bvA+bu8uYu0cVe0cVe0cVe0dVu4oXu0cVe8vY+82aPA+bu0dVu83ae0dVe8zZu4oXu0cVe0eV+0cVe0cVfA+bu4jWu8wZPA9be80Z+0dVu0fV+4qX+4pX/A5au4sYfA8bfA7a+0eV+4oXu4iWfA6a+81aO4kW+4tYe8yZe8tYu4iWu83ae0eVvA7bO0iWe0hWe0dVe4nXe0gWPA9bu8uYu82aO8vY+8zZvA5a+4lXO84ae4pXu4lW+84au0hWO4mXPA8bO4rYIoQmJ8AAADCdFJOUwB+BOSbKvsDlgEgJicB0zIsTmUb8bO3JAorPzmg+vXg8Oqo/SX8scncc1sLHkJWglUIjXKirCHCHAZfKdhFOUH5YiT9a0rH5jZn8jk3QLtw/q1Q2o5R3gGt0VnO3jY58jd7lwi6aF7buXDrYoPGhE1f90pqafezj/X+MCGKJkDR647HPPYN31qXKM+cMLg8NUPu1MNhNO9/tAX0jvTDCB92uxXOiyzG5PUiRXaieDLqQAvmDXvfnPYLo7jqeBZGH84iAscD0AAABwRJREFUeNrtnYVXG1kUhy/Fq1B3d3f3dt3d3d1duu7u7u7u+obQEEhxWqDdUmd9/4SdyWQeA7EJ3fP2Xeb3zukphZvb78zvkMyTLyGRbJQU/V5UIsRu16ht1OGxKfHPiwLVhjXKAkW7VaO2kR+wae0v8Qs2rTVaRoIiLzVqG/kDm4zi0ngVpcWGe8Qt8lKjtpFPsMn8UxdbscFoO+raVaO2kV+wrdCMUEyqLQXrAjvtL0LtqFHbyDfYkdCKq1pXVLX8Jm5vFDXR39mqtGvUNvIPNj36nPXS17qN61VxmxAbndfHtGvUNvIL9jPPE73w7nLDaHWbWeR6+qwUW+TXRWnWqG3kE+zlL80gaxSuMgLuNgHzZ+XhktA68+968ZesD6RZo7aRP7BXFVJ0vGdUu9uUWXM8M+gt5i9lUIRlm+o0a9Q28gf2105mtMQwXMsnFZHHbN2wWYjK7UKsb6gMRPuUpFWjtpFPsH+Qob3d6hm0PvqgBnNiHhTiz2CoLOZp1kuN2kY+wf5ZhvaBYdS2tKmVE3NrshDc9ndZKHrzUptWjdpGPsHuIUN733oJjL1V+bV0c6MQO5qDlX/Y36hPq0ZtI59gf+dk9sqHhlHhWv2PVqwP/tawU4jGcLnzmIq0atQ28gn2t9/bmb34qnlr4r6fqY4ul2wsD5sPDDrTvVZFXmrUNvIJ9k8/mpGdd+9t8WYOdrBNNTtcS5WBNGvUNvIL9pdfrKAkc/TyXWa4FaJka5I5erIatY18hE0pVsOMcFNNqtUw458ENZ6KvPxn/11RB8AON8Vd5d9UbMSONkVeatQ28g92yv00OULtqFHbyDfYCXau6zzspXqpUdvIL9hkz8RTnloItbNGbSOfYFNNlYfzQQmKvNSobeQPbNr/oOMTnLKrDeyy9wgCtQlP4nmpUduow2Mfec7J5vR6xtFJzrM2ezjz2uzl8KzCRh0a+5DT7HWs/ocJDCbjrP7OivE+uBhcxhlya2YALgaXMUCGNhoXg8sYLUM7FBeDyzhChna26wYG+pfW2Kc7mU2IfgP6FwPsCZHIsgfHmZTDWtMWe3A20fAEy1+w1rTFHu7ou9C/GGFHQ4P+xQnbDg36FytsOzToX6ywI6FB/+KFHQkN+hcvbBo5DPoXL+xhI4nyJ+4L/YsP9kkT8yNrIicOgf7FBXvIfs7iYx70Ly7YeXKVfyD0Ly7YA2VonaF/ccHuLEM7AfoXF+y9ZWjnQ//ign2hk1m/3tC/uGD37mdn1mO8htYWrLUEReOt9zfI6DsK+hcn7FF9M2L306B/aY/t7FxD/2KETYkOJMBa0xeb4h/9gbWmM7b7ffmhfzHBprbHWX2uf7HAJoHBblCvqeNwFTiNcdN7mdPr3CxcCT4jK9dex8o9DteCy7gn11kxPjPxiyCkJr2wL5ZbM13j/hxSk4bYd8vQuqSa2EFq0gX7BhnasamXUCA16YF9p5PZUXvGVEBq0hT7lm52Zt1mQmrigz3TSm3SkgMhNXHCfvmdj1O9HS6kJg2xCVITP2yC1MQPmyA18cMmSE38sAlSEz9sgtTED5sOvwBSEy/sN541p9c3ZkJq4oP95jJ7HavgakhNXLDfet1ZMb4eUhMX7Nfk1sxSSE1csJfK0K7DR3FxwW7Rd2+F1MQF+wEZ2s1JdnggNWmFfZWT2X1XxOyTQmrSFPuSa+3M9jjXw6kFSE2aYN90qRnZqcd4OB8EqUkj7DV3JREwIDXpik0pzrxCatIQG6oTw4HQEBoGQsOIH9oYXANuYwzlDhrb6uYEH8WlOfbYQRGvcFr0n9C/GGBPi6495s+LmZTjo7g0xZ6X76wYTxfQv5hgT3WboNC/eGB3kaEtgv7FBXuRDO0x6F9csFc4mS3oDv2LC/YjC+zMOs2G/sUHe/bT1nuILOwO/YsTdveFXSNrj9C/eGFboUH/YoZthQb9ixm2FRr0L2bYJKB/scO2QoP+xQw7cvcI/YsXNs2akwP9ixN2zpxZ5vQ6ezH0Lz7Yi7Ptdaz5D+OjuLhYa0/Md1aMM6B/ccF+Um7NPA79iwv2gzK0udC/uGDPlaEtE9C/mGA/JEPLijn6g4/i0hQ7y8lsSk50wQv6l/bYOVPsjeueQ93HWaF/6Y09tGcnoj4jBAarMaIPrBmGA6EhNIz/PzRITVpiJwkNUpOu2ASpiR82ZUJq4oadSTQ575rYCkhNumIfnDc5siZyOaQmPtiXOYuPV0Jq4oL9lFzlvwhSExfsQhnaSkhNXLBXytAKIDVxwS6Qoa2G1MQFe7WT2aQ7IDVxwf78Kzuz2++H1MQH+5tPzcgOOGUvSE2csD/57COC1MQPmyA18cMmSE38sAlSEz9sgtTED5s6vh3U0bDDTQSpiR82QWrih02QmvhhE6Qmftj/ArUzWBZhfeFpAAAAAElFTkSuQmCC',
			fg: 'data:image/png;base64,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',
			scratchMove: function (e, percent) {
				console.log(percent);
				if (percent > 40) {
					if( !self.enabled ) return ;
					self.enabled = false;
					this.clear();
					self.scratchComplete();

				}
			}
		});
	}
};




scratch.init();