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

exports.sendBankRegistrationSuccessText = function(registration, next) {
    var message = 'Dear '+ registration.firstName +', your NBA AGC 2015 registration has been confirmed! Your registration code is: '+registration.regCode+'-'+registration.conferenceFee;

    request('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+process.env.SMS_OWNER_EMAIL+'&subacct='+process.env.SMS_SUB_ACCOUNT+'&subacctpwd='+process.env.SMS_SUB_ACCOUNT_PASSWORD+'&message='+message+'&sender='+process.env.SMS_SENDER+'&sendto='+registration.mobile+'&msgtype='+process.env.SMS_MSG_TYPE, function(error, resp, body) {

        if (!error && resp.statusCode === 200) {
            var Registration = registration.constructor;
            // Update the Registration to show that the Success Text Has been sent
            Registration.update({_id: registration._id}, { $set: { successTextSent: true} }, function(){
                if (next) { return next(null, body); }
            });

        } else {
            console.log('SMS Error: ', error);
            if (next) { next(error); }
        }

    });
};

exports.sendWebPaySuccessText = function(registration, next) {
    var message = 'Dear '+ registration.firstName +', your NBA AGC 2015 registration has been confirmed following receipt of your payment! Your registration code is: '+registration.regCode+'-'+registration.conferenceFee;

    request('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+process.env.SMS_OWNER_EMAIL+'&subacct='+process.env.SMS_SUB_ACCOUNT+'&subacctpwd='+process.env.SMS_SUB_ACCOUNT_PASSWORD+'&message='+message+'&sender='+process.env.SMS_SENDER+'&sendto='+registration.mobile+'&msgtype='+process.env.SMS_MSG_TYPE, function(error, resp, body) {

        if (!error && resp.statusCode === 200) {
            var Registration = registration.constructor;
            // Update the Registration to show that the Success Text Has been sent
            Registration.update({_id: registration._id}, { $set: { successTextSent: true} }, function(){
                if (next) { return next(null, body); }
            });

        } else {
            console.log('SMS Error: ', error);
            if (next) { next(error); }
        }

    });
};

exports.sendWebPaySuccessMail = function(registration, next) {
    var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;"><div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="http://www.nigerianbar.org.ng/images/logo12.png"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2015</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"><b>Dear Registrant</b></td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Your registration for the NBA Annual General Conference 2015 <b>"Lawyers and National Development"</b> in <b>Abuja</b> from <b>21 - 28 August, 2015</b> has been <b style="color:green;">CONFIRMED</b> following the receipt of your payment.<br><br>Please find below your payment information:<br><br>Registration Code: <b>{{code}}</b><br>Conference Fee: <b>NGN {{fee}}</b><br>Amount Paid: <b>NGN {{amount}}</b><br>Payment reference: <b>{{ref}}</b><br>Transaction Reference: <b>{{txnRef}}</b><br></td></tr><tr><td height="20"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Additional information regarding the Annual General Conference would be sent to you from time to time.</td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">For further details and enquiries, please call any of the following - Ayodeji Oni - <b>0803 345 2825</b>; Oti Edah, <b>0806 590 1348</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Support, Enquiries and Conference Information </span>  Send emails to: support@nba-agc.org, enquiries@nba-agc.org and registration@nba-agc.org</td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    var newMessage = message;
    newMessage.html = emailData.replace('{{code}}', (registration.regCode+'-'+registration.conferenceFee)).replace('{{fee}}', registration.conferenceFee).replace('{{amount}}', registration.Amount).replace('{{ref}}', registration.PaymentRef).replace('{{txnRef}}', registration.TransactionRef);
    
    if (registration.firstName!==undefined) { newMessage.html = newMessage.html.replace('Registrant', registration.firstName); }

    newMessage.subject = 'Registration for NBA AGC Confirmed!';
    newMessage.to[0].email = registration.email;

    sendMessage(newMessage, function(result){

        var Registration = registration.constructor;
            // Update the Registration to show that the Success Mail Has been sent
            Registration.update({_id: registration._id}, { $set: { successMailSent: true} }, function(){
                if (next) { return next(); }
            });

    });
};

exports.sendBankRegistrationSuccessMail = function(registration, next) {
    var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;"><div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="http://www.nigerianbar.org.ng/images/logo12.png"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2015</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"><b>Dear Registrant</b></td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Your registration for the NBA Annual General Conference 2015 <b>"Lawyers and National Development"</b> in <b>Abuja</b> from <b>21 - 28 August, 2015</b> has been <b style="color:green;">CONFIRMED</b>.<br><br>Please find below your payment information:<br><br>Registration Code: <b>{{code}}</b><br>Amount Paid: <b>NGN {{amount}}</b><br>Payment reference: <b>{{ref}}</b><br></td></tr><tr><td height="20"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Additional information regarding the Annual General Conference would be sent to you from time to time.</td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">For further details and enquiries, please call any of the following - Ayodeji Oni - <b>0803 345 2825</b>; Oti Edah, <b>0806 590 1348</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Support, Enquiries and Conference Information </span>  Send emails to: support@nba-agc.org, enquiries@nba-agc.org and registration@nba-agc.org</td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    var newMessage = message;
    newMessage.html = emailData.replace('{{code}}', (registration.regCode+'-'+registration.conferenceFee)).replace('{{amount}}', registration.conferenceFee).replace('{{ref}}', registration.bankTeller);
    
    if (registration.firstName!==undefined) { newMessage.html = newMessage.html.replace('Registrant', registration.firstName); }

    newMessage.subject = 'Registration for NBA AGC Confirmed!';
    newMessage.to[0].email = registration.email;

    sendMessage(newMessage, function(result){

        var Registration = registration.constructor;
            // Update the Registration to show that the Success Text Has been sent
            Registration.update({_id: registration._id}, { $set: { successMailSent: true} }, function(){
                if (next) { return next(); }
            });

    }, function(e) {

        RegistrationMailError.create(e, function(err, rme) {
            if(err) { return next(err); }

            return next();
        });
    });
};

exports.sendReportEmail = function(theMessage, subject, callback) {
    var newMessage = message;
    newMessage.html = theMessage;
    newMessage.subject = subject;
    newMessage.to = [
        { email: 'dapo.omonayajo@gitlimited.com', type: 'to' },
        { email: 'benedicta.moha@lawpavilion.com', type: 'to' },
        { email: 'ope.olugasa@gitlimited.com', type: 'to' },
    ]

    sendMessage(newMessage, function(){
        return callback();
    }, function(e) {
        return callback(e);
    });
}

exports.sendRecoveryEmail = function(user, next) {

    var newMessage = message;
    var url = 'https://nba-agc.org/myaccount/reset_password?member={{user}}&token={{token}}';
    var theUrl = url.replace('{{user}}', user._id).replace('{{token}}', user.resetToken);

    var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;"><div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="http://www.nigerianbar.org.ng/images/logo12.png"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2015</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"> </td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">We have received a request to reset your NBA AGC Portal Account password. To proceed, click on the link below:<br><br><p><a href="'+ theUrl +'" style="color: green;">'+ theUrl +'</a></p><br>If you did not initiate this request, you can simply ignore thie email.<br></td></tr><tr><td height="50"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:25px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#000000;padding-right:10px; text-align: center;"><span style="background: green; padding: 10px; border-radius: 5px;"><a href="'+ theUrl +'" style="color:#FFFFFF; text-decoration:none;">Reset Password</a></span></td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#000000;padding-right:10px">For support and enquiries, please call any of the following - Ayodeji Oni - <b>0803 345 2825</b>; Oti Edah, <b>0806 590 1348</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Support, Enquiries and Conference Information </span>  Send emails to: support@nba-agc.org, enquiries@nba-agc.org and registration@nba-agc.org</td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    newMessage.html = emailData;
    newMessage.subject = 'Reset your NBA AGC Registration Portal Password';
    newMessage.to[0].email = user.email;

    sendMessage(newMessage, function(){

        return next(null);

    }, function(e) {

        return next(e);
    });

};

exports.sendRegistrationText = function(registration, password, next) {
    var message = 'Dear '+ registration.firstName +', Registration received! Visit https://nba-agc.org/myaccount to login. Username: '+ registration.email +', password: '+ password;

    request('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+process.env.SMS_OWNER_EMAIL+'&subacct='+process.env.SMS_SUB_ACCOUNT+'&subacctpwd='+process.env.SMS_SUB_ACCOUNT_PASSWORD+'&message='+message+'&sender='+process.env.SMS_SENDER+'&sendto='+registration.mobile+'&msgtype='+process.env.SMS_MSG_TYPE, function(error, resp, body) {

        if (!error && resp.statusCode === 200) {
          next(null, body);
        } else {
          console.log('SMS Error: ', error);
          next(error);
        }

    });
};

exports.sendBankRegistrationText = function(registration, password, next) {
    var message = 'Dear '+ registration.firstName +', Registration Received! Please ensure you make payment to the bank within 48 hours or this registration will be cancelled.';

    request('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+process.env.SMS_OWNER_EMAIL+'&subacct='+process.env.SMS_SUB_ACCOUNT+'&subacctpwd='+process.env.SMS_SUB_ACCOUNT_PASSWORD+'&message='+message+'&sender='+process.env.SMS_SENDER+'&sendto='+registration.mobile+'&msgtype='+process.env.SMS_MSG_TYPE, function(error, resp, body) {

        if (!error && resp.statusCode === 200) {
          next(null, body);
        } else {
          console.log('SMS Error: ', error);
          next(error);
        }

    });
};

exports.sendWelcomeMail = function(registration, password, next) {
    var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;">    <div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="http://www.nigerianbar.org.ng/images/logo12.png"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2015</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"><b>Dear Registrant</b></td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Thank you for your interest to be part of the NBA Annual General Conference 2015 <b>"Lawyers and National Development"</b> in <b>Abuja</b> from <b>21 - 28 August, 2015</b>.<br><br>You can now access your Conference Account online here: <a href="https://nba-agc.org/myaccount" style="color: green;">https://nba-agc.org/myaccount</a> using the login details below to access your account:<br><br>Email: <b>{{email}}</b><br>Password: <b>{{password}}</b><br><br></td></tr><tr><td height="20"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Through your account you can print your payment receipt, preview the conference guide and programme, and much more.</td></tr><tr><td height="50"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:25px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#000000;padding-right:10px; text-align: center;"><span style="background: green; padding: 10px; border-radius: 5px;"><a href="https://nba-agc.org/" style="color:#FFFFFF; text-decoration:none;">Go To Conference Portal</a></span></td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">For further details and enquiries, please call any of the following - Ayodeji Oni - <b>0803 345 2825</b>; Oti Edah, <b>0806 590 1348</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Support, Enquiries and Conference Information </span>  Send emails to: support@nba-agc.org, enquiries@nba-agc.org and registration@nba-agc.org</td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    var newMessage = message;
    newMessage.html = emailData.replace('{{password}}', password).replace('{{email}}', registration.email);
    
    if (registration.firstName!==undefined) { newMessage.html = newMessage.html.replace('Registrant', registration.firstName); }

    newMessage.subject = 'Your Login Details for NBA AGC Registration Portal';
    newMessage.to[0].email = registration.email;

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

exports.sendBankWelcomeMail = function(registration, password, next) {
    var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;">    <div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="http://www.nigerianbar.org.ng/images/logo12.png"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2015</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"><b>Dear Registrant</b></td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Thank you for your interest to be part of the NBA Annual General Conference 2015 <b>"Lawyers and National Development"</b> in <b>Abuja</b> from <b>21 - 28 August, 2015</b>.<br><br><div style="padding: 15px;background-color: rgba(255, 0, 0, 0.1);color: rgb(165, 4, 4);border-radius: 10px;margin-bottom: 20px;">This message is NOT a payment confirmation. You need to make payment for the conference at your nearest ACCESS BANK Branch.<br><br><b>Account Name:</b> NBA-AGC ACCOUNT<br><br><b>Account Number:</b> 0 6 9 5 1 7 6 4 9 5 <br><br><b>Registration Code:</b> {{code}}<br><br>Once your payment is confirmed, a message would be sent to you notifying you of the same.</div>In the meantime, you can access your Conference Account online here: <a href="https://nba-agc.org/myaccount" style="color: green;">https://nba-agc.org/myaccount</a> using the login details below to access your account:<br><br>Email: <b>{{email}}</b><br>Password: <b>{{password}}</b><br><br></td></tr><tr><td height="20"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Through your account you can print your payment receipt, preview the conference guide and programme, and much more.</td></tr><tr><td height="50"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:25px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#000000;padding-right:10px; text-align: center;"><span style="background: green; padding: 10px; border-radius: 5px;"><a href="https://nba-agc.org/" style="color:#FFFFFF; text-decoration:none;">Go To Conference Portal</a></span></td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">For further details and enquiries, please call any of the following - Ayodeji Oni - <b>0803 345 2825</b>; Oti Edah, <b>0806 590 1348</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Support, Enquiries and Conference Information </span>  Send emails to: support@nba-agc.org, enquiries@nba-agc.org and registration@nba-agc.org</td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    var newMessage = message;
    newMessage.html = emailData.replace('{{password}}', password).replace('{{email}}', registration.email).replace('{{code}}', (registration.regCode+'-'+registration.conferenceFee));
    
    if (registration.firstName!==undefined) { newMessage.html = newMessage.html.replace('Registrant', registration.firstName); }

    newMessage.subject = 'NBA AGC 2015 Registration Received';
    newMessage.to[0].email = registration.email;

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