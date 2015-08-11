'use strict';

angular.module('nbaAgc2App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngStorage',
  'ui.router',
  'ui.bootstrap',
  'satellizer',
  'ng.deviceDetector'
])
  .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$authProvider", function ($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {

    $authProvider.loginRedirect = '/profile';
    $authProvider.logoutRedirect = '/';
    $authProvider.loginOnSignup = false;
    $authProvider.signupRedirect = false;
    $authProvider.loginUrl = '/auth/login';
    $authProvider.signupUrl = '/auth/signup';
    $authProvider.loginRoute = '/myaccount';

    $authProvider.tokenPrefix = '__nba_tk__';

    $authProvider.platform = 'browser'; // or 'mobile'
    $authProvider.storage = 'localStorage'; // or 'sessionStorage'

    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  }])

    .run(["$rootScope", "$sessionStorage", "Registration", "$state", "$auth", "deviceDetector", "MyRegistration", "User", "$window", function($rootScope, $sessionStorage, Registration, $state, $auth, deviceDetector, MyRegistration, User, $window){

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4&appId=654331671254470';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        $rootScope.isGroup = function() {
            return $rootScope.isAuthenticated() && $rootScope.$user && $rootScope.$user.accountType === 'group';
        };

        //$rootScope.$user = $auth.getPayload();

        $rootScope.confirmedUser = false;

        $rootScope.deviceDetector = deviceDetector;

        $rootScope.cUser = {};

        $rootScope.$on('$stateChangeStart', function(event, next) {
            if (!$auth.isAuthenticated() && next.requireLogin) {
                $window.location.href = '/';
            }
        });

        $rootScope.formatDate = function(date, type) {
            switch(type) {
                case 'cal':
                    return moment(date).calendar();
                case 'weekday':
                    return moment(date).format('dddd');
                case 'time':
                    return moment(date).format('h:mm a');
                case 'fromNow':
                    return moment(date).fromNow();
                default:
                    return moment(date).format('dddd Do MMM, YYYY');
            }
        };

        $rootScope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        if ($rootScope.isAuthenticated()) {
            MyRegistration.get({}, function(data){
                $rootScope.cUser = data;
                $rootScope.confirmedUser = true;
            });

            User.get({}, function(me) {
                $rootScope.$user = me;
            });
        }

        $rootScope.noneInProgress = function() {
            return $sessionStorage.lpRegistrant!==undefined;
        };

        $rootScope.channelChosen = function() {
            return $sessionStorage.lpRegistrant!==undefined && ($sessionStorage.lpRegistrant.webpay || $sessionStorage.lpRegistrant.bankpay);
        };

        $rootScope.completeReg = function() {
            if ($rootScope.channelChosen()) {
                $sessionStorage.$reset();
                $state.go('main');
            }
        };

        $rootScope.doReset = function(){
            var cnf = window.confirm('Are you sure you want to cancel this registration?');

            if ($rootScope.isAuthenticated() && !$rootScope.isGroup()) {
                // Don't allow Individual users who are Signed in to Cancel their Registrations
                window.alert('You cannot cancel your registration at this point.\n\nIf you really need to, please get in touch with Help & Support.');
            } else if ($sessionStorage.lpRegistrant!==undefined && ($sessionStorage.lpRegistrant.webpay || $sessionStorage.lpRegistrant.bankpay)) {
                 window.alert('You cannot cancel your registration at this point.\n\nIf you really need to, please get in touch with Help & Support.');
            } else {
                if (cnf) {
                    // Remove incomplete registrations from the db
                    if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant!== undefined){
                        Registration.delete({id: $sessionStorage.lpRegistrant._id });
                    }

                    $sessionStorage.$reset();
                    $state.go('main');
                }
            }
            
        };
    }]);

Number.prototype.formatMoney = function(c, d, t){
    var n = this,
        s = n < 0 ? '-' : '';

    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d === undefined ? '.' : d;
    t = t === undefined ? ',' : t;

    var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

/*
* jQuery BlockUI; v20141123
* http://jquery.malsup.com/block/
* Copyright (c) 2014 M. Alsup; Dual licensed: MIT/GPL
*/
/* jshint ignore:start */
(function(){"use strict";function e(e){function o(o,i){var s,h,k=o==window,v=i&&void 0!==i.message?i.message:void 0;if(i=e.extend({},e.blockUI.defaults,i||{}),!i.ignoreIfBlocked||!e(o).data("blockUI.isBlocked")){if(i.overlayCSS=e.extend({},e.blockUI.defaults.overlayCSS,i.overlayCSS||{}),s=e.extend({},e.blockUI.defaults.css,i.css||{}),i.onOverlayClick&&(i.overlayCSS.cursor="pointer"),h=e.extend({},e.blockUI.defaults.themedCSS,i.themedCSS||{}),v=void 0===v?i.message:v,k&&b&&t(window,{fadeOut:0}),v&&"string"!=typeof v&&(v.parentNode||v.jquery)){var y=v.jquery?v[0]:v,m={};e(o).data("blockUI.history",m),m.el=y,m.parent=y.parentNode,m.display=y.style.display,m.position=y.style.position,m.parent&&m.parent.removeChild(y)}e(o).data("blockUI.onUnblock",i.onUnblock);var g,I,w,U,x=i.baseZ;g=r||i.forceIframe?e('<iframe class="blockUI" style="z-index:'+x++ +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+i.iframeSrc+'"></iframe>'):e('<div class="blockUI" style="display:none"></div>'),I=i.theme?e('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+x++ +';display:none"></div>'):e('<div class="blockUI blockOverlay" style="z-index:'+x++ +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>'),i.theme&&k?(U='<div class="blockUI '+i.blockMsgClass+' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(x+10)+';display:none;position:fixed">',i.title&&(U+='<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(i.title||"&nbsp;")+"</div>"),U+='<div class="ui-widget-content ui-dialog-content"></div>',U+="</div>"):i.theme?(U='<div class="blockUI '+i.blockMsgClass+' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(x+10)+';display:none;position:absolute">',i.title&&(U+='<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(i.title||"&nbsp;")+"</div>"),U+='<div class="ui-widget-content ui-dialog-content"></div>',U+="</div>"):U=k?'<div class="blockUI '+i.blockMsgClass+' blockPage" style="z-index:'+(x+10)+';display:none;position:fixed"></div>':'<div class="blockUI '+i.blockMsgClass+' blockElement" style="z-index:'+(x+10)+';display:none;position:absolute"></div>',w=e(U),v&&(i.theme?(w.css(h),w.addClass("ui-widget-content")):w.css(s)),i.theme||I.css(i.overlayCSS),I.css("position",k?"fixed":"absolute"),(r||i.forceIframe)&&g.css("opacity",0);var C=[g,I,w],S=k?e("body"):e(o);e.each(C,function(){this.appendTo(S)}),i.theme&&i.draggable&&e.fn.draggable&&w.draggable({handle:".ui-dialog-titlebar",cancel:"li"});var O=f&&(!e.support.boxModel||e("object,embed",k?null:o).length>0);if(u||O){if(k&&i.allowBodyStretch&&e.support.boxModel&&e("html,body").css("height","100%"),(u||!e.support.boxModel)&&!k)var E=d(o,"borderTopWidth"),T=d(o,"borderLeftWidth"),M=E?"(0 - "+E+")":0,B=T?"(0 - "+T+")":0;e.each(C,function(e,o){var t=o[0].style;if(t.position="absolute",2>e)k?t.setExpression("height","Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:"+i.quirksmodeOffsetHack+') + "px"'):t.setExpression("height",'this.parentNode.offsetHeight + "px"'),k?t.setExpression("width",'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"'):t.setExpression("width",'this.parentNode.offsetWidth + "px"'),B&&t.setExpression("left",B),M&&t.setExpression("top",M);else if(i.centerY)k&&t.setExpression("top",'(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"'),t.marginTop=0;else if(!i.centerY&&k){var n=i.css&&i.css.top?parseInt(i.css.top,10):0,s="((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "+n+') + "px"';t.setExpression("top",s)}})}if(v&&(i.theme?w.find(".ui-widget-content").append(v):w.append(v),(v.jquery||v.nodeType)&&e(v).show()),(r||i.forceIframe)&&i.showOverlay&&g.show(),i.fadeIn){var j=i.onBlock?i.onBlock:c,H=i.showOverlay&&!v?j:c,z=v?j:c;i.showOverlay&&I._fadeIn(i.fadeIn,H),v&&w._fadeIn(i.fadeIn,z)}else i.showOverlay&&I.show(),v&&w.show(),i.onBlock&&i.onBlock.bind(w)();if(n(1,o,i),k?(b=w[0],p=e(i.focusableElements,b),i.focusInput&&setTimeout(l,20)):a(w[0],i.centerX,i.centerY),i.timeout){var W=setTimeout(function(){k?e.unblockUI(i):e(o).unblock(i)},i.timeout);e(o).data("blockUI.timeout",W)}}}function t(o,t){var s,l=o==window,a=e(o),d=a.data("blockUI.history"),c=a.data("blockUI.timeout");c&&(clearTimeout(c),a.removeData("blockUI.timeout")),t=e.extend({},e.blockUI.defaults,t||{}),n(0,o,t),null===t.onUnblock&&(t.onUnblock=a.data("blockUI.onUnblock"),a.removeData("blockUI.onUnblock"));var r;r=l?e("body").children().filter(".blockUI").add("body > .blockUI"):a.find(">.blockUI"),t.cursorReset&&(r.length>1&&(r[1].style.cursor=t.cursorReset),r.length>2&&(r[2].style.cursor=t.cursorReset)),l&&(b=p=null),t.fadeOut?(s=r.length,r.stop().fadeOut(t.fadeOut,function(){0===--s&&i(r,d,t,o)})):i(r,d,t,o)}function i(o,t,i,n){var s=e(n);if(!s.data("blockUI.isBlocked")){o.each(function(){this.parentNode&&this.parentNode.removeChild(this)}),t&&t.el&&(t.el.style.display=t.display,t.el.style.position=t.position,t.el.style.cursor="default",t.parent&&t.parent.appendChild(t.el),s.removeData("blockUI.history")),s.data("blockUI.static")&&s.css("position","static"),"function"==typeof i.onUnblock&&i.onUnblock(n,i);var l=e(document.body),a=l.width(),d=l[0].style.width;l.width(a-1).width(a),l[0].style.width=d}}function n(o,t,i){var n=t==window,l=e(t);if((o||(!n||b)&&(n||l.data("blockUI.isBlocked")))&&(l.data("blockUI.isBlocked",o),n&&i.bindEvents&&(!o||i.showOverlay))){var a="mousedown mouseup keydown keypress keyup touchstart touchend touchmove";o?e(document).bind(a,i,s):e(document).unbind(a,s)}}function s(o){if("keydown"===o.type&&o.keyCode&&9==o.keyCode&&b&&o.data.constrainTabKey){var t=p,i=!o.shiftKey&&o.target===t[t.length-1],n=o.shiftKey&&o.target===t[0];if(i||n)return setTimeout(function(){l(n)},10),!1}var s=o.data,a=e(o.target);return a.hasClass("blockOverlay")&&s.onOverlayClick&&s.onOverlayClick(o),a.parents("div."+s.blockMsgClass).length>0?!0:0===a.parents().children().filter("div.blockUI").length}function l(e){if(p){var o=p[e===!0?p.length-1:0];o&&o.focus()}}function a(e,o,t){var i=e.parentNode,n=e.style,s=(i.offsetWidth-e.offsetWidth)/2-d(i,"borderLeftWidth"),l=(i.offsetHeight-e.offsetHeight)/2-d(i,"borderTopWidth");o&&(n.left=s>0?s+"px":"0"),t&&(n.top=l>0?l+"px":"0")}function d(o,t){return parseInt(e.css(o,t),10)||0}e.fn._fadeIn=e.fn.fadeIn;var c=e.noop||function(){},r=/MSIE/.test(navigator.userAgent),u=/MSIE 6.0/.test(navigator.userAgent)&&!/MSIE 8.0/.test(navigator.userAgent);document.documentMode||0;var f=e.isFunction(document.createElement("div").style.setExpression);e.blockUI=function(e){o(window,e)},e.unblockUI=function(e){t(window,e)},e.growlUI=function(o,t,i,n){var s=e('<div class="growlUI"></div>');o&&s.append("<h1>"+o+"</h1>"),t&&s.append("<h2>"+t+"</h2>"),void 0===i&&(i=3e3);var l=function(o){o=o||{},e.blockUI({message:s,fadeIn:o.fadeIn!==void 0?o.fadeIn:700,fadeOut:o.fadeOut!==void 0?o.fadeOut:1e3,timeout:o.timeout!==void 0?o.timeout:i,centerY:!1,showOverlay:!1,onUnblock:n,css:e.blockUI.defaults.growlCSS})};l(),s.css("opacity"),s.mouseover(function(){l({fadeIn:0,timeout:3e4});var o=e(".blockMsg");o.stop(),o.fadeTo(300,1)}).mouseout(function(){e(".blockMsg").fadeOut(1e3)})},e.fn.block=function(t){if(this[0]===window)return e.blockUI(t),this;var i=e.extend({},e.blockUI.defaults,t||{});return this.each(function(){var o=e(this);i.ignoreIfBlocked&&o.data("blockUI.isBlocked")||o.unblock({fadeOut:0})}),this.each(function(){"static"==e.css(this,"position")&&(this.style.position="relative",e(this).data("blockUI.static",!0)),this.style.zoom=1,o(this,t)})},e.fn.unblock=function(o){return this[0]===window?(e.unblockUI(o),this):this.each(function(){t(this,o)})},e.blockUI.version=2.7,e.blockUI.defaults={message:"<h1>Please wait...</h1>",title:null,draggable:!0,theme:!1,css:{padding:0,margin:0,width:"30%",top:"40%",left:"35%",textAlign:"center",color:"#000",border:"3px solid #aaa",backgroundColor:"#fff",cursor:"wait"},themedCSS:{width:"30%",top:"40%",left:"35%"},overlayCSS:{backgroundColor:"#000",opacity:.6,cursor:"wait"},cursorReset:"default",growlCSS:{width:"350px",top:"10px",left:"",right:"10px",border:"none",padding:"5px",opacity:.6,cursor:"default",color:"#fff",backgroundColor:"#000","-webkit-border-radius":"10px","-moz-border-radius":"10px","border-radius":"10px"},iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank",forceIframe:!1,baseZ:1e3,centerX:!0,centerY:!0,allowBodyStretch:!0,bindEvents:!0,constrainTabKey:!0,fadeIn:200,fadeOut:400,timeout:0,showOverlay:!0,focusInput:!0,focusableElements:":input:enabled:visible",onBlock:null,onUnblock:null,onOverlayClick:null,quirksmodeOffsetHack:4,blockMsgClass:"blockMsg",ignoreIfBlocked:!1};var b=null,p=[]}"function"==typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],e):e(jQuery)})();
/* jshint ignore:end */

'use strict';

angular.module('nbaAgc2App')
  .factory('AccessCheck', ["$http", function ($http) {
    // Service logic
    return {
      postSuccess: function (orderID, amount, callback) {

          $http.post('/api/registrations/postPay', { orderID: orderID, amount: amount }, {
            transformResponse:function(data) {
              /*jshint camelcase: false */
              /*global X2JS */
              var x2js = new X2JS();
              var json = x2js.xml_str2json( data );
              return json;
            }
          }).success(function(d){
            console.log(d);
            callback(d);
          });

      }
    };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .service('Bags', ["$resource", function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return $resource('/api/bags', null, {
            choose: { method:'POST' }
        });
  }]);

'use strict';

/* jshint ignore:start */
angular.module('nbaAgc2App')
  .service('Countries', function () {
     return [
         {"name": "Afghanistan", "code": "AF"},
         {"name": "Åland Islands", "code": "AX"},
         {"name": "Albania", "code": "AL"},
         {"name": "Algeria", "code": "DZ"},
         {"name": "American Samoa", "code": "AS"},
         {"name": "AndorrA", "code": "AD"},
         {"name": "Angola", "code": "AO"},
         {"name": "Anguilla", "code": "AI"},
         {"name": "Antarctica", "code": "AQ"},
         {"name": "Antigua and Barbuda", "code": "AG"},
         {"name": "Argentina", "code": "AR"},
         {"name": "Armenia", "code": "AM"},
         {"name": "Aruba", "code": "AW"},
         {"name": "Australia", "code": "AU"},
         {"name": "Austria", "code": "AT"},
         {"name": "Azerbaijan", "code": "AZ"},
         {"name": "Bahamas", "code": "BS"},
         {"name": "Bahrain", "code": "BH"},
         {"name": "Bangladesh", "code": "BD"},
         {"name": "Barbados", "code": "BB"},
         {"name": "Belarus", "code": "BY"},
         {"name": "Belgium", "code": "BE"},
         {"name": "Belize", "code": "BZ"},
         {"name": "Benin", "code": "BJ"},
         {"name": "Bermuda", "code": "BM"},
         {"name": "Bhutan", "code": "BT"},
         {"name": "Bolivia", "code": "BO"},
         {"name": "Bosnia and Herzegovina", "code": "BA"},
         {"name": "Botswana", "code": "BW"},
         {"name": "Bouvet Island", "code": "BV"},
         {"name": "Brazil", "code": "BR"},
         {"name": "British Indian Ocean Territory", "code": "IO"},
         {"name": "Brunei Darussalam", "code": "BN"},
         {"name": "Bulgaria", "code": "BG"},
         {"name": "Burkina Faso", "code": "BF"},
         {"name": "Burundi", "code": "BI"},
         {"name": "Cambodia", "code": "KH"},
         {"name": "Cameroon", "code": "CM"},
         {"name": "Canada", "code": "CA"},
         {"name": "Cape Verde", "code": "CV"},
         {"name": "Cayman Islands", "code": "KY"},
         {"name": "Central African Republic", "code": "CF"},
         {"name": "Chad", "code": "TD"},
         {"name": "Chile", "code": "CL"},
         {"name": "China", "code": "CN"},
         {"name": "Christmas Island", "code": "CX"},
         {"name": "Cocos (Keeling) Islands", "code": "CC"},
         {"name": "Colombia", "code": "CO"},
         {"name": "Comoros", "code": "KM"},
         {"name": "Congo", "code": "CG"},
         {"name": "Congo, The Democratic Republic of the", "code": "CD"},
         {"name": "Cook Islands", "code": "CK"},
         {"name": "Costa Rica", "code": "CR"},
         {"name": "Cote D\"Ivoire", "code": "CI"},
         {"name": "Croatia", "code": "HR"},
         {"name": "Cuba", "code": "CU"},
         {"name": "Cyprus", "code": "CY"},
         {"name": "Czech Republic", "code": "CZ"},
         {"name": "Denmark", "code": "DK"},
         {"name": "Djibouti", "code": "DJ"},
         {"name": "Dominica", "code": "DM"},
         {"name": "Dominican Republic", "code": "DO"},
         {"name": "Ecuador", "code": "EC"},
         {"name": "Egypt", "code": "EG"},
         {"name": "El Salvador", "code": "SV"},
         {"name": "Equatorial Guinea", "code": "GQ"},
         {"name": "Eritrea", "code": "ER"},
         {"name": "Estonia", "code": "EE"},
         {"name": "Ethiopia", "code": "ET"},
         {"name": "Falkland Islands (Malvinas)", "code": "FK"},
         {"name": "Faroe Islands", "code": "FO"},
         {"name": "Fiji", "code": "FJ"},
         {"name": "Finland", "code": "FI"},
         {"name": "France", "code": "FR"},
         {"name": "French Guiana", "code": "GF"},
         {"name": "French Polynesia", "code": "PF"},
         {"name": "French Southern Territories", "code": "TF"},
         {"name": "Gabon", "code": "GA"},
         {"name": "Gambia", "code": "GM"},
         {"name": "Georgia", "code": "GE"},
         {"name": "Germany", "code": "DE"},
         {"name": "Ghana", "code": "GH"},
         {"name": "Gibraltar", "code": "GI"},
         {"name": "Greece", "code": "GR"},
         {"name": "Greenland", "code": "GL"},
         {"name": "Grenada", "code": "GD"},
         {"name": "Guadeloupe", "code": "GP"},
         {"name": "Guam", "code": "GU"},
         {"name": "Guatemala", "code": "GT"},
         {"name": "Guernsey", "code": "GG"},
         {"name": "Guinea", "code": "GN"},
         {"name": "Guinea-Bissau", "code": "GW"},
         {"name": "Guyana", "code": "GY"},
         {"name": "Haiti", "code": "HT"},
         {"name": "Heard Island and Mcdonald Islands", "code": "HM"},
         {"name": "Holy See (Vatican City State)", "code": "VA"},
         {"name": "Honduras", "code": "HN"},
         {"name": "Hong Kong", "code": "HK"},
         {"name": "Hungary", "code": "HU"},
         {"name": "Iceland", "code": "IS"},
         {"name": "India", "code": "IN"},
         {"name": "Indonesia", "code": "ID"},
         {"name": "Iran, Islamic Republic Of", "code": "IR"},
         {"name": "Iraq", "code": "IQ"},
         {"name": "Ireland", "code": "IE"},
         {"name": "Isle of Man", "code": "IM"},
         {"name": "Israel", "code": "IL"},
         {"name": "Italy", "code": "IT"},
         {"name": "Jamaica", "code": "JM"},
         {"name": "Japan", "code": "JP"},
         {"name": "Jersey", "code": "JE"},
         {"name": "Jordan", "code": "JO"},
         {"name": "Kazakhstan", "code": "KZ"},
         {"name": "Kenya", "code": "KE"},
         {"name": "Kiribati", "code": "KI"},
         {"name": "Korea, Democratic People\"S Republic of", "code": "KP"},
         {"name": "Korea, Republic of", "code": "KR"},
         {"name": "Kuwait", "code": "KW"},
         {"name": "Kyrgyzstan", "code": "KG"},
         {"name": "Lao People\"S Democratic Republic", "code": "LA"},
         {"name": "Latvia", "code": "LV"},
         {"name": "Lebanon", "code": "LB"},
         {"name": "Lesotho", "code": "LS"},
         {"name": "Liberia", "code": "LR"},
         {"name": "Libyan Arab Jamahiriya", "code": "LY"},
         {"name": "Liechtenstein", "code": "LI"},
         {"name": "Lithuania", "code": "LT"},
         {"name": "Luxembourg", "code": "LU"},
         {"name": "Macao", "code": "MO"},
         {"name": "Macedonia, The Former Yugoslav Republic of", "code": "MK"},
         {"name": "Madagascar", "code": "MG"},
         {"name": "Malawi", "code": "MW"},
         {"name": "Malaysia", "code": "MY"},
         {"name": "Maldives", "code": "MV"},
         {"name": "Mali", "code": "ML"},
         {"name": "Malta", "code": "MT"},
         {"name": "Marshall Islands", "code": "MH"},
         {"name": "Martinique", "code": "MQ"},
         {"name": "Mauritania", "code": "MR"},
         {"name": "Mauritius", "code": "MU"},
         {"name": "Mayotte", "code": "YT"},
         {"name": "Mexico", "code": "MX"},
         {"name": "Micronesia, Federated States of", "code": "FM"},
         {"name": "Moldova, Republic of", "code": "MD"},
         {"name": "Monaco", "code": "MC"},
         {"name": "Mongolia", "code": "MN"},
         {"name": "Montserrat", "code": "MS"},
         {"name": "Morocco", "code": "MA"},
         {"name": "Mozambique", "code": "MZ"},
         {"name": "Myanmar", "code": "MM"},
         {"name": "Namibia", "code": "NA"},
         {"name": "Nauru", "code": "NR"},
         {"name": "Nepal", "code": "NP"},
         {"name": "Netherlands", "code": "NL"},
         {"name": "Netherlands Antilles", "code": "AN"},
         {"name": "New Caledonia", "code": "NC"},
         {"name": "New Zealand", "code": "NZ"},
         {"name": "Nicaragua", "code": "NI"},
         {"name": "Niger", "code": "NE"},
         //{"name": "Nigeria", "code": "NG"},
         {"name": "Niue", "code": "NU"},
         {"name": "Norfolk Island", "code": "NF"},
         {"name": "Northern Mariana Islands", "code": "MP"},
         {"name": "Norway", "code": "NO"},
         {"name": "Oman", "code": "OM"},
         {"name": "Pakistan", "code": "PK"},
         {"name": "Palau", "code": "PW"},
         {"name": "Palestinian Territory, Occupied", "code": "PS"},
         {"name": "Panama", "code": "PA"},
         {"name": "Papua New Guinea", "code": "PG"},
         {"name": "Paraguay", "code": "PY"},
         {"name": "Peru", "code": "PE"},
         {"name": "Philippines", "code": "PH"},
         {"name": "Pitcairn", "code": "PN"},
         {"name": "Poland", "code": "PL"},
         {"name": "Portugal", "code": "PT"},
         {"name": "Puerto Rico", "code": "PR"},
         {"name": "Qatar", "code": "QA"},
         {"name": "Reunion", "code": "RE"},
         {"name": "Romania", "code": "RO"},
         {"name": "Russian Federation", "code": "RU"},
         {"name": "RWANDA", "code": "RW"},
         {"name": "Saint Helena", "code": "SH"},
         {"name": "Saint Kitts and Nevis", "code": "KN"},
         {"name": "Saint Lucia", "code": "LC"},
         {"name": "Saint Pierre and Miquelon", "code": "PM"},
         {"name": "Saint Vincent and the Grenadines", "code": "VC"},
         {"name": "Samoa", "code": "WS"},
         {"name": "San Marino", "code": "SM"},
         {"name": "Sao Tome and Principe", "code": "ST"},
         {"name": "Saudi Arabia", "code": "SA"},
         {"name": "Senegal", "code": "SN"},
         {"name": "Serbia and Montenegro", "code": "CS"},
         {"name": "Seychelles", "code": "SC"},
         {"name": "Sierra Leone", "code": "SL"},
         {"name": "Singapore", "code": "SG"},
         {"name": "Slovakia", "code": "SK"},
         {"name": "Slovenia", "code": "SI"},
         {"name": "Solomon Islands", "code": "SB"},
         {"name": "Somalia", "code": "SO"},
         {"name": "South Africa", "code": "ZA"},
         {"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
         {"name": "Spain", "code": "ES"},
         {"name": "Sri Lanka", "code": "LK"},
         {"name": "Sudan", "code": "SD"},
         {"name": "Suriname", "code": "SR"},
         {"name": "Svalbard and Jan Mayen", "code": "SJ"},
         {"name": "Swaziland", "code": "SZ"},
         {"name": "Sweden", "code": "SE"},
         {"name": "Switzerland", "code": "CH"},
         {"name": "Syrian Arab Republic", "code": "SY"},
         {"name": "Taiwan, Province of China", "code": "TW"},
         {"name": "Tajikistan", "code": "TJ"},
         {"name": "Tanzania, United Republic of", "code": "TZ"},
         {"name": "Thailand", "code": "TH"},
         {"name": "Timor-Leste", "code": "TL"},
         {"name": "Togo", "code": "TG"},
         {"name": "Tokelau", "code": "TK"},
         {"name": "Tonga", "code": "TO"},
         {"name": "Trinidad and Tobago", "code": "TT"},
         {"name": "Tunisia", "code": "TN"},
         {"name": "Turkey", "code": "TR"},
         {"name": "Turkmenistan", "code": "TM"},
         {"name": "Turks and Caicos Islands", "code": "TC"},
         {"name": "Tuvalu", "code": "TV"},
         {"name": "Uganda", "code": "UG"},
         {"name": "Ukraine", "code": "UA"},
         {"name": "United Arab Emirates", "code": "AE"},
         {"name": "United Kingdom", "code": "GB"},
         {"name": "United States", "code": "US"},
         {"name": "United States Minor Outlying Islands", "code": "UM"},
         {"name": "Uruguay", "code": "UY"},
         {"name": "Uzbekistan", "code": "UZ"},
         {"name": "Vanuatu", "code": "VU"},
         {"name": "Venezuela", "code": "VE"},
         {"name": "Viet Nam", "code": "VN"},
         {"name": "Virgin Islands, British", "code": "VG"},
         {"name": "Virgin Islands, U.S.", "code": "VI"},
         {"name": "Wallis and Futuna", "code": "WF"},
         {"name": "Western Sahara", "code": "EH"},
         {"name": "Yemen", "code": "YE"},
         {"name": "Zambia", "code": "ZM"},
         {"name": "Zimbabwe", "code": "ZW"}
     ];
  });
/* jshint ignore:end */
'use strict';

angular.module('nbaAgc2App')

.controller('FormEditorCtrl', ["$scope", "$state", "$http", "$sessionStorage", "Registration", "$stateParams", "blocker", "$anchorScroll", function($scope, $state, $http, $sessionStorage, Registration, $stateParams, blocker, $anchorScroll) {

    if ($stateParams.registrationId) {

        // Fetch the Registration Info
        blocker.block();

        Registration.get({id: $stateParams.registrationId}, function(d){
            $scope.data = d;
            $scope.nextForm = $scope.editing = true;

            blocker.clear();
        });


        var k, results;
        $scope.years = (function() {
            results = [];
            for (k = 2010; k >= 1960; k--){ results.push(k); }
            return results;
        }).apply(this);

        $scope.reviewForm = function(formName) {

            if (formName.$invalid) {

                window.alert('All form fields marked with * are required!');

                $anchorScroll();
                
            } else {
                var cnf = window.confirm('Are you sure you want to update this registration?');

                if (cnf) {

                    blocker.block();

                    // Update the Registration Information
                    Registration.update({id: $scope.data._id}, $scope.data, function(){

                        $sessionStorage.$reset();
                        $state.go('myRegistrations');

                    });
                }
            }
        };

    } else {
        // Redirect
        $state.go('myRegistrations');
    }
}]);

'use strict';

angular.module('nbaAgc2App')
  .service('MyRegistration', ["$resource", function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return $resource('/api/registrations/me');
  }]);

'use strict';

angular.module('nbaAgc2App')
  .service('Sessions', ["$resource", function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return $resource('/api/sessions/:id');
  }]);

'use strict';

angular.module('nbaAgc2App')
  .service('User', ["$resource", function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return $resource('/auth/');
  }]);

'use strict';

angular.module('nbaAgc2App')
  .controller('AccessBankTestCtrl', ["$scope", "$state", "$sessionStorage", "Registration", "blocker", "$anchorScroll", "$rootScope", function ($scope, $state, $sessionStorage, Registration, blocker, $anchorScroll, $rootScope)  {
    	$anchorScroll();

        // If any other type of Registration is on-going, re-direct to it
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined){

            blocker.block();

            if ($sessionStorage.lpRegistrant.registrationType==='access_bank_test') {

                Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                    $scope.data = d;
                    $scope.nextForm = true;

                    blocker.clear();
                });
            } else {
                $state.go($sessionStorage.lpRegistrant.registrationType);
            }
        } else {
            $sessionStorage.$reset();
            $scope.data = {
                registrationType: 'access_bank_test',
                member: ''
            };
        }

        $scope.startReg = function() {

            var cnf = window.confirm('Is this information correct?');

            if (cnf) {

                blocker.block();

                if ($rootScope.isAuthenticated()) { $scope.data.user = $rootScope.$user.sub; }

                var reg = new Registration($scope.data);
                reg.$save().then(function(registrationData) {

                    $sessionStorage.lpRegistrant = registrationData;
                    $scope.data = registrationData;

                    $scope.nextForm = true;

                    blocker.clear();
                });
            }
        };

        $scope.reviewForm = function(form1, form2) {

            if (form1.$valid && form2.$valid) {

                var cnf = window.confirm('Are you sure you want to submit this form?');
                if (cnf) {

                    blocker.block();

                    $scope.data.formFilled = true;

                    // Update the Registration Information
                    Registration.update({id: $scope.data._id}, $scope.data, function(){
                        if ($rootScope.isGroup()) { $sessionStorage.$reset(); $state.go('myRegistrations'); }
                        $state.go('invoice');
                    });
                }
            } else {

                window.alert('All fields marked * are required. Please fill in all fields before submitting.');

                $anchorScroll();
            }
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('access_bank_test', {
        url: '/access_bank_test',
        templateUrl: 'app/access_bank_test/access_bank_test.html',
        controller: 'AccessBankTestCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('AttendeesCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('attendees', {
        url: '/attendees',
        templateUrl: 'app/attendees/attendees.html',
        controller: 'AttendeesCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('BankPayCtrl', ["$scope", "$state", "$sessionStorage", "Registration", "blocker", "$auth", function ($scope, $state, $sessionStorage, Registration, blocker, $auth) {
  	if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {

            blocker.block();

            // Check if the User has filled the form
            Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
                if (!$scope.data.formFilled){
                    $state.go($scope.data.registrationType);
                }

                $sessionStorage.lpRegistrant = d;

                blocker.clear();

            });
        } else {
            $state.go('main');
        }

        $scope.markComplete = function(r) {

            blocker.block();

            $auth.signup(r).then(function(response) {
                console.log(response.data);

                r.completed = true;
                Registration.update({id: $scope.data._id}, r, function(){
                    
                    //window.alert('Congratulations!\n\n Your account has been created and your payment is now expected within the next 48 hours.\n\n Do check your email for more information (including your login details)');
                    window.alert('Registration Received, please proceed to bank payment within the next 48 hours. Please check your email for your login details and more information.');

                    $sessionStorage.$reset();
                    $state.go('login');
                });

                blocker.clear();

            }, function(err){
                window.alert(err.data.message);
                blocker.clear();
            });
        };

        $scope.back = function() {
            if ($auth.isAuthenticated) { window.history.back(); }
            else { $state.go('invoice'); }
        };

        $scope.getName = function () {
            if (!$scope.data){
                return '';
            }
            return $scope.data.firstName+' '+$scope.data.middleName+' '+$scope.data.surname;
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('bankPay', {
        url: '/invoice/bankPay',
        templateUrl: 'app/bankPay/bankPay.html',
        controller: 'BankPayCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('BenchFormCtrl', ["$scope", "$state", "Registration", "$sessionStorage", "blocker", "$anchorScroll", "$rootScope", function ($scope, $state, Registration, $sessionStorage, blocker, $anchorScroll, $rootScope) {

        $anchorScroll();

        // If any other type of Registration is on-going, re-direct to it
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined){
            blocker.block();

            if ($sessionStorage.lpRegistrant.registrationType==='sanAndBench') {

                Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                    $scope.data = d;
                    $scope.nextForm = true;

                    blocker.clear();
                });
            } else {
                $state.go($sessionStorage.lpRegistrant.registrationType);
            }
        } else {
            $sessionStorage.$reset();
            $scope.data = {
                registrationType: 'sanAndBench',
                member: ''
            };
        }

        var k, results;
        $scope.years = (function() {
            results = [];
            for (k = 2010; k >= 1960; k--){ results.push(k); }
            return results;
        }).apply(this);

        $scope.startReg = function() {

            var cnf = window.confirm('Is this information correct?');

            if (cnf) {

                blocker.block();

                if ($rootScope.isAuthenticated()) { $scope.data.owner = $rootScope.$user.sub; $scope.data.isGroup = true; }

                var reg = new Registration($scope.data);
                reg.$save().then(function(registrationData) {

                    $sessionStorage.lpRegistrant = registrationData;
                    $scope.data = registrationData;

                    $scope.nextForm = true;

                    blocker.clear();
                    window.alert('Registration started successfully. Now, please complete the rest of the form and submit.');
                });
            }
        };

        $scope.reviewForm = function(form1, form2) {

            if (form1.$valid && form2.$valid) {

                var cnf = window.confirm('Are you sure you want to submit this form?');
                if (cnf) {

                    blocker.block();

                    $scope.data.formFilled = true;

                    // Update the Registration Information
                    Registration.update({id: $scope.data._id}, $scope.data, function(){
                        if ($rootScope.isGroup()) { $sessionStorage.$reset(); $state.go('myRegistrations'); }
                        $state.go('invoice');
                    });
                }
            } else {

                window.alert('All fields marked * are required. Please fill all fields before submitting.');

                $anchorScroll();

            }
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('sanAndBench', {
        url: '/SAN_AGS_BENCH',
        templateUrl: 'app/benchForm/benchForm.html',
        controller: 'BenchFormCtrl'
      })
      .state('sanAndBenchUpdate', {
        url: '/SAN_AGS_BENCH/:registrationId',
        templateUrl: 'app/benchForm/benchForm.html',
        controller: 'FormEditorCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .service('blocker', [
    '$localStorage', function($localStorage) {
      return {
        block: function(element, message) {
          var msg;
          msg = message || 'Processing';

          $localStorage.blockedElement = element || 'html';

          angular.element($localStorage.blockedElement).block({
            message: '<div class="alert alert-info">' + msg + '</div>',
            css: {
              height: '38px',
              border: ''
            }
          });
          return true;
        },
        clear: function() {
           angular.element($localStorage.blockedElement).unblock();
           return true;
        }
      };
    }
    ]);

'use strict';

angular.module('nbaAgc2App')
  .controller('ConferenceSessionsCtrl', ["$scope", "Sessions", function ($scope, Sessions) {

        Sessions.query({}, function(data) {
            $scope.sessions = data;
        });
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('conference_sessions', {
        url: '/conference_sessions',
        templateUrl: 'app/conference_sessions/conference_sessions.html',
        controller: 'ConferenceSessionsCtrl'
      })
        .state('conference_session_detail', {
            url: '/conference_sessions/:id',
            templateUrl: 'app/conference_sessions/conference_sessions.html',
            controller: 'ConferenceSessionsCtrl'
        });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('ConferenceSpeakersCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('conference_speakers', {
        url: '/conference_speakers',
        templateUrl: 'app/conference_speakers/conference_speakers.html',
        controller: 'ConferenceSpeakersCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('DoPasswordResetCtrl', ["$scope", "blocker", "$http", "$stateParams", function ($scope, blocker, $http, $stateParams) {
    
    	blocker.block();
    	$scope.showForm = false;

    	// Verify the request
    	$http.post('/auth/confirmResetRequest', $stateParams)
    	.success(function(user){

    		console.log(user);

    		$scope.user = user;

    		blocker.clear();
    		$scope.showForm = true;
    	})
    	.error(function(data){
    		$scope.error = data.message;

    		blocker.clear();
    	});

    	$scope.resetPassword = function(theForm) {

    		if (theForm.$valid) {

    			blocker.block('#theForm');

    			$http.post('/auth/changePassword', { user: $scope.user, password: $scope.password })
    			.success(function() {

    				$scope.info = 'Password reset successful!';
    				$scope.password = '';
    				$scope.confirmPassword = '';

    				blocker.clear();
    			})
    			.error(function(data){
    				$scope.error = data.message;

    				blocker.clear();
    			});
    		}
    	};
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('doPasswordReset', {
        url: '/myaccount/reset_password?member&token',
        templateUrl: 'app/doPasswordReset/doPasswordReset.html',
        controller: 'DoPasswordResetCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
.controller('GroupInvoiceCtrl', ["$scope", "$state", "$stateParams", "Invoice", "blocker", "$sessionStorage", function ($scope, $state, $stateParams, Invoice, blocker, $sessionStorage) {

	if (!$stateParams.invoiceId) { $state.go('myRegistrations'); }

	$scope.showGroup = true;
	blocker.block();

	Invoice.get({ id: $stateParams.invoiceId }, function(theInvoice) {
		$scope.invoice = theInvoice;
		blocker.clear();

	}, function() {

		blocker.clear();
		window.alert('Could not fetch Invoice!');
	});

	$scope.deleteInvoice = function() {
		var cnf = window.confirm('Are you sure you want to delete this invoice?');

		if (cnf) {
			blocker.block();
			Invoice.delete({ id: $stateParams.invoiceId }, function(){
				
				blocker.clear();
				window.alert('Invoice deleted successfully!');

				$state.go('myRegistrations');
			}, function(e) {

				blocker.clear();
				window.alert(e.data.message);
			});
		}
		
	};

	$scope.markFinal = function(what) {

        blocker.block();

        var toUp = {
        	webpay: $scope.invoice.webpay,
        	bankpay: $scope.invoice.bankpay,
        	finalized: $scope.finalized
        };

        if (what==='webpay') { toUp.webpay = true; $sessionStorage.activeGroupInvoice = $stateParams.invoiceId; }
        else { toUp.bankpay = true;  }

        toUp.finalized = true;

        Invoice.update({id: $scope.invoice._id}, toUp, function(){

            $state.go('group_'+what, {invoiceId: $stateParams.invoiceId});

        });
    };

	$scope.getName = function (data) {
        if (!data) {
            return '';
        }

        $scope.userName = data.prefix+' '+data.firstName+' '+data.middleName+' '+data.surname+' '+data.suffix;

        return $scope.userName;
    };
}]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('groupInvoice', {
        url: '/group_invoice/:invoiceId',
        templateUrl: 'app/groupInvoice/groupInvoice.html',
        controller: 'GroupInvoiceCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
.controller('GroupPayCtrl', ["$scope", "$state", "$stateParams", "Invoice", "blocker", function ($scope, $state, $stateParams, Invoice, blocker) {
	if (!$stateParams.invoiceId) { $state.go('myRegistrations'); }

	blocker.block();

	Invoice.get({ id: $stateParams.invoiceId }, function(theInvoice) {
		$scope.data = theInvoice;

		if (!theInvoice.finalized) { $state.go('groupInvoice'); }

		blocker.clear();

	}, function() {

		blocker.clear();
		window.alert('Could not fetch Invoice!');
	});

    $scope.back = function() {
        window.history.back();
    };
}]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('group_webpay', {
        url: '/group_invoice/:invoiceId/webpay',
        templateUrl: 'app/group_pay/group_pay.html',
        controller: 'GroupPayCtrl'
      })
      .state('group_bankpay', {
        url: '/group_invoice/:invoiceId/bankpay',
        templateUrl: 'app/group_pay/group_bank_pay.html',
        controller: 'GroupPayCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('HomeCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('InternationalCtrl', ["$scope", "Countries", "$state", "$sessionStorage", "Registration", "blocker", "$anchorScroll", "$rootScope", function ($scope, Countries, $state, $sessionStorage, Registration, blocker, $anchorScroll, $rootScope) {
    $scope.countries = Countries;

        $anchorScroll();

        // If any other type of Registration is on-going, re-direct to it
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined){

            blocker.block();

            if ($sessionStorage.lpRegistrant.registrationType==='international') {

                Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                    $scope.data = d;
                    $scope.nextForm = true;

                    blocker.clear();
                });
            } else {
                $state.go($sessionStorage.lpRegistrant.registrationType);
            }
        } else {
            $sessionStorage.$reset();
            $scope.data = {
                registrationType: 'international',
                international: true,
                member: ''
            };
        }

        $scope.startReg = function() {

            var cnf = window.confirm('Is this information correct?');

            if (cnf) {

                blocker.block();

                if ($rootScope.isAuthenticated()) { $scope.data.owner = $rootScope.$user.sub; $scope.data.isGroup = true; }

                var reg = new Registration($scope.data);
                reg.$save().then(function(registrationData) {

                    $sessionStorage.lpRegistrant = registrationData;
                    $scope.data = registrationData;

                    $scope.nextForm = true;

                    blocker.clear();
                });
            }
        };

        $scope.reviewForm = function(form1, form2) {

            if (form1.$valid && form2.$valid) {

                var cnf = window.confirm('Are you sure you want to submit this form?');
                if (cnf) {

                    blocker.block();

                    $scope.data.formFilled = true;

                    // Update the Registration Information
                    Registration.update({id: $scope.data._id}, $scope.data, function(){
                        if ($rootScope.isGroup()) { $sessionStorage.$reset(); $state.go('myRegistrations'); }
                        $state.go('invoice');
                    });
                }
            } else {

                window.alert('All fields marked * are required. Please fill in all fields before submitting.');

                $anchorScroll();
            }
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('international', {
        url: '/INTERNATIONAL_ATTENDEES',
        templateUrl: 'app/international/international.html',
        controller: 'InternationalCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .service('Invoice', ["$resource", function ($resource) {
    return $resource('/api/invoices/:id', null,
    {
        'update': { method:'PUT' }
    });
  }]);

'use strict';

angular.module('nbaAgc2App')
  .controller('InvoiceCtrl', ["$scope", "$sessionStorage", "Registration", "$state", "blocker", "$auth", "$rootScope", function ($scope, $sessionStorage, Registration, $state, blocker, $auth, $rootScope) {
        
        if ($rootScope.isGroup()) { $sessionStorage.$reset(); $state.go('myRegistrations'); }

        else {
            if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {

                blocker.block();

                // Check if the User has filled the form
                Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                    $scope.data = d;
                    
                    if (!$scope.data.formFilled){
                        $state.go($scope.data.registrationType);
                    }

                    blocker.clear();

                });
            } else {
                $state.go('main');
            }
        }

        $scope.back = function() {
            $state.go($scope.data.registrationType);
        };

        $scope.getName = function (data) {
            if (!data) {
                return '';
            }

            $scope.userName = data.prefix+' '+data.firstName+' '+data.middleName+' '+data.surname+' '+data.suffix;

            return $scope.userName;
        };

        $scope.payBank = function() {

            if ($scope.data.completed && $scope.data.bankpay) {

                $state.go('bankPay');

            } else {
            
                $scope.markComplete('bankpay', function(){

                    $state.go('bankPay');

                });
            }
        };

        $scope.payOnline = function() {

            if ($scope.data.completed && $scope.data.webpay) {

                $state.go('webpay');
                
            } else {
            
                $scope.markComplete('webpay', function(){

                    $state.go('webpay');

                });
            }
        };

        $scope.markComplete = function(what, callback) {

            blocker.block();

            // Prevent Account signup for people trying to Pay after signing in
            if ($auth.isAuthenticated()) {

                if (what==='webpay') { $scope.data.webpay = true; }
                else { $scope.data.bankpay = true; }

                $scope.data.completed = true;

                Registration.update({id: $scope.data._id}, $scope.data, function(){

                    callback();

                });

            } else {

                $auth.signup($scope.data).then(function() {

                    if (what==='webpay') { $scope.data.webpay = true; }
                    else { $scope.data.bankpay = true; }

                    $scope.data.completed = true;

                    Registration.update({id: $scope.data._id}, $scope.data, function(){

                        if (what==='bankpay') {
                            window.alert('Registration Received, please proceed to the Bank for Payment.\n\nPlease check your email for your login details and more information.');
                        }

                        callback();

                    });

                }, function(err) {

                    window.alert(err.data.message);
                    
                    blocker.clear();

                });
            }
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('invoice', {
        url: '/invoice',
        templateUrl: 'app/invoice/invoice.html',
        controller: 'InvoiceCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('JudgeFormCtrl', ["$scope", "$state", "$sessionStorage", "Registration", "blocker", "$anchorScroll", "$rootScope", function ($scope, $state, $sessionStorage, Registration, blocker, $anchorScroll, $rootScope) {

        $anchorScroll();
        
        // If any other type of Registration is on-going, re-direct to it
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined){

            blocker.block();

            if ($sessionStorage.lpRegistrant.registrationType==='judge') {

                Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                    $scope.data = d;
                    $scope.nextForm = true;

                    blocker.clear();
                });
            } else {
                $state.go($sessionStorage.lpRegistrant.registrationType);
            }
        } else {
            $sessionStorage.$reset();
            $scope.data = {
                prefix: 'Hon. Justice',
                registrationType: 'judge',
                member: ''
            };
        }

        var k, results;
        $scope.years = (function() {
            results = [];
            for (k = 2010; k >= 1960; k--){ results.push(k); }
            return results;
        }).apply(this);

        $scope.startReg = function() {

            var cnf = window.confirm('Is this information correct?');

            if (cnf) {

                blocker.block();

                if ($rootScope.isAuthenticated()) { $scope.data.owner = $rootScope.$user.sub; $scope.data.isGroup = true; }

                var reg = new Registration($scope.data);
                reg.$save().then(function(registrationData) {

                    $sessionStorage.lpRegistrant = registrationData;
                    $scope.data = registrationData;

                    $scope.nextForm = true;

                    blocker.clear();

                    window.alert('Registration started successfully. Now, please complete the rest of the form and submit.');
                });
            }
        };

        $scope.reviewForm = function(form1, form2) {

            if (form1.$valid && form2.$valid) {


                var cnf = window.confirm('Are you sure you want to submit this form?');
                if (cnf) {

                    blocker.block();
                    
                    $scope.data.formFilled = true;

                    // Update the Registration Information
                    Registration.update({id: $scope.data._id}, $scope.data, function(){
                        if ($rootScope.isGroup()) { $sessionStorage.$reset(); $state.go('myRegistrations'); }
                        $state.go('invoice');
                    });
                }
            } else {

                window.alert('All fields marked * are required. Please fill in all fields before submitting. ');
                $anchorScroll();
            }
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('judge', {
        url: '/JUDGES',
        templateUrl: 'app/judgeForm/judgeForm.html',
        controller: 'JudgeFormCtrl'
      })
      .state('judgeUpdate', {
        url: '/JUDGES/:registrationId',
        templateUrl: 'app/judgeForm/judgeForm.html',
        controller: 'FormEditorCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('LawyerFormCtrl', ["$scope", "$state", "$http", "$sessionStorage", "Registration", "blocker", "$anchorScroll", "$rootScope", function ($scope, $state, $http, $sessionStorage, Registration, blocker, $anchorScroll, $rootScope) {

        $anchorScroll();

        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {
            blocker.block();

            Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
                blocker.clear();
            });
        } else{
            $state.go('legalPractitioner');
        }

        $scope.reviewForm = function(formName) {

            if (formName.$invalid) {

                window.alert('All form fields marked with * are required!');

                $anchorScroll();
                
            } else {
                var cnf = window.confirm('Are you sure you want to submit this form?');
                if (cnf) {

                    blocker.block();

                    $scope.data.formFilled = true;

                    // Update the Registration Information
                    Registration.update({id: $scope.data._id}, $scope.data, function(){
                        if ($rootScope.isAuthenticated() && $rootScope.isGroup()) { $sessionStorage.$reset(); $state.go('myRegistrations'); }
                        else { $state.go('invoice'); }
                    });
                }
            }
        };
  }]);
'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('lawyerForm', {
        url: '/LEGAL_PRACTITIONER',
        templateUrl: 'app/lawyerForm/lawyerForm.html',
        controller: 'LawyerFormCtrl'
      })
      .state('legalPractitionerUpdate', {
        url: '/LEGAL_PRACTITIONER/:registrationId',
        templateUrl: 'app/lawyerForm/lawyerForm.html',
        controller: 'FormEditorCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
.controller('LegalPractitionerCtrl', ["$scope", "$state", "$http", "$sessionStorage", "Registration", "blocker", "$anchorScroll", "$auth", function ($scope, $state, $http, $sessionStorage, Registration, blocker, $anchorScroll, $auth) {

    $scope.person = {};
    $scope.members = [];

    $anchorScroll();

    if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {

        blocker.block();

        // Retrieve the data from the Server
        Registration.get({id: $sessionStorage.lpRegistrant._id}, function(regData){
            $sessionStorage.lpRegistrant = regData;
            // Set Some data in the browser cookie and on the server
            $state.go('lawyerForm');
        });
    }

    // Ask for Name as it appears on Call to Bar Certificate!
    $scope.nextForm = function() {
        $scope.person.nbSurname = $scope.person.surname;
        $scope.showForm2 = true;
    };

    // Lookup the registration data for this user
    $scope.doLookup = function() {
        blocker.block();
        $http.post('/api/members/verify', $scope.person).success(function(members) {
            $scope.members = members;
            $scope.showTable = true;

            blocker.clear();
        });
    };

    $scope.details = function(person) {

        blocker.block();
        
        $scope.person.member = person._id;
        $scope.person.nbaId = person.nbaId;
        $scope.person.yearCalled = person.yearCalled;

        // Group Registration Support
        if ($auth.isAuthenticated()) { $scope.person.owner = $auth.getPayload().sub; $scope.person.isGroup = true; }

        // Notify the server that a registration has been started for the current user!
        var reg = new Registration($scope.person);
        reg.$save().then(function(registrationData) {

            $sessionStorage.lpRegistrant = registrationData;

            // Set Some data in the browser cookie and on the server
            $state.go('lawyerForm');
        });
    };
}]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('legalPractitioner', {
        url: '/registration/legalPractitioner',
        templateUrl: 'app/legalPractitioner/legalPractitioner.html',
        controller: 'LegalPractitionerCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('LoginCtrl', ["$scope", "$state", "$auth", "blocker", function ($scope, $state, $auth, blocker) {

        $scope.user = {};

        $scope.doLogin = function() {

        	blocker.block('#theForm');

            $auth.login($scope.user, '/registrations').then(function() {
            	
                window.location.href='/registrations';

            }, function(e){
            	blocker.clear();
            	$scope.error = e.data.message;
            });
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/myaccount',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('MagistrateFormCtrl', ["$scope", "$state", "$sessionStorage", "Registration", "blocker", "$anchorScroll", "$rootScope", function ($scope, $state, $sessionStorage, Registration, blocker, $anchorScroll, $rootScope) {

        $anchorScroll();
        
        // If any other type of Registration is on-going, re-direct to it
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined){

            blocker.block();

            if ($sessionStorage.lpRegistrant.registrationType==='magistrate') {

                Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                    $scope.data = d;
                    $scope.nextForm = true;

                    blocker.clear();
                });
            } else {
                $state.go($sessionStorage.lpRegistrant.registrationType);
            }
        } else {
            $sessionStorage.$reset();
            $scope.data = {
                registrationType: 'magistrate',
                member: ''
            };
        }

        var k, results;
        $scope.years = (function() {
            results = [];
            for (k = 2010; k >= 1960; k--){ results.push(k); }
            return results;
        }).apply(this);

        $scope.startReg = function() {

            var cnf = window.confirm('Is this information correct?');

            if (cnf) {

                blocker.block();

                if ($rootScope.isAuthenticated()) { $scope.data.owner = $rootScope.$user.sub; $scope.data.isGroup = true; }

                var reg = new Registration($scope.data);
                reg.$save().then(function(registrationData) {

                    $sessionStorage.lpRegistrant = registrationData;
                    $scope.data = registrationData;

                    $scope.nextForm = true;

                    blocker.clear();
                });
            }
        };

        $scope.reviewForm = function(form1, form2) {

            if (form1.$valid && form2.$valid) {

                var cnf = window.confirm('Are you sure you want to submit this form?');
                if (cnf) {

                    blocker.block();

                    $scope.data.formFilled = true;

                    // Update the Registration Information
                    Registration.update({id: $scope.data._id}, $scope.data, function(){
                        if ($rootScope.isGroup()) { $sessionStorage.$reset(); $state.go('myRegistrations'); }
                        $state.go('invoice');
                    });
                }
            } else {

                window.alert('All fields marked * are required. Please fill in all fields before submitting.');

                $anchorScroll();
            }
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('magistrate', {
        url: '/MAGISTRATE',
        templateUrl: 'app/magistrateForm/magistrateForm.html',
        controller: 'MagistrateFormCtrl'
      })
      .state('magistrateUpdate', {
        url: '/MAGISTRATE/:registrationId',
        templateUrl: 'app/magistrateForm/magistrateForm.html',
        controller: 'FormEditorCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('MainCtrl', ["$scope", "$sessionStorage", "$state", "$rootScope", function ($scope, $sessionStorage, $state, $rootScope) {

    if ($rootScope.isAuthenticated()) {
        $state.go('myRegistrations');
    }
    
    $scope.startReg = function() {
        if ($sessionStorage.lpRegistrant!==null && $sessionStorage.lpRegistrant!== undefined) {
            $state.go($sessionStorage.lpRegistrant.registrationType);
        } else {
            $state.go('registerAs');
        }
    };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
.controller('MyInvoicesCtrl', ["$scope", "blocker", "Invoice", "$anchorScroll", "$http", function ($scope, blocker, Invoice, $anchorScroll, $http) {

	$anchorScroll();

	blocker.block();

	Invoice.query(function(invoices) {
            
	    $scope.invoices = invoices;


	    $scope.paidInvoices = _.filter(invoices, function(i) { return i.paymentSuccessful && i.responseGotten; });
      $scope.unpaidInvoices = _.filter(invoices, function(i) { return i.finalized && !i.paymentSuccessful && !i.responseGotten && (i.bankpay || i.webpay); });
	    $scope.unpaidWebInvoices = _.filter(invoices, function(i) { return i.finalized && !i.paymentSuccessful && !i.responseGotten && i.webpay; });
	    $scope.voidInvoices = _.filter(invoices, function(i) { return !i.paymentSuccessful && i.responseGotten; });

      _.each($scope.unpaidWebInvoices, function(r) { $scope.updateRecord(r._id); } );

	    blocker.clear();

  	});

  	$scope.getGroupFee = function(group) {
        return _.reduce(group, function(result, reg) { return result + reg.invoiceAmount; }, 0);
    };

    $scope.updateRecord = function(id) {

        blocker.block();

        $http.post('/api/registrations/webPayStatus', { _id: id, which: 'invoice' }, {
          transformResponse:function(data) {
            /*jshint camelcase: false */
            /*global X2JS */
            var x2js = new X2JS();
            var json = x2js.xml_str2json( data );
            return json;
          }
        }).success(function(d){
           d = d.CIPG;

           if (d.Error === undefined ) {

              // Update the Payment Details for the Client
              Invoice.update({id: id}, d, function(){
                // Reduce the list of pending Registrations
                $scope.unpaidInvoices = _.reject($scope.unpaidInvoices, function(r){ return r._id===id; });
                blocker.clear();
              });

           } else {

              if (d.Error !== 'No Transaction Record') {

                blocker.clear();
                $scope.status = { message: d.Error, type: 'danger' };
              }
           }
        });
      };
}]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('myInvoices', {
        url: '/my_invoices',
        templateUrl: 'app/myInvoices/myInvoices.html',
        controller: 'MyInvoicesCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
    .controller('ModalInstanceCtrl', ["$scope", "$modalInstance", "slides", function ($scope, $modalInstance, slides) {

    $scope.slides = slides;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.selectBag = function(index) {
        $modalInstance.close($scope.slides[index]);
    };
}])
  .controller('MyRegistrationsCtrl', ["$scope", "$http", "Registration", "blocker", "$auth", "$rootScope", "Invoice", "$sessionStorage", "$state", "$modal", "Bags", function ($scope, $http, Registration, blocker, $auth, $rootScope, Invoice, $sessionStorage, $state, $modal, Bags) {

        Bags.query({}, function(data) {
            $scope.slides = data;
            var selection = _.find($scope.slides, function(bag){
                return bag.name === $rootScope.$user.bag;
            });
            $scope.imageUrl = selection?selection.image : '';
        });

        $scope.pickBag = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'components/modal/modal.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    slides: function () {
                        return $scope.slides;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                var selection = new Bags();
                selection.details = selectedItem;
                selection.$choose().then(function(data) {
                    $rootScope.$user = data;
                    $scope.imageUrl = selectedItem.image;
                });
            });
        };

      $scope.status = {};

      $scope.isGroup = function() {
        return $auth.isAuthenticated() && $auth.getPayload().accountType==='group';
      };

      $scope.newReg = function(reg) {
        var cnf = window.confirm('This would create a new payment invoice for you. Do you want to continue?');

        if (cnf) {

          if ($scope.pendingRegistrations.length > 0) {

            $scope.status = { message: 'We cannot create a new Invoice for you because you still have pending Invoices. If you have a pending Bank Payment, please allow 24 hours for us to reconcile and update the status. Thank You.', type: 'danger' };

          } else {

            // Create a new Registration from the Old one
            Registration.clone({id: reg._id}, reg, function(registrationData){
              $sessionStorage.lpRegistrant = registrationData;
              $state.go('invoice');
            });
          }
        }
      };

      $scope.showBank = function(r) {
        $sessionStorage.lpRegistrant = r;
        $state.go('bankPay');
      };

      $scope.getRegistrations = function() {
        blocker.block();
          var params = {};

          if ($rootScope.isGroup()) {
              params.isGroup = $rootScope.isGroup();
          }

        Registration.query(params, function(data) {

          $scope.paidRegistrations = _.flatten(_.filter(data, function(r) { return r.statusConfirmed && r.paymentSuccessful; }));
          $scope.pendingRegistrations = _.flatten(_.filter(data, function(r) { return !r.responseGotten && (r.webpay || r.bankpay); }));
          $scope.failedRegistrations = _.filter(data, function(r) { return r.responseGotten && !r.paymentSuccessful; });

          $scope.registrations = data;

          $scope.regIds = _.map(data, function(r){ return r._id; });

          if (!$scope.isGroup()) {
            _.each($scope.pendingRegistrations, function(r) { if (r.webpay) { $scope.updateRecord(r._id); } } );
          }

          if ($scope.paidRegistrations.length) {
            $scope.showPayStatus($scope.paidRegistrations[0]);
              if (!$scope.isGroup()) {
                  $rootScope.confirmedUser = true;
              }
          }

          blocker.clear();
        });
      };

      $scope.getInvoices = function() {
          Invoice.query(function(invoices) {

            if ($rootScope.isGroup()) {

              $scope.invoices = invoices;
              $scope.paidInvoices = _.filter(invoices, function(i) { return i.paymentSuccessful; });
              $scope.paidRegistrations = _.flatten(_.map($scope.paidInvoices, function(i) { return i.registrations; }));
              $scope.paidRegIds = _.map($scope.paidRegistrations, function(r){ return r._id; });
              var myIds = _.difference($scope.regIds, $scope.paidRegIds);

              $scope.unpaidRegistrations = _.filter($scope.registrations, function(reg){ return myIds.indexOf(reg._id) > -1; });

            }

          });
      };

      $scope.getRegistrations();
      $scope.getInvoices();

      $scope.writeInvoice = function(data) {

        var cnf = window.confirm('Are you sure you want to generate an Invoice now?'),
            registrationIds = _.map(data, function(obj){ return obj._id; });

        if (cnf) {
          var inv = new Invoice({ registrations: registrationIds });

          blocker.block('table');

          inv.$save().then(function(invoiceData) {

            $state.go('groupInvoice', { invoiceId: invoiceData._id });

          }, function(err){

            $scope.status = { message: err.data.message, type: 'danger' };
            
          });
        }

      };

      $scope.cancelReg = function(regId) {
        var cnf = window.confirm('Are you sure you want to delete this registration?');

        if (cnf) {
          blocker.block();

          Registration.delete({id: regId }, function(){
            $scope.status = { message: 'Registration deleted successfully!', type: 'success' };
            $scope.getRegistrations();
          });
        }
        
      };

      $scope.getGroupFee = function(group) {
        return _.reduce(group, function(result, reg) { return result + reg.conferenceFee; }, 0);
      };

      $scope.showPayStatus = function (selected) {
    		$scope.selectedReg = selected;
    		$scope.showPay = true;
    	};

      $scope.updateRecord = function(id, now) {

        blocker.block();

        $http.post('/api/registrations/webPayStatus', {_id: id}, {
          transformResponse:function(data) {
            /*jshint camelcase: false */
            /*global X2JS */
            var x2js = new X2JS();
            var json = x2js.xml_str2json( data );
            return json;
          }
        }).success(function(d){
           d = d.CIPG;

           if (d.Error === undefined ) {

              d.responseGotten = true;

              // Update the Payment Details for the Client
              Registration.update({id: id}, d, function(){
                // Reduce the list of pending Registrations
                $scope.pendingRegistrations = _.reject($scope.pendingRegistrations, function(r){ return r._id===id; });
              });

           } else {

              if (d.Error === 'No Transaction Record') {

                if (now) {
                  // Allow Payment to Proceed on this as it's not been sent to the switch yet
                  var theReg = _.find($scope.pendingRegistrations, function(r){ return r._id===id; });
                  $sessionStorage.lpRegistrant = theReg;
                  $state.go('webpay');
                }

                // Update the Payment Details for the Client
                //Registration.update({id: id}, {responseGotten:true}, function(){
                  
                //});

              } else {
                $scope.status = { message: d.Error, type: 'danger' };
              }
           }
        });
      };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('myRegistrations', {
        url: '/registrations',
        templateUrl: 'app/myRegistrations/myRegistrations.html',
        controller: 'MyRegistrationsCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
.controller('MySessionsCtrl', ["$scope", "$state", "Sessions", "$rootScope", function ($scope, $state, Sessions, $rootScope) {

    $rootScope.confirmedUser = true;

    Sessions.query({me:true}, function(mySessions){
        $scope.sessions = mySessions;
    });
}]);

'use strict';

angular.module('nbaAgc2App')
.config(["$stateProvider", function ($stateProvider) {
$stateProvider
    .state('my_sessions', {
        requireLogin: true,
        url: '/my_sessions',
        templateUrl: 'app/my_sessions/my_sessions.html',
        controller: 'MySessionsCtrl'
    })
    .state('session_detail', {
        requireLogin: true,
        url: '/my_sessions/:id',
        templateUrl: 'app/my_sessions/my_sessions.html',
        controller: 'MySessionsCtrl'
    });
}]);
'use strict';

angular.module('nbaAgc2App')
  .controller('OthersFormCtrl', ["$scope", "$state", "$sessionStorage", "Registration", "blocker", "$anchorScroll", "$rootScope", function ($scope, $state, $sessionStorage, Registration, blocker, $anchorScroll, $rootScope) {

        $anchorScroll();

        // If any other type of Registration is on-going, re-direct to it
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined){

            blocker.block();

            if ($sessionStorage.lpRegistrant.registrationType==='others') {

                Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                    $scope.data = d;
                    $scope.nextForm = true;

                    blocker.clear();
                });
            } else {
                $state.go($sessionStorage.lpRegistrant.registrationType);
            }
        } else {
            $sessionStorage.$reset();
            $scope.data = {
                registrationType: 'others',
                member: ''
            };
        }

        var k, results;
        $scope.years = (function() {
            results = [];
            for (k = 2010; k >= 1960; k--){ results.push(k); }
            return results;
        }).apply(this);

        $scope.startReg = function() {

            var cnf = window.confirm('Is this information correct?');

            if (cnf) {

                blocker.block();

                if ($rootScope.isAuthenticated()) { $scope.data.owner = $rootScope.$user.sub; $scope.data.isGroup = true; }

                var reg = new Registration($scope.data);
                reg.$save().then(function(registrationData) {

                    $sessionStorage.lpRegistrant = registrationData;
                    $scope.data = registrationData;

                    $scope.nextForm = true;

                    blocker.clear();
                });
            }
        };

        $scope.reviewForm = function(form1, form2) {

            if (form1.$valid && form2.$valid) {

                var cnf = window.confirm('Are you sure you want to submit this form?');
                if (cnf) {

                    blocker.block();

                    $scope.data.formFilled = true;

                    // Update the Registration Information
                    Registration.update({id: $scope.data._id}, $scope.data, function(){
                        if ($rootScope.isGroup()) { $sessionStorage.$reset(); $state.go('myRegistrations'); }
                        $state.go('invoice');
                    });
                }
            } else {

                window.alert('All fields marked * are required. Please fill in all fields before submitting.');

                $anchorScroll();
            }
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('others', {
        url: '/OTHERS',
        templateUrl: 'app/othersForm/othersForm.html',
        controller: 'OthersFormCtrl'
      })
      .state('othersUpdate', {
        url: '/OTHERS/:registrationId',
        templateUrl: 'app/othersForm/othersForm.html',
        controller: 'FormEditorCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .directive('panelHeader', function () {
    return {
      templateUrl: 'app/panelHeader/panelHeader.html',
      restrict: 'EA',
      scope: {
        title: '@',
        'class': '@'
      }
    };
  });
'use strict';

angular.module('nbaAgc2App')
  .controller('PapersCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('papers', {
        url: '/papers',
        templateUrl: 'app/papers/papers.html',
        controller: 'PapersCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('ProfileCtrl', ["$scope", "$auth", "$state", "$http", "blocker", function ($scope, $auth, $state, $http, blocker) {
    
    	if (!$auth.isAuthenticated()) {
    		$state.go('myaccount');
    	} else {
    		blocker.clear();

    		console.log($auth.getPayload());

    		$http.get('/api/registrations/me', function (registrations) {
    			console.log(registrations);

    			blocker.clear();
    		});
    	}
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl',
        sp: {
            authenticate: true
        }
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('RecoverPasswordCtrl', ["$scope", "$http", "blocker", function ($scope, $http, blocker) {
    	
  		$scope.user = {};

  		$scope.dorecovery = function(recForm) {

  			if (recForm.$valid) {

          blocker.block('#theForm');

  				$http.post('/auth/recoverPassword', $scope.user)
  				.success(function(){

  					$scope.submitted = true;

            $scope.user = {};

            recForm.$setPristine();
            recForm.$setUntouched();

            blocker.clear();

  				})
  				.error(function(d){

  					$scope.error = d.message;
            blocker.clear();

  				});
  			} else {

  				window.alert('Please fill in your registered email address!');
  			}

  		};
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('recoverPassword', {
        url: '/myaccount/password_recovery',
        templateUrl: 'app/recoverPassword/recoverPassword.html',
        controller: 'RecoverPasswordCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('RegisterCtrl', ["$scope", "$auth", "blocker", function ($scope, $auth, blocker) {

    $scope.master = {};
  	
  	$scope.doSignUp = function(formName) {
  		if (formName.$valid) {

  			blocker.block('#theForm');

  			$scope.user.accountType = 'group';
  			$auth.signup($scope.user).then(function() {

                $scope.status = {
                	message: 'Registration Successful. Please proceed to login.',
                	type: 'success'
                };

                $scope.user = angular.copy($scope.master);

                formName.$setPristine();
                formName.$setUntouched();
                
                blocker.clear();

            }, function(err) {

            	$scope.status = {
                	message: err.data.message,
                	type: 'danger'
                };
                
                blocker.clear();

            });

  		} else {

  		}
  	};
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('register', {
        url: '/create_account',
        templateUrl: 'app/register/register.html',
        controller: 'RegisterCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('RegisterAsCtrl', ["$scope", "$anchorScroll", function ($scope, $anchorScroll) {
  	/*jQuery('html, body').animate({
        scrollTop: $('#site-body').offset().top
    }, 1000);*/
  	$anchorScroll();
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('registerAs', {
        url: '/register',
        templateUrl: 'app/registerAs/registerAs.html',
        controller: 'RegisterAsCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .service('Registration', ["$resource", function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return $resource('/api/registrations/:id', null,
            {
                'update': { method:'PUT' },
                'clone': { method:'POST' },
            });
  }]);

'use strict';

angular.module('nbaAgc2App')
  .directive('repeatPassword', function () {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl) {
        var otherInput = elem.inheritedData('$formController')[attrs.repeatPassword];

        ctrl.$parsers.push(function(value) {
          if (value === otherInput.$viewValue) {
            ctrl.$setValidity('repeat', true);
            return value;
          }
          ctrl.$setValidity('repeat', false);
        });

        otherInput.$parsers.push(function(value) {
          ctrl.$setValidity('repeat', value === ctrl.$viewValue);
          return value;
        });
      }
    };
  });
'use strict';

function toPay(v) {
    return v;
}

angular.module('nbaAgc2App')
    .controller('SuccessCtrl', ["$scope", "$sessionStorage", "$state", "$stateParams", "Registration", "Invoice", "AccessCheck", "blocker", "$anchorScroll", function($scope, $sessionStorage, $state, $stateParams, Registration, Invoice, AccessCheck, blocker, $anchorScroll) {

        $anchorScroll();

        $scope.postFetchCallback = function(amountDue, theType) {
            AccessCheck.postSuccess($stateParams.OrderID, toPay(amountDue), function(d) {

                blocker.clear();
                d = d.CIPG;

                // Prevent User from restarting Transaction
                $sessionStorage.$reset();

                if (['00', '0', '001', 'APPROVED'].indexOf(d.ResponseCode) !== -1) {
                
                    $scope.message = 'Your Payment was SUCCESSFUL';

                    $scope.transactionReference = d.TransactionRef;
                    $scope.paymentReference = d.PaymentRef;
                    $scope.orderID = d.OrderID;
                    $scope.merchantID = d.MerchantID;
                    $scope.paymentGate = d.PaymentGateway;
                    $scope.status = d.Status;
                    $scope.responseDescription = d.ResponseDescription;

                    d.completed = true;
                    d.responseGotten = true;
                    d.DateTime = d.Date;

                    // Update the Payment Details for the Client
                    if (theType==='single') { Registration.update({id: $scope.data._id}, d); }
                    else { Invoice.update({id: $scope.data._id}, d); }

                } else {

                    blocker.block();

                    d.paymentSuccessful = false;
                    d.responseGotten = true;
                    d.DateTime = d.Date;

                    if (theType==='single') {
                        Registration.update({id: $scope.data._id}, d, function(){
                            blocker.clear();
                            window.alert('Transaction Failed!');
                        });
                    } else {
                        Invoice.update({id: $scope.data._id}, d, function(){
                            blocker.clear();
                            window.alert('Transaction Failed!');
                        });
                    }
                }

            });
        };

        // Get the Data from the DB
        if (($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) || ($sessionStorage.activeGroupInvoice)) {

            blocker.block();

            if ($sessionStorage.activeGroupInvoice) {
                // Group Payment
                Invoice.get({ id: $sessionStorage.activeGroupInvoice }, function (d) {
                    $scope.data = d;
                    $scope.data.email = d._group.email;

                    $scope.postFetchCallback($scope.data.invoiceAmount, 'group');
                }, function(){
                    window.alert('Invoice not found! Please contact support!');
                });
            } else {
                // Single Payment
                Registration.get({ id: $sessionStorage.lpRegistrant._id }, function (d) {
                    $scope.data = d;
                    $scope.postFetchCallback($scope.data.conferenceFee, 'single');
                }, function(){
                    window.alert('Registration data not found. Please contact support!');
                });
            }
        } else {
            $scope.message = 'Session Expired. Transaction Record Unavailable! Please login with the details we sent to the email address you provided during the registration.';
        }
    }])

.controller('CancelledCtrl', ["$scope", "$sessionStorage", "$state", "$stateParams", "Registration", "Invoice", "AccessCheck", "message", "blocker", "$anchorScroll", function($scope, $sessionStorage, $state, $stateParams, Registration, Invoice, AccessCheck, message, blocker, $anchorScroll) {

    $anchorScroll();

    $scope.postFetchCallback = function(amountDue, theType) {
        AccessCheck.postSuccess($stateParams.OrderID, toPay(amountDue), function(d){

            d = d.CIPG;

            if (['00', 'APPROVED'].indexOf(d.ResponseCode) === -1) {
                $scope.message = message;

                $scope.transactionReference = d.TransactionRef;
                $scope.paymentReference = d.PaymentRef;
                $scope.orderID = d.OrderID;
                $scope.merchantID = d.MerchantID;
                $scope.paymentGate = d.PaymentGateway;
                $scope.status = d.Status;
                $scope.responseDescription = d.ResponseDescription;

                d.paymentSuccessful = false;
                d.responseGotten = true;
                d.DateTime = d.Date;

                if (theType==='single') {
                    Registration.update({id: $scope.data._id}, d, function(){
                        $sessionStorage.$reset();
                        blocker.clear();
                    });
                } else {
                    Invoice.update({id: $scope.data._id}, d, function(){
                        $sessionStorage.$reset();
                        blocker.clear();
                    });
                }
            }

        });
    };

    // Get the Data from the DB
    if (($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) || ($sessionStorage.activeGroupInvoice)) {

        blocker.block();

        if ($sessionStorage.activeGroupInvoice) {

            // Group Payment
            Invoice.get({ id: $sessionStorage.activeGroupInvoice }, function (d) {
                $scope.data = d;
                $scope.data.email = d._group.email;

                $scope.postFetchCallback($scope.data.invoiceAmount, 'group');
            }, function(){
                window.alert('Invoice not found! Please contact support!');
            });
        } else {

            // Check if the User has filled the form
            Registration.get({id: $sessionStorage.lpRegistrant._id}, function (d) {
                $scope.data = d;
                $scope.postFetchCallback($scope.data.conferenceFee, 'single');
            }, function(){
                window.alert('Registration data not found! Please contact support!');
            });
        }
    } else {
        $scope.message = 'Session Expired. Transaction Record Unavailable! Please login with the details we sent to the email address you provided during the registration.';
    }
}])

  .controller('WebpayCtrl', ["$scope", "$sessionStorage", "Registration", "$state", "$auth", "blocker", "$anchorScroll", function ($scope, $sessionStorage, Registration, $state, $auth, blocker, $anchorScroll) {

        $anchorScroll();

        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {

            blocker.block();

            // Check if the User has filled the form
            Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
                if (!$scope.data.formFilled){
                    $state.go($scope.data.registrationType);
                }

                $sessionStorage.lpRegistrant = d;

                blocker.clear();

            });
        } else {
            $state.go('main');
        }

        /*$scope.markComplete = function(r) {

            blocker.block();

            $auth.signup(r).then(function(response) {
                console.log(response.data);

                r.completed = true;
                Registration.update({id: $scope.data._id}, r, function(){
                    window.alert('Account created. Please proceed to payment.');
                });

                blocker.clear();

            }, function(err){
                window.alert(err.data.message);
                blocker.clear();
            });
        };*/

        $scope.back = function() {
            $state.go('invoice');
        };

        $scope.getName = function () {
            if (!$scope.data){
                return '';
            }
            return $scope.data.firstName+' '+$scope.data.middleName+' '+$scope.data.surname;
        };

        $scope.toPay = toPay;
  }]);
'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('webpay', {
        url: '/invoice/webpay',
        templateUrl: 'app/webpay/webpay.html',
        controller: 'WebpayCtrl'
      })
      .state('paySuccess', {
        url: '/success?OrderID&TransactionReference',
        templateUrl: 'app/webpay/success.html',
        controller: 'SuccessCtrl'
      })
      .state('payPending', {
        url: '/pending/?OrderID&TransactionReference',
        templateUrl: 'app/webpay/cancelled.html',
        controller: 'CancelledCtrl',
        resolve: {
            message: function() {
                return 'Your Payment is PENDING';
            }
        }
      })
      .state('payFailed', {
        url: '/failed?OrderID&TransactionReference',
        templateUrl: 'app/webpay/cancelled.html',
        controller: 'CancelledCtrl',
        resolve: {
            message: function() {
                return 'Your Payment Attempt FAILED';
            }
        }
      })
      .state('payCancelled', {
        url: '/cancelled?OrderID&TransactionReference',
        templateUrl: 'app/webpay/cancelled.html',
        controller: 'CancelledCtrl',
        resolve: {
            message: function() {
                return 'Your Payment was CANCELLED';
            }
        }
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('FooterCtrl', ["$scope", function ($scope) {
    $scope.theYear = new Date().getFullYear();
  }]);

'use strict';

angular.module('nbaAgc2App')
  .factory('Modal', ["$rootScope", "$modal", function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      }
    };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .controller('NavbarCtrl', ["$scope", "$location", "$auth", "$state", "$sessionStorage", function ($scope, $location, $auth, $state, $sessionStorage) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.u = $auth.getPayload();

    $scope.logout = function() {
        var cnf = window.confirm('Are you sure you want to end your session?');
        if (cnf) {
            $auth.logout();
            $sessionStorage.$reset();
            $state.go('main');
        }
    };
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('RightInfoCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('nbaAgc2App')
  .controller('SidebarCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

angular.module('nbaAgc2App').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/access_bank_test/access_bank_test.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-10 col-md-offset-1\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>ACCESS BANK - PAYMENT TEST <button class=\"btn btn-danger pull-right text-white btn-xs\" ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button></div></div><div class=panel-body><form method=post name=dataForm><div class=\"alert alert-info\">Fields marked <span class=required>*</span> are required!</div><div class=row><div class=col-md-6><div class=form-group><label for=surname>Surname <span class=required>*</span></label><input class=form-control name=surname id=surname ng-model=data.surname placeholder=Surname required></div></div><div class=col-md-6><div class=form-group><label for=firstName>First Name <span class=required>*</span></label><input class=form-control name=firstName id=firstName ng-model=data.firstName placeholder=\"First Name\" required></div></div></div><div class=form-group><label>Conference Fee</label><div class=\"form-price label label-primary\">NGN 100.00</div></div><div ng-hide=nextForm><button class=\"btn-block btn btn-primary\" ng-click=startReg() ng-disabled=dataForm.$invalid><i class=\"fa fa-play\"></i> NEXT</button></div></form><form method=post name=dataForm2 ng-show=nextForm><div class=form-group><label for=mobile>Mobile Phone <span class=required>*</span> <small class=text-muted>eg: 08031231234</small></label><input class=form-control type=tel name=mobile id=mobile ng-model=data.mobile placeholder=\"Mobile Phone Number\" ng-minlength=11 ng-maxlength=11 required> <span class=\"help-block label label-danger\" ng-show=\"dataForm2.mobile.$dirty && dataForm2.mobile.$error.required\">Valid phone number is required</span> <span class=\"help-block label label-danger\" ng-show=\"((dataForm2.mobile.$error.minlength || dataForm2.mobile.$error.maxlength) && dataForm.mobile.$dirty) \">Mobile Phone Number should be 11 digits</span></div><div class=form-group><label for=email>Email Address <span class=required>*</span> <em class=text-danger>Please provide a valid email address.</em></label><input type=email class=form-control name=email id=email ng-model=data.email placeholder=\"Email Address\" required> <span class=\"help-block label label-danger\" ng-show=\"dataForm.email.$error.required || dataForm.email.$error.invalidEmail\">Please provide a valid email address</span></div><hr><div class=row><div class=\"col-sm-6 col-xs-6\" ng-hide=editing><button class=\"btn btn-danger btn-block hidden-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button> <button class=\"btn btn-danger btn-block visible-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL</button></div><div class=\"col-sm-6 col-xs-6\" ng-show=editing><a class=\"btn btn-warning btn-block\" ui-sref=myRegistrations><i class=\"fa fa-edit\"></i> CANCEL EDIT</a></div><div class=\"col-sm-6 col-xs-6\"><button type=submit class=\"btn btn-block btn-success\" ng-click=\"reviewForm(dataForm, dataForm2)\"><i class=\"fa fa-play\"></i> NEXT <i class=\"fa fa-check\"></i></button></div></div></form></div></div></div><!--<div ng-include=\"'components/rightInfo/rightInfo.html'\" class=\"col-sm-4\"></div>--></div></div>"
  );


  $templateCache.put('app/attendees/attendees.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=\"container session-container\"><div class=row><div class=col-md-9><h2>CONFERENCE ATTENDEES</h2><div class=row><div class=col-md-12><div class=\"alert alert-success\"><h4>COMING SOON</h4></div></div></div></div><div ng-include=\"'components/sidebar/sidebar.html'\" class=col-md-3></div></div></div><div ng-include=\"'components/footer/footer.html'\"></div>"
  );


  $templateCache.put('app/bankPay/bankPay.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-md-6><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>PAYMENT INVOICE<div class=\"pull-right hidden-print\"><button type=button class=\"btn btn-danger btn-xs\" ng-click=back()><i class=\"fa fa-arrow-left\"></i> GO BACK</button> - <button type=button class=\"btn btn-primary btn-xs\" onclick=window.print()><i class=\"fa fa-print\"></i> PRINT</button></div></div></div><div class=panel-body><table class=\"table table-bordered table-striped\"><tr class=space><td style=\"width: 50%\"></td><td style=\"width: 50%\"></td></tr><tr><th class=text-right>REGISTRATION CODE</th><th><strong>{{data.regCode}}-{{data.conferenceFee}}</strong></th></tr><tr><th class=text-right>Depositor's Full Name</th><th class=text-uppercase>{{data.regCode}}-{{data.conferenceFee}} {{data.firstName}} {{data.surname}}</th></tr><tr><th class=text-right>Depositor's Contact Telephone Number</th><th class=text-uppercase>{{data.mobile}}</th></tr><tr><th class=text-right>BANK</th><th class=text-uppercase>ACCESS BANK</th></tr><tr><th class=text-right>ACCOUNT NAME</th><th class=text-uppercase>NBA-AGC Account</th></tr><tr><th class=text-right>ACCOUNT NUMBER</th><th class=text-uppercase>0 6 9 5 1 7 6 4 9 5</th></tr><tr><th class=text-right>Conference Fees:</th><th><strong>NGN {{ data.conferenceFee.formatMoney(2) }}</strong></th></tr><tr class=hidden-print><td colspan=2 class=text-center><button ng-hide=data.completed ng-click=markComplete(data) class=\"btn-block btn btn-success\" type=button><i class=\"fa fa-check\"></i> CONFIRM REGISTRATION</button></td></tr></table><button class=\"btn btn-success btn-block\" ng-click=completeReg() ng-show=\"channelChosen() && !isAuthenticated()\">FINISH REGISTRATION</button><br><h4 class=\"text-center text-success hidden-print\">Below's what your name tag looks like</h4><br><div class=\"panel panel-default hidden-print\"><div class=\"panel-body name-tag\"><h5 class=text-center ng-bind=data.prefix ng-hide=\"data.prefix.toLowerCase().indexOf('mr')>=0\"></h5><h3 class=text-center>{{getName(data)}} <small ng-bind=data.suffix></small></h3><hr><div ng-show=\"data.registrationType!='judge'&&data.registrationType!='magistrate'\"><p class=text-center><strong>{{data.company}}</strong></p></div><div ng-show=\"data.registrationType=='judge'||data.registrationType=='magistrate'\"><p class=text-center><strong>{{data.court}} {{data.state}} {{data.division}}</strong></p></div></div></div></div></div></div><div class=col-md-6><div class=\"panel panel-default\"><div class=panel-body><div class=\"alert alert-info hidden-print\"><strong>All payments MUST be made to the nearest Access Bank branch</strong></div><!--<div class=\"alert alert-info hidden-print\">\n" +
    "                        Clicking on \"Confirm Registration\" would finalize this registration. An email would be sent\n" +
    "                        to you containing details of this registration and details of how to access conference\n" +
    "                        information\n" +
    "                    </div>--><img ng-src=assets/images/slip.jpg style=\"max-width: 100%; margin-bottom: 15px\"><br><div class=\"alert alert-info hidden-print no-margin\">Please fill your bank teller using the information on the left side of your screen. <strong>All payments MUST be made to the nearest Access Bank branch</strong>. If you'd be making direct transfer to the Bank Account listed below, please <b class=text-uppercase>include the Order id in your Payment description or Narration</b></div></div></div></div></div></div>"
  );


  $templateCache.put('app/benchForm/benchForm.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-10 col-md-offset-1\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>SENIOR ADVOCATES, ATTORNEY GENERALS AND BENCHERS <button class=\"btn btn-danger pull-right text-white btn-xs\" ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button></div></div><div class=panel-body><form method=post name=dataForm><div class=\"alert alert-info\">Fields marked <span class=required>*</span> are required!</div><div class=row><div class=col-md-2><div class=form-group><label for=prefix>Prefix <span class=required>*</span></label><input name=prefix id=prefix ng-model=data.prefix class=form-control required autofocus placeholder=\"Mr, Mrs, Chief, Dr, etc\"></div></div><div class=col-md-3><div class=form-group><label for=surname>Surname <span class=required>*</span></label><input class=form-control name=surname id=surname ng-model=data.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middleName>Middle Name</label><input class=form-control name=middleName id=middleName ng-model=data.middleName placeholder=\"Middle Name\"></div></div><div class=col-md-3><div class=form-group><label for=firstName>First Name <span class=required>*</span></label><input class=form-control name=firstName id=firstName ng-model=data.firstName placeholder=\"First Name\" required></div></div><div class=col-md-2><div class=form-group><label for=suffix>Suffix</label><input name=suffix id=suffix ng-model=data.suffix class=form-control placeholder=\"SAN, MNI, MON, CON, GCON, etc.\"></div></div></div><div class=row><div class=col-md-3><div class=form-group><label for=yearCalled>Year of Call to Bar <span class=required>*</span></label><select class=form-control name=yearCalled ng-model=data.yearCalled id=yearCalled required><option ng-repeat=\"y in years\">{{y}}</option></select></div></div><div class=col-md-4><div class=form-group><label for=branch>NBA Branch <span class=required>*</span></label><input class=form-control name=branch id=branch ng-model=data.branch required></div></div><div class=col-md-5><div class=form-group><label>Conference Fee</label><div class=\"form-price label label-primary\">NGN 100,000.00</div></div></div></div><div ng-hide=\"nextForm || (!dataForm.firstName.$dirty && !dataForm.surname.$dirty && !dataForm.prefix.$dirty)\" class=row><hr><div class=\"col-md-6 col-md-offset-3 col-sm-12\"><h4 class=\"text-center text-success\">Below's what your name tag looks like</h4><br><div class=\"panel panel-default\"><div class=\"panel-body name-tag\"><h5 class=text-center ng-bind=data.prefix ng-hide=\"data.prefix.toLowerCase().indexOf('mr')>=0\"></h5><h3 class=text-center>{{data.firstName}} {{data.surname}} <small ng-bind=data.suffix></small></h3></div></div></div></div><div class=form-group><label class=checkbox-inline><input type=checkbox ng-model=data.group.san> Senior Advocate of Nigeria</label><label class=checkbox-inline><input type=checkbox ng-model=data.group.ag> Attorney General</label><label class=checkbox-inline><input type=checkbox ng-model=data.group.bencher> Life Bencher</label></div><div ng-hide=nextForm><button class=\"btn-block btn btn-primary\" ng-click=startReg() ng-disabled=dataForm.$invalid><i class=\"fa fa-play\"></i> CONTINUE</button></div></form><form method=post name=dataForm2 ng-show=nextForm><div class=row><div ng-class=\"{'col-sm-6': data.group.bencher||data.group.ag, 'col-sm-12': !data.group.bencher&&!data.group.ag}\"><div class=form-group><label for=company>Firm / Organization <span class=required>*</span></label><input class=form-control name=company id=company ng-model=data.company placeholder=\"Firm / Organization\" required></div></div><div class=col-sm-6 ng-show=\"data.group.bencher || data.group.ag\"><div class=form-group><label for=_state>State</label><input class=form-control name=state id=_state ng-model=data.state placeholder=State></div></div></div><div class=form-group><label for=address>Address</label><input class=form-control name=address id=address ng-model=data.address placeholder=Address></div><div class=row><div class=col-md-6><div class=form-group><label for=mobile>Mobile Phone <span class=required>*</span> <small class=text-muted>eg: 08031231234</small></label><input class=form-control type=tel name=mobile id=mobile ng-model=data.mobile placeholder=\"Mobile Phone Number\" ng-minlength=11 ng-maxlength=11 required> <span class=\"help-block label label-danger\" ng-show=\"dataForm2.mobile.$dirty && dataForm2.mobile.$error.required\">Valid phone number is required</span> <span class=\"help-block label label-danger\" ng-show=\"((dataForm2.mobile.$error.minlength || dataForm2.mobile.$error.maxlength) && dataForm2.mobile.$dirty) \">Mobile Phone Number should be 11 digits</span></div></div><div class=col-md-6><div class=form-group><label for=phone>Office Telephone Number</label><input class=form-control type=tel name=phone id=phone ng-model=data.phone placeholder=\"Office Phone Number\"></div></div></div><div class=form-group><label for=email>Email Address <span class=required>*</span> <em class=text-danger>Please provide a valid email address.</em></label><input type=email class=form-control name=email id=email ng-model=data.email placeholder=\"Email Address\" required> <span class=\"help-block label label-danger\" ng-show=\"dataForm.email.$error.required || dataForm.email.$error.invalidEmail\">Please provide a valid email address</span></div><!--<div class=\"row\">\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"emergency\">Emergency Contact Name</label>\n" +
    "                                    <input class=\"form-control\" type=\"text\" name=\"e_name\" id=\"emergency\"\n" +
    "                                           ng-model=\"data.emergencyContact\"\n" +
    "                                           placeholder=\"Emergency Contact Name\" >\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"e_phone\">Emergency Contact Number</label>\n" +
    "                                    <input class=\"form-control\" type=\"tel\" name=\"e_phone\" id=\"e_phone\"\n" +
    "                                           ng-model=\"data.emergencyPhone\"\n" +
    "                                           placeholder=\"Emergency Contact Number\" >\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>--><hr><div class=row><div class=\"col-sm-6 col-xs-6\" ng-hide=editing><button class=\"btn btn-danger btn-block hidden-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button> <button class=\"btn btn-danger btn-block visible-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL</button></div><div class=\"col-sm-6 col-xs-6\" ng-show=editing><a class=\"btn btn-warning btn-block\" ui-sref=myRegistrations><i class=\"fa fa-edit\"></i> CANCEL EDIT</a></div><div class=\"col-sm-6 col-xs-6\"><button type=submit class=\"btn btn-block btn-success\" ng-click=\"reviewForm(dataForm, dataForm2)\"><i class=\"fa fa-play\"></i> NEXT <i class=\"fa fa-check\"></i></button></div></div></form></div></div></div><!--<div ng-include=\"'components/rightInfo/rightInfo.html'\" class=\"col-sm-4\"></div>--></div></div>"
  );


  $templateCache.put('app/conference_sessions/conference_sessions.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=\"container session-container\"><div class=row><div class=col-md-9><h2>CONFERENCE PROGRAMME</h2><div class=row><div class=col-md-12><div class=\"alert alert-success\"><h4>COMING SOON</h4></div></div></div></div><div ng-include=\"'components/sidebar/sidebar.html'\" class=col-md-3></div></div></div><div ng-hide=true class=\"container session-container\"><div class=row><div class=col-md-9><div class=row><div class=col-md-12 ng-repeat=\"s in sessions\"><div class=\"panel panel-default\"><div class=panel-body><h4 class=text-ellipsis title={{s.session.title}}>{{s.title}}<button class=\"pull-right btn-xs btn btn-info\">{{formatDate(s.start_time, 'weekday') }}</button></h4><div class=\"btn-group btn-group-justified\" role=group><div class=btn-group role=group><button class=\"btn btn-primary\">{{formatDate(s.start_time, 'time')}}</button></div><div class=btn-group role=group><button class=\"btn btn-primary\">{{formatDate(s.end_time,'time')}}</button></div></div></div><div class=panel-footer><a class=\"btn btn-success btn-block\" ui-sref=\"conference_session_detail({id: s._id})\">View Details</a></div></div></div></div></div><div ng-include=\"'components/sidebar/sidebar.html'\" class=col-md-3></div></div></div><div ng-include=\"'components/footer/footer.html'\"></div>"
  );


  $templateCache.put('app/conference_speakers/conference_speakers.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=\"container session-container\"><div class=row><div class=col-md-9><h2>CONFERENCE SPEAKERS</h2><div class=row><div class=col-md-12><div class=\"alert alert-success\"><h4>COMING SOON</h4></div></div></div></div><div ng-include=\"'components/sidebar/sidebar.html'\" class=col-md-3></div></div></div><div ng-include=\"'components/footer/footer.html'\"></div>"
  );


  $templateCache.put('app/doPasswordReset/doPasswordReset.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-md-6 col-md-offset-3\"><div class=\"panel panel-default\"><div class=panel-heading><div class=\"panel-title text-center\"><b>PASSWORD RESET</b></div></div><div class=panel-body id=theForm><div class=\"alert alert-info\" ng-show=showForm>Please Enter your new NBA AGC Portal Password!</div><div class=\"alert alert-danger\" ng-show=error.length>{{error}}</div><div class=\"alert alert-success\" ng-show=info.length>{{info}}</div><form ng-submit=\"resetForm.$valid && resetPassword(resetForm)\" name=resetForm ng-show=showForm><div class=form-group ng-class=\"{ 'has-success' : resetForm.password.$valid && resetForm.password.$dirty, 'has-error' : resetForm.password.$invalid && resetForm.password.$dirty }\"><input class=form-control type=password name=password ng-minlength=6 ng-model=password placeholder=Password required><div class=help-block ng-if=resetForm.password.$dirty><div class=text-danger ng-show=resetForm.password.$error.required>Password is required.</div><div class=text-danger ng-show=resetForm.password.$error.minlength>Password must be at least 6 characters long.</div></div></div><div class=form-group ng-class=\"{ 'has-success' : resetForm.confirmPassword.$valid && resetForm.confirmPassword.$dirty, 'has-error' : resetForm.confirmPassword.$invalid && resetForm.confirmPassword.$dirty }\"><input class=form-control type=password name=confirmPassword ng-model=confirmPassword repeat-password=password placeholder=\"Confirm Password\" required><div class=\"help-block text-danger\" ng-if=\"resetForm.confirmPassword.$dirty \"><div class=text-danger ng-show=resetForm.confirmPassword.$error.required>You must confirm password.</div><div class=text-danger ng-show=resetForm.confirmPassword.$error.repeat>Passwords do not match.</div></div></div><button class=\"btn btn-block btn-success\" ng-disabled=resetForm.$invalid type=submit><i class=\"fa fa-key\"></i> RECOVER PASSWORD</button></form></div></div><br><div class=\"alert alert-info\"><div class=row><div class=\"col-md-6 col-sm-12\"><a ui-sref=login class=\"btn-link pull-right\"><i class=\"fa fa-arrow-left\"></i> back to login</a></div><div class=\"col-md-6 col-sm-12\"><a ui-sref=recoverPassword class=btn-link><i class=\"fa fa-refresh\"></i> request password reset</a></div></div></div></div></div></div>"
  );


  $templateCache.put('app/groupInvoice/groupInvoice.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container ng-mask><div class=row><div class=\"col-sm-12 col-sm-8 col-md-offset-2\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>PAYMENT INVOICE</div></div><div class=panel-body><table ng-show=showGroup class=\"table table-striped table-bordered\"><tr><th class=\"text-center text-uppercase\" colspan=4>GROUP MEMBERS</th></tr><tr class=space><td colspan=4></td></tr><tr ng-repeat=\"m in invoice.registrations\"><td>{{$index+1}}.</td><td>{{getName(m)}}</td><td>{{m.mobile}}</td><td>NGN {{m.conferenceFee.formatMoney(2)}}</td></tr><tr class=\"hidden-print hidden\"><td colspan=4><button class=\"btn btn-block btn-danger\" ng-click=\"showGroup=false\"><i class=\"fa fa-arrow-up\"></i> Hide</button></td></tr></table><table class=\"table table-bordered table-striped\"><tr class=space><td colspan=4></td></tr><tr class=space><td colspan=4></td></tr><tr><th colspan=4 class=\"text-uppercase text-center\"><h4>{{invoice._group.groupName}}</h4></th></tr><tr><th colspan=2 class=text-right><h4>Members in Group:</h4></th><th colspan=2><h4>{{invoice.registrations.length}} <button class=\"hidden-print btn btn-xs\" ng-class=\"{'btn-success':!showGroup, 'btn-warning':showGroup}\" ng-click=\"showGroup=!showGroup\"><i class=\"fa fa-info-circle\"></i> {{showGroup?'Hide':'Show'}} Group Members</button></h4></th></tr><tr><th colspan=2 class=text-right><h4>Order ID:</h4></th><th colspan=2><h4>{{invoice.code+'-'+invoice.invoiceAmount}}</h4></th></tr><tr><th colspan=2 class=text-right><h4>Conference Fees:</h4></th><th colspan=2><h4>NGN {{ invoice.invoiceAmount.formatMoney(2) }}</h4></th></tr><tr class=hidden-print><td colspan=4 class=text-center><button type=button class=\"btn btn-danger\" ng-hide=invoice.finalized ng-click=deleteInvoice()><i class=\"fa fa-times-circle\"></i> CANCEL INVOICE</button> <button ng-click=\"markFinal('webpay')\" class=\"btn btn-success\" type=button><i class=\"fa fa-play\"></i> PAY ONLINE</button> <button ng-click=\"markFinal('bankpay')\" class=\"btn btn-primary\" type=button><i class=\"fa fa-anchor\"></i> PAY TO THE BANK</button> <button type=button class=\"btn btn-info\" onclick=window.print()><i class=\"fa fa-print\"></i> PRINT</button></td></tr></table></div></div><div class=\"alert alert-info hidden-print\" ng-show=pInfo><h3>Payment Instructions</h3><p>Where does the template get inserted? When a state is activated, its templates are automatically inserted into the ui-view of its parent state's template. If it's a top-level state—which 'contacts' is because it has no parent state–then its parent template is index.html. Right now, the 'contacts' state won't ever be activated. So let's see how we can activate a state. Activating a state</p></div></div><!--<div class=\"col-sm-5 hidden-print\" ng-include=\"'components/rightInfo/rightInfo.html'\"></div>--></div></div>"
  );


  $templateCache.put('app/group_pay/group_bank_pay.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-md-6><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>PAYMENT INVOICE<div class=\"pull-right hidden-print\"><button type=button class=\"btn btn-danger btn-xs\" ng-click=back()><i class=\"fa fa-arrow-left\"></i> GO BACK</button> - <button type=button class=\"btn btn-primary btn-xs\" onclick=window.print()><i class=\"fa fa-print\"></i> PRINT</button></div></div></div><div class=panel-body><table class=\"table table-bordered table-striped\"><tr class=space><td style=\"width: 50%\"></td><td style=\"width: 50%\"></td></tr><tr><th class=text-right>Depositor's Full Name</th><th class=text-uppercase>{{data.code}}-{{data.invoiceAmount}} {{data._group.groupName}}</th></tr><tr><th class=text-right>Depositor's Contact Telephone Number</th><th class=text-uppercase>{{data._group.phone}}</th></tr><tr><th class=text-right>BANK</th><th class=text-uppercase>ACCESS BANK</th></tr><tr><th class=text-right>ACCOUNT NAME</th><th class=text-uppercase>NBA-AGC Account</th></tr><tr><th class=text-right>ACCOUNT NUMBER</th><th class=text-uppercase>0 6 9 5 1 7 6 4 9 5</th></tr><tr><th class=text-right>Order ID</th><th><strong>{{data.code}}-{{data.invoiceAmount}}</strong></th></tr><tr><th class=text-right>Conference Fees:</th><th><strong>NGN {{ data.invoiceAmount.formatMoney(2) }}</strong></th></tr></table></div></div></div><div class=col-md-6><div class=\"panel panel-default\"><div class=panel-body><div class=\"alert alert-info hidden-print\"><strong>All payments MUST be made to the nearest Access Bank branch</strong></div><div class=\"alert alert-info hidden-print\">Clicking on \"Confirm Registration\" would finalize this registration. An email would be sent to you containing details of this registration and details of how to access conference information</div><img ng-src=assets/images/slip.jpg style=\"max-width: 100%; margin-bottom: 15px\"><br><div class=\"alert alert-info hidden-print no-margin\">Please fill your bank teller using the information on the left side of your screen. <strong>All payments MUST be made to the nearest Access Bank branch</strong>. If you'd be making direct transfer to the Bank Account listed below, please <b class=text-uppercase>include the Order id in your Payment description or Narration</b></div></div></div></div></div></div>"
  );


  $templateCache.put('app/group_pay/group_pay.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-8 col-md-offset-2\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>PAYMENT INVOICE <button type=button class=\"btn btn-danger pull-right btn-xs\" ng-click=back()><i class=\"fa fa-arrow-left\"></i> GO BACK</button></div></div><div class=panel-body><div class=\"alert alert-info\"><p>In order to Pay with your ATM Cards, Kindly ensure your card is registered for One Time Passwords(OTP) for Mastercards and Ipin(VbyV) for Visa cards by your bank.</p><p>Just walk into any of your bank branches and ask to activate OTPs, to enable you complete online transactions (Including on NBA and other websites in Nigeria)</p><p>The OTP and Ipin is for your added safety and security on your payments.</p></div><form method=POST id=upay_form name=upay_form action=https://cipg.accessbankplc.com/MerchantServices/MakePayment.aspx target=_top><table class=\"table table-bordered table-striped\"><tr class=space><td colspan=4></td></tr><tr class=space><td colspan=4></td></tr><tr><th colspan=4 class=\"text-uppercase text-center\"><h4>{{data._group.groupName}}</h4></th></tr><tr><th colspan=2 class=text-right><h4>Members in Group:</h4></th><th colspan=2><h4>{{data.registrations.length}}</h4></th></tr><tr><th colspan=2 class=text-right><h4>Order ID:</h4></th><th colspan=2><h4>{{data.code+'-'+data.invoiceAmount}}</h4></th></tr><tr><th colspan=2 class=text-right><h4>Conference Fees:</h4></th><th colspan=2><h4>NGN {{ data.invoiceAmount.formatMoney(2) }}</h4></th></tr><tr ng-hide=data.responseGotten><th colspan=2 class=text-right>Processing Fees:</th><th colspan=2><strong class=text-danger>To be Calculated</strong></th></tr><tr ng-show=data.responseGotten><th colspan=2 class=text-right>Status:</th><th colspan=2><strong class=text-danger>{{data.Status}}</strong></th></tr><tr ng-show=data.responseGotten><th colspan=2 class=text-right>Response Code:</th><th colspan=2><strong class=text-danger>{{data.ResponseCode}}</strong></th></tr><tr ng-show=data.responseGotten><th colspan=2 class=text-right>Response Desc:</th><th colspan=2><strong class=text-danger>{{data.ResponseDescription}}</strong></th></tr><tr ng-show=data.responseGotten><th colspan=2 class=text-right>Transaction Reference:</th><th colspan=2><strong class=text-danger>{{data.TransactionRef}}</strong></th></tr><tr ng-show=data.responseGotten><th colspan=2 class=text-right>Payment Reference:</th><th colspan=2><strong class=text-danger>{{data.PaymentRef}}</strong></th></tr><tr ng-show=data.responseGotten><th colspan=2 class=text-right>Transaction Date:</th><th colspan=2><strong class=text-danger>{{data.DateTime|date}}</strong></th></tr></table><div class=hidden-print ng-hide=data.responseGotten><button class=\"btn-block btn btn-success\" type=submit><i class=\"fa fa-play\"></i> PROCEED TO PAYMENT</button></div><input type=hidden name=mercId value=09948> <input type=hidden name=currCode value=566> <input type=hidden name=amt value=\"{{ data.invoiceAmount }}\"> <input type=hidden name=orderId value={{data.code}}-{{data.invoiceAmount}}> <input type=hidden name=prod value=\"NBA AGC 2015 Registration for {{data._group.groupName}}\"> <input type=hidden name=email value={{data._group.email}}> <input type=hidden name=submit value=Pay></form></div></div></div></div></div>"
  );


  $templateCache.put('app/home/home.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div>"
  );


  $templateCache.put('app/international/international.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-10 col-md-offset-1\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>INTERNATIONAL ATTENDEES <button class=\"btn btn-danger pull-right text-white btn-xs\" ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button></div></div><div class=panel-body><form method=post name=dataForm><div class=\"alert alert-info\">Fields marked <span class=required>*</span> are required!</div><div class=row><div class=col-md-2><label for=prefix>Prefix <span class=required>*</span></label><input name=prefix id=prefix ng-model=data.prefix class=form-control required autofocus></div><div class=col-md-3><div class=form-group><label for=surname>Surname <span class=required>*</span></label><input class=form-control name=surname id=surname ng-model=data.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middleName>Middle Name</label><input class=form-control name=middleName id=middleName ng-model=data.middleName placeholder=\"Middle Name\"></div></div><div class=col-md-3><div class=form-group><label for=firstName>First Name <span class=required>*</span></label><input class=form-control name=firstName id=firstName ng-model=data.firstName placeholder=\"First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><input name=suffix id=suffix ng-model=data.suffix class=form-control></div></div><div class=row><div class=col-md-4><div class=form-group><label for=country>Country <span class=required>*</span></label><select class=form-control name=country ng-model=data.country id=country required><option ng-repeat=\"c in countries\" value={{c.name.toUpperCase()}}>{{c.name }}</option></select></div></div><div class=\"col-md-5 col-md-offset-3\"><div class=form-group><label>Conference Fee</label><div class=\"form-price label label-primary\">USD 200.00</div></div></div></div><div ng-hide=\"nextForm || (!dataForm.firstName.$dirty && !dataForm.surname.$dirty && !dataForm.prefix.$dirty)\" class=row><hr><div class=\"col-md-6 col-md-offset-3 col-sm-12\"><h4 class=\"text-center text-success\">Below is what your name tag looks like</h4><br><div class=\"panel panel-default\"><div class=\"panel-body name-tag\"><h5 class=text-center ng-bind=data.prefix ng-hide=\"data.prefix.toLowerCase().indexOf('mr')>=0\"></h5><h3 class=text-center>{{data.firstName}} {{data.surname}} <small ng-bind=data.suffix></small></h3></div></div></div></div><div ng-hide=nextForm><button class=\"btn-block btn btn-primary\" ng-click=startReg() ng-disabled=dataForm.$invalid><i class=\"fa fa-play\"></i> NEXT</button></div></form><form method=post name=dataForm2 ng-show=nextForm><div class=form-group><label for=designation>Designation <span class=required>*</span></label><input class=form-control name=designation id=designation ng-model=data.designation placeholder=Designation required></div><div class=form-group><label for=address>Address</label><input class=form-control name=address id=address ng-model=data.address placeholder=Address></div><div class=row><div class=col-md-6><div class=form-group><label for=mobile>Mobile Phone <span class=required>*</span> <small class=text-muted>eg: 08031231234</small></label><input class=form-control type=tel name=mobile id=mobile ng-model=data.mobile placeholder=\"Mobile Phone Number\" ng-minlength=11 ng-maxlength=11 required> <span class=\"help-block label label-danger\" ng-show=\"dataForm2.mobile.$dirty && dataForm2.mobile.$error.required\">Valid phone number is required</span> <span class=\"help-block label label-danger\" ng-show=\"((dataForm2.mobile.$error.minlength || dataForm2.mobile.$error.maxlength) && dataForm.mobile.$dirty) \">Mobile Phone Number should be 11 digits</span></div></div><div class=col-md-6><div class=form-group><label for=phone>Office Telephone Number</label><input class=form-control type=tel name=phone id=phone ng-model=data.phone placeholder=\"Office Phone Number\"></div></div></div><div class=form-group><label for=email>Email Address <span class=required>*</span> <em class=text-danger>Please provide a valid email address.</em></label><input type=email class=form-control name=email id=email ng-model=data.email placeholder=\"Email Address\" required> <span class=\"help-block label label-danger\" ng-show=\"dataForm.email.$error.required || dataForm.email.$error.invalidEmail\">Please provide a valid email address</span></div><hr><div class=row><div class=\"col-sm-6 col-xs-6\" ng-hide=editing><button class=\"btn btn-danger btn-block hidden-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button> <button class=\"btn btn-danger btn-block visible-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL</button></div><div class=\"col-sm-6 col-xs-6\" ng-show=editing><a class=\"btn btn-warning btn-block\" ui-sref=myRegistrations><i class=\"fa fa-edit\"></i> CANCEL EDIT</a></div><div class=\"col-sm-6 col-xs-6\"><button type=submit class=\"btn btn-block btn-success\" ng-click=\"reviewForm(dataForm, dataForm2)\"><i class=\"fa fa-play\"></i> NEXT <i class=\"fa fa-check\"></i></button></div></div></form></div></div></div></div></div>"
  );


  $templateCache.put('app/invoice/invoice.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-sm-8 col-md-offset-2\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>PAYMENT INVOICE</div></div><div class=panel-body><table class=\"table table-bordered table-striped\"><tr class=space><td style=\"width: 25%\"></td><td style=\"width: 25%\"></td><td style=\"width: 25%\"></td><td style=\"width: 25%\"></td></tr><tr><th colspan=4 class=\"text-uppercase text-center\"><h4>{{getName(data)}}</h4></th></tr><tr><th colspan=2><i class=\"fa fa-bullhorn\"></i> {{ data.yearCalled }} - Year of CALL</th><td colspan=2><i class=\"fa fa-building\"></i> {{data.branch}} {{data.state}}</td></tr><tr><td><i class=\"fa fa-phone-square\"></i> {{data.phone}}</td><td><i class=\"fa fa-mobile-phone\"></i> {{data.mobile}}</td><td colspan=2><i class=\"fa fa-envelope-o\"></i> {{data.email}}</td></tr><tr><td colspan=2><i class=\"fa fa-map-marker\"></i> {{data.company}} {{data.court}} {{data.division}}</td><td colspan=2><i class=\"fa fa-map-marker\"></i> {{data.address}}</td></tr><tr><th colspan=2 class=text-right><h4>Order ID:</h4></th><th colspan=2><h4>{{data.regCode}}-{{data.conferenceFee}}</h4></th></tr><tr><th colspan=2 class=text-right><h4>Conference Fees:</h4></th><th colspan=2><h4>{{data.international?'USD':'NGN'}} {{ data.conferenceFee.formatMoney(2) }}</h4></th></tr><tr class=hidden-print><td colspan=4 class=text-center><button type=button class=\"btn btn-danger\" ng-click=back() ng-hide=\"data.webpay || data.bankpay\"><i class=\"fa fa-arrow-left\"></i> GO BACK</button> <button ng-click=payOnline() class=\"btn btn-success\" ng-hide=data.bankpay type=button ng-class=\"{'btn-block': data.webpay}\"><i class=\"fa fa-play\"></i> PAY ONLINE</button> <button ng-click=payBank() class=\"btn btn-primary\" ng-class=\"{'btn-block': data.bankpay}\" ng-hide=\"data.webpay || data.international\" type=button><i class=\"fa fa-anchor\"></i> PAY TO THE BANK</button></td></tr></table></div></div><div class=\"alert alert-info hidden-print\" ng-show=pInfo><h3>Payment Instructions</h3><p>Where does the template get inserted? When a state is activated, its templates are automatically inserted into the ui-view of its parent state's template. If it's a top-level state—which 'contacts' is because it has no parent state–then its parent template is index.html. Right now, the 'contacts' state won't ever be activated. So let's see how we can activate a state. Activating a state</p></div></div></div></div>"
  );


  $templateCache.put('app/judgeForm/judgeForm.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-10 col-md-offset-1\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>HONOURABLE JUDGES <button class=\"btn btn-danger pull-right text-white btn-xs\" ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button></div></div><div class=panel-body><form method=post name=dataForm><div class=\"alert alert-info\">Fields marked <span class=required>*</span> are required!</div><div class=row><div class=col-md-2><div class=form-group><label for=prefix>Prefix <span class=required>*</span></label><input name=prefix id=prefix ng-model=data.prefix class=form-control required autofocus></div></div><div class=col-md-3><div class=form-group><label for=surname>Surname <span class=required>*</span></label><input class=form-control name=surname id=surname ng-model=data.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middleName>Middle Name</label><input class=form-control name=middleName id=middleName ng-model=data.middleName placeholder=\"Middle Name\"></div></div><div class=col-md-3><div class=form-group><label for=firstName>First Name <span class=required>*</span></label><input class=form-control name=firstName id=firstName ng-model=data.firstName placeholder=\"First Name\" required></div></div><div class=col-md-2><div class=form-group><label for=suffix>Suffix</label><input name=suffix id=suffix ng-model=data.suffix class=form-control></div></div></div><div class=row><div class=col-md-3><div class=form-group><label for=yearCalled>Year of Call to Bar <span class=required>*</span></label><select class=form-control name=yearCalled ng-model=data.yearCalled id=yearCalled required><option ng-repeat=\"y in years\">{{y}}</option></select></div></div><div class=\"col-md-6 col-md-offset-3\"><div class=form-group><label>Conference Fee</label><div class=\"form-price label label-primary\">NGN 75,000.00</div></div></div></div><div ng-hide=\"nextForm || (!dataForm.firstName.$dirty && !dataForm.surname.$dirty && !dataForm.prefix.$dirty)\" class=row><hr><div class=\"col-md-6 col-md-offset-3 col-sm-12\"><h4 class=\"text-center text-success\">Below's what your name tag looks like</h4><br><div class=\"panel panel-default\"><div class=\"panel-body name-tag\"><h5 class=text-center ng-bind=data.prefix ng-hide=\"data.prefix.toLowerCase().indexOf('mr')>=0\"></h5><h3 class=text-center>{{data.firstName}} {{data.surname}} <small ng-bind=data.suffix></small></h3></div></div></div></div><div ng-hide=nextForm><button type=submit class=\"btn-block btn-lg btn btn-primary\" ng-click=startReg() ng-disabled=dataForm.$invalid><i class=\"fa fa-play\"></i> CONTINUE</button></div></form><form method=post name=dataForm2 ng-show=nextForm><div class=row><div class=col-sm-4><div class=form-group><label for=court>Court <span class=required>*</span></label><input class=form-control name=court id=court ng-model=data.court placeholder=Court required></div></div><div class=col-sm-4><div class=form-group><label for=state>State <span class=required>*</span></label><input class=form-control name=company id=state ng-model=data.state placeholder=State required></div></div><div class=col-sm-4><div class=form-group><label for=division>Division <span class=required>*</span></label><input class=form-control name=division id=division ng-model=data.division placeholder=Division required></div></div></div><div class=form-group><label for=address>Address</label><input class=form-control name=address id=address ng-model=data.address placeholder=\" Address\"></div><div class=row><div class=col-md-6><div class=form-group><label for=mobile>Mobile Phone <span class=required>*</span> <small class=text-muted>eg: 08031231234</small></label><input class=form-control type=tel name=mobile id=mobile ng-model=data.mobile placeholder=\"Mobile Phone Number\" ng-minlength=11 ng-maxlength=11 required> <span class=\"help-block label label-danger\" ng-show=\"dataForm2.mobile.$dirty && dataForm2.mobile.$error.required\">Valid phone number is required</span> <span class=\"help-block label label-danger\" ng-show=\"((dataForm2.mobile.$error.minlength || dataForm2.mobile.$error.maxlength) && dataForm.mobile.$dirty) \">Mobile Phone Number should be 11 digits</span></div></div><div class=col-md-6><div class=form-group><label for=phone>Office Telephone Number</label><input class=form-control type=tel name=phone id=phone ng-model=data.phone placeholder=\"Office Phone Number\"></div></div></div><div class=form-group><label for=email>Email Address <span class=required>*</span> <em class=text-danger>Please provide a valid email address.</em></label><input type=email class=form-control name=email id=email ng-model=data.email placeholder=\"Email Address\" required> <span class=\"help-block label label-danger\" ng-show=\"dataForm2.email.$dirty && (dataForm2.email.$error.required || dataForm2.email.$error.email)\">Please provide a valid email address</span></div><!--<div class=\"row\">\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"emergency\">Emergency Contact Name</label>\n" +
    "                                    <input class=\"form-control\" type=\"text\" name=\"e_name\" id=\"emergency\"\n" +
    "                                           ng-model=\"data.emergencyContact\"\n" +
    "                                           placeholder=\"Emergency Contact Name\" >\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"e_phone\">Emergency Contact Number</label>\n" +
    "                                    <input class=\"form-control\" type=\"tel\" name=\"e_phone\" id=\"e_phone\"\n" +
    "                                           ng-model=\"data.emergencyPhone\"\n" +
    "                                           placeholder=\"Emergency Contact Number\" >\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>--><hr><div class=row><div class=\"col-sm-6 col-xs-6\" ng-hide=editing><button class=\"btn btn-danger btn-block hidden-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button> <button class=\"btn btn-danger btn-block visible-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL</button></div><div class=\"col-sm-6 col-xs-6\" ng-show=editing><a class=\"btn btn-warning btn-block\" ui-sref=myRegistrations><i class=\"fa fa-edit\"></i> CANCEL EDIT</a></div><div class=\"col-sm-6 col-xs-6\"><button type=submit class=\"btn btn-block btn-success\" ng-click=\"reviewForm(dataForm, dataForm2)\"><i class=\"fa fa-play\"></i> NEXT <i class=\"fa fa-check\"></i></button></div></div></form></div></div></div><!--<div ng-include=\"'components/rightInfo/rightInfo.html'\" class=\"col-sm-4\"></div>--></div></div>"
  );


  $templateCache.put('app/lawyerForm/lawyerForm.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-8 col-md-offset-2\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>ENTER ATTENDEE DATA <button class=\"btn btn-danger pull-right text-white btn-xs\" ng-click=doReset()><i class=\"fa fa-times-circle\"></i> CANCEL REGISTRATION</button></div></div><div class=panel-body><form method=post name=dataForm><div class=\"alert alert-info\">All fields marked <span class=required>*</span> are required!</div><div class=row><div class=col-md-2><div class=form-group><label for=prefix>Prefix <span class=required>*</span></label><input name=prefix id=prefix ng-model=data.prefix class=form-control placeholder=\"Mr, Mrs, Chief, Dr, etc\" required autofocus></div></div><div class=col-md-3><div class=form-group><label for=surname>Surname <span class=required>*</span></label><input class=form-control name=surname id=surname ng-model=data.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middleName>Middle Name</label><input class=form-control name=middleName id=middleName ng-model=data.middleName placeholder=Middle></div></div><div class=col-md-3><div class=form-group><label for=firstName>First Name <span class=required>*</span></label><input class=form-control name=firstName id=firstName ng-model=data.firstName placeholder=\"First Name\" required></div></div><div class=col-md-2><div class=form-group><label for=suffix>Suffix</label><input name=suffix id=suffix ng-model=data.suffix class=form-control placeholder=\"SAN, MNI, MON, CON, GCON, etc.\"></div></div></div><div class=row><div class=col-md-3><div class=form-group><label for=ctb>Year of Call to Bar</label><input readonly class=form-control name=ctb id=ctb ng-model=data.yearCalled placeholder=1989></div></div><div class=\"col-md-5 col-md-offset-4\"><div class=form-group><label>Conference Fee</label><div class=\"form-price label label-primary\">NGN {{data.conferenceFee .formatMoney(2)}}</div></div></div></div><div class=form-group><label for=branch>NBA Branch <span class=required>*</span></label><input class=form-control name=branch id=branch ng-model=data.branch required> <span class=\"help-block label label-danger\" ng-show=\"dataForm.branch.$dirty && dataForm.branch.$error.required\">Please enter your NBA Branch</span></div><div class=form-group><label for=company>Firm / Company / Organization <span class=required>*</span></label><input class=form-control name=company id=company ng-model=data.company placeholder=\"Firm / Company / Organization\" required> <span class=\"help-block label label-danger\" ng-show=\"dataForm.company.$dirty && dataForm.company.$error.required\">Please enter your Firm / Company / Organization</span></div><div class=form-group><label for=address>Address</label><input class=form-control name=address id=address ng-model=data.address placeholder=Address></div><div class=row><div class=col-md-6><div class=form-group><label for=mobile>Mobile Phone <span class=required>*</span> <small class=text-muted>eg: 08031231234</small></label><input class=form-control type=tel name=mobile id=mobile ng-model=data.mobile placeholder=\"Mobile Phone Number\" ng-number=true ng-minlength=11 ng-maxlength=11 required> <span class=\"help-block label label-danger\" ng-show=\"dataForm.mobile.$dirty && dataForm.mobile.$error.required\">Valid phone number is required</span> <span class=\"help-block label label-danger\" ng-show=\"((dataForm.mobile.$error.minlength || dataForm.mobile.$error.maxlength) && dataForm.mobile.$dirty) \">Mobile Phone Number should be 11 digits</span></div></div><div class=col-md-6><div class=form-group><label for=phone>Office Telephone Number</label><input class=form-control type=tel name=phone id=phone ng-model=data.phone placeholder=\"Office Phone Number\"></div></div></div><div class=form-group><label for=email>Email Address <span class=required>*</span> <em class=text-danger>Please provide a valid email address.</em></label><input type=email class=form-control name=email id=email ng-model=data.email placeholder=\"Email Address\" required> <span class=\"help-block label label-danger\" ng-show=\"dataForm.email.$dirty && (dataForm.email.$error.required || dataForm.email.$error.email)\">Please provide a valid email address</span></div><!--<div class=\"row\">\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"emergency\">Emergency Contact Name</label>\n" +
    "                                    <input class=\"form-control\" type=\"text\" name=\"e_name\" id=\"emergency\"\n" +
    "                                           ng-model=\"data.emergencyContact\"\n" +
    "                                           placeholder=\"Emergency Contact Name\" >\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"e_phone\">Emergency Contact Number</label>\n" +
    "                                    <input class=\"form-control\" type=\"tel\" name=\"e_phone\" id=\"e_phone\"\n" +
    "                                           ng-model=\"data.emergencyPhone\"\n" +
    "                                           placeholder=\"Emergency Contact Number\" >\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>--><hr><div class=row><div class=\"col-sm-6 col-xs-6\" ng-hide=editing><button class=\"btn btn-danger btn-block hidden-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button> <button class=\"btn btn-danger btn-block visible-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL</button></div><div class=\"col-sm-6 col-xs-6\" ng-show=editing><a class=\"btn btn-warning btn-block\" ui-sref=myRegistrations><i class=\"fa fa-edit\"></i> CANCEL EDIT</a></div><div class=\"col-sm-6 col-xs-6\"><button type=submit class=\"btn btn-block btn-success\" ng-click=\"reviewForm(dataForm, dataForm2)\"><i class=\"fa fa-play\"></i> NEXT <i class=\"fa fa-check\"></i></button></div></div></form></div></div></div><!--<div ng-include=\"'components/rightInfo/rightInfo.html'\" class=\"col-sm-4\"></div>--></div></div>"
  );


  $templateCache.put('app/legalPractitioner/legalPractitioner.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-10 col-md-offset-1\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>LEGAL PRACTITIONER <a ui-sref=registerAs class=\"btn btn-danger btn-xs pull-right text-white\"><i class=\"fa fa-backward\"></i> Change <span ng-show=!isGroup()>Your</span> Group</a></div></div><div class=panel-body><form method=post name=dataForm ng-submit=\"dataForm.$valid && nextForm()\" ng-hide=showForm2><div class=\"alert alert-success\"><i class=\"glyphicon glyphicon-chevron-down\"></i> Please enter your name as you'll want it to appear on your name tag</div><div class=row><div class=col-md-2><div class=form-group><label for=prefix>Prefix <span class=required>*</span></label><input name=prefix id=prefix ng-model=person.prefix class=form-control placeholder=\"Mr, Mrs, Chief\" required autofocus></div></div><div class=col-md-3><div class=form-group><label for=surname>Surname <span class=required>*</span></label><input class=form-control name=surname id=surname ng-model=person.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middleName>Middle Name</label><input class=form-control name=middleName id=middleName ng-model=person.middleName placeholder=\"Middle Name\"></div></div><div class=col-md-3><div class=form-group><label for=firstName>First Name <span class=required>*</span></label><input class=form-control name=firstName id=firstName ng-model=person.firstName placeholder=\"First Name\" required></div></div><div class=col-md-2><div class=form-group><label for=suffix>Suffix</label><input name=suffix id=suffix ng-model=person.suffix class=form-control placeholder=\"ESQ, MON, GCON\"></div></div></div><div ng-hide=\"showForm2 || (!dataForm.firstName.$dirty && !dataForm.surname.$dirty && !dataForm.prefix.$dirty)\" class=row><hr><div class=\"col-md-6 col-md-offset-3 col-sm-12\"><h4 class=\"text-center text-success\">Below's what your name tag looks like</h4><br><div class=\"panel panel-default\"><div class=\"panel-body name-tag\"><h5 class=text-center ng-bind=person.prefix ng-hide=\"person.prefix.toLowerCase().indexOf('mr')>=0||person.prefix.toLowerCase().indexOf('mis')>=0\"></h5><h3 class=text-center>{{person.firstName}} {{person.surname}} <small ng-bind=person.suffix></small></h3></div></div></div></div><div class=text-center ng-hide=showForm2><button type=submit ng-disabled=dataForm.$invalid class=\"btn btn-block btn-primary\" ng-submit=\"dataForm.$valid && nextForm()\"><i class=\"fa fa-play\"></i> NEXT</button></div></form><form method=post name=dataForm2 ng-show=\"showForm2 && !showTable\" ng-submit=\"dataForm2.$valid && doLookup()\"><div class=\"alert alert-info\"><p class=text-danger><i class=\"glyphicon glyphicon-chevron-down\"></i> <b>First Step Completed!</b>. Now, please enter your 'Last Name' as it appears on your 'Call to Bar' Certificate for validation purposes</p></div><div class=row><div class=col-md-12><div class=form-group><label for=_surname>Surname <span class=required>*</span></label><input class=form-control name=surname id=_surname ng-model=person.nbSurname ng-minlength=3 placeholder=Surname required></div><div class=text-center><button type=submit ng-disabled=dataForm2.$invalid class=\"btn btn-block btn-success\" ng-submit=\"dataForm2.$valid && doLookup()\"><i class=\"fa fa-play\"></i> CONTINUE</button></div></div></div></form><div ng-show=showTable><div class=row><div class=\"col-sm-9 col-xs-9\"><input class=form-control name=surname id=_filter ng-model=nameFilter placeholder=\"Filter the Results ({{members.length}} records found)\"></div><div class=\"col-sm-3 col-xs-3\"><button class=\"btn btn-block btn-warning\" ng-click=\"showTable=!showTable\"><i class=\"fa fa-arrow-left\"></i> Back</button></div></div><hr><div class=\"alert alert-success\">Select your name from the list below. In the event that the list is long, you can filter it by entering your other names or your year of call using the textbox above.</div><table class=\"table table-bordered table-striped table-hover table-responsive hidden-xs\"><hr><tr><!--<th>S/N</th>--><th>Name</th><th>Called to Bar</th><!--<th>Call Number</th>--><th class=col-sm-1></th></tr><tr ng-repeat=\"member in members | filter: nameFilter\"><!--<td>{{$index+1}}.</td>--><td>{{member.name}}</td><td>{{member.yearCalled}}</td><!--<td>{{member.nbaId}}</td>--><td><button class=\"btn btn-xs btn-success\" ng-click=details(member)><i class=\"fa fa-check\"></i> SELECT</button></td></tr></table><div class=visible-xs><div ng-repeat=\"member in members | filter: nameFilter\" class=row><div class=col-xs-12><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title ng-bind=member.name></div></div><div class=panel-body><div class=text-center><span class=pull-left><label class=\"label label-info\">Year Called</label>{{member.yearCalled}}</span> <span class=pull-right>{{member.nbaId}}</span> <button class=\"btn btn-xs btn-success\" ng-click=details(member)><i class=\"fa fa-check\"></i> SELECT</button></div></div></div></div></div></div></div></div></div></div><!--<div ng-include=\"'components/rightInfo/rightInfo.html'\" class=\"col-sm-4\"></div>--></div></div>"
  );


  $templateCache.put('app/login/login.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-md-6 col-md-offset-3\"><div class=\"panel panel-default\"><div class=panel-heading><div class=\"panel-title text-center\"><b>LOGIN</b></div></div><div class=panel-body id=theForm><div class=\"alert alert-info\" ng-hide=error.length>Your Login details would have been sent to your email after you registered!</div><div class=\"alert alert-danger\" ng-show=error.length>{{error}}</div><form ng-submit=\"loginForm.$valid && doLogin()\" name=loginForm><div class=form-group><label for=username>Email Address / Username <span class=required>*</span></label><div class=input-group><input class=form-control placeholder=\"Your Email Address\" ng-model=user.email id=username required> <span class=input-group-addon><i class=\"fa fa-envelope-o\"></i></span></div></div><div class=form-group><label for=password>Password <span class=required>*</span></label><div class=input-group><input class=form-control placeholder=\"Your NBA Conference Password\" ng-model=user.password id=password required> <span class=input-group-addon><i class=\"fa fa-lock\"></i></span></div></div><button class=\"btn btn-block btn-success\" ng-disabled=loginForm.$invalid type=submit><i class=\"fa fa-key\"></i> LOGIN</button><br><div class=text-center><a ui-sref=recoverPassword class=btn-link>forgot your password?</a></div></form></div></div></div></div></div>"
  );


  $templateCache.put('app/magistrateForm/magistrateForm.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-10 col-md-offset-1\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>ATTENDEE DATA - Please provide additional data <button class=\"btn btn-danger pull-right text-white btn-xs\" ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button></div></div><div class=panel-body><form method=post name=dataForm><div class=\"alert alert-info\">Fields marked <span class=required>*</span> are required!</div><div class=row><div class=col-md-2><label for=prefix>Prefix <span class=required>*</span></label><input name=prefix id=prefix ng-model=data.prefix class=form-control required autofocus></div><div class=col-md-3><div class=form-group><label for=surname>Surname <span class=required>*</span></label><input class=form-control name=surname id=surname ng-model=data.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middleName>Middle Name</label><input class=form-control name=middleName id=middleName ng-model=data.middleName placeholder=\"Middle Name\"></div></div><div class=col-md-3><div class=form-group><label for=firstName>First Name <span class=required>*</span></label><input class=form-control name=firstName id=firstName ng-model=data.firstName placeholder=\"First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><input name=suffix id=suffix ng-model=data.suffix class=form-control></div></div><div class=row><div class=col-md-3><div class=form-group><label for=yearCalled>Year of Call to Bar <span class=required>*</span></label><select class=form-control name=yearCalled ng-model=data.yearCalled id=yearCalled required><option ng-repeat=\"y in years\">{{y}}</option></select></div></div><div class=\"col-md-6 col-md-offset-3\"><div class=form-group><label>Conference Fee</label><div class=\"form-price label label-primary\">NGN 50,000.00</div></div></div></div><div ng-hide=\"nextForm  || (!dataForm.firstName.$dirty && !dataForm.surname.$dirty && !dataForm.prefix.$dirty)\" class=row><hr><div class=\"col-md-6 col-md-offset-3 col-sm-12\"><h4 class=\"text-center text-success\">Below's what your name tag looks like</h4><br><div class=\"panel panel-default\"><div class=\"panel-body name-tag\"><h5 class=text-center ng-bind=data.prefix ng-hide=\"data.prefix.toLowerCase().indexOf('mr')>=0\"></h5><h3 class=text-center>{{data.firstName}} {{data.surname}} <small ng-bind=data.suffix></small></h3></div></div></div></div><div ng-hide=nextForm><button class=\"btn-block btn btn-primary\" ng-click=startReg() ng-disabled=dataForm.$invalid><i class=\"fa fa-play\"></i> NEXT</button></div></form><form method=post name=dataForm2 ng-show=nextForm><div class=row><div class=col-sm-4><div class=form-group><label for=court>Court <span class=required>*</span></label><input class=form-control name=court id=court ng-model=data.court placeholder=Court required></div></div><div class=col-sm-4><div class=form-group><label for=state>State <span class=required>*</span></label><input class=form-control name=company id=state ng-model=data.state placeholder=State required></div></div><div class=col-sm-4><div class=form-group><label for=division>Division <span class=required>*</span></label><input class=form-control name=division id=division ng-model=data.division placeholder=Division required></div></div></div><div class=form-group><label for=address>Address</label><input class=form-control name=address id=address ng-model=data.address placeholder=\" Address\"></div><div class=row><div class=col-md-6><div class=form-group><label for=mobile>Mobile Phone <span class=required>*</span> <small class=text-muted>eg: 08031231234</small></label><input class=form-control type=tel name=mobile id=mobile ng-model=data.mobile placeholder=\"Mobile Phone Number\" ng-minlength=11 ng-maxlength=11 required> <span class=\"help-block label label-danger\" ng-show=\"dataForm2.mobile.$dirty && dataForm2.mobile.$error.required\">Valid phone number is required</span> <span class=\"help-block label label-danger\" ng-show=\"((dataForm2.mobile.$error.minlength || dataForm2.mobile.$error.maxlength) && dataForm2.mobile.$dirty) \">Mobile Phone Number should be 11 digits</span></div></div><div class=col-md-6><div class=form-group><label for=phone>Office Telephone Number</label><input class=form-control type=tel name=phone id=phone ng-model=data.phone placeholder=\"Office Phone Number\"></div></div></div><div class=form-group><label for=email>Email Address <span class=required>*</span> <em class=text-danger>Please provide a valid email address.</em></label><input type=email class=form-control name=email id=email ng-model=data.email placeholder=\"Email Address\" required> <span class=\"help-block label label-danger\" ng-show=\"dataForm2.email.$error.required || dataForm2.email.$error.invalidEmail\">Please provide a valid email address</span></div><!--<div class=\"row\">\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"emergency\">Emergency Contact Name</label>\n" +
    "                                    <input class=\"form-control\" type=\"text\" name=\"e_name\" id=\"emergency\"\n" +
    "                                           ng-model=\"data.emergencyContact\"\n" +
    "                                           placeholder=\"Emergency Contact Name\" >\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"e_phone\">Emergency Contact Number</label>\n" +
    "                                    <input class=\"form-control\" type=\"tel\" name=\"e_phone\" id=\"e_phone\"\n" +
    "                                           ng-model=\"data.emergencyPhone\"\n" +
    "                                           placeholder=\"Emergency Contact Number\" >\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>--><hr><div class=row><div class=\"col-sm-6 col-xs-6\" ng-hide=editing><button class=\"btn btn-danger btn-block hidden-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button> <button class=\"btn btn-danger btn-block visible-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL</button></div><div class=\"col-sm-6 col-xs-6\" ng-show=editing><a class=\"btn btn-warning btn-block\" ui-sref=myRegistrations><i class=\"fa fa-edit\"></i> CANCEL EDIT</a></div><div class=\"col-sm-6 col-xs-6\"><button type=submit class=\"btn btn-block btn-success\" ng-click=\"reviewForm(dataForm, dataForm2)\"><i class=\"fa fa-play\"></i> NEXT <i class=\"fa fa-check\"></i></button></div></div></form></div></div></div><!--<div ng-include=\"'components/rightInfo/rightInfo.html'\" class=\"col-sm-4\"></div>--></div></div>"
  );


  $templateCache.put('app/main/main.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-lg-12><!--<div class=\"row\" ng-hide=\"isAuthenticated() && !isGroup()\"><div class=\"col-md-6 col-md-offset-3\"><a class=\"btn btn-primary btn-lg btn-block ng-binding\" ng-click=\"startReg()\">Start Registration <i class=\"fa fa-play\"></i></a></div></div>--><div class=row><div class=col-md-6 ng-class=\"{'col-md-offset-3': noneInProgress()}\" ng-hide=\"isAuthenticated() && !isGroup()\"><a class=\"btn btn-primary btn-lg btn-block\" ng-click=startReg()>{{!noneInProgress()?'Start':'Resume'}} Individual Registration <i class=\"fa fa-play\"></i></a></div><div class=col-md-6 ng-show=\"!isAuthenticated() && !noneInProgress()\"><a class=\"btn btn-info btn-lg btn-block\" ui-sref=register>Group Registration <i class=\"fa fa-play\"></i></a></div></div><br><div class=\"alert alert-info\" ng-hide=isAuthenticated()><p class=text-center>If you've registered before but could not make payment, please <a ui-sref=login class=\"btn btn-success\">SIGN IN HERE</a> using the login details sent to your email the last time you registered.</p></div><div class=row><div class=col-md-7><div class=\"panel panel-default\"><div class=panel-heading><div class=\"panel-title text-center\"><strong>CONFERENCE FEES</strong></div></div><div class=panel-body><table class=\"table table-bordered table-striped table-hover\"><thead><tr><th style=\"vertical-align: middle\" class=text-center>Status</th><th class=text-center>Regular Fee<br><small class=text-danger>June 5th - Aug. 20th</small></th><th class=text-center>Onsite Fee<br><small class=text-danger>Aug. 21st - Aug. 28th</small></th></tr></thead><tbody><tr><td class=text-center>1-5 Years</td><td class=text-center>N 8,000</td><td class=text-center>N 15,000</td></tr><tr><td class=text-center>6-10 Years</td><td class=text-center>N 15,000</td><td class=text-center>N 25,000</td></tr><tr><td class=text-center>11-14 Years</td><td class=text-center>N 20,000</td><td class=text-center>N 40,000</td></tr><tr><td class=text-center>15-20 Years</td><td class=text-center>N 30,000</td><td class=text-center>N 50,000</td></tr><tr><td class=text-center>Above 20 Years</td><td class=text-center>N 50,000</td><td class=text-center>N 80,000</td></tr><tr><td><ul><li>Senior Advocates of Nigeria</li><li>Honourable Attorneys General</li><li>Benchers</li></ul></td><td class=text-center style=\"vertical-align: middle\">N 100,000</td><td class=text-center style=\"vertical-align: middle\">N 120,000</td></tr><tr><td><ul><li>Magistrates</li><li>Other Judicial Officers</li></ul></td><td class=text-center style=\"vertical-align: middle\">N 50,000</td><td class=text-center style=\"vertical-align: middle\">N 50,000</td></tr><tr><td><ul><li>Honourable Justices</li><li>Honourable Judges</li><li>Grand Khadis</li><li>Khadis</li></ul></td><td class=text-center style=\"vertical-align: middle\">N 75,000</td><td class=text-center style=\"vertical-align: middle\">N 75,000</td></tr><tr><td><ul><li>Governors</li><li>Legislators</li><li>Political Appointees</li></ul></td><td class=text-center style=\"vertical-align: middle\">N 250,000</td><td class=text-center style=\"vertical-align: middle\">N 250,000</td></tr></tbody></table></div></div></div><div class=col-md-5 ng-include=\"'components/rightInfo/rightInfo.html'\"></div></div></div></div></div>"
  );


  $templateCache.put('app/myInvoices/myInvoices.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-lg-12><div class=row><div class=col-md-12><div class=\"alert alert-{{status.type}}\" ng-show=status.message.length><button class=\"btn btn-danger btn-xs\" ng-click=\"status.message=''\"><i class=\"fa fa-times-circle\"></i></button> {{status.message}}</div><h4 class=\"text-success text-uppercase\">Paid Invoices</h4><hr><div class=\"alert alert-info\" ng-hide=paidInvoices.length><h5>You do not have any paid Invoices.</h5></div><table class=\"table table-striped table-responsive table-bordered table-hover\" ng-show=paidInvoices.length><tr class=text-uppercase><th class=text-center>S/N</th><th class=text-center>ORDER Id</th><th class=text-center>No. of Members</th><th class=text-center>Date</th><th class=text-center>Payment Channel</th><th class=text-center>Conference Fee</th><th class=text-center>Amount Paid</th><th class=\"col-sm-1\"></tr><tr ng-repeat=\"r in paidInvoices\"><td class=text-center>{{$index+1}}.</td><td class=text-center>{{r.code+'-'+r.invoiceAmount}}</td><td class=text-center>{{r.registrations.length}}</td><td class=text-center>{{r.lastModified | date}}</td><td class=text-center>{{r.webpay?'Web Payment':'Bank Payment'}}</td><td class=text-center>NGN {{r.invoiceAmount.formatMoney(2)}}</td><td class=text-center><span ng-show=r.webpay>NGN {{r.Amount}}</span> <span ng-show=r.bankpay>NGN {{r.bankDeposit}}</span></td><td class=text-center><a ui-sref=\"group_{{r.bankpay?'bankpay':'webpay'}}({invoiceId: r._id})\" class=\"btn btn-xs btn-primary btn-block\"><i class=\"fa fa-eye\"></i> VIEW</a></td></tr><tr><td class=text-right colspan=5 style=\"vertical-align: middle\"></td><td class=text-center><h4>NGN {{getGroupFee(paidInvoices).formatMoney(2)}}</h4></td><td colspan=\"2\"></tr></table><h4 class=\"text-danger text-uppercase\">UnPaid Invoices</h4><hr><div class=\"alert alert-warning\" ng-hide=unpaidInvoices.length><h5>You do not have any unpaid Invoices.</h5></div><table class=\"table table-striped table-responsive table-bordered table-hover\" ng-show=unpaidInvoices.length><tr class=text-uppercase><th class=text-center>S/N</th><th class=text-center>ORDER Id</th><th class=text-center>No. of Members</th><th class=text-center>Date</th><th class=text-center>Payment Channel</th><th class=text-center>Conference Fee</th><th></tr><tr ng-repeat=\"r in unpaidInvoices\"><td class=text-center>{{$index+1}}.</td><td class=text-center>{{r.code+'-'+r.invoiceAmount}}</td><td class=text-center>{{r.registrations.length}}</td><td class=text-center>{{r.lastModified | date}}</td><td class=text-center>{{r.webpay?'Web Payment':'Bank Payment'}}<!--<button class=\"btn btn-xs btn-warning\" ng-show=\"r.webpay\" ng-click=\"updateRecord(r._id)\"><i class=\"fa fa-refresh\"></i> Update Status</button>--></td><td class=text-center>NGN {{r.invoiceAmount.formatMoney(2)}}</td><td class=text-center><a ui-sref=\"group_{{r.bankpay?'bankpay':'webpay'}}({invoiceId: r._id})\" ng-class=\"{'btn-primary':r.bankpay, 'btn-success':r.webpay}\" class=\"btn btn-xs btn-block\"><i class=\"fa fa-eye\"></i> {{r.bankpay?'VIEW':'PAY NOW'}}</a></td></tr><tr><td class=text-right colspan=5 style=\"vertical-align: middle\"></td><td class=text-center><h4>NGN {{getGroupFee(unpaidInvoices).formatMoney(2)}}</h4></td><td></tr></table><h4 class=\"text-danger text-uppercase\">Voided Invoices</h4><hr><div class=\"alert alert-warning\" ng-hide=voidInvoices.length><h5>You do not have any unpaid Invoices.</h5></div><table class=\"table table-bordered table-striped table-responsive table-hover\" ng-show=voidInvoices.length><tr class=text-uppercase><th class=text-center>S/N</th><th class=text-center>ORDER Id</th><th class=text-center>No. of Members</th><th class=text-center>Date</th><th class=text-center>Payment Channel</th><th class=text-center>Conference Fee</th><th class=\"col-sm-1\"></tr><tr ng-repeat=\"r in voidInvoices\"><td class=text-center>{{$index+1}}.</td><td class=text-center>{{r.code+'-'+r.invoiceAmount}}</td><td class=text-center>{{r.registrations.length}}</td><td class=text-center>{{r.lastModified | date}}</td><td class=text-center>{{r.webpay?'Web Payment':'Bank Payment'}}</td><td class=text-center>NGN {{r.invoiceAmount.formatMoney(2)}}</td><td class=text-center><a ui-sref=\"group_{{r.bankpay?'bankpay':'webpay'}}({invoiceId: r._id})\" class=\"btn btn-xs btn-primary btn-block\"><i class=\"fa fa-eye\"></i> VIEW</a></td></tr><tr><td class=text-right colspan=5 style=\"vertical-align: middle\"></td><td class=text-center><h4>NGN {{getGroupFee(voidInvoices).formatMoney(2)}}</h4></td><td></tr></table><hr><div class=\"alert alert-info\" ng-show=\"!unpaidInvoices.length && !paidInvoices.length && !voidInvoices.length\"><h3 class=text-center>You do not have any Invoices(s) yet! <a ng-show=\"$user.accountType=='group'\" ui-sref=registerAs class=\"btn btn-success btn-lg\">Start Registering</a></h3></div></div></div></div></div></div>"
  );


  $templateCache.put('app/myRegistrations/individuals.html',
    "<div ng-hide=isGroup()><div class=row ng-show=showPay><div class=\"col-md-6 col-sm-12\"><panel-header title=\"Your Registration has been CONFIRMED\" class=success></panel-header><div class=\"panel panel-default no-border\"><div class=\"panel-body no-padding\"><div ng-show=selectedReg.webpay><table class=\"table table-bordered table-striped table-condensed no-margin\"><tr><th>Transaction Reference</th><td>{{selectedReg.TransactionRef}}</td></tr><tr><th>Payment Reference</th><td>{{selectedReg.PaymentRef}}</td></tr><tr><th>Order ID</th><td>{{selectedReg.regCode+'-'+selectedReg.conferenceFee}}</td></tr><tr><th>Status</th><td>{{selectedReg.Status}}</td></tr><tr><th>Response Code</th><td>{{selectedReg.ResponseCode}}</td></tr><tr><th>Response Description</th><td>{{selectedReg.ResponseDescription}}</td></tr><tr><th>Transaction Date</th><td>{{selectedReg.DateTime}}</td></tr><tr><th>Conference Fee</th><td>{{selectedReg.international?'USD':'NGN'}} {{selectedReg.conferenceFee}}</td></tr><tr><th>Due at Switch</th><td>{{selectedReg.international?'USD':'NGN'}} {{selectedReg.Amount}}</td></tr></table></div><div ng-show=selectedReg.bankpay><table class=\"table table-bordered table-striped table-condensed no-margin\"><tr><th>Order ID</th><td>{{selectedReg.regCode+'-'+selectedReg.conferenceFee}}</td></tr><tr><th>Payment Date</th><td>{{selectedReg.bankDatePaid}}</td></tr><tr><th>Conference Fee</th><td>NGN {{selectedReg.conferenceFee}}</td></tr><tr><th>Amount Paid</th><td>NGN {{selectedReg.bankDeposit}}</td></tr></table></div></div></div></div><div class=\"col-md-6 col-sm-12\"><panel-header title=\"Here's what your name tag looks like\" class=success></panel-header><div class=\"panel panel-default\"><div class=\"panel-body name-tag\"><h5 class=text-center ng-bind=selectedReg.prefix ng-hide=\"selectedReg.prefix.toLowerCase().indexOf('mr')>=0||selectedReg.prefix.toLowerCase().indexOf('mis')>=0\"></h5><h3 class=text-center>{{selectedReg.firstName}} {{selectedReg.middleName}} {{selectedReg.surname}} <small ng-bind=selectedReg.suffix></small></h3><hr><div ng-show=\"selectedReg.registrationType!='judge'&&selectedReg.registrationType!='magistrate'\"><p class=text-center><strong>{{selectedReg.company}}</strong></p></div><div ng-show=\"selectedReg.registrationType=='judge'||selectedReg.registrationType=='magistrate'\"><p class=text-center><strong>{{selectedReg.court}} {{selectedReg.state}} {{selectedReg.division}}</strong></p></div></div></div></div><!--<div class=\"col-md-6\">\n" +
    "            <panel-header title=\"Choose your bag\" class=\"info\"></panel-header>\n" +
    "\n" +
    "            <div class=\"panel panel-default\">\n" +
    "                <div class=\"panel-body text-center\">\n" +
    "                    <img ng-src=\"{{imageUrl}}\" width=\"50%\" ng-show=\"imageUrl.length\">\n" +
    "                    <div class=\"alert alert-danger\" ng-hide=\"imageUrl.length\">\n" +
    "                        <h5>You have not chosen a bag yet!</h5>\n" +
    "                    </div>\n" +
    "                    <carousel interval=\"3000\" ng-hide=\"imageUrl.length\">\n" +
    "                        <slide ng-repeat=\"slide in slides\" active=\"slide.active\">\n" +
    "                            <img ng-src=\"assets/images/option-{{$index+1}}.jpg\" style=\"max-width:40%\">\n" +
    "                            <div class=\"carousel-caption\">\n" +
    "                                <h4>OPTION {{$index+1}} - <span class=\"label label-success\">{{slide.quantity}} units available</span></h4>\n" +
    "                            </div>\n" +
    "                        </slide>\n" +
    "                    </carousel>\n" +
    "                    <br><br>\n" +
    "                    <button class=\"btn btn-block btn-large btn-success\" ng-click=\"pickBag()\">CLICK HERE TO PICK A\n" +
    "                        BAG</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>--></div><div ng-hide=paidRegistrations.length><h4 class=text-primary>Pending Registration(s)</h4><hr><div class=\"alert alert-info\" ng-hide=pendingRegistrations.length><h5>You do not have any pending registrations yet.</h5></div><table class=\"table table-bordered table-striped table-hover\" id=ui-table ng-show=pendingRegistrations.length><tr class=text-uppercase><th class=text-center>S/N</th><th>Name</th><th class=text-center>Year of Call</th><th class=text-center>Firm / Court / DESIGNATION</th><th class=text-center>Conference Fee</th><th class=text-center>Channel</th><th></tr><tr ng-repeat=\"r in pendingRegistrations\"><td class=text-center>{{$index+1}}.</td><td>{{r.prefix}} {{r.firstName}} {{r.middleName}} {{r.surname}} <small class=text-muted>{{r.suffix}}</small></td><td class=text-center>{{r.yearCalled}}</td><td class=text-center><div ng-show=\"r.registrationType!='judge'&&r.registrationType!='magistrate'\" class=text-center><strong>{{r.company}}</strong></div><div ng-show=\"r.registrationType=='judge'||r.registrationType=='magistrate'\"><strong>{{r.court}} {{r.state}} {{r.division}}</strong></div><div ng-show=r.designation.length><strong>{{r.designation}}</strong></div></td><td class=text-center>{{r.international?'USD':'NGN'}} {{r.conferenceFee.formatMoney(2)}}</td><td class=text-center>{{r.bankpay?'Bank Payment':'Web Payment'}}</td><td class=text-center ng-show=!isGroup()><button ng-show=r.webpay class=\"btn btn-xs btn-warning\" ng-click=\"updateRecord(r._id, true)\"><i class=\"fa fa-refresh\"></i> Pay NOW</button> <button class=\"btn btn-xs btn-success\" ng-click=showBank(r) ng-show=r.bankpay><i class=\"fa fa-info-circle\"></i> Show Invoice</button></td></tr></table><h4 class=text-danger>Failed Registration Payments</h4><hr><div class=\"alert alert-info\" ng-hide=failedRegistrations.length><h5>You do not have any failed registration payments.</h5></div><table class=\"table table-bordered table-striped table-hover\" id=ui-table ng-show=failedRegistrations.length><tr class=text-uppercase><th class=text-center>S/N</th><th>Name</th><th class=text-center>Year of Call</th><th class=text-center>Firm / Court / DESIGNATION</th><th class=text-center>Conference Fee</th><th class=text-center>Channel</th><th></tr><tr ng-repeat=\"r in failedRegistrations\"><td class=text-center>{{$index+1}}.</td><td>{{r.prefix}} {{r.firstName}} {{r.middleName}} {{r.surname}} <small class=text-muted>{{r.suffix}}</small></td><td class=text-center>{{r.yearCalled}}</td><td class=text-center><div ng-show=\"r.registrationType!='judge'&&r.registrationType!='magistrate'\" class=text-center><strong>{{r.company}}</strong></div><div ng-show=\"r.registrationType=='judge'||r.registrationType=='magistrate'\"><strong>{{r.court}} {{r.state}} {{r.division}}</strong></div><div ng-show=r.designation.length><strong>{{r.designation}}</strong></div></td><td class=text-center>{{r.international?'USD':'NGN'}} {{r.conferenceFee.formatMoney(2)}}</td><td class=text-center>{{r.bankpay?'Bank Payment':'Web Payment'}}</td><td class=text-center><button ng-hide=paidRegistrations.length class=\"btn btn-block btn-xs btn-primary\" ng-click=newReg(r)><i class=\"fa fa-refresh\"></i> Retry Payment</button></td></tr></table></div></div>"
  );


  $templateCache.put('app/myRegistrations/myRegistrations.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-lg-12><div class=row><div class=col-md-12><div class=\"alert alert-{{status.type}}\" ng-show=status.message.length><button class=\"btn btn-danger btn-xs pull-right\" ng-click=\"status.message=''\"><i class=\"fa fa-times-circle\"></i></button> {{status.message}}</div><br><div ng-include=\"'app/myRegistrations/individuals.html'\"></div><div ng-show=isGroup()><div ng-show=paidRegistrations.length><h4 class=\"text-success text-uppercase\">Confirmed Registrations</h4><hr><table class=\"table table-striped table-responsive table-bordered table-hover\" ng-show=paidRegistrations.length><tr class=text-uppercase><th class=text-center>S/N</th><th>Name</th><th class=text-center>Year of Call</th><th class=text-center>NBA Branch</th><th class=text-center>Email Address</th><th class=text-center>Conference Fee</th></tr><tr ng-repeat=\"r in paidRegistrations\"><td class=text-center>{{$index+1}}.</td><td>{{r.prefix}} {{r.firstName}} {{r.middleName}} {{r.surname}} <small class=text-muted>{{r.suffix}}</small></td><td class=text-center>{{r.yearCalled}}</td><td class=text-center>{{r.branch}}</td><td class=text-center>{{r.email}}</td><td class=text-center>NGN {{r.conferenceFee.formatMoney(2)}}</td></tr><tr><td class=text-right colspan=5 style=\"vertical-align: middle\"></td><td class=text-center><h4>NGN {{getGroupFee(paidRegistrations).formatMoney(2)}}</h4></td></tr></table></div><h4 ng-show=unpaidRegistrations.length class=\"text-danger text-uppercase\">Registrations yet to be paid for</h4><table class=\"table table-bordered table-striped table-responsive table-hover\" id=ui-table ng-show=unpaidRegistrations.length><tr class=text-uppercase><th class=text-center>S/N</th><th><th>Name</th><th class=text-center>Year of Call</th><th class=text-center>Firm / Court / DESIGNATION</th><th class=text-center>Conference Fee</th><th class=text-center ng-show=!isGroup()>Status</th></tr><tr ng-repeat=\"r in unpaidRegistrations\"><td class=text-center>{{$index+1}}.</td><td class=text-center><a class=\"btn btn-xs btn-warning\" ui-sref=\"{{r.registrationType}}Update({registrationId: r._id})\"><i class=\"fa fa-edit\"></i> Edit</a> <button class=\"btn btn-xs btn-danger\" ng-click=cancelReg(r._id)><i class=\"fa fa-times\"></i> Delete</button></td><td>{{r.prefix}} {{r.firstName}} {{r.middleName}} {{r.surname}} <small class=text-muted>{{r.suffix}}</small></td><td class=text-center>{{r.yearCalled}}</td><td class=text-center><div ng-show=\"r.registrationType!='judge'&&r.registrationType!='magistrate'\" class=text-center><strong>{{r.company}}</strong></div><div ng-show=\"r.registrationType=='judge'||r.registrationType=='magistrate'\"><strong>{{r.court}} {{r.state}} {{r.division}}</strong></div><div ng-show=r.designation.length><strong>{{r.designation}}</strong></div></td><td class=text-center>NGN {{r.conferenceFee.formatMoney(2)}}</td></tr><tr><td class=text-center colspan=2><a ui-sref=registerAs class=\"btn btn-block btn-success\"><i class=\"fa fa-plus\"></i> New Registration</a></td><td class=text-right colspan=3 style=\"vertical-align: middle\"><button class=\"btn btn-success\" ng-click=writeInvoice(unpaidRegistrations)><i class=\"fa fa-money\"></i> GENERATE PAYMENT INVOICE</button></td><td class=text-center><h4>NGN {{getGroupFee(unpaidRegistrations).formatMoney(2)}}</h4></td></tr></table><hr></div><div class=\"alert alert-info\" ng-show=\"isGroup() && !unpaidRegistrations.length && !paidInvoices.length\"><h3 class=text-center>You do not have any Registration(s) yet! <a ui-sref=registerAs class=\"btn btn-success btn-lg\">Start Registering</a></h3></div></div></div></div></div></div>"
  );


  $templateCache.put('app/my_sessions/my_sessions.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=\"container session-container\"><div class=row><div class=col-md-9><h2>MY SESSIONS</h2><div class=row><div class=col-md-12><div class=\"alert alert-success\"><h4>COMING SOON</h4></div></div></div></div><div ng-include=\"'components/sidebar/sidebar.html'\" class=col-md-3></div></div></div><div ng-hide=true class=container><div class=row><div class=col-md-9><div class=row><div class=col-md-6 ng-repeat=\"s in sessions\"><div class=\"panel panel-default\"><div class=panel-body><h4 class=text-ellipsis title={{s.session.title}}>{{s.session.title}}</h4><div class=\"btn-group btn-group-justified\" role=group><div class=btn-group role=group><button class=\"btn btn-primary\">Starts {{formatDate(s.session.start_time, 'fromNow') }}</button></div></div></div><div class=panel-footer><a class=\"btn btn-success btn-block\" ui-sref=\"session_detail({id: s.session._id})\">View Details</a></div></div></div></div></div><div ng-include=\"'components/sidebar/sidebar.html'\" class=col-md-3></div></div></div><div ng-include=\"'components/footer/footer.html'\"></div>"
  );


  $templateCache.put('app/othersForm/othersForm.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-10 col-md-offset-1\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>GOVERNORS, LEGISLATORS &amp; POLITICAL APPOINTEES <button class=\"btn btn-danger pull-right text-white btn-xs\" ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button></div></div><div class=panel-body><form method=post name=dataForm><div class=\"alert alert-info\">Fields marked <span class=required>*</span> are required!</div><div class=row><div class=col-md-2><label for=prefix>Prefix <span class=required>*</span></label><input name=prefix id=prefix ng-model=data.prefix class=form-control required autofocus></div><div class=col-md-3><div class=form-group><label for=surname>Surname <span class=required>*</span></label><input class=form-control name=surname id=surname ng-model=data.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middleName>Middle Name</label><input class=form-control name=middleName id=middleName ng-model=data.middleName placeholder=\"Middle Name\"></div></div><div class=col-md-3><div class=form-group><label for=firstName>First Name <span class=required>*</span></label><input class=form-control name=firstName id=firstName ng-model=data.firstName placeholder=\"First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><input name=suffix id=suffix ng-model=data.suffix class=form-control></div></div><div class=row><div class=col-md-3><div class=form-group><label for=yearCalled>Year of Call to Bar <span class=required>*</span></label><select class=form-control name=yearCalled ng-model=data.yearCalled id=yearCalled required><option ng-repeat=\"y in years\">{{y}}</option></select></div></div><div class=col-md-4><div class=form-group><label for=branch>NBA Branch <span class=required>*</span></label><input class=form-control name=branch id=branch ng-model=data.branch required></div></div><div class=col-md-5><div class=form-group><label>Conference Fee</label><div class=\"form-price label label-primary\">NGN 250,000.00</div></div></div></div><div ng-hide=\"nextForm || (!dataForm.firstName.$dirty && !dataForm.surname.$dirty && !dataForm.prefix.$dirty)\" class=row><hr><div class=\"col-md-6 col-md-offset-3 col-sm-12\"><h4 class=\"text-center text-success\">Below is what your name tag looks like</h4><br><div class=\"panel panel-default\"><div class=\"panel-body name-tag\"><h5 class=text-center ng-bind=data.prefix ng-hide=\"data.prefix.toLowerCase().indexOf('mr')>=0\"></h5><h3 class=text-center>{{data.firstName}} {{data.surname}} <small ng-bind=data.suffix></small></h3></div></div></div></div><div ng-hide=nextForm><button class=\"btn-block btn btn-primary\" ng-click=startReg() ng-disabled=dataForm.$invalid><i class=\"fa fa-play\"></i> NEXT</button></div></form><form method=post name=dataForm2 ng-show=nextForm><div class=form-group><label for=designation>Designation <span class=required>*</span></label><input class=form-control name=designation id=designation ng-model=data.designation placeholder=Designation required></div><div class=form-group><label for=address>Address</label><input class=form-control name=address id=address ng-model=data.address placeholder=Address></div><div class=row><div class=col-md-6><div class=form-group><label for=mobile>Mobile Phone <span class=required>*</span> <small class=text-muted>eg: 08031231234</small></label><input class=form-control type=tel name=mobile id=mobile ng-model=data.mobile placeholder=\"Mobile Phone Number\" ng-minlength=11 ng-maxlength=11 required> <span class=\"help-block label label-danger\" ng-show=\"dataForm2.mobile.$dirty && dataForm2.mobile.$error.required\">Valid phone number is required</span> <span class=\"help-block label label-danger\" ng-show=\"((dataForm2.mobile.$error.minlength || dataForm2.mobile.$error.maxlength) && dataForm.mobile.$dirty) \">Mobile Phone Number should be 11 digits</span></div></div><div class=col-md-6><div class=form-group><label for=phone>Office Telephone Number</label><input class=form-control type=tel name=phone id=phone ng-model=data.phone placeholder=\"Office Phone Number\"></div></div></div><div class=form-group><label for=email>Email Address <span class=required>*</span> <em class=text-danger>Please provide a valid email address.</em></label><input type=email class=form-control name=email id=email ng-model=data.email placeholder=\"Email Address\" required> <span class=\"help-block label label-danger\" ng-show=\"dataForm.email.$error.required || dataForm.email.$error.invalidEmail\">Please provide a valid email address</span></div><hr><div class=row><div class=\"col-sm-6 col-xs-6\" ng-hide=editing><button class=\"btn btn-danger btn-block hidden-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button> <button class=\"btn btn-danger btn-block visible-xs\" type=button ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL</button></div><div class=\"col-sm-6 col-xs-6\" ng-show=editing><a class=\"btn btn-warning btn-block\" ui-sref=myRegistrations><i class=\"fa fa-edit\"></i> CANCEL EDIT</a></div><div class=\"col-sm-6 col-xs-6\"><button type=submit class=\"btn btn-block btn-success\" ng-click=\"reviewForm(dataForm, dataForm2)\"><i class=\"fa fa-play\"></i> NEXT <i class=\"fa fa-check\"></i></button></div></div></form></div></div></div><!--<div ng-include=\"'components/rightInfo/rightInfo.html'\" class=\"col-sm-4\"></div>--></div></div>"
  );


  $templateCache.put('app/panelHeader/panelHeader.html',
    "<div class=\"panel panel-{{class}}\"><div class=panel-heading><div class=\"panel-title text-uppercase text-center\"><b>{{title}}</b></div></div></div>"
  );


  $templateCache.put('app/papers/papers.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=\"container session-container\"><div class=row><div class=col-md-9><h2>CONFERENCE PAPERS</h2><div class=row><div class=col-md-12><div class=\"alert alert-success\"><h4>COMING SOON</h4></div></div></div></div><div ng-include=\"'components/sidebar/sidebar.html'\" class=col-md-3></div></div></div><div ng-include=\"'components/footer/footer.html'\"></div>"
  );


  $templateCache.put('app/profile/profile.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-xs-12><h3>My Profile</h3><hr></div></div><div class=row><div class=col-xs-12><pre ng-bind=\"user | json\"></pre></div></div></div>"
  );


  $templateCache.put('app/recoverPassword/recoverPassword.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-md-6 col-md-offset-3\"><div class=\"panel panel-default\"><div class=panel-heading><div class=\"panel-title text-center\"><b>RECOVER YOUR PASSWORD</b></div></div><div class=panel-body id=#theForm><div class=\"alert alert-info\" ng-hide=\"submitted || error.length\">Please enter the email address you gave during the registration process!</div><div class=\"alert alert-danger\" ng-show=error.length>{{error}}</div><div class=\"alert alert-success\" ng-show=submitted>A password recovery email has been sent to your email. Please check your mail and follow the instructions to reset your password.</div><form ng-submit=\"recForm.$valid && dorecovery(recForm)\" name=recForm><div class=form-group><label for=username>Email Address / Username <span class=required>*</span></label><div class=input-group><input class=form-control placeholder=\"Your Email Address\" ng-model=user.email id=username required> <span class=input-group-addon><i class=\"fa fa-envelope-o\"></i></span></div></div><button class=\"btn btn-block btn-success\" ng-disabled=recForm.$invalid type=submit><i class=\"fa fa-key\"></i> RECOVER PASSWORD</button><br><div class=text-center><a ui-sref=login class=btn-link><i class=\"fa fa-arrow-left\"></i> back to login</a></div></form></div></div></div></div></div>"
  );


  $templateCache.put('app/register/register.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-md-6 col-md-offset-3\"><br><div class=\"panel panel-default\"><div class=panel-heading><div class=\"panel-title text-center\"><b>CREATE ACCOUNT FOR GROUP REGISTRATION</b></div></div><div class=panel-body id=theForm><div class=\"alert alert-danger\" ng-show=error.length>{{error}}</div><div class=\"alert alert-{{status.type}}\" ng-show=status.message.length><button class=\"btn btn-danger btn-xs\" ng-click=\"status.message=''\"><i class=\"fa fa-times-circle\"></i></button> {{status.message}}</div><form ng-submit=\"signUpForm.$valid && doSignUp(signUpForm)\" name=signUpForm><div class=form-group><label for=groupName>Group Name <span class=required>*</span></label><div class=input-group><input class=form-control placeholder=\"Enter the Name of your Group\" ng-model=user.groupName id=groupName name=groupName required> <span class=input-group-addon><i class=\"fa fa-users\"></i></span></div></div><div class=form-group><label for=phone>Phone Number <span class=required>*</span></label><div class=input-group><input class=form-control placeholder=\"Your Phone Number\" ng-model=user.phone id=phone name=phone required> <span class=input-group-addon><i class=\"fa fa-mobile\"></i></span></div></div><div class=form-group><label for=email>Email Address <span class=required>*</span></label><div class=input-group><input type=email class=form-control placeholder=\"Your Email Address\" ng-model=user.email id=email name=email required> <span class=input-group-addon><i class=\"fa fa-envelope-o\"></i></span></div></div><div class=form-group><label for=password>Password <span class=required>*</span></label><div class=input-group><input type=password class=form-control placeholder=\"Your NBA Conference Password\" ng-model=user.password id=password required> <span class=input-group-addon><i class=\"fa fa-lock\"></i></span></div></div><button class=\"btn btn-block btn-success\" ng-disabled=signUpForm.$invalid type=submit><i class=\"fa fa-key\"></i> CREATE ACCOUNT</button></form></div></div></div></div></div>"
  );


  $templateCache.put('app/registerAs/registerAs.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-8 col-md-offset-2\"><panel-header title=\"PLEASE SELECT YOUR CATEGORY\" class=success></panel-header><div class=\"panel panel-default\"><div class=panel-body><ul class=group-list><li><a ui-sref=legalPractitioner>LEGAL PRACTITIONERS</a></li><li><a ui-sref=sanAndBench>SANs, HONOURABLE AGS &amp; BENCHERS</a></li><li><a ui-sref=magistrate>MAGISTRATES &amp; OTHER JUDICIAL OFFICERS</a></li><li><a ui-sref=judge>HONOURABLE JUSTICES, JUDGES, GRAND KHADIS &amp; KHADIS</a></li><li><a ui-sref=others>GOVERNORS, LEGISLATORS &amp; POLITICAL APPOINTEES</a></li><li ng-hide=isGroup()><a ui-sref=international>INTERNATIONAL ATTENDEES</a></li></ul></div></div></div><!--<div class=\"col-md-5\" ng-include=\"'components/rightInfo/rightInfo.html'\"></div>--></div></div>"
  );


  $templateCache.put('app/webpay/cancelled.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-10 col-md-offset-1\"><div class=\"alert alert-info\"><h3>{{message}}</h3></div><div class=\"panel panel-default\"><div class=panel-body><div class=\"alert alert-danger\"><ul class=list-unstyled id=responseList><li><b>Selected Payment Gateway</b> is <b>{{paymentGate}}</b></li><li><b>Payment Status</b> is <b>{{status}}</b></li><li><b>Response Description</b> is <b>{{responseDescription}}</b></li><li>Your <b>Transaction Reference</b> is {{transactionReference}}</li><li>Your <b>Order ID</b> is <b>{{orderID}}</b></li><li>A copy of the <b>particulars</b> for this cancelled payment has been sent to your email <b>{{data.email}}</b></li><li>You can logon to <a href=\"https://cipg.accessbankplc.com/MerchantCustomerView/MerchantCustomerReport.aspx?email={{data.email}}&mercID={{merchantID}}\" target=_blank>Access Epay</a> with this email (<b>{{data .email}}</b>) to view your Payment History</li><li>For WebPay users, an email containing your password has been sent to <b>{{data.email}}</b></li><li>Another Email was sent to <b>{{data.email}}</b> containing your NBA AGC password so you can access this platform in future.</li></ul></div></div></div></div></div></div>"
  );


  $templateCache.put('app/webpay/success.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-10 col-md-offset-1\"><div class=\"alert alert-info\"><h3>{{message}}</h3></div><div class=\"panel panel-default\"><div class=panel-body><ul class=list-unstyled id=responseList><li>Your <b>Transaction Reference</b> is {{transactionReference}}</li><li>Your <b>Payment Reference</b> is {{paymentReference}}</li><li>Your <b>Order ID</b> is {{orderID}}</li><li>Your selected <b>Payment Gateway</b> is {{paymentGate}}</li><li>A copy of the <b>receipt</b> for this payment has been sent to your email {{data.email}}</li><li>You can logon to <a href=\"https://cipg.accessbankplc.com/MerchantCustomerView/MerchantCustomerReport.aspx?email={{data.email}}&mercID={{merchantID}}\" target=_blank>Access Epay</a> with this email (<b>{{data .email}}</b>) to view your Payment History</li><li>For WebPay users, an email containing your password has been sent to <b>{{data.email}}</b></li><li>Another Email was sent to <b>{{data.email}}</b> containing your NBA AGC password so you can access this platform in future.</li></ul></div></div></div></div></div>"
  );


  $templateCache.put('app/webpay/webpay.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-12 col-md-8 col-md-offset-2\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>PAYMENT INVOICE <button type=button class=\"btn btn-danger pull-right btn-xs\" ng-click=back()><i class=\"fa fa-arrow-left\"></i> GO BACK</button></div></div><div class=panel-body><div class=\"alert alert-info\"><p>In order to Pay with your ATM Cards, Kindly ensure your card is registered for One Time Passwords(OTP) for Mastercards and Ipin(VbyV) for Visa cards by your bank.</p><p>Just walk into any of your bank branches and ask to activate OTPs, to enable you complete online transactions (Including on NBA and other websites in Nigeria)</p><p>The OTP and Ipin is for your added safety and security on your payments.</p></div><form method=POST id=upay_form name=upay_form action=https://cipg.accessbankplc.com/MerchantServices/MakePayment.aspx target=_top><table class=\"table table-bordered table-striped\"><tr class=space><td style=\"width: 25%\"></td><td style=\"width: 25%\"></td><td style=\"width: 25%\"></td><td style=\"width: 25%\"></td></tr><tr><th colspan=4 class=\"text-uppercase text-center\"><h4>{{data.prefix}} {{getName(data)}} {{data.suffix}}</h4></th></tr><tr><th colspan=2><i class=\"fa fa-bullhorn\"></i> {{ data.yearCalled }} - Year of CALL</th><td colspan=2><i class=\"fa fa-building\"></i> {{data.branch}} {{data.state}}</td></tr><tr><td><i class=\"fa fa-phone-square\"></i> {{data.phone}}</td><td><i class=\"fa fa-mobile-phone\"></i> {{data.mobile}}</td><td colspan=2><i class=\"fa fa-envelope-o\"></i> {{data.email}}</td></tr><tr><td colspan=2><i class=\"fa fa-map-marker\"></i> {{data.company}} {{data.court}} {{data.division}}</td><td colspan=2><i class=\"fa fa-map-marker\"></i> {{data.address}}</td></tr><tr><th colspan=2 class=text-right>Order ID</th><th colspan=2><strong>{{data.regCode}}-{{data.conferenceFee}}</strong></th></tr><tr><th colspan=2 class=text-right>Conference Fees:</th><th colspan=2><strong>{{data.international?'USD':'NGN'}} {{ data.conferenceFee.formatMoney(2) }}</strong></th></tr><tr><th colspan=2 class=text-right>Processing Fees:</th><th colspan=2><strong class=text-danger>To be Calculated</strong></th></tr></table><div class=row ng-hide=data.completed><div class=\"col-md-8 col-md-offset-2\"><h3 class=\"text-center text-success\">Below's what your name tag looks like</h3><br><div class=\"panel panel-default\"><div class=\"panel-body name-tag\"><h5 class=text-center ng-bind=data.prefix ng-hide=\"data.prefix.toLowerCase().indexOf('mr')>=0\"></h5><h3 class=text-center>{{getName(data)}} <small ng-bind=data.suffix></small></h3><hr><div ng-show=\"data.registrationType!='judge'&&data.registrationType!='magistrate'\"><p class=text-center><strong>{{data.company}}</strong></p></div><div ng-show=\"data.registrationType=='judge'||data.registrationType=='magistrate'\"><p class=text-center><strong>{{data.court}} {{data.state}} {{data.division}}</strong></p></div></div></div></div></div><div class=\"alert alert-info hidden-print\" ng-hide=data.completed>Clicking on <b>\"Confirm Registration\"</b> would finalize this registration. An email would be sent to you containing details of this registration and details of how to access conference information.</div><div class=hidden-print><button ng-hide=data.completed ng-click=markComplete(data) class=\"btn-block btn btn-primary\" type=button><i class=\"fa fa-check\"></i> CONFIRM REGISTRATION</button> <button ng-show=data.completed class=\"btn-block btn btn-success\" type=submit><i class=\"fa fa-play\"></i> PROCEED TO PAYMENT</button></div><input type=hidden name=mercId value=09948> <input type=hidden name=currCode value={{data.international?840:566}}> <input type=hidden name=amt value=\"{{ toPay(data.conferenceFee) }}\"> <input type=hidden name=orderId value={{data.regCode}}-{{data.conferenceFee}}> <input type=hidden name=prod value=\"NBA AGC 2015 Registration for {{getName()}}\"> <input type=hidden name=email value={{data.email}}> <input type=hidden name=submit value=Pay></form></div></div></div></div></div>"
  );


  $templateCache.put('components/footer/footer.html',
    "<footer class=\"footer hidden-print hidden-xs hidden-sm\" ng-controller=FooterCtrl><div class=container><p class=pull-left>For Support, please call <b class=text-success>0816 374 1594</b> or send an email to <b class=text-success>registration@nba-agc.org</b></p><p class=pull-right>&copy; {{theYear}}. POWERED BY <b><a href=http://lawpavilion.com target=_blank>LawPavilion</a></b> - OFFICIAL ICT PARTNER</p></div></footer>"
  );


  $templateCache.put('components/modal/modal.html',
    "<div class=modal-body><panel-header title=\"select a bag type\" class=success></panel-header><div class=row><div class=col-sm-12><div class=bag-selector><div class=single-bag ng-click=selectBag($index) ng-repeat=\"slide in slides\"><img ng-src={{slide.image}}><h4>{{slide.name}} - <span class=\"label label-success\">{{slide.quantity}} Units</span></h4></div></div></div></div><hr><div class=\"alert alert-info\"><p>Click on an image to select a bag!</p></div></div><div class=modal-footer><button class=\"btn btn-danger\" type=button ng-click=cancel()>CLOSE</button></div>"
  );


  $templateCache.put('components/navbar/navbar.html',
    "<div class=\"navbar navbar-default navbar-static-top\" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click=\"isCollapsed = !isCollapsed\"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href=\"/\" class=navbar-brand><img ng-src=assets/images/logo.png> <span ng-hide=confirmedUser>AGC REGISTRATION PORTAL - <small>ABUJA 2015</small></span> <span ng-show=confirmedUser>myNBA</span></a></div><div collapse=isCollapsed class=\"navbar-collapse collapse pull-right\" id=navbar-main><ul class=\"nav navbar-nav\"><!--<li ng-show=\"isAuthenticated()\" ng-class=\"{active: isActive('/')}\">\n" +
    "                <a ui-sref=\"main\">HOME</a>\n" +
    "            </li>--><li ng-show=\"!isAuthenticated() && !noneInProgress()\" ng-class=\"{active: isActive('/register')}\"><a ui-sref=registerAs>START REGISTRATION</a></li><li ng-show=\"!isAuthenticated() && !noneInProgress()\" ng-class=\"{active: isActive('/myaccount')}\"><a ui-sref=login>SIGN IN</a></li><li class=dropdown ng-show=isAuthenticated() ng-class=\"{active: isActive('/register')||isActive('/registrations')||isActive('/my_invoices')}\"><a href=# class=dropdown-toggle data-toggle=dropdown role=button>REGISTRATIONS <span class=caret></span></a><ul class=dropdown-menu><li ng-show=isAuthenticated() ng-class=\"{active: isActive('/registrations')}\"><a ui-sref=myRegistrations>MY REGISTRATIONS</a></li><li ng-show=isGroup() ng-class=\"{active: isActive('/register')}\"><a ui-sref=registerAs>START REGISTRATION</a></li><li ng-show=isGroup() role=separator class=divider></li><li ng-show=isGroup() ng-class=\"{active: isActive('/my_invoices')}\"><a ui-sref=myInvoices>INVOICES</a></li></ul></li><li ng-show=isAuthenticated() ng-class=\"{active: isActive('/my_sessions')}\"><a ui-sref=my_sessions>MY SESSIONS</a></li><li ng-class=\"{active: isActive('/conference_sessions')}\"><a ui-sref=conference_sessions>PROGRAMME</a></li><li ng-class=\"{active: isActive('/conference_speakers')}\"><a ui-sref=conference_speakers>SPEAKERS</a></li><li ng-show=isAuthenticated() ng-class=\"{active: isActive('/papers')}\"><a ui-sref=papers>PAPERS</a></li><li ng-show=isAuthenticated() ng-class=\"{active: isActive('/attendees')}\"><a ui-sref=attendees>ATTENDEES</a></li><li><a class=text-danger>{{cUser.firstName}} {{cUser.surname}}</a></li><li ng-show=isAuthenticated()><button ng-click=logout() class=\"btn btn-danger\" id=logout>LOGOUT</button></li><li ng-show=\"noneInProgress() && !isAuthenticated()\" class=topCancelBtn><button class=\"btn btn-danger\" ng-click=doReset()>CANCEL REGISTRATION</button></li><li ng-show=\"channelChosen() && !isAuthenticated()\" class=topCancelBtn><button class=\"btn btn-success\" ng-click=completeReg()>FINISH REGISTRATION</button></li></ul></div></div></div><header class=\"hero-unit hidden-print\"><img src=assets/images/nba-header.jpg style=\"max-width: 100%\"></header><div style=\"background: #CCC; margin-bottom: 10px\" class=hidden-print><div class=container><div class=row><div class=\"col-md-12 text-center\" style=\"margin-top: 10px; margin-bottom: 10px\"><h4><span class=\"label label-info pull-left acct-name\" ng-show=isGroup()>{{$user.groupName}}</span> <span class=\"label label-info pull-left acct-name\" ng-hide=\"isGroup() || !isAuthenticated()\">{{cUser.surname+' '+cUser.firstName+' '+cUser.suffix}}</span> <span ng-show=!isGroup() class=\"text-uppercase text-ellipsis\">Welcome to the Nigerian Bar Association Annual General Conference Portal</span> <span class=\"label label-success pull-right\" ng-show=isGroup() id=group-login-email>{{$user .email}}</span></h4></div></div></div></div>"
  );


  $templateCache.put('components/rightInfo/rightInfo.html',
    "<div class=\"panel panel-success\" ng-controller=RightInfoCtrl><div class=panel-heading><div class=panel-title>INFORMATION</div></div><div class=panel-body><p class=\"alert alert-info\">Please note that the closing date for Pre-Conference (Regular Price) registration is <b>20th of August 2015.</b></p><!--<p>Conferees who register after the 21st of August, 2015 will be required to pay the corresponding\n" +
    "            Onsite Fee and submit their forms and payment teller onsite at the registration centre in Abuja.\n" +
    "            After the 7th of August, no forms should be submitted or will be received by the NBA Secretariat\n" +
    "            or Branch Offices.</p>\n" +
    "\n" +
    "        <p>For further details and enquiries please call any of the following: <strong>Chinelo Agbala</strong> 08067200353; <strong>Oti Edah</strong>, 08065901348; <strong>Kemi Beatrice Odeniyi</strong> 08068619570;</p>\n" +
    "\n" +
    "        <p class=\"text-danger\">We regret to inform that there will be no refund for cancellations.</p>\n" +
    "\n" +
    "        <p class=\"text-primary\">By submitting this form you accept the terms and conditions of this\n" +
    "            registration.</p>--><ol><li>From the <b>Home Page</b> click <b>Start Registration</b></li><li>Select your <b>Category</b></li><li>Fill Registration Form following the 'On-Screen' instructions</li><li>Select your preferred Payment Option (registration payment MUST be completed within 48 hours from filling the form or your application will be disregarded)<ul><li><strong>Pay Online</strong> – Payment will be processed immediately</li><li><strong>Pay To the Bank</strong> – Payment will be processed subject to confirmation from the issuing bank</li></ul></li><li>Upon successful payment a verification code via email/sms will be sent to you within 48 hours</li><li>A Personal Login Information will be issued you, from which you can preview activities regarding the Conference and also print your Payment Receipt and Participation Slip</li><li>Online registration using the <strong>Pay to the Bank</strong> option <b>closes on 13 August 2015;</b> Online registration using the <b>Pay Online</b> option closes on 20th August 2015.</li><li>Prepare for your trip to Abuja</li></ol></div></div>"
  );


  $templateCache.put('components/sidebar/sidebar.html',
    "<div ng-controller=SidebarCtrl><div class=\"panel panel-default\"><div class=\"panel-body no-padding\"><div class=fb-page data-href=https://www.facebook.com/lawpavilion data-height=500 data-small-header=true data-adapt-container-width=true data-hide-cover=false data-show-facepile=true data-show-posts=true><div class=fb-xfbml-parse-ignore><blockquote cite=https://www.facebook.com/lawpavilion><a href=https://www.facebook.com/lawpavilion>LawPavilion</a></blockquote></div></div></div></div><div class=\"panel panel-default\"><div class=\"panel-body no-padding\"><a class=twitter-timeline href=https://twitter.com/lawpavilion data-widget-id=394777122629091328>Tweets by @lawpavilion</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\"://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);}}(document,\"script\",\"twitter-wjs\");</script></div></div></div>"
  );

}]);

