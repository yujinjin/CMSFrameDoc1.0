/**
 * 作者：yujinjin9@126.com
 * 时间：2015-08-04
 * 描述：订单API接口
 */
define(function () {
    return {
    	//查询订单列表
//      "queryOrderList": function(ajaxOptions) {
//      	return app.ajax($.extend({
//	            url: site.config.contextPath + "/assets/js/data/order.json"
//	        }, ajaxOptions));
//      },
		"queryOrderList": site.config.contextPath + "/assets/js/data/order.json",
        
        "form": function(ajaxOptions) {
        	return site.ajax($.extend({
	            url: site.config.contextPath + "/assets/js/data/form.json"
	        }, ajaxOptions));
        }
    }
});