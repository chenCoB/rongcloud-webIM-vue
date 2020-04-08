import Vue from 'vue';

function addZero(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}

function thanDate(val) {
    // 判断日期是否是昨天
    let oDate = new Date(val);
    let oDay = oDate.getDate();
    let newDate = new Date();
    let currentDay = newDate.getDate();
    return currentDay > oDay ? true : false;
}


Vue.filter('dateFilter', function (val) {
    let now = Date.now();
    let currentDate = now+60*60*1000;
    let difference = currentDate - val;
    let hour = parseInt(difference / 60 / 60 / 1000);
    if(hour <= 1) {
        let  runTime = parseInt(difference) / 1000;
        runTime = runTime % (86400 * 365);
        runTime = runTime % (86400 * 30);
        runTime = runTime % 86400;
        runTime = runTime % 3600;
        let minute = Math.floor(runTime / 60);
        if (minute == 0) {
            return '刚刚';
        }
        return minute + '分钟之前';
    } else if(hour < 24 && !thanDate(val)){
        let  oDate = new Date(val);
        let  oHour = oDate.getHours();
        let  oMin = oDate.getMinutes();
        let  oSen = oDate.getSeconds();
        let  oTime;
        if (addZero(oHour) <= 12) {
            oTime = '上午' + addZero(oHour) +':'+ addZero(oMin) + ':'+ addZero(oSen);
        } else {
            oTime = '下午' + addZero(oHour) +':'+ addZero(oMin) + ':'+ addZero(oSen);
        }
        return oTime;
    } else {
        let  oDate = new Date(val);
        let  oYear = oDate.getFullYear();
        let  oMonth = oDate.getMonth()+1;
        let  oDay = oDate.getDate();
        let  oHour = oDate.getHours();
        let  oMin = oDate.getMinutes();
        let  oSen = oDate.getSeconds();
        let  oTime = oYear +'-'+ addZero(oMonth) +'-'+ addZero(oDay) +' '+ addZero(oHour) +':'+ addZero(oMin) +':'+addZero(oSen);
        return oTime;
    }
});
