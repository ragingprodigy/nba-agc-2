'use strict';

/* jshint ignore:start */
angular.module('nbaAgc2App')
    .service('FeeCalculator', function () {
       return {
           getFee: function (name) {
               var feeDue = 0;
               var todayDate = moment().format('L');
               var dateEarly = moment('20/06/2016', 'DD/MM/YYYY', true).format('L');
               var dateNormal = moment('23/07/2016', 'DD/MM/YYYY', true).format('L');
               var dateLate = moment('16/08/2016', 'DD/MM/YYYY', true).format('L');

               if(todayDate >= dateEarly && todayDate < dateNormal) {
                   switch (name) {
                       case 'sanAndBench':
                           feeDue = 100000;
                           break;
                       case 'judge':
                           feeDue = 75000;
                           break;
                       case 'law_students':
                           feeDue = 4500;
                           break;
                       case 'magistrate':
                           feeDue = 50000;
                           break;
                       case 'others':
                           feeDue = 250000;
                           break;
                       case 'non_lawyer':
                           feeDue = 50000;
                           break;
                       case 'international':
                           feeDue = 500;
                           break;
                       case 'access_bank_test':
                           feeDue = 100;
                           break;
                   }
               }
               if(todayDate >= dateNormal && todayDate < dateLate) {
                   switch (name) {
                       case 'sanAndBench':
                           feeDue = 120000;
                           break;
                       case 'judge':
                           feeDue = 75000;
                           break;
                       case 'law_students':
                           feeDue = 4500;
                           break;
                       case 'magistrate':
                           feeDue = 50000;
                           break;
                       case 'others':
                           feeDue = 250000;
                           break;
                       case 'non_lawyer':
                           feeDue = 50000;
                           break;
                       case 'international':
                           feeDue = 750;
                           break;
                       case 'access_bank_test':
                           feeDue = 100;
                           break;
                   }
               }

               return feeDue.formatMoney(2);
           }

    };
    });
/* jshint ignore:end */