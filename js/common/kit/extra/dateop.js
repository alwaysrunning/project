/**
 * date op.
 */
define(function(require, exports, module) {
    'use strict';
    
    module.exports = {
        formatDate: function(d, s) {
            if (undefined === s) {
                s = '-';
            }
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
            var w = d.getDate();

            if (m < 10) {
                m = '0' + m;
            }
            if (w < 10) {
                w = '0' + w;
            }
            return (y + s + m + s + w);
        },
        getCurrentDate: function () {
            return new Date();
        },
        getPrevNDay: function(n) {
            var startStop = [];
            var today = new Date();
            var yesterday_milliseconds = today.getTime() - 1000*60*60*24*n;

            var yesterday = new Date();
            yesterday.setTime(yesterday_milliseconds);      
            today.setTime(today.getTime() - 1000*60*60*24);      

            startStop.push(this.formatDate(yesterday));
            startStop.push(this.formatDate(today));
            return startStop;   
        },
        getPrevMonth: function() {
            var startStop = [];
            var currentDate = this.getCurrentDate();

            var currentMonth = currentDate.getMonth();
            var currentYear = currentDate.getFullYear();
            var priorMonthFirstDay = this.getPriorMonthFirstDay(currentYear, currentMonth);

            var priorMonthLastDay = new Date(
                priorMonthFirstDay.getFullYear(), 
                priorMonthFirstDay.getMonth(), 
                this.getMonthDays(
                    priorMonthFirstDay.getFullYear(), 
                    priorMonthFirstDay.getMonth()
                )
            );

            startStop.push(this.formatDate(priorMonthFirstDay));
            startStop.push(this.formatDate(priorMonthLastDay));

            return startStop;
        },
        getPriorMonthFirstDay: function (year, month) { 
            if (month == 0) {
                month = 11;   
                year--;  
                return new Date(year, month, 1);
            }
                               
            month--;
            return new Date(year, month, 1);
        },
        getMonthDays: function (year, month) {  
            var relativeDate = new Date(year, month, 1); 
            var relativeMonth = relativeDate.getMonth();
            var relativeYear = relativeDate.getFullYear();

            if (relativeMonth == 11) {
                relativeYear++;
                relativeMonth = 0;
            } else {   
                relativeMonth++;
            }

            var millisecond = 1000 * 60 * 60 * 24;
            var nextMonthDayOne = new Date(relativeYear, relativeMonth, 1);
            return new Date(nextMonthDayOne.getTime() - millisecond).getDate();
        },
        getCurrentMonth: function () { 
            var startStop = []; 
            var currentDate = this.getCurrentDate(); 
            var currentMonth = currentDate.getMonth(); 
            var currentYear = currentDate.getFullYear();
            var firstDay = new Date(currentYear, currentMonth, 1);

            if (currentMonth == 11) {
                currentYear++;
                currentMonth = 0;
            } else {   
                currentMonth++;
            }

            var millisecond = 1000 * 60 * 60 * 24;
            var nextMonthDayOne = new Date(currentYear, currentMonth, 1);
            var lastDay = new Date(nextMonthDayOne.getTime() - millisecond);

            startStop.push(this.formatDate(firstDay));
            startStop.push(this.formatDate(lastDay));

            return startStop;
        },
        getPrevWeek: function () {
            var startStop = [];
            var currentDate = this.getCurrentDate();
            var week = currentDate.getDay();
            var month = currentDate.getDate();

            var millisecond = 1000 * 60 * 60 * 24;
            var minusDay = week != 0 ? week - 1 : 6;
            var currentWeekDayOne = new Date(currentDate.getTime() - (millisecond * minusDay));

            var priorWeekLastDay = new Date(currentWeekDayOne.getTime() - millisecond);
            var priorWeekFirstDay = new Date(priorWeekLastDay.getTime() - (millisecond * 6));
 
            startStop.push(this.formatDate(priorWeekFirstDay));
            startStop.push(this.formatDate(priorWeekLastDay));

            return startStop;
        },
        compare: function(d1, d2) {
            var arr1 = d1.split('-');
            var arr2 = d2.split('-');

            var dt1 = new Date(arr1[0], arr1[1], arr1[2]);
            var dt2 = new Date(arr2[0], arr2[1], arr2[2]);

            var ret = 0;

            if (dt1 > dt2) {
                ret = 1;
            }
            else if(dt1 < dt2){
                ret = -1;
            }

            return ret;
        }
    }
});
