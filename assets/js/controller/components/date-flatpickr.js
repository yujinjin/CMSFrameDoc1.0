/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-27
 * 描述：date flatpickr日期选择
 */
define(["site-flatpickr", "docs"], function (siteFlatpickr) {
	var controller = {
        init: function () {
        	this.bindEvent();
        },
        bindEvent: function() {
        	var _this = this;
        	siteFlatpickr("#enableFltpickr", {enable: ["2017-03-02", "2017-03-02", "2017-03-05", "2017-03-08", "2017-03-09", new Date()]});
        	siteFlatpickr("#disableFltpickr", {disable: ["2017-03-02", "2017-03-02", "2017-03-05", "2017-03-08", "2017-03-09", new Date()]});
        	siteFlatpickr("#rangeFltpickr", {
        		mode: "range",
			    minDate: "today",
			    disable: [
			        function(date) {
			            // disable every multiple of 8
			            return !(date.getDate() % 8);
			        }
			    ]
    		});
        }
    }
	return {
        init: function () {
            controller.init();
        }
    }
});