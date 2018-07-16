 var comm      = require("modules/common/common");

document.getElementById('register').onclick = function() {
  $(".register").hide();
  $(".register_press").show();
  comm.goUrl('../user/register.html');
}