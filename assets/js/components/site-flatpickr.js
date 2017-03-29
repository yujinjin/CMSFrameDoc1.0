/**
 * 作者：yujinjin9@126.com 
 * 时间：2016-12-30
 * 描述：flatpickr 日期时间选择器插件
 */
define(["flatpickr"], function () {
    var siteDatetime = {
    	locale: {
    		zh: {
    			weekdays: {
					shorthand: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
					longhand: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
				},
				months: {
					shorthand: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
					longhand: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
				}
    		}
    	},
        defaults: {
            mode: "single", //日期显示模式，"single"，  "multiple"或 "range"
			position: "top", //日期选择器显示的位置
			utc: false, // 日期将会被解析、格式化和显示为UTC格式。
			wrap: false, // 包裹元素。
			weekNumbers: false, // 是否在日历中显示星期数。
			allowInput: true, // 是否允许用户直接在输入框中输入日期。
			clickOpens: true, // 是否在点击输入框时打开日期时间选择界面。如果你想通过手动.open()方法来打开，该选项设置为false。
			time_24hr: true, // 是否以24小时格式来显示时间。
			enableTime: false, // 是否启用时间选择。
			noCalendar: false, // 是否隐藏日历。
			dateFormat: "Y-m-d", // 设置日期显示格式。
			altInput: false, // 是否使用某种用户友好的方式来显示日期时间。
			altInputClass: "flatpickr-input form-control input", // 添加到input上的自定义class类。例如bootstrap用户可能需要添加一个form-control class。
			altFormat: "F j, Y", // altInput的日期格式。例如： June 10, 2016
			defaultDate: null, // 设置一个初始的日期。
			minDate: null, // 用户可以选择的最小日期。
			maxDate: null, // 用户可以选择的最大日期。
			parseDate: null, // 接收一个日期字符串并返回一个日期对象。
			formatDate: null,
			getWeek: function getWeek(givenDate) {
				var date = new Date(givenDate.getTime());
				date.setHours(0, 0, 0, 0);
				date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
				var week1 = new Date(date.getFullYear(), 0, 4);
				return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
			},
			enable: [], // 可以使用的日期
			disable: [], // 被禁用的日期。
			shorthandCurrentMonth: false, // 以简写方式显示月份
			inline: false, // 是否以内联的方式显示日历。
			static: false, // 日期选择器位于包裹容器的位置。
			appendTo: null, // 日期选择器添加到指定的节点
			// 向前箭头图标。
			prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
			// 向后箭头图标。
			nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
			enableSeconds: false, // 在时间选择器中是否可以选择秒。
			hourIncrement: 1, // 小时输入框的步长。
			minuteIncrement: 5, // 分钟输入框的步长。
			defaultHour: 12,
			defaultMinute: 0,
			disableMobile: false, //设置  disableMobile 为true以始终使用非本地选择器。默认情况下，Flatpickr使用本机datetime小部件，除非使用某些选项（例如禁用）。
			locale: "default",
			plugins: [],
			onClose: [], // 每次日历被关闭时都会触发该函数。 function (dateObj, dateStr) {}
			onChange: [], // 每次日期被选择的时候都触发该函数。 function (dateObj, dateStr) {}
			onDayCreate: [],
			onMonthChange: [],
			onOpen: [], // 每次日历被打开时都会触发该函数。 function (dateObj, dateStr) {}
			onParseConfig: [],
			onReady: [], // 当日历准备就绪时触发的功能。 function (dateObj, dateStr) {}
			onValueUpdate: [],
			onYearChange: [],
			onKeyDown: []
        },

        init: function ($selector) {
        	Flatpickr.localize(this.locale.zh);
            if($(".date-flatpickr").length > 0){
            	$(".date-flatpickr").each(function(){
            		new Flatpickr(this, $.extend(true, {}, siteDatetime.defaults, $(this).data()));
            		if($(this).data("enable")){
            			console.info($(this).data("enable"));
            		}
            	});
            }
        }
    }
    siteDatetime.init();
    return function($selector, options){
    	return new Flatpickr($($selector)[0], $.extend(true, {}, siteDatetime.defaults, options||{}));
    };
});