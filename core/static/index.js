var POLL_INTERVAL = 10000;

function ReceiveMMSController(){
  function showEnvVarUnsetWarning() {
    alert('Please be sure to set your environment variables. Similar to those found in the .env file in the root of this repository.');
  }

  function init() {
    return $.get('/config')
      .then(function(res){
        if (!res.twilioPhoneNumber) {
            return showEnvVarUnsetWarning();
        }

        var phoneNumber = res.twilioPhoneNumber.replace(/(\+\d{1})(\d{3})(\d{3})(\d{4})/, '$1($2)-$3-$4')
        $('.twilio-number').html(phoneNumber);

        pollForIncomingImages();
      })
  }



  function showImages() {
    $.get('/images').then(function(images) {
      $('.image-container').html(images.data.map(function(message) {
        return '<div class="row"><div class="col-md-4"><img width="100%" src="' + message.media_url + '"/><div>' + message.content + '</div></div>';       
      }).join(''));
    });
  }

  function pollForIncomingImages() {
    setInterval(showImages, POLL_INTERVAL);
  }

  return {
    init: init,
  }
}

$(document).ready(function(){
  var receiveMMSController = ReceiveMMSController();
  receiveMMSController.init();
});
