/**
*
*  Javascript string pad
*  http://www.webtoolkit.info/
*
**/
'use strict';

var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;

module.exports = function (str, len, pad, dir) {
    str = ''+str;
    len = len || 0;
    pad = pad || ' ';
    dir = dir || STR_PAD_RIGHT;

    if (len + 1 >= str.length) {

        switch (dir){

            case STR_PAD_LEFT:
                str = new Array(len + 1 - str.length).join(pad) + str;
            break;

            case STR_PAD_BOTH:
                var padlen = len - str.length;
                var right = Math.ceil((padlen) / 2);
                var left = padlen - right;
                str = new Array(left+1).join(pad) + str + new Array(right+1).join(pad);
            break;

            default:
                str = str + new Array(len + 1 - str.length).join(pad);
            break;
        }
    }
    return str;
};