var page = require('webpage').create();
const fs = require('fs');

var auth_data = fs.read('./intranet_directory/auth.json');
var auth = JSON.parse(auth_data);

page.open('https://intranet.unitbv.ro/autentificare', function (status) {
  page.evaluate(function (auth) {
    document.querySelector("input[id='dnn_ctr2093_Login_Login_LDAP UNITBV_lgAGSISPortalLogin_UserName']").value = auth.email;
    document.querySelector("input[id='dnn_ctr2093_Login_Login_LDAP UNITBV_lgAGSISPortalLogin_Password']").value = auth.password;
    WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions('dnn$ctr2093$Login$Login_LDAP UNITBV$lgAGSISPortalLogin$LoginButton', '', true, 'ctl00$lgAGSISPortalLogin', '', false, true));
    console.log('Login submitted!');
  }, auth);

  window.setTimeout(function () {
    page.render('intranet_directory/login.png');
    page.open('https://intranet.unitbv.ro/Intranet/Meniu-cantina', function (status_meniu) {
      window.setTimeout(function () {
        page.render('intranet_directory/meniu.png');
        fs.write('intranet_directory/meniu.html', page.content, 'w');
        phantom.exit();
      }, 3000);
    });
  }, 3000);
});
