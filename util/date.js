/**
 * Created by kevin on 2017/7/28.
 */
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

Date.prototype.getInterval = function () {
    return Date.parse(this) / 1000;
};


var minute =  60;
var hour = minute * 60;
var day = hour * 24;
var halfamonth = day * 15;
var month = day * 30;

Date.prototype.dynamicFotmat = function () {
    var result = null;

    var interval = this.getInterval();
    var curretntInterval = new Date().getInterval();
    var diffValue  = curretntInterval - interval;

    if(diffValue < 0){
        //若日期不符则弹出窗口告之
        //alert("结束日期不能小于开始日期！");
        result = '未来时间';
    }
    var monthC =diffValue/month;
    var weekC =diffValue/(7*day);
    var dayC =diffValue/day;
    var hourC =diffValue/hour;
    var minC =diffValue/minute;

    if(monthC>=1){
        result=parseInt(monthC) + "个月前";
    }
    else if(weekC>=1){
        result=parseInt(weekC) + "周前";
    }
    else if(dayC>=1){
        result=parseInt(dayC) +"天前";
    }
    else if(hourC>=1){
        result=parseInt(hourC) +"个小时前";
    }
    else if(minC>=1){
        result=parseInt(minC) +"分钟前";
    }else
        result="刚刚";
    return result;
};