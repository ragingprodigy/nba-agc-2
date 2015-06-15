/**
 * Created by oladapo on 6/12/15.
 */
'use strict';

var mandrill = require('mandrill-api');
var RegistrationMailError = require('../../api/registration/registration.mail.error.model');
var RegistrationMail = require('../../api/registration/registration.mail.model');

var request = require('request');

var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
var message = {
    "html": '',
    "subject": '',
    "from_email": 'registrations@nba-agc.org',
    "from_name": 'NBA AGC 2015',
    "to": [{
        "email": '',
        "type": 'to'
    }],
    "headers": {
        "Reply-To": 'registrations@nba-agc.org'
    },
    "important": true,
    "track_opens": true,
    "track_clicks": true,
    "view_content_link": true,
    "tags": [
        'account-creation'
    ],
    "subaccount": 'nba-agc',
    "metadata": {
        "website": 'www.nba-agc.org'
    }
};

var sendMessage = function(message, callback) {
    mandrill_client.messages.send({"message": message}, function(result) {

        callback(result);

    });
};

exports.sendRegistrationText = function(registration, next) {
    var message = 'Congratulations '+ registration.firstName +', your registration has been received ('+ registration.email +')!';

    request('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+process.env.SMS_OWNER_EMAIL+'&subacct='+process.env.SMS_SUB_ACCOUNT+'&subacctpwd='+process.env.SMS_SUB_ACCOUNT_PASSWORD+'&message='+message+'&sender='+process.env.SMS_SENDER+'&sendto='+registration.mobile+'&msgtype='+process.env.SMS_MSG_TYPE, function(error, resp, body) {

        if (!error && resp.statusCode === 200) {
          next(null, body);
        } else {
          console.log(error);
          next(error);
        }

    });
};

exports.sendWelcomeMail = function(email, password, next) {
    var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;">    <div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="http://www.nigerianbar.org.ng/images/logo12.png"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2015</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"><b>Dear Registrant</b></td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Thank you for your interest to be part of the NBA Annual General Conference 2015 <b>"Rebuilding a Nation"</b> in <b>Abuja</b> from <b>21 – 28 August, 2015</b>.<br><br>You can now access your Conference Account online here: <a href="https://nba-agc.org/myaccount" style="color: green;">www.nba-agc.org/myaccount</a> using the login details below to access your account:<br><br>Email: <b>{{email}}</b><br>Password: <b>{{password}}</b><br><br></td></tr><tr><td height="20"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Through your account you can print your payment receipt, preview the conference guide and programme, and much more.</td></tr><tr><td height="50"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:25px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#000000;padding-right:10px; text-align: center;"><span style="background: green; padding: 10px; border-radius: 5px;"><a href="https://nba-agc.org/" style="color:#FFFFFF; text-decoration:none;">Go To Conference Portal</a></span></td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">For further details and enquiries, please call any of the following – Chinelo Agbala, <b>08067200353</b>; Oti Edah, <b>08065901348</b>; Kemi Beatrice Odeniyi, <b>08068619570</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Support, Enquiries and Conference Information </span>  Send emails to: support@nba-agc.org, enquiries@nba-agc.org and registrations@nba-agc.org</td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    var newMessage = message;
    newMessage.html = emailData.replace('{{password}}', password).replace('{{email}}', email);
    newMessage.subject = 'Your Login Details for NBA AGC Registration Portal';
    newMessage.to[0].email = email;

    sendMessage(newMessage, function(result){

        var _rm = {
            "email": result[0].email,
            "status": result[0].status,
            "reject_reason": result[0].reject_reason,
            "id": result[0]._id
        };

        RegistrationMail.create(_rm, function(err, rm) {
            if(err) { return next(err); }

            return next(null);
        });

    }, function(e) {

        RegistrationMailError.create(e, function(err, rme) {
            if(err) { return next(err); }

            return next(null);
        });
    });
};