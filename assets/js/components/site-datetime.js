/**
 * 作者：yujinjin9@126.com 
 * 时间：2016-12-30
 * 描述：datetime 组件
 */
define(["moment", "daterangepicker"], function (moment) {
    var siteDatetime = {
        defaults: {
            ranges : {  
                //'最近1小时': [moment().subtract('hours',1), moment()],  
                '昨日': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],  
                '今日': [moment().startOf('day'), moment()],  
                '最近7日': [moment().subtract(6, 'days'), moment()],  
                '最近30日': [moment().subtract(29, 'days'), moment()]  
            },
            locale : {
            	format: 'YYYY-MM-DD',
            	separator: ' to ',
                applyLabel : '确定',  
                cancelLabel : '取消',  
                fromLabel : '起始时间',  
                toLabel : '结束时间',  
                customRangeLabel : '自定义',  
                daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],  
                monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],  
                firstDay : 1  
            },
            showWeekNumbers : false, //是否显示第几周
            dateLimit : {  
                days : 365
            }, //起止时间的最大间隔
            timePicker : false, //是否显示小时和分钟
            timePickerIncrement : 60, //时间的增量，单位为分钟
            timePicker12Hour : false, //是否使用12小时制来显示时间
            timePickerSeconds: false, //时间选择框是否显示秒数
            showISOWeekNumbers: false, //是否显示IOS风格周数
            opens : 'right', //日期选择框的弹出位置
            showDropdowns: false, //在年月份选择框上面显示可以跳到特定月份的选择
            showWeekNumbers: false, //日历的每周前显示周数
            opens: 'right', //(字符串: 'left'/'right'/'center')选择相对日期框的相对位置
            buttonClasses: ['btn btn-default'], // 自定义按钮样式
            applyClass : 'btn-small btn-primary blue', //自定义按钮样式（apply/应用
            cancelClass: 'btn-default', // (字符串) 自定义按钮样式（cancle/取消）
            singleDatePicker: true, // 是否只显示一个时间
            parentEl: "body", // 容器，缺省为body
            autoApply: false, //对于时间选择范围时选好开始时间、结束时间是否自动关闭
            linkedCalendars: true,
            alwaysShowCalendars: false, 
            showCustomRangeLabel: true
        },

        init: function ($selector) {
            if($(".daterange-picker").length > 0){
            	$(".daterange-picker").each(function(){
            		var _options = $.extend(true, {}, siteDatetime.defaults, $(this).data());
            		$(this).daterangepicker(_options, function(start, end, label){
            			console.info(start, end, label);
            		});
            	});
            }
        }
    }
    siteDatetime.init();
    return function($selector, options, callback){
    	$($selector).daterangepicker($.extend(true, {}, siteDatetime.defaults, options || {}), callback);
    };
});