$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

window.fbAsyncInit = function () {
  FB.init({
    appId: '463212527196609',
    xfbml: true,
    status: true,
    version: 'v2.5'
  });
  FB.getLoginStatus(response => {
    console.log('response', response);
    if (response.status === 'connected') {
      FB.api('/157166801023320/photos', response => {
        console.log('response', response);

      })
    }
  });

};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);

}(document, 'script', 'facebook-jssdk'));