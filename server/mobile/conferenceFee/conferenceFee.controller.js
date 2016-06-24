/**
 * Created by DrCraig-PC on 27/05/2016.
 */

'use strict';

exports.getFee = function (req,res) {
    var name = req.body.category;
    var feeDue = 0;
    var todayDate = new Date();
    var dateEarly = new Date('2016', '05', '20');// month lapses by 1
    var dateNormal = new Date('2016', '06', '20');// month lapses by 1
    var dateLate = new Date('2016', '07', '09');// month lapses by 1
    if(todayDate >= dateEarly && todayDate < dateNormal) {
        switch (name) {
            case '0':
                feeDue = 8000;
                break;
            case '1':
                feeDue = 15000;
                break;
            case '2':
                feeDue = 20000;
                break;
            case '3':
                feeDue = 30000;
                break;
            case '4':
                feeDue = 50000;
                break;
            case '5':
                feeDue = 100000;
                break;
            case '7':
                feeDue = 75000;
                break;
            case '10':
                feeDue = 4500;
                break;
            case '6':
                feeDue = 50000;
                break;
            case '8':
                feeDue = 250000;
                break;
            case '9':
                feeDue = 50000;
                break;
            case '11':
                feeDue = 500;
                break;
        }
    }
    if(todayDate >= dateNormal && todayDate < dateLate) {
        switch (name) {
            case '0':
                feeDue = 10000;
                break;
            case '1':
                feeDue = 20000;
                break;
            case '2':
                feeDue = 30000;
                break;
            case '3':
                feeDue = 40000;
                break;
            case '4':
                feeDue = 65000;
                break;
            case '5':
                feeDue = 120000;
                break;
            case '7':
                feeDue = 75000;
                break;
            case '10':
                feeDue = 4500;
                break;
            case '6':
                feeDue = 50000;
                break;
            case '8':
                feeDue = 250000;
                break;
            case '9':
                feeDue = 50000;
                break;
            case '11':
                feeDue = 750;
                break;
        }
    }
    if(todayDate >= dateLate) {
        switch (name) {
            case '0':
                feeDue = 15000;
                break;
            case '1':
                feeDue = 25000;
                break;
            case '2':
                feeDue = 40000;
                break;
            case '3':
                feeDue = 50000;
                break;
            case '4':
                feeDue = 80000;
                break;
            case '5':
                feeDue = 150000;
                break;
            case '7':
                feeDue = 75000;
                break;
            case '10':
                feeDue = 4500;
                break;
            case '6':
                feeDue = 50000;
                break;
            case '8':
                feeDue = 250000;
                break;
            case '9':
                feeDue = 50000;
                break;
            case '11':
                feeDue = 1000;
                break;
        }
    }
    if(name == '11')
    {
        feeDue = "USD "+ feeDue.formatMoney(2);
    }
    else {
        feeDue = "NGN "+ feeDue.formatMoney(2);
    }
    return res.status(200).send({statusCode:200,message:'ok',conferenceFee:feeDue})
};
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