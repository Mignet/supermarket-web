var comm = require("modules/common/common");

$("#register").click(function(){
  $(".register").eq(0).hide();
  $(".register").eq(1).show();
  comm.goUrl('../user/register.html');
})